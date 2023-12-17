const { exportGraphData, releaseCandidatesPerDeploys } = require('../getReleaseCandidatesPerDeploys');
const { DeployClient } = require('../../DeployClient');
const gitLogReader = require('../../gitLogReader');
const { Occurance } = require('../../Occurance');

jest.mock('../../DeployClient');
jest.mock('../../gitLogReader', () => {
  const { Occurance: mockOccurance } = require('../../Occurance');
  const candidates = [new mockOccurance({ createdAt: '2022-08-10T09:32:18Z' })];

  return { getCommits: jest.fn().mockResolvedValue(candidates) }
})

DeployClient.mockImplementation(() => {
  return { getDeploys: async () => deploys() }
});

const deploys = () => {
  return [new Occurance({ createdAt: '2022-08-09T09:32:18Z' })];
}

const mockedWriter = { write: jest.fn() };

describe('exportGraphData', () => {
  it('writes to a file releaseCandidatesPerDeploys.js', async () => {
    await exportGraphData('someDirectory', new DeployClient(), mockedWriter);
    const writerParams = mockedWriter.write.mock.calls[0][0]
    expect(writerParams.subject).toBe('releaseCandidatesPerDeploys');
  });

  it('writes proper structure', async () => {
    await exportGraphData('someDirectory', new DeployClient(), mockedWriter);
    const writerParams = mockedWriter.write.mock.calls[0][0]

    expect(writerParams.data[0][0]).toBe('2022-8');
  });
});

describe('releaseCandidatesPerDeploys', () => {
  it('returns the mean of commits per deploys for a month', () => {
    expect(releaseCandidatesPerDeploys(
      [
        new Occurance({ createdAt: '2022-07-29T09:32:18Z' }),
        new Occurance({ createdAt: '2022-08-01T09:32:18Z' }),
        new Occurance({ createdAt: '2022-08-01T09:32:18Z' }),
      ],
      [
        new Occurance({ createdAt: '2022-08-05T09:32:18Z' })
      ],
      '2022-9'
    )).toEqual([['2022-8', 2]])
  });

  describe('when no deploys for a month', () => {
    it('returns 0', () => {
      expect(releaseCandidatesPerDeploys(
        [
          new Occurance({ createdAt: '2022-07-29T09:32:18Z' })
        ],
        [
          new Occurance({ createdAt: '2022-07-05T09:32:18Z' })
        ],
        '2022-9'
      )).toEqual([['2022-7', 1], ['2022-8', 0]])
    })
  })

  describe('when multiple deploys', () => {
    it('starts with the first', () => {
      expect(releaseCandidatesPerDeploys(
        [
          new Occurance({ createdAt: '2022-08-29T09:32:18Z' }),
          new Occurance({ createdAt: '2022-07-29T09:32:18Z' })
        ],
        [
          new Occurance({ createdAt: '2022-08-05T09:32:18Z' }),
          new Occurance({ createdAt: '2022-07-05T09:32:18Z' })
        ],
        '2022-9'
      )).toEqual([['2022-7', 1], ['2022-8', 1]])
    })
  });
  describe('when NO deploys', () => {
    it('returns empty Array', () => {
      expect(releaseCandidatesPerDeploys(
        [
          new Occurance({ createdAt: '2022-07-29T09:32:18Z' })
        ],
        [],
        '2022-9'
      )).toEqual([])
    })
  })
});
