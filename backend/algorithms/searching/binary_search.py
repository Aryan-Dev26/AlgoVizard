"""
Binary Search Algorithm Implementation with Range Visualization
Author: Aryan Pravin Sahu
"""

def binary_search_steps(arr, target):
    """
    Generate step-by-step binary search execution
    Returns list of steps for visualization including range narrowing
    """
    steps = []
    array_copy = arr.copy()
    
    # Add initial state
    steps.append({
        'step': 0,
        'array': array_copy.copy(),
        'target': target,
        'left': 0,
        'right': len(arr) - 1,
        'mid': -1,
        'comparing': [],
        'search_range': list(range(len(arr))),
        'eliminated': [],
        'found': False,
        'operation': 'initial',
        'description': f'Searching for {target} in sorted array using binary search'
    })
    
    step_count = 1
    left = 0
    right = len(arr) - 1
    found_index = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        # Show mid calculation
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'target': target,
            'left': left,
            'right': right,
            'mid': mid,
            'comparing': [],
            'search_range': list(range(left, right + 1)),
            'eliminated': [],
            'found': False,
            'operation': 'calculate_mid',
            'description': f'Calculate mid: ({left} + {right}) // 2 = {mid}'
        })
        step_count += 1
        
        # Show comparison with mid element
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'target': target,
            'left': left,
            'right': right,
            'mid': mid,
            'comparing': [mid],
            'search_range': list(range(left, right + 1)),
            'eliminated': [],
            'found': False,
            'operation': 'compare',
            'description': f'Comparing target {target} with arr[{mid}] = {arr[mid]}'
        })
        step_count += 1
        
        if arr[mid] == target:
            # Found the target
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'target': target,
                'left': left,
                'right': right,
                'mid': mid,
                'comparing': [mid],
                'search_range': [mid],
                'eliminated': [],
                'found': True,
                'operation': 'found',
                'description': f'Target {target} found at index {mid}!'
            })
            found_index = mid
            break
            
        elif arr[mid] < target:
            # Target is in right half
            eliminated_range = list(range(left, mid + 1))
            left = mid + 1
            
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'target': target,
                'left': left,
                'right': right,
                'mid': mid,
                'comparing': [],
                'search_range': list(range(left, right + 1)) if left <= right else [],
                'eliminated': eliminated_range,
                'found': False,
                'operation': 'eliminate_left',
                'description': f'{arr[mid]} < {target}, eliminate left half. New range: [{left}..{right}]'
            })
            step_count += 1
            
        else:
            # Target is in left half
            eliminated_range = list(range(mid, right + 1))
            right = mid - 1
            
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'target': target,
                'left': left,
                'right': right,
                'mid': mid,
                'comparing': [],
                'search_range': list(range(left, right + 1)) if left <= right else [],
                'eliminated': eliminated_range,
                'found': False,
                'operation': 'eliminate_right',
                'description': f'{arr[mid]} > {target}, eliminate right half. New range: [{left}..{right}]'
            })
            step_count += 1
    
    # Add final result
    if found_index == -1:
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'target': target,
            'left': left,
            'right': right,
            'mid': -1,
            'comparing': [],
            'search_range': [],
            'eliminated': list(range(len(arr))),
            'found': False,
            'operation': 'not_found',
            'description': f'Target {target} not found in the array'
        })
    
    return steps

def linear_search_steps(arr, target):
    """
    Generate step-by-step linear search execution for comparison
    """
    steps = []
    array_copy = arr.copy()
    
    # Add initial state
    steps.append({
        'step': 0,
        'array': array_copy.copy(),
        'target': target,
        'current': -1,
        'comparing': [],
        'checked': [],
        'found': False,
        'operation': 'initial',
        'description': f'Searching for {target} using linear search (sequential scan)'
    })
    
    step_count = 1
    
    for i in range(len(arr)):
        # Show current element being checked
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'target': target,
            'current': i,
            'comparing': [i],
            'checked': list(range(i)),
            'found': False,
            'operation': 'compare',
            'description': f'Checking arr[{i}] = {arr[i]} against target {target}'
        })
        step_count += 1
        
        if arr[i] == target:
            # Found the target
            steps.append({
                'step': step_count,
                'array': array_copy.copy(),
                'target': target,
                'current': i,
                'comparing': [i],
                'checked': list(range(i + 1)),
                'found': True,
                'operation': 'found',
                'description': f'Target {target} found at index {i}!'
            })
            return steps
        
        # Mark as checked
        steps.append({
            'step': step_count,
            'array': array_copy.copy(),
            'target': target,
            'current': i,
            'comparing': [],
            'checked': list(range(i + 1)),
            'found': False,
            'operation': 'continue',
            'description': f'arr[{i}] ≠ {target}, continue searching...'
        })
        step_count += 1
    
    # Not found
    steps.append({
        'step': step_count,
        'array': array_copy.copy(),
        'target': target,
        'current': -1,
        'comparing': [],
        'checked': list(range(len(arr))),
        'found': False,
        'operation': 'not_found',
        'description': f'Target {target} not found after checking all elements'
    })
    
    return steps

def get_sample_data():
    """Return sample sorted array for binary search demonstration"""
    return [11, 12, 22, 25, 34, 64, 90]

def get_sample_target():
    """Return sample target for search demonstration"""
    return 25

# Test the implementation
if __name__ == "__main__":
    test_array = get_sample_data()
    test_target = get_sample_target()
    
    print(f"Binary Search for {test_target} in {test_array}:")
    steps = binary_search_steps(test_array, test_target)
    print(f"Generated {len(steps)} steps")
    
    # Print key steps
    for i, step in enumerate(steps):
        if step['operation'] in ['initial', 'compare', 'found', 'not_found']:
            print(f"Step {i}: {step['operation']} - {step['description']}")
            if step['operation'] == 'compare':
                print(f"  Range: [{step['left']}..{step['right']}], Mid: {step['mid']}")
            print()