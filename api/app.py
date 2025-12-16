"""
Minimal AlgoVizard Flask app for Vercel deployment
"""
from flask import Flask, render_template, jsonify, request
import os
import json
from datetime import datetime

app = Flask(__name__)

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
    return jsonify({
        'message': 'AlgoVizard API - Interactive Algorithm Visualization Platform',
        'status': 'running',
        'algorithms': ['bubble-sort', 'selection-sort', 'insertion-sort'],
        'endpoints': {
            'bubble_sort': '/api/bubble-sort',
            'health': '/health'
        }
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

@app.route('/algorithms')
def algorithms():
    return jsonify({
        'available_algorithms': [
            {
                'name': 'Bubble Sort',
                'endpoint': '/api/bubble-sort',
                'description': 'Simple comparison-based sorting algorithm'
            }
        ]
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'message': 'The requested resource was not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'message': 'Something went wrong'}), 500

if __name__ == '__main__':
    app.run(debug=False)