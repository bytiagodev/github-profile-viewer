# Project Progress

## GitHub Profile Viewer
Repo: github-profile-viewer
Live: not deployed yet

## Stack
Vanilla HTML, CSS, JavaScript. No frameworks, no build tools.
Hosted on GitHub Pages when ready.

## Visual direction
Warm parchment background #fdf6ee with true white cards.
Accent color: burnt coral-orange #e8521a.
Dark almost-black header #1a1208 with white text and orange GH monogram favicon.
Typography: Syne (display/headings) and DM Mono (body).
Not following portfolio palette — this project shows range.

## Structure
- index.html — complete
- style.css — complete
- app.js — complete

## HTML sections
- header — dark background, title with accent span on "Profile"
- #search-section — text input and search button
- #error-message — hidden by default, shown on API errors
- #profile-section — hidden by default, revealed after successful search
  - #profile-card — avatar, name, username, bio, stats, links
  - #languages-section — top languages with animated chart
  - #repos-section — repo list with starred/recently updated toggle
- footer — API credit, year, name, links to GitHub and portfolio

## JavaScript
- fetchUser — GitHub API call with error handling for 404 and 403
- fetchRepos — fetches up to 100 public repos
- renderProfile — populates all profile card fields
- renderLanguages — aggregates languages across repos, renders top 6 with animated bars
- renderRepos — sorts and renders top 9 repos, supports stars and updated toggle
- timeAgo — converts dates to readable relative strings
- formatNumber — shortens large numbers to 1k format
- Promise.all — user and repos fetched simultaneously
- Enter key support on search input
- Loading pulse animation shown during fetch, removed on completion

## Decisions made
- README profile section excluded — freeform content, keeps app focused
- Language chart based on repo count per language not bytes
- Repo cards are anchor tags so whole card is clickable
- Search focus state uses warm shadow instead of accent border
- Favicon uses GH monogram in app colors rather than GitHub logo (brand reasons)
- Hidden sections use :not([hidden]) pattern to avoid display flex conflict
- Error message styled with accent palette to stay consistent with app tone

## Known issues
None currently.

## Planned next steps
- Feedback and polish session
- Deploy to GitHub Pages
- Update README with live link

## Commits so far
- Initial commit — project setup and README
- Add project structure — HTML, CSS and JS files
- Add progress tracker
- Add base styles — layout, typography, color palette and responsive structure
- Fix mobile layout — responsive search, header nowrap, section spacing