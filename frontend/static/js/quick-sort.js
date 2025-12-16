/**
 * AlgoVizard - Quick Sort Visualization
 * Author: Aryan Pravin Sahu
 * Interactive quick sort with partition visualization
 */

class QuickSortVisualizer {
    constructor() {
        this.currentArray = [64, 34, 25, 12, 22, 11, 90];
        this.isRunning = false;
        this.isPaused = false;
        this.shouldStop = false;
        this.currentStep = 0;
        this.steps = [];
        this.speed = 5;
        
        // Audio system
        this.audioContext = null;
        this.isAudioEnabled = true;
        
        this.initializeEventListeners();
        this.renderArray();
        this.initializeAudio();
    }

    initializeEventListeners() {
        // Control buttons
        document.getElementById('startSort').addEventListener('click', () => this.startSorting());
        document.getElementById('pauseSort').addEventListener('click', () => this.pauseSorting());
        document.getElementById('resetSort').addEventListener('click', () => this.resetVisualization());
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        
        // Array controls
        document.getElementById('randomArray').addEventListener('click', () => this.generateRandomArray());
        document.getElementById('customArrayBtn').addEventListener('click', () => this.toggleCustomInput());
        document.getElementById('setCustomArray').addEventListener('click', () => this.setCustomArray());
        
        // Speed control
        document.getElementById('speedSlider').addEventListener('input', (e) => this.updateSpeed(e.target.value));
        
        // Custom array input
        document.getElementById('customArrayInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.setCustomArray();
        });
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio not supported');
            this.isAudioEnabled = false;
        }
    }

    playSound(frequency, duration) {
        if (!this.isAudioEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    toggleSound() {
        if (!this.audioContext) this.initializeAudio();
        this.isAudioEnabled = !this.isAudioEnabled;
        document.getElementById('soundToggle').textContent = this.isAudioEnabled ? '🔊' : '🔇';
    }

    generateRandomArray() {
        if (this.isRunning) return;
        
        this.currentArray = [];
        for (let i = 0; i < 8; i++) {
            this.currentArray.push(Math.floor(Math.random() * 90) + 10);
        }
        
        this.renderArray();
        this.updateStatus('Random array generated! Click "Start Sorting" to begin.');
        this.logInteraction('random_array_generated');
    }

    toggleCustomInput() {
        const input = document.getElementById('customArrayInput');
        const button = document.getElementById('setCustomArray');
        
        if (input.style.display === 'none') {
            input.style.display = 'inline-block';
            button.style.display = 'inline-block';
            input.focus();
        } else {
            input.style.display = 'none';
            button.style.display = 'none';
        }
    }

    setCustomArray() {
        const input = document.getElementById('customArrayInput');
        const numbers = input.value.split(',')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n) && n > 0);

        if (numbers.length > 0 && numbers.length <= 10) {
            this.currentArray = numbers;
            this.renderArray();
            this.toggleCustomInput();
            input.value = '';
            this.updateStatus('Custom array set! Click "Start Sorting" to begin.');
            this.logInteraction('custom_array_used', { array_size: numbers.length });
        } else {
            alert('Please enter 1-10 valid positive numbers separated by commas.');
        }
    }

    updateSpeed(value) {
        this.speed = parseInt(value);
        const speedLabels = {
            1: 'Very Slow', 2: 'Slow', 3: 'Slow', 4: 'Medium-', 5: 'Medium',
            6: 'Medium+', 7: 'Fast', 8: 'Fast', 9: 'Very Fast', 10: 'Lightning'
        };
        document.getElementById('speedValue').textContent = speedLabels[value];
    }

    async startSorting() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.shouldStop = false;
        this.isPaused = false;
        
        // Update UI
        document.getElementById('startSort').disabled = true;
        document.getElementById('pauseSort').disabled = false;
        
        try {
            // Fetch steps from backend
            const response = await fetch('/api/quick-sort', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ array: [...this.currentArray] })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.steps = await response.json();
            this.currentStep = 0;
            
            // Start visualization
            await this.visualizeSteps();
            
        } catch (error) {
            console.error('Error starting quick sort:', error);
            this.updateStatus('Error loading algorithm. Please try again.');
        }
        
        this.isRunning = false;
        document.getElementById('startSort').disabled = false;
        document.getElementById('pauseSort').disabled = true;
        
        this.logInteraction('visualization_completed');
    }

    pauseSorting() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseSort').textContent = this.isPaused ? 'Resume' : 'Pause';
        
        if (this.isPaused) {
            this.updateStatus('Visualization paused. Click "Resume" to continue.');
        }
    }

    resetVisualization() {
        this.shouldStop = true;
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        
        // Reset UI
        document.getElementById('startSort').disabled = false;
        document.getElementById('pauseSort').disabled = true;
        document.getElementById('pauseSort').textContent = 'Pause';
        
        this.renderArray();
        this.updateStatus('Visualization reset. Click "Start Sorting" to begin.');
        this.updatePartitionInfo('Ready to start', '');
        
        this.logInteraction('visualization_reset');
    }

    async visualizeSteps() {
        for (let i = 0; i < this.steps.length && !this.shouldStop; i++) {
            // Handle pause
            while (this.isPaused && !this.shouldStop) {
                await this.sleep(100);
            }
            
            if (this.shouldStop) break;
            
            const step = this.steps[i];
            this.currentStep = i;
            
            // Update visualization
            this.renderStep(step);
            this.updatePartitionInfo(step);
            
            // Play appropriate sound
            this.playStepSound(step);
            
            // Wait based on speed
            const delay = this.getDelayFromSpeed();
            await this.sleep(delay);
        }
        
        if (!this.shouldStop) {
            this.playCompleteSound();
            this.updateStatus('Quick sort complete! Array is now fully sorted.');
        }
    }

    renderStep(step) {
        const container = document.getElementById('arrayContainer');
        container.innerHTML = '';

        const maxValue = Math.max(...step.array);
        
        step.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${(value / maxValue) * 200}px`;
            bar.textContent = value;
            bar.id = `bar-${index}`;

            // Apply quick sort specific styling
            if (step.pivot >= 0 && index === step.pivot) {
                bar.classList.add('pivot');
            }
            
            if (step.left_partition && step.left_partition.includes(index)) {
                bar.classList.add('left-partition');
            }
            
            if (step.right_partition && step.right_partition.includes(index)) {
                bar.classList.add('right-partition');
            }
            
            if (step.comparing && step.comparing.includes(index)) {
                bar.classList.add('comparing');
            }
            
            if (step.current_range && step.current_range.includes(index)) {
                bar.classList.add('current-range');
            }

            container.appendChild(bar);
        });
    }

    updatePartitionInfo(step) {
        if (typeof step === 'string') {
            document.getElementById('partitionStatus').textContent = step;
            return;
        }
        
        const statusText = step.operation ? 
            this.getOperationStatusText(step.operation) : 'Processing...';
        
        document.getElementById('partitionStatus').textContent = statusText;
        document.getElementById('operationDescription').textContent = step.description || '';
    }

    getOperationStatusText(operation) {
        const statusMap = {
            'initial': 'Ready to Start',
            'range_select': 'Selecting Range',
            'pivot_select': 'Pivot Selected',
            'compare': 'Comparing with Pivot',
            'swap': 'Swapping Elements',
            'partition_update': 'Updating Partitions',
            'pivot_place': 'Placing Pivot',
            'partition_complete': 'Partition Complete',
            'complete': 'Sorting Complete'
        };
        return statusMap[operation] || 'Processing';
    }

    updateStatus(message) {
        document.getElementById('operationDescription').textContent = message;
    }

    playStepSound(step) {
        // Use new heavenly audio system
        if (!window.heavenlyAudio) return;
        
        switch (step.operation) {
            case 'compare':
                if (step.comparing && step.comparing.length >= 1 && step.pivot >= 0) {
                    const value1 = step.array[step.comparing[0]];
                    const pivotValue = step.array[step.pivot];
                    window.heavenlyAudio.playCompareSound(value1, pivotValue);
                }
                break;
            case 'swap':
                if (step.comparing && step.comparing.length >= 2) {
                    const value1 = step.array[step.comparing[0]];
                    const value2 = step.array[step.comparing[1]];
                    window.heavenlyAudio.playSwapSound(value1, value2);
                }
                break;
            case 'pivot_select':
                if (step.pivot >= 0) {
                    const pivotValue = step.array[step.pivot];
                    window.heavenlyAudio.playBucketSound(pivotValue, 5); // Use bucket sound for pivot selection
                }
                break;
            case 'partition_complete':
                // Play collection sound for partition completion
                if (step.array && step.array.length > 0) {
                    const midValue = step.array[Math.floor(step.array.length / 2)];
                    window.heavenlyAudio.playCollectSound(midValue);
                }
                break;
        }
    }

    playCompleteSound() {
        // Use new heavenly audio system for completion
        if (window.heavenlyAudio) {
            window.heavenlyAudio.playCompletionSound();
        }
    }

    renderArray() {
        const step = {
            array: this.currentArray,
            comparing: [],
            pivot: -1,
            left_partition: [],
            right_partition: [],
            current_range: []
        };
        this.renderStep(step);
    }

    getDelayFromSpeed() {
        // Convert speed (1-10) to delay (1000ms-100ms)
        return 1100 - (this.speed * 100);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    logInteraction(action, additionalData = {}) {
        const data = {
            page: 'quick_sort',
            action: action,
            algorithm: 'quick_sort',
            data: {
                array_size: this.currentArray.length,
                speed: this.speed,
                ...additionalData
            }
        };

        fetch('/api/analytics/interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(error => console.error('Analytics error:', error));
    }
}

// Initialize visualizer when page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuickSortVisualizer();
});