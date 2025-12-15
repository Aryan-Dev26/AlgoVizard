/**
 * AlgoVizard - Quiz Mode System
 * Author: Aryan Pravin Sahu
 * Interactive quiz system for testing algorithm understanding
 */

class AlgorithmQuiz {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.selectedAnswer = null;
        this.questions = [];
        this.isAnswered = false;
        
        this.generateQuestions();
        this.initializeEventListeners();
        this.displayQuestion();
    }

    generateQuestions() {
        this.questions = [
            {
                type: 'visualization',
                question: 'Looking at this array state during bubble sort, which two elements are being compared?',
                array: [34, 25, 64, 12, 22, 11, 90],
                highlighting: [1, 2],
                options: ['34 and 25', '25 and 64', '64 and 12', '12 and 22'],
                correct: 1,
                hint: 'Look at the highlighted elements in the visualization.',
                explanation: 'In bubble sort, adjacent elements are compared. The highlighted elements 25 and 64 are being compared.'
            },
            {
                type: 'concept',
                question: 'What is the time complexity of bubble sort in the worst case?',
                options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
                correct: 2,
                hint: 'Consider how many comparisons are needed when the array is in reverse order.',
                explanation: 'Bubble sort has O(n²) time complexity in the worst case because it needs to make n passes through the array, comparing adjacent elements.'
            },
            {
                type: 'prediction',
                question: 'After one complete pass of bubble sort on [64, 34, 25, 12], what will the array look like?',
                array: [64, 34, 25, 12],
                options: ['[34, 25, 12, 64]', '[12, 25, 34, 64]', '[64, 34, 25, 12]', '[25, 34, 12, 64]'],
                correct: 0,
                hint: 'The largest element will "bubble up" to the end after one complete pass.',
                explanation: 'After one pass, the largest element (64) moves to its correct position at the end: [34, 25, 12, 64].'
            },
            {
                type: 'comparison',
                question: 'Which sorting algorithm is generally more efficient for large datasets?',
                options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'All are equally efficient'],
                correct: 2,
                hint: 'Consider the time complexities: O(n²) vs O(n log n).',
                explanation: 'Merge sort with O(n log n) complexity is much more efficient than bubble sort and selection sort which are O(n²).'
            },
            {
                type: 'visualization',
                question: 'In selection sort, what does the highlighted region represent?',
                array: [11, 12, 25, 64, 34, 22, 90],
                highlighting: [0, 1, 2],
                options: ['Unsorted portion', 'Sorted portion', 'Elements being compared', 'Elements to be swapped'],
                correct: 1,
                hint: 'Selection sort builds the sorted array from left to right.',
                explanation: 'The highlighted region shows the sorted portion of the array. Selection sort maintains a sorted region that grows with each pass.'
            },
            {
                type: 'concept',
                question: 'Which sorting algorithm uses the divide-and-conquer approach?',
                options: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort'],
                correct: 3,
                hint: 'Think about which algorithm recursively divides the problem into smaller subproblems.',
                explanation: 'Merge sort uses divide-and-conquer by recursively dividing the array into halves, sorting them, and then merging.'
            },
            {
                type: 'stability',
                question: 'Which of these sorting algorithms is stable?',
                options: ['Selection Sort', 'Merge Sort', 'Quick Sort (typical implementation)', 'Heap Sort'],
                correct: 1,
                hint: 'A stable sort maintains the relative order of equal elements.',
                explanation: 'Merge sort is stable because it maintains the relative order of equal elements during the merge process.'
            },
            {
                type: 'prediction',
                question: 'What will be the next step in insertion sort for array [11, 25, 34, 12, 22]?',
                array: [11, 25, 34, 12, 22],
                highlighting: [3],
                options: ['Compare 12 with 34', 'Swap 12 and 34', 'Move to element 22', 'Array is sorted'],
                correct: 0,
                hint: 'Insertion sort processes elements one by one, inserting them into their correct position.',
                explanation: 'The highlighted element (12) needs to be inserted into the sorted portion. First, it compares with 34.'
            },
            {
                type: 'space_complexity',
                question: 'Which algorithm requires additional space proportional to the input size?',
                options: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort'],
                correct: 3,
                hint: 'Consider which algorithm needs temporary arrays for its operation.',
                explanation: 'Merge sort requires O(n) additional space for temporary arrays during the merge process.'
            },
            {
                type: 'best_case',
                question: 'Which algorithm performs best when the array is already nearly sorted?',
                options: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'All perform equally'],
                correct: 2,
                hint: 'Consider which algorithm can take advantage of existing order in the data.',
                explanation: 'Insertion sort performs best on nearly sorted data with O(n) time complexity in the best case.'
            }
        ];
    }

    initializeEventListeners() {
        document.getElementById('submitAnswer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        document.getElementById('hintButton').addEventListener('click', () => this.showHint());
        document.getElementById('retakeQuiz').addEventListener('click', () => this.restartQuiz());
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update progress
        this.updateProgress();
        
        // Reset state
        this.selectedAnswer = null;
        this.isAnswered = false;
        document.getElementById('submitAnswer').disabled = true;
        document.getElementById('nextQuestion').style.display = 'none';
        document.getElementById('hintSection').style.display = 'none';
        document.getElementById('explanationSection').style.display = 'none';
        
        // Update question display
        document.getElementById('questionNumber').textContent = `Question ${this.currentQuestionIndex + 1}`;
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('hintText').textContent = question.hint;
        document.getElementById('explanationText').textContent = question.explanation;
        
        // Display visualization if needed
        if (question.array) {
            this.displayVisualization(question.array, question.highlighting || []);
            document.getElementById('visualizationArea').style.display = 'flex';
        } else {
            document.getElementById('visualizationArea').style.display = 'none';
        }
        
        // Display options
        this.displayOptions(question.options);
    }

    displayVisualization(array, highlighting = []) {
        const container = document.getElementById('arrayContainer');
        container.innerHTML = '';
        
        const maxValue = Math.max(...array);
        
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${(value / maxValue) * 150}px`;
            bar.textContent = value;
            
            if (highlighting.includes(index)) {
                bar.classList.add('highlight');
            }
            
            container.appendChild(bar);
        });
    }

    displayOptions(options) {
        const container = document.getElementById('optionsGrid');
        container.innerHTML = '';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.addEventListener('click', () => this.selectOption(index, button));
            container.appendChild(button);
        });
    }

    selectOption(index, buttonElement) {
        if (this.isAnswered) return;
        
        // Remove previous selection
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select new option
        buttonElement.classList.add('selected');
        this.selectedAnswer = index;
        document.getElementById('submitAnswer').disabled = false;
    }

    submitAnswer() {
        if (this.selectedAnswer === null || this.isAnswered) return;
        
        this.isAnswered = true;
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;
        
        // Update score and stats
        if (isCorrect) {
            this.correctAnswers++;
            this.score += 10 + this.streak; // Bonus points for streak
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
        } else {
            this.streak = 0;
        }
        
        // Update UI
        this.updateScoreDisplay();
        this.highlightAnswers(question.correct);
        document.getElementById('explanationSection').style.display = 'block';
        document.getElementById('submitAnswer').style.display = 'none';
        
        // Show next button or complete quiz
        if (this.currentQuestionIndex < this.questions.length - 1) {
            document.getElementById('nextQuestion').style.display = 'inline-block';
        } else {
            setTimeout(() => this.completeQuiz(), 2000);
        }
        
        // Log analytics
        this.logQuizInteraction('answer_submitted', {
            question_index: this.currentQuestionIndex,
            correct: isCorrect,
            selected_answer: this.selectedAnswer,
            correct_answer: question.correct
        });
    }

    highlightAnswers(correctIndex) {
        const buttons = document.querySelectorAll('.option-button');
        buttons.forEach((button, index) => {
            if (index === correctIndex) {
                button.classList.add('correct');
            } else if (index === this.selectedAnswer && index !== correctIndex) {
                button.classList.add('incorrect');
            }
            button.style.pointerEvents = 'none';
        });
    }

    showHint() {
        document.getElementById('hintSection').style.display = 'block';
        document.getElementById('hintButton').disabled = true;
        
        this.logQuizInteraction('hint_used', {
            question_index: this.currentQuestionIndex
        });
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        document.getElementById('submitAnswer').style.display = 'inline-block';
        document.getElementById('hintButton').disabled = false;
        this.displayQuestion();
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.questions.length;
    }

    updateScoreDisplay() {
        document.getElementById('correctAnswers').textContent = this.correctAnswers;
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('streakCount').textContent = this.streak;
    }

    completeQuiz() {
        const percentage = Math.round((this.correctAnswers / this.questions.length) * 100);
        
        // Hide quiz content and show results
        document.getElementById('quizContent').style.display = 'none';
        document.getElementById('quizComplete').style.display = 'block';
        
        // Update final results
        document.getElementById('finalScore').textContent = `${percentage}%`;
        document.getElementById('finalCorrect').textContent = this.correctAnswers;
        document.getElementById('finalTotal').textContent = this.questions.length;
        
        // Determine performance level and badge
        let performanceLevel, badgeClass;
        if (percentage >= 90) {
            performanceLevel = 'excellent';
            badgeClass = 'badge-excellent';
        } else if (percentage >= 75) {
            performanceLevel = 'very good';
            badgeClass = 'badge-good';
        } else if (percentage >= 60) {
            performanceLevel = 'good';
            badgeClass = 'badge-fair';
        } else {
            performanceLevel = 'needs improvement';
            badgeClass = 'badge-needs-improvement';
        }
        
        document.getElementById('performanceLevel').textContent = performanceLevel;
        document.getElementById('performanceBadge').textContent = this.getPerformanceBadgeText(percentage);
        document.getElementById('performanceBadge').className = `performance-badge ${badgeClass}`;
        
        // Log completion
        this.logQuizInteraction('quiz_completed', {
            final_score: this.score,
            correct_answers: this.correctAnswers,
            total_questions: this.questions.length,
            percentage: percentage,
            max_streak: this.maxStreak
        });
    }

    getPerformanceBadgeText(percentage) {
        if (percentage >= 90) return 'Algorithm Master! 🏆';
        if (percentage >= 75) return 'Great Understanding! 🌟';
        if (percentage >= 60) return 'Good Progress! 👍';
        return 'Keep Learning! 📚';
    }

    restartQuiz() {
        // Reset all state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.selectedAnswer = null;
        this.isAnswered = false;
        
        // Shuffle questions for variety
        this.shuffleQuestions();
        
        // Reset UI
        document.getElementById('quizContent').style.display = 'block';
        document.getElementById('quizComplete').style.display = 'none';
        
        this.updateScoreDisplay();
        this.displayQuestion();
        
        this.logQuizInteraction('quiz_restarted');
    }

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    logQuizInteraction(action, additionalData = {}) {
        const data = {
            page: 'quiz_mode',
            action: action,
            algorithm: 'quiz',
            data: {
                current_question: this.currentQuestionIndex,
                score: this.score,
                correct_answers: this.correctAnswers,
                streak: this.streak,
                ...additionalData
            }
        };

        fetch('/api/analytics/interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(error => console.error('Analytics error:', error));
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmQuiz();
});