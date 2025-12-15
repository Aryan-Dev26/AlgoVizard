"""
Heap Sort Algorithm Implementation
Author: Aryan Pravin Sahu
"""

def heap_sort_steps(arr):
    """
    Generate step-by-step heap sort visualization data
    """
    steps = []
    n = len(arr)
    array = arr.copy()
    
    # Build max heap
    steps.append({
        'type': 'info',
        'message': 'Building max heap from array',
        'array': array.copy(),
        'heap_size': n,
        'comparing': [],
        'swapping': [],
        'sorted': []
    })
    
    # Build heap (rearrange array)
    for i in range(n // 2 - 1, -1, -1):
        heapify_steps = heapify(array, n, i, steps)
        steps.extend(heapify_steps)
    
    steps.append({
        'type': 'heap_built',
        'message': 'Max heap built successfully',
        'array': array.copy(),
        'heap_size': n,
        'comparing': [],
        'swapping': [],
        'sorted': []
    })
    
    # Extract elements from heap one by one
    for i in range(n - 1, 0, -1):
        # Move current root to end
        steps.append({
            'type': 'extract_max',
            'message': f'Moving maximum element {array[0]} to sorted position',
            'array': array.copy(),
            'heap_size': i + 1,
            'comparing': [],
            'swapping': [0, i],
            'sorted': list(range(i + 1, n))
        })
        
        array[i], array[0] = array[0], array[i]
        
        steps.append({
            'type': 'swapped',
            'message': f'Swapped {array[i]} to position {i}',
            'array': array.copy(),
            'heap_size': i,
            'comparing': [],
            'swapping': [],
            'sorted': list(range(i, n))
        })
        
        # Call heapify on the reduced heap
        heapify_steps = heapify(array, i, 0, steps)
        steps.extend(heapify_steps)
    
    steps.append({
        'type': 'completed',
        'message': 'Heap sort completed!',
        'array': array.copy(),
        'heap_size': 0,
        'comparing': [],
        'swapping': [],
        'sorted': list(range(n))
    })
    
    return steps

def heapify(arr, n, i, steps):
    """
    Heapify a subtree rooted with node i which is an index in arr[]
    """
    heapify_steps = []
    largest = i  # Initialize largest as root
    left = 2 * i + 1     # left = 2*i + 1
    right = 2 * i + 2    # right = 2*i + 2
    
    # See if left child of root exists and is greater than root
    if left < n:
        heapify_steps.append({
            'type': 'comparing',
            'message': f'Comparing parent {arr[i]} with left child {arr[left]}',
            'array': arr.copy(),
            'heap_size': n,
            'comparing': [i, left],
            'swapping': [],
            'sorted': []
        })
        
        if arr[left] > arr[largest]:
            largest = left
    
    # See if right child of root exists and is greater than largest so far
    if right < n:
        heapify_steps.append({
            'type': 'comparing',
            'message': f'Comparing largest {arr[largest]} with right child {arr[right]}',
            'array': arr.copy(),
            'heap_size': n,
            'comparing': [largest, right],
            'swapping': [],
            'sorted': []
        })
        
        if arr[right] > arr[largest]:
            largest = right
    
    # Change root, if needed
    if largest != i:
        heapify_steps.append({
            'type': 'heapify_swap',
            'message': f'Swapping {arr[i]} with {arr[largest]} to maintain heap property',
            'array': arr.copy(),
            'heap_size': n,
            'comparing': [],
            'swapping': [i, largest],
            'sorted': []
        })
        
        arr[i], arr[largest] = arr[largest], arr[i]  # swap
        
        heapify_steps.append({
            'type': 'heapify_swapped',
            'message': f'Swapped successfully, continuing heapify',
            'array': arr.copy(),
            'heap_size': n,
            'comparing': [],
            'swapping': [],
            'sorted': []
        })
        
        # Recursively heapify the affected sub-tree
        recursive_steps = heapify(arr, n, largest, steps)
        heapify_steps.extend(recursive_steps)
    
    return heapify_steps

def heap_sort(arr):
    """
    Simple heap sort implementation without steps
    """
    n = len(arr)
    
    # Build a maxheap
    for i in range(n // 2 - 1, -1, -1):
        heapify_simple(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]  # swap
        heapify_simple(arr, i, 0)
    
    return arr

def heapify_simple(arr, n, i):
    """
    Simple heapify without step tracking
    """
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify_simple(arr, n, largest)