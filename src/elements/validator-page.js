import { XPage } from './x-page.js';
import { withStellarCoreData } from '../lib/stellar-core-data.js'
import { html } from '../../node_modules/@gluon/gluon/gluon.js';

class ValidatorPage extends XPage {
  get validator() {
    const peerId = this.params.validator
    if (this._validator && this._validator.peer_id === peerId) {
      return this._validator
    }

    withStellarCoreData((data) => {
      this.validator = data.accounts[peerId]
    })

    return null
  }

  set validator(value) {
    this._validator = value
    this.render()
  }

  get template() {
    if(this.active && this.validator) {
      return html`
        <h1>Validator ${this.validator.displayName}</h1>
        <pre>
          ${JSON.stringify(this.validator, null, 2)}
        </pre>
      `
    } else {
      return html``
    }

  }
}

customElements.define(ValidatorPage.is, ValidatorPage);
