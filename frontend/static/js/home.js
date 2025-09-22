/**
 * AlgoVizard - Homepage JavaScript
 * Author: Aryan Pravin Sahu
 * Theme management and statistics for the landing page
 */

class AlgoVizardHome {
    constructor() {
        this.selectedTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
    }

    // ==================== THEME MANAGEMENT ====================
    
    applyTheme(theme) {
        console.log('Applying theme:', theme);
        
        // Remove existing school theme
        const existingSchoolTheme = document.getElementById('school-theme');
        if (existingSchoolTheme) {
            existingSchoolTheme.remove();
        }
        
        if (theme === 'school') {
            // Add school theme CSS
            const schoolThemeLink = document.createElement('link');
            schoolThemeLink.rel = 'stylesheet';
            schoolThemeLink.href = '/static/css/school-theme.css';
            schoolThemeLink.id = 'school-theme';
            document.head.appendChild(schoolThemeLink);
        }
        
        // Update body class
        document.body.classList.remove('college-theme', 'school-theme');
        document.body.classList.add(theme + '-theme');
    }

    selectTheme(theme) {
        console.log('Theme selected:', theme);
        this.selectedTheme = theme;
        
        // Save theme to localStorage immediately
        localStorage.setItem('algorithmVisualizerTheme', theme);
        
        // Apply theme immediately
        this.applyTheme(theme);
        
        // Sync with server (set cookie)
        this.syncThemeWithServer(theme);
        
        // Update UI
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`[data-theme="${theme}"]`).classList.add('selected');
        
        // Update button
        const selectedCard = document.querySelector(`[data-theme="${theme}"]`);
        const button = selectedCard.querySelector('.theme-select-btn');
        const originalText = button.textContent;
        button.textContent = '✓ Theme Applied!';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
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
            console.log('Theme synced with server:', theme);
        } catch (error) {
            console.log('Theme sync failed:', error);
        }
    }

    // ==================== STATISTICS LOADING ====================
    
    async loadStats() {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            
            if (data.total_interactions) {
                const statsElement = document.getElementById('totalInteractions');
                if (statsElement) {
                    statsElement.textContent = data.total_interactions;
                }
            }
        } catch (error) {
            console.log('Analytics not available:', error);
        }
    }

    // ==================== EVENT LISTENERS ====================
    
    setupEventListeners() {
        // Theme card click events
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectTheme(card.dataset.theme);
            });
        });

        // Button click events for analytics
        document.querySelectorAll('a[href*="/algorithms"]').forEach(link => {
            link.addEventListener('click', () => {
                this.logInteraction('homepage', 'algorithm_page_visit');
            });
        });
    }

    // ==================== ANALYTICS ====================
    
    logInteraction(page, action, data = null) {
        const interaction = {
            timestamp: new Date().toISOString(),
            page: page,
            action: action,
            data: data
        };
        
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
    
    initialize() {
        console.log('Initializing AlgoVizard Homepage...');
        
        // Apply saved theme
        this.applyTheme(this.selectedTheme);
        
        // Show selected card
        const selectedCard = document.querySelector(`[data-theme="${this.selectedTheme}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load statistics
        this.loadStats();
        
        // Log page view
        this.logInteraction('homepage', 'page_view');
        
        console.log('Homepage initialization complete');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const homepage = new AlgoVizardHome();
    homepage.initialize();
    
    // Make it globally accessible for debugging
    window.algoVizardHome = homepage;
});