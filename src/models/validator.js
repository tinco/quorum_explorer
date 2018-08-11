import { Model } from './model.js';
import { displayTrustIndex } from '../lib/utils.js';


export class Validator extends Model {
  get displayName() {
    let name = this.peer_id
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

  get displayTrustIndex() {
    return displayTrustIndex(this.trustIndex)
  }

  get trustIndex() {
    return this._trustValue / this._totalTrust
  }

  set trustValue(value) {
    this._trustValue = value
  }

  set totalTrust(value) {
    this._totalTrust = value
  }

  get trustTable() {
    if (this._trustTable || !this.quorum) {
      return this._trustTable || {}
    }
    this._trustTable = {}
    const baseTrust = 1 / this.quorum.threshold
    this.quorum.validators.forEach(v => this._trustTable[v] = baseTrust)
    const innerSetTrust = (set, base) => {
      const baseTrust = base * (1 / set.threshold)
      set.validators.forEach(v => {
        this._trustTable[v] = this._trustTable[v] || 0
        this._trustTable[v] += base
      })
      set.inner_sets.forEach(set => innerSetTrust(set, baseTrust))
    }
    this.quorum.inner_sets.forEach(set => innerSetTrust(set, baseTrust))
    return this._trustTable
  }

  // the amount of trust a validator puts into another validator is
  // 1 / threshold for the level it is in (this is a trust maximum)
  // if the validator is in an inner set, the inverse thresholds are
  // multiplied.
  trustFor(validator) {
    return this.trustTable[validator.peer_id] || 0
  }

  static CalculateTrustIndices(validators) {
    let totalTrust = 0
    Object.values(validators).forEach(validator => {
      let trust = 0
      validator.trustingNodes = []
      Object.values(validators).forEach(otherValidator => {
        const trustForUs = otherValidator.trustFor(validator)
        if (trustForUs > 0) {
          trust += trustForUs
          validator.trustingNodes.push(otherValidator)
        }
      })
      totalTrust += trust
      validator.trustValue = trust
    })
    Object.values(validators).forEach(validator => validator.totalTrust = totalTrust)
  }
}
