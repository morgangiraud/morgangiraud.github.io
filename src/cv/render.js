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

// Read css style file from current script folder
const style =
  "\n<style>\n" +
  fs.readFileSync(__dirname + "/cv-markdown-style.css", "utf8") +
  "\n</style>\n";

const template = fs.readFileSync(__dirname + "/template.html", "utf8");

/////////////////////////////
// CV
/////////////////////////////
console.log("Dumping CV HTML")

// Read mardkown file content
const text = fs.readFileSync(__dirname + "/cv-morgan-giraud.md", "utf8");
const textFr = fs.readFileSync(__dirname + "/cv-fr-morgan-giraud.md", "utf8");

const content = md.render(text);
const contentFr = md.render(textFr);

var view = {
  title: "CV - Morgan Giraud",
  style: style,
  content: content,
};
const html = mustache.render(template, view);

var viewFr = {
  title: "CV - FR - Morgan Giraud",
  style: style,
  content: contentFr,
};
const htmlFr = mustache.render(template, viewFr);

// Write html down
fs.writeFileSync(__dirname + "/../../public/cv-morgan-giraud.html", html);
fs.writeFileSync(__dirname + "/../../public/cv-fr-morgan-giraud.html", htmlFr);


/////////////////////////////
// Cover letter
/////////////////////////////

console.log("Dumping Cover letter HTML")

// Read mardkown file content
const clText = fs.readFileSync(__dirname + "/cl-morgan-giraud.md", "utf8");
const clTextFr = fs.readFileSync(__dirname + "/cl-fr-morgan-giraud.md", "utf8");

const clContent = md.render(clText);
const clContentFr = md.render(clTextFr);

var clView = {
  title: "Cover letter - Morgan Giraud",
  style: style,
  content: clContent,
};
const clHtml = mustache.render(template, clView);

var clViewFr = {
  title: "Cover letter - FR - Morgan Giraud",
  style: style,
  content: clContentFr,
};
const clHtmlFr = mustache.render(template, clViewFr);

// Write html down
fs.writeFileSync(__dirname + "/../../public/cl-morgan-giraud.html", clHtml);
fs.writeFileSync(__dirname + "/../../public/cl-fr-morgan-giraud.html", clHtmlFr);

/////////////////////////////
// Summary
/////////////////////////////

console.log("Dumping Summary HTML")

// Read mardkown file content
const sumText = fs.readFileSync(__dirname + "/summary.md", "utf8");
const sumTextFr = fs.readFileSync(__dirname + "/summary-fr.md", "utf8");

const sumContent = md.render(sumText);
const sumContentFr = md.render(sumTextFr);

var sumView = {
  title: "Summary - EN - Morgan Giraud",
  style: style,
  content: sumContent,
};
const sumHtml = mustache.render(template, sumView);

var sumViewFr = {
  title: "Summary - FR - Morgan Giraud",
  style: style,
  content: sumContentFr,
};
const sumHtmlFr = mustache.render(template, sumViewFr);

// Write html down
fs.writeFileSync(__dirname + "/../../public/summary.html", sumHtml);
fs.writeFileSync(__dirname + "/../../public/summary-fr.html", sumHtmlFr);