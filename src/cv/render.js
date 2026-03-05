const fs = require("fs");
const path = require("path");
const hljs = require("highlight.js");
const mustache = require("mustache");

const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");

const md = markdownIt({
  html: true,
  breaks: false,
  highlight: function (str, lang) {
    if (lang && lang.match(/\bmermaid\b/i)) {
      return `<div class="mermaid">${str}</div>`;
    }

    let rendered = md.utils.escapeHtml(str);

    if (lang && hljs.getLanguage(lang)) {
      try {
        rendered = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
      } catch (error) {
        console.error("markdown-it highlight error:", error);
      }
    }

    return `<pre class="hljs"><code><div>${rendered}</div></code></pre>`;
  },
});

md.use(markdownItContainer, "", {
  validate: function (name) {
    return name.trim().length > 0;
  },
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      return `<div class="${tokens[idx].info.trim()}">\n`;
    }

    return "</div>\n";
  },
});

const style = `\n<style>\n${fs.readFileSync(
  path.join(__dirname, "cv-markdown-style.css"),
  "utf8",
)}\n</style>\n`;
const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");

function renderMarkdownFile(inputFile, outputFile, title) {
  const markdown = fs.readFileSync(path.join(__dirname, inputFile), "utf8");
  const content = md.render(markdown);
  const html = mustache.render(template, { title, style, content });
  fs.writeFileSync(path.join(__dirname, "../../public", outputFile), html);
}

console.log("Dumping CV HTML");
renderMarkdownFile(
  "cv-morgan-giraud.md",
  "cv-morgan-giraud.html",
  "CV - Morgan Giraud",
);
renderMarkdownFile(
  "cv-morgan-giraud-short.md",
  "cv-morgan-giraud-short.html",
  "CV - Morgan Giraud",
);
renderMarkdownFile(
  "cv-fr-morgan-giraud.md",
  "cv-fr-morgan-giraud.html",
  "CV - FR - Morgan Giraud",
);

console.log("Dumping Cover letter HTML");
renderMarkdownFile(
  "cl-morgan-giraud.md",
  "cl-morgan-giraud.html",
  "Cover letter - Morgan Giraud",
);
renderMarkdownFile(
  "cl-fr-morgan-giraud.md",
  "cl-fr-morgan-giraud.html",
  "Cover letter - FR - Morgan Giraud",
);

console.log("Dumping Summary HTML");
renderMarkdownFile(
  "summary.md",
  "summary.html",
  "Summary - EN - Morgan Giraud",
);
renderMarkdownFile(
  "summary-fr.md",
  "summary-fr.html",
  "Summary - FR - Morgan Giraud",
);
