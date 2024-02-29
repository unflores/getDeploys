const child_process = require('child_process');
const { GitLogReader } = require('../gitLogReader');

jest.mock('child_process');

const commits =
  `69adf19_commitsep_Thu Sep 29 14:36:26 2022 +0200
   67decd4_commitsep_Wed Sep 28 21:37:37 2022 +0200
   c1cfd3b_commitsep_Wed Sep 28 09:42:29 2022 +0200
   f2fc00c_commitsep_Wed Sep 28 09:11:10 2022 +0200
  `;

child_process.exec.mockImplementation(
  (comamand, params, callback) => { callback(null, { stdout: commits, stderr: null }) }
)

describe('gitLogReader', () => {
  let reader = new GitLogReader('/some/directory')

  describe('#commits', () => {
    test('properly splits commits', async () => {
      const commits = await reader.getCommits()
      expect(commits.length).toBe(4);
    });

    test('extracts a date', async () => {
      const commits = await reader.getCommits()

      expect(commits.map((commit) => commit.createdAt)).toEqual([
        'Thu Sep 29 14:36:26 2022 +0200',
        'Wed Sep 28 21:37:37 2022 +0200',
        'Wed Sep 28 09:42:29 2022 +0200',
        'Wed Sep 28 09:11:10 2022 +0200'
      ]);
    });
  });
});
