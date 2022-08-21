const syncSubjectWriter = require('../syncSubjectWriter');
const fs = require('fs');

jest.mock('fs', () => ({
  writeFileSync: jest.fn()
}));

describe('#write', () => {
  test('passes a subject and data to writeFileSync', () => {
    syncSubjectWriter.write({subject: 'subject', data: {data: 'data'}});

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "subject.js", "const subject = {\"data\":\"data\"};"
    );
  });
});
