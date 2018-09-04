import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js';
import { navigate } from '../lib/utils.js';

class ValidatorTree extends GluonElement {
  get data() {
    return this._data
  }

  set data(value) {
    this._data = value
    this.render()
  }

  get svg() {
    return d3.select(this.$.validatorTreeSVG)
  }

  connectedCallback() {
    super.connectedCallback()
    this.render().then(() => {
        this.drawGraph()
    })
  }

  drawGraph() {
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    const estimatedLabelSize = 80

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = this.svg;
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    const data = this.data
    const root = d3.hierarchy(data)

    var tree = d3.tree()
        .size([2 * Math.PI, (height - (estimatedLabelSize * 2)) / 2])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    tree(root);

    var link = g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkRadial()
            .angle(function(d) { return d.x; })
            .radius(function(d) { return d.y; }))
            .attr("fill", "transparent")
            .attr("stroke", '#555')
            .attr("stroke-width", .5);

    const radialPoint = (x, y) => {
      return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    }

    var node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + radialPoint(d.x, d.y) + ")"; });

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", function(d) { return d.x < Math.PI === !d.children ? 6 : -6; })
        .attr("text-anchor", function(d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
        .attr("transform", function(d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
        .text(function(d) { return d.data.node.displayName; });
  }

  get template() {
    return html`
      <style>
        #validatorTreeSVG {
          /*position: fixed;
          top: 0;
          left: 0;
          z-index: -1;*/
        }

        .node, .label {
          font: 300 11px "Helvetica Neue", Helvetica, Arial, sans-serif;
          fill: #888;
        }

      </style>
      <svg id="validatorTreeSVG"></svg>
    `
  }
}

customElements.define(ValidatorTree.is, ValidatorTree);
