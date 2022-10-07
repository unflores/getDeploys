const { Occurance } = require('../Occurance');

let params;
beforeEach(() => {
  params = {
    createdAt: '2022-08-09T09:32:18Z'
  }
})

describe('#dayBucket', () => {
  test('turns a createdAt into the format YYYY-M-D', () => {
    const occurance = new Occurance(params)
    expect(occurance.dayBucket).toBe('2022-8-9');
  });
});

describe('#weekBucket', () => {
  test('turns a createdAt into the format YYYY-M-N', () => {
    // N represents the week of the month
    const occurance = new Occurance(params)
    expect(occurance.weekBucket).toBe('2022-8-2');
  });

  test('parses the 5th week', () => {
    params.createdAt = '2022-08-31T09:32:18Z';
    // N represents the week of the month
    const occurance = new Occurance(params)
    expect(occurance.weekBucket).toBe('2022-8-5');

  })
});

describe('#monthBucket', () => {
  test('turns a createdAt into the format YYYY-M', () => {
    // N represents the week of the month
    const occurance = new Occurance(params)
    expect(occurance.monthBucket).toBe('2022-8');
  });
});
