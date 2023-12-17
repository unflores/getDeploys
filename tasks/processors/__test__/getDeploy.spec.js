const { Octokit } = require('@octokit/rest');
jest.mock('@octokit/rest');
const request = async (_path, _params) => ({ status: 200, data: { created_at: '2022-08-09T09:32:18Z' } });

Octokit.mockImplementation(() => {
  return { request: request };
});

const { createDeployGraphData } = require('../getDeploys');
const { DeployClient } = require('../../DeployClient');

const mockedWriter = { write: jest.fn() };

describe('getDeploys', () => {
  it('writes to a file called deploys', async () => {
    await createDeployGraphData(new DeployClient({}), mockedWriter);
    const writerParams = mockedWriter.write.mock.calls[0][0]
    expect(writerParams.subject).toBe('deploys');
  });

  it('writes to a file called deploys', async () => {
    await createDeployGraphData(new DeployClient({}), mockedWriter);
    // This is stupid, I don't know how to go all
    // the way back to our first deploy, but 20 pages back is enough for now.
    //
    // Since I'm fetching with promises and then processing everything
    // I don't know how much to fetch
    // Since I am mocking the data each fetch has a response
    // Hence 20 responses
    const writerParams = mockedWriter.write.mock.calls[0][0]
    expect(Object.values(writerParams.data)[0]).toBe(20);
  });
});
