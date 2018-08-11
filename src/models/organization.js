import { Model } from './model.js';
import { displayTrustIndex } from '../lib/utils.js';

export class Organization extends Model {
  constructor(attributes) {
    super(attributes)
    this.validators = []
  }

  get displayTrustIndex() {
    return displayTrustIndex(this.trustIndex)
  }

  get trustIndex() {
    return this.validators.reduce((m, v) => m + v.trustIndex, 0)
  }
}
