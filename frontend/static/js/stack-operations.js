// Stack Operations Visualization
// Author: Aryan Pravin Sahu

class StackVisualizer {
    constructor() {
        this.stack = [];
        this.isAnimating = false;
        this.maxStackSize = 10; // Prevent overflow in visualization
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateVisualization();
    }

    initializeElements() {
        // Control elements
        this.pushInput = document.getElementById('pushInput');
        this.multiInput = document.getElementById('multiInput');
        
        // Button elements
        this.pushBtn = document.getElementById('pushBtn');
        this.popBtn = document.getElementById('popBtn');
        this.peekBtn = document.getElementById('peekBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.pushMultipleBtn = document.getElementById('pushMultipleBtn');
        this.demoBtn = document.getElementById('demoBtn');
        
        // Visualization elements
        this.stackVisualization = document.getElementById('stackVisualization');
        this.emptyMessage = document.getElementById('emptyMessage');
        this.stepInfo = document.getElementById('stepInfo');
        
        // Info elements
        this.stackSize = document.getElementById('stackSize');
        this.topElement = document.getElementById('topElement');
        this.stackStatus = document.getElementById('stackStatus');
    }

    setupEventListeners() {
        this.pushBtn.addEventListener('click', () => this.push());
        this.popBtn.addEventListener('click', () => this.pop());
        this.peekBtn.addEventListener('click', () => this.peek());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.pushMultipleBtn.addEventListener('click', () => this.pushMultiple());
        this.demoBtn.addEventListener('click', () => this.runDemo());

        // Allow Enter key to push
        this.pushInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isAnimating) {
                this.push();
            }
        });
    }

    async push(value = null) {
        if (this.isAnimating) return;

        const inputValue = value || this.pushInput.value.trim();
        if (!inputValue) {
            alert('Please enter a value to push');
            return;
        }

        if (this.stack.length >= this.maxStackSize) {
            alert(`Stack overflow! Maximum size is ${this.maxStackSize}`);
            return;
        }

        this.isAnimating = true;
        this.disableControls();

        // Add to stack array
        this.stack.push(inputValue);

        // Create visual element
        const element = this.createStackElement(inputValue);
        element.classList.add('pushing');

        // Insert before empty message or at the end
        if (this.emptyMessage.style.display !== 'none') {
            this.stackVisualization.insertBefore(element, this.emptyMessage);
        } else {
            this.stackVisualization.insertBefore(element, this.stackVisualization.lastElementChild);
        }

        // Update step info
        this.updateStepInfo(`Pushed "${inputValue}" onto the stack`, 
                           `Element added to the top of the stack. Stack size is now ${this.stack.length}.`);

        // Wait for animation
        await this.sleep(600);

        // Remove animation class and add top class
        element.classList.remove('pushing');
        this.updateTopElement();
        this.updateVisualization();

        // Clear input
        if (!value) {
            this.pushInput.value = '';
        }

        this.enableControls();
        this.isAnimating = false;
    }

    async pop() {
        if (this.isAnimating) return;

        if (this.stack.length === 0) {
            alert('Stack underflow! Stack is empty');
            this.updateStepInfo('Cannot pop from empty stack', 'Stack underflow error - no elements to remove.');
            return;
        }

        this.isAnimating = true;
        this.disableControls();

        // Get the value being popped
        const poppedValue = this.stack.pop();

        // Get the top visual element
        const elements = this.stackVisualization.querySelectorAll('.stack-element');
        const topElement = elements[elements.length - 1];

        if (topElement) {
            // Add popping animation
            topElement.classList.add('popping');

            // Update step info
            this.updateStepInfo(`Popped "${poppedValue}" from the stack`, 
                               `Element removed from the top of the stack. Stack size is now ${this.stack.length}.`);

            // Wait for animation
            await this.sleep(600);

            // Remove the element
            topElement.remove();
        }

        this.updateTopElement();
        this.updateVisualization();

        this.enableControls();
        this.isAnimating = false;
    }

    peek() {
        if (this.stack.length === 0) {
            alert('Stack is empty - nothing to peek');
            this.updateStepInfo('Cannot peek empty stack', 'No elements in the stack to view.');
            return;
        }

        const topValue = this.stack[this.stack.length - 1];
        
        // Highlight the top element temporarily
        const elements = this.stackVisualization.querySelectorAll('.stack-element');
        const topElement = elements[elements.length - 1];
        
        if (topElement) {
            topElement.style.transform = 'scale(1.1)';
            topElement.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.6)';
            
            setTimeout(() => {
                topElement.style.transform = '';
                topElement.style.boxShadow = '';
            }, 1000);
        }

        this.updateStepInfo(`Peeked at top element: "${topValue}"`, 
                           'Peek operation views the top element without removing it from the stack.');
    }

    clear() {
        if (this.isAnimating) return;

        this.stack = [];
        
        // Remove all stack elements
        const elements = this.stackVisualization.querySelectorAll('.stack-element');
        elements.forEach(element => element.remove());

        this.updateVisualization();
        this.updateStepInfo('Stack cleared', 'All elements have been removed from the stack.');
    }

    async pushMultiple() {
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

        if (this.stack.length + values.length > this.maxStackSize) {
            alert(`Cannot push ${values.length} elements. Would exceed maximum stack size of ${this.maxStackSize}`);
            return;
        }

        for (const value of values) {
            await this.push(value);
            await this.sleep(300); // Small delay between pushes
        }

        this.multiInput.value = '';
    }

    async runDemo() {
        if (this.isAnimating) return;

        // Clear stack first
        this.clear();
        await this.sleep(500);

        const demoOperations = [
            { op: 'push', value: 'A' },
            { op: 'push', value: 'B' },
            { op: 'push', value: 'C' },
            { op: 'peek' },
            { op: 'pop' },
            { op: 'push', value: 'D' },
            { op: 'peek' },
            { op: 'pop' },
            { op: 'pop' },
        ];

        this.updateStepInfo('Running Stack Demo', 'Demonstrating various stack operations...');

        for (const operation of demoOperations) {
            await this.sleep(1000);
            
            if (operation.op === 'push') {
                await this.push(operation.value);
            } else if (operation.op === 'pop') {
                await this.pop();
            } else if (operation.op === 'peek') {
                this.peek();
            }
            
            await this.sleep(800);
        }

        this.updateStepInfo('Demo completed', 'Stack demonstration finished. Try your own operations!');
    }

    createStackElement(value) {
        const element = document.createElement('div');
        element.className = 'stack-element';
        element.textContent = value;
        element.dataset.value = value;
        return element;
    }

    updateTopElement() {
        // Remove top class from all elements
        const elements = this.stackVisualization.querySelectorAll('.stack-element');
        elements.forEach(el => el.classList.remove('top'));

        // Add top class to the last element (top of stack)
        if (elements.length > 0) {
            elements[elements.length - 1].classList.add('top');
            
            // Add pointer
            const pointer = elements[elements.length - 1].querySelector('.stack-pointer');
            if (!pointer) {
                const pointerEl = document.createElement('div');
                pointerEl.className = 'stack-pointer';
                pointerEl.textContent = 'TOP';
                elements[elements.length - 1].appendChild(pointerEl);
            }
        }

        // Remove pointers from non-top elements
        elements.forEach((el, index) => {
            if (index < elements.length - 1) {
                const pointer = el.querySelector('.stack-pointer');
                if (pointer) {
                    pointer.remove();
                }
            }
        });
    }

    updateVisualization() {
        // Update info display
        this.stackSize.textContent = this.stack.length;
        this.topElement.textContent = this.stack.length > 0 ? this.stack[this.stack.length - 1] : 'Empty';
        
        // Update status
        if (this.stack.length === 0) {
            this.stackStatus.textContent = 'Empty';
            this.emptyMessage.style.display = 'flex';
        } else if (this.stack.length >= this.maxStackSize) {
            this.stackStatus.textContent = 'Full';
            this.emptyMessage.style.display = 'none';
        } else {
            this.stackStatus.textContent = 'Active';
            this.emptyMessage.style.display = 'none';
        }

        // Update button states
        this.popBtn.disabled = this.stack.length === 0;
        this.peekBtn.disabled = this.stack.length === 0;
        this.clearBtn.disabled = this.stack.length === 0;
        this.pushBtn.disabled = this.stack.length >= this.maxStackSize;
        this.pushMultipleBtn.disabled = this.stack.length >= this.maxStackSize;
    }

    updateStepInfo(description, details) {
        const stepDescription = this.stepInfo.querySelector('.step-description');
        const stepDetails = this.stepInfo.querySelector('.step-details');
        
        stepDescription.textContent = description;
        stepDetails.textContent = details;
    }

    disableControls() {
        this.pushBtn.disabled = true;
        this.popBtn.disabled = true;
        this.peekBtn.disabled = true;
        this.clearBtn.disabled = true;
        this.pushMultipleBtn.disabled = true;
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
    new StackVisualizer();
});