import { GluonElement, html } from '../../node_modules/@gluon/gluon/gluon.js';

export class AttributePairs extends GluonElement {
  get template() {
    return html`
      <style>
        dl {
          display: flex;
          flex-wrap: wrap;
          margin-right: 2em;
        }

        ::slotted(dt), ::slotted(dd) {
          flex: 1 0 40%;
          margin: 0;
          padding: .5em;
          overflow-x: hidden;
        }

        ::slotted(dt) {
          font-weight: 300;
          text-transform: uppercase;
        }
      </style>
      <dl><slot></slot></dl>
    `
  }
}

customElements.define(AttributePairs.is, AttributePairs);
