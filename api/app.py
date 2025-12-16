"""
Full AlgoVizard Flask app for Vercel deployment
"""
from flask import Flask, render_template, jsonify, request
import os
import json
from datetime import datetime

# Configure Flask app with proper template and static folders
template_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'templates')
static_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'static')

app = Flask(__name__, 
           template_folder=template_dir,
           static_folder=static_dir,
           static_url_path='/static')

# Simple bubble sort implementation
def bubble_sort_steps(arr):
    steps = []
    n = len(arr)
    arr_copy = arr.copy()
    
    for i in range(n):
        for j in range(0, n - i - 1):
            steps.append({
                'array': arr_copy.copy(),
                'comparing': [j, j + 1],
                'step': len(steps) + 1,
                'description': f'Comparing {arr_copy[j]} and {arr_copy[j + 1]}'
            })
            
            if arr_copy[j] > arr_copy[j + 1]:
                arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                steps.append({
                    'array': arr_copy.copy(),
                    'swapped': [j, j + 1],
                    'step': len(steps) + 1,
                    'description': f'Swapped {arr_copy[j + 1]} and {arr_copy[j]}'
                })
    
    steps.append({
        'array': arr_copy,
        'completed': True,
        'step': len(steps) + 1,
        'description': 'Sorting completed!'
    })
    
    return {'steps': steps, 'algorithm': 'bubble_sort'}

@app.route('/')
def home():
    """Main landing page"""
    try:
        return render_template('index.html', theme='college')
    except:
        # Fallback if template not found
        return jsonify({
            'message': 'AlgoVizard - Interactive Algorithm Visualization Platform',
            'status': 'running',
            'note': 'Frontend templates not found, API only mode',
            'algorithms': ['bubble-sort'],
            'endpoints': {
                'bubble_sort': '/api/bubble-sort',
                'health': '/health',
                'algorithms': '/algorithms'
            }
        })

@app.route('/algorithms')
def algorithms_page():
    """Algorithm selection page"""
    try:
        return render_template('algorithms.html', theme='college')
    except:
        return jsonify({
            'available_algorithms': [
                {
                    'name': 'Bubble Sort',
                    'endpoint': '/api/bubble-sort',
                    'page': '/algorithms/bubble-sort',
                    'description': 'Simple comparison-based sorting algorithm'
                }
            ]
        })

@app.route('/algorithms/bubble-sort')
def bubble_sort_page():
    """Bubble sort visualization page"""
    try:
        return render_template('bubble-sort.html', theme='college')
    except:
        return jsonify({
            'algorithm': 'Bubble Sort',
            'description': 'Step-by-step bubble sort visualization',
            'api_endpoint': '/api/bubble-sort',
            'note': 'Template not found - use API endpoint for data'
        })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/bubble-sort', methods=['GET', 'POST'])
def bubble_sort_api():
    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'array' in data:
            custom_array = data['array']
            if isinstance(custom_array, list) and len(custom_array) <= 10:
                return jsonify(bubble_sort_steps(custom_array))
    
    # Default sample data
    sample_data = [64, 34, 25, 12, 22, 11, 90]
    return jsonify(bubble_sort_steps(sample_data))

# Remove duplicate /algorithms route since it's defined above

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'message': 'The requested resource was not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'message': 'Something went wrong'}), 500

if __name__ == '__main__':
    app.run(debug=False)