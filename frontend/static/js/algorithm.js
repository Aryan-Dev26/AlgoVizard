/**
 * AlgoVizard - Algorithms Page JavaScript
 * Author: Aryan Pravin Sahu
 * Theme management and analytics for the algorithms listing page
 */

class AlgoVizardAlgorithms {
    constructor() {
        // No theme selection on this page, just theme application
    }

    // ==================== THEME MANAGEMENT ====================
    
    applyTheme(theme) {
        const head = document.head;

        const existingSchoolTheme = document.getElementById('school-theme');
        if (existingSchoolTheme) {
            existingSchoolTheme.remove();
        }

        if (theme === 'school') {
            const schoolThemeLink = document.createElement('link');
            schoolThemeLink.rel = 'stylesheet';
            schoolThemeLink.href = '/static/css/school-theme.css';
            schoolThemeLink.id = 'school-theme';
            head.appendChild(schoolThemeLink);
        }

        document.body.classList.remove('college-theme', 'school-theme');
        document.body.classList.add(theme + '-theme');
    }

    initTheme() {
        const savedTheme = localStorage.getItem('algorithmVisualizerTheme') || 'college';
        console.log('Algorithms page - detected theme:', savedTheme);
        this.applyTheme(savedTheme);
        
        // Also sync with server to update cookie
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
            console.log('Theme synced with server:', theme);
        } catch (error) {
            console.log('Theme sync failed:', error);
        }
    }

    // ==================== ANALYTICS LOADING ====================
    
    async loadAnalytics() {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();

            if (data.total_interactions) {
                const visualizationsElement = document.getElementById('totalVisualizations');
                if (visualizationsElement) {
                    visualizationsElement.textContent = data.total_interactions;
                }
            }

            // Count unique users
            const uniqueUsers = new Set();
            if (data.recent_activity) {
                data.recent_activity.forEach(activity => {
                    if (activity.ip_address) {
                        uniqueUsers.add(activity.ip_address);
                    }
                });
                const usersElement = document.getElementById('totalUsers');
                if (usersElement) {
                    usersElement.textContent = uniqueUsers.size;
                }
            }
        } catch (error) {
            console.log('Analytics not available:', error);
        }
    }

    // ==================== EVENT LISTENERS ====================
    
    setupEventListeners() {
        // Algorithm card click tracking
        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const algorithmCard = btn.closest('.algorithm-card');
                if (algorithmCard) {
                    const algorithmName = algorithmCard.querySelector('h3').textContent;
                    console.log(`User clicked on: ${algorithmName}`);
                    this.logInteraction('algorithms_page', 'algorithm_selected', { 
                        algorithm: algorithmName 
                    });
                }
            });
        });

        // Navigation tracking
        document.querySelectorAll('a[href="/"]').forEach(link => {
            link.addEventListener('click', () => {
                this.logInteraction('algorithms_page', 'home_navigation');
            });
        });

        document.querySelectorAll('a[href="/api/analytics"]').forEach(link => {
            link.addEventListener('click', () => {
                this.logInteraction('algorithms_page', 'analytics_view');
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
        console.log('Initializing AlgoVizard Algorithms Page...');
        
        // Apply theme
        this.initTheme();
        
        // Load analytics data
        this.loadAnalytics();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Log page view
        this.logInteraction('algorithms_page', 'page_view');
        
        console.log('Algorithms page initialization complete');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const algorithmsPage = new AlgoVizardAlgorithms();
    algorithmsPage.initialize();
    
    // Make it globally accessible for debugging
    window.algoVizardAlgorithms = algorithmsPage;
});