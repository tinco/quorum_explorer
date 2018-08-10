import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';

class OrganizationLink extends GluonElement {
  get template() {
    let organization = this.organization
    if (organization) {
      return html`
          <style>
            a {
              text-decoration: none;
            }

            a:link, a:visited {
                color: blue;
            }

            a:hover {
                color: red;
            }
          </style>
          <a href="#action=showOrganization,organization=${organization.name}">${organization.name} (
            <span class="trustIndex>">${organization.trustIndex.toFixed(3)}</span>)</a>
      `
    } else {
      return html`Not loaded`
    }
  }
}

customElements.define(OrganizationLink.is, OrganizationLink);
