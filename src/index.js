// @ts-ignore
import spec from "./../specs/commerce-platform.json" with  { type: 'json' };
import fs from "fs-extra";
import "./partials.js"
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



async function main() {
    const OUTPUT_DIR = "./build";
    await generateApp(spec, OUTPUT_DIR, { deleteExistingFiles: false });
}

main().catch(err => console.log(err));