function objectFilter(obj: object, predicate: (val1: any, val2: any) => boolean) {
  const result = {}
  let key: any

  for (key in obj) {
    if (obj.hasOwnProperty(key) && predicate(key, obj[key])) {
      result[key] = obj[key]
    }
  }

  return result
}

export {
  objectFilter
}
