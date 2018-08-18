import { XPage } from './x-page.js';
import { html } from '../../node_modules/@gluon/gluon/gluon.js';
import { displayTrustIndex } from '../lib/utils.js';

class HealthPage extends XPage {
  get healthPageTemplate() {
    return this.fetchData().then((data) => {
      const nodes = Object.values(data.accounts)
      const acceptingNodes = nodes.filter((o) => o.accepts_connections)
      console.log("in health page", data)
      return html`
        <h2>Health page</h2>
        <p>
          The network consists of ${nodes.length} nodes. Of these, about
            ${acceptingNodes.length} are accepting connections.
        </p>
        <h3>Accepting nodes</h3>
        <ul>
        ${ acceptingNodes.map(v => html`<li><validator-link peer-id$=${v.peer_id}></validator-link></li>`) }
        </ul>
      `
    })
  }

  get template() {
    return html`${ this.active ? this.healthPageTemplate : "" }`
  }
}

customElements.define(HealthPage.is, HealthPage);
