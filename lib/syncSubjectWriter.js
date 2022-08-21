const { writeFileSync } = require('fs');

function write({subject, data}){
  writeFileSync(`${subject}.js`, `const ${subject} = ` + JSON.stringify(data) + ';');
}

module.exports = {
  write: write
};
