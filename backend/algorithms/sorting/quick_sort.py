"""
Quick Sort Algorithm Implementation with Partition Visualization
Author: Aryan Pravin Sahu
"""

def quick_sort_steps(arr):
    """
    Generate step-by-step quick sort execution with partition visualization
    Returns list of steps for visualization including pivot selection and partitioning
    """
    steps = []
    array_copy = arr.copy()
    
    # Add initial state
    steps.append({
        'step': 0,
        'array': array_copy.copy(),
        'comparing': [],
        'pivot': -1,
        'left_partition': [],
        'right_partition': [],
        'current_range': [],
        'swapped': False,
        'operation': 'initial',
        'description': 'Initial array - Quick sort will partition around pivot elements'
    })
    
    step_count = 1
    
    def quick_sort_recursive(arr, low, high, steps, step_count):
        """Recursive quick sort with step tracking"""
        if low < high:
            # Show current range being processed
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [],
                'pivot': -1,
                'left_partition': [],
                'right_partition': [],
                'current_range': list(range(low, high + 1)),
                'swapped': False,
                'operation': 'range_select',
                'description': f'Processing range [{low}..{high}] with {high - low + 1} elements'
            })
            step_count += 1
            
            # Partition and get pivot index
            pivot_index, step_count = partition(arr, low, high, steps, step_count)
            
            # Recursively sort left partition
            step_count = quick_sort_recursive(arr, low, pivot_index - 1, steps, step_count)
            
            # Recursively sort right partition
            step_count = quick_sort_recursive(arr, pivot_index + 1, high, steps, step_count)
        
        return step_count
    
    def partition(arr, low, high, steps, step_count):
        """Partition function with detailed step tracking"""
        # Choose rightmost element as pivot
        pivot = arr[high]
        pivot_index = high
        
        # Show pivot selection
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'comparing': [],
            'pivot': pivot_index,
            'left_partition': [],
            'right_partition': [],
            'current_range': list(range(low, high + 1)),
            'swapped': False,
            'operation': 'pivot_select',
            'description': f'Selected pivot: {pivot} at position {pivot_index}'
        })
        step_count += 1
        
        # Index of smaller element (indicates right position of pivot)
        i = low - 1
        
        for j in range(low, high):
            # Show comparison with pivot
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [j, pivot_index],
                'pivot': pivot_index,
                'left_partition': list(range(low, i + 1)) if i >= low else [],
                'right_partition': list(range(i + 1, j)) if i + 1 < j else [],
                'current_range': list(range(low, high + 1)),
                'swapped': False,
                'operation': 'compare',
                'description': f'Comparing {arr[j]} with pivot {pivot}'
            })
            step_count += 1
            
            # If current element is smaller than or equal to pivot
            if arr[j] <= pivot:
                i += 1
                
                if i != j:  # Only swap if different positions
                    # Show swap
                    steps.append({
                        'step': step_count,
                        'array': array_copy.copy(),
                        'comparing': [i, j],
                        'pivot': pivot_index,
                        'left_partition': list(range(low, i)) if i > low else [],
                        'right_partition': list(range(i + 1, j)) if i + 1 < j else [],
                        'current_range': list(range(low, high + 1)),
                        'swapped': True,
                        'operation': 'swap',
                        'description': f'Swapping {arr[i]} and {arr[j]} - moving smaller element left'
                    })
                    step_count += 1
                    
                    # Perform swap
                    arr[i], arr[j] = arr[j], arr[i]
                    array_copy[i], array_copy[j] = array_copy[j], array_copy[i]
                    
                    # Show result after swap
                    steps.append({
                        'step': step_count,
                        'array': array_copy.copy(),
                        'comparing': [],
                        'pivot': pivot_index,
                        'left_partition': list(range(low, i + 1)),
                        'right_partition': list(range(i + 1, j + 1)) if i + 1 <= j else [],
                        'current_range': list(range(low, high + 1)),
                        'swapped': False,
                        'operation': 'partition_update',
                        'description': f'Left partition now has {i - low + 1} elements ≤ pivot'
                    })
                    step_count += 1
        
        # Place pivot in correct position
        final_pivot_pos = i + 1
        if final_pivot_pos != pivot_index:
            # Show final pivot placement
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [final_pivot_pos, pivot_index],
                'pivot': pivot_index,
                'left_partition': list(range(low, final_pivot_pos)),
                'right_partition': list(range(final_pivot_pos + 1, high + 1)),
                'current_range': list(range(low, high + 1)),
                'swapped': True,
                'operation': 'pivot_place',
                'description': f'Placing pivot {pivot} in its correct position {final_pivot_pos}'
            })
            step_count += 1
            
            # Perform final swap
            arr[final_pivot_pos], arr[pivot_index] = arr[pivot_index], arr[final_pivot_pos]
            array_copy[final_pivot_pos], array_copy[pivot_index] = array_copy[pivot_index], array_copy[final_pivot_pos]
        
        # Show completed partition
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'comparing': [],
            'pivot': final_pivot_pos,
            'left_partition': list(range(low, final_pivot_pos)),
            'right_partition': list(range(final_pivot_pos + 1, high + 1)),
            'current_range': [],
            'swapped': False,
            'operation': 'partition_complete',
            'description': f'Partition complete! Pivot {pivot} is in correct position {final_pivot_pos}'
        })
        step_count += 1
        
        return final_pivot_pos, step_count
    
    # Start recursive quick sort
    final_step_count = quick_sort_recursive(array_copy, 0, len(array_copy) - 1, steps, step_count)
    
    # Add final completion step
    steps.append({
        'step': final_step_count,
        'array': array_copy.copy(),
        'comparing': [],
        'pivot': -1,
        'left_partition': [],
        'right_partition': [],
        'current_range': [],
        'swapped': False,
        'operation': 'complete',
        'description': 'Quick sort complete! Array is now fully sorted using divide-and-conquer.'
    })
    
    return steps

def get_sample_data():
    """Return sample array for quick sort demonstration"""
    return [64, 34, 25, 12, 22, 11, 90]

# Test the implementation
if __name__ == "__main__":
    test_array = [64, 34, 25, 12, 22, 11, 90]
    steps = quick_sort_steps(test_array)
    
    print(f"Quick Sort Steps for {test_array}:")
    print(f"Generated {len(steps)} steps")
    
    # Print key steps for verification
    for i, step in enumerate(steps):
        if step['operation'] in ['initial', 'pivot_select', 'partition_complete', 'complete']:
            print(f"Step {i}: {step['operation']} - {step['description']}")
            print(f"  Array: {step['array']}")
            if step['pivot'] >= 0:
                print(f"  Pivot: {step['pivot']}")
            print()