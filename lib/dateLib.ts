const moment = require('moment');

function build(dateString) {
  return moment(dateString, 'YYYY-M-D');
}

function previous(date, unit = 'day') {

  const newDate = moment(date, 'YYYY-M-D').subtract(1, unit);

  if (unit === 'day')
    return newDate.format('YYYY-M-D');
  else
    return newDate.format('YYYY-M');
}
function next(date, unit = 'day') {
  const newDate = moment(date, 'YYYY-M-D').add(1, unit);

  if (unit === 'day')
    return newDate.format('YYYY-M-D');
  else
    return newDate.format('YYYY-M');
}

module.exports = {
  build,
  previous,
  next
};
