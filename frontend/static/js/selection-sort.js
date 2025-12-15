/**
 * AlgoVizard - Selection Sort Visualizer
 * Author: Aryan Pravin Sahu
 * Selection sort specific visualization logic with enhanced chalk effects
 */

class SelectionSortVisualizer {
    constructor() {
        this.algorithmSteps = [];
        this.currentStep = 0;
        this.algorithmName = 'selection-sort';
        
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

            if (stepData.current_min === index && stepData.current_min !== -1) {
                bar.classList.add('current-min');
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
            if (stepData.sorted_boundary > 0) {
                const boundaryPosition = stepData.sorted_boundary * (barWidth + barGap) - barGap / 2;
                boundary.style.left = `${boundaryPosition}px`;
                boundary.style.opacity = '1';
            } else {
                boundary.style.opacity = '0';
            }
        }
    }

    // ==================== SELECTION SORT SPECIFIC ANIMATIONS ====================
    
    async animateMinimumHighlight(index) {
        const bars = document.querySelectorAll('.array-bar');
        const bar = bars[index];
        const eraser = document.getElementById('eraser');

        if (!bar) return;

        // Check if school theme is active
        const currentTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
        
        if (currentTheme === 'school' && eraser) {
            // Position eraser near the new minimum element
            const barRect = bar.getBoundingClientRect();
            const containerRect = document.getElementById('arrayContainer').getBoundingClientRect();
            
            const eraserX = barRect.left - containerRect.left - 30;
            const eraserY = barRect.top - containerRect.top - 25;

            eraser.style.left = `${eraserX}px`;
            eraser.style.top = `${eraserY}px`;
            eraser.classList.add('active');

            // Brief eraser effect for highlighting new minimum
            await this.shared.sleep(200);

            // Clean up
            eraser.classList.remove('active');
        }
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

                // Special animation for new minimum found
                if (step.description && step.description.includes('New minimum found')) {
                    await this.animateMinimumHighlight(step.current_min);
                }

                await this.shared.sleep(this.shared.getSpeed());

                if (step.swapped && step.comparing && step.comparing.length === 2) {
                    // Enhanced eraser animation for school theme
                    const currentTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
                    if (currentTheme === 'school') {
                        // Use eraser animation for school theme during swaps
                        await this.shared.animateSwap(step.comparing[0], step.comparing[1]);
                    } else {
                        // Regular animation for college theme
                        await this.shared.sleep(this.shared.getSpeed() / 2);
                    }

                    // Play swap sound
                    if (step.comparing && step.comparing.length >= 2) {
                        const value1 = step.array[step.comparing[0]];
                        const value2 = step.array[step.comparing[1]];
                        if (window.heavenlyAudio) {
                            window.heavenlyAudio.playSwapSound(value1, value2);
                        }
                    }
                }

                this.currentStep = i;
            }

            if (!this.shared.shouldStop) {
                this.shared.playCompleteSound();
                this.shared.updateStepDescription('Selection sort complete! All elements are in their correct positions.');
                
                // Mark all as sorted
                const bars = document.querySelectorAll('.array-bar');
                bars.forEach(bar => {
                    bar.classList.remove('comparing', 'current-min');
                    bar.classList.add('sorted');
                });
                
                // Final chalk dust celebration effect for school theme
                const currentTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
                if (currentTheme === 'school') {
                    await this.celebrateCompletion();
                }
                
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

    async celebrateCompletion() {
        const bars = document.querySelectorAll('.array-bar');
        
        // Add chalk dust effect to all bars
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.animation = 'chalkCelebration 1s ease-in-out';
            }, index * 100);
        });

        await this.shared.sleep(1000);

        // Clean up animations
        bars.forEach(bar => {
            bar.style.animation = '';
        });
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
            current_min: -1,
            sorted_boundary: 0,
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

        // // Custom input button
        // const customBtn = document.getElementById('customBtn');
        // if (customBtn) {
        //     customBtn.addEventListener('click', () => {
        //         console.log('Custom button clicked'); // Debug log
        //         this.shared.toggleCustomInput();
        //     });
        // }

        // Set array button
        const setArrayBtn = document.getElementById('setArrayBtn');
        if (setArrayBtn) {
            setArrayBtn.addEventListener('click', () => {
                console.log('Set array button clicked'); // Debug log
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
        console.log('Initializing Selection Sort Visualizer');
        
        // Set up algorithm-specific event listeners
        this.setupEventListeners();
        
        // Display initial array
        this.resetVisualization();
        
        console.log('Selection Sort Visualizer ready with enhanced chalk effects');
    }
}

// Create and initialize selection sort visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for shared visualizer to be ready
    if (window.algoVizard) {
        const selectionSort = new SelectionSortVisualizer();
        selectionSort.initialize();
        
        // Make it globally accessible for debugging
        window.selectionSortVisualizer = selectionSort;
    } else {
        console.error('Shared visualizer not available');
    }
});