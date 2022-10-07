// Something that happens at a given time
class Occurance {
  // @params params.createdAt 2022-08-09T09:32:18Z
  constructor(params) {
    this.createdAt = params.createdAt;
  }

  get dayBucket() {
    const createdAt = new Date(this.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.getUTCMonth() + 1;
    const day = createdAt.getDate();
    return `${year}-${month}-${day}`;
  }
  // gets the bucket key for a given deploy week
  get weekBucket() {
    const createdAt = new Date(this.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.getUTCMonth() + 1;
    const week = Math.ceil(createdAt.getDate() / 7);

    return `${year}-${month}-${week}`;
  }

  // gets the bucket key for a given deploy week
  get monthBucket() {
    const createdAt = new Date(this.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.getUTCMonth() + 1;

    return `${year}-${month}`;
  }
}

module.exports = {
  Occurance
};
