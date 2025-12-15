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
        
        // Dual view control elements
        this.showIndicesBtn = document.getElementById('showIndicesBtn');
        this.showLevelsBtn = document.getElementById('showLevelsBtn');
        this.showValuesBtn = document.getElementById('showValuesBtn');
        
        // Display options
        this.showIndices = false;
        this.showLevels = false;
        this.showValues = true;
        
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

        // Dual view control listeners
        this.showIndicesBtn.addEventListener('click', () => this.toggleDisplay('indices'));
        this.showLevelsBtn.addEventListener('click', () => this.toggleDisplay('levels'));
        this.showValuesBtn.addEventListener('click', () => this.toggleDisplay('values'));
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
        
        // Always show heap visualization with enhanced tree
        this.renderHeapTree();
        this.updateHeapTreeStates(step.comparing, step.swapping, step.sorted);
    }

    renderArray(comparing = [], swapping = [], sorted = []) {
        this.arrayContainer.innerHTML = '';
        
        const maxValue = Math.max(...this.array);
        const containerHeight = 250;
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.textContent = value;
            bar.setAttribute('data-index', index);
            
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
            
            // Add click handler to sync with heap tree
            bar.addEventListener('click', () => {
                this.highlightNodePath(index);
                this.highlightArrayBar(index);
            });
            
            this.arrayContainer.appendChild(bar);
        });
        
        // Update heap tree to match array state
        this.renderHeapTree();
        this.updateHeapTreeStates(comparing, swapping, sorted);
    }

    highlightArrayBar(index) {
        // Remove previous highlights
        document.querySelectorAll('.array-bar').forEach(bar => {
            bar.classList.remove('highlighted');
        });
        
        // Highlight selected bar
        const selectedBar = document.querySelector(`[data-index="${index}"]`);
        if (selectedBar) {
            selectedBar.classList.add('highlighted');
            selectedBar.style.transform = 'translateY(-10px) scale(1.05)';
            selectedBar.style.boxShadow = '0 10px 25px rgba(79, 172, 254, 0.6)';
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
                selectedBar.classList.remove('highlighted');
                selectedBar.style.transform = '';
                selectedBar.style.boxShadow = '';
            }, 2000);
        }
    }

    renderHeapTree() {
        if (this.heapSize <= 0) {
            this.heapVisualization.style.display = 'none';
            return;
        }
        
        this.heapVisualization.style.display = 'block';
        const svg = document.getElementById('heapTreeSvg');
        svg.innerHTML = '';
        
        // Calculate tree dimensions
        const svgWidth = 800;
        const svgHeight = 400;
        const nodeRadius = 25;
        const levels = Math.ceil(Math.log2(this.heapSize + 1));
        
        // Calculate positions for each node
        const positions = this.calculateNodePositions(svgWidth, svgHeight, nodeRadius, levels);
        
        // Draw edges first (so they appear behind nodes)
        this.drawHeapEdges(svg, positions);
        
        // Draw nodes
        this.drawHeapNodes(svg, positions, nodeRadius);
    }

    calculateNodePositions(svgWidth, svgHeight, nodeRadius, levels) {
        const positions = {};
        const levelHeight = (svgHeight - 2 * nodeRadius) / Math.max(1, levels - 1);
        
        for (let i = 0; i < this.heapSize; i++) {
            const level = Math.floor(Math.log2(i + 1));
            const positionInLevel = i - (Math.pow(2, level) - 1);
            const nodesInLevel = Math.pow(2, level);
            
            // Calculate x position
            const levelWidth = svgWidth - 2 * nodeRadius;
            const spacing = levelWidth / Math.max(1, nodesInLevel - 1);
            let x;
            
            if (nodesInLevel === 1) {
                x = svgWidth / 2;
            } else {
                x = nodeRadius + positionInLevel * spacing;
            }
            
            // Calculate y position
            const y = nodeRadius + level * levelHeight;
            
            positions[i] = { x, y, level };
        }
        
        return positions;
    }

    drawHeapEdges(svg, positions) {
        for (let i = 0; i < this.heapSize; i++) {
            const leftChild = 2 * i + 1;
            const rightChild = 2 * i + 2;
            
            // Draw edge to left child
            if (leftChild < this.heapSize) {
                this.createEdge(svg, positions[i], positions[leftChild], `edge-${i}-${leftChild}`);
            }
            
            // Draw edge to right child
            if (rightChild < this.heapSize) {
                this.createEdge(svg, positions[i], positions[rightChild], `edge-${i}-${rightChild}`);
            }
        }
    }

    createEdge(svg, parent, child, id) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', parent.x);
        line.setAttribute('y1', parent.y);
        line.setAttribute('x2', child.x);
        line.setAttribute('y2', child.y);
        line.setAttribute('class', 'heap-edge');
        line.setAttribute('id', id);
        svg.appendChild(line);
    }

    drawHeapNodes(svg, positions, nodeRadius) {
        for (let i = 0; i < this.heapSize; i++) {
            const pos = positions[i];
            
            // Create node group
            const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            nodeGroup.setAttribute('class', 'heap-node');
            nodeGroup.setAttribute('id', `heap-node-${i}`);
            
            // Create circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', nodeRadius);
            circle.setAttribute('class', 'heap-node-circle');
            
            // Create value text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y);
            text.setAttribute('class', 'heap-node-text');
            
            // Set text content based on display option
            if (this.showIndices) {
                text.textContent = i;
            } else if (this.showLevels) {
                text.textContent = `L${pos.level}`;
            } else {
                text.textContent = this.array[i];
            }
            
            // Create index text (small number above)
            const indexText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            indexText.setAttribute('x', pos.x);
            indexText.setAttribute('y', pos.y - nodeRadius - 8);
            indexText.setAttribute('class', 'heap-node-index');
            indexText.textContent = i;
            
            nodeGroup.appendChild(circle);
            nodeGroup.appendChild(text);
            nodeGroup.appendChild(indexText);
            
            // Add click handler for educational purposes
            nodeGroup.addEventListener('click', () => this.highlightNodePath(i));
            
            svg.appendChild(nodeGroup);
        }
    }

    highlightNodePath(nodeIndex) {
        // Clear previous highlights
        document.querySelectorAll('.heap-node').forEach(node => {
            node.classList.remove('path-highlight');
        });
        
        // Highlight path from root to selected node
        let current = nodeIndex;
        while (current >= 0) {
            const nodeElement = document.getElementById(`heap-node-${current}`);
            if (nodeElement) {
                nodeElement.classList.add('path-highlight');
            }
            
            // Move to parent
            current = Math.floor((current - 1) / 2);
            if (current < 0) break;
        }
        
        // Show node information
        this.showNodeInfo(nodeIndex);
    }

    showNodeInfo(nodeIndex) {
        const value = this.array[nodeIndex];
        const parent = nodeIndex > 0 ? Math.floor((nodeIndex - 1) / 2) : null;
        const leftChild = 2 * nodeIndex + 1 < this.heapSize ? 2 * nodeIndex + 1 : null;
        const rightChild = 2 * nodeIndex + 2 < this.heapSize ? 2 * nodeIndex + 2 : null;
        
        let info = `Node ${nodeIndex}: ${value}`;
        if (parent !== null) info += `\nParent: ${this.array[parent]}`;
        if (leftChild !== null) info += `\nLeft Child: ${this.array[leftChild]}`;
        if (rightChild !== null) info += `\nRight Child: ${this.array[rightChild]}`;
        
        // Update step info with node details
        this.updateStepInfo(`Node ${nodeIndex} selected`, info);
    }

    updateHeapTreeStates(comparing = [], swapping = [], sorted = []) {
        // Update node states in the tree
        for (let i = 0; i < this.heapSize; i++) {
            const nodeElement = document.getElementById(`heap-node-${i}`);
            if (!nodeElement) continue;
            
            // Clear previous states
            nodeElement.classList.remove('comparing', 'swapping', 'sorted', 'heap-root');
            
            // Apply current states
            if (comparing.includes(i)) {
                nodeElement.classList.add('comparing');
            }
            if (swapping.includes(i)) {
                nodeElement.classList.add('swapping');
            }
            if (sorted.includes(i)) {
                nodeElement.classList.add('sorted');
            }
            if (i === 0 && this.heapSize > 0) {
                nodeElement.classList.add('heap-root');
            }
            
            // Update node value
            const textElement = nodeElement.querySelector('.heap-node-text');
            if (textElement) {
                textElement.textContent = this.array[i];
            }
        }
        
        // Highlight edges between comparing nodes
        this.highlightActiveEdges(comparing, swapping);
    }

    highlightActiveEdges(comparing, swapping) {
        // Clear previous edge highlights
        document.querySelectorAll('.heap-edge').forEach(edge => {
            edge.classList.remove('active', 'heap-property');
        });
        
        // Highlight edges between active nodes
        const activeNodes = [...comparing, ...swapping];
        activeNodes.forEach(nodeIndex => {
            const parent = Math.floor((nodeIndex - 1) / 2);
            if (parent >= 0 && activeNodes.includes(parent)) {
                const edge = document.getElementById(`edge-${parent}-${nodeIndex}`);
                if (edge) {
                    edge.classList.add('active');
                }
            }
        });
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

    toggleDisplay(type) {
        // Reset all buttons
        document.querySelectorAll('.view-controls .control-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Update display options
        this.showIndices = type === 'indices';
        this.showLevels = type === 'levels';
        this.showValues = type === 'values';

        // Update active button
        if (type === 'indices') this.showIndicesBtn.classList.add('active');
        if (type === 'levels') this.showLevelsBtn.classList.add('active');
        if (type === 'values') this.showValuesBtn.classList.add('active');

        // Re-render the heap tree with new display options
        this.renderHeapTree();
        this.updateHeapTreeStates();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new HeapSortVisualizer();
});