/**
 * main.js - CineQuiz Core UI Functions
 * Handles the dark/light theme toggle and home page interactions.
 * Loaded on every page.
 */

/* -----------------------------------------------
   Theme Toggle
   Switches between dark (default) and light mode.
----------------------------------------------- */
var themeBtn = document.querySelector('.theme-toggle');

if (themeBtn) {
    themeBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');

        // Swap the icon to reflect the current mode
        var icon = themeBtn.querySelector('i');
        if (icon) {
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    });
}

/* -----------------------------------------------
   Home Page Quick Search
   Redirects to explore.html with the search term in the URL.
   Only runs on the home page (index.html) to avoid conflicting
   with movie-api.js which handles the search on explore.html.
----------------------------------------------- */
var isHomePage = window.location.pathname.endsWith('/') ||
    window.location.pathname.includes('index.html') ||
    window.location.pathname === '/';

// Only attach home search if we are NOT on explore.html
if (!window.location.pathname.includes('explore.html')) {
    var homeSearchBtn = document.getElementById('search-btn');
    var homeSearchInput = document.getElementById('quick-search');

    if (homeSearchBtn && homeSearchInput) {
        homeSearchBtn.addEventListener('click', function () {
            var query = homeSearchInput.value.trim();

            if (query) {
                // Navigate to the explore page with the search term as a URL parameter
                window.location.href = 'explore.html?search=' + encodeURIComponent(query);
            } else {
                // Highlight the empty input with a red border as validation feedback
                homeSearchInput.style.borderColor = '#dc3545';
                homeSearchInput.focus();

                // Remove the highlight after 2 seconds
                setTimeout(function () {
                    homeSearchInput.style.borderColor = '';
                }, 2000);
            }
        });

        // Allow the user to submit the search by pressing Enter
        homeSearchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                homeSearchBtn.click();
            }
        });
    }
}

/* -----------------------------------------------
   Home Page Quick Quiz Preview
   Handles the single sample question shown on the home page.
   Gives instant feedback on correct/incorrect answers.
----------------------------------------------- */
var quizOptions = document.querySelectorAll('.quiz-options .quiz-option');
var quizFeedback = document.getElementById('quiz-feedback');

if (quizOptions.length > 0 && quizFeedback) {
    quizOptions.forEach(function (option) {
        option.addEventListener('click', function () {
            var isCorrect = this.dataset.correct === 'true';

            // Disable all options after an answer is chosen
            quizOptions.forEach(function (opt) {
                opt.disabled = true;

                // Highlight the correct answer for reference
                if (opt.dataset.correct === 'true') {
                    opt.classList.add('correct');
                }
            });

            // Mark the chosen incorrect option
            if (!isCorrect) {
                this.classList.add('incorrect');
            }

            // Show feedback message
            if (isCorrect) {
                quizFeedback.textContent = 'Correct! \u2705 Great film knowledge!';
                quizFeedback.className = 'feedback correct';
            } else {
                quizFeedback.textContent = 'Incorrect! \u274C The correct answer is highlighted above.';
                quizFeedback.className = 'feedback incorrect';
            }
        });
    });
}
