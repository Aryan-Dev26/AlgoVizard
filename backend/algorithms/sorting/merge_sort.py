"""
Merge Sort Algorithm Implementation with Divide-and-Conquer Visualization
Author: Aryan Pravin Sahu
"""

def merge_sort_steps(arr):
    """
    Generate step-by-step merge sort execution with divide-and-conquer visualization
    Returns list of steps for visualization including recursive splitting and merging
    """
    steps = []
    array_copy = arr.copy()
    
    # Add initial state
    steps.append({
        'step': 0,
        'array': array_copy.copy(),
        'comparing': [],
        'merging': [],
        'left_subarray': [],
        'right_subarray': [],
        'current_merge': [],
        'recursion_level': 0,
        'operation': 'initial',
        'description': 'Initial array - Merge sort will recursively divide and then merge'
    })
    
    step_count = 1
    
    def merge_sort_recursive(arr, left, right, level, steps, step_count):
        """Recursive merge sort with step tracking"""
        if left >= right:
            return step_count
        
        mid = (left + right) // 2
        
        # Show division step
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'comparing': [],
            'merging': [],
            'left_subarray': list(range(left, mid + 1)),
            'right_subarray': list(range(mid + 1, right + 1)),
            'current_merge': list(range(left, right + 1)),
            'recursion_level': level,
            'operation': 'divide',
            'description': f'Level {level}: Dividing array from index {left} to {right} at position {mid}'
        })
        step_count += 1
        
        # Recursively sort left half
        step_count = merge_sort_recursive(arr, left, mid, level + 1, steps, step_count)
        
        # Recursively sort right half  
        step_count = merge_sort_recursive(arr, mid + 1, right, level + 1, steps, step_count)
        
        # Merge the sorted halves
        step_count = merge(arr, left, mid, right, level, steps, step_count)
        
        return step_count
    
    def merge(arr, left, mid, right, level, steps, step_count):
        """Merge two sorted subarrays with detailed step tracking"""
        # Create temporary arrays for left and right subarrays
        left_arr = arr[left:mid + 1]
        right_arr = arr[mid + 1:right + 1]
        
        # Show merge preparation
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'comparing': [],
            'merging': list(range(left, right + 1)),
            'left_subarray': list(range(left, mid + 1)),
            'right_subarray': list(range(mid + 1, right + 1)),
            'current_merge': list(range(left, right + 1)),
            'recursion_level': level,
            'operation': 'merge_start',
            'description': f'Level {level}: Starting merge of subarrays [{left}..{mid}] and [{mid+1}..{right}]'
        })
        step_count += 1
        
        i = j = 0  # Initial indexes for left and right subarrays
        k = left   # Initial index for merged array
        
        # Merge process
        while i < len(left_arr) and j < len(right_arr):
            left_val = left_arr[i]
            right_val = right_arr[j]
            
            # Show comparison
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [left + i, mid + 1 + j],
                'merging': list(range(left, right + 1)),
                'left_subarray': list(range(left, mid + 1)),
                'right_subarray': list(range(mid + 1, right + 1)),
                'current_merge': [k],
                'recursion_level': level,
                'operation': 'compare',
                'description': f'Comparing {left_val} (left) with {right_val} (right)'
            })
            step_count += 1
            
            if left_val <= right_val:
                arr[k] = left_val
                array_copy[k] = left_val
                i += 1
                selected_from = 'left'
            else:
                arr[k] = right_val
                array_copy[k] = right_val
                j += 1
                selected_from = 'right'
            
            # Show merge result
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [],
                'merging': list(range(left, right + 1)),
                'left_subarray': list(range(left, mid + 1)),
                'right_subarray': list(range(mid + 1, right + 1)),
                'current_merge': [k],
                'recursion_level': level,
                'operation': 'merge_place',
                'description': f'Placed {arr[k]} from {selected_from} subarray at position {k}'
            })
            step_count += 1
            k += 1
        
        # Copy remaining elements from left subarray
        while i < len(left_arr):
            arr[k] = left_arr[i]
            array_copy[k] = left_arr[i]
            
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [],
                'merging': list(range(left, right + 1)),
                'left_subarray': list(range(left, mid + 1)),
                'right_subarray': [],
                'current_merge': [k],
                'recursion_level': level,
                'operation': 'copy_remaining',
                'description': f'Copying remaining element {left_arr[i]} from left subarray'
            })
            step_count += 1
            i += 1
            k += 1
        
        # Copy remaining elements from right subarray
        while j < len(right_arr):
            arr[k] = right_arr[j]
            array_copy[k] = right_arr[j]
            
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'comparing': [],
                'merging': list(range(left, right + 1)),
                'left_subarray': [],
                'right_subarray': list(range(mid + 1, right + 1)),
                'current_merge': [k],
                'recursion_level': level,
                'operation': 'copy_remaining',
                'description': f'Copying remaining element {right_arr[j]} from right subarray'
            })
            step_count += 1
            j += 1
            k += 1
        
        # Show completed merge
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'comparing': [],
            'merging': [],
            'left_subarray': [],
            'right_subarray': [],
            'current_merge': list(range(left, right + 1)),
            'recursion_level': level,
            'operation': 'merge_complete',
            'description': f'Level {level}: Merge complete for range [{left}..{right}]'
        })
        step_count += 1
        
        return step_count
    
    # Start recursive merge sort
    final_step_count = merge_sort_recursive(array_copy, 0, len(array_copy) - 1, 0, steps, step_count)
    
    # Add final completion step
    steps.append({
        'step': final_step_count,
        'array': array_copy.copy(),
        'comparing': [],
        'merging': [],
        'left_subarray': [],
        'right_subarray': [],
        'current_merge': [],
        'recursion_level': 0,
        'operation': 'complete',
        'description': 'Merge sort complete! Array is now fully sorted using divide-and-conquer.'
    })
    
    return steps

def get_sample_data():
    """Return sample array for merge sort demonstration"""
    return [64, 34, 25, 12, 22, 11, 90]

# Test the implementation
if __name__ == "__main__":
    test_array = [64, 34, 25, 12, 22, 11, 90]
    steps = merge_sort_steps(test_array)
    
    print(f"Merge Sort Steps for {test_array}:")
    print(f"Generated {len(steps)} steps")
    
    # Print key steps for verification
    for i, step in enumerate(steps):
        if step['operation'] in ['initial', 'divide', 'merge_start', 'merge_complete', 'complete']:
            print(f"Step {i}: {step['operation']} - {step['description']}")
            print(f"  Array: {step['array']}")
            if step['left_subarray']:
                print(f"  Left: {step['left_subarray']}")
            if step['right_subarray']:
                print(f"  Right: {step['right_subarray']}")
            print()