// Binary Search Tree Visualization
// Author: Aryan Pravin Sahu

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.element = null;
    }
}

class BSTVisualizer {
    constructor() {
        this.root = null;
        this.isAnimating = false;
        this.nodeSize = 50;
        this.levelHeight = 80;
        this.nodeSpacing = 60;
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateVisualization();
    }

    initializeElements() {
        // Control elements
        this.valueInput = document.getElementById('valueInput');
        this.bulkInput = document.getElementById('bulkInput');
        
        // Button elements
        this.insertBtn = document.getElementById('insertBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.inorderBtn = document.getElementById('inorderBtn');
        this.preorderBtn = document.getElementById('preorderBtn');
        this.postorderBtn = document.getElementById('postorderBtn');
        this.bulkInsertBtn = document.getElementById('bulkInsertBtn');
        this.demoBtn = document.getElementById('demoBtn');
        
        // Visualization elements
        this.treeVisualization = document.getElementById('treeVisualization');
        this.emptyMessage = document.getElementById('emptyMessage');
        this.stepInfo = document.getElementById('stepInfo');
        this.traversalResult = document.getElementById('traversalResult');
        this.traversalTitle = document.getElementById('traversalTitle');
        this.traversalValues = document.getElementById('traversalValues');
        
        // Array visualization elements
        this.arrayVisualization = document.getElementById('arrayVisualization');
        this.arrayContainer = document.getElementById('arrayContainer');
        
        // Current traversal state
        this.currentTraversal = 'inorder';
        this.traversalArray = [];
        
        // Info elements
        this.treeSize = document.getElementById('treeSize');
        this.treeHeight = document.getElementById('treeHeight');
        this.rootValue = document.getElementById('rootValue');
        this.lastOperation = document.getElementById('lastOperation');
    }

    setupEventListeners() {
        this.insertBtn.addEventListener('click', () => this.insert());
        this.searchBtn.addEventListener('click', () => this.search());
        this.deleteBtn.addEventListener('click', () => this.delete());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.inorderBtn.addEventListener('click', () => this.traverseInOrder());
        this.preorderBtn.addEventListener('click', () => this.traversePreOrder());
        this.postorderBtn.addEventListener('click', () => this.traversePostOrder());
        this.bulkInsertBtn.addEventListener('click', () => this.bulkInsert());
        this.demoBtn.addEventListener('click', () => this.runDemo());

        // Allow Enter key to insert
        this.valueInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isAnimating) {
                this.insert();
            }
        });

        // Traversal button event listeners
        document.querySelectorAll('.traversal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const traversalType = e.target.dataset.type;
                this.setTraversalType(traversalType);
            });
        });
    }

    async insert(value = null) {
        if (this.isAnimating) return;

        const inputValue = value !== null ? value : parseInt(this.valueInput.value);
        if (isNaN(inputValue)) {
            alert('Please enter a valid number');
            return;
        }

        this.isAnimating = true;
        this.disableControls();

        // Check if value already exists
        if (this.findNode(this.root, inputValue)) {
            alert(`Value ${inputValue} already exists in the tree`);
            this.enableControls();
            this.isAnimating = false;
            return;
        }

        // Insert the node
        this.root = await this.insertNode(this.root, inputValue);
        
        // Update visualization
        this.calculatePositions();
        this.renderTree();
        this.updateVisualization();
        
        this.updateStepInfo(`Inserted ${inputValue} into the BST`, 
                           `Node ${inputValue} has been added to the tree following BST property.`);
        
        // Clear input
        if (value === null) {
            this.valueInput.value = '';
        }

        this.enableControls();
        this.isAnimating = false;
    }

    async insertNode(node, value) {
        if (node === null) {
            const newNode = new TreeNode(value);
            await this.animateNodeInsertion(newNode);
            return newNode;
        }

        if (value < node.value) {
            node.left = await this.insertNode(node.left, value);
        } else if (value > node.value) {
            node.right = await this.insertNode(node.right, value);
        }

        return node;
    }

    async animateNodeInsertion(node) {
        // Create visual element
        const element = this.createNodeElement(node.value);
        element.classList.add('inserting');
        this.treeVisualization.appendChild(element);
        node.element = element;

        await this.sleep(400);
        element.classList.remove('inserting');
    }

    async search(value = null) {
        if (this.isAnimating) return;

        const searchValue = value !== null ? value : parseInt(this.valueInput.value);
        if (isNaN(searchValue)) {
            alert('Please enter a valid number to search');
            return;
        }

        if (!this.root) {
            alert('Tree is empty');
            return;
        }

        this.isAnimating = true;
        this.disableControls();

        // Clear previous search highlighting
        this.clearHighlighting();

        const result = await this.searchNode(this.root, searchValue);
        
        if (result) {
            this.updateStepInfo(`Found ${searchValue} in the BST`, 
                               `Value ${searchValue} exists in the tree and has been highlighted.`);
        } else {
            this.updateStepInfo(`${searchValue} not found in the BST`, 
                               `Value ${searchValue} does not exist in the tree.`);
        }

        this.enableControls();
        this.isAnimating = false;
    }

    async searchNode(node, value) {
        if (node === null) {
            return false;
        }

        // Highlight current node
        if (node.element) {
            node.element.classList.add('searching');
            await this.sleep(600);
        }

        if (value === node.value) {
            // Found the value
            if (node.element) {
                node.element.classList.remove('searching');
                node.element.classList.add('found');
            }
            return true;
        } else if (value < node.value) {
            // Remove searching class and search left
            if (node.element) {
                node.element.classList.remove('searching');
            }
            return await this.searchNode(node.left, value);
        } else {
            // Remove searching class and search right
            if (node.element) {
                node.element.classList.remove('searching');
            }
            return await this.searchNode(node.right, value);
        }
    }

    async delete(value = null) {
        if (this.isAnimating) return;

        const deleteValue = value !== null ? value : parseInt(this.valueInput.value);
        if (isNaN(deleteValue)) {
            alert('Please enter a valid number to delete');
            return;
        }

        if (!this.root) {
            alert('Tree is empty');
            return;
        }

        // Check if value exists
        if (!this.findNode(this.root, deleteValue)) {
            alert(`Value ${deleteValue} not found in the tree`);
            return;
        }

        this.isAnimating = true;
        this.disableControls();

        // Delete the node
        this.root = await this.deleteNode(this.root, deleteValue);
        
        // Update visualization
        this.calculatePositions();
        this.renderTree();
        this.updateVisualization();
        
        this.updateStepInfo(`Deleted ${deleteValue} from the BST`, 
                           `Node ${deleteValue} has been removed from the tree.`);

        this.enableControls();
        this.isAnimating = false;
    }

    async deleteNode(node, value) {
        if (node === null) {
            return null;
        }

        if (value < node.value) {
            node.left = await this.deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = await this.deleteNode(node.right, value);
        } else {
            // Node to be deleted found
            if (node.element) {
                node.element.classList.add('deleting');
                await this.sleep(400);
                node.element.remove();
            }

            // Case 1: No children
            if (node.left === null && node.right === null) {
                return null;
            }
            // Case 2: One child
            else if (node.left === null) {
                return node.right;
            } else if (node.right === null) {
                return node.left;
            }
            // Case 3: Two children
            else {
                // Find inorder successor (smallest in right subtree)
                const successor = this.findMin(node.right);
                node.value = successor.value;
                node.right = await this.deleteNode(node.right, successor.value);
            }
        }

        return node;
    }

    findMin(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    findNode(node, value) {
        if (node === null) {
            return null;
        }
        if (value === node.value) {
            return node;
        } else if (value < node.value) {
            return this.findNode(node.left, value);
        } else {
            return this.findNode(node.right, value);
        }
    }

    async traverseInOrder() {
        if (!this.root) {
            alert('Tree is empty');
            return;
        }

        const result = [];
        await this.inOrderTraversal(this.root, result);
        this.showTraversalResult('In-order Traversal (Left → Root → Right)', result);
    }

    async traversePreOrder() {
        if (!this.root) {
            alert('Tree is empty');
            return;
        }

        const result = [];
        await this.preOrderTraversal(this.root, result);
        this.showTraversalResult('Pre-order Traversal (Root → Left → Right)', result);
    }

    async traversePostOrder() {
        if (!this.root) {
            alert('Tree is empty');
            return;
        }

        const result = [];
        await this.postOrderTraversal(this.root, result);
        this.showTraversalResult('Post-order Traversal (Left → Right → Root)', result);
    }

    async inOrderTraversal(node, result) {
        if (node !== null) {
            await this.inOrderTraversal(node.left, result);
            
            // Highlight current node
            if (node.element) {
                node.element.classList.add('searching');
                await this.sleep(500);
                node.element.classList.remove('searching');
            }
            
            result.push(node.value);
            await this.inOrderTraversal(node.right, result);
        }
    }

    async preOrderTraversal(node, result) {
        if (node !== null) {
            // Highlight current node
            if (node.element) {
                node.element.classList.add('searching');
                await this.sleep(500);
                node.element.classList.remove('searching');
            }
            
            result.push(node.value);
            await this.preOrderTraversal(node.left, result);
            await this.preOrderTraversal(node.right, result);
        }
    }

    async postOrderTraversal(node, result) {
        if (node !== null) {
            await this.postOrderTraversal(node.left, result);
            await this.postOrderTraversal(node.right, result);
            
            // Highlight current node
            if (node.element) {
                node.element.classList.add('searching');
                await this.sleep(500);
                node.element.classList.remove('searching');
            }
            
            result.push(node.value);
        }
    }

    showTraversalResult(title, values) {
        this.traversalTitle.textContent = title;
        this.traversalValues.textContent = values.join(' → ');
        this.traversalResult.style.display = 'block';
        
        setTimeout(() => {
            this.traversalResult.style.display = 'none';
        }, 5000);
    }

    async bulkInsert() {
        if (this.isAnimating) return;

        const input = this.bulkInput.value.trim();
        if (!input) {
            alert('Please enter comma-separated values');
            return;
        }

        const values = input.split(',')
            .map(val => parseInt(val.trim()))
            .filter(val => !isNaN(val));
        
        if (values.length === 0) {
            alert('Please enter valid numbers');
            return;
        }

        for (const value of values) {
            await this.insert(value);
            await this.sleep(300);
        }
    }

    async runDemo() {
        if (this.isAnimating) return;

        // Clear tree first
        this.clear();
        await this.sleep(500);

        const demoValues = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
        
        this.updateStepInfo('Running BST Demo', 'Building a sample binary search tree...');

        // Insert demo values
        for (const value of demoValues) {
            await this.insert(value);
            await this.sleep(400);
        }

        await this.sleep(1000);

        // Demonstrate search
        this.updateStepInfo('Demo: Searching for 25', 'Demonstrating search operation...');
        await this.search(25);
        
        await this.sleep(2000);

        // Demonstrate traversal
        this.updateStepInfo('Demo: In-order Traversal', 'Showing sorted order of values...');
        await this.traverseInOrder();

        this.updateStepInfo('Demo completed', 'BST demonstration finished. Try your own operations!');
    }

    clear() {
        if (this.isAnimating) return;

        this.root = null;
        
        // Remove all visual elements
        const nodes = this.treeVisualization.querySelectorAll('.tree-node');
        const edges = this.treeVisualization.querySelectorAll('.tree-edge');
        
        nodes.forEach(node => node.remove());
        edges.forEach(edge => edge.remove());

        this.emptyMessage.style.display = 'flex';
        this.traversalResult.style.display = 'none';
        
        this.updateVisualization();
        this.updateStepInfo('Tree cleared', 'All nodes have been removed from the BST.');
    }

    calculatePositions() {
        if (!this.root) return;

        const width = this.treeVisualization.offsetWidth;
        const startX = width / 2;
        const startY = 50;

        this.assignPositions(this.root, startX, startY, width / 4);
    }

    assignPositions(node, x, y, offset) {
        if (node === null) return;

        node.x = x;
        node.y = y;

        if (node.left) {
            this.assignPositions(node.left, x - offset, y + this.levelHeight, offset / 2);
        }
        if (node.right) {
            this.assignPositions(node.right, x + offset, y + this.levelHeight, offset / 2);
        }
    }

    renderTree() {
        // Clear existing visual elements
        const nodes = this.treeVisualization.querySelectorAll('.tree-node');
        const edges = this.treeVisualization.querySelectorAll('.tree-edge');
        
        nodes.forEach(node => node.remove());
        edges.forEach(edge => edge.remove());

        if (!this.root) {
            this.emptyMessage.style.display = 'flex';
            return;
        }

        this.emptyMessage.style.display = 'none';

        // Render edges first (so they appear behind nodes)
        this.renderEdges(this.root);
        
        // Render nodes
        this.renderNodes(this.root);
    }

    renderNodes(node) {
        if (node === null) return;

        const element = this.createNodeElement(node.value);
        element.style.left = (node.x - this.nodeSize / 2) + 'px';
        element.style.top = node.y + 'px';
        
        if (node === this.root) {
            element.classList.add('root');
        }

        this.treeVisualization.appendChild(element);
        node.element = element;

        this.renderNodes(node.left);
        this.renderNodes(node.right);
    }

    renderEdges(node) {
        if (node === null) return;

        if (node.left) {
            this.createEdge(node, node.left);
            this.renderEdges(node.left);
        }
        if (node.right) {
            this.createEdge(node, node.right);
            this.renderEdges(node.right);
        }
    }

    createEdge(parent, child) {
        const edge = document.createElement('div');
        edge.className = 'tree-edge';

        const dx = child.x - parent.x;
        const dy = child.y - parent.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        edge.style.left = parent.x + 'px';
        edge.style.top = (parent.y + this.nodeSize / 2) + 'px';
        edge.style.width = length + 'px';
        edge.style.transform = `rotate(${angle}deg)`;

        this.treeVisualization.appendChild(edge);
    }

    createNodeElement(value) {
        const element = document.createElement('div');
        element.className = 'tree-node';
        element.textContent = value;
        element.dataset.value = value;
        return element;
    }

    clearHighlighting() {
        const nodes = this.treeVisualization.querySelectorAll('.tree-node');
        nodes.forEach(node => {
            node.classList.remove('searching', 'found');
        });
    }

    getTreeSize(node = this.root) {
        if (node === null) return 0;
        return 1 + this.getTreeSize(node.left) + this.getTreeSize(node.right);
    }

    getTreeHeight(node = this.root) {
        if (node === null) return 0;
        return 1 + Math.max(this.getTreeHeight(node.left), this.getTreeHeight(node.right));
    }

    updateVisualization() {
        // Update info display
        this.treeSize.textContent = this.getTreeSize();
        this.treeHeight.textContent = this.getTreeHeight();
        this.rootValue.textContent = this.root ? this.root.value : 'None';
        
        // Update button states
        const hasNodes = this.root !== null;
        this.searchBtn.disabled = !hasNodes;
        this.deleteBtn.disabled = !hasNodes;
        this.clearBtn.disabled = !hasNodes;
        this.inorderBtn.disabled = !hasNodes;
        this.preorderBtn.disabled = !hasNodes;
        this.postorderBtn.disabled = !hasNodes;
        
        // Update array visualization
        this.updateArrayVisualization();
    }

    updateArrayVisualization() {
        // Get current traversal
        this.traversalArray = this.getTraversalArray(this.currentTraversal);
        
        // Clear previous array visualization
        this.arrayVisualization.innerHTML = '';
        
        if (this.traversalArray.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-array';
            emptyDiv.textContent = 'No elements to display';
            this.arrayVisualization.appendChild(emptyDiv);
            return;
        }
        
        // Create array elements
        this.traversalArray.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.textContent = value;
            element.dataset.value = value;
            element.dataset.index = index;
            
            // Add click handler to highlight corresponding tree node
            element.addEventListener('click', () => {
                this.highlightNodeInTree(value);
                this.highlightArrayElement(index);
            });
            
            this.arrayVisualization.appendChild(element);
        });
    }

    getTraversalArray(type) {
        const result = [];
        
        switch (type) {
            case 'inorder':
                this.inorderTraversal(this.root, result);
                break;
            case 'preorder':
                this.preorderTraversal(this.root, result);
                break;
            case 'postorder':
                this.postorderTraversal(this.root, result);
                break;
        }
        
        return result;
    }

    inorderTraversal(node, result) {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.value);
            this.inorderTraversal(node.right, result);
        }
    }

    preorderTraversal(node, result) {
        if (node) {
            result.push(node.value);
            this.preorderTraversal(node.left, result);
            this.preorderTraversal(node.right, result);
        }
    }

    postorderTraversal(node, result) {
        if (node) {
            this.postorderTraversal(node.left, result);
            this.postorderTraversal(node.right, result);
            result.push(node.value);
        }
    }

    highlightNodeInTree(value) {
        // Remove previous highlights
        document.querySelectorAll('.tree-node').forEach(node => {
            node.classList.remove('highlighted');
        });
        
        // Find and highlight the node with the given value
        const nodeElement = document.querySelector(`[data-value="${value}"]`);
        if (nodeElement && nodeElement.classList.contains('tree-node')) {
            nodeElement.classList.add('highlighted');
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
                nodeElement.classList.remove('highlighted');
            }, 2000);
        }
    }

    highlightArrayElement(index) {
        // Remove previous highlights
        document.querySelectorAll('.array-element').forEach(element => {
            element.classList.remove('highlighted');
        });
        
        // Highlight selected element
        const element = document.querySelector(`[data-index="${index}"]`);
        if (element) {
            element.classList.add('highlighted');
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
                element.classList.remove('highlighted');
            }, 2000);
        }
    }

    setTraversalType(type) {
        this.currentTraversal = type;
        
        // Update button states
        document.querySelectorAll('.traversal-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // Update array visualization
        this.updateArrayVisualization();
        
        // Update step info
        const descriptions = {
            'inorder': 'In-Order Traversal: Left → Root → Right',
            'preorder': 'Pre-Order Traversal: Root → Left → Right', 
            'postorder': 'Post-Order Traversal: Left → Right → Root'
        };
        
        this.updateStepInfo(descriptions[type], 
                           `Showing ${type} traversal sequence. Click array elements to highlight corresponding tree nodes.`);
    }

    updateStepInfo(description, details) {
        const stepDescription = this.stepInfo.querySelector('.step-description');
        const stepDetails = this.stepInfo.querySelector('.step-details');
        
        stepDescription.textContent = description;
        stepDetails.textContent = details;
        
        this.lastOperation.textContent = description.split(' ')[0];
    }

    disableControls() {
        this.insertBtn.disabled = true;
        this.searchBtn.disabled = true;
        this.deleteBtn.disabled = true;
        this.clearBtn.disabled = true;
        this.inorderBtn.disabled = true;
        this.preorderBtn.disabled = true;
        this.postorderBtn.disabled = true;
        this.bulkInsertBtn.disabled = true;
        this.demoBtn.disabled = true;
    }

    enableControls() {
        this.insertBtn.disabled = false;
        this.bulkInsertBtn.disabled = false;
        this.demoBtn.disabled = false;
        this.updateVisualization(); // This will set the correct disabled states
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new BSTVisualizer();
});