"""
Algorithm Visualizer - Main Flask Application
Author: Aryan Pravin Sahu
"""

from flask import Flask, render_template

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

@app.route('/')
def home():
    """Main landing page"""
    return render_template('index.html')

@app.route('/algorithms')
def algorithms():
    """Algorithm selection page"""
    return render_template('algorithms.html')

if __name__ == '__main__':
    print("Algorithm Visualizer starting...")
    print("Visit: http://localhost:5000")
    app.run(debug=True)