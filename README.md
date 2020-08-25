# docs-new

# Nervos CKB Documentation Website
This is new verison of Nervos CKB documentation website.

It is built with [docusaurus](https://docusaurus.io/).


## Clone the Repo
```bash
git clone https://github.com/nervosnetwork/docs-new.git docs && \
cd docs && \
cd website
```

## Install Dependencies
Install [yarn](https://yarnpkg.com/en/).

In `website` folder:
```bash
yarn install
```

## Preview the Site
In `website` folder:
```bash
yarn start
```

Then you should be able to preview the website at `http://localhost:3000/` in your browser.

## Docs
All the documents go into the `docs` folder.

To add a document:
* add `Basics` and `Integrate` to the folder: `docs/basics` and `docs/integrate`
* add the path of the folder to the `website/sidebars.json` file

