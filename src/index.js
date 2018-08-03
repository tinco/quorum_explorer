import './elements/validator.js'
import { Validator } from './models/validator.js'
import {html, render} from './node_modules/lit-html/lib/lit-extended.js'
import {repeat} from './node_modules/lit-html/lib/repeat.js'

const accountsLoaded = (accounts) => {
  accounts = Validator.many_from_hashmap(accounts)

  const validatorList = document.getElementById('validator-list')

  const validatorTemplate = validators => html`
    ${repeat(validators, (v) => v.peer_id, (v, index) => html`
      <li><stellar-validator info=${v}></stellar-validator></li>
    `)}
  `
  render(validatorTemplate(Object.values(accounts)), validatorList)
}

const accountsPromise = fetch('data/accounts.json')
  .then(response => response.json())
  .then(accountsLoaded);
