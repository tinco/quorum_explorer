export class Model {
  constructor(attributes) {
    Object.entries(attributes).forEach(([k,v]) => this[k] = v)
  }

  static many_from_hashmap(records) {
    const results = {}
    Object.entries(records).forEach(([k, v]) => {
        results[k] = new this(v)
    })
    return results
  }
}
