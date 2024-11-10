import * as awilix from 'awilix';
import { getFilenamesWithoutExtension } from "./lib/shared.js";
import { pascalCase } from 'change-case';

export async function createContainer() {

    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY,
        strict: true,
    })

    await registerMultiImplServices(container, 'generator/lib/generators', (name) => `${pascalCase(name)}Generator`);
    await registerMultiImplServices(container, 'generator/lib/resolvers', (name) => `${name}Resolver`);
    container.register({
        templateDir: awilix.asValue("generator/template/standard")
    })

    return container;
}

async function registerMultiImplServices(container, dir, formatName) {
    await container.loadModules(
        [
            `${dir}/*.js`
        ],
        {
            formatName: formatName,
            resolverOptions: {
                lifetime: awilix.Lifetime.SINGLETON,
                register: awilix.asFunction
            },
            esModules: true
        }
    );

    container.register({
        generators: awilix.asFunction((opt) => {
            return {
                all: async () => {
                    return (await getFilenamesWithoutExtension(dir))
                        .map(formatName)
                        .map(name => opt[name])
                }
            }
        }).singleton()
    })
}