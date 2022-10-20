const { exportGraphData } = require('../getReleaseCandidatesPerDeploys');
const { DeployClient } = require('../../DeployClient');
const gitLogReader = require('../../gitLogReader');
const { Occurance } = require('../../Occurance');

jest.mock('../../DeployClient');
jest.mock('../../gitLogReader', () => {
  return { getCommits: jest.fn().mockResolvedValue((_dir) => candidates()) }
})

DeployClient.mockImplementation(() => {
  return { getDeploys: async () => deploys() }
});

const deploys = () => {
  return new Occurance({ createdAt: '2022-08-09T09:32:18Z' });
}
const candidates = () => {
  return new Occurance({ createdAt: '2022-08-10T09:32:18Z' });
}

const mockedWriter = { write: jest.fn() };

describe('exportGraphData', () => {
  it('writes to a file releaseCandidatesPerDeploys.js', () => {
    exportGraphData('', new DeployClient(), mockedWriter);
    writerParams = mockedWriter.write.mock.calls[0][0]
    expect(writerParams.subject).toBe('releaseCandidatesPerDeploys');
  });

  it('writes proper structure', () => {
    exportGraphData('', new DeployClient(), mockedWriter);
    writerParams = mockedWriter.write.mock.calls[0][0]
    expect(Object.keys(writerParams.data)[0]).toBe('2022-8-1');
  });
});
