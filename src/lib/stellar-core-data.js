import { Validator } from '../models/validator.js'
import { Organization } from '../models/organization.js'

const listeners = []
let stellarCoreData = null

const accountsLoaded = (data) => {
  let accounts = Validator.many_from_hashmap(data)
  console.time("CalculateTrustIndices")
  Validator.CalculateTrustIndices(accounts)
  console.timeEnd("CalculateTrustIndices")

  // const keybaseAccounts = sortedAccounts.filter(a => a.account_info && a.account_info.keybase)
  // const verifiedAccounts = sortedAccounts.filter(a => a.known_info)
  let organizations = {}
  const sortedAccounts = Object.values(accounts).sort((a, b) => b.trustIndex - a.trustIndex)
  sortedAccounts.forEach( validator => {
    const organization_name = validator.organization_name || "unknown"
    organizations[organization_name] = organizations[organization_name] || new Organization({name: organization_name})
    organizations[organization_name].validators.push(validator)
  })

  stellarCoreData = { accounts, organizations }

  listeners.forEach( f => f(stellarCoreData))
}

export const withStellarCoreData = (f) => {
  if (stellarCoreData) {
    f(stellarCoreData)
  } else {
    listeners.push(f)
  }
}

const accountsPromise = fetch('data/accounts.json')
  .then(response => response.json())
  .then(accountsLoaded);
