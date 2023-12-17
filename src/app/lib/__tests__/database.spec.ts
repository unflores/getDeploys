import { connect, disconnect, DatabaseConnectionTimeout } from '../database'
import {describe, it, expect} from '@jest/globals'

describe('#start', () => {
  describe('bad host', () => {
    it('raises an exception', async () => {
      await expect(
        connect('mongodb://bad_host:27017', 100)
      ).rejects.toThrow(DatabaseConnectionTimeout)
      await disconnect()
    })
  })
})
