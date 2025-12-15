// Graph DFS Visualization
// Author: Aryan Pravin Sahu

class GraphDFSVisualizer {
    constructor() {
        this.graph = new Map();
        this.nodes = new Map();
        this.edges = [];
        this.visited = new Set();
        this.stack = [];
        this.traversalPath = [];
        this.isTraversing = false;
        this.animationSpeed = 800;
        this.currentPreset = 'simple';
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateGraph('simple');
    }

    initializeElements() {
        // Control elements
        this.startNodeSelect = document.getElementById('startNodeSelect');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        
        // Button elements
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.startDfsBtn = document.getElementById('startDfsBtn');
        this.stepBtn = document.getElementById('stepBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.demoBtn = document.getElementById('demoBtn');
        
        // Visualization elements
        this.graphVisualization = document.getElementById('graphVisualization');
        this.stepInfo = document.getElementById('stepInfo');
        this.traversalResult = document.getElementById('traversalResult');
        this.traversalPath = document.getElementById('traversalPath');
        this.traversalStats = document.getElementById('traversalStats');
        
        // Info elements
        this.currentNode = document.getElementById('currentNode');
        this.visitedCount = document.getElementById('visitedCount');
        this.stackSize = document.getElementById('stackSize');
        this.dfsStatus = document.getElementById('dfsStatus');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateGraph(this.currentPreset));
        this.clearBtn.addEventListener('click', () => this.clearGraph());
        this.startDfsBtn.addEventListener('click', () => this.startDFS());
        this.stepBtn.addEventListener('click', () => this.stepDFS());
        this.resetBtn.addEventListener('click', () => this.resetTraversal());
        this.demoBtn.addEventListener('click', () => this.runDemo());
        
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedValue.textContent = `${this.animationSpeed}ms`;
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPreset = e.target.dataset.preset;
                this.generateGraph(this.currentPreset);
            });
        });
    }

    generateGraph(preset) {
        this.clearGraph();
        
        const presets = {
            simple: {
                nodes: ['A', 'B', 'C', 'D'],
                edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']],
                positions: {
                    'A': { x: 100, y: 100 },
                    'B': { x: 300, y: 100 },
                    'C': { x: 100, y: 250 },
                    'D': { x: 300, y: 250 }
                }
            },
            tree: {
                nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
                edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F']],
                positions: {
                    'A': { x: 200, y: 50 },
                    'B': { x: 100, y: 150 },
                    'C': { x: 300, y: 150 },
                    'D': { x: 50, y: 250 },
                    'E': { x: 150, y: 250 },
                    'F': { x: 350, y: 250 }
                }
            },
            cycle: {
                nodes: ['A', 'B', 'C', 'D', 'E'],
                edges: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'A'], ['A', 'C']],
                positions: {
                    'A': { x: 200, y: 50 },
                    'B': { x: 350, y: 150 },
                    'C': { x: 300, y: 300 },
                    'D': { x: 100, y: 300 },
                    'E': { x: 50, y: 150 }
                }
            },
            complex: {
                nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'E'], ['D', 'F'], ['E', 'F'], ['F', 'G'], ['B', 'E']],
                positions: {
                    'A': { x: 50, y: 100 },
                    'B': { x: 150, y: 50 },
                    'C': { x: 150, y: 150 },
                    'D': { x: 250, y: 50 },
                    'E': { x: 250, y: 150 },
                    'F': { x: 350, y: 100 },
                    'G': { x: 450, y: 100 }
                }
            }
        };

        const config = presets[preset];
        
        // Create graph structure
        config.nodes.forEach(node => {
            this.graph.set(node, []);
        });

        config.edges.forEach(([from, to]) => {
            this.graph.get(from).push(to);
            this.graph.get(to).push(from); // Undirected graph
        });

        // Create visual nodes
        config.nodes.forEach(nodeId => {
            const pos = config.positions[nodeId];
            this.createNode(nodeId, pos.x, pos.y);
        });

        // Create visual edges
        config.edges.forEach(([from, to]) => {
            this.createEdge(from, to);
        });

        this.updateStartNodeOptions();
        this.updateVisualization();
        this.updateStepInfo('Graph generated successfully', 
                           `Created ${preset} graph with ${config.nodes.length} nodes and ${config.edges.length} edges.`);
    }

    createNode(id, x, y) {
        const node = document.createElement('div');
        node.className = 'graph-node';
        node.textContent = id;
        node.style.left = x + 'px';
        node.style.top = y + 'px';
        node.dataset.nodeId = id;
        
        this.graphVisualization.appendChild(node);
        this.nodes.set(id, { element: node, x, y });
    }

    createEdge(from, to) {
        const fromNode = this.nodes.get(from);
        const toNode = this.nodes.get(to);
        
        if (!fromNode || !toNode) return;

        const edge = document.createElement('div');
        edge.className = 'graph-edge';
        
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        edge.style.left = (fromNode.x + 25) + 'px'; // Center of node
        edge.style.top = (fromNode.y + 25) + 'px';
        edge.style.width = length + 'px';
        edge.style.transform = `rotate(${angle}deg)`;
        edge.dataset.from = from;
        edge.dataset.to = to;

        this.graphVisualization.appendChild(edge);
        this.edges.push(edge);
    }

    updateStartNodeOptions() {
        this.startNodeSelect.innerHTML = '';
        Array.from(this.graph.keys()).forEach(nodeId => {
            const option = document.createElement('option');
            option.value = nodeId;
            option.textContent = `Node ${nodeId}`;
            this.startNodeSelect.appendChild(option);
        });
    }

    async startDFS() {
        if (this.isTraversing) return;

        const startNode = this.startNodeSelect.value;
        if (!startNode) {
            alert('Please select a start node');
            return;
        }

        this.resetTraversal();
        this.isTraversing = true;
        this.disableControls();

        this.stack = [startNode];
        this.updateVisualization();
        
        this.updateStepInfo('Starting DFS traversal', 
                           `Beginning depth-first search from node ${startNode}.`);

        await this.executeDFS();

        this.showTraversalResult();
        this.enableControls();
        this.isTraversing = false;
    }

    async executeDFS() {
        while (this.stack.length > 0) {
            const currentNode = this.stack.pop();
            
            if (this.visited.has(currentNode)) {
                continue;
            }

            // Visit the current node
            this.visited.add(currentNode);
            this.traversalPath.push(currentNode);
            
            // Highlight current node
            const nodeElement = this.nodes.get(currentNode).element;
            nodeElement.classList.add('visiting');
            
            this.updateVisualization();
            this.updateStepInfo(`Visiting node ${currentNode}`, 
                               `Exploring node ${currentNode} and adding its unvisited neighbors to the stack.`);

            await this.sleep(this.animationSpeed);

            // Add unvisited neighbors to stack (in reverse order for correct DFS behavior)
            const neighbors = this.graph.get(currentNode);
            const unvisitedNeighbors = neighbors.filter(neighbor => !this.visited.has(neighbor));
            
            // Add in reverse order so we visit in the correct order
            for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
                const neighbor = unvisitedNeighbors[i];
                if (!this.stack.includes(neighbor)) {
                    this.stack.push(neighbor);
                }
            }

            // Highlight edges to neighbors
            this.highlightEdgesToNeighbors(currentNode, unvisitedNeighbors);

            // Mark node as visited (change color)
            nodeElement.classList.remove('visiting');
            nodeElement.classList.add('visited');

            this.updateVisualization();
            await this.sleep(this.animationSpeed / 2);
        }

        // Mark all visited nodes as finished
        this.visited.forEach(nodeId => {
            const nodeElement = this.nodes.get(nodeId).element;
            nodeElement.classList.remove('visited');
            nodeElement.classList.add('finished');
        });
    }

    highlightEdgesToNeighbors(currentNode, neighbors) {
        neighbors.forEach(neighbor => {
            const edge = this.findEdge(currentNode, neighbor);
            if (edge) {
                edge.classList.add('traversed');
            }
        });
    }

    findEdge(from, to) {
        return this.edges.find(edge => 
            (edge.dataset.from === from && edge.dataset.to === to) ||
            (edge.dataset.from === to && edge.dataset.to === from)
        );
    }

    async stepDFS() {
        // Implementation for step-by-step DFS (simplified version)
        if (!this.isTraversing) {
            this.startDFS();
        }
    }

    resetTraversal() {
        this.visited.clear();
        this.stack = [];
        this.traversalPath = [];
        
        // Reset visual states
        this.nodes.forEach((nodeData, nodeId) => {
            nodeData.element.classList.remove('visiting', 'visited', 'finished', 'start');
        });

        this.edges.forEach(edge => {
            edge.classList.remove('traversed', 'backtrack');
        });

        this.traversalResult.style.display = 'none';
        this.updateVisualization();
        this.updateStepInfo('Traversal reset', 'Ready to start a new DFS traversal.');
    }

    showTraversalResult() {
        this.traversalPath.textContent = this.traversalPath.join(' → ');
        this.traversalStats.textContent = `Visited ${this.visited.size} nodes out of ${this.graph.size} total nodes`;
        this.traversalResult.style.display = 'block';
    }

    async runDemo() {
        if (this.isTraversing) return;

        // Generate a demo graph
        this.generateGraph('tree');
        await this.sleep(1000);

        // Start DFS from node A
        this.startNodeSelect.value = 'A';
        await this.startDFS();
    }

    clearGraph() {
        this.graph.clear();
        this.nodes.clear();
        this.edges = [];
        
        // Remove all visual elements
        const nodes = this.graphVisualization.querySelectorAll('.graph-node');
        const edges = this.graphVisualization.querySelectorAll('.graph-edge');
        
        nodes.forEach(node => node.remove());
        edges.forEach(edge => edge.remove());

        this.resetTraversal();
        this.updateVisualization();
    }

    updateVisualization() {
        // Update info display
        this.currentNode.textContent = this.stack.length > 0 ? this.stack[this.stack.length - 1] : 'None';
        this.visitedCount.textContent = this.visited.size;
        this.stackSize.textContent = this.stack.length;
        
        // Update status
        if (this.isTraversing) {
            this.dfsStatus.textContent = 'Traversing';
        } else if (this.visited.size > 0) {
            this.dfsStatus.textContent = 'Complete';
        } else {
            this.dfsStatus.textContent = 'Ready';
        }

        // Update button states
        const hasGraph = this.graph.size > 0;
        this.startDfsBtn.disabled = !hasGraph || this.isTraversing;
        this.stepBtn.disabled = !hasGraph;
        this.resetBtn.disabled = !hasGraph;
        this.clearBtn.disabled = !hasGraph;
    }

    updateStepInfo(description, details) {
        const stepDescription = this.stepInfo.querySelector('.step-description');
        const stepDetails = this.stepInfo.querySelector('.step-details');
        
        stepDescription.textContent = description;
        stepDetails.textContent = details;
    }

    disableControls() {
        this.generateBtn.disabled = true;
        this.startDfsBtn.disabled = true;
        this.stepBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.clearBtn.disabled = true;
        this.demoBtn.disabled = true;
        this.startNodeSelect.disabled = true;
    }

    enableControls() {
        this.generateBtn.disabled = false;
        this.demoBtn.disabled = false;
        this.startNodeSelect.disabled = false;
        this.updateVisualization(); // This will set the correct disabled states
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new GraphDFSVisualizer();
});