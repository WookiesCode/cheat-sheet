// The files a generator's nav-update loop should edit. The full nav lives once, in
// nav/nav-source.html; pages carry a small fallback that nav.js replaces at load
// (build-nav-js.js). Editing pages directly would re-grow the fallbacks, because several
// generators insert their menu wherever it is missing.
const NAV_SOURCE = 'nav/nav-source.html';
module.exports = { NAV_SOURCE, navFiles: () => [NAV_SOURCE] };
