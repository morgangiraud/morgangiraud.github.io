var hljs = require("highlight.js");
var mustache = require("mustache");
var fs = require("fs");

var md = require("markdown-it")({
  html: true,
  breaks: false,
  highlight: function (str, lang) {
    if (lang && lang.match(/\bmermaid\b/i)) {
      return `<div class="mermaid">${str}</div>`;
    }

    if (lang && hljs.getLanguage(lang)) {
      try {
        str = hljs.highlight(lang, str, true).value;
      } catch (error) {
        str = md.utils.escapeHtml(str);

        showErrorMessage("markdown-it:highlight", error);
      }
    } else {
      str = md.utils.escapeHtml(str);
    }
    return '<pre class="hljs"><code><div>' + str + "</div></code></pre>";
  },
});

md.use(require("markdown-it-container"), "", {
  validate: function (name) {
    return name.trim().length;
  },
  render: function (tokens, idx) {
    if (tokens[idx].info.trim() !== "") {
      return `<div class="${tokens[idx].info.trim()}">\n`;
    } else {
      return `</div>\n`;
    }
  },
});

// Read mardkown file content
const text = fs.readFileSync(__dirname + "/summary.md", "utf8");
const content = md.render(text);

// Read css style file from current script folder
const style =
  "\n<style>\n" +
  fs.readFileSync(__dirname + "/cv-markdown-style.css", "utf8") +
  "\n</style>\n";

const template = fs.readFileSync(__dirname + "/template.html", "utf8");
var view = {
  title: "Summary - Morgan Giraud",
  style: style,
  content: content,
};
const html = mustache.render(template, view);

// Write html down
fs.writeFileSync(__dirname + "/../../public/summary.html", html);
