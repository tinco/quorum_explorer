import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'

class OrganizationLink extends GluonElement {
  fetchData() {
    return getStellarCoreData().then((data) => this.data = data)
  }

  get organization() {
      const name = this.getAttribute('name')
      return this.data.organizations[name]
  }

  get linkTemplate() {
    return this.fetchData().then( () => {
      return html`
        <a href$="/organizations/${this.organization.name}">
        ${this.organization.name}
          (<span class="trustIndex>">${this.organization.displayTrustIndex}</span>)
        </a>
      `
    })
  }

  get template() {
    return html`<style>
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
    ${ this.linkTemplate }
    `
  }
}

customElements.define(OrganizationLink.is, OrganizationLink);
