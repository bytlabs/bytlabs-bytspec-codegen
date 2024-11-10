import Handlebars from "handlebars"
import { readFile } from 'fs/promises';
import Chance from "chance";

const compileTemplate = async (path, context) => {
    const template = Handlebars.compile(await readFile(path, 'utf-8'));
    const content = template(context);
    return content;
}

const randomName = () => {
    const chance = new Chance();
    const randomName = chance.word({ syllables: 3 })
    return randomName;
}

export {
    compileTemplate,
    randomName
}