# GitHub Profile Viewer

A frontend project built with vanilla HTML, CSS and JavaScript, using the public GitHub REST API.

## The idea

This started as a simple profile search tool and grew into something with a bit more personality. The brief was straightforward, search any GitHub username and see their profile, repositories and top languages. But from the beginning the goal was to make something that felt designed and considered rather than assembled from tutorial parts.

The result is an app built around a simple human idea. Every profile tells a story.

## What it does

Search any GitHub username and get a rich profile view. The profile card shows the user's name, handle, bio, stats and links. The avatar ring changes color based on the user's most used language, tying the visual identity of the card to the data underneath it. Below the card a language breakdown shows the top languages across all public repos with animated proportional bars. Repositories can be toggled between most starred and most recently updated, with a count showing how many are being displayed out of the total.

The hero collapses after the first search so the interface stays clean and focused. A search again flow at the bottom of the results lets you keep exploring without scrolling back up. And if you want to go back to the beginning, there is a way to do that too.

The app handles errors gracefully, shows a loading state for slow connections, and includes a set of suggestion buttons to help first time visitors know where to start.

## What makes it different

The design has a point of view. A warm camel palette, a Fraunces display font in the hero, a restrained red accent and dark bookend header and footer, nothing in here is default. The repo cards use the same language color system as the chart so the data feels connected rather than compartmentalised. The profile name and repo names share the same accent color creating a consistent visual language throughout.

There are details in here for people who look closely. Developers who inspect source code will find something waiting for them. Anyone curious enough to search a specific username will find something too.

## What comes next

The core experience is complete and the design is in a strong place. The next step is the next project, this one taught the lessons it was supposed to teach.

## Tech

HTML, CSS, JavaScript. No frameworks, no build tools. Hosted on GitHub Pages.

## Live

[bytiagodev.github.io/github-profile-viewer](https://bytiagodev.github.io/github-profile-viewer)