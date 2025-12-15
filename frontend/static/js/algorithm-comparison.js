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
            'bubble': 'Bubble Sort',
            'selection': 'Selection Sort',
            'insertion': 'Insertion Sort',
            'merge': 'Merge Sort'
        };
        return names[algorithm] || algorithm;
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
            // Fetch algorithm steps from backend
            const response = await fetch(`/api/${algorithmType}-sort`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ array: [...this.currentArray] })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const steps = await response.json();
            
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
            
            // Count operations for statistics
            if (step.comparing && step.comparing.length > 0) {
                this.stats[`algo${panelNumber}`].comparisons++;
            }
            
            if (step.swapped) {
                this.stats[`algo${panelNumber}`].swaps++;
            }

            // Render the step
            this.renderArray(
                panelNumber, 
                step.array, 
                step.comparing || [], 
                step.swapped ? step.comparing : []
            );

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

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize comparison when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmComparison();
});