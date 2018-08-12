import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { onRouteChange, currentPath } from '../../node_modules/@gluon/router/gluon-router.js';

const matchRoute = (e, path) => {
  const parts = path.split('/')
  const routeParts = e.getAttribute('route').split('/')
  if (parts.length != routeParts.length) {
    return false
  }
  const mismatch = -1 < routeParts.findIndex((r, i) => {
    console.log("checking parts", r, parts[i])
    if (r[0] != ':' && r != parts[i]) {
        return true
    }
  })
  return !mismatch
}

export class XPages extends GluonElement {
  connectedCallback() {
    onRouteChange((path, query, hash) => this.onRouteChange());
    super.connectedCallback();
    this.onRouteChange()
  }

  onRouteChange() {
    const path = currentPath()
    const pages = Array.from(this.querySelectorAll('*[route]'))
    console.log("pages", pages)
    let nextPage = pages.find((p) => matchRoute(p, path))
    if (!nextPage) {
      nextPage = this.parentElement.querySelector('x-pages > *[default]') // rename to defaultPage?
    }
    console.log('navigating to', nextPage)
    this.parentElement.querySelectorAll('x-pages > .active').forEach( e => e.classList.remove('active'))
    nextPage.classList.add('active')
    nextPage.render()
    scroll(0,0)
  }
}

customElements.define(XPages.is, XPages);
