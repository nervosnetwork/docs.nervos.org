# Nervos CKB Documentation Website

- [Nervos CKB Documentation Website](#nervos-ckb-documentation-website)
	- [What is CKB](#what-is-ckb)
	- [How to build on top of it](#how-to-build-on-top-of-it)
	- [Contributing](#contributing)
		- [Branches](#branches)
		- [Code structure](#code-structure)
		- [Develop](#develop)
			- [Clone the Repo](#clone-the-repo)
			- [Install Dependencies](#install-dependencies)
			- [Run the website](#run-the-website)
			- [Build for deployment](#build-for-deployment)

## What is CKB

*TODO: write some words to introduce CKB*

## How to build on top of it

*TODO: write some words to introduce how to use doc sites*

## Contributing

### Branches

- production branch: [develop](https://github.com/nervosnetwork/docs.nervos.org/tree/develop)
- current developing branch: [v2](https://github.com/nervosnetwork/docs.nervos.org/tree/v2)
- old version developing branch: [v1](https://github.com/nervosnetwork/docs.nervos.org/tree/v1)

### Code structure

```bash
├── LICENSE
├── README.md
├── examples
└── website
    ├── build
    ├── docs
    ├── docusaurus.config.js
    ├── node_modules
    ├── package.json
    ├── sidebars.js
    ├── src
    ├── static
    ├── tsconfig.json
    └── yarn.lock
```

- `website`: The doc site is built with [docusaurus](https://docusaurus.io/) and under the `website` folder.
- `examples`: The `examples` folder contains full tutorial codes you can clone.

### Develop

#### Clone the Repo

```bash
git clone https://github.com/nervosnetwork/docs.nervos.org.git
cd docs.nervos.org
cd website
```

#### Install Dependencies

Install [yarn](https://yarnpkg.com/en/).

In `website` folder:

```bash
yarn install
```

#### Run the website

In `website` folder:

```bash
yarn start
```

```bash
[INFO] Starting the development server...
[SUCCESS] Docusaurus website is running at: http://localhost:3000/
```

You can check out the website at http://localhost:3000/ in your browser now.

#### Build for deployment

In `website` folder:

```bash
yarn build
```
