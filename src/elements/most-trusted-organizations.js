import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';
import { getStellarCoreData } from '../lib/stellar-core-data.js'
import '../../node_modules/chart.js/dist/Chart.bundle.js';

const navigateToOrganization = (name) => {
  if (name == "other" || name == "unknown") {
    return
  }
  window.location.hash = "action=showOrganization&organization=" + name
}

class MostTrustedOrganizations extends GluonElement {
  connectedCallback() {
    super.connectedCallback()
    this.render().then(() => {
      getStellarCoreData().then((data) => {
        const organizations = Object.values(data.organizations).sort((a, b) => b.trustIndex - a.trustIndex)
        const options = {
          responsive: false,
          legend: {
            display: true,
            position: 'left'
          },
          onClick: (e, d) => navigateToOrganization(d[0]._model.label),
          cutoutPercentage: 40,
          rotation: 0.75 * Math.PI,
          tooltips: {
            callbacks: {
              label: (i, d) => {
                return d.labels[i.index] + ': ' +
                  (d.datasets[0].data[i.index] * 100).toFixed(2) + '%'
              }
            }
          }
        }

        const biggestOrganizations = organizations.slice(0,11)
        const restOrganizations = organizations.slice(11)
        const other = restOrganizations.reduce((m, o) => {
          return { name: m.name, trustIndex: m.trustIndex + o.trustIndex}
        }, { name: "other", trustIndex: 0 })
        biggestOrganizations.push(other)

        const organizationData = {
          labels: biggestOrganizations.map( o => o.name ),
          datasets: [{
              data: biggestOrganizations.map( o => o.trustIndex ),
              borderWidth: 1,
              backgroundColor: [
                "#FFC312", "#C4E538", "#12CBC4", "#FDA7DF", "#ED4C67",
                "#F79F1F", "#A3CB38", "#1289A7", "#D980FA", "#B53471",
                "#EE5A24", "#009432", "#0652DD", "#9980FA", "#833471",
                "#EA2027", "#006266", "#1B1464", "#5758BB", "#6F1E51"
              ]
          }]
        }

        const ctx = this.$["mostTrustedOrganizations"]
        let chart = new Chart(ctx,
          {
            type: 'doughnut',
            data: organizationData,
            options: options
        })
      })
    })
  }

  get template() {
    return html`
      <style>
        #mostTrustedOrganizations {
        }
      </style>
      <h3>Most trusted organizations in Stellar Core</h3>
      <canvas id="mostTrustedOrganizations" height=300 width=500></canvas>
    `
  }
}

customElements.define(MostTrustedOrganizations.is, MostTrustedOrganizations);
