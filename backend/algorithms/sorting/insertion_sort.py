"""
AlgoVizard - Insertion Sort Algorithm
Author: Aryan Pravin Sahu
Insertion sort implementation with step-by-step visualization data
"""

def insertion_sort_steps(arr):
    """
    Generate step-by-step insertion sort execution
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
        'current_element': -1,
        'sorted_boundary': 1,
        'swapped': False,
        'description': 'Initial array state - First element is considered sorted'
    })
    
    step_count = 1
    
    # Start from second element
    for i in range(1, n):
        current_value = array_copy[i]
        
        # Show current element being processed
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'comparing': [],
            'current_element': i,
            'sorted_boundary': i,
            'swapped': False,
            'description': f'Processing element {current_value} at position {i}'
        })
        step_count += 1
        
        # Compare backwards through sorted portion
        j = i - 1
        while j >= 0 and array_copy[j] > current_value:
            # Show comparison
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [j, i],
                'current_element': i,
                'sorted_boundary': i,
                'swapped': False,
                'description': f'Comparing {current_value} with {array_copy[j]} at position {j}'
            })
            step_count += 1
            
            # Shift element to the right
            array_copy[j + 1] = array_copy[j]
            
            # Show shift
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [j + 1],
                'current_element': i,
                'sorted_boundary': i,
                'swapped': True,
                'description': f'Shifting {array_copy[j + 1]} right to position {j + 1}'
            })
            step_count += 1
            
            j -= 1
        
        # Insert the current element
        array_copy[j + 1] = current_value
        
        # Show insertion
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'comparing': [j + 1],
            'current_element': -1,
            'sorted_boundary': i + 1,
            'swapped': True,
            'description': f'Inserted {current_value} at position {j + 1}. Sorted portion now has {i + 1} elements'
        })
        step_count += 1
    
    # Add final state
    steps.append({
        'step': step_count,
        'array': array_copy.copy(),
        'comparing': [],
        'current_element': -1,
        'sorted_boundary': n,
        'swapped': False,
        'description': 'Insertion sort complete! All elements are now in their correct positions'
    })
    
    return steps

def get_sample_data():
    """Return sample array for insertion sort demonstration"""
    return [64, 34, 25, 12, 22, 11, 90]

# Test the implementation
if __name__ == "__main__":
    test_array = [64, 34, 25, 12, 22, 11, 90]
    steps = insertion_sort_steps(test_array)
    
    print(f"Insertion Sort Steps for {test_array}:")
    print(f"Generated {len(steps)} steps")
    
    # Print first few steps for verification
    for i, step in enumerate(steps[:5]):
        print(f"Step {i}: {step['description']}")
        print(f"  Array: {step['array']}")
        if step['comparing']:
            print(f"  Comparing: {step['comparing']}")
        print()