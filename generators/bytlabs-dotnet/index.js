import fs from "fs-extra";
import "./lib/partials.js"
import generateSolutionFiles from "./lib/generateSolutionFiles.js";
import generateDomainModels from "./lib/generateDomainModels.js";

async function generateApp(spec, outputDirectory) {
  console.log("Generating application...");

  // Ensure output directory is clean
  await fs.remove(outputDirectory);
  await fs.ensureDir(outputDirectory);
  await generateSolutionFiles(spec, outputDirectory);
  await generateDomainModels(spec, outputDirectory);
  console.log("Application generated successfully!");
}

export default generateApp;