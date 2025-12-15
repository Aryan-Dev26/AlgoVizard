"""
Fibonacci Sequence with Dynamic Programming
Author: Aryan Pravin Sahu
"""

def fibonacci_steps(n):
    """
    Generate step-by-step Fibonacci calculation using dynamic programming
    """
    steps = []
    
    if n <= 0:
        steps.append({
            'type': 'invalid_input',
            'message': 'Invalid input: n must be positive',
            'n': n,
            'dp_table': {},
            'current_calculation': None,
            'result': 0
        })
        return steps
    
    if n == 1 or n == 2:
        steps.append({
            'type': 'base_case',
            'message': f'Base case: F({n}) = 1',
            'n': n,
            'dp_table': {n: 1},
            'current_calculation': n,
            'result': 1
        })
        return steps
    
    # Initialize DP table
    dp = {}
    dp[1] = 1
    dp[2] = 1
    
    steps.append({
        'type': 'initialization',
        'message': 'Initializing base cases: F(1) = 1, F(2) = 1',
        'n': n,
        'dp_table': dp.copy(),
        'current_calculation': None,
        'result': None
    })
    
    # Calculate Fibonacci numbers iteratively
    for i in range(3, n + 1):
        steps.append({
            'type': 'calculating',
            'message': f'Calculating F({i}) = F({i-1}) + F({i-2})',
            'n': n,
            'dp_table': dp.copy(),
            'current_calculation': i,
            'result': None
        })
        
        dp[i] = dp[i-1] + dp[i-2]
        
        steps.append({
            'type': 'calculated',
            'message': f'F({i}) = {dp[i-1]} + {dp[i-2]} = {dp[i]}',
            'n': n,
            'dp_table': dp.copy(),
            'current_calculation': i,
            'result': dp[i]
        })
    
    steps.append({
        'type': 'completed',
        'message': f'Fibonacci calculation completed: F({n}) = {dp[n]}',
        'n': n,
        'dp_table': dp.copy(),
        'current_calculation': None,
        'result': dp[n]
    })
    
    return steps

def fibonacci_recursive_steps(n, memo=None, steps=None, depth=0):
    """
    Generate steps for recursive Fibonacci with memoization
    """
    if steps is None:
        steps = []
    if memo is None:
        memo = {}
    
    indent = "  " * depth
    
    steps.append({
        'type': 'function_call',
        'message': f'{indent}Calling F({n})',
        'n': n,
        'memo': memo.copy(),
        'depth': depth,
        'result': None
    })
    
    # Base cases
    if n <= 0:
        steps.append({
            'type': 'base_case',
            'message': f'{indent}Base case: F({n}) = 0',
            'n': n,
            'memo': memo.copy(),
            'depth': depth,
            'result': 0
        })
        return 0
    
    if n == 1 or n == 2:
        memo[n] = 1
        steps.append({
            'type': 'base_case',
            'message': f'{indent}Base case: F({n}) = 1',
            'n': n,
            'memo': memo.copy(),
            'depth': depth,
            'result': 1
        })
        return 1
    
    # Check if already computed
    if n in memo:
        steps.append({
            'type': 'memoized',
            'message': f'{indent}Found in memo: F({n}) = {memo[n]}',
            'n': n,
            'memo': memo.copy(),
            'depth': depth,
            'result': memo[n]
        })
        return memo[n]
    
    # Recursive calls
    steps.append({
        'type': 'recursive_call',
        'message': f'{indent}Computing F({n}) = F({n-1}) + F({n-2})',
        'n': n,
        'memo': memo.copy(),
        'depth': depth,
        'result': None
    })
    
    fib1 = fibonacci_recursive_steps(n-1, memo, steps, depth + 1)
    fib2 = fibonacci_recursive_steps(n-2, memo, steps, depth + 1)
    
    result = fib1 + fib2
    memo[n] = result
    
    steps.append({
        'type': 'computed',
        'message': f'{indent}F({n}) = {fib1} + {fib2} = {result}',
        'n': n,
        'memo': memo.copy(),
        'depth': depth,
        'result': result
    })
    
    return result

def fibonacci_simple(n):
    """
    Simple iterative Fibonacci calculation
    """
    if n <= 0:
        return 0
    if n == 1 or n == 2:
        return 1
    
    a, b = 1, 1
    for i in range(3, n + 1):
        a, b = b, a + b
    
    return b