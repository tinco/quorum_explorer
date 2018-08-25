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

    // const fill = d3.scale.category20c()

    const plot = this.svg.append("g")
      .attr("id", "plot")
      .attr("transform", `translate(${outerRadius}, ${outerRadius})`)

    // use to scale node index to theta value
    const scale = d3.scaleLinear()
        .domain([0, this.nodesData.length])
        .range([0, 2 * Math.PI])

    this.nodesData.forEach((d, i) => {
        const theta  = scale(i)
        const radial = innerRadius

        // convert to cartesian coordinates
        d.x = radial * Math.sin(theta)
        d.y = radial * Math.cos(theta)
        d.t = theta
        d.a = -(theta / Math.PI * 180) + 90
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
          //.on("mouseover", function(d, i) { addTooltip(d3.select(this)); })
          //.on("mouseout",  function(d, i) { d3.select("#tooltip").remove(); });
  }

  handleMouseOverNode(d) {
    /*d.circle
      .attr('r', n => sizeForNode(n) * 2)
      .attr('opacity', .9)
      .attr("stroke", colorForNode)
      .attr("stroke-width", .5)

    d.links.forEach(link =>
      link.line
        .attr('stroke-width', 3)
        .attr("stroke-opacity", 0.4)
        .attr("stroke", (l) => colorForValidator(l.source.v))
    )*/
  }

  handleMouseOutNode(d) {
    /*d.circle
      .attr('r', sizeForNode)
      .attr('opacity', .5)
      .attr("stroke", '#555')
      .attr("stroke-width", .5)

    d.links.forEach(link =>
      link.line
        .attr('stroke-width', 1)
        .attr("stroke-opacity", 0.2)
        .attr("stroke", (l) => colorForValidator(l.target.v))
    )*/
  }

  get template() {
    return html`
      <style>
        #radialConnectionGraphSVG {
          /*position: fixed;
          top: 0;
          left: 0;
          z-index: -1;*/
        }

        .node, .label {
          font: 300 11px "Helvetica Neue", Helvetica, Arial, sans-serif;
          fill: #bbb;
        }

      </style>
      <h3>Network Trust</h3>
      <svg id="radialConnectionGraphSVG" width="800" height="800"></svg>
    `
  }
}

customElements.define(RadialConnectionGraph.is, RadialConnectionGraph);
