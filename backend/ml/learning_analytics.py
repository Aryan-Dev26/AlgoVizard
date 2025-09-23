"""
AlgoVizard - Learning Analytics and Progress Tracking System
Analyzes user learning patterns, progress tracking, and knowledge retention
"""

import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import warnings
warnings.filterwarnings('ignore')

class LearningAnalytics:
    """
    Advanced learning analytics system for tracking user progress and learning patterns
    """
    
    def __init__(self, interactions_file='data/interactions.json'):
        self.interactions_file = interactions_file
        self.learning_sessions = {}
        self.progress_metrics = {}
        self.knowledge_retention = {}
        
    def load_interactions(self):
        """Load and parse interaction data"""
        try:
            interactions = []
            with open(self.interactions_file, 'r') as f:
                for line in f:
                    if line.strip():
                        interaction = json.loads(line.strip())
                        interaction['timestamp'] = datetime.fromisoformat(
                            interaction['timestamp'].replace('Z', '+00:00')
                        )
                        interactions.append(interaction)
            return sorted(interactions, key=lambda x: x['timestamp'])
        except FileNotFoundError:
            print(f"Warning: {self.interactions_file} not found.")
            return []
        except Exception as e:
            print(f"Error loading interactions: {e}")
            return []
    
    def extract_learning_sessions(self, interactions):
        """Extract and analyze individual learning sessions"""
        sessions = defaultdict(list)
        
        for interaction in interactions:
            user_id = interaction.get('ip_address', 'anonymous')
            sessions[user_id].append(interaction)
        
        # Process each user's sessions
        for user_id, user_interactions in sessions.items():
            self.learning_sessions[user_id] = self._segment_sessions(user_interactions)
        
        return self.learning_sessions
    
    def _segment_sessions(self, interactions):
        """Segment user interactions into discrete learning sessions"""
        if not interactions:
            return []
        
        sessions = []
        current_session = [interactions[0]]
        
        for i in range(1, len(interactions)):
            time_gap = (interactions[i]['timestamp'] - 
                       interactions[i-1]['timestamp']).total_seconds() / 60
            
            # Start new session if gap > 30 minutes
            if time_gap > 30:
                if len(current_session) > 2:  # Only keep substantial sessions
                    sessions.append(self._analyze_session(current_session))
                current_session = [interactions[i]]
            else:
                current_session.append(interactions[i])
        
        # Add final session
        if len(current_session) > 2:
            sessions.append(self._analyze_session(current_session))
        
        return sessions
    
    def _analyze_session(self, session_interactions):
        """Analyze individual learning session"""
        start_time = session_interactions[0]['timestamp']
        end_time = session_interactions[-1]['timestamp']
        duration = (end_time - start_time).total_seconds() / 60
        
        # Extract session metrics
        algorithms_used = set()
        visualizations_started = 0
        visualizations_completed = 0
        visualizations_stopped = 0
        theme_changes = 0
        resets = 0
        custom_arrays = 0
        
        for interaction in session_interactions:
            action = interaction.get('action', '')
            algorithm = interaction.get('algorithm', '')
            
            if algorithm and algorithm not in ['general', 'homepage']:
                algorithms_used.add(algorithm)
            
            if 'visualization_started' in action:
                visualizations_started += 1
            elif 'visualization_completed' in action:
                visualizations_completed += 1
            elif 'visualization_stopped' in action:
                visualizations_stopped += 1
            elif 'theme_changed' in action:
                theme_changes += 1
            elif 'reset' in action:
                resets += 1
            elif 'custom_array_used' in action:
                custom_arrays += 1
        
        # Calculate learning efficiency metrics
        completion_rate = visualizations_completed / max(visualizations_started, 1)
        engagement_score = len(session_interactions) / max(duration, 1)
        focus_score = 1 - (resets / max(len(session_interactions), 1))
        
        return {
            'start_time': start_time,
            'end_time': end_time,
            'duration_minutes': duration,
            'total_interactions': len(session_interactions),
            'algorithms_explored': len(algorithms_used),
            'algorithms_list': list(algorithms_used),
            'visualizations_started': visualizations_started,
            'visualizations_completed': visualizations_completed,
            'completion_rate': completion_rate,
            'engagement_score': engagement_score,
            'focus_score': focus_score,
            'theme_changes': theme_changes,
            'resets': resets,
            'custom_arrays': custom_arrays,
            'learning_intensity': visualizations_started / max(duration, 1)
        }
    
    def calculate_learning_curve(self, user_id):
        """Calculate learning curve progression for a user"""
        if user_id not in self.learning_sessions:
            return None
        
        sessions = self.learning_sessions[user_id]
        if len(sessions) < 3:
            return None
        
        # Extract progression metrics
        session_numbers = list(range(1, len(sessions) + 1))
        completion_rates = [s['completion_rate'] for s in sessions]
        engagement_scores = [s['engagement_score'] for s in sessions]
        focus_scores = [s['focus_score'] for s in sessions]
        
        # Fit learning curves
        curves = {}
        
        for metric_name, metric_values in [
            ('completion_rate', completion_rates),
            ('engagement', engagement_scores),
            ('focus', focus_scores)
        ]:
            if len(set(metric_values)) > 1:  # Only if there's variation
                model = LinearRegression()
                X = np.array(session_numbers).reshape(-1, 1)
                y = np.array(metric_values)
                
                model.fit(X, y)
                
                curves[metric_name] = {
                    'slope': model.coef_[0],
                    'intercept': model.intercept_,
                    'trend': 'improving' if model.coef_[0] > 0.01 else 
                            'declining' if model.coef_[0] < -0.01 else 'stable',
                    'r_squared': model.score(X, y),
                    'predicted_next': model.predict([[len(sessions) + 1]])[0]
                }
        
        return curves
    
    def analyze_knowledge_retention(self, user_id):
        """Analyze knowledge retention patterns"""
        if user_id not in self.learning_sessions:
            return None
        
        sessions = self.learning_sessions[user_id]
        algorithm_performance = defaultdict(list)
        
        # Track performance per algorithm over time
        for session in sessions:
            for algorithm in session['algorithms_list']:
                algorithm_performance[algorithm].append({
                    'timestamp': session['start_time'],
                    'completion_rate': session['completion_rate'],
                    'focus_score': session['focus_score']
                })
        
        # Calculate retention metrics
        retention_analysis = {}
        
        for algorithm, performances in algorithm_performance.items():
            if len(performances) < 2:
                continue
            
            # Sort by timestamp
            performances.sort(key=lambda x: x['timestamp'])
            
            # Calculate time gaps between sessions
            time_gaps = []
            performance_changes = []
            
            for i in range(1, len(performances)):
                gap_days = (performances[i]['timestamp'] - 
                           performances[i-1]['timestamp']).days
                
                if gap_days > 0:
                    time_gaps.append(gap_days)
                    
                    # Performance change (retention indicator)
                    prev_perf = (performances[i-1]['completion_rate'] + 
                               performances[i-1]['focus_score']) / 2
                    curr_perf = (performances[i]['completion_rate'] + 
                               performances[i]['focus_score']) / 2
                    
                    performance_changes.append(curr_perf - prev_perf)
            
            if time_gaps and performance_changes:
                retention_analysis[algorithm] = {
                    'sessions_count': len(performances),
                    'avg_gap_days': np.mean(time_gaps),
                    'avg_performance_change': np.mean(performance_changes),
                    'retention_strength': 'strong' if np.mean(performance_changes) > 0 else
                                        'weak' if np.mean(performance_changes) < -0.1 else 'moderate',
                    'forgetting_curve': self._estimate_forgetting_curve(time_gaps, performance_changes)
                }
        
        return retention_analysis
    
    def _estimate_forgetting_curve(self, time_gaps, performance_changes):
        """Estimate forgetting curve parameters"""
        if len(time_gaps) < 3:
            return None
        
        try:
            # Simple exponential decay model
            X = np.array(time_gaps).reshape(-1, 1)
            y = np.array(performance_changes)
            
            # Transform for exponential model: log(abs(y) + 1)
            y_transformed = np.log(np.abs(y) + 1) * np.sign(y)
            
            model = LinearRegression()
            model.fit(X, y_transformed)
            
            return {
                'decay_rate': -model.coef_[0] if model.coef_[0] < 0 else 0,
                'half_life_days': np.log(2) / max(abs(model.coef_[0]), 0.001),
                'initial_retention': model.intercept_
            }
        except:
            return None
    
    def identify_learning_patterns(self, user_id):
        """Identify specific learning patterns and habits"""
        if user_id not in self.learning_sessions:
            return None
        
        sessions = self.learning_sessions[user_id]
        
        # Time-based patterns
        session_times = [s['start_time'].hour for s in sessions]
        preferred_hours = Counter(session_times).most_common(3)
        
        # Duration patterns
        durations = [s['duration_minutes'] for s in sessions]
        avg_duration = np.mean(durations)
        duration_consistency = 1 - (np.std(durations) / max(avg_duration, 1))
        
        # Algorithm preferences
        all_algorithms = []
        for session in sessions:
            all_algorithms.extend(session['algorithms_list'])
        
        algorithm_preferences = Counter(all_algorithms).most_common()
        
        # Learning consistency
        gaps_between_sessions = []
        for i in range(1, len(sessions)):
            gap = (sessions[i]['start_time'] - sessions[i-1]['end_time']).days
            gaps_between_sessions.append(gap)
        
        consistency_score = 1 / (1 + np.std(gaps_between_sessions)) if gaps_between_sessions else 0
        
        return {
            'preferred_learning_hours': preferred_hours,
            'avg_session_duration': avg_duration,
            'duration_consistency': duration_consistency,
            'learning_consistency': consistency_score,
            'algorithm_preferences': algorithm_preferences,
            'total_sessions': len(sessions),
            'avg_algorithms_per_session': np.mean([s['algorithms_explored'] for s in sessions]),
            'learning_frequency': len(sessions) / max((sessions[-1]['start_time'] - 
                                                     sessions[0]['start_time']).days, 1)
        }
    
    def predict_optimal_timing(self, user_id):
        """Predict optimal learning timing for maximum effectiveness"""
        patterns = self.identify_learning_patterns(user_id)
        if not patterns:
            return None
        
        # Analyze performance by hour
        sessions = self.learning_sessions[user_id]
        hour_performance = defaultdict(list)
        
        for session in sessions:
            hour = session['start_time'].hour
            performance = (session['completion_rate'] + session['focus_score']) / 2
            hour_performance[hour].append(performance)
        
        # Find optimal hours
        hour_averages = {}
        for hour, performances in hour_performance.items():
            hour_averages[hour] = np.mean(performances)
        
        if hour_averages:
            optimal_hour = max(hour_averages, key=hour_averages.get)
            
            return {
                'optimal_hour': optimal_hour,
                'optimal_performance': hour_averages[optimal_hour],
                'recommended_duration': patterns['avg_session_duration'],
                'recommended_frequency': 'daily' if patterns['learning_frequency'] > 0.8 else
                                       'every_2_days' if patterns['learning_frequency'] > 0.4 else
                                       'weekly'
            }
        
        return None
    
    def generate_progress_report(self, user_id):
        """Generate comprehensive progress report for a user"""
        if user_id not in self.learning_sessions:
            return None
        
        learning_curve = self.calculate_learning_curve(user_id)
        retention = self.analyze_knowledge_retention(user_id)
        patterns = self.identify_learning_patterns(user_id)
        optimal_timing = self.predict_optimal_timing(user_id)
        
        sessions = self.learning_sessions[user_id]
        
        report = {
            'user_id': user_id,
            'analysis_date': datetime.now().isoformat(),
            'summary': {
                'total_sessions': len(sessions),
                'total_learning_time': sum(s['duration_minutes'] for s in sessions),
                'algorithms_mastered': len(set().union(*[s['algorithms_list'] for s in sessions])),
                'avg_completion_rate': np.mean([s['completion_rate'] for s in sessions]),
                'overall_progress_trend': self._determine_overall_trend(learning_curve)
            },
            'learning_curve': learning_curve,
            'knowledge_retention': retention,
            'learning_patterns': patterns,
            'optimal_timing': optimal_timing,
            'recommendations': self._generate_recommendations(learning_curve, retention, patterns)
        }
        
        return report
    
    def _determine_overall_trend(self, learning_curve):
        """Determine overall learning trend"""
        if not learning_curve:
            return 'insufficient_data'
        
        improving_metrics = 0
        total_metrics = 0
        
        for metric, data in learning_curve.items():
            total_metrics += 1
            if data['trend'] == 'improving':
                improving_metrics += 1
        
        if improving_metrics / total_metrics > 0.6:
            return 'improving'
        elif improving_metrics / total_metrics < 0.3:
            return 'declining'
        else:
            return 'stable'
    
    def _generate_recommendations(self, learning_curve, retention, patterns):
        """Generate personalized learning recommendations"""
        recommendations = []
        
        # Learning curve recommendations
        if learning_curve:
            if learning_curve.get('completion_rate', {}).get('trend') == 'declining':
                recommendations.append("Consider taking shorter breaks between sessions to maintain focus")
            
            if learning_curve.get('engagement', {}).get('trend') == 'declining':
                recommendations.append("Try exploring new algorithms to maintain engagement")
        
        # Retention recommendations
        if retention:
            weak_algorithms = [algo for algo, data in retention.items() 
                             if data['retention_strength'] == 'weak']
            if weak_algorithms:
                recommendations.append(f"Revisit these algorithms: {', '.join(weak_algorithms)}")
        
        # Pattern-based recommendations
        if patterns:
            if patterns['duration_consistency'] < 0.5:
                recommendations.append("Try to maintain consistent session durations for better learning")
            
            if patterns['learning_consistency'] < 0.5:
                recommendations.append("More regular practice sessions would improve retention")
        
        return recommendations
    
    def run_analytics_pipeline(self):
        """Run complete learning analytics pipeline"""
        print("Loading interaction data...")
        interactions = self.load_interactions()
        
        if not interactions:
            print("No interaction data found.")
            return None
        
        print("Extracting learning sessions...")
        self.extract_learning_sessions(interactions)
        
        print(f"Analyzing {len(self.learning_sessions)} users...")
        
        results = {}
        for user_id in self.learning_sessions:
            if len(self.learning_sessions[user_id]) >= 2:
                results[user_id] = self.generate_progress_report(user_id)
        
        # Save results
        try:
            with open('data/learning_analytics.json', 'w') as f:
                json.dump(results, f, indent=2, default=str)
            print(f"Analytics saved for {len(results)} users")
        except Exception as e:
            print(f"Error saving analytics: {e}")
        
        return results

# Example usage
if __name__ == "__main__":
    analytics = LearningAnalytics()
    results = analytics.run_analytics_pipeline()
    
    if results:
        print("\n" + "="*60)
        print("LEARNING ANALYTICS RESULTS")
        print("="*60)
        
        for user_id, report in results.items():
            print(f"\nUser: {user_id}")
            summary = report['summary']
            print(f"  Sessions: {summary['total_sessions']}")
            print(f"  Learning Time: {summary['total_learning_time']:.1f} minutes")
            print(f"  Completion Rate: {summary['avg_completion_rate']:.1%}")
            print(f"  Progress Trend: {summary['overall_progress_trend']}")
            
            if report['recommendations']:
                print("  Recommendations:")
                for rec in report['recommendations']:
                    print(f"    - {rec}")
        
        print("\nAnalytics complete!")