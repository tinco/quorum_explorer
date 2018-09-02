import './elements/health-page.js'
import './elements/validator-link.js'
import './elements/validator-list.js'
import './elements/validator-page.js'
import './elements/organization-link.js'
import './elements/organization-page.js'
import './elements/x-pages.js'
import './elements/most-trusted-organizations.js'
import './elements/network-trust-graph.js'
import './elements/radial-connection-graph.js'
import './elements/attribute-pairs.js'
import './elements/quorum-explorer-footer.js'

import { getStellarCoreData } from './lib/stellar-core-data.js'
import {html, render} from '../node_modules/lit-html/lib/lit-extended.js'
import {repeat} from '../node_modules/lit-html/lib/repeat.js'

getStellarCoreData().then((data) => {
  const validatorList = document.getElementById('validator-list')
  const organizationList = document.getElementById('organization-list')

  const validatorTemplate = validators => html`<validator-list validators=${validators}></validator-list>`
  const sortedAccounts = Object.values(data.accounts).sort((a, b) => b.trustIndex - a.trustIndex)
  render(validatorTemplate(sortedAccounts), validatorList)

  const organizationListTemplate = organizations => html`
    ${ organizations.map( o => html`
      <li><organization-link id=${o.id}></organization-link></li>
    `)}
  `

  const sortedOrganizations = Object.values(data.organizations).sort((a, b) => b.trustIndex - a.trustIndex)
  render(organizationListTemplate(Object.values(sortedOrganizations)), organizationList)
})
