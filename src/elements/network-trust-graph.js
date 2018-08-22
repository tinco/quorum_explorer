import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js';

class NetworkTrustGraph extends GluonElement {
  connectedCallback() {
    super.connectedCallback()
    this.render().then(() => {
      getStellarCoreData().then((data) => {
        const accounts = Object.values(data.accounts)
          .filter(v => v.trusting_nodes.length > 0 || v.quorum)

        const nodes_data = accounts.map( (v) => {
          return { id: v.peer_id, v: v }
        })

        const simulation = d3.forceSimulation()

        simulation.nodes(nodes_data)

        const svg = d3.select(this.$.networkTrustSVG)
        const width = +svg.attr("width")
        const height = +svg.attr("height")

        //add forces
        //we're going to add a charge to each node
        //also going to add a centering force
        simulation
            .force("charge_force", d3.forceManyBody().strength(-15))
            .force("center_force", d3.forceCenter(width / 2, height / 2));

        //Time for the links

        //Create links data
        var links_data = []

        accounts.forEach((v) => {
          v.trustingNodes.forEach((oV) => {
            links_data.push({ source: oV.peer_id, target: v.peer_id })
          })
        })

        const colorForNode = (n) => colorForValidator(n.v)
        const colorForValidator = (v) => v.organization.trustColor

        const sizeForNode = (n) => {
          let size = n.v.trustIndex * 50
          if (size < 3) {
            return 3
          } else {
            return size
          }
        }

        //draw lines for the links
        var link = svg.append("g")
              .attr("class", "links")
            .selectAll("line")
            .data(links_data)
            .enter().append("line")
              .attr("stroke-width", 1)
              .attr("stroke", (l) => colorForValidator(data.accounts[l.target]))
              .attr("stroke-opacity", 0.2);

        //draw circles for the nodes
        var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes_data)
                .enter()
                .append("circle")
                .attr("r", sizeForNode)
                .attr("fill", colorForNode)
                .attr("opacity", .5)
                .attr("stroke", "black")
                .attr("stroke-width", .5);

        //Create the link force
        //We need the id accessor to use named sources and targets

        var link_force = d3.forceLink(links_data)
          .distance(50)
          .strength(0.01)
          .id(function(d) { return d.id; })

        //Add a links force to the simulation
        //Specify links  in d3.forceLink argument

        simulation.force("links",link_force)

        const tickActions = () => {
            //update circle positions each tick of the simulation
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            //update link positions
            //simply tells one end of the line to follow one node around
            //and the other end of the line to follow the other node around
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
          }


          //add tick instructions:
          simulation.on("tick", tickActions );
      })
    })
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
