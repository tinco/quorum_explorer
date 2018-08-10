import { XPage } from './x-page.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'
import { html } from '../../node_modules/@gluon/gluon/gluon.js';

class OrganizationPage extends XPage {
  get template() {
    const organizationTemplate = () => {
      return getStellarCoreData().then((data) => {
        const name = this.params.organization
        const o = data.organizations[name]
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
          <h2>Organization ${o.name}</h2>
          <p>
            ${known_sentence} ${account_info_sentence}
          </p>
          <pre>
            ${JSON.stringify(o, null, 2)}
          </pre>
        `
      })
    }
    return html`${ this.active ? organizationTemplate() : "" }`
  }
}

customElements.define(OrganizationPage.is, OrganizationPage);
