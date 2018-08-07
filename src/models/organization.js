import { Model } from './model.js';

export class Organization extends Model {
  constructor(attributes) {
    super(attributes)
    this.validators = []
  }

  get trustIndex() {
    return this.validators.reduce((m, v) => m + v.trustIndex, 0)
  }
}
