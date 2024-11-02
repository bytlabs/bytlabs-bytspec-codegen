import path from "path";
import spec from "./specs/commerce-platform.json" assert { type: 'json' };
import generateApp from "./generators/bytlabs-dotnet/index.js" ;

async function main() {
    const OUTPUT_DIR = "./build";
    await generateApp(spec, OUTPUT_DIR);
}

main().catch(err => console.log(err));