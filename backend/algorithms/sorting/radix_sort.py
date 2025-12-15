"""
Radix Sort Algorithm Implementation
Author: Aryan Pravin Sahu
"""

def radix_sort_steps(arr):
    """
    Generate step-by-step radix sort visualization data
    """
    steps = []
    
    if not arr:
        return steps
    
    # Find the maximum number to know number of digits
    max_num = max(arr)
    array = arr.copy()
    
    steps.append({
        'type': 'initialization',
        'message': f'Starting Radix Sort. Maximum number: {max_num}',
        'array': array.copy(),
        'digit_position': 0,
        'buckets': [[] for _ in range(10)],
        'current_digit': None,
        'max_digits': len(str(max_num))
    })
    
    # Do counting sort for every digit
    exp = 1
    digit_pos = 1
    
    while max_num // exp > 0:
        steps.append({
            'type': 'digit_processing',
            'message': f'Processing digit at position {digit_pos} (10^{digit_pos-1})',
            'array': array.copy(),
            'digit_position': digit_pos,
            'buckets': [[] for _ in range(10)],
            'current_digit': None,
            'max_digits': len(str(max_num))
        })
        
        # Initialize buckets
        buckets = [[] for _ in range(10)]
        
        # Place elements in buckets based on current digit
        for i, num in enumerate(array):
            digit = (num // exp) % 10
            buckets[digit].append(num)
            
            steps.append({
                'type': 'placing_in_bucket',
                'message': f'Placing {num} in bucket {digit} (digit at position {digit_pos} is {digit})',
                'array': array.copy(),
                'digit_position': digit_pos,
                'buckets': [bucket.copy() for bucket in buckets],
                'current_digit': digit,
                'processing_number': num,
                'max_digits': len(str(max_num))
            })
        
        steps.append({
            'type': 'buckets_filled',
            'message': f'All numbers placed in buckets based on digit at position {digit_pos}',
            'array': array.copy(),
            'digit_position': digit_pos,
            'buckets': [bucket.copy() for bucket in buckets],
            'current_digit': None,
            'max_digits': len(str(max_num))
        })
        
        # Collect elements from buckets
        array = []
        for bucket_idx, bucket in enumerate(buckets):
            for num in bucket:
                array.append(num)
                
                steps.append({
                    'type': 'collecting_from_bucket',
                    'message': f'Collecting {num} from bucket {bucket_idx}',
                    'array': array.copy(),
                    'digit_position': digit_pos,
                    'buckets': [bucket.copy() for bucket in buckets],
                    'current_digit': bucket_idx,
                    'collecting_number': num,
                    'max_digits': len(str(max_num))
                })
        
        steps.append({
            'type': 'digit_complete',
            'message': f'Digit position {digit_pos} processing complete',
            'array': array.copy(),
            'digit_position': digit_pos,
            'buckets': [[] for _ in range(10)],
            'current_digit': None,
            'max_digits': len(str(max_num))
        })
        
        exp *= 10
        digit_pos += 1
    
    steps.append({
        'type': 'completed',
        'message': 'Radix sort completed! Array is now sorted.',
        'array': array.copy(),
        'digit_position': 0,
        'buckets': [[] for _ in range(10)],
        'current_digit': None,
        'max_digits': len(str(max_num))
    })
    
    return steps

def counting_sort_for_radix(arr, exp):
    """
    Counting sort function used by radix sort
    """
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    
    # Store count of occurrences
    for i in range(n):
        index = arr[i] // exp
        count[index % 10] += 1
    
    # Change count[i] so that count[i] contains actual position
    for i in range(1, 10):
        count[i] += count[i - 1]
    
    # Build the output array
    i = n - 1
    while i >= 0:
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1
    
    # Copy the output array to arr
    for i in range(n):
        arr[i] = output[i]

def radix_sort(arr):
    """
    Simple radix sort implementation without steps
    """
    if not arr:
        return arr
    
    max_num = max(arr)
    exp = 1
    
    while max_num // exp > 0:
        counting_sort_for_radix(arr, exp)
        exp *= 10
    
    return arr