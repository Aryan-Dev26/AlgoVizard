"""
Heap Sort Algorithm Implementation
Author: Aryan Pravin Sahu
A simple and clean implementation of heap sort with step-by-step visualization
"""

def heap_sort_steps(arr):
    """
    Generate step-by-step heap sort visualization data
    Returns a list of steps showing the sorting process
    """
    steps = []
    n = len(arr)
    array = arr.copy()
    
    # Step 1: Build max heap
    steps.append({
        'type': 'start',
        'message': 'Starting Heap Sort - Building max heap',
        'array': array.copy(),
        'comparing': [],
        'swapping': [],
        'sorted': [],
        'heap_size': n
    })
    
    # Build heap (rearrange array)
    for i in range(n // 2 - 1, -1, -1):
        heapify_steps = heapify(array, n, i)
        for step in heapify_steps:
            step['heap_size'] = n
            steps.append(step)
    
    steps.append({
        'type': 'heap_built',
        'message': 'Max heap built successfully! Now extracting elements one by one.',
        'array': array.copy(),
        'comparing': [],
        'swapping': [],
        'sorted': [],
        'heap_size': n
    })
    
    # Step 2: Extract elements from heap one by one
    for i in range(n - 1, 0, -1):
        # Move current root to end
        steps.append({
            'type': 'extract',
            'message': f'Moving maximum element {array[0]} to sorted position',
            'array': array.copy(),
            'comparing': [],
            'swapping': [0, i],
            'sorted': list(range(i + 1, n)),
            'heap_size': i + 1
        })
        
        # Swap
        array[i], array[0] = array[0], array[i]
        
        steps.append({
            'type': 'swapped',
            'message': f'Element {array[i]} is now in its final sorted position',
            'array': array.copy(),
            'comparing': [],
            'swapping': [],
            'sorted': list(range(i, n)),
            'heap_size': i
        })
        
        # Call heapify on the reduced heap
        heapify_steps = heapify(array, i, 0)
        for step in heapify_steps:
            step['sorted'] = list(range(i, n))
            step['heap_size'] = i
            steps.append(step)
    
    steps.append({
        'type': 'completed',
        'message': 'Heap sort completed! Array is now fully sorted.',
        'array': array.copy(),
        'comparing': [],
        'swapping': [],
        'sorted': list(range(n)),
        'heap_size': 0
    })
    
    return steps

def heapify(arr, n, i):
    """
    Heapify a subtree rooted with node i
    Returns steps for visualization
    """
    steps = []
    largest = i  # Initialize largest as root
    left = 2 * i + 1     # left child
    right = 2 * i + 2    # right child
    
    # See if left child exists and is greater than root
    if left < n:
        steps.append({
            'type': 'comparing',
            'message': f'Comparing parent {arr[i]} with left child {arr[left]}',
            'array': arr.copy(),
            'comparing': [i, left],
            'swapping': [],
            'sorted': []
        })
        
        if arr[left] > arr[largest]:
            largest = left
    
    # See if right child exists and is greater than largest so far
    if right < n:
        steps.append({
            'type': 'comparing',
            'message': f'Comparing {arr[largest]} with right child {arr[right]}',
            'array': arr.copy(),
            'comparing': [largest, right],
            'swapping': [],
            'sorted': []
        })
        
        if arr[right] > arr[largest]:
            largest = right
    
    # Change root, if needed
    if largest != i:
        steps.append({
            'type': 'swap_needed',
            'message': f'Swapping {arr[i]} with {arr[largest]} to maintain heap property',
            'array': arr.copy(),
            'comparing': [],
            'swapping': [i, largest],
            'sorted': []
        })
        
        # Swap
        arr[i], arr[largest] = arr[largest], arr[i]
        
        steps.append({
            'type': 'swapped',
            'message': f'Swapped! Continuing to heapify subtree at position {largest}',
            'array': arr.copy(),
            'comparing': [],
            'swapping': [],
            'sorted': []
        })
        
        # Recursively heapify the affected sub-tree
        recursive_steps = heapify(arr, n, largest)
        steps.extend(recursive_steps)
    
    return steps

def get_sample_data():
    """Return sample data for heap sort demonstration"""
    return [64, 34, 25, 12, 22, 11, 90]