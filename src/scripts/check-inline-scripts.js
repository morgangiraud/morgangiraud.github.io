const fs = require("fs");
const path = require("path");
const vm = require("vm");

const indexPath = path.join(__dirname, "../../index.html");
const html = fs.readFileSync(indexPath, "utf8");

const inlineScripts = [
  ...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi),
].map((match) => match[1]);

if (inlineScripts.length === 0) {
  console.error("No inline scripts found in index.html");
  process.exit(1);
}

let hasError = false;

inlineScripts.forEach((code, index) => {
  try {
    new vm.Script(code, {
      filename: `index.html:inline-script-${index + 1}`,
      displayErrors: true,
    });
  } catch (error) {
    hasError = true;
    console.error(`Syntax error in inline script #${index + 1}`);
    console.error(error);
  }
});

if (hasError) {
  process.exit(1);
}

console.log(
  `Checked ${inlineScripts.length} inline script blocks in index.html`,
);
