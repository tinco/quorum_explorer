import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
// import { getStellarCoreData } from '../lib/stellar-core-data.js'

const validatorTemplate = (v) => {
  return html`
    <li><validator-link peer-id$=${v.peer_id}></validator-link></li>
  `
}

class ValidatorList extends GluonElement {
  get validators() {
    return this._validators;
  }

  set validators(value) {
    this._validators = value;
    this.render();
  }

  get template() {
    const validators = this.validators || []
    return html`<ul>${validators.map(validatorTemplate)}</ul>`
  }
}

customElements.define(ValidatorList.is, ValidatorList);
