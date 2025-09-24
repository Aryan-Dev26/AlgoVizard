"""
AlgoVizard - User Modeling and Clustering System
Analyzes user behavior patterns and creates learner profiles for personalized experiences
"""

import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from collections import defaultdict, Counter
import warnings
warnings.filterwarnings('ignore')

class UserBehaviorModeler:
    """
    Advanced user behavior analysis and clustering system for AlgoVizard
    Creates learner profiles based on interaction patterns
    """
    
    def __init__(self, interactions_file='data/interactions.json'):
        self.interactions_file = interactions_file
        self.scaler = StandardScaler()
        self.kmeans = KMeans(n_clusters=4, random_state=42)
        self.pca = PCA(n_components=2)
        
        # Learner type definitions
        self.learner_types = {
            0: "Visual Explorer",
            1: "Methodical Learner", 
            2: "Quick Experimenter",
            3: "Struggling Learner"
        }
        
        self.user_profiles = {}
        self.behavioral_features = None
        
    def load_interactions(self):
        """Load and parse interaction data from JSON log file"""
        try:
            interactions = []
            with open(self.interactions_file, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    if line:
                        try:
                            interactions.append(json.loads(line))
                        except json.JSONDecodeError as e:
                            print(f"Warning: Skipping invalid JSON on line {line_num}: {e}")
                            continue
            print(f"Loaded {len(interactions)} interactions successfully")
            return interactions
        except FileNotFoundError:
            print(f"Warning: {self.interactions_file} not found. Using empty dataset.")
            return []
        except Exception as e:
            print(f"Error loading interactions: {e}")
            return []
    
    def extract_user_sessions(self, interactions):
        """Group interactions into user sessions based on IP and time gaps"""
        sessions = defaultdict(list)
        
        for interaction in interactions:
            # Use IP address as user identifier (in production, use proper user auth)
            user_id = interaction.get('ip_address', 'anonymous')
            timestamp = datetime.fromisoformat(interaction['timestamp'].replace('Z', '+00:00'))
            
            interaction['parsed_timestamp'] = timestamp
            sessions[user_id].append(interaction)
        
        # Sort interactions by timestamp for each user
        for user_id in sessions:
            sessions[user_id].sort(key=lambda x: x['parsed_timestamp'])
            
        return dict(sessions)
    
    def analyze_user_behavior(self, user_sessions):
        """Extract behavioral features from user sessions"""
        behavioral_data = []
        
        for user_id, interactions in user_sessions.items():
            if len(interactions) < 3:  # Skip users with minimal activity
                continue
                
            features = self._extract_behavioral_features(interactions)
            features['user_id'] = user_id
            behavioral_data.append(features)
        
        return pd.DataFrame(behavioral_data)
    
    def _extract_behavioral_features(self, interactions):
        """Extract comprehensive behavioral features from user interactions"""
        # Time-based features
        session_duration = self._calculate_session_duration(interactions)
        avg_time_between_actions = self._calculate_avg_action_time(interactions)
        
        # Algorithm interaction patterns
        algorithms_used = self._get_algorithms_used(interactions)
        algorithm_switches = self._count_algorithm_switches(interactions)
        
        # Visualization behavior
        visualizations_started = len([i for i in interactions if 'visualization_started' in i.get('action', '')])
        visualizations_completed = len([i for i in interactions if 'visualization_completed' in i.get('action', '')])
        visualizations_stopped = len([i for i in interactions if 'visualization_stopped' in i.get('action', '')])
        
        completion_rate = visualizations_completed / max(visualizations_started, 1)
        interruption_rate = visualizations_stopped / max(visualizations_started, 1)
        
        # Learning persistence
        resets = len([i for i in interactions if 'reset' in i.get('action', '')])
        random_arrays = len([i for i in interactions if 'random_array_generated' in i.get('action', '')])
        custom_arrays = len([i for i in interactions if 'custom_array_used' in i.get('action', '')])
        
        # Theme preferences
        theme_changes = len([i for i in interactions if 'theme_changed' in i.get('action', '')])
        school_theme_usage = len([i for i in interactions if i.get('theme') == 'school'])
        college_theme_usage = len([i for i in interactions if i.get('theme') == 'college'])
        
        # Engagement patterns
        page_views = len([i for i in interactions if 'page_view' in i.get('action', '')])
        api_requests = len([i for i in interactions if 'api_request' in i.get('action', '')])
        total_interactions = len(interactions)
        
        # Learning velocity (actions per minute)
        learning_velocity = total_interactions / max(session_duration, 1) * 60
        
        # Exploration behavior
        exploration_ratio = random_arrays / max(random_arrays + custom_arrays, 1)
        
        return {
            # Time and persistence features
            'session_duration_minutes': session_duration,
            'avg_time_between_actions': avg_time_between_actions,
            'learning_velocity': learning_velocity,
            
            # Algorithm engagement
            'algorithms_explored': len(algorithms_used),
            'algorithm_switches': algorithm_switches,
            'completion_rate': completion_rate,
            'interruption_rate': interruption_rate,
            
            # Learning behavior
            'reset_frequency': resets / max(total_interactions, 1),
            'exploration_ratio': exploration_ratio,
            'custom_array_usage': custom_arrays / max(api_requests, 1),
            
            # UI preferences
            'theme_change_frequency': theme_changes / max(total_interactions, 1),
            'school_theme_preference': school_theme_usage / max(school_theme_usage + college_theme_usage, 1),
            
            # Overall engagement
            'interaction_depth': api_requests / max(page_views, 1),
            'session_intensity': total_interactions / max(page_views, 1)
        }
    
    def _calculate_session_duration(self, interactions):
        """Calculate total session duration in minutes"""
        if len(interactions) < 2:
            return 1
        
        start_time = interactions[0]['parsed_timestamp']
        end_time = interactions[-1]['parsed_timestamp']
        duration = (end_time - start_time).total_seconds() / 60
        
        return max(duration, 1)  # Minimum 1 minute
    
    def _calculate_avg_action_time(self, interactions):
        """Calculate average time between user actions"""
        if len(interactions) < 2:
            return 30  # Default 30 seconds
        
        time_diffs = []
        for i in range(1, len(interactions)):
            diff = (interactions[i]['parsed_timestamp'] - 
                   interactions[i-1]['parsed_timestamp']).total_seconds()
            if diff < 300:  # Ignore gaps > 5 minutes (likely pauses)
                time_diffs.append(diff)
        
        return np.mean(time_diffs) if time_diffs else 30
    
    def _get_algorithms_used(self, interactions):
        """Get unique algorithms the user interacted with"""
        algorithms = set()
        for interaction in interactions:
            algo = interaction.get('algorithm', '')
            if algo and algo != 'general' and algo != 'homepage':
                # Normalize algorithm names
                algo = algo.replace('_sort', '').replace('-sort', '').replace('_', ' ')
                algorithms.add(algo)
        return algorithms
    
    def _count_algorithm_switches(self, interactions):
        """Count how many times user switched between different algorithms"""
        switches = 0
        current_algo = None
        
        for interaction in interactions:
            algo = interaction.get('algorithm', '')
            if algo and algo != 'general' and algo != 'homepage':
                if current_algo and current_algo != algo:
                    switches += 1
                current_algo = algo
        
        return switches
    
    def train_clustering_model(self, behavioral_data):
        """Train K-means clustering model on behavioral features"""
        if len(behavioral_data) < 4:
            print("Insufficient data for clustering. Need at least 4 users.")
            return None
        
        # Select features for clustering
        feature_columns = [
            'session_duration_minutes', 'learning_velocity', 'completion_rate',
            'interruption_rate', 'reset_frequency', 'exploration_ratio',
            'algorithm_switches', 'interaction_depth'
        ]
        
        X = behavioral_data[feature_columns].fillna(0)
        
        # Normalize features
        X_scaled = self.scaler.fit_transform(X)
        
        # Perform clustering
        clusters = self.kmeans.fit_predict(X_scaled)
        behavioral_data['cluster'] = clusters
        
        # Store feature data for prediction
        self.behavioral_features = behavioral_data
        
        return behavioral_data
    
    def predict_learner_type(self, user_interactions):
        """Predict learner type for a new user based on their interactions"""
        if self.behavioral_features is None:
            return "Unknown - Model not trained"
        
        # Extract features for the user
        features = self._extract_behavioral_features(user_interactions)
        
        # Prepare feature vector
        feature_columns = [
            'session_duration_minutes', 'learning_velocity', 'completion_rate',
            'interruption_rate', 'reset_frequency', 'exploration_ratio',
            'algorithm_switches', 'interaction_depth'
        ]
        
        feature_vector = np.array([[features.get(col, 0) for col in feature_columns]])
        feature_vector_scaled = self.scaler.transform(feature_vector)
        
        # Predict cluster
        cluster = self.kmeans.predict(feature_vector_scaled)[0]
        learner_type = self.learner_types.get(cluster, "Unknown")
        
        return learner_type, features
    
    def analyze_cluster_characteristics(self):
        """Analyze and describe characteristics of each learner cluster"""
        if self.behavioral_features is None:
            return {}
        
        cluster_analysis = {}
        
        for cluster_id in range(4):
            cluster_data = self.behavioral_features[
                self.behavioral_features['cluster'] == cluster_id
            ]
            
            if len(cluster_data) == 0:
                continue
            
            characteristics = {
                'count': len(cluster_data),
                'avg_session_duration': cluster_data['session_duration_minutes'].mean(),
                'avg_completion_rate': cluster_data['completion_rate'].mean(),
                'avg_learning_velocity': cluster_data['learning_velocity'].mean(),
                'avg_exploration_ratio': cluster_data['exploration_ratio'].mean(),
                'common_traits': self._identify_cluster_traits(cluster_data)
            }
            
            cluster_analysis[self.learner_types[cluster_id]] = characteristics
        
        return cluster_analysis
    
    def _identify_cluster_traits(self, cluster_data):
        """Identify key traits of a cluster based on feature averages"""
        traits = []
        
        # High completion rate
        if cluster_data['completion_rate'].mean() > 0.7:
            traits.append("High task completion")
        
        # Low interruption rate
        if cluster_data['interruption_rate'].mean() < 0.3:
            traits.append("Low interruption tendency")
        
        # High exploration
        if cluster_data['exploration_ratio'].mean() > 0.6:
            traits.append("Prefers random exploration")
        
        # High learning velocity
        if cluster_data['learning_velocity'].mean() > 10:
            traits.append("Fast-paced learning")
        
        # High algorithm switching
        if cluster_data['algorithm_switches'].mean() > 2:
            traits.append("Explores multiple algorithms")
        
        # Long sessions
        if cluster_data['session_duration_minutes'].mean() > 10:
            traits.append("Extended learning sessions")
        
        return traits
    
    def generate_learning_recommendations(self, learner_type, user_features):
        """Generate personalized learning recommendations based on learner type"""
        recommendations = {
            "Visual Explorer": {
                "optimal_theme": "school",
                "recommended_speed": "medium",
                "learning_path": ["bubble_sort", "selection_sort", "insertion_sort"],
                "tips": [
                    "Take time to observe each step of the algorithm",
                    "Try the chalk theme for better visual engagement",
                    "Experiment with different array sizes"
                ]
            },
            
            "Methodical Learner": {
                "optimal_theme": "college", 
                "recommended_speed": "slow",
                "learning_path": ["bubble_sort", "insertion_sort", "selection_sort"],
                "tips": [
                    "Use slower speeds to understand each comparison",
                    "Try custom arrays to test edge cases",
                    "Focus on understanding the algorithm logic"
                ]
            },
            
            "Quick Experimenter": {
                "optimal_theme": "college",
                "recommended_speed": "fast", 
                "learning_path": ["selection_sort", "bubble_sort", "insertion_sort"],
                "tips": [
                    "Challenge yourself with larger arrays",
                    "Compare algorithm efficiency",
                    "Try to predict sorting outcomes"
                ]
            },
            
            "Struggling Learner": {
                "optimal_theme": "school",
                "recommended_speed": "slow",
                "learning_path": ["bubble_sort", "bubble_sort", "selection_sort"],
                "tips": [
                    "Start with small arrays (3-5 elements)",
                    "Use the slowest speed setting",
                    "Repeat algorithms until comfortable"
                ]
            }
        }
        
        return recommendations.get(learner_type, recommendations["Visual Explorer"])
    
    def save_user_profile(self, user_id, learner_type, features, recommendations):
        """Save user profile for future sessions"""
        profile = {
            'user_id': user_id,
            'learner_type': learner_type,
            'features': features,
            'recommendations': recommendations,
            'created_at': datetime.now().isoformat(),
            'last_updated': datetime.now().isoformat()
        }
        
        self.user_profiles[user_id] = profile
        
        # Save to file
        try:
            with open('data/user_profiles.json', 'w') as f:
                json.dump(self.user_profiles, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving user profile: {e}")
    
    def run_complete_analysis(self):
        """Run complete user modeling pipeline"""
        print("🔍 Loading user interaction data...")
        interactions = self.load_interactions()
        
        if not interactions:
            print("❌ No interaction data found. Please use the application first.")
            return None
        
        print(f"📊 Analyzing {len(interactions)} interactions...")
        user_sessions = self.extract_user_sessions(interactions)
        
        print(f"👥 Found {len(user_sessions)} unique users")
        behavioral_data = self.analyze_user_behavior(user_sessions)
        
        if len(behavioral_data) < 4:
            print("⚠️  Insufficient users for clustering analysis")
            return behavioral_data
        
        print("🤖 Training clustering model...")
        clustered_data = self.train_clustering_model(behavioral_data)
        
        print("📈 Analyzing cluster characteristics...")
        cluster_analysis = self.analyze_cluster_characteristics()
        
        # Generate profiles for each user
        for user_id, user_interactions in user_sessions.items():
            if len(user_interactions) >= 3:
                learner_type, features = self.predict_learner_type(user_interactions)
                recommendations = self.generate_learning_recommendations(learner_type, features)
                self.save_user_profile(user_id, learner_type, features, recommendations)
        
        return {
            'behavioral_data': clustered_data,
            'cluster_analysis': cluster_analysis,
            'user_profiles': self.user_profiles
        }

# Example usage and testing
if __name__ == "__main__":
    # Initialize the user behavior modeler
    modeler = UserBehaviorModeler()
    
    # Run complete analysis
    results = modeler.run_complete_analysis()
    
    if results:
        print("\n" + "="*60)
        print("🎯 USER MODELING RESULTS")
        print("="*60)
        
        # Display cluster analysis
        cluster_analysis = results['cluster_analysis']
        for learner_type, characteristics in cluster_analysis.items():
            print(f"\n📊 {learner_type}:")
            print(f"   Users: {characteristics['count']}")
            print(f"   Avg Session: {characteristics['avg_session_duration']:.1f} minutes")
            print(f"   Completion Rate: {characteristics['avg_completion_rate']:.1%}")
            print(f"   Learning Velocity: {characteristics['avg_learning_velocity']:.1f} actions/min")
            print(f"   Traits: {', '.join(characteristics['common_traits'])}")
        
        # Display user profiles
        print(f"\n👤 Generated {len(results['user_profiles'])} user profiles")
        for user_id, profile in results['user_profiles'].items():
            print(f"   {user_id}: {profile['learner_type']}")
        
        print("\n✅ User modeling analysis complete!")
        print("💾 Profiles saved to data/user_profiles.json")
    else:
        print("\n❌ Unable to complete user modeling analysis")