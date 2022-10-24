const moment = require('moment');

function build(dateString) {
  return moment(dateString, 'YYYY-M-D');
}

function previous(date, unit = 'day') {
  return moment(date, 'YYYY-M-D').subtract(1, unit).format('YYYY-M-D');
}
function next(date, unit = 'day') {
  return moment(date, 'YYYY-M-D').add(1, unit).format('YYYY-M-D');
}

module.exports = {
  build,
  previous,
  next
};
