"""
Selection Sort Algorithm Implementation
Author: Aryan Pravin Sahu
"""

def selection_sort_steps(arr):
    """
    Generate step-by-step selection sort execution
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
        'current_min': -1,
        'sorted_boundary': 0,
        'swapped': False,
        'description': 'Initial array state - Selection sort finds minimum element and places it at the beginning'
    })
    
    step_count = 1
    
    for i in range(n):
        min_idx = i
        
        # Add step showing the sorted boundary
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'comparing': [i],
            'current_min': min_idx,
            'sorted_boundary': i,
            'swapped': False,
            'description': f'Starting pass {i + 1}: Looking for minimum element from position {i} onwards'
        })
        step_count += 1
        
        # Find minimum element in remaining unsorted array
        for j in range(i + 1, n):
            # Add comparison step
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [j, min_idx],
                'current_min': min_idx,
                'sorted_boundary': i,
                'swapped': False,
                'description': f'Comparing element at position {j} ({array_copy[j]}) with current minimum at position {min_idx} ({array_copy[min_idx]})'
            })
            step_count += 1
            
            if array_copy[j] < array_copy[min_idx]:
                min_idx = j
                # Add step showing new minimum found
                steps.append({
                    'step': step_count,
                    'array': array_copy.copy(),
                    'comparing': [j],
                    'current_min': min_idx,
                    'sorted_boundary': i,
                    'swapped': False,
                    'description': f'New minimum found! Element {array_copy[min_idx]} at position {min_idx}'
                })
                step_count += 1
        
        # Swap if minimum is not at current position
        if min_idx != i:
            # Show elements about to be swapped
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [i, min_idx],
                'current_min': min_idx,
                'sorted_boundary': i,
                'swapped': False,
                'description': f'Swapping minimum element {array_copy[min_idx]} from position {min_idx} to position {i}'
            })
            step_count += 1
            
            # Perform the swap
            array_copy[i], array_copy[min_idx] = array_copy[min_idx], array_copy[i]
            
            # Show after swap
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [i, min_idx],
                'current_min': i,
                'sorted_boundary': i + 1,
                'swapped': True,
                'description': f'Swapped! Element {array_copy[i]} is now in its correct position'
            })
            step_count += 1
        else:
            # Element is already in correct position
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [i],
                'current_min': i,
                'sorted_boundary': i + 1,
                'swapped': False,
                'description': f'Element {array_copy[i]} is already in correct position'
            })
            step_count += 1
    
    # Add final state
    steps.append({
        'step': step_count,
        'array': array_copy.copy(),
        'comparing': [],
        'current_min': -1,
        'sorted_boundary': n,
        'swapped': False,
        'description': 'Selection sort complete! All elements are now in their correct positions'
    })
    
    return steps

def get_sample_data():
    """Return sample array for demonstration"""
    return [64, 34, 25, 12, 22, 11, 90]

if __name__ == "__main__":
    # Test the algorithm
    sample_array = get_sample_data()
    steps = selection_sort_steps(sample_array)
    
    print(f"Selection sort steps for {sample_array}:")
    for step in steps[:8]:  # Show first 8 steps
        print(f"Step {step['step']}: {step['array']} - {step['description']}")