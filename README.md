<p align="center">
  <img src="banner.svg" alt="GitHub Profile Viewer banner" width="100%" />
</p>

<p align="center">
  <a href="https://bytiagodev.github.io/github-profile-viewer/">Live</a> · <a href="https://bytiago.com">Portfolio</a>
</p>

---

## The idea

I wanted to build a simple tool that searches for a GitHub username and displays their profile. Instead of just throwing raw JSON onto the screen, I wanted to practice making an API demo that actually felt like a finished product. The whole thing is built with plain HTML, CSS, and vanilla JavaScript. There are no frameworks, no build steps, and no external dependencies.

## How it works

When you search for a username, the app makes two parallel requests to the GitHub REST API: one for the user's basic info and one for their public repositories. Fetching them at the same time makes the page load much faster than waiting for one request to finish before starting the next.

Since the API doesn't give you a breakdown of the languages a user actually writes, I had to build one. The app counts the primary language of every public repository and uses that to draw a proportional bar chart. It isn't perfectly accurate since it just counts repos rather than lines of code, but it keeps the app simple and avoids hitting the API rate limit with too many extra requests.

## Handling the API

Working with the public GitHub API means dealing with strict rate limits and missing data. If a search fails or the rate limit is hit, the app shows clear error messages instead of just breaking or showing a blank screen. 

I also had to handle edge cases, like repositories that have never had a commit pushed to them. The API returns a null date for those, which JavaScript tries to turn into a date in 1970. If there is no real date, the app just hides that piece of metadata entirely.

## Design details

Instead of a standard dark mode developer tool look, I went with a warm camel background and dark header and footer bookends. The typography pairs Fraunces for the display headings with DM Mono for the system font and metadata.

The most fun detail is how the data drives the colors. The app finds the user's top programming language and uses its official GitHub color for the avatar ring and the language chart. The repository cards use the same color system, so the whole page feels connected to the specific user you are searching.

---

<p align="center">
  <sub>Made by <a href="https://github.com/bytiagodev">Tiago Teixeira</a> · <a href="https://bytiago.com">bytiago.com</a></sub>
</p>
