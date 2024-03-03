import { Octokit } from '@octokit/rest'
import { Occurance } from './Occurance'
import { Processor } from './types'

type Credentials = {
  authToken: string
  repo: string
  repoOwner: string
}

// https://docs.github.com/fr/rest/deployments/deployments?apiVersion=2022-11-28#list-deployments
type DeploymentsResponse = {
  data: Deployment[]
  status: number
}
type Deployment = {
  created_at: string
}

class DeployClient implements Processor{

  repoOwner: string
  repo: string
  client: Octokit

  constructor({ authToken, repo, repoOwner}: Credentials) {
    this.repoOwner = repoOwner
    this.repo = repo

    this.client = new Octokit({
      auth: authToken
    })
  }

  async #getPage(page: number) {
    // https://docs.github.com/en/rest/deployments/deployments#list-deployments
    const request = `GET /repos/${this.repoOwner}/${this.repo}/deployments`
    const params = {
      page,
      owner: this.repoOwner,
      repo: this.repo,
      environment: 'production',
      per_page: 100
    }

    const results: DeploymentsResponse = await this.client.request(request, params)

    if (results.status !== 200) {
      console.log({ request, params })
      process.exit()
    }

    return results.data
  }

  async buildOccurances(): Promise<Occurance[]> {
    const pagePromises: Promise<Deployment[]>[] = []
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
