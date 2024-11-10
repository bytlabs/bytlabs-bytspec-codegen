import spec from "./specs/commerce-platform.json" with  { type: 'json' };
import generateApp from "./generator/index.js" ;

async function main() {
    const OUTPUT_DIR = "./build";
    await generateApp(spec, OUTPUT_DIR, { deleteExistingFiles: false });
}

main().catch(err => console.log(err));