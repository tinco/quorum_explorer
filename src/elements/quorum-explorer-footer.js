import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'

class QuorumExplorerFooter extends GluonElement {
  fetchData() {
    return getStellarCoreData().then((data) => this.data = data)
  }

  get footerTemplate() {
    return this.fetchData().then(() => {
      let date = new Date(this.data.last_crawl_time)
      return html`<footer>Last crawled at ${date.toLocaleString()}</footer>`
    })
  }

  get template() {
    return html`
      <style>
        footer {
          width: 100vw;
          text-align: center;
          display: block;
          font-size: 12px;
          text-transform: uppercase;
        }
      </style>
      ${ this.footerTemplate }
    `
  }
}

customElements.define(QuorumExplorerFooter.is, QuorumExplorerFooter);
