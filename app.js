// ─── Element refs ───
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const errorMessage = document.getElementById("error-message");
const profileSection = document.getElementById("profile-section");
const profileAvatar = document.getElementById("profile-avatar");
const profileName = document.getElementById("profile-name");
const profileUsername = document.getElementById("profile-username");
const profileBio = document.getElementById("profile-bio");
const statRepos = document.getElementById("stat-repos");
const statFollowers = document.getElementById("stat-followers");
const statFollowing = document.getElementById("stat-following");
const linkLocation = document.getElementById("link-location");
const linkBlog = document.getElementById("link-blog");
const linkTwitter = document.getElementById("link-twitter");
const linkGithub = document.getElementById("link-github");
const languagesChart = document.getElementById("languages-chart");
const reposList = document.getElementById("repos-list");
const main = document.querySelector("main");
const toggleBtns = document.querySelectorAll(".toggle-btn");
const hero = document.getElementById("hero");
const beginningBtn = document.getElementById("beginning-btn");
const searchAgainBtn = document.getElementById("search-again-btn");
const statusAnnounce = document.getElementById("status-announce");

// ─── State ───
let allRepos = [];
let totalRepos = 0;
let currentSort = "stars";
let latestSearch = 0;

const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches
  ? "auto"
  : "smooth";

// ─── Language colors ───
const langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#663399",
  Python: "#3572A5",
  Ruby: "#701516",
  Java: "#b07219",
  PHP: "#4F5D95",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#7355dd",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00B4AB",
  Scala: "#c22d40",
};

const fallbackColor = "#a593fa";

// ─── Helpers ───
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function announce(message) {
  if (statusAnnounce) statusAnnounce.textContent = message;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.removeAttribute("hidden");
  profileSection.setAttribute("hidden", "");
}

function hideError() {
  errorMessage.setAttribute("hidden", "");
}

function isRateLimited(res) {
  return res.status === 403 || res.status === 429;
}

async function fetchUser(username) {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
  );
  if (res.status === 404)
    throw new Error("User not found. Check the username and try again.");
  if (isRateLimited(res))
    throw new Error(rateLimitMessage(res.headers.get("x-ratelimit-reset")));
  if (!res.ok) throw new Error("Something went wrong. Please try again.");
  return res.json();
}

async function fetchRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
  );
  if (isRateLimited(res))
    throw new Error(rateLimitMessage(res.headers.get("x-ratelimit-reset")));
  if (!res.ok) throw new Error("Could not load repositories.");
  return res.json();
}

function renderProfile(user) {
  profileAvatar.src = user.avatar_url;
  profileAvatar.alt = `${user.login}'s avatar`;
  profileName.textContent = user.name || user.login;
  profileUsername.textContent = `@${user.login}`;
  profileBio.textContent = user.bio || "";
  profileBio.hidden = !user.bio;
  statRepos.textContent = formatNumber(user.public_repos);
  statFollowers.textContent = formatNumber(user.followers);
  statFollowing.textContent = formatNumber(user.following);

  if (user.location) {
    linkLocation.innerHTML = `<span class="link-label">in</span> ${escapeHtml(user.location)}`;
    linkLocation.hidden = false;
  } else {
    linkLocation.hidden = true;
  }

  if (user.blog) {
    const url = user.blog.startsWith("http")
      ? user.blog
      : `https://${user.blog}`;
    linkBlog.innerHTML = `<span class="link-label">web</span> <a href="${escapeHtml(url)}" target="_blank" rel="noopener">visit</a>`;
    linkBlog.hidden = false;
  } else {
    linkBlog.hidden = true;
  }

  if (user.twitter_username) {
    const handle = escapeHtml(user.twitter_username);
    linkTwitter.innerHTML = `<span class="link-label">x.com</span> <a href="https://x.com/${handle}" target="_blank" rel="noopener">${handle}</a>`;
    linkTwitter.hidden = false;
  } else {
    linkTwitter.hidden = true;
  }

  linkGithub.innerHTML = `<span class="link-label">github</span> <a href="${escapeHtml(user.html_url)}" target="_blank" rel="noopener">view profile</a>`;
  linkGithub.hidden = false;

  const existing = document.getElementById("easter-egg");
  if (existing) existing.remove();

  if (user.login.toLowerCase() === "bytiagodev") {
    const egg = document.createElement("p");
    egg.id = "easter-egg";
    egg.textContent = "You found the one who built this.";
    document.getElementById("profile-info").appendChild(egg);
  }
}

function renderLanguages(repos) {
  const languages = topLanguages(repos);
  const wrapper = document.getElementById("profile-avatar-wrapper");

  if (languages.length === 0) {
    wrapper.style.borderColor = "";
    languagesChart.innerHTML =
      '<p class="lang-empty">No language data available.</p>';
    return;
  }

  wrapper.style.borderColor = langColors[languages[0].name] || fallbackColor;

  languagesChart.innerHTML = languages
    .map(({ name, percent }) => {
      const color = langColors[name] || fallbackColor;
      return `
      <div class="lang-row">
        <span class="lang-name">${escapeHtml(name)}</span>
        <div class="lang-bar-track">
          <div class="lang-bar-fill" style="width: 0%; background: ${color}" data-width="${percent}%"></div>
        </div>
        <span class="lang-percent">${percent}%</span>
      </div>
    `;
    })
    .join("");

  requestAnimationFrame(() => {
    document.querySelectorAll(".lang-bar-fill").forEach((bar) => {
      bar.style.width = bar.dataset.width;
    });
  });
}

function renderRepos(sort) {
  currentSort = sort;

  const top = sortRepos(allRepos, sort).slice(0, 8);
  const repoCount = document.getElementById("repo-count");
  if (repoCount) {
    repoCount.textContent = describeRepoCount(
      top.length,
      allRepos.length,
      totalRepos,
    );
  }

  reposList.innerHTML = top
    .map(
      (repo) => `
    <a class="repo-card" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">
      <span class="repo-card-name">${escapeHtml(repo.name)}</span>
      ${repo.description ? `<span class="repo-card-desc">${escapeHtml(repo.description)}</span>` : ""}
      <div class="repo-card-meta">
        ${repo.language ? `<span><span class="lang-dot" style="background:${langColors[repo.language] || fallbackColor}"></span>${escapeHtml(repo.language)}</span>` : ""}
        <span>★ ${formatNumber(repo.stargazers_count)}</span>
        ${repo.pushed_at ? `<span>Pushed ${timeAgo(repo.pushed_at)}</span>` : ""}
      </div>
    </a>
  `,
    )
    .join("");
}

toggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    renderRepos(btn.dataset.sort);
  });
});

async function handleSearch() {
  const username = searchInput.value.trim();
  if (!username) return;

  // A newer search makes this one stale: whatever it returns is dropped.
  const thisSearch = ++latestSearch;

  hideError();
  profileSection.setAttribute("hidden", "");
  searchBtn.textContent = "Loading...";
  searchBtn.disabled = true;
  announce(`Searching for ${username}`);

  const existingLoader = document.getElementById("loader");
  if (existingLoader) existingLoader.remove();

  const loader = document.createElement("div");
  loader.className = "loading-pulse";
  loader.id = "loader";
  loader.innerHTML = "<span></span><span></span><span></span>";
  main.appendChild(loader);

  try {
    const [user, repos] = await Promise.all([
      fetchUser(username),
      fetchRepos(username),
    ]);
    if (thisSearch !== latestSearch) return;

    allRepos = repos;
    totalRepos = user.public_repos;

    renderProfile(user);
    renderLanguages(repos);
    renderRepos(currentSort);

    profileSection.removeAttribute("hidden");
    hero.classList.add("collapsed");
    beginningBtn.removeAttribute("hidden");

    const sections = profileSection.querySelectorAll(
      "#profile-card, #languages-section, #repos-section, #results-footer",
    );
    sections.forEach((el) => {
      el.classList.remove("animate-in");
      void el.offsetWidth;
      el.classList.add("animate-in");
    });

    profileSection.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    announce(`Showing profile for ${user.name || user.login}`);

    history.replaceState(null, "", `#${username}`);

    // Move focus to profile for keyboard users
    profileSection.setAttribute("tabindex", "-1");
    profileSection.focus({ preventScroll: true });
  } catch (err) {
    if (thisSearch !== latestSearch) return;
    showError(err.message);
    announce(err.message);
  } finally {
    if (thisSearch === latestSearch) {
      searchBtn.textContent = "Search";
      searchBtn.disabled = false;
      const loader = document.getElementById("loader");
      if (loader) loader.remove();
    }
  }
}

document.querySelectorAll(".suggestion").forEach((btn) => {
  btn.addEventListener("click", () => {
    searchInput.value = btn.dataset.username;
    handleSearch();
  });
});

searchAgainBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: scrollBehavior });
  setTimeout(() => searchInput.focus(), 500);
});

beginningBtn.addEventListener("click", () => {
  profileSection.setAttribute("hidden", "");
  hero.classList.remove("collapsed");
  beginningBtn.setAttribute("hidden", "");
  searchInput.value = "";
  hideError();

  currentSort = "stars";
  document.getElementById("profile-avatar-wrapper").style.borderColor = "";

  history.replaceState(null, "", window.location.pathname);
  toggleBtns.forEach((btn) => {
    const isStars = btn.dataset.sort === "stars";
    btn.classList.toggle("active", isStars);
    btn.setAttribute("aria-pressed", String(isStars));
  });

  window.scrollTo({ top: 0, behavior: scrollBehavior });
  setTimeout(() => searchInput.focus(), 500);
});

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

function getHashUsername() {
  const hash = window.location.hash.slice(1).trim();
  return hash || null;
}

function handleHashChange() {
  const username = getHashUsername();
  if (username) {
    searchInput.value = username;
    handleSearch();
  }
}

window.addEventListener("hashchange", handleHashChange);

const initialUser = getHashUsername();
if (initialUser) {
  searchInput.value = initialUser;
  handleSearch();
}
