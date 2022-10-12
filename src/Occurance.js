const moment = require('moment');
// Something that happens at a given time
class Occurance {
  // @params params.createdAt 2022-08-09T09:32:18Z
  constructor(params) {
    this.createdAt = params.createdAt;
  }

  get dayBucket() {
    return moment(this.createdAt).format('YYYY-M-D');
  }

  // gets the bucket key for a given deploy week
  get monthBucket() {
    return moment(this.createdAt).format('YYYY-M');
  }
}

module.exports = {
  Occurance
};
