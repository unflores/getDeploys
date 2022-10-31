const { makeDayCountsCumulative, releaseCandidatesPerDay } = require('../getReleaseCandidates');
const { Occurance } = require('../../Occurance');
describe('makeDayCountsCumulative', () => {
  it('Adds count from previous day', () => {
    const dayCounts = { '2010-10-10': 1, '2010-10-11': 41 };

    expect(
      makeDayCountsCumulative(dayCounts)['2010-10-11']
    ).toBe(42);
  });

  it('Restarts count each month', () => {
    const dayCounts = { '2010-09-31': 1, '2010-10-1': 42 };

    expect(
      makeDayCountsCumulative(dayCounts)['2010-10-1']
    ).toBe(42);
  });

  it('Adds missing dates', () => {
    const dayCounts = { '2010-10-10': 1, '2010-10-13': 42 };
    const newCounts = makeDayCountsCumulative(dayCounts);

    expect(newCounts['2010-10-11']).toBe(1);
    expect(newCounts['2010-10-12']).toBe(1);
  });
});

describe('releaseCandidatesPerDay', () => {
  it('sets a count of 1 for one occurance', () => {
    const candidates = [
      new Occurance({ createdAt: '2022-08-09T09:32:18Z' })
    ];
    expect(releaseCandidatesPerDay(candidates)).toEqual(
      { '2022-8-9': 1 }
    );
  });

  it('sets a count of n for n occurances', () => {
    const candidates = [
      new Occurance({ createdAt: '2022-08-09T09:32:18Z' }),
      new Occurance({ createdAt: '2022-08-09T09:32:18Z' })
    ];

    expect(releaseCandidatesPerDay(candidates)).toEqual(
      { '2022-8-9': 2 }
    );
  });
});
