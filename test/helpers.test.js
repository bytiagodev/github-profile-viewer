// The page loads plain scripts that share one global scope, not modules, so
// the tests load helpers.js the same way.
//
// Run them with: node --test

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = vm.createContext({});
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "..", "helpers.js"), "utf8"),
  context,
  { filename: "helpers.js" },
);
const {
  formatNumber,
  timeAgo,
  topLanguages,
  sortRepos,
  describeRepoCount,
  rateLimitMessage,
} = context;

// Objects made inside the script belong to another realm, which strict
// comparison counts as a difference. Copying them through JSON leaves only
// their values.
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test("numbers under a thousand are shown whole", () => {
  assert.equal(formatNumber(0), "0");
  assert.equal(formatNumber(999), "999");
});

test("thousands and millions are shortened without a trailing .0", () => {
  assert.equal(formatNumber(1000), "1k");
  assert.equal(formatNumber(1500), "1.5k");
  assert.equal(formatNumber(254300), "254.3k");
  assert.equal(formatNumber(999949), "999.9k");
  assert.equal(formatNumber(999950), "1M");
  assert.equal(formatNumber(2340000), "2.3M");
});

test("a repository with no commits has no age, not 56 years", () => {
  assert.equal(timeAgo(null), null);
  assert.equal(timeAgo(undefined), null);
});

test("ages step from minutes to years", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(timeAgo("2026-06-15T11:59:30Z", now), "just now");
  assert.equal(timeAgo("2026-06-15T11:15:00Z", now), "45m ago");
  assert.equal(timeAgo("2026-06-15T07:00:00Z", now), "5h ago");
  assert.equal(timeAgo("2026-06-12T12:00:00Z", now), "3d ago");
  assert.equal(timeAgo("2026-03-15T12:00:00Z", now), "3mo ago");
  assert.equal(timeAgo("2024-06-15T12:00:00Z", now), "2y ago");
});

test("languages are counted per repository, most used first, six at most", () => {
  const repos = [
    ...Array(5).fill({ language: "JavaScript" }),
    ...Array(3).fill({ language: "CSS" }),
    ...Array(2).fill({ language: "HTML" }),
    { language: null },
  ];
  assert.deepEqual(plain(topLanguages(repos)), [
    { name: "JavaScript", percent: 50 },
    { name: "CSS", percent: 30 },
    { name: "HTML", percent: 20 },
  ]);

  const many = ["A", "B", "C", "D", "E", "F", "G", "H"].map((language) => ({ language }));
  assert.equal(topLanguages(many).length, 6);
});

test("an account with no language data gives an empty list", () => {
  assert.deepEqual(plain(topLanguages([])), []);
  assert.deepEqual(plain(topLanguages([{ language: null }])), []);
});

test("sorting never changes the list it was given", () => {
  const repos = [
    { name: "old", stargazers_count: 9, pushed_at: "2020-01-01T00:00:00Z" },
    { name: "new", stargazers_count: 1, pushed_at: "2026-01-01T00:00:00Z" },
    { name: "empty", stargazers_count: 0, pushed_at: null },
  ];
  const byStars = plain(sortRepos(repos, "stars")).map((repo) => repo.name);
  const byPush = plain(sortRepos(repos, "updated")).map((repo) => repo.name);
  assert.deepEqual(byStars, ["old", "new", "empty"]);
  assert.deepEqual(byPush, ["new", "old", "empty"]);
  assert.equal(repos[0].name, "old");
});

test("the count line admits when the account has more than was loaded", () => {
  assert.equal(describeRepoCount(8, 42, 42), "showing 8 of 42 public repositories");
  assert.equal(
    describeRepoCount(8, 100, 1163),
    "showing 8 of the 100 most recently pushed, out of 1.2k public repositories",
  );
});

test("the rate limit message gives a time only when GitHub sends one", () => {
  assert.equal(rateLimitMessage(null), "GitHub API rate limit reached. Try again in a moment.");
  assert.equal(rateLimitMessage("soon"), "GitHub API rate limit reached. Try again in a moment.");
  assert.match(rateLimitMessage("1893456000"), /^GitHub API rate limit reached\. Try again after .+\.$/);
});
