import { XPage } from './x-page.js';
import { html } from '/node_modules/@gluon/gluon/gluon.js';

class ValidatorPage extends XPage {
  get template() {
    const peerId = this.params.peerId

    return html`
      <h1>On validator ${peerId} page</h1>
    `
  }
}

customElements.define(ValidatorPage.is, ValidatorPage);
