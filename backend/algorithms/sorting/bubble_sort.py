"""
Bubble Sort Algorithm Implementation
Author: Aryan Pravin Sahu
"""

def bubble_sort_steps(arr):
    """
    Generate step-by-step bubble sort execution
    Returns list of steps for visualization
    """
    n = len(arr)
    steps = []
    array_copy = arr.copy()
    
    # Add initial state
    steps.append({
        'step': 0,
        'array': array_copy.copy(),
        'comparing': [],
        'swapped': False,
        'description': 'Initial array state'
    })
    
    step_count = 1
    
    for i in range(n):
        for j in range(0, n - i - 1):
            # Add comparison step
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [j, j + 1],
                'swapped': False,
                'description': f'Comparing elements at positions {j} and {j + 1}'
            })
            step_count += 1
            
            # Check if swap needed
            if array_copy[j] > array_copy[j + 1]:
                # Perform swap
                array_copy[j], array_copy[j + 1] = array_copy[j + 1], array_copy[j]
                
                # Add swap step
                steps.append({
                    'step': step_count,
                    'array': array_copy.copy(),
                    'comparing': [j, j + 1],
                    'swapped': True,
                    'description': f'Swapped elements at positions {j} and {j + 1}'
                })
                step_count += 1
    
    # Add final state
    steps.append({
        'step': step_count,
        'array': array_copy.copy(),
        'comparing': [],
        'swapped': False,
        'description': 'Array is now sorted!'
    })
    
    return steps

def get_sample_data():
    """Return sample array for demonstration"""
    return [64, 34, 25, 12, 22, 11, 90]

if __name__ == "__main__":
    # Test the algorithm
    sample_array = get_sample_data()
    steps = bubble_sort_steps(sample_array)
    
    print(f"Bubble sort steps for {sample_array}:")
    for step in steps[:5]:  # Show first 5 steps
        print(f"Step {step['step']}: {step['array']} - {step['description']}")