// Heap Sort Visualization
// Author: Aryan Pravin Sahu

class HeapSortVisualizer {
    constructor() {
        this.array = [64, 34, 25, 12, 22, 11, 90];
        this.originalArray = [...this.array];
        this.isRunning = false;
        this.isPaused = false;
        this.animationSpeed = 1000;
        this.currentStep = 0;
        this.steps = [];
        this.comparisons = 0;
        this.swaps = 0;
        this.heapSize = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderArray();
        this.updateInfo();
    }

    initializeElements() {
        // Input elements
        this.arrayInput = document.getElementById('arrayInput');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        
        // Button elements
        this.generateBtn = document.getElementById('generateBtn');
        this.setArrayBtn = document.getElementById('setArrayBtn');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.stepBtn = document.getElementById('stepBtn');
        
        // Display elements
        this.arrayContainer = document.getElementById('arrayContainer');
        this.stepInfo = document.getElementById('stepInfo');
        this.heapVisualization = document.getElementById('heapVisualization');
        this.heapTree = document.getElementById('heapTree');
        
        // Info elements
        this.currentPhase = document.getElementById('currentPhase');
        this.heapSizeDisplay = document.getElementById('heapSize');
        this.comparisonsDisplay = document.getElementById('comparisons');
        this.swapsDisplay = document.getElementById('swaps');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateRandomArray());
        this.setArrayBtn.addEventListener('click', () => this.setCustomArray());
        this.startBtn.addEventListener('click', () => this.startHeapSort());
        this.pauseBtn.addEventListener('click', () => this.pauseAnimation());
        this.resetBtn.addEventListener('click', () => this.resetVisualization());
        this.stepBtn.addEventListener('click', () => this.stepByStep());
        
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedValue.textContent = `${this.animationSpeed}ms`;
        });

        this.arrayInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setCustomArray();
            }
        });
    }

    generateRandomArray() {
        const size = Math.floor(Math.random() * 6) + 5; // 5-10 elements
        this.array = [];
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 90) + 10);
        }
        this.originalArray = [...this.array];
        this.arrayInput.value = this.array.join(', ');
        this.renderArray();
        this.resetVisualization();
    }

    setCustomArray() {
        try {
            const input = this.arrayInput.value.trim();
            if (!input) return;
            
            const numbers = input.split(',').map(num => {
                const parsed = parseInt(num.trim());
                if (isNaN(parsed)) throw new Error('Invalid number');
                return parsed;
            });
            
            if (numbers.length < 2) {
                alert('Please enter at least 2 numbers');
                return;
            }
            
            if (numbers.length > 15) {
                alert('Please enter no more than 15 numbers for better visualization');
                return;
            }
            
            this.array = numbers;
            this.originalArray = [...this.array];
            this.renderArray();
            this.resetVisualization();
        } catch (error) {
            alert('Please enter valid numbers separated by commas');
        }
    }

    async startHeapSort() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.disableControls();
        
        // Generate steps
        this.steps = await this.generateHeapSortSteps();
        this.currentStep = 0;
        this.comparisons = 0;
        this.swaps = 0;
        
        // Execute animation
        await this.executeSteps();
        
        this.isRunning = false;
        this.enableControls();
    }

    async generateHeapSortSteps() {
        return new Promise((resolve) => {
            // Simulate API call to backend
            fetch('/api/heap-sort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ array: this.originalArray })
            })
            .then(response => response.json())
            .then(data => resolve(data.steps))
            .catch(() => {
                // Fallback: generate steps locally
                resolve(this.generateStepsLocally());
            });
        });
    }

    generateStepsLocally() {
        const steps = [];
        const arr = [...this.originalArray];
        const n = arr.length;
        
        // Build max heap
        steps.push({
            type: 'info',
            message: 'Building max heap from array',
            array: [...arr],
            heap_size: n,
            comparing: [],
            swapping: [],
            sorted: []
        });
        
        // Build heap (rearrange array)
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapifySteps(arr, n, i, steps);
        }
        
        steps.push({
            type: 'heap_built',
            message: 'Max heap built successfully',
            array: [...arr],
            heap_size: n,
            comparing: [],
            swapping: [],
            sorted: []
        });
        
        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            steps.push({
                type: 'extract_max',
                message: `Moving maximum element ${arr[0]} to sorted position`,
                array: [...arr],
                heap_size: i + 1,
                comparing: [],
                swapping: [0, i],
                sorted: Array.from({length: n - i - 1}, (_, idx) => i + 1 + idx)
            });
            
            [arr[0], arr[i]] = [arr[i], arr[0]];
            
            steps.push({
                type: 'swapped',
                message: `Swapped ${arr[i]} to position ${i}`,
                array: [...arr],
                heap_size: i,
                comparing: [],
                swapping: [],
                sorted: Array.from({length: n - i}, (_, idx) => i + idx)
            });
            
            this.heapifySteps(arr, i, 0, steps);
        }
        
        steps.push({
            type: 'completed',
            message: 'Heap sort completed!',
            array: [...arr],
            heap_size: 0,
            comparing: [],
            swapping: [],
            sorted: Array.from({length: n}, (_, i) => i)
        });
        
        return steps;
    }

    heapifySteps(arr, n, i, steps) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < n) {
            steps.push({
                type: 'comparing',
                message: `Comparing parent ${arr[i]} with left child ${arr[left]}`,
                array: [...arr],
                heap_size: n,
                comparing: [i, left],
                swapping: [],
                sorted: []
            });
            
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            steps.push({
                type: 'comparing',
                message: `Comparing largest ${arr[largest]} with right child ${arr[right]}`,
                array: [...arr],
                heap_size: n,
                comparing: [largest, right],
                swapping: [],
                sorted: []
            });
            
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }
        
        if (largest !== i) {
            steps.push({
                type: 'heapify_swap',
                message: `Swapping ${arr[i]} with ${arr[largest]} to maintain heap property`,
                array: [...arr],
                heap_size: n,
                comparing: [],
                swapping: [i, largest],
                sorted: []
            });
            
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            
            steps.push({
                type: 'heapify_swapped',
                message: `Swapped successfully, continuing heapify`,
                array: [...arr],
                heap_size: n,
                comparing: [],
                swapping: [],
                sorted: []
            });
            
            this.heapifySteps(arr, n, largest, steps);
        }
    }

    async executeSteps() {
        for (let i = 0; i < this.steps.length && this.isRunning; i++) {
            if (this.isPaused) {
                await this.waitForResume();
            }
            
            const step = this.steps[i];
            this.currentStep = i;
            
            await this.visualizeStep(step);
            await this.sleep(this.animationSpeed);
        }
    }

    async visualizeStep(step) {
        this.array = [...step.array];
        this.heapSize = step.heap_size;
        
        // Update info
        this.updateStepInfo(step.message, this.getStepDetails(step));
        this.updateInfo();
        
        // Update phase
        if (step.type === 'info') {
            this.currentPhase.textContent = 'Building Heap';
        } else if (step.type === 'heap_built') {
            this.currentPhase.textContent = 'Heap Built';
        } else if (step.type.includes('extract')) {
            this.currentPhase.textContent = 'Extracting Max';
        } else if (step.type === 'completed') {
            this.currentPhase.textContent = 'Completed';
        } else {
            this.currentPhase.textContent = 'Heapifying';
        }
        
        // Count operations
        if (step.type === 'comparing') {
            this.comparisons++;
        } else if (step.type.includes('swap')) {
            this.swaps++;
        }
        
        this.renderArray(step.comparing, step.swapping, step.sorted);
        
        // Show heap visualization during heap building
        if (step.type === 'info' || step.type === 'heap_built' || step.type.includes('heapify')) {
            this.renderHeapTree();
        }
    }

    renderArray(comparing = [], swapping = [], sorted = []) {
        this.arrayContainer.innerHTML = '';
        
        const maxValue = Math.max(...this.array);
        const containerHeight = 250;
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.textContent = value;
            
            const height = (value / maxValue) * containerHeight;
            bar.style.height = height + 'px';
            
            // Apply states
            if (comparing.includes(index)) {
                bar.classList.add('comparing');
            }
            if (swapping.includes(index)) {
                bar.classList.add('swapping');
            }
            if (sorted.includes(index)) {
                bar.classList.add('sorted');
            }
            if (index === 0 && this.heapSize > 0) {
                bar.classList.add('heap-root');
            }
            
            this.arrayContainer.appendChild(bar);
        });
    }

    renderHeapTree() {
        if (this.heapSize <= 0) {
            this.heapVisualization.style.display = 'none';
            return;
        }
        
        this.heapVisualization.style.display = 'block';
        this.heapTree.innerHTML = '';
        
        const levels = Math.ceil(Math.log2(this.heapSize + 1));
        
        for (let level = 0; level < levels; level++) {
            const levelDiv = document.createElement('div');
            levelDiv.className = 'heap-level';
            
            const startIndex = Math.pow(2, level) - 1;
            const endIndex = Math.min(Math.pow(2, level + 1) - 1, this.heapSize);
            
            for (let i = startIndex; i < endIndex; i++) {
                const node = document.createElement('div');
                node.className = 'heap-node';
                node.textContent = this.array[i];
                
                if (i === 0) {
                    node.classList.add('active');
                }
                
                levelDiv.appendChild(node);
            }
            
            this.heapTree.appendChild(levelDiv);
        }
    }

    getStepDetails(step) {
        switch (step.type) {
            case 'info':
                return 'Converting the array into a max heap where parent nodes are larger than their children.';
            case 'comparing':
                return 'Comparing elements to maintain the heap property during heapification.';
            case 'heapify_swap':
                return 'Swapping elements to restore the max heap property.';
            case 'extract_max':
                return 'Moving the maximum element (root) to its final sorted position.';
            case 'heap_built':
                return 'Max heap construction complete. Now extracting elements in sorted order.';
            case 'completed':
                return 'All elements have been extracted and the array is now sorted.';
            default:
                return 'Processing heap sort algorithm step by step.';
        }
    }

    updateStepInfo(description, details) {
        const stepDescription = this.stepInfo.querySelector('.step-description');
        const stepDetails = this.stepInfo.querySelector('.step-details');
        
        stepDescription.textContent = description;
        stepDetails.textContent = details;
    }

    updateInfo() {
        this.heapSizeDisplay.textContent = this.heapSize;
        this.comparisonsDisplay.textContent = this.comparisons;
        this.swapsDisplay.textContent = this.swaps;
    }

    async pauseAnimation() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    async waitForResume() {
        return new Promise(resolve => {
            const checkResume = () => {
                if (!this.isPaused) {
                    resolve();
                } else {
                    setTimeout(checkResume, 100);
                }
            };
            checkResume();
        });
    }

    resetVisualization() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        this.comparisons = 0;
        this.swaps = 0;
        this.heapSize = this.array.length;
        
        this.array = [...this.originalArray];
        this.currentPhase.textContent = 'Ready';
        this.pauseBtn.textContent = 'Pause';
        
        this.renderArray();
        this.updateInfo();
        this.updateStepInfo('Heap Sort is ready to begin', 
                           'Enter an array of numbers and click "Start Heap Sort" to see the algorithm in action.');
        
        this.heapVisualization.style.display = 'none';
        this.enableControls();
    }

    async stepByStep() {
        if (!this.steps.length) {
            this.steps = await this.generateHeapSortSteps();
            this.currentStep = 0;
            this.comparisons = 0;
            this.swaps = 0;
        }
        
        if (this.currentStep < this.steps.length) {
            await this.visualizeStep(this.steps[this.currentStep]);
            this.currentStep++;
        }
        
        if (this.currentStep >= this.steps.length) {
            this.enableControls();
        }
    }

    disableControls() {
        this.generateBtn.disabled = true;
        this.setArrayBtn.disabled = true;
        this.startBtn.disabled = true;
        this.resetBtn.disabled = false;
        this.stepBtn.disabled = true;
        this.arrayInput.disabled = true;
    }

    enableControls() {
        this.generateBtn.disabled = false;
        this.setArrayBtn.disabled = false;
        this.startBtn.disabled = false;
        this.resetBtn.disabled = false;
        this.stepBtn.disabled = false;
        this.arrayInput.disabled = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new HeapSortVisualizer();
});