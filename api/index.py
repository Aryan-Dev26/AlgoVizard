"""
Vercel serverless function entry point for AlgoVizard
"""
import sys
import os

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

try:
    # Import the Flask app
    from app import app
    
    # This is the WSGI application that Vercel will use
    def handler(request):
        return app(request.environ, request.start_response)
        
except ImportError as e:
    # Fallback minimal Flask app if imports fail
    from flask import Flask, jsonify
    
    app = Flask(__name__)
    
    @app.route('/')
    def home():
        return jsonify({
            'message': 'AlgoVizard API',
            'status': 'running',
            'error': f'Import error: {str(e)}'
        })
    
    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy'})

# Vercel expects the app to be available as 'app'
if __name__ == "__main__":
    app.run(debug=False)