import { connect, DatabaseConnectionTimeout } from '../database'
import {describe, it, expect} from '@jest/globals'

describe('#start', () => {
  describe('bad host', () => {
    it('raises an exception', async () => {
      await expect(
        connect('mongodb://mongo:27017', 100)
      ).rejects.toThrow(DatabaseConnectionTimeout)
    })
  })
})
