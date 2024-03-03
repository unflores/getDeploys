const { Octokit } = require('@octokit/rest');
const { DeployClient } = require('../DeployClient');
const request = jest.fn(async (_path, _params) => ({ status: 200, data: { created_at: '2022-08-09T09:32:18Z' } }));

jest.mock('@octokit/rest');
Octokit.mockImplementation(() => {
  return { request: request };
});

describe('DeployClient', () => {
  describe('#buildOccurances', () => {
    it('returns results for each fetch', async () => {
      const client = new DeployClient({ authToken: null, repo: 'repo', repoOwner: 'me' });
      const deploys = await client.buildOccurances();
      // This is stupid, I don't know how to go all
      // the way back to our first deploy, but 20 pages back is enough for now.
      //
      // Since I'm fetching with promises and then processing everything
      // I don't know how much to fetch
      // Since I am mocking the data each fetch has a response
      // Hence 20 responses
      expect(deploys.length).toBe(20);
    });

    it('sends repo identifiers to 3rd party', async () => {
      const client = new DeployClient({ authToken: null, repo: 'repo', repoOwner: 'me' });
      await client.buildOccurances();

      expect(request.mock.calls[0][0]).toBe('GET /repos/me/repo/deployments');
    });

    it('returns Deploy objects', async () => {
      const client = new DeployClient({ authToken: null, repo: 'repo', repoOwner: 'me' });
      const deploys = await client.buildOccurances();

      expect(deploys[0].createdAt).toBe('2022-08-09T09:32:18Z');
    })
  })
});

