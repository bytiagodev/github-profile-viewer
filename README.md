<p align="center">
  <img src="banner.svg" alt="GitHub Profile Viewer banner" width="100%" />
</p>

<h3 align="center">Every profile tells a story.</h3>

<p align="center">
  <a href="https://bytiagodev.github.io/github-profile-viewer/">Search a username</a>
</p>

---

## The idea

Type a GitHub username, get that person's profile laid out like something worth reading rather than raw JSON with a stylesheet over it. Plain HTML, CSS and vanilla JavaScript. No frameworks, no build step, no dependencies.

## Two requests, one screen

A search fires both API calls at once: the user record and their public repositories. Waiting for the first to finish before starting the second doubles the time on screen for no benefit, so they resolve in parallel and the page renders when both land.

The language breakdown is derived, not fetched. The API will not hand you a summary of what somebody actually writes, so the app reads the primary language of every public repo, counts them, and draws the top six as proportional bars. Counting repositories is not the same as counting lines of code and the bars are honest about being an approximation, but the alternative is a request per repository and a rate limit hit within a couple of searches.

## The decision I would defend in an interview

Repository recency reads `pushed_at`, never `updated_at`.

`updated_at` sounds like the field you want and is not. GitHub bumps it on any change to the repository record: a new star, a description edit, a topic change, a licence detection, a background job nobody triggered. Sorting on it produced a list where almost everything claimed to be recently active, and "recently updated" quietly became "recently starred". `pushed_at` only moves when commits land on a branch, which is what the label promises, so the toggle reads **Latest Commits** and means it.

One consequence worth knowing. A repository with no commits returns `pushed_at: null`, and `new Date(null)` is not an invalid date, it is the epoch. Rendered without a guard, an empty repo confidently reports itself as 56 years old. The formatter returns nothing on a falsy value and the card drops the timestamp entirely. The sort needs no guard at all, because 0 sinks those repos to the bottom on its own.

## The colours come from the data

Rather than the usual grey developer-tool palette, the page runs on warm camel with dark bookends at the header and footer and a single restrained red accent. Fraunces sets the display type, DM Mono handles metadata and labels.

The part I like most is that the user changes the colour scheme without knowing it. The app finds their most used language, takes its official GitHub colour, and applies it to the avatar ring and the language bars, which animate from zero to their width on render. Search two people and the page looks like two different people.

## Rate limits, missing data, and other realities

The public API is unauthenticated, so the app is one search away from a 403 at any time. Unknown user, rate limit and unexpected failure each get their own message, because a blank screen tells nobody anything. Missing bios, absent locations and empty blog fields are all expected states rather than errors.

---

<p align="center">
  <sub>Made by <a href="https://github.com/bytiagodev">Tiago Teixeira</a> · More at <a href="https://bytiago.com">bytiago.com</a></sub>
</p>
