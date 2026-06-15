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
    - [Broken Link Checker](#broken-link-checker)

## What is CKB

Nervos CKB is a public permissionless blockchain and the layer 1 of Nervos.

CKB generates trust and extends this trust to upper layers, making Nervos a trust network. It's also the value store of the Nervos network, providing public, secure and censorship-resistant custody services for assets, identities and other common knowledge created in the network. We will also vigorously develop the developer community and aim to offer blockchain developers exciting new capabilities.

If you run into an issue on our documentation website you can contact us on [Nervos talk](https://talk.nervos.org/) or [Discord](https://discord.gg/AqGTUE9).

## Contributing

### Branches

- production branch: [master](https://github.com/nervosnetwork/docs.nervos.org/tree/master)
- latest developing branch: [develop](https://github.com/nervosnetwork/docs.nervos.org/tree/develop)
  - Live Preview: [https://nervos-ckb-docs-git-develop-cryptape.vercel.app/](https://nervos-ckb-docs-git-develop-cryptape.vercel.app/)

### Code structure

- `website`: The doc site is built with [docusaurus](https://docusaurus.io/) and under the `website` folder.
- `examples`: The `examples` folder contains full tutorial codes you can clone.

### Release

Production release should be on the master branch.

Please follow the steps below:

1. Create a new PR that bumps the version in the `package.json` under `/website`
2. Merge the PR on `develop` branch
3. Create a new PR from `develop` that targeting on the `master` branch
4. Obtain at least one approval before merging the PR into `master` branch
5. Merge the PR into `master` branch using **regular merge only**; squash merge and rebase merge are not allowed
6. Create a new tag and release on github targeting on the master branch
7. The release content should include description of changes following 3 sections:
   - New Content
   - Fixes
   - Others
8. Example release content: https://github.com/nervosnetwork/docs.nervos.org/releases/tag/v2.35.0 

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

###  Broken Link Checker

The link checker scans for dead links and maintains a collaborative dead link registry.

**Quick Start**

1. Install [lychee](https://github.com/lycheeverse/lychee).
2. Build the website: `cd website && yarn build`.
3. Run the check: `cd website && yarn link:check`.
4. Review results: `cd website && yarn link:report`.

**Environment Variables**

Customize the check behavior with these optional environment variables:

- `GITHUB_TOKEN`: GitHub API token to increase rate limits
- `LINK_CHECK_CONCURRENCY`: Number of concurrent requests (default: 1)
- `LINK_CHECK_TIMEOUT`: Request timeout in seconds (default: 30)
- `LINK_CHECK_RETRIES`: Number of retries per URL (default: 2)
- `LINK_CHECK_ACCEPT`: Acceptable HTTP status codes (default: "200..=299,403")

Example: `GITHUB_TOKEN=your_token LINK_CHECK_CONCURRENCY=2 yarn link:check`

**Report Files**

All reports are stored in `website/reports/link-check/`:

- `summary.json`: Run statistics and metrics
- `dead-links.json`: All currently failing links with metadata
- `new-failures.json`: Links that failed but aren't in the baseline
- `recovered.json`: Previously failing links that now work
- `unresolved-known.json`: Known issues that still fail
- `known-failures.json`: Baseline of accepted failures (manual maintenance)
- `history.jsonl`: Historical run data
- `report.md`: Human-readable summary report

**Workflow**

1. **Run Check**: Execute `yarn link:check` to scan all links
2. **Review Report**: Check `report.md` for new failures and recoveries
3. **Take Action**:
   - Fix broken links in documentation
   - For unfixable external links, add to `known-failures.json` with reason
   - Remove recovered links from `known-failures.json`
4. **Commit Changes**: Include report updates and documentation fixes

**Baseline Management**

The `known-failures.json` file contains links that are expected to fail. Each entry should have:

```json
{
  "url": "https://example.com/broken",
  "expectedStatus": 404,
  "reason": "External service discontinued",
  "owner": "team-member",
  "addedAt": "2024-01-01T00:00:00.000Z"
}
```

**Only add links to baseline if:**
- The link points to an external service you don't control
- The failure is permanent (not temporary network issues)
- You've confirmed the link is truly broken

**Notes**

* A cache file `./website/.lycheecache` will be created. For local development, the cache TTL is 30 days; you can change `max_cache_age` in `website/.lychee.toml`.
* Because the docs contain many GitHub links, requests are routed via `api.github.com`. Providing a GitHub token increases the rate limit.
* The check is designed for local/manual execution; CI integration is not currently implemented.
