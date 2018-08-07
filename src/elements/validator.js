import { GluonElement, html } from '/node_modules/@gluon/gluon/gluon.js';

class StellarValidator extends GluonElement {
  get template() {
    if (this.info) {
      return html`
          ${this.info.displayName} (
            <span class="address">${this.info.displayAddress}</span>,
            <span class="trustIndex>">${this.info.trustIndex.toFixed(3)}</span> )
        </div>
      `
    } else {
      return html`Not loaded`
    }
  }
}

customElements.define(StellarValidator.is, StellarValidator);
