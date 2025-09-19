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

from flask import Flask, render_template
from algorithms.sorting.bubble_sort import bubble_sort_steps, get_sample_data

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

@app.route('/')
def home():
    """Main landing page"""
    return render_template('index.html')

@app.route('/algorithms')
def algorithms():
    """Algorithm selection page"""
    return render_template('algorithms.html')

@app.route('/algorithms/bubble-sort')
def bubble_sort_page():
    """Bubble sort visualization page"""
    # Simple interaction tracking
    interaction = {
        'timestamp': datetime.now().isoformat(),
        'algorithm': 'bubble_sort',
        'action': 'page_view'
    }
    
    # Save to simple log file
    os.makedirs('data', exist_ok=True)
    try:
        with open('data/interactions.json', 'a') as f:
            f.write(json.dumps(interaction) + '\n')
    except Exception as e:
        print(f"Error logging interaction: {e}")
    
    return render_template('bubble-sort.html')

@app.route('/api/bubble-sort')
def bubble_sort_api():
    """API endpoint for bubble sort steps"""
    sample_data = get_sample_data()
    steps = bubble_sort_steps(sample_data)
    return steps

if __name__ == '__main__':
    print("Algorithm Visualizer starting...")
    print("Visit: http://localhost:5000")
    app.run(debug=True)