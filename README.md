# Nervos CKB Documentation Website

- [Nervos CKB Documentation Website](#nervos-ckb-documentation-website)
  - [What is CKB](#what-is-ckb)
  - [Contributing](#contributing)
    - [Branches](#branches)
    - [Code structure](#code-structure)
    - [Develop](#develop)
      - [Clone the Repo](#clone-the-repo)
      - [Install Dependencies](#install-dependencies)
      - [Run the website](#run-the-website)
      - [Build for deployment](#build-for-deployment)
      - [Maintain key-terms.json file](#maintain-key-termsjson-file)

## What is CKB

Nervos CKB is a public permissionless blockchain and the layer 1 of Nervos.

CKB generates trust and extends this trust to upper layers, making Nervos a trust network. It's also the value store of the Nervos network, providing public, secure and censorship-resistant custody services for assets, identities and other common knowledge created in the network. We will also vigorously develop the developer community and aim to offer blockchain developers exciting new capabilities.

If you run into an issue on our documentation website you can contact us on [Nervos talk](https://talk.nervos.org/) or [Discord](https://discord.gg/AqGTUE9).

## Contributing

### Branches

- production branch: [master](https://github.com/nervosnetwork/docs.nervos.org/tree/master)
- latest developing branch: [develop](https://github.com/nervosnetwork/docs.nervos.org/tree/develop)

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

#### Maintain key-terms.json file
The `key-terms.json` file is generated from the glossary in the `docs/tech-explanation/glossary.md` file. This file is used by the Tooltip component to provide definitions and links to key terms throughout the documentation.

Once you have updates in `glossary.md`, please remember to run the following command in the `website` folder to re-generate the `key-terms.json` file:

```bash
yarn gen-terms
```

After running the command, you can navigate to `src/components/Tooltip` to verify that the `key-terms.json` file has been generated successfully.
