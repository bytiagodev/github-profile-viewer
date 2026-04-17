# GitHub Profile Viewer

A frontend project built with vanilla HTML, CSS and JavaScript, using the public GitHub REST API.

## The idea

This started as a simple profile search tool and grew into something with a bit more personality. The brief was straightforward: search any GitHub username and see their profile, repositories and top languages. But from the beginning the goal was to make something that felt designed and considered rather than assembled from tutorial parts.

The result is an app built around a simple human idea. Every developer has a story. This one helps you read it.

## What it does

Search any GitHub username and get a rich profile view. The profile card shows the user's avatar, name, bio, stats and links. The avatar ring changes color based on the user's most used language, tying the visual identity of the card to the data underneath it. Below the card a language breakdown shows the top languages across all public repos with animated proportional bars. Repositories can be toggled between most starred and most recently updated, with a count showing how many are being displayed out of the total.

The app handles errors gracefully, shows a loading state for slow connections, and includes a set of suggestion buttons to help first time visitors know where to start.

## Where it stands

The core experience is complete and the design has real personality. The warm camel palette, the Fraunces display font in the hero, the restrained red accent and the dark bookend header and footer all came together through a deliberate and iterative process. Nothing in here is default.

There are details in here for people who look closely. Developers who inspect source code will find something waiting for them. Anyone curious enough to search a specific username will find something too.

## What comes next

The app works well but there are things worth improving. The profile card needs more hierarchy so it tells a story rather than just displaying data. The repo cards need the same treatment at a smaller scale. The moment a profile loads needs an entrance animation because right now everything snaps into place when it deserves more care. The mobile experience is functional but was never given the same attention as desktop. And there is no clean way to reset and start a new search once a profile is showing.

These are not urgent fixes. They are the difference between something that works and something that is finished.

## Tech

HTML, CSS, JavaScript. No frameworks, no build tools. Hosted on GitHub Pages.

## Live

[bytiagodev.github.io/github-profile-viewer](https://bytiagodev.github.io/github-profile-viewer)