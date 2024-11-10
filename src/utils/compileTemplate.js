import Handlebars from "handlebars"
import { readFile } from 'fs/promises';

const compileTemplate = async (path, context) => {
    const template = Handlebars.compile(await readFile(path, 'utf-8'));
    const content = template(context);
    return content;
}

export default compileTemplate;