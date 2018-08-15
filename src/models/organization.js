import { Model } from './model.js';
import { displayTrustIndex } from '../lib/utils.js';

export class Organization extends Model {
  constructor(attributes) {
    super(attributes)
  }

  get validators() {
    return this.validator_ids.map(id => this.stellarData.accounts[id])
  }

  set validators(value) {
    this.validator_ids = value
  }

  get account_info() {
    return this.validators[0].account_info
  }

  get hasVerifiedValidators() {
    return this.validators.find( v => v.known_info )
  }

  get trustingNodes() {
    const trustPairs = this.validators.reduce((m, v) => {
      return m.concat(v.trustingNodes.map( n => [n, n.trustFor(v)]))
    },[])
    const nodesTrust = {}
    trustPairs.forEach( ([v, t]) => {
      nodesTrust[v.peer_id] = nodesTrust[v.peer_id] || { validator: v, totalTrust: 0 }
      nodesTrust[v.peer_id].totalTrust += t
    })
    return Object.values(nodesTrust)
  }

  get displayTrustIndex() {
    return displayTrustIndex(this.trustIndex)
  }

  get trustIndex() {
    return this.validators.reduce((m, v) => m + v.trustIndex, 0)
  }
}
