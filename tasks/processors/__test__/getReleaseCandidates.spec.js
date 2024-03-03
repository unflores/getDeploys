import { makeDayCountsCumulative, releaseCandidatesPerDay, ReleaseCandidateProcessor } from '../getReleaseCandidates'
import { Occurance } from '../../Occurance'
import { GitLogReader } from '../../gitLogReader';

describe('ReleaseCandidateProcessor', () => {
  describe('#buildOccurances', () => {

    const mockedWriter = { write: jest.fn() };

    it('writes to a file releaseCandidates.js', async () => {
      const processor = new ReleaseCandidateProcessor(new GitLogReader('someDirectory'), mockedWriter)
      processor.buildOccurances()

      const writerParams = mockedWriter.write.mock.calls[0][0]
      expect(writerParams.subject).toBe('releaseCandidatesPerDeploys');
    });
  })
})

describe('getReleaseCandidates', () => {
  describe('#makeDayCountsCumulative', () => {
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

  describe('#releaseCandidatesPerDay', () => {
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
});
