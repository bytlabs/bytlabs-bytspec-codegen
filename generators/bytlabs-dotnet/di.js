import * as awilix from 'awilix';
import { getFilenamesWithoutExtension } from "./lib/shared.js";
import { pascalCase } from 'change-case';

export async function createContainer() {

    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY,
        strict: true,
    })

    await registerGenerators(container);

    return container;
}

async function registerGenerators(container) {
    const toGeneratorName = (name) => `generator${pascalCase(name)}`;

    await container.loadModules(
        [
            'generators/bytlabs-dotnet/lib/generators/*.js'
        ],
        {
            formatName: toGeneratorName,
            resolverOptions: {
                lifetime: awilix.Lifetime.SINGLETON,
                register: awilix.asFunction,
                tags: ['generators']
            },
            esModules: true
        }
    );

    container.register({
        generators: awilix.asFunction((opt) => {
            return {
                all: async () => {
                    return (await getFilenamesWithoutExtension('generators/bytlabs-dotnet/lib/generators'))
                        .map(toGeneratorName)
                        .map(name => opt[name])
                }
            }
        }).singleton()
    })
}