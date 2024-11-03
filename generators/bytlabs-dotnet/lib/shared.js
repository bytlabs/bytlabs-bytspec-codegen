import fs from "fs-extra";
import path from "path";
import Handlebars from "handlebars";
import lodash from "lodash"
import { pascalCase } from "change-case";

const parseTemplateWithPath = async (srcDir, destDir, extension, data) => {
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
                } else if (item.endsWith(extension)) {
                    // Process .csproj files with Handlebars
                    const content = await fs.readFile(srcPath, "utf-8");
                    const contentTemplate = Handlebars.compile(content);
                    const newContent = contentTemplate(data);

                    // Ensure destination directory exists and write the new .csproj file
                    await fs.ensureDir(currentDestDir);
                    await fs.writeFile(destPath, newContent, "utf-8");

                    console.log(`Processed ${extension} file: ${destPath}`);
                }
            }
        }

        // Start processing from the root source directory
        await processDirectory(srcDir, destDir);

        console.log("All "+ extension +" files processed and copied with structure preserved.");
    } catch (err) {
        console.error("Error processing "+ extension +" files:", err);
    }
}



const resolveExtendedFields = (type, boundedContext, fields = {}) => {
    if (type.extends) {
        const breadcrumbs = type.extends.type.split("/").slice(1)
        let entity = boundedContext;
        for (let breadcrumb of breadcrumbs) {
            entity = entity[breadcrumb];
        }
        fields = { ...fields, ...resolveExtendedFields(entity, boundedContext, fields) }

    }

    fields = { ...fields, ...type.fields };

    if (type.extends && type.extends.omit) {
        fields = lodash.omit(fields, type.extends.omit)
    }

    return fields;
}

const unwrapObj = (obj) => {
    const keys = Object.keys(obj)
    return keys.map(key => ({ name: key, ...obj[key] }))
}

const mapToCsharpType = (type, itemType) => {
    if(type && type.startsWith("#")) {
        const typeName = lodash.last(type.split("/"))
        return pascalCase(typeName)
    }

    switch (type) {
        case "number":
            return "double";
        case "text":
            return "string"
        case "date":
            return "DateTime"
        case "boolean":
            return "bool"
        case "void":
            return "void"
        case "collection":
            return `ICollecton<${mapToCsharpType(itemType)}>`
        default:
            return type;
    }
}

const mapToCsharpField = (field) => {
    return {
        type: mapToCsharpType(field.type, field.items),
        name: pascalCase(field.name)
    }
}

export {
    parseTemplateWithPath, 
    resolveExtendedFields, 
    unwrapObj,
    mapToCsharpField
};