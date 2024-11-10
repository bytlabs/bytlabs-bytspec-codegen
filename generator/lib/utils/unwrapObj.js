const unwrapObj = (obj) => {
    const keys = Object.keys(obj)
    return keys.map(key => ({ name: key, ...obj[key] }))
}

export default unwrapObj;