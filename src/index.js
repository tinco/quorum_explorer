import './elements/validator.js'
import { Validator } from './models/validator.js'
import { Organization } from './models/organization.js'
import {html, render} from './node_modules/lit-html/lib/lit-extended.js'
import {repeat} from './node_modules/lit-html/lib/repeat.js'

const accountsLoaded = (accounts) => {
  accounts = Validator.many_from_hashmap(accounts)
  console.time("CalculateTrustIndices")
  Validator.CalculateTrustIndices(accounts)
  console.timeEnd("CalculateTrustIndices")

  const validatorList = document.getElementById('validator-list')
  const organizationList = document.getElementById('organization-list')

  const sortedAccounts = Object.values(accounts).sort((a, b) => b.trustIndex - a.trustIndex)
  const keybaseAccounts = sortedAccounts.filter(a => a.account_info && a.account_info.keybase)
  const verifiedAccounts = sortedAccounts.filter(a => a.known_info)

  const organizations = {}
  sortedAccounts.forEach( validator => {
    const organization_name = validator.organization_name || "unknown"
    organizations[organization_name] = organizations[organization_name] || new Organization({name: organization_name})
    organizations[organization_name].validators.push(validator)
  })

  console.log(organizations)

  const validatorTemplate = validators => html`
    ${repeat(validators, (v) => v.peer_id, (v, index) => html`
      <li><stellar-validator info=${v}></stellar-validator></li>
    `)}
  `
  render(validatorTemplate(sortedAccounts), validatorList)

  const organizationListTemplate = organizations => html`
    ${repeat(organizations, (o) => o.name, (o, index) => html`
      <li>${o.name}: ${o.trustIndex.toFixed(3)}</li>
    `)}
  `
  render(organizationListTemplate(Object.values(organizations)), organizationList)
}

const accountsPromise = fetch('data/accounts.json')
  .then(response => response.json())
  .then(accountsLoaded);
