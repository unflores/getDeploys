const { writeFileSync } = require('fs');

function write({ subject, data }) {
  writeFileSync(`./data/${subject}.js`, `const ${subject} = ` + JSON.stringify(data) + ';');
}

module.exports = {
  write: write
};
