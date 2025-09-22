/**
 * AlgoVizard - Shared Visualizer Functions (Updated)
 * Author: Aryan Pravin Sahu
 * Common functionality with improved theme management
 */

class AlgoVizardShared {
    constructor() {
        this.audioContext = null;
        this.isAudioEnabled = true;
        this.currentArray = [64, 34, 25, 12, 22, 11, 90];
        this.isRunning = false;
        this.shouldStop = false;
    }

    // ==================== AUDIO SYSTEM ====================
    
    initializeAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

    playCompareSound() {
        this.playSound(800, 0.1);
    }

    playSwapSound() {
        this.playSound(400, 0.2);
    }

    playCompleteSound() {
        setTimeout(() => this.playSound(523, 0.2), 0);
        setTimeout(() => this.playSound(659, 0.2), 200);
        setTimeout(() => this.playSound(784, 0.4), 400);
    }

    toggleSound() {
        this.initializeAudio();
        this.isAudioEnabled = !this.isAudioEnabled;
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.textContent = this.isAudioEnabled ? '🔊' : '🔇';
        }
    }

    // ==================== ARRAY MANAGEMENT ====================
    
    generateRandomArray() {
        this.currentArray = [];
        for (let i = 0; i < 7; i++) {
            this.currentArray.push(Math.floor(Math.random() * 90) + 10);
        }
        this.updateStepDescription('Random array generated! Click "Start Sorting" to begin.');
        return this.currentArray;
    }

    toggleCustomInput() {
        const section = document.getElementById('customInputSection');
        if (section) {
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
        }
    }

    setCustomArray() {
        const input = document.getElementById('customArrayInput');
        if (!input) return false;

        const numbers = input.value.split(',')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));

        if (numbers.length > 0 && numbers.length <= 10) {
            this.currentArray = numbers;
            this.updateStepDescription('Custom array set! Click "Start Sorting" to begin.');
            this.toggleCustomInput();
            input.value = '';
            return true;
        } else {
            alert('Please enter 1-10 valid numbers separated by commas');
            return false;
        }
    }

    // ==================== UI UTILITIES ====================
    
    updateStepDescription(text) {
        const stepDesc = document.getElementById('stepDescription');
        if (stepDesc) {
            stepDesc.textContent = text;
        }
    }

    updateStepCounter(current, total) {
        const stepCounter = document.getElementById('stepCounter');
        if (stepCounter) {
            stepCounter.textContent = `Step: ${current} of ${total}`;
        }
    }

    setButtonStates(isRunning) {
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        if (startBtn) startBtn.disabled = isRunning;
        if (stopBtn) stopBtn.disabled = !isRunning;
        
        this.isRunning = isRunning;
    }

    // ==================== SPEED CONTROL ====================
    
    getSpeed() {
        const slider = document.getElementById('speedSlider');
        return slider ? parseInt(slider.value) : 800;
    }

    updateSpeedDisplay() {
        const slider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        
        if (slider && speedValue) {
            speedValue.textContent = slider.value + 'ms';
        }
    }

    initializeSpeedControl() {
        const slider = document.getElementById('speedSlider');
        if (slider) {
            slider.addEventListener('input', () => this.updateSpeedDisplay());
            this.updateSpeedDisplay();
        }
    }

    // ==================== UTILITY FUNCTIONS ====================
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== IMPROVED THEME MANAGEMENT ====================
    
    async setTheme(theme) {
        if (!['college', 'school'].includes(theme)) return;

        // Update localStorage
        localStorage.setItem('algorithmVisualizerTheme', theme);

        // Send to server to set cookie
        try {
            await fetch('/api/set-theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ theme: theme })
            });
        } catch (error) {
            console.log('Theme sync to server failed:', error);
        }

        // Apply theme immediately
        this.applyTheme(theme);
    }

    applyTheme(theme) {
        const head = document.head;

        // Remove existing school theme
        const existingSchoolTheme = document.getElementById('school-theme');
        if (existingSchoolTheme) {
            existingSchoolTheme.remove();
        }

        if (theme === 'school') {
            // Add school theme CSS only if not already loaded by server
            if (!document.querySelector('link[href*="school-theme.css"]')) {
                const schoolThemeLink = document.createElement('link');
                schoolThemeLink.rel = 'stylesheet';
                schoolThemeLink.href = '/static/css/school-theme.css';
                schoolThemeLink.id = 'school-theme';
                head.appendChild(schoolThemeLink);
            }
        }

        // Update body class
        document.body.classList.remove('college-theme', 'school-theme');
        document.body.classList.add(theme + '-theme');
    }

    initializeTheme() {
        // Get theme from localStorage
        const savedTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
        
        // Apply theme without flash (server should have loaded correct CSS)
        this.applyTheme(savedTheme);
        
        // Sync with server if needed
        this.syncThemeWithServer(savedTheme);
    }

    async syncThemeWithServer(theme) {
        try {
            await fetch('/api/set-theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ theme: theme })
            });
        } catch (error) {
            console.log('Theme sync failed:', error);
        }
    }

    // ==================== ERASER ANIMATION (SCHOOL THEME) ====================
    
    async animateSwap(index1, index2) {
        const bars = document.querySelectorAll('.array-bar');
        const bar1 = bars[index1];
        const bar2 = bars[index2];
        const eraser = document.getElementById('eraser');

        if (!bar1 || !bar2) return;

        // Check if school theme is active
        const currentTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
        
        if (currentTheme === 'school' && eraser) {
            // Position eraser between the two bars
            const bar1Rect = bar1.getBoundingClientRect();
            const bar2Rect = bar2.getBoundingClientRect();
            const containerRect = document.getElementById('arrayContainer').getBoundingClientRect();
            
            const eraserX = ((bar1Rect.left + bar2Rect.left) / 2) - containerRect.left - 30;
            const eraserY = Math.min(bar1Rect.top, bar2Rect.top) - containerRect.top - 30;

            eraser.style.left = `${eraserX}px`;
            eraser.style.top = `${eraserY}px`;
            eraser.classList.add('active');

            // Erase animation
            bar1.classList.add('erasing');
            bar2.classList.add('erasing');

            await this.sleep(400);

            // Swap the values
            const temp = bar1.textContent;
            bar1.textContent = bar2.textContent;
            bar2.textContent = temp;

            // Rewrite animation
            bar1.classList.remove('erasing');
            bar2.classList.remove('erasing');
            bar1.classList.add('rewriting');
            bar2.classList.add('rewriting');

            await this.sleep(400);

            // Clean up
            bar1.classList.remove('rewriting', 'comparing');
            bar2.classList.remove('rewriting', 'comparing');
            eraser.classList.remove('active');
        }
    }

    // ==================== API UTILITIES ====================
    
    async fetchAlgorithmSteps(algorithmName, customArray = null) {
        try {
            const options = {
                method: customArray ? 'POST' : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (customArray) {
                options.body = JSON.stringify({ array: customArray });
            }

            const response = await fetch(`/api/${algorithmName}`, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
            
        } catch (error) {
            console.error('Error fetching algorithm steps:', error);
            
            // Fallback to GET request if POST fails
            if (customArray) {
                try {
                    const fallbackResponse = await fetch(`/api/${algorithmName}`);
                    return await fallbackResponse.json();
                } catch (fallbackError) {
                    throw new Error(`Algorithm API unavailable: ${error.message}`);
                }
            }
            throw error;
        }
    }

    // ==================== INTERACTION TRACKING ====================
    
    logInteraction(algorithm, action, data = null) {
        // Log user interaction for analytics
        const interaction = {
            timestamp: new Date().toISOString(),
            algorithm: algorithm,
            action: action,
            data: data
        };
        
        // Send to backend analytics
        fetch('/api/analytics/interaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(interaction)
        }).catch(error => {
            console.log('Analytics logging failed:', error);
        });
    }

    // ==================== INITIALIZATION ====================
    
    initialize(algorithmName) {
        console.log(`Initializing AlgoVizard for ${algorithmName}`);
        
        // Initialize all systems
        this.initializeAudio();
        this.initializeTheme();
        this.initializeSpeedControl();
        
        // Log page view
        this.logInteraction(algorithmName, 'page_view');
        
        // Set up event listeners for common controls
        this.setupEventListeners(algorithmName);
        
        console.log('AlgoVizard initialization complete');
    }

    setupEventListeners(algorithmName) {
        // Sound toggle
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => this.toggleSound());
        }

        // Random array button
        const randomBtn = document.getElementById('randomBtn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.generateRandomArray();
                this.logInteraction(algorithmName, 'random_array_generated');
            });
        }

        // Custom input button
        const customBtn = document.getElementById('customBtn');
        if (customBtn) {
            customBtn.addEventListener('click', () => {
                this.toggleCustomInput();
            });
        }

        // Set array button
        const setArrayBtn = document.getElementById('setArrayBtn');
        if (setArrayBtn) {
            setArrayBtn.addEventListener('click', () => {
                if (this.setCustomArray()) {
                    this.logInteraction(algorithmName, 'custom_array_set', { 
                        array_size: this.currentArray.length 
                    });
                }
            });
        }
    }
}

// Create global instance
window.algoVizard = new AlgoVizardShared();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const algorithmName = document.body.getAttribute('data-algorithm') || 'unknown';
    window.algoVizard.initialize(algorithmName);
});