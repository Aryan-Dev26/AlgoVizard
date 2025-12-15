/**
 * AlgoVizard - Audio Controls Component
 * Author: Aryan Pravin Sahu
 * Provides user controls for the heavenly audio system
 */

class AudioControlPanel {
    constructor() {
        this.isVisible = false;
        this.createControlPanel();
        this.loadSettings();
    }

    createControlPanel() {
        // Create the floating audio control panel
        const panel = document.createElement('div');
        panel.id = 'audioControlPanel';
        panel.innerHTML = `
            <div class="audio-mini-toggle" id="audioMiniToggle">
                <span class="audio-icon" id="audioIcon">🎵</span>
            </div>
            <div class="audio-panel-content" id="audioPanelContent">
                <div class="audio-panel-header">
                    <span class="audio-panel-title">🎵 Heavenly Sounds</span>
                    <button class="audio-close-btn" id="audioCloseBtn">×</button>
                </div>
                
                <div class="audio-control-group">
                    <label class="audio-control-label">
                        <input type="checkbox" id="audioEnabled" checked>
                        <span class="audio-checkbox-custom"></span>
                        Enable Audio
                    </label>
                </div>
                
                <div class="audio-control-group">
                    <label class="audio-control-label">Volume</label>
                    <div class="audio-volume-control">
                        <span class="volume-icon">🔈</span>
                        <input type="range" id="audioVolume" min="0" max="100" value="30" class="audio-slider">
                        <span class="volume-icon">🔊</span>
                    </div>
                    <div class="volume-display" id="volumeDisplay">30%</div>
                </div>

                <div class="audio-control-group">
                    <label class="audio-control-label">Sound Preview</label>
                    <div class="audio-preview-buttons">
                        <button class="audio-preview-btn" data-sound="compare">Compare</button>
                        <button class="audio-preview-btn" data-sound="swap">Swap</button>
                        <button class="audio-preview-btn" data-sound="bucket">Bucket</button>
                        <button class="audio-preview-btn" data-sound="complete">Complete</button>
                    </div>
                </div>

                <div class="audio-info">
                    <p>🌧️ Experience algorithm sorting with beautiful rain-like sounds!</p>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #audioControlPanel {
                position: fixed;
                bottom: 20px;
                left: 20px;
                color: white;
                font-family: 'Inter', sans-serif;
                z-index: 1000;
                transition: all 0.3s ease;
            }

            .audio-mini-toggle {
                width: 50px;
                height: 50px;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(20px);
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .audio-mini-toggle:hover {
                background: rgba(0, 0, 0, 0.9);
                border-color: rgba(255, 255, 255, 0.4);
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
            }

            .audio-icon {
                font-size: 1.5rem;
                transition: all 0.3s ease;
            }

            .audio-panel-content {
                position: absolute;
                bottom: 60px;
                left: 0;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                min-width: 280px;
                max-width: 320px;
                transform: translateY(20px) scale(0.9);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }

            .audio-panel-content.expanded {
                transform: translateY(0) scale(1);
                opacity: 1;
                visibility: visible;
                pointer-events: all;
            }

            .audio-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .audio-panel-title {
                font-weight: 600;
                font-size: 1rem;
            }

            .audio-close-btn {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .audio-close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .audio-control-group {
                margin-bottom: 15px;
                padding: 0 20px;
            }

            .audio-control-group:last-of-type {
                padding-bottom: 20px;
            }

            .audio-control-label {
                display: flex;
                align-items: center;
                font-size: 0.9rem;
                font-weight: 500;
                margin-bottom: 10px;
                cursor: pointer;
            }

            .audio-control-label input[type="checkbox"] {
                display: none;
            }

            .audio-checkbox-custom {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 3px;
                margin-right: 8px;
                position: relative;
                transition: all 0.3s ease;
            }

            .audio-control-label input[type="checkbox"]:checked + .audio-checkbox-custom {
                background: #4CAF50;
                border-color: #4CAF50;
            }

            .audio-control-label input[type="checkbox"]:checked + .audio-checkbox-custom::after {
                content: '✓';
                position: absolute;
                top: -3px;
                left: 1px;
                color: white;
                font-size: 11px;
                font-weight: bold;
            }

            .audio-volume-control {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 5px;
            }

            .volume-icon {
                font-size: 0.8rem;
                opacity: 0.7;
            }

            .audio-slider {
                flex: 1;
                height: 4px;
                border-radius: 2px;
                background: rgba(255, 255, 255, 0.2);
                outline: none;
                -webkit-appearance: none;
                appearance: none;
            }

            .audio-slider::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #4CAF50;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .volume-display {
                font-size: 0.75rem;
                color: #4CAF50;
                font-weight: 600;
                text-align: center;
                min-width: 35px;
            }

            .audio-preview-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
            }

            .audio-preview-btn {
                padding: 6px 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: white;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .audio-preview-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }

            .audio-info {
                margin: 15px 20px 0;
                padding: 12px;
                background: rgba(76, 175, 80, 0.1);
                border-radius: 6px;
                border: 1px solid rgba(76, 175, 80, 0.3);
            }

            .audio-info p {
                margin: 0;
                font-size: 0.8rem;
                line-height: 1.3;
                opacity: 0.9;
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .audio-panel-content {
                    min-width: 260px;
                    max-width: calc(100vw - 40px);
                }
                
                .audio-mini-toggle {
                    width: 45px;
                    height: 45px;
                }
                
                .audio-icon {
                    font-size: 1.3rem;
                }
            }

            /* Pulse animation for audio activity */
            @keyframes audioPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .audio-mini-toggle.active {
                animation: audioPulse 0.6s ease-in-out;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(panel);

        this.bindEvents();
    }

    bindEvents() {
        // Toggle panel visibility
        document.getElementById('audioMiniToggle').addEventListener('click', () => {
            this.togglePanel();
        });

        document.getElementById('audioCloseBtn').addEventListener('click', () => {
            this.togglePanel();
        });

        // Enable/disable audio
        document.getElementById('audioEnabled').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            window.heavenlyAudio.setEnabled(enabled);
            this.saveSettings();
            
            // Update mini toggle icon
            const audioIcon = document.getElementById('audioIcon');
            audioIcon.textContent = enabled ? '🎵' : '🔇';
        });

        // Volume control
        document.getElementById('audioVolume').addEventListener('input', (e) => {
            const volume = parseInt(e.target.value) / 100;
            window.heavenlyAudio.setVolume(volume);
            document.getElementById('volumeDisplay').textContent = `${e.target.value}%`;
            this.saveSettings();
        });

        // Preview buttons
        document.querySelectorAll('.audio-preview-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.playPreviewSound(btn.dataset.sound);
            });
        });

        // Close panel when clicking outside (optional)
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('audioControlPanel');
            if (!panel.contains(e.target) && this.isVisible) {
                // Uncomment to auto-close: this.togglePanel();
            }
        });
    }

    togglePanel() {
        const content = document.getElementById('audioPanelContent');
        const miniToggle = document.getElementById('audioMiniToggle');
        
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            content.classList.add('expanded');
            miniToggle.style.transform = 'scale(0.9)';
        } else {
            content.classList.remove('expanded');
            miniToggle.style.transform = 'scale(1)';
        }
    }

    playPreviewSound(soundType) {
        if (!window.heavenlyAudio) return;

        switch (soundType) {
            case 'compare':
                window.heavenlyAudio.playCompareSound(45, 75);
                break;
            case 'swap':
                window.heavenlyAudio.playSwapSound(30, 60);
                break;
            case 'bucket':
                window.heavenlyAudio.playBucketSound(100, 3);
                break;
            case 'complete':
                window.heavenlyAudio.playCompletionSound();
                break;
        }
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('algoVizardAudioSettings') || '{}');
            
            if (settings.enabled !== undefined) {
                document.getElementById('audioEnabled').checked = settings.enabled;
                window.heavenlyAudio.setEnabled(settings.enabled);
                
                const audioIcon = document.getElementById('audioIcon');
                audioIcon.textContent = settings.enabled ? '🎵' : '🔇';
            }
            
            if (settings.volume !== undefined) {
                const volumeSlider = document.getElementById('audioVolume');
                volumeSlider.value = settings.volume * 100;
                document.getElementById('volumeDisplay').textContent = `${Math.round(settings.volume * 100)}%`;
                window.heavenlyAudio.setVolume(settings.volume);
            }
        } catch (error) {
            console.warn('Could not load audio settings:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                enabled: document.getElementById('audioEnabled').checked,
                volume: parseInt(document.getElementById('audioVolume').value) / 100
            };
            localStorage.setItem('algoVizardAudioSettings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Could not save audio settings:', error);
        }
    }

    // Show audio activity with pulse animation
    showAudioActivity() {
        const miniToggle = document.getElementById('audioMiniToggle');
        if (miniToggle) {
            miniToggle.classList.add('active');
            setTimeout(() => {
                miniToggle.classList.remove('active');
            }, 600);
        }
    }
}

// Initialize audio controls when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure audio engine is ready
    setTimeout(() => {
        window.audioControlPanel = new AudioControlPanel();
    }, 500);
});