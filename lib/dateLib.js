const moment = require('moment');

function build(dateString) {
  return moment(dateString, 'YYYY-M-D');
}

function previous(date) {
  return moment(date, 'YYYY-M-D').subtract(1, 'day').format('YYYY-M-D');
}
function next(date) {
  return moment(date, 'YYYY-M-D').add(1, 'day').format('YYYY-M-D');
}

module.exports = {
  build,
  previous,
  next
};
