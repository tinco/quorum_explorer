import { GluonElement, html } from '/node_modules/@gluon/gluon/gluon.js';
import { onRouteChange, currentHash } from '/node_modules/@gluon/router/gluon-router.js';

export class XPages extends GluonElement {
  connectedCallback() {
    onRouteChange((path, query, hash) => this.onRouteChange());
    super.connectedCallback();
    this.onRouteChange()
  }

  onRouteChange() {
    const hash = currentHash()
    const params = {}
    hash.split(",").forEach(p => {
      const [k, v] = p.split("=",2)
      params[k] = v
    })

    const activePage = params.action
    this.querySelectorAll(':scope > .active').forEach( e => e.classList.remove('active'))
    let nextPage = this.querySelector('#' + activePage)
    if (!nextPage) {
      nextPage = this.querySelector(':scope > *[default]')
    }
    nextPage.classList.add('active')
  }
}

customElements.define(XPages.is, XPages);
