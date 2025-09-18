"""
Algorithm Visualizer - Main Flask Application
Author: Aryan Pravin Sahu
"""

from flask import Flask, render_template

app = Flask(__name__, template_folder='../frontend/templates', static_folder='..frontend/staic')

@app.route('/')
def home():
    """Main Landing Page"""
    return render_template('index.html')

@app.route('/algoritms')
def algorithms():
    """Algorithm selection page"""
    return render_template('algorithm.html')

if __name__ == '__main__':
    print("Algorithm Visualizer Starting...")
    print("Visit: http://localhost:5000")
    app.run(debug=True)

