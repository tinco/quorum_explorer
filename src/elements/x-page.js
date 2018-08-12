import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { currentPath } from '../../node_modules/@gluon/router/gluon-router.js';

export class XPage extends GluonElement {
  get params() {
    const params = {}
    const parts = currentPath().split('/')
    const routeParts = this.getAttribute('route').split('/')
    routeParts.forEach((p,i) => {
      let [_, symbol] = p.split(':', 2)
      if (symbol) {
        params[symbol] = parts[i]
      }
    })
    return params
  }

  get active() {
    return this.classList.contains("active")
  }

  get template() {
    return html`<section><slot></slot></section>`
  }
}

customElements.define(XPage.is, XPage);
