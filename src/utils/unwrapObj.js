/**
 * 
 * Description placeholder
 *
 * @export
 * @param {Object<string, Object>} obj
 * @returns {Object}
 */
export default function unwrapObj(obj) {
    const keys = Object.keys(obj)
    const data = keys.map(key => ({ name: key, ...obj[key] }))
    return data;
}