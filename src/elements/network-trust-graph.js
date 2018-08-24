import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js';

const colorForNode = (n) => colorForValidator(n.v)
const colorForValidator = (v) => v.organization.trustColor
const sizeForNode = (n) => {
  const size = n.v.trustIndex * 50
  if (size < 3) {
    return 3
  } else {
    return size
  }
}

class NetworkTrustGraph extends GluonElement {
  get fetchData() {
    return getStellarCoreData().then((data) => { this.data = data; return data })
  }

  get svg() {
    return d3.select(this.$.networkTrustSVG)
  }

  connectedCallback() {
    super.connectedCallback()
    this.render().then(() => {
      this.fetchData.then((data) => {
        const accounts = Object.values(data.accounts)
          .filter(v => v.trusting_nodes.length > 0 || v.quorum)

        this.linksData = []
        this.nodesData = accounts.map( (v) => {
          const newLinks = v.trustingNodes.map((oV) => { return { source: oV.peer_id, target: v.peer_id }})
          this.linksData = this.linksData.concat(newLinks)
          return { id: v.peer_id, v: v, links: newLinks }
        })

        this.drawGraph()
      })
    })
  }

  drawGraph() {
    const links = this.svg.append("g")
      .attr("class", "links")
      .selectAll("line")
        .data(this.linksData).enter()
          .append("line")
            .attr("stroke-width", 1)
            .attr("stroke", (l) => colorForValidator(this.data.accounts[l.target]))
            .attr("stroke-opacity", 0.2)
            .each(function(d) { d.line = d3.select(this) });

    const nodes = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
        .data(this.nodesData).enter()
          .append("circle")
            .attr("r", sizeForNode)
            .attr("fill", colorForNode)
            .attr("opacity", .5)
            .attr("stroke", '#555')
            .attr("stroke-width", .5)
            .on("mouseover", (d) => this.handleMouseOverNode(d))
            .on("mouseout", (d) => this.handleMouseOutNode(d))
            .each(function(d) { d.circle = d3.select(this) });

    this.runSimulation(links, nodes)
  }

  runSimulation(links, nodes) {
    const linkForce = d3.forceLink(this.linksData)
      .distance(50)
      .strength(0.01)
      .id(function(d) { return d.id; })

    const tickActions = () => {
      nodes
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)

      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
    }

    const simulation = d3.forceSimulation()
    simulation
        .force("charge_force", d3.forceManyBody().strength(-15))
        .force("center_force", d3.forceCenter(
          parseInt(this.svg.attr('width') / 2),
          parseInt(this.svg.attr('height') / 2)))

    simulation.nodes(this.nodesData)
    simulation.force("links",linkForce)
    simulation.on("tick", tickActions)
  }

  handleMouseOverNode(d) {
    d.circle
      .attr('r', n => sizeForNode(n) * 2)
      .attr('opacity', .9)
      .attr("stroke", colorForNode)
      .attr("stroke-width", .5)

    d.links.forEach(link =>
      link.line
        .attr('stroke-width', 3)
        .attr("stroke-opacity", 0.4)
        .attr("stroke", (l) => colorForValidator(l.source.v))
    )
  }

  handleMouseOutNode(d) {
    d.circle
      .attr('r', sizeForNode)
      .attr('opacity', .5)
      .attr("stroke", '#555')
      .attr("stroke-width", .5)

    d.links.forEach(link =>
      link.line
        .attr('stroke-width', 1)
        .attr("stroke-opacity", 0.2)
        .attr("stroke", (l) => colorForValidator(l.target.v))
    )
  }

  get template() {
    return html`
      <style>
        #networkTrustGraph {
          position: fixed;
          top: 0;
          left: 0;
          z-index: -1;
        }
      </style>
      <h3>Network Trust</h3>
      <svg id="networkTrustSVG" width="800" height="800"></svg>
    `
  }
}

customElements.define(NetworkTrustGraph.is, NetworkTrustGraph);
