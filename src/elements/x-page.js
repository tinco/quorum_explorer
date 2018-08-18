import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { currentPath } from '../../node_modules/@gluon/router/gluon-router.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'

export class XPage extends GluonElement {
  fetchData() {
    return getStellarCoreData().then((data) => { this.data = data; return data })
  }

  static get observedAttributes() {
    return ['active']
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'active') {
      this.onPageChanged(newValue)
    }
  }

  onPageChanged(active) {
    if(active) {
      this.render()
    }
  }

  get active() {
    return this.hasAttribute("active")
  }

  get template() {
    return html`<section><slot></slot></section>`
  }
}

customElements.define(XPage.is, XPage);
