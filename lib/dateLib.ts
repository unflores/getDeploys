import * as moment from 'moment'

function build(dateString: string) {
  return moment(dateString, 'YYYY-M-D')
}

function previous(date: string, unit: moment.DurationInputArg2 = 'day') {
  const newDate = moment(date, 'YYYY-M-D').subtract(1, unit)

  if (unit === 'day') {
    return newDate.format('YYYY-M-D')
  }

  return newDate.format('YYYY-M')
}
function next(date: string, unit: moment.DurationInputArg2 = 'day') {
  const newDate = moment(date, 'YYYY-M-D').add(1, unit)

  if (unit === 'day') {
    return newDate.format('YYYY-M-D')
  }

  return newDate.format('YYYY-M')
}

export { build, previous, next }
