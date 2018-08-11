import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'

class ValidatorLink extends GluonElement {
  fetchData() {
    return getStellarCoreData().then((data) => this.data = data)
  }

  get validator() {
      const peerId = this.getAttribute('peer-id')
      return this.data.accounts[peerId]
  }

  get linkTemplate() {
    return this.fetchData().then(() => {
      const validator = this.validator
      return html`
        <a href$="#action=showValidator&validator=${validator.peer_id}">
          ${validator.displayName} (
            <span class="trustIndex>">${validator.displayTrustIndex}</span>)
        </a>
      `
    })
  }

  get template() {
    return html`
      <style>
        a {
          text-decoration: none;
        }

        a, a:link, a:visited {
            color: blue;
        }

        a:hover {
            color: red;
        }
      </style>
      ${ this.linkTemplate }
    `
  }
}

customElements.define(ValidatorLink.is, ValidatorLink);
