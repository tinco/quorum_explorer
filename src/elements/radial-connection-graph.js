import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js';
import { navigate } from '../lib/utils.js';

const navigateToOrganization = (o) => {
  if (o.name == "other") {
    navigate("/organizations")
  } else {
    navigate("/organizations/" + o.id)
  }
}

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

class RadialConnectionGraph extends GluonElement {
  get fetchData() {
    return getStellarCoreData().then((data) => { this.data = data; return data })
  }

  get svg() {
    return d3.select(this.$.radialConnectionGraphSVG)
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
    const width = parseInt(this.svg.attr('width'))
    const outerRadius = width / 2
    const innerRadius = outerRadius - 130

    const plot = this.svg.append("g")
      .attr("id", "plot")
      .attr("transform", `translate(${outerRadius}, ${outerRadius})`)

    // use to scale node index to theta value
    const scale = d3.scaleLinear()
      .domain([0, this.nodesData.length])
      .range([0, 2 * Math.PI])

    const nodesMap = {}
    this.nodesData.forEach((d, i) => {
        const theta  = scale(i)
        const radial = innerRadius

        // convert to cartesian coordinates
        d.x = radial * Math.sin(theta)
        d.y = radial * Math.cos(theta)
        d.t = theta
        d.a = -(theta / Math.PI * 180) + 90

        nodesMap[d.id] = d
    })

    this.svg.select("#plot")
      .selectAll(".label")
      .data(this.nodesData).enter()
        .append("text")
          .attr("class", "label")
          .text(d => d.v.displayName)
          .attr('t', d => d.t)
          .attr('dx', '1em')
          .attr('dy', '0.3em')
          .attr("text-anchor", d => d.t < 180 ? "start" : "end")
          .attr("transform", d => `translate(${d.x} ${d.y})rotate(${d.a})`)
          .on("mouseover", (d) => this.handleMouseOverNode(d))
          .on("mouseout", (d) => this.handleMouseOutNode(d))
          .on("click", (d) => this.handleClickNode(d))
          .each(function(d) { d.label = d3.select(this) })

    this.svg.select("#plot")
      .selectAll(".link")
      .data(this.linksData).enter()
        .append("path")
          .attr("class", "link")
          .attr("d", d => {
            const source = nodesMap[d.source]
            const target = nodesMap[d.target]
            const cx1 = source.x / 2
            const cy1 = source.y / 2
            const cx2 = target.x / 2
            const cy2 = target.y / 2
            return `M${source.x},${source.y}C${cx1} ${cy1},${cx2} ${cy2} ${target.x},${target.y}`
          })
          .attr('stroke-width', 1)
          .attr("stroke-opacity", 0.2)
          .attr('fill', 'transparent')
          .attr("stroke", (l) => colorForValidator(nodesMap[l.target].v))


    this.svg.select("#plot")
      .selectAll(".node")
      .data(this.nodesData).enter()
        .append("circle")
          .attr("class", "node")
          .attr("id", (d) => "node-${d.id}")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", 5)
          .style("fill", colorForNode)
          .on("mouseover", (d) => this.handleMouseOverNode(d))
          .on("mouseout", (d) => this.handleMouseOutNode(d))
          .on("click", (d) => this.handleClickNode(d))
          .each(function(d) { d.node = d3.select(this) })
  }

  handleClickNode(d) {
    navigateToOrganization(d.v.organization)
  }

  handleMouseOverNode(d) {

  }

  handleMouseOutNode(d) {
  }

  get template() {
    return html`
      <style>
        .node, .label {
          font: 300 11px "Helvetica Neue", Helvetica, Arial, sans-serif;
          fill: #bbb;
          text-transform: uppercase;
          cursor: default;
        }

        .node:hover, .label:hover {
          fill: #00F;
          font-weight: normal;
        }

      </style>
      <h3>Network Trust</h3>
      <svg id="radialConnectionGraphSVG" width="800" height="800"></svg>
    `
  }
}

customElements.define(RadialConnectionGraph.is, RadialConnectionGraph);
