# CineQuiz 

**A dynamic, interactive web application for movie lovers — discover films and test your cinema knowledge.**

---

## Description

CineQuiz is a Level 5 Web Development project that combines real-time movie browsing with an interactive film-knowledge quiz. Users can search thousands of movies using live data from The Movie Database (TMDB) API, filter results by genre, year, and rating, save favourites to a personal watchlist, and challenge themselves with a timed multiple-choice quiz.

The project demonstrates responsive front-end design, JavaScript DOM manipulation, asynchronous API integration, and local data persistence — all built with pure HTML, CSS, and JavaScript (no frameworks).

**Live site:** [https://YOUR-USERNAME.github.io/CineQuiz/](https://YOUR-USERNAME.github.io/CineQuiz/)
*(Replace YOUR-USERNAME with your GitHub username after deployment)*

---

## User Stories

### First-Time Visitor

- As a first-time visitor, I want to immediately understand what CineQuiz offers, so I can decide whether to explore movies or take the quiz.
- As a first-time visitor, I want to search for a film I know, so I can confirm the database is up to date.
- As a first-time visitor, I want the site to work on my phone, so I can browse on any device.

### Returning Visitor

- As a returning visitor, I want my saved movies to still be listed, so I can continue building my watchlist without starting over.
- As a returning visitor, I want to retake the quiz, so I can try to beat my previous score.

### Quiz User

- As a quiz user, I want clear multiple-choice questions, so I can answer with confidence.
- As a quiz user, I want instant feedback after each answer, so I know whether I was right.
- As a quiz user, I want a countdown timer, so the quiz feels challenging.
- As a quiz user, I want a results summary showing my score and accuracy, so I know how well I did.

### Movie Explorer

- As a movie explorer, I want to filter films by genre, year, and rating, so I can find movies that match my taste.
- As a movie explorer, I want to save movies I like, so I can find them again easily.
- As a movie explorer, I want useful error messages if the API fails, so the site does not just go blank.

---

## Tools Used

### Languages
- **HTML5** — Semantic page structure and accessibility attributes
- **CSS3** — Styling, responsive layout (CSS Grid, Flexbox), animations, and media queries
- **JavaScript (ES6+)** — DOM manipulation, async/await API calls, localStorage, and quiz logic

### APIs & Libraries
- [TMDB API](https://www.themoviedb.org/documentation/api) — Real-time movie data (titles, posters, ratings, genres)
- [Font Awesome 6.4.0](https://fontawesome.com/) (CDN) — Icons throughout the UI

### Development & Testing Tools
- **VS Code** — Code editor
- **Git & GitHub** — Version control and repository hosting
- **GitHub Pages** — Cloud deployment
- **Chrome DevTools** — Debugging, Lighthouse audits, and responsive testing
- **W3C HTML Validator** — HTML code validation
- **W3C CSS Validator** — CSS code validation
- **JSHint** — JavaScript linting

---

## Design

### Colour Palette

| Role | Colour | Hex |
|------|--------|-----|
| Primary Background | Dark Blue | `#0d253f` |
| Secondary Background | Navy | `#1a365d` |
| Primary Accent | Cyan | `#01b4e4` |
| Secondary Accent | Soft Green | `#90cea1` |
| Error / Danger | Red | `#dc3545` |
| Body Text | White | `#ffffff` |
| Muted Text | Light Grey | `#cccccc` / `#888888` |

The palette mirrors the official TMDB brand colours (cyan and dark blue), giving the application a professional cinematic feel that users who are familiar with TMDB will recognise.

### Typography

- **Font Stack:** `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` — a clean, system-native sans-serif stack applied consistently across all pages.
- **Line Height:** `1.6` — ensures comfortable reading on all screen sizes.
- **Heading colours:** `#01b4e4` (cyan) for section headings to maintain visual hierarchy.

### Wireframes

Wireframes were sketched at the planning stage to define layout before coding began. Designs cover three breakpoints: mobile (≤ 480 px), tablet (≤ 768 px), and desktop (> 768 px).

Wireframe images are stored in the [`documentation/`](documentation/) folder.

---

## Features

### All Pages

- **Sticky Navigation Bar** — links to Home, Explore, and Quiz. The active page link is highlighted and marked with `aria-current="page"`.
- **Skip to Content Link** — visually hidden link revealed on keyboard focus for screen reader / keyboard users (accessibility requirement).
- **Theme Toggle** — button in the navbar switches between the default dark theme and a light mode using `classList.toggle()`.
- **Responsive Layout** — CSS Grid and Flexbox ensure the layout adapts from a single column on mobile up to multi-column on desktop.
- **Consistent Footer** — TMDB attribution, project links, and copyright notice on every page.

### Home Page (`index.html`)

- **Hero Section** — large headline with gradient text, a description, statistics strip (1M+ Movies, Real-time Data, Interactive Quizzes), and two call-to-action buttons.
- **Features Grid** — three cards summarising the main value propositions (Real Movie Database, Test Your Knowledge, Save Favourites).
- **Quick Search** — input redirects to `explore.html?search=<query>` with validation (red border if empty). Responds to button click and Enter key.
- **Quick Quiz Preview** — a single sample question demonstrating the quiz UI; instant correct/incorrect feedback with colour-coded options.
- **Testimonials** — two user testimonial cards.
- **Call-to-Action Banner** — encourages users to explore movies or start the full quiz.

### Explore Page (`explore.html`)

- **Live Movie Search** — searches TMDB API by title using `async/await`; results update dynamically in the grid.
- **Genre Filter** — seven genre options (Action, Adventure, Comedy, Drama, Horror, Sci-Fi, Thriller) passed to the TMDB discover endpoint.
- **Year Filter** — narrow results by release year (2022–2026).
- **Rating Filter** — show only movies rated 7+, 8+, or 9+ stars using `vote_average.gte`.
- **Apply / Reset Filters** — "Apply Filters" builds a dynamic API URL from selected values; "Reset" restores default popular movies.
- **Movie Cards** — each card shows the poster image (with placeholder fallback), title, release year, and star rating.
- **Save Movie** — clicking Save stores the movie in `localStorage` and shows a toast notification. Duplicate saves are detected and reported.
- **Saved Movies Section** — dynamically shown section listing saved movies with individual Remove buttons and a Clear All option.
- **Error Handling** — user-friendly error message (no browser alerts) if the API call fails.
- **Loading Indicator** — animated spinner displayed while movies are being fetched.
- **URL Search Parameter** — `?search=<query>` from the home page quick search pre-fills the input and triggers a search automatically.

### Quiz Page (`quiz.html`)

- **5 Movie Questions** — multiple-choice questions with 4 options each, covering directors, actors, award winners, and release years.
- **60-Second Global Timer** — countdown starts when the page loads; turns red under 10 seconds as a visual warning; quiz ends automatically if time runs out.
- **Instant Feedback** — correct/incorrect message after each submission; the correct option is highlighted in green; the wrong chosen option in red.
- **Score Tracking** — score display in the stats bar updates after every submission.
- **Question Counter** — "Question X/5" label updated with each new question.
- **Progress Bar** — visual bar fills proportionally as the quiz advances; reaches 100% on completion.
- **Results Screen** — shows final score (e.g. 4/5), a performance message based on percentage, correct answer count, time taken, and accuracy percentage.
- **Restart / Play Again** — both the Restart button (mid-quiz) and the Play Again button (on results) reset all state and restart the timer.
- **Quiz Tips** — three tips in a grid below the quiz container.

---

## Project Development

### Milestones

1. **Project Setup** — Defined folder structure (`assets/css/`, `assets/js/`, `assets/images/`, `documentation/`), created base HTML files, and linked external CSS and JS.
2. **Home Page** — Built hero section, features grid, quick search with redirect, and quick quiz preview.
3. **Explore Page** — Integrated TMDB API with `fetch` and `async/await`, implemented search and filter logic, movie cards, and localStorage save feature.
4. **Quiz Page** — Wrote quiz state machine (load → select → submit → next → results), 60s countdown timer, progress bar, and results breakdown.
5. **Accessibility & Responsiveness** — Added ARIA labels, skip links, `role` attributes, `aria-live` regions, and three-breakpoint media queries.
6. **Code Quality** — Added JSDoc-style comments, aligned CSS class names with HTML, removed `alert()` calls in favour of toast notifications and inline error messages.
7. **Testing & Validation** — Validated HTML/CSS, linted JavaScript, ran Lighthouse audits, and completed manual test plan.
8. **Deployment** — Pushed to GitHub and enabled GitHub Pages.

### Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| CSS class name mismatches (`.nav-links` in CSS vs `.nav-menu` in HTML) | Performed a systematic audit comparing HTML class names against the stylesheet and added the missing rules. |
| Duplicate event listeners on the search button (both `main.js` and `movie-api.js` loaded on explore.html) | Added a page-detection guard in `main.js` to skip the home search listener when on `explore.html`. |
| Timer stopping incorrectly on restart | Ensured `clearInterval` is always called in `stopTimer()` before re-assigning `timerInterval`, preventing multiple intervals running simultaneously. |
| `alert()` calls breaking user experience | Replaced all `alert()` calls with a reusable `showToast()` function (DOM-based, auto-dismissing notification). |
| API key exposed client-side | Noted as a known limitation for this educational project. In production, a server-side proxy would be used to protect the key. |

---

## Testing

### Manual Testing Principles

Manual testing involves a human tester stepping through predefined test cases and checking the actual result against the expected result. It is most useful for:
- Checking visual appearance, layout, and user experience
- Testing interactive flows that are hard to automate (e.g. API responses, responsive layouts)
- Quick checks during development

### Automated Testing Principles

Automated testing uses scripts (e.g. Jest) to run test cases programmatically. It is most useful for:
- Repeating the same tests quickly after code changes (regression testing)
- Testing pure functions with predictable inputs and outputs
- Continuous integration pipelines

For this project, manual testing was the primary approach. Automated Jest testing is optional per the project criteria and was not implemented.

### Manual Test Cases

Full test results are documented in [`documentation/testing.xlsx`](documentation/testing.xlsx).

| # | Test Case | Expected Result | Actual Result | Pass/Fail |
|---|-----------|-----------------|---------------|-----------|
| 1 | Click "Explore Movies" on Home | Navigates to explore.html | Navigates correctly | ✅ Pass |
| 2 | Click "Start Quiz" on Home | Navigates to quiz.html | Navigates correctly | ✅ Pass |
| 3 | Theme toggle click | Switches between dark and light mode | Mode switches, icon updates | ✅ Pass |
| 4 | Home quick search (valid input) | Redirects to explore.html?search=query | Redirects with query | ✅ Pass |
| 5 | Home quick search (empty input) | Input border turns red | Red border appears | ✅ Pass |
| 6 | Quick quiz: click correct answer | Green feedback shown | Green feedback shown | ✅ Pass |
| 7 | Quick quiz: click incorrect answer | Red feedback, correct answer highlighted | Correct | ✅ Pass |
| 8 | Explore: search "Batman" | Batman movies displayed in grid | Movies displayed | ✅ Pass |
| 9 | Explore: search (empty input) | Error message shown | Error message shown | ✅ Pass |
| 10 | Explore: apply genre filter (Action) | Action movies shown | Filtered correctly | ✅ Pass |
| 11 | Explore: apply year filter (2024) | 2024 movies shown | Filtered correctly | ✅ Pass |
| 12 | Explore: reset filters | Popular movies reload | Movies reload | ✅ Pass |
| 13 | Explore: save a movie | Toast shown, movie saved to localStorage | Toast shown | ✅ Pass |
| 14 | Explore: save duplicate movie | "Already saved" toast shown | Toast shown | ✅ Pass |
| 15 | Explore: remove saved movie | Movie removed from saved section | Removed correctly | ✅ Pass |
| 16 | Explore: clear all saved | Saved section hidden | Section hidden | ✅ Pass |
| 17 | Quiz: select an answer | Option highlighted as selected | Option highlighted | ✅ Pass |
| 18 | Quiz: submit correct answer | Score increments, green feedback | Correct | ✅ Pass |
| 19 | Quiz: submit wrong answer | Red feedback, correct option highlighted | Correct | ✅ Pass |
| 20 | Quiz: timer countdown | Decrements 60→0 over 60 seconds | Timer works | ✅ Pass |
| 21 | Quiz: timer turns red under 10s | Timer text colour changes to red | Colour changes | ✅ Pass |
| 22 | Quiz: complete all 5 questions | Results screen shown with score | Results shown | ✅ Pass |
| 23 | Quiz: results show accuracy % | Accuracy calculated correctly | Correct | ✅ Pass |
| 24 | Quiz: restart button | Quiz resets from Question 1 | Quiz resets | ✅ Pass |
| 25 | Quiz: play again (on results) | Quiz resets from results screen | Resets correctly | ✅ Pass |
| 26 | Mobile view (375 px) | All content stacks vertically, no overflow | Stacks correctly | ✅ Pass |
| 27 | Tablet view (768 px) | Layout adjusts grid columns | Adjusts correctly | ✅ Pass |
| 28 | API error (network off) | Error message shown, no console crash | Error message shown | ✅ Pass |

### Browser Compatibility

| Browser | Version | Result |
|---------|---------|--------|
| Google Chrome | 132 | ✅ Pass |
| Microsoft Edge | 132 | ✅ Pass |
| Mozilla Firefox | 133 | ✅ Pass |

Screenshots of the site in each browser are stored in `documentation/screenshots/`.

### Code Validation

| File | Validator | Result |
|------|-----------|--------|
| `index.html` | W3C HTML Validator | ✅ No errors |
| `explore.html` | W3C HTML Validator | ✅ No errors |
| `quiz.html` | W3C HTML Validator | ✅ No errors |
| `assets/css/style.css` | W3C CSS Validator | ✅ No errors |
| `assets/js/main.js` | JSHint | ✅ No major issues |
| `assets/js/quiz.js` | JSHint | ✅ No major issues |
| `assets/js/movie-api.js` | JSHint | ✅ No major issues |

Validation screenshots are stored in `documentation/validation/`.

### Lighthouse (Chrome DevTools)

Lighthouse tests were run in Chrome DevTools for each page in an incognito window.

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| `index.html` | 90+ | 95+ | 95+ | 90+ |
| `explore.html` | 85+ | 95+ | 90+ | 90+ |
| `quiz.html` | 90+ | 95+ | 95+ | 90+ |

Lighthouse screenshots are stored in `documentation/lighthouse/`.

---

## Deployment

### Steps to Deploy on GitHub Pages

1. Ensure all code is committed and pushed to the `main` branch on GitHub.
2. Open the GitHub repository and go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then click **Save**.
5. GitHub builds and deploys the site (usually within 1–2 minutes).
6. The live URL appears at the top of the Pages settings page.

### Running Locally

No build step is required. Clone the repository and open `index.html` in any modern browser:

```bash
git clone https://github.com/YOUR-USERNAME/CineQuiz.git
cd CineQuiz
# Open index.html in your browser
```

---

## Project File Structure

```
CineQuiz/
├── index.html              # Home page
├── explore.html            # Movie discovery page
├── quiz.html               # Interactive quiz page
├── README.md               # Project documentation (this file)
├── assets/
│   ├── css/
│   │   └── style.css       # All styles (responsive, theme, components)
│   ├── js/
│   │   ├── main.js         # Theme toggle, home search, home quiz preview
│   │   ├── quiz.js         # Quiz logic, timer, progress, results
│   │   └── movie-api.js    # TMDB API calls, filters, saved movies
│   └── images/
│       ├── cinema-picture.jpg
│       ├── inception-2010.jpg
│       ├── interstellar.jpg
│       ├── schindler-list.jpg
│       ├── spirited-away.jpg
│       ├── the-dark-knight.jpg
│       ├── the-dark-knight-1.jpg
│       └── the-shawshank-redemption.jpg
└── documentation/
    ├── testing.xlsx        # Manual test cases and results
    └── user-stories.xlsx   # User stories and acceptance criteria
```

---

## Credits

### External Code & APIs

- **TMDB API** — All movie data (titles, posters, ratings, release dates, genres) is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB. API documentation: https://developer.themoviedb.org/docs
- **Font Awesome 6.4.0** — Icons are loaded from the Font Awesome CDN (free tier). Source: https://fontawesome.com/

### Images

Local image assets in `assets/images/` are included for educational and demonstration purposes only. All films referenced are the property of their respective studios.

### No AI-generated code was used in this project.

---

## Acknowledgements

- Thanks to the iungo Solutions teaching team for the detailed project brief and ongoing guidance throughout the Level 5 Web Development course.
- Thanks to TMDB for providing a free, well-documented public API that makes projects like this possible.

---

## Known Issues & Future Improvements

| Item | Detail |
|------|--------|
| API key exposure | The TMDB API key is in client-side JS. For a production app, a server-side proxy should protect it. |
| Navigation on mobile | The nav menu is hidden on mobile (no hamburger menu). A future improvement would add a responsive hamburger toggle. |
| Quiz questions | Questions are hardcoded. A future version could fetch questions dynamically from the TMDB API (e.g. random movie details). |
| Leaderboard | The leaderboard section is a placeholder. A backend or third-party service (e.g. Firebase) could store high scores. |
| Pagination | The explore page shows one page of results. Infinite scroll or a "Load More" button would improve discovery. |
