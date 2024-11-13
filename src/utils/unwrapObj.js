

/**
 * Description placeholder
 *
 * @export
 * @param {*} obj
 * @returns {*}
 */
export default function unwrapObj(obj) {
    const keys = Object.keys(obj)
    return keys.map(key => ({ name: key, ...obj[key] }))
}