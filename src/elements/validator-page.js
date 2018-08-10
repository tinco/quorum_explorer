import { XPage } from './x-page.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'
import { html } from '../../node_modules/@gluon/gluon/gluon.js';

class ValidatorPage extends XPage {
  get template() {
    const validatorTemplate = () => {
      return getStellarCoreData().then( data => {
        const peerId = this.params.validator
        const validator = data.accounts[peerId]
        return html`
          <h1>Validator ${validator.displayName}</h1>
          <pre>
            ${JSON.stringify(validator, null, 2)}
          </pre>
        `
      }
    )}

    return html`${ this.active ? validatorTemplate() : "" }`
  }
}

customElements.define(ValidatorPage.is, ValidatorPage);
