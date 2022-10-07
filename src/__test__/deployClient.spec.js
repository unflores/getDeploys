const { Octokit } = require('octokit');
jest.mock('octokit');
const request = async (_path, _params) => ({ status: 200, data: { created_at: '2022-08-09T09:32:18Z' } });

Octokit.mockImplementation(() => {
  return { request: request };
});

const { DeployClient } = require('../deployClient');

describe('DeployClient', () => {
  describe('#getDeploys', () => {
    it('returns results for each fetch', async () => {
      const client = new DeployClient({ authToken: null, repo: 'repo', repoOwner: 'me' });
      const deploys = await client.getDeploys();
      // This is stupid, I don't know how to go all
      // the way back to our first deploy, but 20 pages back is enough for now.
      //
      // Since I'm fetching with promises and then processing everything
      // I don't know how much to fetch
      // Since I am mocking the data each fetch has a response
      // Hence 20 responses
      expect(deploys.length).toBe(20);
    });

    it('returns proper format', async () => {
      const client = new DeployClient({ authToken: null, repo: 'repo', repoOwner: 'me' });
      const deploys = await client.getDeploys();

      expect(deploys[0].createdAt).toBe('2022-08-09T09:32:18Z');
    })
  })
});

