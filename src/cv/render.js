const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const hljs = require("highlight.js");
const mustache = require("mustache");
const puppeteer = require("puppeteer");

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
const publicDir = path.join(__dirname, "../../public");

const cvDocuments = [
  {
    inputFile: "cv-morgan-giraud.md",
    outputHtmlFile: "cv-morgan-giraud.html",
    outputPdfFile: "cv-morgan-giraud.pdf",
    title: "CV - Morgan Giraud",
  },
  {
    inputFile: "cv-morgan-giraud-short.md",
    outputHtmlFile: "cv-morgan-giraud-short.html",
    outputPdfFile: "cv-morgan-giraud-short.pdf",
    title: "CV - Morgan Giraud",
  },
  {
    inputFile: "cv-fr-morgan-giraud.md",
    outputHtmlFile: "cv-fr-morgan-giraud.html",
    outputPdfFile: "cv-fr-morgan-giraud.pdf",
    title: "CV - FR - Morgan Giraud",
  },
];

const coverLetterDocuments = [
  {
    inputFile: "cl-morgan-giraud.md",
    outputHtmlFile: "cl-morgan-giraud.html",
    outputPdfFile: "cl-morgan-giraud.pdf",
    title: "Cover letter - Morgan Giraud",
  },
  {
    inputFile: "cl-fr-morgan-giraud.md",
    outputHtmlFile: "cl-fr-morgan-giraud.html",
    outputPdfFile: "cl-fr-morgan-giraud.pdf",
    title: "Cover letter - FR - Morgan Giraud",
  },
];

const summaryDocuments = [
  {
    inputFile: "summary.md",
    outputHtmlFile: "summary.html",
    outputPdfFile: "summary.pdf",
    title: "Summary - EN - Morgan Giraud",
  },
  {
    inputFile: "summary-fr.md",
    outputHtmlFile: "summary-fr.html",
    outputPdfFile: "summary-fr.pdf",
    title: "Summary - FR - Morgan Giraud",
  },
];

const allDocuments = [
  ...cvDocuments,
  ...coverLetterDocuments,
  ...summaryDocuments,
];

function renderMarkdownFile(inputFile, outputFile, title) {
  const markdown = fs.readFileSync(path.join(__dirname, inputFile), "utf8");
  const content = md.render(markdown);
  const html = mustache.render(template, { title, style, content });
  fs.writeFileSync(path.join(publicDir, outputFile), html);
}

function renderMarkdownDocuments(documents) {
  for (const document of documents) {
    renderMarkdownFile(
      document.inputFile,
      document.outputHtmlFile,
      document.title,
    );
  }
}

async function renderPdfDocument(browser, document) {
  const page = await browser.newPage();
  try {
    await page.goto(
      pathToFileURL(path.join(publicDir, document.outputHtmlFile)).href,
      {
        waitUntil: "networkidle0",
      },
    );
    await page.emulateMediaType("print");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    await page.pdf({
      path: path.join(publicDir, document.outputPdfFile),
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await page.close();
  }
}

async function renderPdfDocuments(documents) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const document of documents) {
      await renderPdfDocument(browser, document);
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log("Dumping CV HTML");
  renderMarkdownDocuments(cvDocuments);

  console.log("Dumping Cover letter HTML");
  renderMarkdownDocuments(coverLetterDocuments);

  console.log("Dumping Summary HTML");
  renderMarkdownDocuments(summaryDocuments);

  console.log("Dumping PDF files");
  await renderPdfDocuments(allDocuments);
}

main().catch((error) => {
  console.error("Failed to render CV documents:", error);
  process.exitCode = 1;
});
