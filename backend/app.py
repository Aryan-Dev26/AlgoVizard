"""
AlgoVizard - Main Flask Application
Author: Aryan Pravin Sahu
Updated: 2025-11-19
"""

import sys
import os
from datetime import datetime
import json
import logging

# Flask imports
from flask import Flask, render_template, request, jsonify, has_request_context

# Ensure current directory is in path for relative imports (optional)
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Resolve template and static folder paths relative to this file (more robust than relative ../)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)  # Go up one level from backend to project root
TEMPLATES_DIR = os.path.normpath(os.path.join(PROJECT_ROOT, 'frontend', 'templates'))
STATIC_DIR = os.path.normpath(os.path.join(PROJECT_ROOT, 'frontend', 'static'))

app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("algovizard")

# Import algorithm step functions (make sure these modules exist in your repo)
from algorithms.sorting.bubble_sort import bubble_sort_steps, get_sample_data
from algorithms.sorting.selection_sort import selection_sort_steps
from algorithms.sorting.insertion_sort import insertion_sort_steps
from algorithms.sorting.merge_sort import merge_sort_steps
from algorithms.sorting.quick_sort import quick_sort_steps
from algorithms.searching.binary_search import binary_search_steps, linear_search_steps, get_sample_data as get_search_data, get_sample_target
from algorithms.trees.binary_search_tree import BinarySearchTree, get_sample_data as get_bst_data, get_sample_search_target
from algorithms.graphs.graph_traversal import create_sample_graph, get_sample_start_vertex
from algorithms.data_structures.stack_queue import StackOperations, QueueOperations, get_sample_stack_operations, get_sample_queue_operations


def safe_request_info():
    """Return request info only when there is a request context (prevents errors when called outside requests)."""
    if has_request_context():
        return {
            'user_agent': request.headers.get('User-Agent', 'Unknown'),
            'ip_address': request.remote_addr,
            'url': request.url
        }
    else:
        return {
            'user_agent': 'no-request-context',
            'ip_address': None,
            'url': None
        }


def log_interaction(algorithm, action, additional_data=None):
    """Helper function to log user interactions safely (works even if no request context)."""
    base_info = safe_request_info()

    interaction = {
        'timestamp': datetime.now().isoformat(),
        'algorithm': algorithm,
        'action': action,
        'user_agent': base_info.get('user_agent'),
        'ip_address': base_info.get('ip_address'),
        'url': base_info.get('url'),
    }

    if additional_data:
        interaction.update(additional_data)

    # Save to simple log file
    log_dir = os.path.join(BASE_DIR, 'data')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, 'interactions.json')
    try:
        with open(log_file, 'a') as f:
            f.write(json.dumps(interaction) + '\n')
    except Exception as e:
        # Don't crash the app for logging errors — log to stdout/stderr instead
        logger.exception("Error logging interaction: %s", e)


def get_user_theme():
    """Get user's preferred theme from cookie or header (server-side fallback)."""
    if has_request_context():
        theme = request.cookies.get('algorithmVisualizerTheme')
        if not theme:
            theme = request.headers.get('X-Theme-Preference')
    else:
        theme = None

    return theme if theme in ['college', 'school'] else 'college'


@app.route('/')
def home():
    """Main landing page"""
    theme = get_user_theme()
    log_interaction('general', 'home_page_visit')
    return render_template('index.html', theme=theme)


@app.route('/algorithms')
def algorithms():
    """Algorithm selection page"""
    theme = get_user_theme()
    log_interaction('general', 'algorithms_page_visit')
    return render_template('algorithms.html', theme=theme)


@app.route('/algorithms/bubble-sort')
def bubble_sort_page():
    theme = get_user_theme()
    log_interaction('bubble_sort', 'page_view')
    return render_template('bubble-sort.html', theme=theme)


@app.route('/algorithms/selection-sort')
def selection_sort_page():
    theme = get_user_theme()
    log_interaction('selection_sort', 'page_view')
    return render_template('selection-sort.html', theme=theme)


@app.route('/algorithms/insertion-sort')
def insertion_sort_page():
    theme = get_user_theme()
    log_interaction('insertion_sort', 'page_view')
    return render_template('insertion-sort.html', theme=theme)


@app.route('/algorithms/merge-sort')
def merge_sort_page():
    theme = get_user_theme()
    log_interaction('merge_sort', 'page_view')
    return render_template('merge-sort.html', theme=theme)


@app.route('/algorithm-comparison')
def algorithm_comparison_page():
    theme = get_user_theme()
    log_interaction('algorithm_comparison', 'page_view')
    return render_template('algorithm-comparison.html', theme=theme)


@app.route('/quiz-mode')
def quiz_mode_page():
    theme = get_user_theme()
    log_interaction('quiz_mode', 'page_view')
    return render_template('quiz-mode.html', theme=theme)


@app.route('/dashboard')
def dashboard_page():
    theme = get_user_theme()
    log_interaction('dashboard', 'page_view')
    return render_template('dashboard.html', theme=theme)


# New Algorithm Routes
@app.route('/algorithms/quick-sort')
def quick_sort_page():
    theme = get_user_theme()
    log_interaction('quick_sort', 'page_view')
    return render_template('quick-sort.html', theme=theme)


@app.route('/algorithms/binary-search')
def binary_search_page():
    theme = get_user_theme()
    log_interaction('binary_search', 'page_view')
    return render_template('binary-search.html', theme=theme)


@app.route('/algorithms/linear-search')
def linear_search_page():
    theme = get_user_theme()
    log_interaction('linear_search', 'page_view')
    return render_template('linear-search.html', theme=theme)


@app.route('/algorithms/binary-search-tree')
def binary_search_tree_page():
    theme = get_user_theme()
    log_interaction('binary_search_tree', 'page_view')
    return render_template('binary-search-tree.html', theme=theme)


@app.route('/algorithms/graph-dfs')
def graph_dfs_page():
    theme = get_user_theme()
    log_interaction('graph_dfs', 'page_view')
    return render_template('graph-dfs.html', theme=theme)


@app.route('/algorithms/graph-bfs')
def graph_bfs_page():
    theme = get_user_theme()
    log_interaction('graph_bfs', 'page_view')
    return render_template('graph-bfs.html', theme=theme)


@app.route('/algorithms/stack-operations')
def stack_operations_page():
    theme = get_user_theme()
    log_interaction('stack_operations', 'page_view')
    return render_template('stack-operations.html', theme=theme)


@app.route('/algorithms/queue-operations')
def queue_operations_page():
    theme = get_user_theme()
    log_interaction('queue_operations', 'page_view')
    return render_template('queue-operations.html', theme=theme)


@app.route('/api/bubble-sort', methods=['GET', 'POST'])
def bubble_sort_api():
    log_interaction('bubble_sort', 'api_request')

    # Handle custom array input
    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'array' in data:
            custom_array = data['array']
            if isinstance(custom_array, list) and len(custom_array) <= 10:
                steps = bubble_sort_steps(custom_array)
                log_interaction('bubble_sort', 'custom_array_used', {'array_size': len(custom_array)})
                return jsonify(steps)

    sample_data = get_sample_data()
    steps = bubble_sort_steps(sample_data)
    return jsonify(steps)


@app.route('/api/selection-sort', methods=['GET', 'POST'])
def selection_sort_api():
    log_interaction('selection_sort', 'api_request')

    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'array' in data:
            custom_array = data['array']
            if isinstance(custom_array, list) and len(custom_array) <= 10:
                steps = selection_sort_steps(custom_array)
                log_interaction('selection_sort', 'custom_array_used', {'array_size': len(custom_array)})
                return jsonify(steps)

    sample_data = get_sample_data()
    steps = selection_sort_steps(sample_data)
    return jsonify(steps)


@app.route('/api/insertion-sort', methods=['GET', 'POST'])
def insertion_sort_api():
    log_interaction('insertion_sort', 'api_request')

    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'array' in data:
            custom_array = data['array']
            if isinstance(custom_array, list) and len(custom_array) <= 10:
                steps = insertion_sort_steps(custom_array)
                log_interaction('insertion_sort', 'custom_array_used', {'array_size': len(custom_array)})
                return jsonify(steps)

    sample_data = get_sample_data()
    steps = insertion_sort_steps(sample_data)
    return jsonify(steps)


@app.route('/api/merge-sort', methods=['GET', 'POST'])
def merge_sort_api():
    log_interaction('merge_sort', 'api_request')

    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'array' in data:
            custom_array = data['array']
            if isinstance(custom_array, list) and len(custom_array) <= 10:
                steps = merge_sort_steps(custom_array)
                log_interaction('merge_sort', 'custom_array_used', {'array_size': len(custom_array)})
                return jsonify(steps)

    sample_data = get_sample_data()
    steps = merge_sort_steps(sample_data)
    return jsonify(steps)


@app.route('/api/quick-sort', methods=['GET', 'POST'])
def quick_sort_api():
    log_interaction('quick_sort', 'api_request')

    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'array' in data:
            custom_array = data['array']
            if isinstance(custom_array, list) and len(custom_array) <= 10:
                steps = quick_sort_steps(custom_array)
                log_interaction('quick_sort', 'custom_array_used', {'array_size': len(custom_array)})
                return jsonify(steps)

    sample_data = get_sample_data()
    steps = quick_sort_steps(sample_data)
    return jsonify(steps)


@app.route('/api/binary-search', methods=['GET', 'POST'])
def binary_search_api():
    log_interaction('binary_search', 'api_request')

    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'array' in data and 'target' in data:
            custom_array = data['array']
            target = data['target']
            if isinstance(custom_array, list) and len(custom_array) <= 15:
                steps = binary_search_steps(sorted(custom_array), target)
                log_interaction('binary_search', 'custom_search_used', {'array_size': len(custom_array), 'target': target})
                return jsonify(steps)

    sample_data = get_search_data()
    target = get_sample_target()
    steps = binary_search_steps(sample_data, target)
    return jsonify(steps)


@app.route('/api/linear-search', methods=['GET', 'POST'])
def linear_search_api():
    log_interaction('linear_search', 'api_request')

    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'array' in data and 'target' in data:
            custom_array = data['array']
            target = data['target']
            if isinstance(custom_array, list) and len(custom_array) <= 15:
                steps = linear_search_steps(custom_array, target)
                log_interaction('linear_search', 'custom_search_used', {'array_size': len(custom_array), 'target': target})
                return jsonify(steps)

    sample_data = [64, 34, 25, 12, 22, 11, 90]  # Unsorted for linear search
    target = 25
    steps = linear_search_steps(sample_data, target)
    return jsonify(steps)


@app.route('/api/binary-search-tree', methods=['GET', 'POST'])
def binary_search_tree_api():
    log_interaction('binary_search_tree', 'api_request')

    operation = request.args.get('operation', 'insert')
    
    if operation == 'insert':
        if request.method == 'POST':
            data = request.get_json(silent=True)
            if data and 'values' in data:
                values = data['values']
                if isinstance(values, list) and len(values) <= 10:
                    bst = BinarySearchTree()
                    steps = bst.insert_steps(values)
                    log_interaction('binary_search_tree', 'custom_insert_used', {'values_count': len(values)})
                    return jsonify(steps)

        bst = BinarySearchTree()
        sample_values = get_bst_data()
        steps = bst.insert_steps(sample_values)
        return jsonify(steps)
    
    elif operation == 'search':
        bst = BinarySearchTree()
        bst.insert_steps(get_bst_data())  # Build tree first
        target = get_sample_search_target()
        steps = bst.search_steps(target)
        return jsonify(steps)


@app.route('/api/graph-dfs', methods=['GET', 'POST'])
def graph_dfs_api():
    log_interaction('graph_dfs', 'api_request')

    graph = create_sample_graph()
    start_vertex = get_sample_start_vertex()
    steps = graph.dfs_steps(start_vertex)
    return jsonify(steps)


@app.route('/api/graph-bfs', methods=['GET', 'POST'])
def graph_bfs_api():
    log_interaction('graph_bfs', 'api_request')

    graph = create_sample_graph()
    start_vertex = get_sample_start_vertex()
    steps = graph.bfs_steps(start_vertex)
    return jsonify(steps)


@app.route('/api/stack-operations', methods=['GET', 'POST'])
def stack_operations_api():
    log_interaction('stack_operations', 'api_request')

    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'operations' in data:
            operations = data['operations']
            if isinstance(operations, list) and len(operations) <= 20:
                stack = StackOperations()
                steps = stack.operations_steps(operations)
                log_interaction('stack_operations', 'custom_operations_used', {'operations_count': len(operations)})
                return jsonify(steps)

    stack = StackOperations()
    operations = get_sample_stack_operations()
    steps = stack.operations_steps(operations)
    return jsonify(steps)


@app.route('/api/queue-operations', methods=['GET', 'POST'])
def queue_operations_api():
    log_interaction('queue_operations', 'api_request')

    if request.method == 'POST':
        data = request.get_json(silent=True)
        if data and 'operations' in data:
            operations = data['operations']
            if isinstance(operations, list) and len(operations) <= 20:
                queue = QueueOperations()
                steps = queue.operations_steps(operations)
                log_interaction('queue_operations', 'custom_operations_used', {'operations_count': len(operations)})
                return jsonify(steps)

    queue = QueueOperations()
    operations = get_sample_queue_operations()
    steps = queue.operations_steps(operations)
    return jsonify(steps)


@app.route('/api/analytics')
def analytics_api():
    try:
        interactions = []
        log_file = os.path.join(BASE_DIR, 'data', 'interactions.json')
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                for line in f:
                    if line.strip():
                        interactions.append(json.loads(line))

        analytics = {
            'total_interactions': len(interactions),
            'algorithms_accessed': {},
            'recent_activity': interactions[-10:] if interactions else [],
            'custom_arrays_used': len([i for i in interactions if i.get('action') == 'custom_array_used'])
        }

        for interaction in interactions:
            algo = interaction.get('algorithm', 'unknown')
            analytics['algorithms_accessed'][algo] = analytics['algorithms_accessed'].get(algo, 0) + 1

        return jsonify(analytics)
    except Exception as e:
        logger.exception("Error in analytics_api: %s", e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/analytics/interaction', methods=['POST'])
def log_interaction_api():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        page = data.get('page', 'unknown')
        action = data.get('action', 'unknown')
        algorithm = data.get('algorithm', page)
        additional_data = data.get('data')

        log_interaction(algorithm, action, additional_data)
        return jsonify({'success': True})
    except Exception as e:
        logger.exception("Error in log_interaction_api: %s", e)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/set-theme', methods=['POST'])
def set_theme():
    data = request.get_json(silent=True)
    theme = data.get('theme') if data else None

    if theme in ['college', 'school']:
        response = jsonify({'success': True, 'theme': theme})
        response.set_cookie('algorithmVisualizerTheme', theme, max_age=365*24*60*60)
        log_interaction('general', 'theme_changed', {'theme': theme})
        return response

    return jsonify({'error': 'Invalid theme'}), 400


@app.errorhandler(404)
def not_found_error(error):
    theme = get_user_theme()
    log_interaction('general', '404_error', {'url': request.url if has_request_context() else None})
    return render_template('404.html', theme=theme), 404


@app.errorhandler(500)
def internal_error(error):
    theme = get_user_theme()
    log_interaction('general', '500_error', {'url': request.url if has_request_context() else None})
    return render_template('500.html', theme=theme), 500


def _print_startup_info(port, debug_mode):
    logger.info("AlgoVizard starting...")
    logger.info("Available algorithms:")
    logger.info("- Bubble Sort: http://localhost:%s/algorithms/bubble-sort", port)
    logger.info("- Selection Sort: http://localhost:%s/algorithms/selection-sort", port)
    logger.info("- Insertion Sort: http://localhost:%s/algorithms/insertion-sort", port)
    logger.info("- Analytics: http://localhost:%s/api/analytics", port)
    logger.info("Main site: http://localhost:%s", port)
    logger.info("Features: Dual theme system, interactive controls, logging")


# Production-safe entrypoint: bind to 0.0.0.0 and use the PORT env var when present.
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "0") == "1"
    _print_startup_info(port, debug_mode)

    # When running with the built-in dev server, explicitly bind to 0.0.0.0 so external health checks can reach it.
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
