const { Deploy } = require('../deploy');

let params;
beforeEach(() => {
  params = {
    created_at: '2022-08-09T09:32:18Z'
  }
})

describe('#weekBucket', () => {
  test('turns a created_at into the format YYYY-M-N', () => {
    // N represents the week of the month
    const deploy = new Deploy(params)
    expect(deploy.weekBucket).toBe('2022-8-2');
  });

  test('parses the 5th week', () => {
    params.created_at = '2022-08-31T09:32:18Z';
    // N represents the week of the month
    const deploy = new Deploy(params)
    expect(deploy.weekBucket).toBe('2022-8-5');

  })
});

describe('#monthBucket', () => {
  test('turns a created_at into the format YYYY-M', () => {
    // N represents the week of the month
    const deploy = new Deploy(params)
    expect(deploy.monthBucket).toBe('2022-8');
  });
});
