import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { onRouteChange, currentPath, interceptLinks } from '../../node_modules/@gluon/router/gluon-router.js';

interceptLinks()

const matchRoute = (path, route) => {
  const parts = path.split('/')
  const routeParts = route.split('/')
  if (parts.length != routeParts.length) {
    return false
  }
  const mismatch = -1 < routeParts.findIndex((r, i) => {
    if (r[0] != ':' && r != parts[i]) {
        return true
    }
  })
  return !mismatch
}

const params = (path, route) => {
  const params = {}
  const parts = path.split('/')
  const routeParts = route.split('/')
  routeParts.forEach((p,i) => {
    let [_, symbol] = p.split(':', 2)
    if (symbol) {
      params[symbol] = parts[i]
    }
  })
  return params
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
    let nextPage = pages.find((p) => matchRoute(path, p.getAttribute("route")))
    if (!nextPage) {
      nextPage = this.parentElement.querySelector('x-pages > *[default]') // rename to defaultPage?
    }
    this.parentElement.querySelectorAll('x-pages > *[active]').forEach( e => e.removeAttribute('active'))
    nextPage.params = params(path, nextPage.getAttribute("route"))
    nextPage.setAttribute('active', true)
    scroll(0,0)
  }
}

customElements.define(XPages.is, XPages);
