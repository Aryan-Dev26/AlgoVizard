/**
 * AlgoVizard - Bubble Sort Visualizer
 * Author: Aryan Pravin Sahu
 * Bubble sort specific visualization logic
 */

class BubbleSortVisualizer {
    constructor() {
        this.algorithmSteps = [];
        this.currentStep = 0;
        this.algorithmName = 'bubble-sort';
        
        // Get reference to shared instance
        this.shared = window.algoVizard;
    }

    // ==================== VISUALIZATION METHODS ====================
    
    displayArray(arrayData, comparing = [], swapped = false) {
        const container = document.getElementById('arrayContainer');
        const eraser = document.getElementById('eraser');
        
        // Clear existing bars but keep eraser
        const existingBars = container.querySelectorAll('.array-bar');
        existingBars.forEach(bar => bar.remove());

        arrayData.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${Math.max(value * 2.5, 30)}px`;
            bar.textContent = value;
            bar.setAttribute('data-index', index);

            if (comparing.includes(index)) {
                bar.classList.add('comparing');
            }

            if (swapped && comparing.includes(index)) {
                bar.classList.add('swapped');
            }

            container.appendChild(bar);
        });
    }

    // ==================== ALGORITHM EXECUTION ====================
    
    async startVisualization() {
        if (this.shared.isRunning) return;

        this.shared.setButtonStates(true);
        this.shared.updateStepDescription('Loading algorithm steps...');
        this.shared.logInteraction(this.algorithmName, 'visualization_started');

        try {
            this.algorithmSteps = await this.shared.fetchAlgorithmSteps(
                this.algorithmName, 
                this.shared.currentArray
            );

            let workingArray = [...this.shared.currentArray];

            for (let i = 0; i < this.algorithmSteps.length && !this.shared.shouldStop; i++) {
                const step = this.algorithmSteps[i];

                // Play comparison sound
                if (step.comparing && step.comparing.length >= 2) {
                    const value1 = workingArray[step.comparing[0]];
                    const value2 = workingArray[step.comparing[1]];
                    if (window.heavenlyAudio) {
                        window.heavenlyAudio.playCompareSound(value1, value2);
                    }
                }

                // Display comparison
                this.displayArray(workingArray, step.comparing, false);
                this.shared.updateStepDescription(step.description);
                this.shared.updateStepCounter(step.step, this.algorithmSteps.length - 1);

                // Play comparison sound
                if (step.comparing && step.comparing.length > 0) {
                    this.shared.playCompareSound();
                }

                await this.shared.sleep(this.shared.getSpeed());

                if (step.swapped && step.comparing && step.comparing.length === 2) {
                    // Use enhanced swap animation for school theme
                    const currentTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
                    if (currentTheme === 'school') {
                        await this.shared.animateSwap(step.comparing[0], step.comparing[1]);
                    } else {
                        // Play swap sound
                        if (step.comparing && step.comparing.length >= 2) {
                            const value1 = step.array[step.comparing[0]];
                            const value2 = step.array[step.comparing[1]];
                            if (window.heavenlyAudio) {
                                window.heavenlyAudio.playSwapSound(value1, value2);
                            }
                        }

                        // Regular animation for college theme
                        this.displayArray(step.array, step.comparing, true);
                        await this.shared.sleep(this.shared.getSpeed() / 2);
                    }

                    // Update working array to match the swap
                    workingArray = [...step.array];
                    this.shared.playSwapSound();
                }

                this.currentStep = i;
            }

            if (!this.shared.shouldStop) {
                this.shared.playCompleteSound();
                this.shared.updateStepDescription('Sorting complete! All elements are now in their correct positions.');
                
                // Mark all as sorted
                const bars = document.querySelectorAll('.array-bar');
                bars.forEach(bar => bar.classList.add('sorted'));
                
                // Play completion sound
                if (window.heavenlyAudio) {
                    window.heavenlyAudio.playCompletionSound();
                }
                
                this.shared.logInteraction(this.algorithmName, 'visualization_completed');
            }

        } catch (error) {
            console.error('Error:', error);
            this.shared.updateStepDescription(`Error loading algorithm: ${error.message}`);
        }

        this.shared.setButtonStates(false);
    }

    stopVisualization() {
        this.shared.shouldStop = true;
        this.shared.setButtonStates(false);
        this.shared.updateStepDescription('Visualization stopped');
        this.shared.logInteraction(this.algorithmName, 'visualization_stopped');
    }

    resetVisualization() {
        if (this.shared.isRunning) {
            this.stopVisualization();
        }

        this.displayArray(this.shared.currentArray);
        this.shared.updateStepDescription('Click "Start Sorting" to begin visualization');
        this.shared.updateStepCounter(0, 0);
        this.currentStep = 0;
        this.shared.logInteraction(this.algorithmName, 'visualization_reset');
    }

    // ==================== EVENT HANDLERS ====================
    
    setupEventListeners() {
        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startVisualization());
        }

        // Stop button
        const stopBtn = document.getElementById('stopBtn');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopVisualization());
        }

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetVisualization());
        }

        // Random array button
        const randomBtn = document.getElementById('randomBtn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.shared.generateRandomArray();
                this.displayArray(this.shared.currentArray);
                this.shared.logInteraction(this.algorithmName, 'random_array_generated');
            });
        }

        // Custom input button
        // const customBtn = document.getElementById('customBtn');
        // if (customBtn) {
        //     customBtn.addEventListener('click', () => {
        //         this.shared.toggleCustomInput();
        //     });
        // }

        // Set array button
        const setArrayBtn = document.getElementById('setArrayBtn');
        if (setArrayBtn) {
            setArrayBtn.addEventListener('click', () => {
                if (this.shared.setCustomArray()) {
                    this.displayArray(this.shared.currentArray);
                    this.shared.logInteraction(this.algorithmName, 'custom_array_set', { 
                        array_size: this.shared.currentArray.length 
                    });
                }
            });
        }
    }

    // ==================== INITIALIZATION ====================
    
    initialize() {
        console.log('Initializing Bubble Sort Visualizer');
        
        // Set up algorithm-specific event listeners
        this.setupEventListeners();
        
        // Display initial array
        this.displayArray(this.shared.currentArray);
        
        console.log('Bubble Sort Visualizer ready');
    }
}
function showCustomInput() {
    const customSection = document.getElementById('customInputSection');
    customSection.style.display = customSection.style.display === 'none' ? 'block' : 'none';
}

function setCustomArray() {
    const input = document.getElementById('customArrayInput');
    const arrayStr = input.value.trim();
    
    if (!arrayStr) {
        alert('Please enter some numbers');
        return;
    }
    
    try {
        // Parse the input (expecting comma-separated numbers)
        const customArray = arrayStr.split(',').map(num => {
            const parsed = parseInt(num.trim());
            if (isNaN(parsed)) throw new Error('Invalid number');
            return parsed;
        });
        
        if (customArray.length < 1 || customArray.length > 10) {
            alert('Please enter between 1 and 10 numbers');
            return;
        }
        
        // Update the global array and reset visualization
        currentArray = customArray;
        currentStep = 0;
        resetVisualization();
        
        // Hide the input section
        document.getElementById('customInputSection').style.display = 'none';
        input.value = '';
        
    } catch (error) {
        alert('Please enter valid numbers separated by commas (e.g., 5,3,8,1,9)');
    }
}

// Create and initialize bubble sort visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for shared visualizer to be ready
    if (window.algoVizard) {
        const bubbleSort = new BubbleSortVisualizer();
        bubbleSort.initialize();
        
        // Make it globally accessible for debugging
        window.bubbleSortVisualizer = bubbleSort;
    } else {
        console.error('Shared visualizer not available');
    }
});