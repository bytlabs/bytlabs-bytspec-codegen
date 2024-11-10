import { Builder } from "builder-pattern";
import { pascalCase } from "change-case";
import unwrapObj from "../utils/unwrapObj";

export default function (provider) {
    return {
        execute: async ({ context, boundedContext }) => {
            const project = Builder(Project)
                .name(pascalCase(boundedContext.name))
                .build();

            const properties = await Promise.all(unwrapObj(context.properties || {})
                .map(async field =>
                    Builder(Property)
                        .type(await provider.schemaTypeResolver.execute({
                            context: field,
                            domainObject: context,
                            boundedContext
                        }))
                        .name(pascalCase(field.name))
                        .default(await provider.schemaDefaultValueResolver.execute({
                            context: field,
                            domainObject: context,
                            boundedContext
                        }))
                        .build()
                ))

            const $class = Builder(Class)
                .name(pascalCase(context.name))
                .properties(properties)
                .build();

            return Builder(ClassContext)
                .project(project)
                .class($class)
                .build();
        }
    }
};

export class ClassContext {
    project
    class
}

export class Project {
    name
}

export class Class {
    name;
    properties
}

export class Property {
    type
    name
    default
}