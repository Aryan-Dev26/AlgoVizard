/**
 * AlgoVizard - Merge Sort Visualization
 * Author: Aryan Pravin Sahu
 * Interactive merge sort with divide-and-conquer visualization
 */

class MergeSortVisualizer {
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
            const response = await fetch('/api/merge-sort', {
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
            console.error('Error starting merge sort:', error);
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
        this.updateRecursionInfo('Ready to start', '');
        
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
            this.updateRecursionInfo(step);
            
            // Play appropriate sound
            this.playStepSound(step);
            
            // Wait based on speed
            const delay = this.getDelayFromSpeed();
            await this.sleep(delay);
        }
        
        if (!this.shouldStop) {
            this.playCompleteSound();
            this.updateStatus('Merge sort complete! Array is now fully sorted.');
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

            // Apply merge sort specific styling
            if (step.left_subarray && step.left_subarray.includes(index)) {
                bar.classList.add('left-subarray');
            }
            
            if (step.right_subarray && step.right_subarray.includes(index)) {
                bar.classList.add('right-subarray');
            }
            
            if (step.comparing && step.comparing.includes(index)) {
                bar.classList.add('comparing');
            }
            
            if (step.merging && step.merging.includes(index)) {
                bar.classList.add('merging');
            }
            
            if (step.current_merge && step.current_merge.includes(index)) {
                bar.classList.add('current-merge');
            }

            container.appendChild(bar);
        });
    }

    updateRecursionInfo(step) {
        if (typeof step === 'string') {
            document.getElementById('recursionLevel').textContent = step;
            return;
        }
        
        const levelText = step.recursion_level !== undefined ? 
            `Recursion Level: ${step.recursion_level}` : 'Processing...';
        
        document.getElementById('recursionLevel').textContent = levelText;
        document.getElementById('operationStatus').textContent = step.description || '';
    }

    updateStatus(message) {
        document.getElementById('operationStatus').textContent = message;
    }

    playStepSound(step) {
        if (!this.isAudioEnabled) return;
        
        switch (step.operation) {
            case 'compare':
                this.playSound(800, 0.1);
                break;
            case 'merge_place':
                this.playSound(600, 0.15);
                break;
            case 'divide':
                this.playSound(400, 0.2);
                break;
            case 'merge_complete':
                this.playSound(1000, 0.3);
                break;
        }
    }

    playCompleteSound() {
        if (!this.isAudioEnabled) return;
        
        setTimeout(() => this.playSound(523, 0.2), 0);
        setTimeout(() => this.playSound(659, 0.2), 200);
        setTimeout(() => this.playSound(784, 0.4), 400);
    }

    renderArray() {
        const step = {
            array: this.currentArray,
            comparing: [],
            merging: [],
            left_subarray: [],
            right_subarray: [],
            current_merge: []
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
            page: 'merge_sort',
            action: action,
            algorithm: 'merge_sort',
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
    new MergeSortVisualizer();
});