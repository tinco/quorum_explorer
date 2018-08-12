import { XPage } from './x-page.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'
import { html } from '../../node_modules/@gluon/gluon/gluon.js';
import { displayTrustIndex } from '../lib/utils.js';
import { Organization } from '../models/organization.js';

class OrganizationPage extends XPage {

  get organization() {
    return this.data.organizations[this.params.id]
  }

  get introductionTemplate() {
    const o = this.organization
    const known = o.hasVerifiedValidators ? "" : "not "
    const known_sentence = html`This organization is <b>${known}listed</b> in the stellar.org
    list of <a href="https://www.stellar.org/developers/guides/nodes.html">known validators</a>.`
    const account_info = o.account_info
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

  get accountInfoTemplate() {
    const o = this.organization
    const i = o.known_info || {}
    const accountInfo = html`
      <dl class="accountInfo">
        <dt>Name</dt><dd>${i.ORG_NAME}</dd>
        <dt>Website</dt><dd>${i.ORG_URL}</dd>
        <dt>E-mail</dt><dd>${i.ORG_OFFICIAL_EMAIL}</dd>
      </dl>
      ${ i.keybase ?
        html`<p>Visit the <a href="${i.keybase}">keybase account</a> of this organization for social proof.</p>`
      : html`<p>Organization has not registered a <a href="https://keybase.io">Keybase</a> account, so no social proof available.</p>`
      }
    `
    return html`
    <h4>Account information</h4>
    ${ o.account_info ? accountInfo :
      html`<p>
        This organization has not connected a <a href="https://github.com/stellar/stellar-protocol/issues/111">
        Stellar account</a>.</p>`
    }`
  }

  get identityTemplate() {
    return html`
      <h3>Organization Identity</h3>
      ${ this.accountInfoTemplate }
    `
  }

  get validatorsTemplate() {
    const o = this.organization
    return html`
      <h3>Validators</h3>
      ${ o.validators.map(v => html`<li><validator-link peer-id$=${v.peer_id}></validator-link></li>`) }
    `
  }

  get trustInformationTemplate() {
    const o = this.organization
    return html`
      <h3>Trust information</h3>
      <p>This organization receives ${o.displayTrustIndex} of trust from the network.</p>

      <h4>Trusting nodes</h4>
      <dl>
        ${ o.trustingNodes.map(trust => {
          return html`
            <dt><validator-link peer-id$=${trust.validator.peer_id}></validator-link></dt>
            <dd>${ displayTrustIndex(trust.totalTrust)}</dd>
          `})
        }
      </dl>
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
        ${ this.identityTemplate }
        ${ this.validatorsTemplate}
        ${ this.trustInformationTemplate }
      `
    })
  }

  get template() {
    return html`${ this.active ? this.organizationTemplate : "" }`
  }
}

customElements.define(OrganizationPage.is, OrganizationPage);
