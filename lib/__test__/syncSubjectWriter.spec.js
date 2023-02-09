const syncSubjectWriter = require('../syncSubjectWriter');
const fs = require('fs');

jest.mock('fs', () => ({
  writeFileSync: jest.fn()
}));

describe('#write', () => {
  describe('when file type js', () => {
    it('writes javascript to file <subject>.js', () => {
      syncSubjectWriter.write({ subject: 'subject', data: { data: 'data' }, opts: { type: 'js' } });
      // split this into 2 cases
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "./data/subject.js", "const subject = {\"data\":\"data\"};"
      )
    })
  })

  describe('when file type unknown', () => {
    it('throws exception', () => {
      let error
      try {
        syncSubjectWriter.write({ subject: 'subject', data: { data: 'data' } });
      } catch (e) {
        error = e
      }
      expect(error.message).toEqual('You should try harder')
    })
  })

  describe('when file type is json', () => {
    it('writes json file <subject>.json', () => {
      syncSubjectWriter.write({ subject: 'subject', data: { data: 'data' }, options: { type: 'json' } })

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "./data/subject.json", "{\"data\":\"data\"}"
      )
    })
  })
});
