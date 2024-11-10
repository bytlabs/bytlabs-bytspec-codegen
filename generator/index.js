import fs from "fs-extra";
import "./lib/partials.js"
import { createContainer } from "./di.js";

async function generateApp(spec, outputDirectory, options) {
  console.log("Generating application...");

  const container = await createContainer();

  // Ensure output directory is clean
  if (options.deleteExistingFiles) {
    await fs.remove(outputDirectory);
    await fs.ensureDir(outputDirectory);
  }

  const generators = await container.resolve('generators').all();

  for (let generator of generators)
    await generator.execute(spec, outputDirectory);

  console.log("Application generated successfully!");
}

export default generateApp;