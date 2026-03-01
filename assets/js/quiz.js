/**
 * quiz.js - CineQuiz Interactive Quiz
 * Handles quiz logic, countdown timer, progress tracking, and results display.
 */

/* -----------------------------------------------
   Quiz Questions Data (5 questions required)
----------------------------------------------- */
const questions = [
    {
        question: "Which director made the film 'Inception' (2010)?",
        options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "James Cameron"],
        correct: 1
    },
    {
        question: "Who played Iron Man in the Marvel Cinematic Universe?",
        options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
        correct: 1
    },
    {
        question: "Which film won the Academy Award for Best Picture in 2023?",
        options: ["Everything Everywhere All at Once", "Top Gun: Maverick", "Elvis", "The Banshees of Inisherin"],
        correct: 0
    },
    {
        question: "In which year was 'The Godfather' first released?",
        options: ["1968", "1972", "1975", "1980"],
        correct: 1
    },
    {
        question: "Which actress starred in 'Pretty Woman' (1990)?",
        options: ["Meryl Streep", "Julia Roberts", "Sandra Bullock", "Meg Ryan"],
        correct: 1
    }
];

/* -----------------------------------------------
   State Variables
----------------------------------------------- */
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let timerInterval = null;
let timeLeft = 60;
let quizStartTime = null;

/* -----------------------------------------------
   DOM Element References
----------------------------------------------- */
const questionText = document.getElementById('question-text');
const optionsGrid = document.querySelector('.options-grid');
const scoreDisplay = document.getElementById('score');
const questionCount = document.getElementById('question-count');
const timerDisplay = document.getElementById('timer');
const nextBtn = document.getElementById('next-question');
const submitBtn = document.getElementById('submit-answer');
const restartBtn = document.getElementById('restart-quiz');
const feedback = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const progressPercentage = document.getElementById('progress-percentage');

/* -----------------------------------------------
   Timer Functions
----------------------------------------------- */

/**
 * Start the 60-second countdown timer for the whole quiz.
 * When time reaches zero, results are shown automatically.
 */
function startTimer() {
    timeLeft = 60;
    quizStartTime = Date.now();
    updateTimerDisplay();

    timerInterval = setInterval(function () {
        timeLeft--;
        updateTimerDisplay();

        // End quiz when time runs out
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            showResults();
        }
    }, 1000);
}

/**
 * Update the timer display element.
 * Turns red when fewer than 10 seconds remain as a warning.
 */
function updateTimerDisplay() {
    if (timerDisplay) {
        timerDisplay.textContent = 'Time: ' + timeLeft + 's';

        // Warn the user when time is almost up
        if (timeLeft <= 10) {
            timerDisplay.style.color = '#dc3545';
        } else {
            timerDisplay.style.color = '';
        }
    }
}

/**
 * Stop the countdown timer.
 */
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/* -----------------------------------------------
   Quiz Logic Functions
----------------------------------------------- */

/**
 * Load and display the current question.
 * Updates the question text, answer options, score, counter, and progress bar.
 */
function loadQuestion() {
    // If all questions are answered, show results
    if (currentQuestion >= questions.length) {
        stopTimer();
        showResults();
        return;
    }

    var q = questions[currentQuestion];

    // Display the question text
    questionText.textContent = q.question;

    // Clear previous options and build new ones
    optionsGrid.innerHTML = '';
    q.options.forEach(function (option, index) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.dataset.index = index;
        btn.addEventListener('click', function () { selectAnswer(btn); });
        optionsGrid.appendChild(btn);
    });

    // Reset state for new question
    selectedAnswer = null;
    submitBtn.disabled = true;
    nextBtn.disabled = true;
    feedback.textContent = '';
    feedback.className = 'feedback';

    // Update stats bar
    scoreDisplay.textContent = 'Score: ' + score;
    questionCount.textContent = 'Question: ' + (currentQuestion + 1) + '/' + questions.length;

    // Update question header label
    var questionNumber = document.querySelector('.question-number');
    if (questionNumber) {
        questionNumber.textContent = 'Question ' + (currentQuestion + 1);
    }

    // Update progress bar
    updateProgress();
}

/**
 * Update the progress bar width and percentage label.
 */
function updateProgress() {
    var percentage = Math.round((currentQuestion / questions.length) * 100);

    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    if (progressPercentage) {
        progressPercentage.textContent = percentage + '%';
    }
}

/**
 * Handle the user selecting an answer option.
 * Highlights the chosen button and enables the Submit button.
 * @param {HTMLElement} button - The clicked option button.
 */
function selectAnswer(button) {
    // Remove selection highlight from all options
    document.querySelectorAll('.quiz-option').forEach(function (opt) {
        opt.classList.remove('selected');
    });

    // Highlight the chosen option
    button.classList.add('selected');
    selectedAnswer = parseInt(button.dataset.index);
    submitBtn.disabled = false;
}

/**
 * Submit the selected answer for marking.
 * Checks correctness, updates score, provides feedback, and reveals correct answer.
 */
function submitAnswer() {
    // Guard: do nothing if no answer has been selected
    if (selectedAnswer === null) {
        return;
    }

    var q = questions[currentQuestion];
    var isCorrect = (selectedAnswer === q.correct);

    // Disable all options and highlight the correct answer
    document.querySelectorAll('.quiz-option').forEach(function (opt) {
        opt.disabled = true;
        var idx = parseInt(opt.dataset.index);

        if (idx === q.correct) {
            opt.classList.add('correct');
        } else if (idx === selectedAnswer && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });

    // Increment score and show appropriate feedback
    if (isCorrect) {
        score++;
        feedback.textContent = 'Correct! Well done! ✅';
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = 'Incorrect! The correct answer has been highlighted. ❌';
        feedback.className = 'feedback incorrect';
    }

    // Refresh score display
    scoreDisplay.textContent = 'Score: ' + score;

    // Allow the user to proceed
    submitBtn.disabled = true;
    nextBtn.disabled = false;
}

/**
 * Advance to the next question.
 */
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

/**
 * Display the results screen with final score and performance statistics.
 */
function showResults() {
    stopTimer();

    // Calculate time taken
    var timeTakenSec = quizStartTime
        ? Math.round((Date.now() - quizStartTime) / 1000)
        : 60;

    // Calculate accuracy
    var accuracy = questions.length > 0
        ? Math.round((score / questions.length) * 100)
        : 0;

    // Switch screens
    var quizContent = document.getElementById('quiz-content');
    var resultsDiv = document.getElementById('results');
    if (quizContent) { quizContent.hidden = true; }
    if (resultsDiv) { resultsDiv.hidden = false; }

    // Set final score
    var finalScore = document.getElementById('final-score');
    if (finalScore) {
        finalScore.textContent = score + '/' + questions.length;
    }

    // Set performance message based on score
    var resultMessage = document.getElementById('result-message');
    if (resultMessage) {
        if (score === questions.length) {
            resultMessage.textContent = 'Perfect score! You are a true film expert! 🏆';
        } else if (score >= Math.ceil(questions.length * 0.8)) {
            resultMessage.textContent = 'Excellent! You really know your movies! 🌟';
        } else if (score >= Math.ceil(questions.length * 0.6)) {
            resultMessage.textContent = 'Good effort! Keep watching and learning! 👍';
        } else {
            resultMessage.textContent = 'Keep practising! Every expert started somewhere. 🎬';
        }
    }

    // Populate breakdown statistics
    var correctCount = document.getElementById('correct-count');
    var timeTakenDisplay = document.getElementById('time-taken');
    var accuracyDisplay = document.getElementById('accuracy');

    if (correctCount) { correctCount.textContent = score; }
    if (timeTakenDisplay) { timeTakenDisplay.textContent = timeTakenSec + 's'; }
    if (accuracyDisplay) { accuracyDisplay.textContent = accuracy + '%'; }

    // Fill progress bar to 100%
    if (progressBar) { progressBar.style.width = '100%'; }
    if (progressPercentage) { progressPercentage.textContent = '100%'; }
}

/**
 * Reset the quiz back to question 1 with a fresh score and timer.
 */
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    stopTimer();

    // Show quiz content, hide results
    var quizContent = document.getElementById('quiz-content');
    var resultsDiv = document.getElementById('results');
    if (quizContent) { quizContent.hidden = false; }
    if (resultsDiv) { resultsDiv.hidden = true; }

    // Reset timer display colour
    if (timerDisplay) { timerDisplay.style.color = ''; }

    loadQuestion();
    startTimer();
}

/* -----------------------------------------------
   Event Listeners
----------------------------------------------- */
if (submitBtn) { submitBtn.addEventListener('click', submitAnswer); }
if (nextBtn) { nextBtn.addEventListener('click', nextQuestion); }
if (restartBtn) { restartBtn.addEventListener('click', restartQuiz); }

// Play Again button on the results screen
var playAgainBtn = document.getElementById('play-again');
if (playAgainBtn) { playAgainBtn.addEventListener('click', restartQuiz); }

/* -----------------------------------------------
   Initialise Quiz on Page Load
----------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Only initialise if the quiz elements are present on this page
    if (questionText && optionsGrid) {
        loadQuestion();
        startTimer();
    }
});
