import { XPage } from './x-page.js';
import { html } from '../../node_modules/@gluon/gluon/gluon.js';
import { displayTrustIndex } from '../lib/utils.js';
import { quorumIntersection } from '../lib/quorum-intersection.js';

class HealthPage extends XPage {
  get healthPageTemplate() {
    return this.fetchData().then((data) => {
      const nodes = Object.values(data.accounts)
      const acceptingNodes = nodes.filter((n) => n.accepts_connections)
      const disconnectedNodes = nodes.filter((n) => !n.quorum)

      const sortedAccounts = Object.values(data.accounts).sort((a, b) => b.trustIndex - a.trustIndex)

      const trustPerNode = sortedAccounts.filter(n => n.trustIndex > 0).map((n) => {
        return {
          key: n.displayName,
          value: n.trustIndex,
          color: n.organization.trustColor
        }
      })

      console.log("on health page", data)

      return html`
        <h2>Health page</h2>

        <h3>Trust characteristics</h4>
        <h4>Quorum intersection</h4>
        <p>To do</p>
        <h4>Trust distribution</h4>
        <bar-chart data=${trustPerNode}></bar-chart>

        <h3>Overlay characteristics</h3>
        <p>
          The network consists of ${nodes.length} nodes. Of these, about
            ${acceptingNodes.length} are accepting connections.
        </p>
        <h4>Nodes that accept new connections</h4>
        <validator-list validators=${acceptingNodes}></validator-list>
        <!--
          1. Connection capacity
          2. Network weak points
          3. How often nodes see "missing" nodes
          4. Network resiliency (i.e. how many servers can go offline before the network halts)
          5. Node uptime percentage and current status <!-->

        <h3>Stellar Core Protocol characteristics</h3>
        <h4>Transaction rate</h4>
        <p>To do</p>
        <h4>Dissenters</h4>
        <p>To do</p>
        <h4>Nodes without a quorumset</h4>
        <validator-list validators=${disconnectedNodes}></validator-list>

        <h3>Network client characteristics</h3>
        <!--1. Geographical distribution
        2. Protocol versions
        3. Client strings<!-->

      `
    })
  }

  get template() {
    return html`${ this.active ? this.healthPageTemplate : "" }`
  }
}

customElements.define(HealthPage.is, HealthPage);
