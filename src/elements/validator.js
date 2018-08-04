import { GluonElement, html } from '/node_modules/@gluon/gluon/gluon.js';

class StellarValidator extends GluonElement {
  get template() {
    if (this.info) {
      return html`
        <h2>
          <span class="trustIndex>">${this.info.trustIndex}</span>
          ${this.info.displayName}
          <span class="address">${this.info.displayAddress}</span
        </h2>
        <div class="">

        </div>
      `
    } else {
      return html`Not loaded`
    }
  }
}

customElements.define(StellarValidator.is, StellarValidator);
