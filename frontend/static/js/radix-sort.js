/**
 * AlgoVizard - Radix Sort Visualization
 * Author: Aryan Pravin Sahu
 * Non-comparison sorting algorithm that sorts by individual digits
 */

class RadixSortVisualizer {
    constructor() {
        this.currentArray = [170, 45, 75, 90, 2, 802, 24, 66];
        this.originalArray = [...this.currentArray];
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        this.animationSpeed = 500;
        
        this.initializeEventListeners();
        this.renderArray();
        this.initializeBuckets();
    }

    initializeEventListeners() {
        // Array input controls
        document.getElementById('arrayInput').addEventListener('input', (e) => {
            this.handleArrayInput(e.target.value);
        });

        document.getElementById('setArrayBtn').addEventListener('click', () => {
            this.setArrayFromInput();
        });

        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateRandomArray();
        });

        // Animation controls
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startSorting();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseSorting();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetVisualization();
        });

        // Speed control
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.animationSpeed = 1100 - (parseInt(e.target.value) * 100);
        });
    }

    handleArrayInput(value) {
        // Real-time validation for positive integers only
        const numbers = value.split(',').map(s => s.trim()).filter(s => s !== '');
        const validNumbers = numbers.filter(s => /^\d+$/.test(s) && parseInt(s) >= 0);
        
        if (validNumbers.length !== numbers.length && numbers.length > 0) {
            document.getElementById('stepDetails').textContent = 
                'Note: Radix sort works only with non-negative integers. Invalid entries will be ignored.';
        } else {
            document.getElementById('stepDetails').textContent = 
                'Enter an array of positive integers and click "Start Radix Sort" to see the algorithm in action.';
        }
    }

    setArrayFromInput() {
        const input = document.getElementById('arrayInput').value;
        const numbers = input.split(',')
            .map(s => s.trim())
            .filter(s => s !== '' && /^\d+$/.test(s))
            .map(s => parseInt(s));

        if (numbers.length === 0) {
            alert('Please enter valid positive integers separated by commas.');
            return;
        }

        if (numbers.length > 15) {
            alert('Please enter 15 or fewer numbers for better visualization.');
            return;
        }

        this.currentArray = numbers;
        this.originalArray = [...numbers];
        this.renderArray();
        this.resetVisualization();
        
        document.getElementById('stepDescription').textContent = 'Array updated successfully';
        document.getElementById('stepDetails').textContent = 
            `Array contains ${numbers.length} elements. Ready to start Radix Sort.`;
    }

    generateRandomArray() {
        const length = Math.floor(Math.random() * 6) + 6; // 6-11 elements
        this.currentArray = [];
        
        for (let i = 0; i < length; i++) {
            // Generate numbers with varying digit counts for better demonstration
            const digitCount = Math.floor(Math.random() * 3) + 1; // 1-3 digits
            const max = Math.pow(10, digitCount) - 1;
            const min = digitCount === 1 ? 0 : Math.pow(10, digitCount - 1);
            this.currentArray.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        
        this.originalArray = [...this.currentArray];
        document.getElementById('arrayInput').value = this.currentArray.join(', ');
        this.renderArray();
        this.resetVisualization();
        
        document.getElementById('stepDescription').textContent = 'Random array generated';
        document.getElementById('stepDetails').textContent = 
            `Generated ${length} random numbers with varying digit counts.`;
    }

    async startSorting() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        
        // Update UI
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('setArrayBtn').disabled = true;
        document.getElementById('generateBtn').disabled = true;

        try {
            // Fetch steps from backend
            const response = await fetch('/api/radix-sort', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ array: this.currentArray })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.steps = await response.json();
            this.currentStep = 0;

            // Start visualization
            await this.visualizeSteps();

        } catch (error) {
            console.error('Error fetching radix sort steps:', error);
            document.getElementById('stepDescription').textContent = 'Error occurred';
            document.getElementById('stepDetails').textContent = 
                'Failed to fetch sorting steps. Please try again.';
        }

        // Reset UI
        this.isRunning = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('setArrayBtn').disabled = false;
        document.getElementById('generateBtn').disabled = false;
    }

    pauseSorting() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    resetVisualization() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        
        this.currentArray = [...this.originalArray];
        this.renderArray();
        this.clearBuckets();
        
        // Reset UI
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('setArrayBtn').disabled = false;
        document.getElementById('generateBtn').disabled = false;
        
        document.getElementById('stepDescription').textContent = 'Ready to start Radix Sort';
        document.getElementById('stepDetails').textContent = 
            'Enter an array of positive integers and click "Start Radix Sort" to see the algorithm in action.';
        document.getElementById('digitInfo').textContent = '';
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
            
            await this.renderStep(step);
            await this.sleep(this.animationSpeed);
        }
    }

    async renderStep(step) {
        // Update step information
        document.getElementById('stepDescription').textContent = step.message;
        
        // Update digit information
        if (step.digit_position > 0) {
            document.getElementById('digitInfo').textContent = 
                `Processing digit position ${step.digit_position} of ${step.max_digits}`;
        } else {
            document.getElementById('digitInfo').textContent = '';
        }

        // Play heavenly sounds based on step type
        this.playStepSound(step);

        // Update array visualization
        this.renderArray(step.array, step.processing_number, step.collecting_number);
        
        // Update buckets
        this.renderBuckets(step.buckets, step.current_digit, step.processing_number, step.collecting_number);
        
        // Update step details based on step type
        this.updateStepDetails(step);
    }

    updateStepDetails(step) {
        let details = '';
        
        switch (step.type) {
            case 'initialization':
                details = `Maximum number has ${step.max_digits} digits. We'll process each digit position.`;
                break;
            case 'digit_processing':
                details = `Now sorting by digit at position ${step.digit_position} (from right, starting at 1).`;
                break;
            case 'placing_in_bucket':
                details = `Number ${step.processing_number} goes to bucket ${step.current_digit} based on its digit at position ${step.digit_position}.`;
                break;
            case 'buckets_filled':
                details = `All numbers have been placed in buckets based on digit position ${step.digit_position}.`;
                break;
            case 'collecting_from_bucket':
                details = `Collecting ${step.collecting_number} from bucket ${step.current_digit} to rebuild the array.`;
                break;
            case 'digit_complete':
                details = `Digit position ${step.digit_position} processing complete. Array is now sorted by this digit.`;
                break;
            case 'completed':
                details = 'Radix sort completed! The array is now fully sorted.';
                break;
            default:
                details = step.message;
        }
        
        document.getElementById('stepDetails').textContent = details;
    }

    renderArray(array = this.currentArray, processingNumber = null, collectingNumber = null) {
        const container = document.getElementById('arrayContainer');
        container.innerHTML = '';

        if (array.length === 0) {
            container.innerHTML = '<div style="color: rgba(255,255,255,0.7);">Array is empty</div>';
            return;
        }

        const maxValue = Math.max(...array);
        const maxHeight = 250;

        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${Math.max((value / maxValue) * maxHeight, 30)}px`;
            bar.textContent = value;
            bar.id = `bar-${index}`;

            // Highlight processing or collecting numbers
            if (value === processingNumber) {
                bar.classList.add('processing');
            } else if (value === collectingNumber) {
                bar.classList.add('in-bucket');
            }

            container.appendChild(bar);
        });
    }

    initializeBuckets() {
        const container = document.getElementById('bucketsContainer');
        container.innerHTML = '';

        for (let i = 0; i < 10; i++) {
            const bucket = document.createElement('div');
            bucket.className = 'bucket';
            bucket.id = `bucket-${i}`;

            const label = document.createElement('div');
            label.className = 'bucket-label';
            label.textContent = i;

            const items = document.createElement('div');
            items.className = 'bucket-items';
            items.id = `bucket-items-${i}`;

            bucket.appendChild(label);
            bucket.appendChild(items);
            container.appendChild(bucket);
        }
    }

    renderBuckets(buckets, activeDigit = null, processingNumber = null, collectingNumber = null) {
        for (let i = 0; i < 10; i++) {
            const bucket = document.getElementById(`bucket-${i}`);
            const itemsContainer = document.getElementById(`bucket-items-${i}`);
            
            // Clear previous items
            itemsContainer.innerHTML = '';
            
            // Remove active class
            bucket.classList.remove('active');
            
            // Add active class if this is the current digit
            if (activeDigit === i) {
                bucket.classList.add('active');
            }
            
            // Add items to bucket
            if (buckets && buckets[i]) {
                buckets[i].forEach((number, index) => {
                    const item = document.createElement('div');
                    item.className = 'bucket-item';
                    item.textContent = number;
                    
                    // Highlight new items being added
                    if (number === processingNumber) {
                        item.classList.add('new');
                    }
                    
                    itemsContainer.appendChild(item);
                });
            }
        }
    }

    clearBuckets() {
        for (let i = 0; i < 10; i++) {
            const itemsContainer = document.getElementById(`bucket-items-${i}`);
            const bucket = document.getElementById(`bucket-${i}`);
            
            if (itemsContainer) itemsContainer.innerHTML = '';
            if (bucket) bucket.classList.remove('active');
        }
    }

    playStepSound(step) {
        // Only play sounds if audio engine is available
        if (!window.heavenlyAudio) return;

        switch (step.type) {
            case 'placing_in_bucket':
                if (step.processing_number !== undefined && step.current_digit !== undefined) {
                    window.heavenlyAudio.playBucketSound(step.processing_number, step.current_digit);
                }
                break;
                
            case 'collecting_from_bucket':
                if (step.collecting_number !== undefined) {
                    window.heavenlyAudio.playCollectSound(step.collecting_number);
                }
                break;
                
            case 'digit_processing':
                // Gentle chime for starting a new digit
                window.heavenlyAudio.playCompareSound(step.digit_position * 100, step.max_digits * 100);
                break;
                
            case 'completed':
                // Beautiful completion chord
                window.heavenlyAudio.playCompletionSound();
                break;
                
            case 'buckets_filled':
                // Soft harmony when all numbers are in buckets
                window.heavenlyAudio.playCompareSound(200, 300);
                break;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizer when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RadixSortVisualizer();
});