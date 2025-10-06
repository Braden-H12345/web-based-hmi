#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import askPageQuestions from "./prompts.js";
import generateJSX  from "./generateJSX.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  try {
    const config = await askPageQuestions();
    const jsxCode = generateJSX(config);

    const fileName = `${config.pageName}.tsx`;

    const targetDir = path.join(
      __dirname,
      "..",        
      "app",
      "components",
      "HMI Pages"
    );

     fs.mkdirSync(targetDir, { recursive: true });

    const outputPath = path.join(targetDir, fileName);

    fs.writeFileSync(outputPath, jsxCode, "utf8");
    console.log(`✅ Page "${fileName}" generated at ${outputPath}`);
  } catch (err) {
    console.error("❌ Failed to generate HMI page:", err);
  }
})();