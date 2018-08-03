import { Model } from './model.js';

export class Validator extends Model {
  get displayName() {
    let name = this.peer_id
    if (this.known_info) {
      name = this.known_info.name
    }

    if (this.account_info) {
      console.log("account info", this.account_info)
      // name = this.account_info.
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
}
