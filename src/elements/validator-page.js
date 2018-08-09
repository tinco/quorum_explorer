import { XPage } from './x-page.js';
import { html } from '/node_modules/@gluon/gluon/gluon.js';

class ValidatorPage extends XPage {
  get template() {
    const peerId = this.params.validator

    return html`
      <h1>Validator ${peerId}</h1>
    `
  }
}

customElements.define(ValidatorPage.is, ValidatorPage);
