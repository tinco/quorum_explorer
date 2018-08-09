import '/elements/validator-link.js'
import '/elements/validator-page.js'
import '/elements/organization-link.js'
import '/elements/organization-page.js'
import '/elements/x-pages.js'

import { withStellarCoreData } from '/lib/stellar-core-data.js'
import {html, render} from '/node_modules/lit-html/lib/lit-extended.js'
import {repeat} from '/node_modules/lit-html/lib/repeat.js'

withStellarCoreData((data) => {
  const validatorList = document.getElementById('validator-list')
  const organizationList = document.getElementById('organization-list')

  const validatorTemplate = validators => html`
    ${repeat(validators, (v) => v.peer_id, (v, index) => html`
      <li><validator-link validator=${v}></validator-link></li>
    `)}
  `
  const sortedAccounts = Object.values(data.accounts).sort((a, b) => b.trustIndex - a.trustIndex)
  render(validatorTemplate(sortedAccounts), validatorList)

  const organizationListTemplate = organizations => html`
    ${repeat(organizations, (o) => o.name, (o, index) => html`
      <li><organization-link organization=${o}></organization-link></li>
    `)}
  `
  render(organizationListTemplate(Object.values(data.organizations)), organizationList)
})
