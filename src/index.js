import './elements/validator-link.js'
import './elements/validator-page.js'
import './elements/organization-link.js'
import './elements/organization-page.js'
import './elements/x-pages.js'
import './elements/most-trusted-organizations.js'

import { getStellarCoreData } from './lib/stellar-core-data.js'
import {html, render} from '../node_modules/lit-html/lib/lit-extended.js'
import {repeat} from '../node_modules/lit-html/lib/repeat.js'

getStellarCoreData().then((data) => {
  const validatorList = document.getElementById('validator-list')
  const organizationList = document.getElementById('organization-list')

  const validatorTemplate = validators => html`
    ${ validators.map(v => html`
      <li><validator-link peer-id$=${v.peer_id}></validator-link></li>
    `)}
  `
  const sortedAccounts = Object.values(data.accounts).sort((a, b) => b.trustIndex - a.trustIndex)
  render(validatorTemplate(sortedAccounts), validatorList)

  const organizationListTemplate = organizations => html`
    ${ organizations.map( o => html`
      <li><organization-link name$=${o.name}></organization-link></li>
    `)}
  `
  render(organizationListTemplate(Object.values(data.organizations)), organizationList)
})
