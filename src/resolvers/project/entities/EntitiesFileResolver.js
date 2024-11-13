import { pascalCase } from "change-case";
import path from "path"
import { FileResolverArgs, Provider } from "../../def.js";
import unwrapObj from "../../../utils/unwrapObj.js";
import parseTemplateWithPath from "../../../utils/parseTemplateWithPath.js";




/**
* Description placeholder
*/
class EntitiesFileResolver {

    /**
    * Container
    * @type {Provider}
    */
    provider

    /**
    * Creates an instance of EntitiesFileResolver.
    * @param {Provider} provider
    */
    constructor(provider) {
        this.provider = provider;
    }

    /**
    * Generates code based on a given schema object, using a specified template.
    * @param {FileResolverArgs} param
    * @returns {Promise}
    * 
    */
    async execute({ spec, outputDirectory }) {
        const sourceDirectory = this.provider.projectTemplate;

        for (let boundedContext of unwrapObj(spec.boundedContexts)) {

            const templatesData = await Promise.all(unwrapObj(boundedContext.domain.entities)
            .map(async entity => await this.getClassTemplateData(entity, boundedContext, { isEntity: true })))

            for (let templateData of templatesData) {
                const destinationDirectory = path.join(outputDirectory, templateData.project.name);
                await parseTemplateWithPath(sourceDirectory, destinationDirectory, ".entity.cs", templateData);
            }
        }
    }

    async getClassTemplateData (entity, boundedContext, { isEntity } = { isEntity: false}) {
        const projectName = pascalCase(boundedContext.name);
        const className = pascalCase(entity.name);
    
        const properties = unwrapObj(entity.properties || {})
            .map(field => ({
                type: this.provider.typeSchemaResolver.execute({ ...field, boundedContext, domainObject: entity, command: null}),
                name: pascalCase(field.name),
                default: this.provider.typeDefaultSchemaResolver.execute({ context: field, boundedContext, domainObject: entity, command: null}),
            }))
    
        let methods = [];
    
        if (entity.actions) {
            methods = await Promise.all(unwrapObj(entity.actions)
            .map(async method => ({
                name: pascalCase(method.name),
                type: "void",
                parameters: await Promise.all(unwrapObj(method.parameters)
                .map(async param => ({ name: param.name, type: await this.provider.typeSchemaResolver.execute({ context: param, boundedContext, domainObject: entity, command: null}) }))),
                body: method.execute.map(line => this.provider.opSchemaResolver.execute({ context: line, boundedContext, domainObject: entity, command: null }))
            })))
        }
    
        return {
            project: {
                name: projectName
            },
            class: {
                name: className,
                properties: isEntity ? properties.filter(x => x.name != "Id") : properties,
                methods: methods,
                aggregate: entity.aggregate,
                idType: isEntity ? properties.find(x => x.name == "Id")?.type : null
            }
        };
    }
    
}

export default EntitiesFileResolver

