import "./partials.js"
import "./schema.js"
import "./resolvers/def.js"
import { createContainer } from "./di.js";
import ProjectResolver from "./ProjectResolver.js";
import fs from "fs-extra"


async function main() {
    const OUTPUT_DIR = "./build";

    const container = await createContainer();
    const spec = await fs.readJSON("../specs/commerce-platform.json");
    
    /**
     * Description placeholder
     *
     * @type {ProjectResolver}
     */
    const projectResolver = container.resolve("projectResolver");
    projectResolver.execute({spec, outputDirectory: OUTPUT_DIR, deleteExistingFiles: false})
}

main().catch(err => console.log(err));