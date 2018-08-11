import { XPage } from './x-page.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'
import { html } from '../../node_modules/@gluon/gluon/gluon.js';

class OrganizationPage extends XPage {
  get name() {
    return this.params.organization
  }

  get organization() {
    return this.data.organizations[this.name]
  }

  get introductionTemplate() {
    const o = this.organization
    const validator = o.validators[0] // TODO move to model?
    const known = validator.known_info ? "" : "not "
    const known_sentence = html`This organization is <b>${known}listed</b> in the stellar.org
    list of <a href="https://www.stellar.org/developers/guides/nodes.html">known validators</a>.`
    const account_info = validator.account_info
    const account_info_sentence =
      html`It has <b>${account_info ? "" : "not "}connected</b> an ${
        account_info ? html`<a href="https://stellarchain.io/address/${o.validators[0].peer_id}">account</a>` : "account"
      } to its validator${ o.validators.length > 1 ? "s" : "" }.`
    return html`
      <p>
        ${known_sentence} ${account_info_sentence}
      </p>
    `
  }

  fetchData() {
    return getStellarCoreData().then((data) => this.data = data)
  }

  get organizationTemplate() {
    return this.fetchData().then(() => {
      return html`
        <h2>Organization ${this.name}</h2>
        ${ this.introductionTemplate }
      `
    })
  }

  get template() {
    return html`${ this.active ? this.organizationTemplate : "" }`
  }
}

customElements.define(OrganizationPage.is, OrganizationPage);
