"""
Dijkstra's Shortest Path Algorithm Implementation
Author: Aryan Pravin Sahu
"""

import heapq
from collections import defaultdict

def dijkstra_steps(graph, start_node):
    """
    Generate step-by-step Dijkstra's algorithm visualization data
    """
    steps = []
    
    # Initialize distances and visited set
    distances = {node: float('infinity') for node in graph}
    distances[start_node] = 0
    visited = set()
    previous = {}
    priority_queue = [(0, start_node)]
    
    steps.append({
        'type': 'initialization',
        'message': f'Starting Dijkstra\'s algorithm from node {start_node}',
        'distances': distances.copy(),
        'visited': list(visited),
        'current_node': start_node,
        'priority_queue': [(dist, node) for dist, node in priority_queue],
        'previous': previous.copy(),
        'examining_edge': None
    })
    
    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)
        
        if current_node in visited:
            continue
            
        visited.add(current_node)
        
        steps.append({
            'type': 'visiting_node',
            'message': f'Visiting node {current_node} with distance {current_distance}',
            'distances': distances.copy(),
            'visited': list(visited),
            'current_node': current_node,
            'priority_queue': [(dist, node) for dist, node in priority_queue if node not in visited],
            'previous': previous.copy(),
            'examining_edge': None
        })
        
        # Check all neighbors
        for neighbor, weight in graph[current_node]:
            if neighbor not in visited:
                steps.append({
                    'type': 'examining_edge',
                    'message': f'Examining edge from {current_node} to {neighbor} with weight {weight}',
                    'distances': distances.copy(),
                    'visited': list(visited),
                    'current_node': current_node,
                    'priority_queue': [(dist, node) for dist, node in priority_queue if node not in visited],
                    'previous': previous.copy(),
                    'examining_edge': (current_node, neighbor, weight)
                })
                
                new_distance = current_distance + weight
                
                if new_distance < distances[neighbor]:
                    distances[neighbor] = new_distance
                    previous[neighbor] = current_node
                    heapq.heappush(priority_queue, (new_distance, neighbor))
                    
                    steps.append({
                        'type': 'distance_updated',
                        'message': f'Updated distance to {neighbor}: {new_distance} (via {current_node})',
                        'distances': distances.copy(),
                        'visited': list(visited),
                        'current_node': current_node,
                        'priority_queue': [(dist, node) for dist, node in priority_queue if node not in visited],
                        'previous': previous.copy(),
                        'examining_edge': (current_node, neighbor, weight)
                    })
                else:
                    steps.append({
                        'type': 'distance_not_updated',
                        'message': f'Distance to {neighbor} not updated: {new_distance} >= {distances[neighbor]}',
                        'distances': distances.copy(),
                        'visited': list(visited),
                        'current_node': current_node,
                        'priority_queue': [(dist, node) for dist, node in priority_queue if node not in visited],
                        'previous': previous.copy(),
                        'examining_edge': (current_node, neighbor, weight)
                    })
    
    steps.append({
        'type': 'completed',
        'message': 'Dijkstra\'s algorithm completed - shortest paths found',
        'distances': distances.copy(),
        'visited': list(visited),
        'current_node': None,
        'priority_queue': [],
        'previous': previous.copy(),
        'examining_edge': None
    })
    
    return steps

def get_sample_graph():
    """
    Return a sample weighted graph for demonstration
    """
    return {
        'A': [('B', 4), ('C', 2)],
        'B': [('A', 4), ('C', 1), ('D', 5)],
        'C': [('A', 2), ('B', 1), ('D', 8), ('E', 10)],
        'D': [('B', 5), ('C', 8), ('E', 2), ('F', 6)],
        'E': [('C', 10), ('D', 2), ('F', 3)],
        'F': [('D', 6), ('E', 3)]
    }

def get_sample_positions():
    """
    Return sample node positions for visualization
    """
    return {
        'A': {'x': 100, 'y': 100},
        'B': {'x': 300, 'y': 100},
        'C': {'x': 200, 'y': 200},
        'D': {'x': 400, 'y': 200},
        'E': {'x': 300, 'y': 300},
        'F': {'x': 500, 'y': 300}
    }

def dijkstra_simple(graph, start):
    """
    Simple Dijkstra implementation without steps
    """
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    visited = set()
    previous = {}
    priority_queue = [(0, start)]
    
    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)
        
        if current_node in visited:
            continue
            
        visited.add(current_node)
        
        for neighbor, weight in graph[current_node]:
            if neighbor not in visited:
                new_distance = current_distance + weight
                if new_distance < distances[neighbor]:
                    distances[neighbor] = new_distance
                    previous[neighbor] = current_node
                    heapq.heappush(priority_queue, (new_distance, neighbor))
    
    return distances, previous

def reconstruct_path(previous, start, end):
    """
    Reconstruct the shortest path from start to end
    """
    path = []
    current = end
    
    while current is not None:
        path.append(current)
        current = previous.get(current)
    
    path.reverse()
    
    if path[0] == start:
        return path
    else:
        return []  # No path exists