import {describe, it, expect, jest, beforeEach} from '@jest/globals'

type RequestResponse = {
  status: number
  data: [{ created_at: string }]
}

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn(() => ({
    request: jest.fn<() => Promise<RequestResponse>>().mockResolvedValue({ status: 200, data: [{ created_at: '2022-08-09T09:32:18Z' }] })
  }))
}))

import { createDeployGraphData, createDeploys } from '../getDeploys'
import { DeployClient } from '../../DeployClient'

const mockedWriter = { write: jest.fn() }

type WriterParams = {subject: string; data: any}
const fakeParams = {repo: 'fake', repoOwner: 'fake', authToken: 'fake'}
describe('getDeploys', () => {

  beforeEach(() => {
    mockedWriter.write.mockClear()
  })

  describe('#createDeployGraphData', () => {
    it('writes to a file called deploys', async () => {
      await createDeployGraphData(new DeployClient(fakeParams), mockedWriter)
      const writerParams = mockedWriter.write.mock.calls[0][0] as WriterParams
      expect(writerParams.subject).toBe('deploys')
    })

    it('writes to a file called deploys', async () => {
      await createDeployGraphData(new DeployClient(fakeParams), mockedWriter)
      // This is stupid, I don't know how to go all
      // the way back to our first deploy, but 20 pages back is enough for now.
      //
      // Since I'm fetching with promises and then processing everything
      // I don't know how much to fetch
      // Since I am mocking the data each fetch has a response
      // Hence 20 responses
      const writerParams = mockedWriter.write.mock.calls[0][0] as WriterParams

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(writerParams.data['2022-8']).toBe(20)
    })
  })

  describe('#createDeploys', () => {
    it('writes to a file called deploys', async () => {
      await createDeploys(new DeployClient(fakeParams), mockedWriter)
      const writerParams = mockedWriter.write.mock.calls[0][0] as WriterParams
      expect(writerParams.subject).toBe('deploys')
    })

    it('writes to a file called deploys', async () => {
      await createDeploys(new DeployClient(fakeParams), mockedWriter)

      const writerParams = mockedWriter.write.mock.calls[0][0] as WriterParams
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(writerParams.data[0]).toBe('2022-08-09T09:32:18Z')
    })
  })
})
