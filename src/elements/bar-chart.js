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

class BarChart extends GluonElement {
  get data() {
    return this._data
  }

  set data(value) {
    this._data = value
    this.render()
  }

  get svg() {
    return d3.select(this.$.barChartSVG)
  }

  connectedCallback() {
    super.connectedCallback()
    this.render().then(() => {
        this.drawGraph()
    })
  }

  drawGraph() {
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 80, left: 40},
        width = 660 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = this.svg;
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    const data = this.data

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.key; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", d => d.color);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");
      ;

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
  }

  get template() {
    return html`
      <style>
        #barChartSVG {
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
      <svg id="barChartSVG"></svg>
    `
  }
}

customElements.define(BarChart.is, BarChart);
