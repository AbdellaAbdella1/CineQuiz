/**
 * movie-api.js - CineQuiz TMDB API Integration
 * Handles fetching, displaying, filtering, and saving movies.
 * Uses The Movie Database (TMDB) API for real-time movie data.
 *
 * External source: TMDB API - https://www.themoviedb.org/documentation/api
 */

/* -----------------------------------------------
   API Configuration
----------------------------------------------- */
// Note: In a production app the API key would be stored server-side.
// For this educational project it is used client-side as permitted by TMDB free tier.
const TMDB_API_KEY = 'e072d5b79b3340aaa05fffc7c1f350be';
const TMDB_DISCOVER_URL = 'https://api.themoviedb.org/3/discover/movie';
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMG = 'https://via.placeholder.com/300x450/0d253f/01b4e4?text=No+Image';

/* -----------------------------------------------
   DOM Element References
----------------------------------------------- */
const moviesGrid = document.getElementById('movies-grid');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error-message');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('quick-search');
const moviesCountEl = document.getElementById('movies-count');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');

/* -----------------------------------------------
   Fetch Functions
----------------------------------------------- */

/**
 * Fetch popular movies from TMDB (default view).
 * Called on page load and after filters are reset.
 */
async function fetchMovies() {
    try {
        showLoading(true);

        const response = await fetch(
            TMDB_DISCOVER_URL + '?api_key=' + TMDB_API_KEY +
            '&language=en-US&page=1&sort_by=popularity.desc'
        );

        if (!response.ok) {
            throw new Error('API responded with status ' + response.status);
        }

        const data = await response.json();
        displayMovies(data.results);
        updateMoviesCount(data.results.length);

    } catch (error) {
        console.error('Error fetching movies:', error);
        showError('Failed to load movies. Please check your connection and try again.');
    } finally {
        showLoading(false);
    }
}

/**
 * Fetch movies using the current filter values (genre, year, rating).
 * Builds the API URL dynamically based on selected filter options.
 */
async function fetchMoviesWithFilters() {
    // Read filter values from the select elements
    var genreFilter = document.getElementById('genre-filter');
    var yearFilter = document.getElementById('year-filter');
    var ratingFilter = document.getElementById('rating-filter');

    var genre = genreFilter ? genreFilter.value : '';
    var year = yearFilter ? yearFilter.value : '';
    var rating = ratingFilter ? parseFloat(ratingFilter.value) : 0;

    // Build query URL - start with required parameters
    var url = TMDB_DISCOVER_URL + '?api_key=' + TMDB_API_KEY +
        '&language=en-US&page=1&sort_by=popularity.desc';

    // Append optional filter parameters if set
    if (genre) {
        url += '&with_genres=' + encodeURIComponent(genre);
    }
    if (year) {
        url += '&primary_release_year=' + encodeURIComponent(year);
    }
    if (rating > 0) {
        url += '&vote_average.gte=' + rating;
    }

    try {
        showLoading(true);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('API responded with status ' + response.status);
        }

        const data = await response.json();
        displayMovies(data.results);
        updateMoviesCount(data.results.length);

    } catch (error) {
        console.error('Error applying filters:', error);
        showError('Failed to apply filters. Please try again.');
    } finally {
        showLoading(false);
    }
}

/**
 * Search movies by title using the TMDB search endpoint.
 * Validates the input before making the API call.
 * @param {string} query - The search term entered by the user.
 */
async function searchMovies(query) {
    // Validate: reject empty or whitespace-only input
    if (!query || !query.trim()) {
        showError('Please enter a search term to find movies.');
        return;
    }

    try {
        showLoading(true);
        hideError();

        const response = await fetch(
            TMDB_SEARCH_URL + '?api_key=' + TMDB_API_KEY +
            '&query=' + encodeURIComponent(query.trim()) +
            '&language=en-US'
        );

        if (!response.ok) {
            throw new Error('Search API error: ' + response.status);
        }

        const data = await response.json();
        var results = data.results || [];
        displayMovies(results);
        updateMoviesCount(results.length);

    } catch (error) {
        console.error('Search error:', error);
        showError('Search failed. Please check your connection and try again.');
    } finally {
        showLoading(false);
    }
}

/* -----------------------------------------------
   Display Functions
----------------------------------------------- */

/**
 * Render an array of movie objects into the movies grid.
 * Displays poster image, title, year, rating, and a save button for each.
 * @param {Array} movies - Array of movie objects from the TMDB API.
 */
function displayMovies(movies) {
    if (!moviesGrid) { return; }

    moviesGrid.innerHTML = '';

    // Handle empty results
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<p class="no-results">No movies found. Try a different search or filter.</p>';
        return;
    }

    // Build a card for each movie
    movies.forEach(function (movie) {
        var card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('role', 'listitem');

        // Use placeholder if poster is missing
        var posterUrl = movie.poster_path
            ? IMAGE_URL + movie.poster_path
            : PLACEHOLDER_IMG;

        // Extract 4-digit year from release_date string
        var year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

        // Format rating to one decimal place
        var rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

        card.innerHTML =
            '<img src="' + posterUrl + '" alt="Poster for ' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<div class="movie-info">' +
            '  <h3>' + escapeHtml(movie.title) + ' (' + year + ')</h3>' +
            '  <p>\u2B50 ' + rating + '/10</p>' +
            '  <button class="btn btn-primary save-btn" aria-label="Save ' + escapeHtml(movie.title) + '">' +
            '    <i class="far fa-heart"></i> Save' +
            '  </button>' +
            '</div>';

        // Attach save event to the button
        var saveBtn = card.querySelector('.save-btn');
        saveBtn.addEventListener('click', function () { saveMovie(movie); });

        moviesGrid.appendChild(card);
    });
}

/**
 * Update the movies count label above the grid.
 * @param {number} count - Number of movies currently displayed.
 */
function updateMoviesCount(count) {
    if (moviesCountEl) {
        moviesCountEl.textContent = 'Showing ' + count + ' movie' + (count !== 1 ? 's' : '');
    }
}

/* -----------------------------------------------
   Saved Movies Functions
----------------------------------------------- */

/**
 * Save a movie object to localStorage.
 * Prevents duplicates and shows a toast notification.
 * @param {Object} movie - The movie object from the TMDB API.
 */
function saveMovie(movie) {
    var saved = JSON.parse(localStorage.getItem('savedMovies') || '[]');

    // Check for duplicate by movie ID
    var alreadySaved = saved.some(function (m) { return m.id === movie.id; });

    if (!alreadySaved) {
        saved.push(movie);
        localStorage.setItem('savedMovies', JSON.stringify(saved));
        showToast('\u2705 "' + movie.title + '" saved to your list!');
        loadSavedMovies(); // Refresh the saved section
    } else {
        showToast('\u2139\uFE0F "' + movie.title + '" is already in your saved list.');
    }
}

/**
 * Remove a single movie from the saved list by its ID.
 * @param {number} movieId - The TMDB ID of the movie to remove.
 */
function removeMovie(movieId) {
    var saved = JSON.parse(localStorage.getItem('savedMovies') || '[]');
    var updated = saved.filter(function (m) { return m.id !== movieId; });
    localStorage.setItem('savedMovies', JSON.stringify(updated));
    showToast('Movie removed from your saved list.');
    loadSavedMovies();
}

/**
 * Read saved movies from localStorage and display them in the saved section.
 * Shows the saved section if there are saved movies; hides it if empty.
 */
function loadSavedMovies() {
    var savedSection = document.getElementById('saved-movies-section');
    var savedGrid = document.getElementById('saved-movies-grid');

    if (!savedSection || !savedGrid) { return; }

    var saved = JSON.parse(localStorage.getItem('savedMovies') || '[]');

    // Hide section when there are no saved movies
    if (saved.length === 0) {
        savedSection.hidden = true;
        return;
    }

    savedSection.hidden = false;
    savedGrid.innerHTML = '';

    // Build a card for each saved movie
    saved.forEach(function (movie) {
        var card = document.createElement('div');
        card.className = 'movie-card';

        var posterUrl = movie.poster_path
            ? IMAGE_URL + movie.poster_path
            : PLACEHOLDER_IMG;

        var year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
        var rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

        card.innerHTML =
            '<img src="' + posterUrl + '" alt="Poster for ' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<div class="movie-info">' +
            '  <h3>' + escapeHtml(movie.title) + ' (' + year + ')</h3>' +
            '  <p>\u2B50 ' + rating + '/10</p>' +
            '  <button class="btn btn-danger btn-small remove-btn" aria-label="Remove ' + escapeHtml(movie.title) + '">' +
            '    <i class="fas fa-trash"></i> Remove' +
            '  </button>' +
            '</div>';

        var removeBtn = card.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function () { removeMovie(movie.id); });

        savedGrid.appendChild(card);
    });
}

/* -----------------------------------------------
   Filter Functions
----------------------------------------------- */

/**
 * Reset all filter dropdowns to their default values and reload popular movies.
 */
function resetFilters() {
    var genreFilter = document.getElementById('genre-filter');
    var yearFilter = document.getElementById('year-filter');
    var ratingFilter = document.getElementById('rating-filter');

    if (genreFilter) { genreFilter.value = ''; }
    if (yearFilter) { yearFilter.value = ''; }
    if (ratingFilter) { ratingFilter.value = '0'; }

    fetchMovies();
}

/* -----------------------------------------------
   UI Helper Functions
----------------------------------------------- */

/**
 * Show or hide the loading spinner.
 * @param {boolean} show - True to show, false to hide.
 */
function showLoading(show) {
    if (loading) { loading.hidden = !show; }
}

/**
 * Display an error message in the error element.
 * @param {string} message - The error text to display.
 */
function showError(message) {
    if (errorMsg) {
        var errorContent = errorMsg.querySelector('.error-content p') || errorMsg;
        if (errorContent.tagName === 'P') {
            errorContent.textContent = message;
        } else {
            errorMsg.textContent = message;
        }
        errorMsg.hidden = false;
    }
}

/**
 * Hide the error message element.
 */
function hideError() {
    if (errorMsg) { errorMsg.hidden = true; }
}

/**
 * Show a temporary toast notification at the bottom-right of the screen.
 * The toast disappears automatically after 3 seconds.
 * @param {string} message - The message to display.
 */
function showToast(message) {
    // Remove any existing toast before creating a new one
    var existingToast = document.querySelector('.toast');
    if (existingToast) { existingToast.remove(); }

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto-remove after 3 seconds with a fade-out transition
    setTimeout(function () {
        toast.classList.add('fade-out');
        setTimeout(function () {
            if (toast.parentNode) { toast.remove(); }
        }, 500);
    }, 3000);
}

/**
 * Escape HTML special characters to prevent XSS when injecting text into innerHTML.
 * @param {string} text - Raw text to sanitise.
 * @returns {string} Escaped string safe for HTML insertion.
 */
function escapeHtml(text) {
    if (!text) { return ''; }
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* -----------------------------------------------
   Event Listeners
----------------------------------------------- */

// Search button and Enter key on search input
if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function () {
        searchMovies(searchInput.value);
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchMovies(searchInput.value);
        }
    });
}

// Apply Filters button
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', fetchMoviesWithFilters);
}

// Reset Filters button
if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetFilters);
}

// Clear All saved movies button
var clearSavedBtn = document.getElementById('clear-saved');
if (clearSavedBtn) {
    clearSavedBtn.addEventListener('click', function () {
        localStorage.removeItem('savedMovies');
        showToast('All saved movies have been cleared.');
        loadSavedMovies();
    });
}

/* -----------------------------------------------
   Initialise on Page Load
----------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Only initialise if the movies grid is present (i.e. we are on explore.html)
    if (moviesGrid) {
        // Check if a search query was passed via URL (e.g. from the home page quick search)
        var urlParams = new URLSearchParams(window.location.search);
        var searchQuery = urlParams.get('search');

        if (searchQuery && searchQuery.trim()) {
            // Pre-fill search input and run the search
            if (searchInput) { searchInput.value = searchQuery; }
            searchMovies(searchQuery);
        } else {
            // Default: load popular movies
            fetchMovies();
        }

        // Load any previously saved movies
        loadSavedMovies();
    }
});
