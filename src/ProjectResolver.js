import options from "./cli.js"
import { Provider } from "./resolvers/def.js";
import fs from "fs-extra";

class ProjectResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider
  
    /**
    * Creates an instance of index.
    * @param {Provider} provider
    */
    constructor(provider) {
      this.provider = provider;
    }
  
    
    /**
     * Description placeholder
     *
     * @async
     * @param {{ spec: any; outputDirectory: string; deleteExistingFiles: boolean; }} param
     * @returns {Promise}
     */
    async execute({ spec, outputDirectory, deleteExistingFiles}) {
      console.log("Generating application...");
  
      
    
      // Ensure output directory is clean
      if (options.deleteExistingFiles) {
        await fs.remove(outputDirectory);
        await fs.ensureDir(outputDirectory);
      }
    
      const fileResolvers = [
        this.provider.commandFileResolver,
        this.provider.entitiesFileResolver,
        this.provider.miscFileResolver
      ];
    
      for (let resolvers of fileResolvers)
        await resolvers.execute({ spec, outputDirectory });
    
      console.log("Application generated successfully!");
    }
  }

  export default ProjectResolver;