// Graph BFS Visualization
// Author: Aryan Pravin Sahu

class GraphBFSVisualizer {
    constructor() {
        this.graph = new Map();
        this.nodes = new Map();
        this.edges = [];
        this.visited = new Set();
        this.queue = [];
        this.traversalPath = [];
        this.nodeLevels = new Map();
        this.isTraversing = false;
        this.animationSpeed = 1000;
        this.currentPreset = 'simple';
        this.currentLevel = 0;
        
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
        this.startBfsBtn = document.getElementById('startBfsBtn');
        this.stepBtn = document.getElementById('stepBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.demoBtn = document.getElementById('demoBtn');
        
        // Visualization elements
        this.graphVisualization = document.getElementById('graphVisualization');
        this.queueVisualization = document.getElementById('queueVisualization');
        this.queueItems = document.getElementById('queueItems');
        this.stepInfo = document.getElementById('stepInfo');
        this.traversalResult = document.getElementById('traversalResult');
        this.traversalPath = document.getElementById('traversalPath');
        this.traversalStats = document.getElementById('traversalStats');
        
        // Info elements
        this.currentLevelDisplay = document.getElementById('currentLevel');
        this.visitedCount = document.getElementById('visitedCount');
        this.queueSize = document.getElementById('queueSize');
        this.bfsStatus = document.getElementById('bfsStatus');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateGraph(this.currentPreset));
        this.clearBtn.addEventListener('click', () => this.clearGraph());
        this.startBfsBtn.addEventListener('click', () => this.startBFS());
        this.stepBtn.addEventListener('click', () => this.stepBFS());
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
                nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['C', 'G']],
                positions: {
                    'A': { x: 200, y: 50 },
                    'B': { x: 100, y: 150 },
                    'C': { x: 300, y: 150 },
                    'D': { x: 50, y: 250 },
                    'E': { x: 150, y: 250 },
                    'F': { x: 250, y: 250 },
                    'G': { x: 350, y: 250 }
                }
            },
            grid: {
                nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
                edges: [['A', 'B'], ['B', 'C'], ['A', 'D'], ['B', 'E'], ['C', 'F'], ['D', 'E'], ['E', 'F']],
                positions: {
                    'A': { x: 100, y: 100 },
                    'B': { x: 200, y: 100 },
                    'C': { x: 300, y: 100 },
                    'D': { x: 100, y: 200 },
                    'E': { x: 200, y: 200 },
                    'F': { x: 300, y: 200 }
                }
            },
            complex: {
                nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'E'], ['D', 'F'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['B', 'E'], ['C', 'D']],
                positions: {
                    'A': { x: 50, y: 100 },
                    'B': { x: 150, y: 50 },
                    'C': { x: 150, y: 150 },
                    'D': { x: 250, y: 50 },
                    'E': { x: 250, y: 150 },
                    'F': { x: 350, y: 100 },
                    'G': { x: 450, y: 100 },
                    'H': { x: 550, y: 100 }
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
        node.innerHTML = `
            ${id}
            <div class="level-label">L0</div>
        `;
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

    async startBFS() {
        if (this.isTraversing) return;

        const startNode = this.startNodeSelect.value;
        if (!startNode) {
            alert('Please select a start node');
            return;
        }

        this.resetTraversal();
        this.isTraversing = true;
        this.disableControls();

        // Initialize BFS
        this.queue = [startNode];
        this.nodeLevels.set(startNode, 0);
        this.currentLevel = 0;
        
        // Mark start node
        const startElement = this.nodes.get(startNode).element;
        startElement.classList.add('start');
        startElement.querySelector('.level-label').textContent = 'L0';
        
        this.updateVisualization();
        this.updateQueueVisualization();
        
        this.updateStepInfo('Starting BFS traversal', 
                           `Beginning breadth-first search from node ${startNode}.`);

        await this.executeBFS();

        this.showTraversalResult();
        this.enableControls();
        this.isTraversing = false;
    }

    async executeBFS() {
        while (this.queue.length > 0) {
            const currentNode = this.queue.shift();
            
            if (this.visited.has(currentNode)) {
                continue;
            }

            // Visit the current node
            this.visited.add(currentNode);
            this.traversalPath.push(currentNode);
            
            // Highlight current node as visiting
            const nodeElement = this.nodes.get(currentNode).element;
            nodeElement.classList.remove('queued', 'start');
            nodeElement.classList.add('visiting');
            
            this.updateVisualization();
            this.updateQueueVisualization();
            this.updateStepInfo(`Visiting node ${currentNode} at level ${this.nodeLevels.get(currentNode)}`, 
                               `Processing node ${currentNode} and adding its unvisited neighbors to the queue.`);

            await this.sleep(this.animationSpeed);

            // Get unvisited neighbors
            const neighbors = this.graph.get(currentNode);
            const unvisitedNeighbors = neighbors.filter(neighbor => 
                !this.visited.has(neighbor) && !this.queue.includes(neighbor)
            );
            
            // Add neighbors to queue and set their levels
            const nextLevel = this.nodeLevels.get(currentNode) + 1;
            unvisitedNeighbors.forEach(neighbor => {
                this.queue.push(neighbor);
                this.nodeLevels.set(neighbor, nextLevel);
                
                // Mark neighbor as queued
                const neighborElement = this.nodes.get(neighbor).element;
                neighborElement.classList.add('queued');
                neighborElement.querySelector('.level-label').textContent = `L${nextLevel}`;
                
                // Highlight edge
                const edge = this.findEdge(currentNode, neighbor);
                if (edge) {
                    edge.classList.add('traversed');
                }
            });

            // Update current level
            if (unvisitedNeighbors.length > 0) {
                this.currentLevel = Math.max(this.currentLevel, nextLevel);
            }

            // Mark node as visited
            nodeElement.classList.remove('visiting');
            nodeElement.classList.add('visited');

            this.updateVisualization();
            this.updateQueueVisualization();
            await this.sleep(this.animationSpeed / 2);
        }

        // Mark all visited nodes as finished
        this.visited.forEach(nodeId => {
            const nodeElement = this.nodes.get(nodeId).element;
            nodeElement.classList.remove('visited');
            nodeElement.classList.add('finished');
        });

        // Highlight level edges
        this.edges.forEach(edge => {
            if (edge.classList.contains('traversed')) {
                edge.classList.add('level-edge');
            }
        });
    }

    updateQueueVisualization() {
        this.queueItems.innerHTML = '';
        
        this.queue.forEach(nodeId => {
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.textContent = nodeId;
            this.queueItems.appendChild(queueItem);
        });

        if (this.queue.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.textContent = 'Empty';
            emptyMessage.style.color = 'rgba(255, 255, 255, 0.5)';
            emptyMessage.style.fontStyle = 'italic';
            this.queueItems.appendChild(emptyMessage);
        }
    }

    findEdge(from, to) {
        return this.edges.find(edge => 
            (edge.dataset.from === from && edge.dataset.to === to) ||
            (edge.dataset.from === to && edge.dataset.to === from)
        );
    }

    async stepBFS() {
        // Implementation for step-by-step BFS (simplified version)
        if (!this.isTraversing) {
            this.startBFS();
        }
    }

    resetTraversal() {
        this.visited.clear();
        this.queue = [];
        this.traversalPath = [];
        this.nodeLevels.clear();
        this.currentLevel = 0;
        
        // Reset visual states
        this.nodes.forEach((nodeData, nodeId) => {
            nodeData.element.classList.remove('visiting', 'visited', 'finished', 'start', 'queued');
            nodeData.element.querySelector('.level-label').textContent = 'L0';
        });

        this.edges.forEach(edge => {
            edge.classList.remove('traversed', 'level-edge');
        });

        this.updateQueueVisualization();
        this.traversalResult.style.display = 'none';
        this.updateVisualization();
        this.updateStepInfo('Traversal reset', 'Ready to start a new BFS traversal.');
    }

    showTraversalResult() {
        this.traversalPath.textContent = this.traversalPath.join(' → ');
        this.traversalStats.textContent = `Visited ${this.visited.size} nodes out of ${this.graph.size} total nodes in ${this.currentLevel + 1} levels`;
        this.traversalResult.style.display = 'block';
    }

    async runDemo() {
        if (this.isTraversing) return;

        // Generate a demo graph
        this.generateGraph('tree');
        await this.sleep(1000);

        // Start BFS from node A
        this.startNodeSelect.value = 'A';
        await this.startBFS();
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
        this.currentLevelDisplay.textContent = this.currentLevel;
        this.visitedCount.textContent = this.visited.size;
        this.queueSize.textContent = this.queue.length;
        
        // Update status
        if (this.isTraversing) {
            this.bfsStatus.textContent = 'Traversing';
        } else if (this.visited.size > 0) {
            this.bfsStatus.textContent = 'Complete';
        } else {
            this.bfsStatus.textContent = 'Ready';
        }

        // Update button states
        const hasGraph = this.graph.size > 0;
        this.startBfsBtn.disabled = !hasGraph || this.isTraversing;
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
        this.startBfsBtn.disabled = true;
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
    new GraphBFSVisualizer();
});