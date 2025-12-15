/**
 * AlgoVizard - Heavenly Audio Engine
 * Author: Aryan Pravin Sahu
 * Creates beautiful rain-like sounds for algorithm visualizations
 */

class HeavenlyAudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isEnabled = true;
        this.volume = 0.3;
        
        // Rain-like sound parameters
        this.baseFrequency = 220; // A3 note
        this.pentatonicScale = [1, 9/8, 5/4, 3/2, 5/3, 2]; // Pentatonic ratios for harmony
        this.reverbBuffer = null;
        
        // Sound types for different actions
        this.soundTypes = {
            compare: { frequency: 440, duration: 0.15, type: 'gentle' },
            swap: { frequency: 330, duration: 0.25, type: 'droplet' },
            place: { frequency: 550, duration: 0.2, type: 'chime' },
            complete: { frequency: 660, duration: 0.8, type: 'harmony' },
            bucket: { frequency: 380, duration: 0.18, type: 'soft' },
            collect: { frequency: 480, duration: 0.22, type: 'flow' }
        };
        
        this.initializeAudio();
    }

    async initializeAudio() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            this.masterGain.connect(this.audioContext.destination);
            
            // Create reverb for heavenly effect
            await this.createReverbBuffer();
            
            console.log('🎵 Heavenly Audio Engine initialized');
        } catch (error) {
            console.warn('Audio not available:', error);
            this.isEnabled = false;
        }
    }

    async createReverbBuffer() {
        if (!this.audioContext) return;
        
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 2; // 2 second reverb
        const buffer = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Create a decaying noise for reverb
                const decay = Math.pow(1 - i / length, 2);
                channelData[i] = (Math.random() * 2 - 1) * decay * 0.1;
            }
        }
        
        this.reverbBuffer = buffer;
    }

    // Resume audio context (required for user interaction)
    async resumeAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // Play comparison sound (gentle rain drops)
    playCompareSound(value1, value2) {
        if (!this.isEnabled || !this.audioContext) return;
        
        this.resumeAudio();
        this.showActivity();
        
        const frequency = this.getFrequencyFromValue(value1, 'compare');
        this.createRainDrop(frequency, 0.15, 0.3);
        
        // Add a subtle harmony for the second value
        setTimeout(() => {
            const frequency2 = this.getFrequencyFromValue(value2, 'compare');
            this.createRainDrop(frequency2, 0.1, 0.2);
        }, 50);
    }

    // Play swap sound (water droplets merging)
    playSwapSound(value1, value2) {
        if (!this.isEnabled || !this.audioContext) return;
        
        this.resumeAudio();
        this.showActivity();
        
        const freq1 = this.getFrequencyFromValue(value1, 'swap');
        const freq2 = this.getFrequencyFromValue(value2, 'swap');
        
        // Create a beautiful harmony
        this.createHarmony([freq1, freq2], 0.25, 0.4);
    }

    // Play bucket placement sound (gentle chimes)
    playBucketSound(value, bucketIndex) {
        if (!this.isEnabled || !this.audioContext) return;
        
        this.resumeAudio();
        this.showActivity();
        
        // Map bucket index to pentatonic scale
        const scaleIndex = bucketIndex % this.pentatonicScale.length;
        const frequency = this.baseFrequency * this.pentatonicScale[scaleIndex];
        
        this.createChime(frequency, 0.18, 0.35);
    }

    // Play collection sound (flowing water)
    playCollectSound(value) {
        if (!this.isEnabled || !this.audioContext) return;
        
        this.resumeAudio();
        this.showActivity();
        
        const frequency = this.getFrequencyFromValue(value, 'collect');
        this.createFlow(frequency, 0.22, 0.3);
    }

    // Play completion sound (heavenly chord)
    playCompletionSound() {
        if (!this.isEnabled || !this.audioContext) return;
        
        this.resumeAudio();
        this.showActivity();
        
        // Play a beautiful major chord
        const rootFreq = this.baseFrequency;
        const chord = [
            rootFreq,           // Root
            rootFreq * 5/4,     // Major third
            rootFreq * 3/2,     // Perfect fifth
            rootFreq * 2        // Octave
        ];
        
        this.createHeavenlyChord(chord, 1.5, 0.5);
    }

    // Get frequency based on value (maps numbers to musical notes)
    getFrequencyFromValue(value, type) {
        const soundConfig = this.soundTypes[type];
        const baseFreq = soundConfig.frequency;
        
        // Map value to a pleasant frequency range
        const normalizedValue = Math.log(value + 1) / Math.log(1000); // Normalize to 0-1
        const scaleIndex = Math.floor(normalizedValue * this.pentatonicScale.length);
        const safeIndex = Math.max(0, Math.min(scaleIndex, this.pentatonicScale.length - 1));
        
        return baseFreq * this.pentatonicScale[safeIndex];
    }

    // Create a gentle rain drop sound
    createRainDrop(frequency, duration, volume) {
        const now = this.audioContext.currentTime;
        
        // Oscillator for the tone
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // Configure oscillator
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, now + duration);
        
        // Configure filter for softness
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 2, now);
        filter.Q.setValueAtTime(1, now);
        
        // Configure envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        // Connect nodes
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // Add reverb
        if (this.reverbBuffer) {
            const convolver = this.audioContext.createConvolver();
            const reverbGain = this.audioContext.createGain();
            convolver.buffer = this.reverbBuffer;
            reverbGain.gain.setValueAtTime(0.2, now);
            
            filter.connect(reverbGain);
            reverbGain.connect(convolver);
            convolver.connect(this.masterGain);
        }
        
        // Start and stop
        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    // Create a chime sound for bucket operations
    createChime(frequency, duration, volume) {
        const now = this.audioContext.currentTime;
        
        // Create multiple harmonics for richness
        const harmonics = [1, 2, 3, 4];
        const volumes = [1, 0.5, 0.3, 0.2];
        
        harmonics.forEach((harmonic, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency * harmonic, now);
            
            const harmonicVolume = volume * volumes[index];
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(harmonicVolume, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
        });
    }

    // Create flowing water sound for collection
    createFlow(frequency, duration, volume) {
        const now = this.audioContext.currentTime;
        
        // Create a flowing effect with multiple oscillators
        for (let i = 0; i < 3; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequency * (1 + i * 0.1), now);
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(frequency * 1.5, now);
            filter.Q.setValueAtTime(2, now);
            
            const flowVolume = volume * (0.8 - i * 0.2);
            gainNode.gain.setValueAtTime(0, now + i * 0.02);
            gainNode.gain.linearRampToValueAtTime(flowVolume, now + 0.05 + i * 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start(now + i * 0.02);
            oscillator.stop(now + duration);
        }
    }

    // Create harmony for swaps
    createHarmony(frequencies, duration, volume) {
        const now = this.audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createRainDrop(freq, duration * 0.8, volume * 0.7);
            }, index * 30);
        });
    }

    // Create heavenly chord for completion
    createHeavenlyChord(frequencies, duration, volume) {
        const now = this.audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, now);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(freq * 3, now);
            filter.Q.setValueAtTime(0.5, now);
            
            const chordVolume = volume * (1 - index * 0.1);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(chordVolume, now + 0.1);
            gainNode.gain.linearRampToValueAtTime(chordVolume * 0.7, now + duration * 0.7);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start(now + index * 0.05);
            oscillator.stop(now + duration);
        });
    }

    // Volume control
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        }
    }

    // Enable/disable audio
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    // Get current settings
    getSettings() {
        return {
            enabled: this.isEnabled,
            volume: this.volume
        };
    }

    // Show activity indicator
    showActivity() {
        // Trigger activity indicator in audio controls if available
        if (window.audioControlPanel && window.audioControlPanel.showAudioActivity) {
            window.audioControlPanel.showAudioActivity();
        }
    }
}

// Create global audio engine instance
window.heavenlyAudio = new HeavenlyAudioEngine();