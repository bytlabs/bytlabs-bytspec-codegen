import fs from "fs-extra";
import path from "path";
import Handlebars from "handlebars";
import { pascalCase } from "change-case";
import { TEMPLATE_PATH } from "./constants.js"

async function processSolutionFile(srcDir, destDir, data) {
    try {
        // Get all files in the source directory
        const files = await fs.readdir(srcDir);

        // Find the first .sln file in the directory
        const solutionFile = files.find(file => file.endsWith(".sln"));
        if (!solutionFile) {
            throw new Error("No .sln file found in the source directory.");
        }
        const srcPath = path.join(srcDir, solutionFile);

        // Apply Handlebars template to filename
        const template = Handlebars.compile(solutionFile);
        const newFilename = template(data);

        // Define destination path
        const destPath = path.join(destDir, newFilename);

        // Read solution file content
        const content = await fs.readFile(srcPath, "utf-8");

        // Compile content with Handlebars
        const contentTemplate = Handlebars.compile(content);
        const newContent = contentTemplate(data);

        // Ensure destination directory exists
        await fs.ensureDir(destDir);

        // Write the new solution file with processed filename and content
        await fs.writeFile(destPath, newContent, "utf-8");
        console.log(`Solution file processed and copied to ${destPath}`);
    } catch (err) {
        console.error("Error processing solution file:", err);
    }
}

async function processCsprojFiles(srcDir, destDir, data) {
    try {
      // Recursively process each file and directory
      async function processDirectory(currentSrcDir, currentDestDir) {
        // Read all items in the current source directory
        const items = await fs.readdir(currentSrcDir);
  
        for (const item of items) {
          const srcPath = path.join(currentSrcDir, item);
          const destPathTemplate = Handlebars.compile(item);
          const destPath = path.join(currentDestDir, destPathTemplate(data));
          const stats = await fs.stat(srcPath);
  
          if (stats.isDirectory()) {
            // If the item is a directory, create the destination directory and process recursively
            await fs.ensureDir(destPath);
            await processDirectory(srcPath, destPath);
          } else if (item.endsWith(".csproj")) {
            // Process .csproj files with Handlebars
            const content = await fs.readFile(srcPath, "utf-8");
            const contentTemplate = Handlebars.compile(content);
            const newContent = contentTemplate(data);
  
            // Ensure destination directory exists and write the new .csproj file
            await fs.ensureDir(currentDestDir);
            await fs.writeFile(destPath, newContent, "utf-8");
  
            console.log(`Processed .csproj file: ${destPath}`);
          }
        }
      }
  
      // Start processing from the root source directory
      await processDirectory(srcDir, destDir);
  
      console.log("All .csproj files processed and copied with structure preserved.");
    } catch (err) {
      console.error("Error processing .csproj files:", err);
    }
  }

const generateSolutionFiles = async (spec, buildDirectory) => {
    const sourceDirectory = TEMPLATE_PATH;
    const boundedContextNames = Object.keys(spec.boundedContexts);
    for (let boundedContextName of boundedContextNames) {
        const projectName = pascalCase(boundedContextName);
        const templateData = {
            project: {
                name: projectName
            }
        };
        const destinationDirectory = path.join(buildDirectory, projectName);
        await processSolutionFile(sourceDirectory, destinationDirectory, templateData);
        await processCsprojFiles(sourceDirectory, destinationDirectory, templateData);
    }
};

export default generateSolutionFiles;