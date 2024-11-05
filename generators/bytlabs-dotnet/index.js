import fs from "fs-extra";
import "./lib/partials.js"
import generateSolutionFiles from "./lib/generators/generateSolutionFiles.js";
import generateDomainModels from "./lib/generators/generateDomainModels.js";

async function generateApp(spec, outputDirectory) {
  console.log("Generating application...");

  // Ensure output directory is clean
  // await fs.remove(outputDirectory);
  // await fs.ensureDir(outputDirectory);

  //call generators
  await generateSolutionFiles(spec, outputDirectory);
  await generateDomainModels(spec, outputDirectory);
  
  console.log("Application generated successfully!");
}

export default generateApp;