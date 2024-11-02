import fs from "fs-extra";
import generateSolutionFiles from "./lib/generateSolutionFile.js";

async function generateApp(spec, outputDirectory) {
  console.log("Generating application...");

  // Ensure output directory is clean
  await fs.remove(outputDirectory);
  await fs.ensureDir(outputDirectory);
  await generateSolutionFiles(spec, outputDirectory);
  console.log("Application generated successfully!");
}

export default generateApp;