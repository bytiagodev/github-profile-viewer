// ─── Element refs ───
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const profileSection = document.getElementById('profile-section');
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileUsername = document.getElementById('profile-username');
const profileBio = document.getElementById('profile-bio');
const statRepos = document.getElementById('stat-repos');
const statFollowers = document.getElementById('stat-followers');
const statFollowing = document.getElementById('stat-following');
const linkLocation = document.getElementById('link-location');
const linkBlog = document.getElementById('link-blog');
const linkTwitter = document.getElementById('link-twitter');
const linkGithub = document.getElementById('link-github');
const languagesChart = document.getElementById('languages-chart');
const reposList = document.getElementById('repos-list');
const main = document.querySelector('main');
const toggleBtns = document.querySelectorAll('.toggle-btn');
const hero = document.getElementById('hero');
const beginningBtn = document.getElementById('beginning-btn');
const searchAgainBtn = document.getElementById('search-again-btn');

// ─── State ───
let allRepos = [];
let currentSort = 'stars';

// ─── Language colors ───
const langColors = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Python:     '#3572A5',
  Ruby:       '#701516',
  Java:       '#b07219',
  PHP:        '#4F5D95',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Swift:      '#FA7343',
  Kotlin:     '#A97BFF',
  C:          '#555555',
  'C++':      '#f34b7d',
  'C#':       '#178600',
  Shell:      '#89e051',
  Vue:        '#41b883',
  Svelte:     '#ff3e00',
  Dart:       '#00B4AB',
  Scala:      '#c22d40',
};

const fallbackColor = '#a593fa';

// ─── Helpers ───
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.removeAttribute('hidden');
  profileSection.setAttribute('hidden', '');
}

function hideError() {
  errorMessage.setAttribute('hidden', '');
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

// ─── Fetch user ───
async function fetchUser(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (res.status === 404) throw new Error('User not found. Check the username and try again.');
  if (res.status === 403) throw new Error('GitHub API rate limit reached. Try again in a moment.');
  if (!res.ok) throw new Error('Something went wrong. Please try again.');
  return res.json();
}

// ─── Fetch repos ───
async function fetchRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&type=public`
  );
  if (!res.ok) throw new Error('Could not load repositories.');
  return res.json();
}

// ─── Render profile ───
function renderProfile(user) {
  profileAvatar.src = user.avatar_url;
  profileAvatar.alt = `${user.login}'s avatar`;
  profileName.textContent = user.name || user.login;
  profileUsername.textContent = `@${user.login}`;
  profileBio.textContent = user.bio || '';
  profileBio.hidden = !user.bio;
  statRepos.textContent = formatNumber(user.public_repos);
  statFollowers.textContent = formatNumber(user.followers);
  statFollowing.textContent = formatNumber(user.following);

  if (user.location) {
    linkLocation.innerHTML = `<span class="link-label">in</span> ${user.location}`;
    linkLocation.hidden = false;
  } else {
    linkLocation.hidden = true;
  }

  if (user.blog) {
    const url = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
    linkBlog.innerHTML = `<span class="link-label">web</span> <a href="${url}" target="_blank" rel="noopener">visit</a>`;
    linkBlog.hidden = false;
  } else {
    linkBlog.hidden = true;
  }

  if (user.twitter_username) {
    linkTwitter.innerHTML = `<span class="link-label">x.com</span> <a href="https://x.com/${user.twitter_username}" target="_blank" rel="noopener">${user.twitter_username}</a>`;
    linkTwitter.hidden = false;
  } else {
    linkTwitter.hidden = true;
  }

  linkGithub.innerHTML = `<span class="link-label">github</span> <a href="${user.html_url}" target="_blank" rel="noopener">view profile</a>`;
  linkGithub.hidden = false;

  // Easter egg
  const existing = document.getElementById('easter-egg');
  if (existing) existing.remove();

  if (user.login.toLowerCase() === 'bytiagodev') {
    const egg = document.createElement('p');
    egg.id = 'easter-egg';
    egg.textContent = 'You found the one who built this.';
    document.getElementById('profile-info').appendChild(egg);
  }
}

// ─── Render languages ───
function renderLanguages(repos) {
  const counts = {};

  repos.forEach(repo => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
  });

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (sorted.length === 0) {
    languagesChart.innerHTML = '<p style="font-size:0.8rem;color:var(--text-muted)">No language data available.</p>';
    return;
  }

  if (sorted.length > 0) {
    const topLang = sorted[0][0];
    const ringColor = langColors[topLang] || fallbackColor;
    const wrapper = document.getElementById('profile-avatar-wrapper');
    wrapper.style.borderColor = ringColor;
  }

  const total = sorted.reduce((sum, [, count]) => sum + count, 0);

  languagesChart.innerHTML = sorted.map(([lang, count]) => {
    const percent = Math.round((count / total) * 100);
    const color = langColors[lang] || fallbackColor;
    return `
      <div class="lang-row">
        <span class="lang-name">${lang}</span>
        <div class="lang-bar-track">
          <div class="lang-bar-fill" style="width: 0%; background: ${color}" data-width="${percent}%"></div>
        </div>
        <span class="lang-percent">${percent}%</span>
      </div>
    `;
  }).join('');

  // Animate bars after render
  requestAnimationFrame(() => {
    document.querySelectorAll('.lang-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  });
}

// ─── Render repos ───
function renderRepos(sort) {
  currentSort = sort;

  const sorted = [...allRepos].sort((a, b) => {
    if (sort === 'stars') return b.stargazers_count - a.stargazers_count;
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  const top = sorted.slice(0, 8);
  const repoCount = document.getElementById('repo-count');
  if (repoCount) {
    repoCount.textContent = `showing ${top.length} of ${allRepos.length} public repositories`;
  }

  reposList.innerHTML = top.map(repo => `
    <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
      <span class="repo-card-name">${repo.name}</span>
      ${repo.description ? `<span class="repo-card-desc">${repo.description}</span>` : ''}
      <div class="repo-card-meta">
        ${repo.language ? `<span>● ${repo.language}</span>` : ''}
        <span>★ ${formatNumber(repo.stargazers_count)}</span>
        <span>Updated ${timeAgo(repo.updated_at)}</span>
      </div>
    </a>
  `).join('');
}

// ─── Toggle buttons ───
toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderRepos(btn.dataset.sort);
  });
});

// ─── Main search ───
async function handleSearch() {
  const username = searchInput.value.trim();
  if (!username) return;

  hideError();
  profileSection.setAttribute('hidden', '');
  searchBtn.textContent = 'Loading...';
  searchBtn.disabled = true;

  const existingLoader = document.getElementById('loader');
  if (existingLoader) existingLoader.remove();

  const loader = document.createElement('div');
  loader.className = 'loading-pulse';
  loader.id = 'loader';
  loader.innerHTML = '<span></span><span></span><span></span>';
  main.appendChild(loader);

  try {
    const user = await fetchUser(username);
    const repos = await fetchRepos(username);

    allRepos = repos;

    renderProfile(user);
    renderLanguages(repos);
    renderRepos(currentSort);

    profileSection.removeAttribute('hidden');
    hero.classList.add('collapsed');
    beginningBtn.removeAttribute('hidden');

    // Animate sections in sequence
    const sections = profileSection.querySelectorAll('#profile-card, #languages-section, #repos-section, #results-footer');
    sections.forEach(el => {
      el.classList.remove('animate-in');
      void el.offsetWidth;
      el.classList.add('animate-in');
    });

    profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    showError(err.message);
  } finally {
    searchBtn.textContent = 'Search';
    searchBtn.disabled = false;
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
  }
}

// ─── Suggestions ───
document.querySelectorAll('.suggestion').forEach(btn => {
  btn.addEventListener('click', () => {
    searchInput.value = btn.dataset.username;
    handleSearch();
  });
});

// ─── Search again ───
searchAgainBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => searchInput.focus(), 500);
});

// ─── Beginning ───
beginningBtn.addEventListener('click', () => {
  profileSection.setAttribute('hidden', '');
  hero.classList.remove('collapsed');
  beginningBtn.setAttribute('hidden', '');
  searchInput.value = '';
  hideError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => searchInput.focus(), 500);
});

// ─── Events ───
searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});