"""
Algorithm Visualizer - Main Flask Application
Author: Aryan Pravin Sahu
"""

import sys
import os
from datetime import datetime
import json

# Add current directory to Python path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, render_template, request, jsonify
from algorithms.sorting.bubble_sort import bubble_sort_steps, get_sample_data
from algorithms.sorting.selection_sort import selection_sort_steps

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

def log_interaction(algorithm, action, additional_data=None):
    """Helper function to log user interactions"""
    interaction = {
        'timestamp': datetime.now().isoformat(),
        'algorithm': algorithm,
        'action': action,
        'user_agent': request.headers.get('User-Agent', 'Unknown'),
        'ip_address': request.remote_addr
    }
    
    if additional_data:
        interaction.update(additional_data)
    
    # Save to simple log file
    os.makedirs('data', exist_ok=True)
    try:
        with open('data/interactions.json', 'a') as f:
            f.write(json.dumps(interaction) + '\n')
    except Exception as e:
        print(f"Error logging interaction: {e}")

@app.route('/')
def home():
    """Main landing page"""
    log_interaction('general', 'home_page_visit')
    return render_template('index.html')

@app.route('/algorithms')
def algorithms():
    """Algorithm selection page"""
    log_interaction('general', 'algorithms_page_visit')
    return render_template('algorithms.html')

@app.route('/algorithms/bubble-sort')
def bubble_sort_page():
    """Bubble sort visualization page"""
    log_interaction('bubble_sort', 'page_view')
    return render_template('bubble-sort.html')

@app.route('/algorithms/selection-sort')
def selection_sort_page():
    """Selection sort visualization page"""
    log_interaction('selection_sort', 'page_view')
    return render_template('selection-sort.html')

@app.route('/api/bubble-sort', methods=['GET', 'POST'])
def bubble_sort_api():
    """API endpoint for bubble sort steps"""
    log_interaction('bubble_sort', 'api_request')
    
    # Handle custom array input
    if request.method == 'POST':
        data = request.get_json()
        if data and 'array' in data:
            custom_array = data['array']
            # Validate array
            if isinstance(custom_array, list) and len(custom_array) <= 10:
                steps = bubble_sort_steps(custom_array)
                log_interaction('bubble_sort', 'custom_array_used', {'array_size': len(custom_array)})
                return jsonify(steps)
    
    # Default sample data
    sample_data = get_sample_data()
    steps = bubble_sort_steps(sample_data)
    return jsonify(steps)

@app.route('/api/selection-sort', methods=['GET', 'POST'])
def selection_sort_api():
    """API endpoint for selection sort steps"""
    log_interaction('selection_sort', 'api_request')
    
    # Handle custom array input
    if request.method == 'POST':
        data = request.get_json()
        if data and 'array' in data:
            custom_array = data['array']
            # Validate array
            if isinstance(custom_array, list) and len(custom_array) <= 10:
                steps = selection_sort_steps(custom_array)
                log_interaction('selection_sort', 'custom_array_used', {'array_size': len(custom_array)})
                return jsonify(steps)
    
    # Default sample data
    sample_data = get_sample_data()
    steps = selection_sort_steps(sample_data)
    return jsonify(steps)

@app.route('/api/analytics')
def analytics_api():
    """Simple analytics endpoint to view interaction data"""
    try:
        interactions = []
        if os.path.exists('data/interactions.json'):
            with open('data/interactions.json', 'r') as f:
                for line in f:
                    if line.strip():
                        interactions.append(json.loads(line))
        
        # Simple analytics
        analytics = {
            'total_interactions': len(interactions),
            'algorithms_accessed': {},
            'recent_activity': interactions[-10:] if interactions else [],
            'custom_arrays_used': len([i for i in interactions if i.get('action') == 'custom_array_used'])
        }
        
        for interaction in interactions:
            algo = interaction.get('algorithm', 'unknown')
            if algo not in analytics['algorithms_accessed']:
                analytics['algorithms_accessed'][algo] = 0
            analytics['algorithms_accessed'][algo] += 1
        
        return jsonify(analytics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found_error(error):
    """Custom 404 error handler"""
    log_interaction('general', '404_error', {'url': request.url})
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Custom 500 error handler"""
    log_interaction('general', '500_error', {'url': request.url})
    return render_template('500.html'), 500

if __name__ == '__main__':
    print("Algorithm Visualizer starting...")
    print("Available algorithms:")
    print("- Bubble Sort: http://localhost:5000/algorithms/bubble-sort")
    print("- Selection Sort: http://localhost:5000/algorithms/selection-sort")
    print("- Analytics: http://localhost:5000/api/analytics")
    print("Main site: http://localhost:5000")
    print("\nNew features:")
    print("- Random array generation")
    print("- Custom array input")
    print("- Sound effects during sorting")
    app.run(debug=True)