"""
Binary Search Tree Implementation with Tree Visualization
Author: Aryan Pravin Sahu
"""

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert_steps(self, values):
        """Generate step-by-step BST insertion"""
        steps = []
        
        # Initial empty tree
        steps.append({
            'step': 0,
            'tree': self.serialize_tree(),
            'operation': 'initial',
            'current_node': None,
            'inserting_value': None,
            'path': [],
            'comparing': [],
            'description': 'Empty Binary Search Tree - ready for insertions'
        })
        
        step_count = 1
        
        for value in values:
            insertion_steps = self._insert_value_steps(value, step_count)
            steps.extend(insertion_steps)
            step_count += len(insertion_steps)
        
        return steps
    
    def _insert_value_steps(self, value, start_step):
        """Generate steps for inserting a single value"""
        steps = []
        step_count = start_step
        
        # Show value being inserted
        steps.append({
            'step': step_count,
            'tree': self.serialize_tree(),
            'operation': 'insert_start',
            'current_node': None,
            'inserting_value': value,
            'path': [],
            'comparing': [],
            'description': f'Inserting value {value} into BST'
        })
        step_count += 1
        
        if self.root is None:
            # First node becomes root
            self.root = TreeNode(value)
            steps.append({
                'step': step_count,
                'tree': self.serialize_tree(),
                'operation': 'insert_root',
                'current_node': value,
                'inserting_value': value,
                'path': [value],
                'comparing': [],
                'description': f'Tree is empty. {value} becomes the root node'
            })
            return steps
        
        # Traverse to find insertion point
        current = self.root
        path = []
        
        while True:
            path.append(current.val)
            
            # Show comparison
            steps.append({
                'step': step_count,
                'tree': self.serialize_tree(),
                'operation': 'compare',
                'current_node': current.val,
                'inserting_value': value,
                'path': path.copy(),
                'comparing': [current.val],
                'description': f'Comparing {value} with {current.val}'
            })
            step_count += 1
            
            if value < current.val:
                # Go left
                steps.append({
                    'step': step_count,
                    'tree': self.serialize_tree(),
                    'operation': 'go_left',
                    'current_node': current.val,
                    'inserting_value': value,
                    'path': path.copy(),
                    'comparing': [],
                    'description': f'{value} < {current.val}, go to left subtree'
                })
                step_count += 1
                
                if current.left is None:
                    # Insert here
                    current.left = TreeNode(value)
                    path.append(value)
                    steps.append({
                        'step': step_count,
                        'tree': self.serialize_tree(),
                        'operation': 'insert_complete',
                        'current_node': value,
                        'inserting_value': value,
                        'path': path.copy(),
                        'comparing': [],
                        'description': f'Inserted {value} as left child of {current.val}'
                    })
                    break
                else:
                    current = current.left
                    
            elif value > current.val:
                # Go right
                steps.append({
                    'step': step_count,
                    'tree': self.serialize_tree(),
                    'operation': 'go_right',
                    'current_node': current.val,
                    'inserting_value': value,
                    'path': path.copy(),
                    'comparing': [],
                    'description': f'{value} > {current.val}, go to right subtree'
                })
                step_count += 1
                
                if current.right is None:
                    # Insert here
                    current.right = TreeNode(value)
                    path.append(value)
                    steps.append({
                        'step': step_count,
                        'tree': self.serialize_tree(),
                        'operation': 'insert_complete',
                        'current_node': value,
                        'inserting_value': value,
                        'path': path.copy(),
                        'comparing': [],
                        'description': f'Inserted {value} as right child of {current.val}'
                    })
                    break
                else:
                    current = current.right
            else:
                # Duplicate value
                steps.append({
                    'step': step_count,
                    'tree': self.serialize_tree(),
                    'operation': 'duplicate',
                    'current_node': current.val,
                    'inserting_value': value,
                    'path': path.copy(),
                    'comparing': [current.val],
                    'description': f'Value {value} already exists in BST. Skipping insertion.'
                })
                break
        
        return steps
    
    def search_steps(self, target):
        """Generate step-by-step BST search"""
        steps = []
        
        # Initial state
        steps.append({
            'step': 0,
            'tree': self.serialize_tree(),
            'operation': 'search_start',
            'current_node': None,
            'target': target,
            'path': [],
            'comparing': [],
            'found': False,
            'description': f'Searching for {target} in BST'
        })
        
        if self.root is None:
            steps.append({
                'step': 1,
                'tree': self.serialize_tree(),
                'operation': 'not_found',
                'current_node': None,
                'target': target,
                'path': [],
                'comparing': [],
                'found': False,
                'description': f'Tree is empty. {target} not found.'
            })
            return steps
        
        step_count = 1
        current = self.root
        path = []
        
        while current is not None:
            path.append(current.val)
            
            # Show comparison
            steps.append({
                'step': step_count,
                'tree': self.serialize_tree(),
                'operation': 'compare',
                'current_node': current.val,
                'target': target,
                'path': path.copy(),
                'comparing': [current.val],
                'found': False,
                'description': f'Comparing target {target} with {current.val}'
            })
            step_count += 1
            
            if target == current.val:
                # Found
                steps.append({
                    'step': step_count,
                    'tree': self.serialize_tree(),
                    'operation': 'found',
                    'current_node': current.val,
                    'target': target,
                    'path': path.copy(),
                    'comparing': [current.val],
                    'found': True,
                    'description': f'Target {target} found!'
                })
                break
            elif target < current.val:
                # Go left
                steps.append({
                    'step': step_count,
                    'tree': self.serialize_tree(),
                    'operation': 'go_left',
                    'current_node': current.val,
                    'target': target,
                    'path': path.copy(),
                    'comparing': [],
                    'found': False,
                    'description': f'{target} < {current.val}, search left subtree'
                })
                step_count += 1
                current = current.left
            else:
                # Go right
                steps.append({
                    'step': step_count,
                    'tree': self.serialize_tree(),
                    'operation': 'go_right',
                    'current_node': current.val,
                    'target': target,
                    'path': path.copy(),
                    'comparing': [],
                    'found': False,
                    'description': f'{target} > {current.val}, search right subtree'
                })
                step_count += 1
                current = current.right
        
        # Not found
        if current is None:
            steps.append({
                'step': step_count,
                'tree': self.serialize_tree(),
                'operation': 'not_found',
                'current_node': None,
                'target': target,
                'path': path.copy(),
                'comparing': [],
                'found': False,
                'description': f'Target {target} not found in BST'
            })
        
        return steps
    
    def traversal_steps(self, traversal_type='inorder'):
        """Generate step-by-step tree traversal"""
        steps = []
        visited = []
        
        steps.append({
            'step': 0,
            'tree': self.serialize_tree(),
            'operation': f'{traversal_type}_start',
            'current_node': None,
            'visited': [],
            'stack': [],
            'result': [],
            'description': f'Starting {traversal_type} traversal'
        })
        
        if traversal_type == 'inorder':
            self._inorder_steps(self.root, steps, visited, [])
        elif traversal_type == 'preorder':
            self._preorder_steps(self.root, steps, visited, [])
        elif traversal_type == 'postorder':
            self._postorder_steps(self.root, steps, visited, [])
        
        return steps
    
    def _inorder_steps(self, node, steps, visited, result):
        """Inorder traversal with steps"""
        if node is not None:
            # Visit left
            self._inorder_steps(node.left, steps, visited, result)
            
            # Visit root
            visited.append(node.val)
            result.append(node.val)
            steps.append({
                'step': len(steps),
                'tree': self.serialize_tree(),
                'operation': 'visit',
                'current_node': node.val,
                'visited': visited.copy(),
                'stack': [],
                'result': result.copy(),
                'description': f'Visit node {node.val} (Inorder: Left → Root → Right)'
            })
            
            # Visit right
            self._inorder_steps(node.right, steps, visited, result)
    
    def serialize_tree(self):
        """Convert tree to serializable format for frontend"""
        if self.root is None:
            return None
        
        def serialize_node(node):
            if node is None:
                return None
            return {
                'val': node.val,
                'left': serialize_node(node.left),
                'right': serialize_node(node.right)
            }
        
        return serialize_node(self.root)

def get_sample_data():
    """Return sample values for BST demonstration"""
    return [50, 30, 70, 20, 40, 60, 80]

def get_sample_search_target():
    """Return sample search target"""
    return 40

# Test the implementation
if __name__ == "__main__":
    bst = BinarySearchTree()
    sample_values = get_sample_data()
    
    print(f"BST Insertion for values {sample_values}:")
    insertion_steps = bst.insert_steps(sample_values)
    print(f"Generated {len(insertion_steps)} insertion steps")
    
    print(f"\nBST Search for {get_sample_search_target()}:")
    search_steps = bst.search_steps(get_sample_search_target())
    print(f"Generated {len(search_steps)} search steps")
    
    print(f"\nBST Inorder Traversal:")
    traversal_steps = bst.traversal_steps('inorder')
    print(f"Generated {len(traversal_steps)} traversal steps")