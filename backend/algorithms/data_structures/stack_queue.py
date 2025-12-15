"""
Stack and Queue Data Structure Operations with Linear Visualization
Author: Aryan Pravin Sahu
"""

class StackOperations:
    def __init__(self):
        self.stack = []
    
    def operations_steps(self, operations):
        """
        Generate step-by-step stack operations
        operations: list of tuples (operation, value) e.g., [('push', 5), ('pop', None)]
        """
        steps = []
        
        # Initial empty stack
        steps.append({
            'step': 0,
            'stack': self.stack.copy(),
            'operation': 'initial',
            'value': None,
            'top': -1,
            'size': 0,
            'description': 'Empty stack - LIFO (Last In, First Out) data structure'
        })
        
        step_count = 1
        
        for op, value in operations:
            if op == 'push':
                # Show value being pushed
                steps.append({
                    'step': step_count,
                    'stack': self.stack.copy(),
                    'operation': 'push_start',
                    'value': value,
                    'top': len(self.stack) - 1 if self.stack else -1,
                    'size': len(self.stack),
                    'description': f'Pushing {value} onto stack'
                })
                step_count += 1
                
                # Perform push
                self.stack.append(value)
                
                steps.append({
                    'step': step_count,
                    'stack': self.stack.copy(),
                    'operation': 'push_complete',
                    'value': value,
                    'top': len(self.stack) - 1,
                    'size': len(self.stack),
                    'description': f'{value} pushed successfully. New top: {value}'
                })
                step_count += 1
                
            elif op == 'pop':
                if not self.stack:
                    # Stack underflow
                    steps.append({
                        'step': step_count,
                        'stack': self.stack.copy(),
                        'operation': 'underflow',
                        'value': None,
                        'top': -1,
                        'size': 0,
                        'description': 'Cannot pop from empty stack (Stack Underflow)'
                    })
                    step_count += 1
                else:
                    # Show value being popped
                    popped_value = self.stack[-1]
                    steps.append({
                        'step': step_count,
                        'stack': self.stack.copy(),
                        'operation': 'pop_start',
                        'value': popped_value,
                        'top': len(self.stack) - 1,
                        'size': len(self.stack),
                        'description': f'Popping top element {popped_value} from stack'
                    })
                    step_count += 1
                    
                    # Perform pop
                    self.stack.pop()
                    
                    steps.append({
                        'step': step_count,
                        'stack': self.stack.copy(),
                        'operation': 'pop_complete',
                        'value': popped_value,
                        'top': len(self.stack) - 1 if self.stack else -1,
                        'size': len(self.stack),
                        'description': f'{popped_value} popped successfully. New top: {self.stack[-1] if self.stack else "None"}'
                    })
                    step_count += 1
                    
            elif op == 'peek':
                if not self.stack:
                    steps.append({
                        'step': step_count,
                        'stack': self.stack.copy(),
                        'operation': 'peek_empty',
                        'value': None,
                        'top': -1,
                        'size': 0,
                        'description': 'Cannot peek empty stack'
                    })
                else:
                    steps.append({
                        'step': step_count,
                        'stack': self.stack.copy(),
                        'operation': 'peek',
                        'value': self.stack[-1],
                        'top': len(self.stack) - 1,
                        'size': len(self.stack),
                        'description': f'Top element is {self.stack[-1]} (peek operation)'
                    })
                step_count += 1
        
        return steps

class QueueOperations:
    def __init__(self):
        self.queue = []
    
    def operations_steps(self, operations):
        """
        Generate step-by-step queue operations
        operations: list of tuples (operation, value) e.g., [('enqueue', 5), ('dequeue', None)]
        """
        steps = []
        
        # Initial empty queue
        steps.append({
            'step': 0,
            'queue': self.queue.copy(),
            'operation': 'initial',
            'value': None,
            'front': -1,
            'rear': -1,
            'size': 0,
            'description': 'Empty queue - FIFO (First In, First Out) data structure'
        })
        
        step_count = 1
        
        for op, value in operations:
            if op == 'enqueue':
                # Show value being enqueued
                steps.append({
                    'step': step_count,
                    'queue': self.queue.copy(),
                    'operation': 'enqueue_start',
                    'value': value,
                    'front': 0 if self.queue else -1,
                    'rear': len(self.queue) - 1 if self.queue else -1,
                    'size': len(self.queue),
                    'description': f'Enqueuing {value} to rear of queue'
                })
                step_count += 1
                
                # Perform enqueue
                self.queue.append(value)
                
                steps.append({
                    'step': step_count,
                    'queue': self.queue.copy(),
                    'operation': 'enqueue_complete',
                    'value': value,
                    'front': 0,
                    'rear': len(self.queue) - 1,
                    'size': len(self.queue),
                    'description': f'{value} enqueued successfully. New rear: {value}'
                })
                step_count += 1
                
            elif op == 'dequeue':
                if not self.queue:
                    # Queue underflow
                    steps.append({
                        'step': step_count,
                        'queue': self.queue.copy(),
                        'operation': 'underflow',
                        'value': None,
                        'front': -1,
                        'rear': -1,
                        'size': 0,
                        'description': 'Cannot dequeue from empty queue (Queue Underflow)'
                    })
                    step_count += 1
                else:
                    # Show value being dequeued
                    dequeued_value = self.queue[0]
                    steps.append({
                        'step': step_count,
                        'queue': self.queue.copy(),
                        'operation': 'dequeue_start',
                        'value': dequeued_value,
                        'front': 0,
                        'rear': len(self.queue) - 1,
                        'size': len(self.queue),
                        'description': f'Dequeuing front element {dequeued_value} from queue'
                    })
                    step_count += 1
                    
                    # Perform dequeue
                    self.queue.pop(0)
                    
                    steps.append({
                        'step': step_count,
                        'queue': self.queue.copy(),
                        'operation': 'dequeue_complete',
                        'value': dequeued_value,
                        'front': 0 if self.queue else -1,
                        'rear': len(self.queue) - 1 if self.queue else -1,
                        'size': len(self.queue),
                        'description': f'{dequeued_value} dequeued successfully. New front: {self.queue[0] if self.queue else "None"}'
                    })
                    step_count += 1
                    
            elif op == 'front':
                if not self.queue:
                    steps.append({
                        'step': step_count,
                        'queue': self.queue.copy(),
                        'operation': 'front_empty',
                        'value': None,
                        'front': -1,
                        'rear': -1,
                        'size': 0,
                        'description': 'Cannot get front of empty queue'
                    })
                else:
                    steps.append({
                        'step': step_count,
                        'queue': self.queue.copy(),
                        'operation': 'front',
                        'value': self.queue[0],
                        'front': 0,
                        'rear': len(self.queue) - 1,
                        'size': len(self.queue),
                        'description': f'Front element is {self.queue[0]}'
                    })
                step_count += 1
        
        return steps

def get_sample_stack_operations():
    """Return sample stack operations for demonstration"""
    return [
        ('push', 10),
        ('push', 20),
        ('push', 30),
        ('peek', None),
        ('pop', None),
        ('push', 40),
        ('pop', None),
        ('pop', None),
        ('pop', None),
        ('pop', None)  # This will cause underflow
    ]

def get_sample_queue_operations():
    """Return sample queue operations for demonstration"""
    return [
        ('enqueue', 10),
        ('enqueue', 20),
        ('enqueue', 30),
        ('front', None),
        ('dequeue', None),
        ('enqueue', 40),
        ('dequeue', None),
        ('dequeue', None),
        ('dequeue', None),
        ('dequeue', None)  # This will cause underflow
    ]

# Test the implementation
if __name__ == "__main__":
    # Test Stack
    stack = StackOperations()
    stack_ops = get_sample_stack_operations()
    
    print("Stack Operations:")
    print(f"Operations: {stack_ops}")
    stack_steps = stack.operations_steps(stack_ops)
    print(f"Generated {len(stack_steps)} stack steps")
    
    # Test Queue
    queue = QueueOperations()
    queue_ops = get_sample_queue_operations()
    
    print(f"\nQueue Operations:")
    print(f"Operations: {queue_ops}")
    queue_steps = queue.operations_steps(queue_ops)
    print(f"Generated {len(queue_steps)} queue steps")
    
    # Print some key steps
    print(f"\nSample Stack Steps:")
    for i, step in enumerate(stack_steps[:5]):
        print(f"Step {i}: {step['operation']} - {step['description']}")
    
    print(f"\nSample Queue Steps:")
    for i, step in enumerate(queue_steps[:5]):
        print(f"Step {i}: {step['operation']} - {step['description']}")