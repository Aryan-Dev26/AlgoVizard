/**
 * AlgoVizard - Algorithm Comparison System
 * Author: Aryan Pravin Sahu
 * Side-by-side algorithm comparison with performance metrics
 */

class AlgorithmComparison {
    constructor() {
        this.currentArray = [64, 34, 25, 12, 22, 11, 90];
        this.algorithm1 = 'bubble';
        this.algorithm2 = 'selection';
        this.isRunning = false;
        
        // Performance tracking
        this.stats = {
            algo1: { comparisons: 0, swaps: 0, time: 0, steps: [] },
            algo2: { comparisons: 0, swaps: 0, time: 0, steps: [] }
        };
        
        this.initializeEventListeners();
        this.generateNewArray();
    }

    initializeEventListeners() {
        document.getElementById('algorithm1').addEventListener('change', (e) => {
            this.algorithm1 = e.target.value;
            this.updateAlgorithmName(1, this.getAlgorithmDisplayName(this.algorithm1));
            this.resetComparison();
        });

        document.getElementById('algorithm2').addEventListener('change', (e) => {
            this.algorithm2 = e.target.value;
            this.updateAlgorithmName(2, this.getAlgorithmDisplayName(this.algorithm2));
            this.resetComparison();
        });

        document.getElementById('startComparison').addEventListener('click', () => {
            this.startComparison();
        });

        document.getElementById('resetComparison').addEventListener('click', () => {
            this.resetComparison();
        });

        document.getElementById('generateArray').addEventListener('click', () => {
            this.generateNewArray();
        });
    }

    getAlgorithmDisplayName(algorithm) {
        const names = {
            // Sorting Algorithms
            'bubble': 'Bubble Sort',
            'selection': 'Selection Sort',
            'insertion': 'Insertion Sort',
            'merge': 'Merge Sort',
            'quick': 'Quick Sort',
            'heap': 'Heap Sort',
            'radix': 'Radix Sort',

            // Searching Algorithms
            'binary-search': 'Binary Search',
            'linear-search': 'Linear Search',
            // Tree Operations
            'binary-search-tree': 'Binary Search Tree',
            // Graph Algorithms
            'graph-dfs': 'Graph DFS',
            'graph-bfs': 'Graph BFS',
            // Data Structures
            'stack-operations': 'Stack Operations',
            'queue-operations': 'Queue Operations'
        };
        return names[algorithm] || algorithm;
    }

    getAlgorithmConfig(algorithmType) {
        // Sorting algorithms use array input
        const sortingAlgorithms = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'radix'];
        
        if (sortingAlgorithms.includes(algorithmType)) {
            return {
                endpoint: `/api/${algorithmType}-sort`,
                payload: { array: [...this.currentArray] }
            };
        }
        
        // Searching algorithms use array and target
        if (algorithmType === 'binary-search' || algorithmType === 'linear-search') {
            const target = this.currentArray[Math.floor(Math.random() * this.currentArray.length)];
            return {
                endpoint: `/api/${algorithmType}`,
                payload: { array: [...this.currentArray], target: target }
            };
        }
        
        // Tree operations use values array
        if (algorithmType === 'binary-search-tree') {
            return {
                endpoint: `/api/${algorithmType}?operation=insert`,
                payload: { values: [...this.currentArray] }
            };
        }
        
        // Graph algorithms use default parameters
        if (algorithmType === 'graph-dfs' || algorithmType === 'graph-bfs') {
            return {
                endpoint: `/api/${algorithmType}`,
                payload: {}
            };
        }
        
        // Data structure operations use sample operations
        if (algorithmType === 'stack-operations' || algorithmType === 'queue-operations') {
            const operations = this.generateSampleOperations(algorithmType);
            return {
                endpoint: `/api/${algorithmType}`,
                payload: { operations: operations }
            };
        }
        
        // Default fallback
        return {
            endpoint: `/api/${algorithmType}`,
            payload: { array: [...this.currentArray] }
        };
    }

    generateSampleOperations(type) {
        const operations = [];
        const values = this.currentArray.slice(0, 5); // Use first 5 values
        
        if (type === 'stack-operations') {
            values.forEach(val => operations.push({ type: 'push', value: val }));
            operations.push({ type: 'pop' });
            operations.push({ type: 'pop' });
        } else if (type === 'queue-operations') {
            values.forEach(val => operations.push({ type: 'enqueue', value: val }));
            operations.push({ type: 'dequeue' });
            operations.push({ type: 'dequeue' });
        }
        
        return operations;
    }

    updateAlgorithmName(panelNumber, name) {
        document.getElementById(`algo${panelNumber}Name`).textContent = name;
    }

    generateNewArray() {
        this.currentArray = [];
        for (let i = 0; i < 8; i++) {
            this.currentArray.push(Math.floor(Math.random() * 90) + 10);
        }
        this.renderArrays();
        this.resetStats();
    }

    renderArrays() {
        this.renderArray(1, [...this.currentArray]);
        this.renderArray(2, [...this.currentArray]);
    }

    renderArray(panelNumber, array, comparing = [], swapped = []) {
        const container = document.getElementById(`arrayContainer${panelNumber}`);
        container.innerHTML = '';

        const maxValue = Math.max(...array);
        
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${(value / maxValue) * 200}px`;
            bar.textContent = value;
            bar.id = `bar${panelNumber}-${index}`;

            // Add comparison highlighting
            if (comparing.includes(index)) {
                bar.classList.add('comparing');
            }
            
            // Add swap highlighting
            if (swapped.includes(index)) {
                bar.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
            }

            container.appendChild(bar);
        });
    }

    renderTree(panelNumber, treeData, highlighted = []) {
        const container = document.getElementById(`arrayContainer${panelNumber}`);
        container.innerHTML = '<div class="tree-visualization">Tree visualization (simplified for comparison)</div>';
        
        // For now, show a simplified representation
        if (treeData && treeData.nodes) {
            const nodeList = document.createElement('div');
            nodeList.className = 'tree-nodes';
            nodeList.innerHTML = `<strong>Tree Nodes:</strong> ${treeData.nodes.join(', ')}`;
            container.appendChild(nodeList);
        }
    }

    renderGraph(panelNumber, graphData, visited = [], current = []) {
        const container = document.getElementById(`arrayContainer${panelNumber}`);
        container.innerHTML = '<div class="graph-visualization">Graph visualization (simplified for comparison)</div>';
        
        // For now, show a simplified representation
        if (graphData && graphData.vertices) {
            const vertexList = document.createElement('div');
            vertexList.className = 'graph-vertices';
            vertexList.innerHTML = `<strong>Vertices:</strong> ${graphData.vertices.join(', ')}<br>`;
            vertexList.innerHTML += `<strong>Visited:</strong> ${visited.join(', ')}`;
            container.appendChild(vertexList);
        }
    }

    renderDataStructure(panelNumber, stepData) {
        const container = document.getElementById(`arrayContainer${panelNumber}`);
        container.innerHTML = '';

        if (stepData.stack) {
            // Render stack
            const stackContainer = document.createElement('div');
            stackContainer.className = 'stack-visualization';
            stackContainer.innerHTML = '<strong>Stack:</strong>';
            
            const stackItems = document.createElement('div');
            stackItems.className = 'stack-items';
            stackItems.style.display = 'flex';
            stackItems.style.flexDirection = 'column-reverse';
            stackItems.style.gap = '5px';
            
            stepData.stack.forEach((item, index) => {
                const stackItem = document.createElement('div');
                stackItem.className = 'stack-item array-bar';
                stackItem.textContent = item;
                stackItem.style.height = '40px';
                stackItem.style.minWidth = '60px';
                stackItems.appendChild(stackItem);
            });
            
            stackContainer.appendChild(stackItems);
            container.appendChild(stackContainer);
        }

        if (stepData.queue) {
            // Render queue
            const queueContainer = document.createElement('div');
            queueContainer.className = 'queue-visualization';
            queueContainer.innerHTML = '<strong>Queue:</strong>';
            
            const queueItems = document.createElement('div');
            queueItems.className = 'queue-items';
            queueItems.style.display = 'flex';
            queueItems.style.gap = '5px';
            
            stepData.queue.forEach((item, index) => {
                const queueItem = document.createElement('div');
                queueItem.className = 'queue-item array-bar';
                queueItem.textContent = item;
                queueItem.style.height = '40px';
                queueItem.style.minWidth = '60px';
                queueItems.appendChild(queueItem);
            });
            
            queueContainer.appendChild(queueItems);
            container.appendChild(queueContainer);
        }
    }

    async startComparison() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('startComparison').disabled = true;
        this.resetStats();

        // Update status
        document.getElementById('status1').textContent = 'Running...';
        document.getElementById('status2').textContent = 'Running...';

        // Start both algorithms simultaneously
        const promises = [
            this.runAlgorithm(1, this.algorithm1),
            this.runAlgorithm(2, this.algorithm2)
        ];

        try {
            await Promise.all(promises);
            this.analyzePerformance();
        } catch (error) {
            console.error('Comparison error:', error);
        }

        this.isRunning = false;
        document.getElementById('startComparison').disabled = false;
    }

    async runAlgorithm(panelNumber, algorithmType) {
        const startTime = performance.now();
        
        try {
            // Determine the correct API endpoint and payload
            const { endpoint, payload } = this.getAlgorithmConfig(algorithmType);
            
            // Fetch algorithm steps from backend
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            
            // Handle different response formats
            const steps = responseData.steps || responseData;
            
            // Execute visualization
            await this.visualizeSteps(panelNumber, steps);
            
            const endTime = performance.now();
            this.stats[`algo${panelNumber}`].time = Math.round(endTime - startTime);
            
            // Update final stats
            this.updateStats(panelNumber);
            document.getElementById(`status${panelNumber}`).textContent = 'Completed';
            
        } catch (error) {
            console.error(`Algorithm ${panelNumber} error:`, error);
            document.getElementById(`status${panelNumber}`).textContent = 'Error';
        }
    }

    async visualizeSteps(panelNumber, steps) {
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            // Play heavenly sounds for this step (only for panel 1 to avoid audio overlap)
            if (panelNumber === 1) {
                this.playComparisonStepSound(step);
            }
            
            // Count operations for statistics (flexible for different algorithm types)
            if (step.comparing && step.comparing.length > 0) {
                this.stats[`algo${panelNumber}`].comparisons++;
            }
            
            if (step.swapped || step.swapping) {
                this.stats[`algo${panelNumber}`].swaps++;
            }

            // Handle different visualization types
            if (step.array) {
                // Array-based algorithms (sorting, searching)
                this.renderArray(
                    panelNumber, 
                    step.array, 
                    step.comparing || step.current || [], 
                    step.swapped ? step.comparing : (step.swapping || [])
                );
            } else if (step.tree) {
                // Tree-based algorithms
                this.renderTree(panelNumber, step.tree, step.highlighted || []);
            } else if (step.graph) {
                // Graph-based algorithms
                this.renderGraph(panelNumber, step.graph, step.visited || [], step.current || []);
            } else if (step.stack || step.queue) {
                // Data structure operations
                this.renderDataStructure(panelNumber, step);
            } else {
                // Fallback: try to render as array if possible
                const arrayData = step.data || this.currentArray;
                this.renderArray(panelNumber, arrayData, [], []);
            }

            // Update real-time stats
            this.updateStats(panelNumber);

            // Wait for animation
            await this.sleep(300); // Adjust speed as needed
        }
    }

    updateStats(panelNumber) {
        const stats = this.stats[`algo${panelNumber}`];
        document.getElementById(`comparisons${panelNumber}`).textContent = stats.comparisons;
        document.getElementById(`swaps${panelNumber}`).textContent = stats.swaps;
        document.getElementById(`time${panelNumber}`).textContent = `${stats.time}ms`;
    }

    resetStats() {
        this.stats.algo1 = { comparisons: 0, swaps: 0, time: 0, steps: [] };
        this.stats.algo2 = { comparisons: 0, swaps: 0, time: 0, steps: [] };
        
        // Reset UI
        for (let i = 1; i <= 2; i++) {
            document.getElementById(`comparisons${i}`).textContent = '0';
            document.getElementById(`swaps${i}`).textContent = '0';
            document.getElementById(`time${i}`).textContent = '0ms';
            document.getElementById(`status${i}`).textContent = 'Ready';
        }

        // Reset performance analysis
        document.getElementById('fasterAlgo').textContent = '-';
        document.getElementById('fewerComparisons').textContent = '-';
        document.getElementById('fewerSwaps').textContent = '-';
        document.getElementById('overallWinner').textContent = '-';
        
        // Hide winner badges
        ['timeWinner', 'comparisonWinner', 'swapWinner', 'overallBadge'].forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
    }

    resetComparison() {
        this.renderArrays();
        this.resetStats();
    }

    analyzePerformance() {
        const algo1Stats = this.stats.algo1;
        const algo2Stats = this.stats.algo2;
        
        // Determine winners for each metric
        const timeWinner = algo1Stats.time <= algo2Stats.time ? 1 : 2;
        const comparisonWinner = algo1Stats.comparisons <= algo2Stats.comparisons ? 1 : 2;
        const swapWinner = algo1Stats.swaps <= algo2Stats.swaps ? 1 : 2;
        
        // Update performance display
        document.getElementById('fasterAlgo').textContent = 
            this.getAlgorithmDisplayName(timeWinner === 1 ? this.algorithm1 : this.algorithm2);
        document.getElementById('fewerComparisons').textContent = 
            this.getAlgorithmDisplayName(comparisonWinner === 1 ? this.algorithm1 : this.algorithm2);
        document.getElementById('fewerSwaps').textContent = 
            this.getAlgorithmDisplayName(swapWinner === 1 ? this.algorithm1 : this.algorithm2);

        // Calculate overall winner (weighted score)
        const algo1Score = (timeWinner === 1 ? 1 : 0) + 
                          (comparisonWinner === 1 ? 1 : 0) + 
                          (swapWinner === 1 ? 1 : 0);
        
        const overallWinner = algo1Score >= 2 ? 1 : 2;
        document.getElementById('overallWinner').textContent = 
            this.getAlgorithmDisplayName(overallWinner === 1 ? this.algorithm1 : this.algorithm2);

        // Show winner badges
        document.getElementById('timeWinner').style.display = 'inline-block';
        document.getElementById('comparisonWinner').style.display = 'inline-block';
        document.getElementById('swapWinner').style.display = 'inline-block';
        document.getElementById('overallBadge').style.display = 'inline-block';

        // Log analytics
        this.logComparisonAnalytics(algo1Stats, algo2Stats, overallWinner);
    }

    logComparisonAnalytics(algo1Stats, algo2Stats, winner) {
        const analyticsData = {
            algorithm1: this.algorithm1,
            algorithm2: this.algorithm2,
            array_size: this.currentArray.length,
            winner: winner === 1 ? this.algorithm1 : this.algorithm2,
            performance_difference: {
                time_diff: Math.abs(algo1Stats.time - algo2Stats.time),
                comparison_diff: Math.abs(algo1Stats.comparisons - algo2Stats.comparisons),
                swap_diff: Math.abs(algo1Stats.swaps - algo2Stats.swaps)
            }
        };

        // Send to backend analytics
        fetch('/api/analytics/interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                page: 'algorithm_comparison',
                action: 'comparison_completed',
                algorithm: 'comparison',
                data: analyticsData
            })
        }).catch(error => console.error('Analytics error:', error));
    }

    playComparisonStepSound(step) {
        // Only play sounds if audio engine is available
        if (!window.heavenlyAudio) return;

        // Handle different step types
        if (step.comparing && step.comparing.length > 0) {
            // Play comparison sound
            const value1 = step.array ? step.array[step.comparing[0]] : step.comparing[0];
            const value2 = step.comparing.length > 1 ? 
                (step.array ? step.array[step.comparing[1]] : step.comparing[1]) : value1;
            window.heavenlyAudio.playCompareSound(value1, value2);
        }

        if (step.swapped || step.swapping) {
            // Play swap sound
            const swapIndices = step.swapping || step.comparing || [];
            if (swapIndices.length >= 2 && step.array) {
                const value1 = step.array[swapIndices[0]];
                const value2 = step.array[swapIndices[1]];
                window.heavenlyAudio.playSwapSound(value1, value2);
            }
        }

        // Handle radix sort specific sounds
        if (step.type === 'placing_in_bucket' && step.processing_number !== undefined) {
            window.heavenlyAudio.playBucketSound(step.processing_number, step.current_digit || 0);
        }

        if (step.type === 'collecting_from_bucket' && step.collecting_number !== undefined) {
            window.heavenlyAudio.playCollectSound(step.collecting_number);
        }

        // Play completion sound for final steps
        if (step.message && step.message.toLowerCase().includes('complete')) {
            window.heavenlyAudio.playCompletionSound();
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize comparison when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmComparison();
});