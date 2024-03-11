const { build, previous, next } = require('../dateLib')

describe('#build', () => {
  test('creates a moment class', () => {
    expect(build('2022-7-7').format('YYYY-M-D')).toEqual('2022-7-7')
  })
})

describe('#previous', () => {
  test('returns the previous day by default', () => {
    expect(previous('2022-7-7')).toEqual('2022-7-6')
  })
  test('returns the previous time unit', () => {
    expect(previous('2022-7-7', 'month')).toEqual('2022-6')
  })
})

describe('#next', () => {
  test('returns the next day by default', () => {
    expect(next('2022-7-7')).toEqual('2022-7-8')
  })
  test('returns the next time unit', () => {
    expect(next('2022-7-7', 'month')).toEqual('2022-8')
  })
})
