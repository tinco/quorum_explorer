import { XPage } from './x-page.js';
import { html } from '/node_modules/@gluon/gluon/gluon.js';

class OrganizationPage extends XPage {
  get template() {
    const name = this.params.organization

    return html`
      <h1>Organization: ${name}</h1>
    `
  }
}

customElements.define(OrganizationPage.is, OrganizationPage);
