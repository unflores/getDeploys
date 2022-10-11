function objectFilter(obj, predicate) {
  let result = {}, key;

  for (key in obj) {
    if (obj.hasOwnProperty(key) && predicate(key, obj[key])) {
      result[key] = obj[key];
    }
  }

  return result;
};


module.exports = {
  objectFilter
};
