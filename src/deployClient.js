const { Octokit } = require('octokit');
const { Deploy } = require('./deploy');

class DeployClient {
  constructor({ authToken, repo, repoOwner }) {
    this.repoOwner = repoOwner;
    this.repo = repo;

    this.client = new Octokit({
      auth: authToken
    });
  }

  async #getPage(page) {
    // https://docs.github.com/en/rest/deployments/deployments#list-deployments
    const request = `GET /repos/${this.repoOwner}/${this.repo}/deployments`
    const params = {
      owner: this.repoOwner,
      repo: this.repo,
      environment: 'production',
      per_page: 100,
      page: page
    };

    const results = await this.client.request(request, params);

    if (results.status !== 200) {
      console.log({ request, params });
      process.exit();
    }

    return results.data;
  }

  // returns Array<Deploy>
  async getDeploys() {
    let pagePromises = [];
    for (let i = 0; i < 20; i++) {
      pagePromises.push(this.#getPage(i));
    }

    const pages = await Promise.all(pagePromises);

    return pages.flat().map((params) => new Deploy(params));
  }
}

module.exports = {
  DeployClient
};

