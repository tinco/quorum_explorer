import { Validator } from '../models/validator.js'
import { Organization } from '../models/organization.js'
import { displayTrustIndex } from '../lib/utils.js'

const listeners = []
let stellarCoreData = null

const accountsLoaded = (data) => {
  let accounts = Validator.many_from_hashmap(data.accounts)
  let organizations = Organization.many_from_hashmap(data.organizations)

  data.accounts = accounts
  data.organizations = organizations

  stellarCoreData = data

  listeners.forEach( f => f(stellarCoreData))
}

export const getStellarCoreData = (f) => {
  return new Promise((resolve, reject) => {
    if (stellarCoreData) {
      resolve(stellarCoreData)
    } else {
      listeners.push(resolve)
    }
  });
}

export const getStellarCoreDataOrNull = () => stellarCoreData

const accountsPromise = fetch('/data/stellar-core-data.json')
  .then(response => response.json())
  .then(accountsLoaded);
