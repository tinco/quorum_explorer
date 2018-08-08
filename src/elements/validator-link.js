import { GluonElement, html } from '/node_modules/@gluon/gluon/gluon.js';

class ValidatorLink extends GluonElement {
  get template() {
    if (this.info) {
      return html`
          <a href="#action=showValidator,validator=${this.info.peer_id}">${this.info.displayName} (
            <span class="trustIndex>">${this.info.trustIndex.toFixed(3)}</span>)</a>
      `
    } else {
      return html`Not loaded`
    }
  }
}

customElements.define(ValidatorLink.is, ValidatorLink);
