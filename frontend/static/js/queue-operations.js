// Queue Operations Visualization
// Author: Aryan Pravin Sahu

class QueueVisualizer {
    constructor() {
        this.queue = [];
        this.isAnimating = false;
        this.maxQueueSize = 8; // Prevent overflow in visualization
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateVisualization();
    }

    initializeElements() {
        // Control elements
        this.enqueueInput = document.getElementById('enqueueInput');
        this.multiInput = document.getElementById('multiInput');
        
        // Button elements
        this.enqueueBtn = document.getElementById('enqueueBtn');
        this.dequeueBtn = document.getElementById('dequeueBtn');
        this.frontBtn = document.getElementById('frontBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.enqueueMultipleBtn = document.getElementById('enqueueMultipleBtn');
        this.demoBtn = document.getElementById('demoBtn');
        
        // Visualization elements
        this.queueVisualization = document.getElementById('queueVisualization');
        this.emptyMessage = document.getElementById('emptyMessage');
        this.stepInfo = document.getElementById('stepInfo');
        
        // Info elements
        this.queueSize = document.getElementById('queueSize');
        this.frontElement = document.getElementById('frontElement');
        this.rearElement = document.getElementById('rearElement');
        this.queueStatus = document.getElementById('queueStatus');
    }

    setupEventListeners() {
        this.enqueueBtn.addEventListener('click', () => this.enqueue());
        this.dequeueBtn.addEventListener('click', () => this.dequeue());
        this.frontBtn.addEventListener('click', () => this.front());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.enqueueMultipleBtn.addEventListener('click', () => this.enqueueMultiple());
        this.demoBtn.addEventListener('click', () => this.runDemo());

        // Allow Enter key to enqueue
        this.enqueueInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isAnimating) {
                this.enqueue();
            }
        });
    }

    async enqueue(value = null) {
        if (this.isAnimating) return;

        const inputValue = value || this.enqueueInput.value.trim();
        if (!inputValue) {
            alert('Please enter a value to enqueue');
            return;
        }

        if (this.queue.length >= this.maxQueueSize) {
            alert(`Queue overflow! Maximum size is ${this.maxQueueSize}`);
            return;
        }

        this.isAnimating = true;
        this.disableControls();

        // Add to queue array
        this.queue.push(inputValue);

        // Create visual element
        const element = this.createQueueElement(inputValue);
        element.classList.add('enqueuing');

        // Hide empty message if this is the first element
        if (this.queue.length === 1) {
            this.emptyMessage.style.display = 'none';
        }

        // Add to visualization
        this.queueVisualization.appendChild(element);

        // Update step info
        this.updateStepInfo(`Enqueued "${inputValue}" to the rear of the queue`, 
                           `Element added to the rear of the queue. Queue size is now ${this.queue.length}.`);

        // Wait for animation
        await this.sleep(600);

        // Remove animation class
        element.classList.remove('enqueuing');
        this.updatePointers();
        this.updateVisualization();

        // Clear input
        if (!value) {
            this.enqueueInput.value = '';
        }

        this.enableControls();
        this.isAnimating = false;
    }

    async dequeue() {
        if (this.isAnimating) return;

        if (this.queue.length === 0) {
            alert('Queue underflow! Queue is empty');
            this.updateStepInfo('Cannot dequeue from empty queue', 'Queue underflow error - no elements to remove.');
            return;
        }

        this.isAnimating = true;
        this.disableControls();

        // Get the value being dequeued
        const dequeuedValue = this.queue.shift();

        // Get the front visual element
        const elements = this.queueVisualization.querySelectorAll('.queue-element');
        const frontElement = elements[0];

        if (frontElement) {
            // Add dequeuing animation
            frontElement.classList.add('dequeuing');

            // Update step info
            this.updateStepInfo(`Dequeued "${dequeuedValue}" from the front of the queue`, 
                               `Element removed from the front of the queue. Queue size is now ${this.queue.length}.`);

            // Wait for animation
            await this.sleep(600);

            // Remove the element
            frontElement.remove();
        }

        // Show empty message if queue is now empty
        if (this.queue.length === 0) {
            this.emptyMessage.style.display = 'flex';
        }

        this.updatePointers();
        this.updateVisualization();

        this.enableControls();
        this.isAnimating = false;
    }

    front() {
        if (this.queue.length === 0) {
            alert('Queue is empty - nothing at front');
            this.updateStepInfo('Cannot view front of empty queue', 'No elements in the queue to view.');
            return;
        }

        const frontValue = this.queue[0];
        
        // Highlight the front element temporarily
        const elements = this.queueVisualization.querySelectorAll('.queue-element');
        const frontElement = elements[0];
        
        if (frontElement) {
            frontElement.style.transform = 'scale(1.1)';
            frontElement.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.6)';
            
            setTimeout(() => {
                frontElement.style.transform = '';
                frontElement.style.boxShadow = '';
            }, 1000);
        }

        this.updateStepInfo(`Front element: "${frontValue}"`, 
                           'Front operation views the first element without removing it from the queue.');
    }

    clear() {
        if (this.isAnimating) return;

        this.queue = [];
        
        // Remove all queue elements
        const elements = this.queueVisualization.querySelectorAll('.queue-element');
        elements.forEach(element => element.remove());

        // Show empty message
        this.emptyMessage.style.display = 'flex';

        this.updateVisualization();
        this.updateStepInfo('Queue cleared', 'All elements have been removed from the queue.');
    }

    async enqueueMultiple() {
        if (this.isAnimating) return;

        const input = this.multiInput.value.trim();
        if (!input) {
            alert('Please enter comma-separated values');
            return;
        }

        const values = input.split(',').map(val => val.trim()).filter(val => val);
        
        if (values.length === 0) {
            alert('Please enter valid values');
            return;
        }

        if (this.queue.length + values.length > this.maxQueueSize) {
            alert(`Cannot enqueue ${values.length} elements. Would exceed maximum queue size of ${this.maxQueueSize}`);
            return;
        }

        for (const value of values) {
            await this.enqueue(value);
            await this.sleep(300); // Small delay between enqueues
        }

        this.multiInput.value = '';
    }

    async runDemo() {
        if (this.isAnimating) return;

        // Clear queue first
        this.clear();
        await this.sleep(500);

        const demoOperations = [
            { op: 'enqueue', value: 'A' },
            { op: 'enqueue', value: 'B' },
            { op: 'enqueue', value: 'C' },
            { op: 'front' },
            { op: 'dequeue' },
            { op: 'enqueue', value: 'D' },
            { op: 'front' },
            { op: 'dequeue' },
            { op: 'dequeue' },
        ];

        this.updateStepInfo('Running Queue Demo', 'Demonstrating various queue operations...');

        for (const operation of demoOperations) {
            await this.sleep(1000);
            
            if (operation.op === 'enqueue') {
                await this.enqueue(operation.value);
            } else if (operation.op === 'dequeue') {
                await this.dequeue();
            } else if (operation.op === 'front') {
                this.front();
            }
            
            await this.sleep(800);
        }

        this.updateStepInfo('Demo completed', 'Queue demonstration finished. Try your own operations!');
    }

    createQueueElement(value) {
        const element = document.createElement('div');
        element.className = 'queue-element';
        element.textContent = value;
        element.dataset.value = value;
        return element;
    }

    updatePointers() {
        // Remove all pointer classes
        const elements = this.queueVisualization.querySelectorAll('.queue-element');
        elements.forEach(el => {
            el.classList.remove('front', 'rear');
            // Remove existing pointers
            const pointers = el.querySelectorAll('.queue-pointer');
            pointers.forEach(p => p.remove());
        });

        if (elements.length > 0) {
            // Add front pointer to first element
            elements[0].classList.add('front');
            const frontPointer = document.createElement('div');
            frontPointer.className = 'queue-pointer front-pointer';
            frontPointer.textContent = 'FRONT';
            elements[0].appendChild(frontPointer);

            // Add rear pointer to last element
            const lastIndex = elements.length - 1;
            elements[lastIndex].classList.add('rear');
            const rearPointer = document.createElement('div');
            rearPointer.className = 'queue-pointer rear-pointer';
            rearPointer.textContent = 'REAR';
            elements[lastIndex].appendChild(rearPointer);
        }
    }

    updateVisualization() {
        // Update info display
        this.queueSize.textContent = this.queue.length;
        this.frontElement.textContent = this.queue.length > 0 ? this.queue[0] : 'Empty';
        this.rearElement.textContent = this.queue.length > 0 ? this.queue[this.queue.length - 1] : 'Empty';
        
        // Update status
        if (this.queue.length === 0) {
            this.queueStatus.textContent = 'Empty';
        } else if (this.queue.length >= this.maxQueueSize) {
            this.queueStatus.textContent = 'Full';
        } else {
            this.queueStatus.textContent = 'Active';
        }

        // Update button states
        this.dequeueBtn.disabled = this.queue.length === 0;
        this.frontBtn.disabled = this.queue.length === 0;
        this.clearBtn.disabled = this.queue.length === 0;
        this.enqueueBtn.disabled = this.queue.length >= this.maxQueueSize;
        this.enqueueMultipleBtn.disabled = this.queue.length >= this.maxQueueSize;
    }

    updateStepInfo(description, details) {
        const stepDescription = this.stepInfo.querySelector('.step-description');
        const stepDetails = this.stepInfo.querySelector('.step-details');
        
        stepDescription.textContent = description;
        stepDetails.textContent = details;
    }

    disableControls() {
        this.enqueueBtn.disabled = true;
        this.dequeueBtn.disabled = true;
        this.frontBtn.disabled = true;
        this.clearBtn.disabled = true;
        this.enqueueMultipleBtn.disabled = true;
        this.demoBtn.disabled = true;
    }

    enableControls() {
        this.demoBtn.disabled = false;
        this.updateVisualization(); // This will set the correct disabled states
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new QueueVisualizer();
});