import { GluonElement, html } from '/node_modules/@gluon/gluon/gluon.js';

class StellarValidator extends GluonElement {
  get template() {
    if (this.info) {
      return html`${this.info.peer_id}`
    } else {
      return html`Not loaded`
    }
  }
}

customElements.define(StellarValidator.is, StellarValidator);
