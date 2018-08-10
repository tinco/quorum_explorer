import { XPage } from './x-page.js';
import { withStellarCoreData } from '../lib/stellar-core-data.js'
import { html } from '../../node_modules/@gluon/gluon/gluon.js';

class OrganizationPage extends XPage {
  get organization() {
    const name = this.params.organization
    if (this._organization && this._organization.name === name) {
      return this._organization
    }

    withStellarCoreData((data) => {
      this.organization = data.organizations[name]
    })

    return null
  }

  set organization(value) {
    this._organization = value
    this.render()
  }

  get template() {
    if(this.active && this.organization) {
      return html`
        <h1>Organization ${this.organization.name}</h1>
        <pre>
          ${JSON.stringify(this.organization, null, 2)}
        </pre>
      `
    } else {
      return html``
    }

  }
}

customElements.define(OrganizationPage.is, OrganizationPage);
