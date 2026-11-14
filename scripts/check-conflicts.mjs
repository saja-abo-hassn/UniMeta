import fs from "node:fs";
import path from "node:path";

const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css"]);
const failures = [];
function scan(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (extensions.has(path.extname(file))) {
      fs.readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
        if (/^(?:<{7}(?:\s|$)|={7}$|>{7}(?:\s|$)|\|{7}(?:\s|$))/.test(line)) {
          failures.push(`${file}:${index + 1}`);
        }
      });
    }
  }
}
for (const directory of ["app", "components", "src", "lib", "scripts"]) scan(directory);
if (failures.length) {
  console.error("Unresolved Git merge markers. Resolve these files before deployment:\n" + failures.join("\n"));
  process.exit(1);
}
console.log("No unresolved merge markers in application sources.");
