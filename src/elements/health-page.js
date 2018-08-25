import { XPage } from './x-page.js';
import { html } from '../../node_modules/@gluon/gluon/gluon.js';
import { displayTrustIndex } from '../lib/utils.js';

class HealthPage extends XPage {
  get healthPageTemplate() {
    return this.fetchData().then((data) => {
      const nodes = Object.values(data.accounts)
      const acceptingNodes = nodes.filter((n) => n.accepts_connections)
      const disconnectedNodes = nodes.filter((n) => !n.quorum)
      console.log("in health page", data)
      return html`
        <h2>Health page</h2>
        <p>
          The network consists of ${nodes.length} nodes. Of these, about
            ${acceptingNodes.length} are accepting connections.
        </p>
        <radial-connection-graph></radial-connection-graph>
        <h3>Nodes that accept new connections</h3>
        <validator-list validators=${acceptingNodes}></validator-list>
        <h3>Nodes without a quorumset</h3>
        <validator-list validators=${disconnectedNodes}></validator-list>

      `
    })
  }

  get template() {
    return html`${ this.active ? this.healthPageTemplate : "" }`
  }
}

customElements.define(HealthPage.is, HealthPage);
