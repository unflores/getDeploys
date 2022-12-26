import { Octokit } from 'octokit'
import { Occurance } from './Occurance'

class DeployClient {

  repoOwner: string
  repo: string
  client: Octokit

  constructor({ authToken, repo, repoOwner }) {
    this.repoOwner = repoOwner
    this.repo = repo

    this.client = new Octokit({
      auth: authToken
    })
  }

  async #getPage(page) {
    // https://docs.github.com/en/rest/deployments/deployments#list-deployments
    const request = `GET /repos/${this.repoOwner}/${this.repo}/deployments`
    const params = {
      page,
      owner: this.repoOwner,
      repo: this.repo,
      environment: 'production',
      per_page: 100
    }

    const results = await this.client.request(request, params)

    if (results.status !== 200) {
      console.log({ request, params })
      process.exit()
    }

    return results.data
  }

  async getDeploys(): Promise<Occurance[]> {
    const pagePromises = []
    for (let i = 0; i < 20; i++) {
      pagePromises.push(this.#getPage(i))
    }

    const pages = await Promise.all(pagePromises)

    return pages.flat()
      .map((params) => ({ ...params, createdAt: params.created_at }))
      .map((params) => new Occurance(params))
  }
}

export {
  DeployClient
}
