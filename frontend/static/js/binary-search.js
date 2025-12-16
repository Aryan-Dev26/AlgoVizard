// Binary Search Visualization
// Author: Aryan Pravin Sahu

class BinarySearchVisualizer {
    constructor() {
        this.array = [];
        this.target = null;
        this.isSearching = false;
        this.animationSpeed = 1000;
        this.currentStep = 0;
        this.searchSteps = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateArray();
    }

    initializeElements() {
        // Control elements
        this.arrayInput = document.getElementById('arrayInput');
        this.targetInput = document.getElementById('targetInput');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        
        // Button elements
        this.generateBtn = document.getElementById('generateBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Visualization elements
        this.searchArray = document.getElementById('searchArray');
        this.searchPointers = document.getElementById('searchPointers');
        this.stepInfo = document.getElementById('stepInfo');
        this.resultSection = document.getElementById('resultSection');
        this.resultMessage = document.getElementById('resultMessage');
        this.resultDetails = document.getElementById('resultDetails');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateArray());
        this.searchBtn.addEventListener('click', () => this.startSearch());
        this.resetBtn.addEventListener('click', () => this.resetVisualization());
        
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedValue.textContent = `${this.animationSpeed}ms`;
        });

        // Allow Enter key to start search
        this.targetInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isSearching) {
                this.startSearch();
            }
        });
    }

    generateArray() {
        if (this.isSearching) return;

        const input = this.arrayInput.value.trim();
        if (!input) {
            alert('Please enter array values');
            return;
        }

        try {
            // Parse and sort the array
            this.array = input.split(',')
                .map(val => parseInt(val.trim()))
                .filter(val => !isNaN(val))
                .sort((a, b) => a - b);

            if (this.array.length === 0) {
                alert('Please enter valid numbers');
                return;
            }

            // Update the input to show sorted array
            this.arrayInput.value = this.array.join(', ');
            
            this.renderArray();
            this.resetVisualization();
            this.updateStepInfo('Array generated and sorted. Ready for binary search!', 
                              `Array has ${this.array.length} elements. Enter a target value and click "Start Search".`);
        } catch (error) {
            alert('Invalid input. Please enter comma-separated numbers.');
        }
    }

    renderArray() {
        this.searchArray.innerHTML = '';
        
        this.array.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.innerHTML = `
                <div class="value">${value}</div>
                <div class="index">[${index}]</div>
            `;
            element.dataset.index = index;
            element.dataset.value = value;
            this.searchArray.appendChild(element);
        });
    }

    async startSearch() {
        if (this.isSearching) return;

        const targetValue = parseInt(this.targetInput.value);
        if (isNaN(targetValue)) {
            alert('Please enter a valid target number');
            return;
        }

        this.target = targetValue;
        this.isSearching = true;
        this.currentStep = 0;
        
        // Disable controls
        this.searchBtn.disabled = true;
        this.generateBtn.disabled = true;
        this.searchBtn.textContent = 'Searching...';
        
        // Hide result section
        this.resultSection.style.display = 'none';
        
        // Generate search steps
        this.generateSearchSteps();
        
        // Execute search visualization
        await this.executeSearchSteps();
        
        // Re-enable controls
        this.searchBtn.disabled = false;
        this.generateBtn.disabled = false;
        this.searchBtn.textContent = 'Start Search';
        this.isSearching = false;
    }

    generateSearchSteps() {
        this.searchSteps = [];
        let left = 0;
        let right = this.array.length - 1;
        let found = false;
        let foundIndex = -1;

        while (left <= right && !found) {
            const mid = Math.floor((left + right) / 2);
            const midValue = this.array[mid];

            this.searchSteps.push({
                left,
                right,
                mid,
                midValue,
                target: this.target,
                comparison: midValue === this.target ? 'equal' : (midValue < this.target ? 'less' : 'greater'),
                action: midValue === this.target ? 'found' : (midValue < this.target ? 'search_right' : 'search_left')
            });

            if (midValue === this.target) {
                found = true;
                foundIndex = mid;
            } else if (midValue < this.target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        // Add final step if not found
        if (!found) {
            this.searchSteps.push({
                left,
                right,
                mid: -1,
                midValue: null,
                target: this.target,
                comparison: 'not_found',
                action: 'not_found'
            });
        }
    }

    async executeSearchSteps() {
        for (let i = 0; i < this.searchSteps.length; i++) {
            const step = this.searchSteps[i];
            
            // Play heavenly sounds based on step action
            this.playStepSound(step);
            
            await this.visualizeStep(step, i + 1);
            
            if (step.action === 'found' || step.action === 'not_found') {
                this.showResult(step.action === 'found', step.action === 'found' ? step.mid : -1);
                break;
            }
            
            await this.sleep(this.animationSpeed);
        }
    }

    async visualizeStep(step, stepNumber) {
        // Clear previous states
        this.clearArrayStates();
        
        // Update pointers
        this.updatePointers(step.left, step.mid, step.right);
        
        // Highlight current range
        this.highlightRange(step.left, step.right);
        
        // Highlight current middle element
        if (step.mid >= 0) {
            this.highlightElement(step.mid, 'current');
        }
        
        // Update step information
        this.updateStepInfoForStep(step, stepNumber);
        
        await this.sleep(this.animationSpeed / 2);
    }

    clearArrayStates() {
        const elements = this.searchArray.querySelectorAll('.array-element');
        elements.forEach(element => {
            element.classList.remove('current', 'eliminated', 'in-range', 'target');
        });
    }

    updatePointers(left, mid, right) {
        const pointers = this.searchPointers.querySelectorAll('.pointer');
        pointers[0].textContent = `Left: ${left >= 0 ? left : '-'}`;
        pointers[1].textContent = `Mid: ${mid >= 0 ? mid : '-'}`;
        pointers[2].textContent = `Right: ${right >= 0 ? right : '-'}`;
    }

    highlightRange(left, right) {
        const elements = this.searchArray.querySelectorAll('.array-element');
        elements.forEach((element, index) => {
            if (index >= left && index <= right) {
                element.classList.add('in-range');
            } else {
                element.classList.add('eliminated');
            }
        });
    }

    highlightElement(index, className) {
        const elements = this.searchArray.querySelectorAll('.array-element');
        if (elements[index]) {
            elements[index].classList.add(className);
        }
    }

    updateStepInfoForStep(step, stepNumber) {
        let description, details;

        if (step.action === 'found') {
            description = `🎉 Target Found!`;
            details = `Found ${step.target} at index ${step.mid} in ${stepNumber} step${stepNumber > 1 ? 's' : ''}!`;
        } else if (step.action === 'not_found') {
            description = `❌ Target Not Found`;
            details = `${step.target} is not in the array. Search completed in ${stepNumber - 1} steps.`;
        } else {
            description = `Step ${stepNumber}: Comparing ${step.target} with ${step.midValue} at index ${step.mid}`;
            
            if (step.comparison === 'equal') {
                details = `${step.target} == ${step.midValue}. Target found!`;
            } else if (step.comparison === 'less') {
                details = `${step.target} > ${step.midValue}. Search in right half (indices ${step.mid + 1} to ${step.right}).`;
            } else {
                details = `${step.target} < ${step.midValue}. Search in left half (indices ${step.left} to ${step.mid - 1}).`;
            }
        }

        this.updateStepInfo(description, details);
    }

    updateStepInfo(description, details) {
        const stepDescription = this.stepInfo.querySelector('.step-description');
        const stepDetails = this.stepInfo.querySelector('.step-details');
        
        stepDescription.textContent = description;
        stepDetails.textContent = details;
    }

    showResult(found, index) {
        this.resultSection.style.display = 'block';
        
        if (found) {
            this.resultSection.className = 'result-section found';
            this.resultMessage.textContent = `🎉 Success! Target ${this.target} found at index ${index}`;
            this.resultDetails.textContent = `Binary search efficiently found the target in O(log n) time complexity.`;
            
            // Highlight the found element
            this.highlightElement(index, 'target');
        } else {
            this.resultSection.className = 'result-section not-found';
            this.resultMessage.textContent = `❌ Target ${this.target} not found in array`;
            this.resultDetails.textContent = `The search space was eliminated completely, confirming the target is not present.`;
        }
    }

    resetVisualization() {
        if (this.isSearching) return;

        this.clearArrayStates();
        this.updatePointers(-1, -1, -1);
        this.updateStepInfo('Ready for binary search', 'Enter a target value and click "Start Search" to begin visualization.');
        this.resultSection.style.display = 'none';
        this.currentStep = 0;
        this.searchSteps = [];
    }

    playStepSound(step) {
        // Use heavenly audio system for binary search
        if (!window.heavenlyAudio) return;

        switch (step.action) {
            case 'search_left':
            case 'search_right':
                // Play comparison sound for search operations
                if (step.midValue !== null && step.target !== null) {
                    window.heavenlyAudio.playCompareSound(step.target, step.midValue);
                }
                break;
            case 'found':
                // Play completion sound when target is found
                window.heavenlyAudio.playCompletionSound();
                break;
            case 'not_found':
                // Play a gentle comparison sound for not found
                if (step.target !== null) {
                    window.heavenlyAudio.playCompareSound(step.target, step.target);
                }
                break;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new BinarySearchVisualizer();
});