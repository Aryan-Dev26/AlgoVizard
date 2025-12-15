/**
 * AlgoVizard - Insertion Sort Visualizer
 * Author: Aryan Pravin Sahu
 * Insertion sort specific visualization logic
 */

class InsertionSortVisualizer {
    constructor() {
        this.algorithmSteps = [];
        this.currentStep = 0;
        this.algorithmName = 'insertion-sort';
        
        // Get reference to shared instance
        this.shared = window.algoVizard;
    }

    // ==================== VISUALIZATION METHODS ====================
    
    displayArray(stepData) {
        const container = document.getElementById('arrayContainer');
        const boundary = document.getElementById('sortedBoundary');
        const eraser = document.getElementById('eraser');

        // Clear existing bars (keep boundary and eraser)
        container.querySelectorAll('.array-bar').forEach(bar => bar.remove());

        const barWidth = 45;
        const barGap = 8;

        stepData.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${Math.max(value * 2.5, 30)}px`;
            bar.textContent = value;
            bar.setAttribute('data-index', index);

            // Apply styling based on step data
            if (stepData.sorted_boundary > index) {
                bar.classList.add('sorted');
            }

            if (stepData.current_element === index && stepData.current_element !== -1) {
                bar.classList.add('current-element');
            }

            if (stepData.comparing && stepData.comparing.includes(index)) {
                bar.classList.add('comparing');
            }

            if (stepData.swapped && stepData.comparing && stepData.comparing.includes(index)) {
                bar.classList.add('swapped');
            }

            container.appendChild(bar);
        });

        // Update sorted boundary position
        if (boundary) {
            if (stepData.sorted_boundary > 1) {
                const boundaryPosition = stepData.sorted_boundary * (barWidth + barGap) - barGap / 2;
                boundary.style.left = `${boundaryPosition}px`;
                boundary.style.opacity = '1';
            } else {
                boundary.style.opacity = '0';
            }
        }
    }

    // ==================== INSERTION SORT SPECIFIC ANIMATIONS ====================
    
    async animateShift(index) {
        const bars = document.querySelectorAll('.array-bar');
        const bar = bars[index];
        const eraser = document.getElementById('eraser');

        if (!bar) return;

        // Check if school theme is active
        const currentTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
        
        if (currentTheme === 'school' && eraser) {
            // Position eraser near the shifting element
            const barRect = bar.getBoundingClientRect();
            const containerRect = document.getElementById('arrayContainer').getBoundingClientRect();
            
            const eraserX = barRect.left - containerRect.left - 30;
            const eraserY = barRect.top - containerRect.top - 25;

            eraser.style.left = `${eraserX}px`;
            eraser.style.top = `${eraserY}px`;
            eraser.classList.add('active');

            // Erase animation for shift
            bar.classList.add('erasing');

            await this.shared.sleep(300);

            // Rewrite animation
            bar.classList.remove('erasing');
            bar.classList.add('rewriting');

            await this.shared.sleep(300);

            // Clean up
            bar.classList.remove('rewriting');
            eraser.classList.remove('active');
        }
    }
    
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

            for (let i = 0; i < this.algorithmSteps.length && !this.shared.shouldStop; i++) {
                const step = this.algorithmSteps[i];

                // Display current step
                this.displayArray(step);
                this.shared.updateStepDescription(step.description);
                this.shared.updateStepCounter(step.step, this.algorithmSteps.length - 1);

                // Play comparison sound
                if (step.comparing && step.comparing.length > 0) {
                    const value1 = step.array[step.comparing[0]];
                    const value2 = step.comparing.length > 1 ? step.array[step.comparing[1]] : value1;
                    if (window.heavenlyAudio) {
                        window.heavenlyAudio.playCompareSound(value1, value2);
                    }
                }

                await this.shared.sleep(this.shared.getSpeed());

                if (step.swapped && step.comparing && step.comparing.length >= 1) {
                    // Enhanced eraser animation for school theme
                    const currentTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
                    if (currentTheme === 'school') {
                        // Always use eraser animation for school theme during swaps/shifts
                        if (step.comparing.length === 2) {
                            await this.shared.animateSwap(step.comparing[0], step.comparing[1]);
                        } else {
                            // Single element shift - show eraser effect
                            await this.animateShift(step.comparing[0]);
                        }
                    } else {
                        // Regular animation for college theme
                        await this.shared.sleep(this.shared.getSpeed() / 2);
                    }

                    // Play swap sound
                    if (step.comparing && step.comparing.length >= 1) {
                        const value1 = step.array[step.comparing[0]];
                        const value2 = step.comparing.length > 1 ? step.array[step.comparing[1]] : value1;
                        if (window.heavenlyAudio) {
                            window.heavenlyAudio.playSwapSound(value1, value2);
                        }
                    }
                }

                this.currentStep = i;
            }

            if (!this.shared.shouldStop) {
                this.shared.playCompleteSound();
                this.shared.updateStepDescription('Insertion sort complete! All elements are in their correct positions.');
                
                // Mark all as sorted
                const bars = document.querySelectorAll('.array-bar');
                bars.forEach(bar => {
                    bar.classList.remove('comparing', 'current-element');
                    bar.classList.add('sorted');
                });
                
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

        const initialStep = {
            array: this.shared.currentArray,
            comparing: [],
            current_element: -1,
            sorted_boundary: 1,
            swapped: false
        };

        this.displayArray(initialStep);
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
                this.resetVisualization();
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
                    this.resetVisualization();
                    this.shared.logInteraction(this.algorithmName, 'custom_array_set', { 
                        array_size: this.shared.currentArray.length 
                    });
                }
            });
        }
    }

    // ==================== INITIALIZATION ====================
    
    initialize() {
        console.log('Initializing Insertion Sort Visualizer');
        
        // Set up algorithm-specific event listeners
        this.setupEventListeners();
        
        // Display initial array
        this.resetVisualization();
        
        console.log('Insertion Sort Visualizer ready');
    }
}

// Create and initialize insertion sort visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for shared visualizer to be ready
    if (window.algoVizard) {
        const insertionSort = new InsertionSortVisualizer();
        insertionSort.initialize();
        
        // Make it globally accessible for debugging
        window.insertionSortVisualizer = insertionSort;
    } else {
        console.error('Shared visualizer not available');
    }
});