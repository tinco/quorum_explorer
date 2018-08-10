import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';

class ValidatorLink extends GluonElement {
  get template() {
    const validator = this.validator
    if (validator) {
      return html`
          <a href="#action=showValidator,validator=${validator.peer_id}">${validator.displayName} (
            <span class="trustIndex>">${validator.trustIndex.toFixed(3)}</span>)</a>
      `
    } else {
      return html`Not loaded`
    }
  }
}

customElements.define(ValidatorLink.is, ValidatorLink);
