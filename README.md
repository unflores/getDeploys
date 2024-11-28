## Description

This sort of grew from a situation where my company needed some metrics on our deploy rate, Change fail rate, and some other metrics, largely looking at Dora metrics. The original code was made to just put into an html file. It was intended to be adapted to a website however, the data model didn't make sense to store in a database as it was meant to be consumed directly for the client. 
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
