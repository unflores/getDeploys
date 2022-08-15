const { Deploy } = require('../deploy');

let params;
beforeEach(() => {
  params = {
    created_at: '2022-08-09T09:32:18Z'
  }
})

describe('#weekBucket', () => {
  test('turns a created_at into the format YYYY_M_N', () => {
    // N represents the week of the month
    const deploy = new Deploy(params)
    expect(deploy.weekBucket).toBe('2022_8_2');
  });

  test('parses the 5th week', () => {
    params.created_at = '2022-08-31T09:32:18Z';
    // N represents the week of the month
    const deploy = new Deploy(params)
    expect(deploy.weekBucket).toBe('2022_8_5');

  })
});
