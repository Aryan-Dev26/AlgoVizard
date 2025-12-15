/**
 * Heap Sort Visualization - Simple and Clean Implementation
 * Author: Aryan Pravin Sahu
 */

class HeapSortVisualizer {
    constructor() {
        this.array = [64, 34, 25, 12, 22, 11, 90];
        this.originalArray = [...this.array];
        this.isRunning = false;
        this.isPaused = false;
        this.animationSpeed = 1000;
        this.currentStep = 0;
        this.steps = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderArray();
        this.updateStepInfo('Ready to start Heap Sort', 'Enter an array and click "Start Heap Sort" to begin.');
    }

    initializeElements() {
        // Input elements
        this.arrayInput = document.getElementById('arrayInput');
        this.speedSlider = document.getElementById('speedSlider');
        
        // Button elements
        this.generateBtn = document.getElementById('generateBtn');
        this.setArrayBtn = document.getElementById('setArrayBtn');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Display elements
        this.arrayContainer = document.getElementById('arrayContainer');
        this.stepDescription = document.getElementById('stepDescription');
        this.stepDetails = document.getElementById('stepDetails');
        this.treeContainer = document.getElementById('treeContainer');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateRandomArray());
        this.setArrayBtn.addEventListener('click', () => this.setCustomArray());
        this.startBtn.addEventListener('click', () => this.startSorting());
        this.pauseBtn.addEventListener('click', () => this.pauseSorting());
        this.resetBtn.addEventListener('click', () => this.resetVisualization());
        this.speedSlider.addEventListener('input', () => this.updateSpeed());
        
        // Allow Enter key to set array
        this.arrayInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setCustomArray();
            }
        });
    }

    generateRandomArray() {
        const size = 7;
        this.array = [];
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 90) + 10);
        }
        this.originalArray = [...this.array];
        this.arrayInput.value = this.array.join(', ');
        this.renderArray();
        this.updateStepInfo('New random array generated', 'Click "Start Heap Sort" to begin sorting.');
    }

    setCustomArray() {
        const input = this.arrayInput.value.trim();
        if (!input) {
            alert('Please enter some numbers!');
            return;
        }

        try {
            const numbers = input.split(',').map(num => {
                const parsed = parseInt(num.trim());
                if (isNaN(parsed)) {
                    throw new Error('Invalid number');
                }
                return parsed;
            });

            if (numbers.length < 2) {
                alert('Please enter at least 2 numbers!');
                return;
            }

            if (numbers.length > 10) {
                alert('Please enter no more than 10 numbers for better visualization!');
                return;
            }

            this.array = numbers;
            this.originalArray = [...this.array];
            this.renderArray();
            this.updateStepInfo('Custom array set', 'Click "Start Heap Sort" to begin sorting.');
        } catch (error) {
            alert('Please enter valid numbers separated by commas!');
        }
    }

    updateSpeed() {
        const speed = parseInt(this.speedSlider.value);
        this.animationSpeed = 2000 - (speed * 180); // 1820ms (slow) to 200ms (fast)
    }

    async startSorting() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.setArrayBtn.disabled = true;
        this.generateBtn.disabled = true;

        try {
            // Fetch steps from backend
            const response = await fetch('/api/heap-sort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ array: [...this.array] })
            });

            if (!response.ok) {
                throw new Error('Failed to get sorting steps');
            }

            this.steps = await response.json();
            this.currentStep = 0;

            // Start visualization
            await this.visualizeSteps();

        } catch (error) {
            console.error('Error during sorting:', error);
            alert('Error occurred during sorting. Please try again.');
        } finally {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.setArrayBtn.disabled = false;
            this.generateBtn.disabled = false;
        }
    }

    pauseSorting() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    resetVisualization() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        this.array = [...this.originalArray];
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.setArrayBtn.disabled = false;
        this.generateBtn.disabled = false;
        
        this.renderArray();
        this.updateStepInfo('Reset complete', 'Ready to start sorting again.');
        this.updateTreeVisualization('Tree visualization will appear here during sorting');
    }

    async visualizeSteps() {
        for (let i = 0; i < this.steps.length && this.isRunning; i++) {
            // Handle pause
            while (this.isPaused && this.isRunning) {
                await this.sleep(100);
            }

            if (!this.isRunning) break;

            const step = this.steps[i];
            this.currentStep = i;

            // Update array visualization
            this.renderArrayStep(step);
            
            // Update step information
            this.updateStepInfo(step.message, this.getStepDetails(step));
            
            // Update tree visualization
            this.updateTreeVisualization(this.getTreeDescription(step));

            // Wait for animation
            await this.sleep(this.animationSpeed);
        }

        if (this.isRunning) {
            this.updateStepInfo('Heap Sort Complete!', 'The array has been successfully sorted using heap sort algorithm.');
        }
    }

    renderArray() {
        this.arrayContainer.innerHTML = '';
        
        if (this.array.length === 0) return;

        const maxValue = Math.max(...this.array);
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.textContent = value;
            bar.style.height = `${(value / maxValue) * 200 + 40}px`;
            bar.id = `bar-${index}`;
            
            this.arrayContainer.appendChild(bar);
        });
    }

    renderArrayStep(step) {
        this.arrayContainer.innerHTML = '';
        
        if (!step.array || step.array.length === 0) return;

        const maxValue = Math.max(...step.array);
        
        step.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.textContent = value;
            bar.style.height = `${(value / maxValue) * 200 + 40}px`;
            bar.id = `bar-${index}`;
            
            // Apply highlighting based on step type
            if (step.comparing && step.comparing.includes(index)) {
                bar.classList.add('comparing');
            }
            
            if (step.swapping && step.swapping.includes(index)) {
                bar.classList.add('swapping');
            }
            
            if (step.sorted && step.sorted.includes(index)) {
                bar.classList.add('sorted');
            }
            
            this.arrayContainer.appendChild(bar);
        });
    }

    updateStepInfo(message, details) {
        this.stepDescription.textContent = message;
        this.stepDetails.textContent = details;
    }

    getStepDetails(step) {
        switch (step.type) {
            case 'start':
                return 'We begin by building a max heap from the unsorted array.';
            case 'comparing':
                return 'Comparing elements to maintain the heap property (parent ≥ children).';
            case 'swap_needed':
                return 'Swapping elements to restore the max heap property.';
            case 'heap_built':
                return 'Max heap is complete! Now we extract elements one by one.';
            case 'extract':
                return 'Moving the maximum element (root) to its final sorted position.';
            case 'swapped':
                return 'Element placed in sorted position. Rebuilding heap with remaining elements.';
            case 'completed':
                return 'All elements have been extracted and the array is now fully sorted!';
            default:
                return 'Processing heap sort algorithm...';
        }
    }

    getTreeDescription(step) {
        if (!step.heap_size) {
            return 'Sorting complete - no heap remaining';
        }
        
        const heapSize = step.heap_size;
        const phase = step.type === 'heap_built' || step.type === 'start' ? 'Building' : 'Extracting from';
        
        return `${phase} heap with ${heapSize} elements. The heap property ensures the largest element is always at the root.`;
    }

    updateTreeVisualization(description) {
        this.treeContainer.innerHTML = `<p>${description}</p>`;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new HeapSortVisualizer();
});