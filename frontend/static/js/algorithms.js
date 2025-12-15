/**
 * AlgoVizard - Algorithms Page Search and Filter Functionality
 * Author: Aryan Pravin Sahu
 */

class AlgorithmSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.complexityFilter = document.getElementById('complexityFilter');
        this.algorithmCards = document.querySelectorAll('.algorithm-card');
        
        this.initializeEventListeners();
        this.updateStats();
    }

    initializeEventListeners() {
        // Search input
        this.searchInput.addEventListener('input', () => this.filterAlgorithms());
        
        // Category filter
        this.categoryFilter.addEventListener('change', () => this.filterAlgorithms());
        
        // Complexity filter
        this.complexityFilter.addEventListener('change', () => this.filterAlgorithms());
        
        // Clear search on Escape key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    filterAlgorithms() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const selectedCategory = this.categoryFilter.value;
        const selectedComplexity = this.complexityFilter.value;
        
        let visibleCount = 0;
        
        this.algorithmCards.forEach(card => {
            const shouldShow = this.shouldShowCard(card, searchTerm, selectedCategory, selectedComplexity);
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
        
        this.updateResultsCount(visibleCount);
        this.highlightSearchTerms(searchTerm);
    }

    shouldShowCard(card, searchTerm, category, complexity) {
        // Category filter
        if (category !== 'all') {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory !== category) {
                return false;
            }
        }
        
        // Complexity filter
        if (complexity !== 'all') {
            const cardComplexity = card.getAttribute('data-complexity');
            if (cardComplexity !== complexity) {
                return false;
            }
        }
        
        // Search term filter
        if (searchTerm) {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.algorithm-description').textContent.toLowerCase();
            const keywords = card.getAttribute('data-keywords') || '';
            const complexityValues = Array.from(card.querySelectorAll('.complexity-value'))
                .map(el => el.textContent.toLowerCase()).join(' ');
            
            const searchableText = `${title} ${description} ${keywords} ${complexityValues}`;
            
            // Check if search term matches
            const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
            return searchWords.every(word => searchableText.includes(word));
        }
        
        return true;
    }

    highlightSearchTerms(searchTerm) {
        if (!searchTerm) {
            // Remove existing highlights
            this.algorithmCards.forEach(card => {
                const title = card.querySelector('h3');
                const description = card.querySelector('.algorithm-description');
                
                title.innerHTML = title.textContent;
                description.innerHTML = description.textContent;
            });
            return;
        }
        
        const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
        
        this.algorithmCards.forEach(card => {
            if (card.style.display !== 'none') {
                const title = card.querySelector('h3');
                const description = card.querySelector('.algorithm-description');
                
                // Highlight in title
                let titleText = title.textContent;
                searchWords.forEach(word => {
                    const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
                    titleText = titleText.replace(regex, '<mark style="background: rgba(255, 193, 7, 0.3); color: white; padding: 2px 4px; border-radius: 3px;">$1</mark>');
                });
                title.innerHTML = titleText;
                
                // Highlight in description
                let descText = description.textContent;
                searchWords.forEach(word => {
                    const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
                    descText = descText.replace(regex, '<mark style="background: rgba(255, 193, 7, 0.3); color: white; padding: 2px 4px; border-radius: 3px;">$1</mark>');
                });
                description.innerHTML = descText;
            }
        });
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    updateResultsCount(count) {
        let resultsElement = document.getElementById('searchResults');
        
        if (!resultsElement) {
            resultsElement = document.createElement('div');
            resultsElement.id = 'searchResults';
            resultsElement.style.cssText = `
                text-align: center;
                color: rgba(255, 255, 255, 0.8);
                margin: 20px 0;
                font-size: 0.9rem;
            `;
            
            const algorithmGrid = document.getElementById('algorithmGrid');
            algorithmGrid.parentNode.insertBefore(resultsElement, algorithmGrid);
        }
        
        const totalCount = this.algorithmCards.length;
        
        if (count === totalCount) {
            resultsElement.style.display = 'none';
        } else {
            resultsElement.style.display = 'block';
            resultsElement.textContent = `Showing ${count} of ${totalCount} algorithms`;
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.categoryFilter.value = 'all';
        this.complexityFilter.value = 'all';
        this.filterAlgorithms();
    }

    updateStats() {
        // Update total algorithms count
        const totalAlgorithmsElement = document.getElementById('totalAlgorithms');
        if (totalAlgorithmsElement) {
            const algorithmCount = this.algorithmCards.length - 1; // Subtract 1 for comparison tool
            totalAlgorithmsElement.textContent = algorithmCount;
        }
        
        // Load analytics data
        this.loadAnalyticsData();
    }

    async loadAnalyticsData() {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            
            // Update visualizations count
            const totalVisualizationsElement = document.getElementById('totalVisualizations');
            if (totalVisualizationsElement) {
                totalVisualizationsElement.textContent = data.total_interactions || 0;
            }
            
            // Update users count
            const totalUsersElement = document.getElementById('totalUsers');
            if (totalUsersElement) {
                const uniqueUsers = this.countUniqueUsers(data.recent_activity || []);
                totalUsersElement.textContent = uniqueUsers;
            }
            
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    countUniqueUsers(activities) {
        const uniqueIPs = new Set();
        activities.forEach(activity => {
            if (activity.ip_address) {
                uniqueIPs.add(activity.ip_address);
            }
        });
        return uniqueIPs.size;
    }

    // Keyboard shortcuts
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
            
            // Ctrl/Cmd + / to clear search
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.clearSearch();
            }
        });
    }
}

// Advanced search suggestions
class SearchSuggestions {
    constructor(algorithmSearch) {
        this.algorithmSearch = algorithmSearch;
        this.suggestions = [
            'sorting algorithms',
            'O(n log n) complexity',
            'divide and conquer',
            'tree traversal',
            'graph algorithms',
            'data structures',
            'binary search',
            'stack operations',
            'queue operations',
            'comparison based sorting'
        ];
        
        this.createSuggestionsUI();
    }

    createSuggestionsUI() {
        const searchContainer = this.algorithmSearch.searchInput.parentElement;
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'searchSuggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            margin-top: 5px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(suggestionsContainer);
        
        // Show suggestions on focus
        this.algorithmSearch.searchInput.addEventListener('focus', () => {
            this.showSuggestions();
        });
        
        // Hide suggestions on blur (with delay for clicks)
        this.algorithmSearch.searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 200);
        });
    }

    showSuggestions() {
        const container = document.getElementById('searchSuggestions');
        const currentValue = this.algorithmSearch.searchInput.value.toLowerCase();
        
        const filteredSuggestions = this.suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(currentValue) && suggestion.toLowerCase() !== currentValue
        );
        
        if (filteredSuggestions.length > 0) {
            container.innerHTML = filteredSuggestions.map(suggestion => `
                <div class="suggestion-item" style="
                    padding: 10px 15px;
                    cursor: pointer;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.8);
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
                   onmouseout="this.style.background='transparent'"
                   onclick="document.getElementById('searchInput').value='${suggestion}'; document.getElementById('searchInput').dispatchEvent(new Event('input')); this.parentElement.style.display='none';">
                    ${suggestion}
                </div>
            `).join('');
            
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    }

    hideSuggestions() {
        const container = document.getElementById('searchSuggestions');
        if (container) {
            container.style.display = 'none';
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const algorithmSearch = new AlgorithmSearch();
    const searchSuggestions = new SearchSuggestions(algorithmSearch);
    
    algorithmSearch.initializeKeyboardShortcuts();
    
    // Add search tips
    const searchInput = document.getElementById('searchInput');
    searchInput.setAttribute('title', 'Search algorithms by name, description, or complexity. Use Ctrl+K to focus, Ctrl+/ to clear.');
});