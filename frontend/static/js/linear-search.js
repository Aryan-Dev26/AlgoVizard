// Linear Search Visualization
// Author: Aryan Pravin Sahu

class LinearSearchVisualizer {
    constructor() {
        this.array = [];
        this.target = null;
        this.isSearching = false;
        this.animationSpeed = 800;
        this.currentIndex = -1;
        this.comparisons = 0;
        
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
        this.searchProgress = document.getElementById('searchProgress');
        this.stepInfo = document.getElementById('stepInfo');
        this.resultSection = document.getElementById('resultSection');
        this.resultMessage = document.getElementById('resultMessage');
        this.resultDetails = document.getElementById('resultDetails');
        
        // Progress elements
        this.currentIndexDisplay = document.getElementById('currentIndexDisplay');
        this.comparisonsCount = document.getElementById('comparisonsCount');
        this.searchStatus = document.getElementById('searchStatus');
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
            // Parse the array (no sorting needed for linear search)
            this.array = input.split(',')
                .map(val => parseInt(val.trim()))
                .filter(val => !isNaN(val));

            if (this.array.length === 0) {
                alert('Please enter valid numbers');
                return;
            }

            this.renderArray();
            this.resetVisualization();
            this.updateStepInfo('Array generated successfully. Ready for linear search!', 
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
        this.currentIndex = -1;
        this.comparisons = 0;
        
        // Disable controls
        this.searchBtn.disabled = true;
        this.generateBtn.disabled = true;
        this.searchBtn.textContent = 'Searching...';
        
        // Hide result section
        this.resultSection.style.display = 'none';
        
        // Update status
        this.updateSearchStatus('Searching');
        
        // Execute search visualization
        const result = await this.executeLinearSearch();
        
        // Show result
        this.showResult(result.found, result.index);
        
        // Re-enable controls
        this.searchBtn.disabled = false;
        this.generateBtn.disabled = false;
        this.searchBtn.textContent = 'Start Search';
        this.isSearching = false;
    }

    async executeLinearSearch() {
        for (let i = 0; i < this.array.length; i++) {
            // Update current index
            this.currentIndex = i;
            this.updateProgress();
            
            // Highlight current element
            this.highlightCurrentElement(i);
            
            // Update step info
            this.updateStepInfoForIndex(i);
            
            // Increment comparisons
            this.comparisons++;
            this.updateProgress();
            
            // Play comparison sound
            if (window.heavenlyAudio) {
                window.heavenlyAudio.playCompareSound(this.target, this.array[i]);
            }
            
            // Wait for animation
            await this.sleep(this.animationSpeed);
            
            // Check if target found
            if (this.array[i] === this.target) {
                this.highlightElement(i, 'target');
                // Play completion sound when found
                if (window.heavenlyAudio) {
                    window.heavenlyAudio.playCompletionSound();
                }
                return { found: true, index: i };
            } else {
                // Mark as checked
                this.highlightElement(i, 'checked');
            }
            
            // Small delay between checks
            await this.sleep(this.animationSpeed / 3);
        }
        
        return { found: false, index: -1 };
    }

    highlightCurrentElement(index) {
        // Clear previous current highlighting
        const elements = this.searchArray.querySelectorAll('.array-element');
        elements.forEach(el => el.classList.remove('current'));
        
        // Highlight current element
        if (elements[index]) {
            elements[index].classList.add('current');
        }
    }

    highlightElement(index, className) {
        const elements = this.searchArray.querySelectorAll('.array-element');
        if (elements[index]) {
            elements[index].classList.remove('current');
            elements[index].classList.add(className);
        }
    }

    updateProgress() {
        this.currentIndexDisplay.textContent = this.currentIndex >= 0 ? this.currentIndex : '-';
        this.comparisonsCount.textContent = this.comparisons;
    }

    updateSearchStatus(status) {
        this.searchStatus.textContent = status;
    }

    updateStepInfoForIndex(index) {
        const currentValue = this.array[index];
        const description = `Step ${index + 1}: Checking element at index ${index}`;
        const details = `Comparing ${this.target} with ${currentValue}. ${
            currentValue === this.target 
                ? '✅ Match found!' 
                : `❌ ${this.target} ≠ ${currentValue}, continue searching...`
        }`;
        
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
            this.resultDetails.textContent = `Linear search found the target after ${this.comparisons} comparison${this.comparisons > 1 ? 's' : ''}.`;
            this.updateSearchStatus('Found');
        } else {
            this.resultSection.className = 'result-section not-found';
            this.resultMessage.textContent = `❌ Target ${this.target} not found in array`;
            this.resultDetails.textContent = `Searched through all ${this.array.length} elements with ${this.comparisons} comparisons.`;
            this.updateSearchStatus('Not Found');
        }
    }

    resetVisualization() {
        if (this.isSearching) return;

        // Clear all highlighting
        const elements = this.searchArray.querySelectorAll('.array-element');
        elements.forEach(element => {
            element.classList.remove('current', 'checked', 'target');
        });
        
        // Reset progress
        this.currentIndex = -1;
        this.comparisons = 0;
        this.updateProgress();
        this.updateSearchStatus('Ready');
        
        // Reset step info
        this.updateStepInfo('Ready for linear search', 'Enter a target value and click "Start Search" to begin visualization.');
        
        // Hide result section
        this.resultSection.style.display = 'none';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new LinearSearchVisualizer();
});