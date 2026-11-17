// Post-render script: adds Open Graph and Twitter card tags to each page.
//
// WORKAROUND: q2 does not support Open Graph yet. Quarto 1 has it built in
// (`website: open-graph: true` and `twitter-card: true`), q2 ignores those
// keys. And tags set from a Lua filter (`header-includes`) are not written to
// the page either, so this runs on the HTML after the render.
// Remove this script and its `post-render` entry once q2 supports it.
//
// LinkedIn, Bluesky and Mastodon read these tags to build the link preview.
//
// For each rendered HTML page (redirect pages from `aliases` are skipped):
// - og:title      the page title, or the site title for the home page
// - og:description the page `description`, else its `subtitle`, else the
//                  site description; also added as <meta name="description">
//                  when q2 did not write one
// - og:url        the canonical URL written by q2
// - og:image      the page `image` from its front matter, else the default card
// - og:type       `article` for dated pages (posts, talks), else `website`
//
// No dependencies: plain Node (>= 18).

const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_IMAGE = "images/social-card.png";
const DEFAULT_IMAGE_ALT = "Christophe Dervieux";

const projectDir = process.env.QUARTO_PROJECT_DIR || process.cwd();
const outputDir =
  process.env.QUARTO_PROJECT_OUTPUT_DIR || path.join(projectDir, "_site");

// --- site settings, read from _quarto.yml (only the few keys needed) -------

const quartoYml = fs.readFileSync(path.join(projectDir, "_quarto.yml"), "utf8");
const yamlValue = (text, key) => {
  const m = text.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"));
  return m ? unquote(m[1]) : undefined;
};
const siteUrl = (yamlValue(quartoYml, "site-url") || "").replace(/\/$/, "");
const siteTitle = yamlValue(quartoYml, "title") || "";
const siteDescription = yamlValue(quartoYml, "description") || "";

if (!siteUrl) {
  console.error("opengraph.js: website.site-url is not set, skipping.");
  process.exit(0);
}

// --- helpers ---------------------------------------------------------------

function unquote(s) {
  s = s.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1);
  }
  return s;
}

function escapeAttr(s) {
  return s
    .replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Strip markdown inline marks from a front matter value (`code`, *em*, links).
function plain(s) {
  return s
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1");
}

// Front matter of the source file of an output page, as a flat key -> value
// map of top-level scalar keys. Returns {} when no source is found.
function frontMatter(outRel) {
  const base = outRel.replace(/\.html$/, "");
  for (const ext of [".qmd", ".md", ".ipynb"]) {
    const src = path.join(projectDir, base + ext);
    if (!fs.existsSync(src)) continue;
    const text = fs.readFileSync(src, "utf8");
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) return {};
    const fm = {};
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z][\w-]*):\s*(.+)$/);
      if (kv) fm[kv[1]] = unquote(kv[2]);
    }
    return fm;
  }
  return {};
}

function absoluteUrl(ref, pageUrl) {
  if (/^https?:\/\//.test(ref)) return ref;
  if (ref.startsWith("/")) return siteUrl + ref;
  return new URL(ref, pageUrl).href;
}

// --- main ------------------------------------------------------------------

function outputFiles() {
  const listed = process.env.QUARTO_PROJECT_OUTPUT_FILES;
  if (listed) {
    return listed
      .split(/\r?\n/)
      .filter((f) => f.endsWith(".html"))
      .map((f) => path.resolve(projectDir, f));
  }
  const all = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "site_libs") walk(p);
      } else if (e.name.endsWith(".html")) all.push(p);
    }
  };
  walk(outputDir);
  return all;
}

let count = 0;
for (const file of outputFiles()) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes('name="generator" content="quarto')) continue; // redirects
  if (html.includes('property="og:title"')) continue; // already done

  const outRel = path.relative(outputDir, file).split(path.sep).join("/");
  const fm = frontMatter(outRel);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  const pageUrl = (canonical ? canonical[1] : `${siteUrl}/${outRel}`).replace(
    /\/index\.html$/,
    "/",
  );

  const isHome = outRel === "index.html";
  const titleTag = html.match(/<title>([^<]*)<\/title>/);
  const title = isHome
    ? siteTitle
    : fm.title
      ? escapeAttr(plain(fm.title))
      : titleTag
        ? titleTag[1].replace(new RegExp(`\\s+–\\s+${siteTitle}$`), "")
        : siteTitle;

  const metaDesc = html.match(/<meta name="description" content="([^"]*)">/);
  const description = isHome
    ? escapeAttr(siteDescription)
    : metaDesc
      ? metaDesc[1]
      : escapeAttr(plain(fm.description || fm.subtitle || siteDescription));

  const image = absoluteUrl(fm.image || `/${DEFAULT_IMAGE}`, pageUrl);
  const isArticle = html.includes('name="dcterms.date"');

  const tags = [
    !metaDesc && `<meta name="description" content="${description}">`,
    `<meta property="og:site_name" content="${escapeAttr(siteTitle)}">`,
    `<meta property="og:type" content="${isArticle ? "article" : "website"}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${pageUrl}">`,
    `<meta property="og:image" content="${image}">`,
    !fm.image && `<meta property="og:image:width" content="1200">`,
    !fm.image && `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${escapeAttr(
      fm["image-alt"] || DEFAULT_IMAGE_ALT,
    )}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ].filter(Boolean);

  html = html.replace("</head>", `${tags.join("\n")}\n</head>`);
  fs.writeFileSync(file, html);
  count++;
}

if (process.env.QUARTO_PROJECT_SCRIPT_QUIET !== "1") {
  console.log(`opengraph.js: added Open Graph tags to ${count} pages.`);
}
