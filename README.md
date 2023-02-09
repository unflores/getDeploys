## Description

When using github for deploys, this will get the stats of deploy frequency for a given repo with respect to the amount of contributers.

## Getting Started
```
git clone git@github.com:unflores/getDepoys.git
cp .env.example .env
# update .env info
cp contributers.js.example data/contributers.js # this would come from your organization
cp history.js.example data/history.js # this would come from your organization
# Install libs
npm install
npm run processor --processor=<your processor>
xdg-open './graph.html'
```


# development
```
# build
npm run build:watch
# development
npm run dev
# run tests
npm test
```


