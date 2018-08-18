import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { currentPath } from '../../node_modules/@gluon/router/gluon-router.js';

export class XPage extends GluonElement {
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
