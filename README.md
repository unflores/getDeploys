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
yarn install
yarn run processor --processor=<your processor>
xdg-open './graph.html'
```

# development

```
# build
yarn run build:watch
# development
yarn run dev
# run tests
yarn test
```

# environment

- DATA_EXPORT_FILE_TYPE - use `js` for local files and `json` for external usage
