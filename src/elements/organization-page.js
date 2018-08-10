import { XPage } from './x-page.js';
import { withStellarCoreData } from '../lib/stellar-core-data.js'
import { html } from '../../node_modules/@gluon/gluon/gluon.js';

class OrganizationPage extends XPage {
  get organization() {
    const name = this.params.organization
    if (this._organization && this._organization.name == name) {
      return this._organization
    }

    if (this._loading) {
      return null
    }
    this._loading = true

    withStellarCoreData((data) => {
      this.organization = data.organizations[name]
      this._loading = false
    })

    return null
  }

  set organization(value) {
    this._organization = value
    this.render()
  }

  get template() {
    if(this.active && this.organization) {
      const o = this.organization
      const known = o.validators[0].known_info ? "" : "not "
      const known_sentence = html`This organization is <b>${known}listed</b> in the stellar.org
      list of <a href="https://www.stellar.org/developers/guides/nodes.html">known validators</a>.`
      const account_info = o.validators[0].account_info
      const account_info_sentence =
        html`It has <b>${account_info ? "" : "not "}connected</b> an ${
          account_info ? html`<a href="https://stellarchain.io/address/${o.validators[0].peer_id}">account</a>` : "account"
        } to its validator${ o.validators.length > 1 ? "s" : "" }.`
      return html`
        <h1>Organization ${this.organization.name}</h1>
        <p>
          ${known_sentence} ${account_info_sentence}
        </p>
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
