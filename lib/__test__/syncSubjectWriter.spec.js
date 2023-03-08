const { SyncSubjectWriter } = require('../syncSubjectWriter');
const fs = require('fs');

jest.mock('fs', () => ({
  writeFileSync: jest.fn()
}));

describe('#write', () => {
  describe('when file type js', () => {
    let syncSubjectWriter

    beforeEach(() => {
      syncSubjectWriter = new SyncSubjectWriter({ type: 'js' })
    })

    it('writes javascript to file <subject>.js', () => {
      syncSubjectWriter.write({ subject: 'subject', data: { data: 'data' } });
      // split this into 2 cases
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "./data/subject.js", "const subject = {\"data\":\"data\"};"
      )
    })
  })

  describe('when file type is json', () => {
    let syncSubjectWriter

    beforeEach(() => {
      syncSubjectWriter = new SyncSubjectWriter({ type: 'json' })
    })

    it('writes json file <subject>.json', () => {
      syncSubjectWriter.write({ subject: 'subject', data: { data: 'data' }, options: { type: 'json' } })

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "./data/subject.json", "{\"data\":\"data\"}"
      )
    })
  })

  describe('when no type is given', () => {
    let syncSubjectWriter

    beforeEach(() => {
      syncSubjectWriter = new SyncSubjectWriter()
    })

    it('writes json file <subject>.json', () => {
      syncSubjectWriter.write({ subject: 'subject', data: { data: 'data' }, options: { type: 'json' } })

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "./data/subject.json", "{\"data\":\"data\"}"
      )
    })
  })
});
