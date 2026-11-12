// ─── Pure helpers ───
// Nothing in this file touches the page, so the tests can load it in Node.

function formatNumber(num) {
  const compact = (value, unit) =>
    `${value.toFixed(1).replace(/\.0$/, "")}${unit}`;
  if (num >= 999950) return compact(num / 1000000, "M");
  if (num >= 1000) return compact(num / 1000, "k");
  return String(num);
}

function timeAgo(dateString, now = new Date()) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

// Counts each repo's primary language and returns the most used ones, with
// each one's share of that group as a whole percentage.
function topLanguages(repos, limit = 6) {
  const counts = {};
  repos.forEach((repo) => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
  });
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  const total = sorted.reduce((sum, [, count]) => sum + count, 0);
  return sorted.map(([name, count]) => ({
    name,
    percent: Math.round((count / total) * 100),
  }));
}

function sortRepos(repos, sort) {
  return [...repos].sort((a, b) => {
    if (sort === "stars") return b.stargazers_count - a.stargazers_count;
    return new Date(b.pushed_at) - new Date(a.pushed_at);
  });
}

// The API returns 100 repositories at most. Past that, the line says so
// instead of passing 100 off as the whole account.
function describeRepoCount(shown, loaded, total) {
  if (total > loaded) {
    return `showing ${shown} of the ${loaded} most recently pushed, out of ${formatNumber(total)} public repositories`;
  }
  return `showing ${shown} of ${loaded} public repositories`;
}

// resetHeader is GitHub's x-ratelimit-reset value: the second, counted from
// 1970, at which the limit lifts.
function rateLimitMessage(resetHeader) {
  const reset = Number(resetHeader);
  if (!resetHeader || !Number.isFinite(reset)) {
    return "GitHub API rate limit reached. Try again in a moment.";
  }
  const time = new Date(reset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `GitHub API rate limit reached. Try again after ${time}.`;
}
