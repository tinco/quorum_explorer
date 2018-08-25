import { Model } from './model.js';
import { displayTrustIndex } from '../lib/utils.js';

export class Validator extends Model {
  get displayName() {
    let name = this.peer_id.substring(0,12)
    if (this.known_info) {
      name = this.known_info.name
    }

    if (this.account_info && this.account_info.home_domain) {
      name = this.account_info.home_domain + " " + this.peer_id.substring(0,4)
    }

    if (this.account_info && this.account_info.ORG_NAME) {
      name = this.account_info.ORG_NAME + " " + this.peer_id.substring(0,4)
    }
    return name
  }

  get displayAddress() {
    let address = "unknown"
    let port = ""

    if (this.address) {
      const split = this.address.split(":", 2)
      address = split[0]
      port = split[1]
    }

    if (this.known_info) {
      address = this.known_info.host
    }

    if (parseInt(port) != 11625) {
      address = address + ":" + port
    }

    return address
  }

  get organization() {
    return this.stellarData.organizations[this.organization_id]
  }

  get displayTrustIndex() {
    return displayTrustIndex(this.trustIndex)
  }

  get trustIndex() {
    return this.trust_value / this.stellarData.total_trust
  }

  get trustTable() {
    return this.trust_table
  }

  get trustingNodes() {
    return this.trusting_nodes.map(n => this.stellarData.accounts[n])
  }

  // the amount of trust a validator puts into another validator is
  // 1 / threshold for the level it is in (this is a trust maximum)
  // if the validator is in an inner set, the inverse thresholds are
  // multiplied.
  trustFor(validator) {
    return this.trust_table[validator.peer_id] || 0
  }
}
