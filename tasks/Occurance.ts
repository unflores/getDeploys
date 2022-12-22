import * as moment from 'moment'
// Something that happens at a given time
class Occurance {
  createdAt: string

  constructor(params: { createdAt: string }) {
    this.createdAt = params.createdAt;
  }

  get dayBucket(): string {
    return moment(this.createdAt).format('YYYY-M-D');
  }

  // gets the bucket key for a given deploy week
  get monthBucket(): string {
    return moment(this.createdAt).format('YYYY-M');
  }
}

export {
  Occurance
}
