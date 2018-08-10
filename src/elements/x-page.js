import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { currentHash } from '../../node_modules/@gluon/router/gluon-router.js';

export class XPage extends GluonElement {
  get params() {
    const hash = currentHash()
    const params = {}
    hash.split("&").forEach(p => {
      const [k, v] = p.split("=",2)
      params[decodeURIComponent(k)] = decodeURIComponent(v)
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
