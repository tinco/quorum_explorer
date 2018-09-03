import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
// import { getStellarCoreData } from '../lib/stellar-core-data.js'

const organizationTemplate = (o) => {
  return html`
    <li><organization-link id$=${o.id}></organization-link></li>
  `
}

class OrganizationList extends GluonElement {
  get organizations() {
    return this._organizations;
  }

  set organizations(value) {
    this._organizations = value;
    this.render();
  }

  get template() {
    const organizations = this.organizations || []
    return html`
      <style>
        ul {
          list-style: none;
          padding-left: 0;
        }

        li {
          padding-bottom: 0.5em;
        }
      </style>
      <ul>${organizations.map(organizationTemplate)}</ul>
    `
  }
}

customElements.define(OrganizationList.is, OrganizationList);
