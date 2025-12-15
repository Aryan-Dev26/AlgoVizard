"""
Graph Traversal Algorithms (DFS/BFS) with Graph Visualization
Author: Aryan Pravin Sahu
"""

from collections import deque

class Graph:
    def __init__(self, vertices):
        self.vertices = vertices
        self.adj_list = {i: [] for i in range(vertices)}
        self.edges = []
    
    def add_edge(self, u, v, bidirectional=True):
        """Add edge to the graph"""
        self.adj_list[u].append(v)
        self.edges.append((u, v))
        if bidirectional:
            self.adj_list[v].append(u)
            if (v, u) not in self.edges:
                self.edges.append((v, u))
    
    def dfs_steps(self, start_vertex):
        """Generate step-by-step DFS traversal"""
        steps = []
        visited = set()
        stack = [start_vertex]
        path = []
        
        # Initial state
        steps.append({
            'step': 0,
            'graph': self.serialize_graph(),
            'operation': 'dfs_start',
            'current_vertex': None,
            'stack': stack.copy(),
            'visited': list(visited),
            'path': path.copy(),
            'exploring_edge': None,
            'description': f'Starting DFS from vertex {start_vertex}'
        })
        
        step_count = 1
        
        while stack:
            # Pop from stack
            current = stack.pop()
            
            steps.append({
                'step': step_count,
                'graph': self.serialize_graph(),
                'operation': 'pop_stack',
                'current_vertex': current,
                'stack': stack.copy(),
                'visited': list(visited),
                'path': path.copy(),
                'exploring_edge': None,
                'description': f'Pop vertex {current} from stack'
            })
            step_count += 1
            
            if current not in visited:
                # Visit vertex
                visited.add(current)
                path.append(current)
                
                steps.append({
                    'step': step_count,
                    'graph': self.serialize_graph(),
                    'operation': 'visit_vertex',
                    'current_vertex': current,
                    'stack': stack.copy(),
                    'visited': list(visited),
                    'path': path.copy(),
                    'exploring_edge': None,
                    'description': f'Visit vertex {current} and mark as visited'
                })
                step_count += 1
                
                # Add neighbors to stack (in reverse order for correct DFS order)
                neighbors = sorted(self.adj_list[current], reverse=True)
                for neighbor in neighbors:
                    if neighbor not in visited:
                        # Show edge exploration
                        steps.append({
                            'step': step_count,
                            'graph': self.serialize_graph(),
                            'operation': 'explore_edge',
                            'current_vertex': current,
                            'stack': stack.copy(),
                            'visited': list(visited),
                            'path': path.copy(),
                            'exploring_edge': (current, neighbor),
                            'description': f'Explore edge ({current}, {neighbor})'
                        })
                        step_count += 1
                        
                        stack.append(neighbor)
                        
                        steps.append({
                            'step': step_count,
                            'graph': self.serialize_graph(),
                            'operation': 'push_stack',
                            'current_vertex': current,
                            'stack': stack.copy(),
                            'visited': list(visited),
                            'path': path.copy(),
                            'exploring_edge': None,
                            'description': f'Push vertex {neighbor} to stack'
                        })
                        step_count += 1
            else:
                # Already visited
                steps.append({
                    'step': step_count,
                    'graph': self.serialize_graph(),
                    'operation': 'already_visited',
                    'current_vertex': current,
                    'stack': stack.copy(),
                    'visited': list(visited),
                    'path': path.copy(),
                    'exploring_edge': None,
                    'description': f'Vertex {current} already visited, skip'
                })
                step_count += 1
        
        # DFS complete
        steps.append({
            'step': step_count,
            'graph': self.serialize_graph(),
            'operation': 'dfs_complete',
            'current_vertex': None,
            'stack': [],
            'visited': list(visited),
            'path': path.copy(),
            'exploring_edge': None,
            'description': f'DFS complete! Visited order: {path}'
        })
        
        return steps
    
    def bfs_steps(self, start_vertex):
        """Generate step-by-step BFS traversal"""
        steps = []
        visited = set()
        queue = deque([start_vertex])
        path = []
        
        # Initial state
        steps.append({
            'step': 0,
            'graph': self.serialize_graph(),
            'operation': 'bfs_start',
            'current_vertex': None,
            'queue': list(queue),
            'visited': list(visited),
            'path': path.copy(),
            'exploring_edge': None,
            'level': 0,
            'description': f'Starting BFS from vertex {start_vertex}'
        })
        
        step_count = 1
        visited.add(start_vertex)
        current_level = 0
        
        while queue:
            # Dequeue
            current = queue.popleft()
            path.append(current)
            
            steps.append({
                'step': step_count,
                'graph': self.serialize_graph(),
                'operation': 'dequeue',
                'current_vertex': current,
                'queue': list(queue),
                'visited': list(visited),
                'path': path.copy(),
                'exploring_edge': None,
                'level': current_level,
                'description': f'Dequeue vertex {current} from front of queue'
            })
            step_count += 1
            
            # Visit vertex
            steps.append({
                'step': step_count,
                'graph': self.serialize_graph(),
                'operation': 'visit_vertex',
                'current_vertex': current,
                'queue': list(queue),
                'visited': list(visited),
                'path': path.copy(),
                'exploring_edge': None,
                'level': current_level,
                'description': f'Visit vertex {current} at level {current_level}'
            })
            step_count += 1
            
            # Add unvisited neighbors to queue
            neighbors = sorted(self.adj_list[current])
            for neighbor in neighbors:
                if neighbor not in visited:
                    # Show edge exploration
                    steps.append({
                        'step': step_count,
                        'graph': self.serialize_graph(),
                        'operation': 'explore_edge',
                        'current_vertex': current,
                        'queue': list(queue),
                        'visited': list(visited),
                        'path': path.copy(),
                        'exploring_edge': (current, neighbor),
                        'level': current_level,
                        'description': f'Explore edge ({current}, {neighbor})'
                    })
                    step_count += 1
                    
                    visited.add(neighbor)
                    queue.append(neighbor)
                    
                    steps.append({
                        'step': step_count,
                        'graph': self.serialize_graph(),
                        'operation': 'enqueue',
                        'current_vertex': current,
                        'queue': list(queue),
                        'visited': list(visited),
                        'path': path.copy(),
                        'exploring_edge': None,
                        'level': current_level,
                        'description': f'Enqueue vertex {neighbor} to back of queue'
                    })
                    step_count += 1
        
        # BFS complete
        steps.append({
            'step': step_count,
            'graph': self.serialize_graph(),
            'operation': 'bfs_complete',
            'current_vertex': None,
            'queue': [],
            'visited': list(visited),
            'path': path.copy(),
            'exploring_edge': None,
            'level': current_level,
            'description': f'BFS complete! Visited order: {path}'
        })
        
        return steps
    
    def serialize_graph(self):
        """Convert graph to serializable format for frontend"""
        return {
            'vertices': self.vertices,
            'edges': self.edges,
            'adjacency_list': self.adj_list
        }

def create_sample_graph():
    """Create a sample graph for demonstration"""
    # Create a graph with 6 vertices
    graph = Graph(6)
    
    # Add edges to create an interesting graph structure
    graph.add_edge(0, 1)
    graph.add_edge(0, 2)
    graph.add_edge(1, 3)
    graph.add_edge(1, 4)
    graph.add_edge(2, 5)
    graph.add_edge(3, 4)
    
    return graph

def get_sample_start_vertex():
    """Return sample starting vertex"""
    return 0

# Test the implementation
if __name__ == "__main__":
    graph = create_sample_graph()
    start_vertex = get_sample_start_vertex()
    
    print(f"Graph structure:")
    print(f"Vertices: {graph.vertices}")
    print(f"Edges: {graph.edges}")
    print(f"Adjacency List: {graph.adj_list}")
    
    print(f"\nDFS from vertex {start_vertex}:")
    dfs_steps = graph.dfs_steps(start_vertex)
    print(f"Generated {len(dfs_steps)} DFS steps")
    
    print(f"\nBFS from vertex {start_vertex}:")
    bfs_steps = graph.bfs_steps(start_vertex)
    print(f"Generated {len(bfs_steps)} BFS steps")
    
    # Print final paths
    dfs_path = dfs_steps[-1]['path']
    bfs_path = bfs_steps[-1]['path']
    print(f"\nDFS Path: {dfs_path}")
    print(f"BFS Path: {bfs_path}")