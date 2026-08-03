# Release Automation

The `Release` GitHub Actions workflow performs the complete production
release from GitHub. It keeps the repository's two pull request audit
trail and always uses regular merge commits.

## One-time setup

### 1. Create and install a GitHub App

Create an organization-owned GitHub App named `docs-release-bot` and
grant it access only to this repository.

Configure these repository permissions:

| Permission      | Access                |
| --------------- | --------------------- |
| Actions         | Read-only             |
| Checks          | Read-only             |
| Commit statuses | Read-only             |
| Contents        | Read and write        |
| Pull requests   | Read and write        |
| Metadata        | Read-only (automatic) |

The App does not need webhook events. Install it on
`nervosnetwork/docs.nervos.org`, then generate a private key.

### 2. Configure Actions credentials

In **Settings → Secrets and variables → Actions**, add:

- Repository variable `RELEASE_APP_ID`: the numeric GitHub App ID.
- Repository secret `RELEASE_APP_PRIVATE_KEY`: the complete PEM private
  key generated for the App.

The workflow requests only the permissions listed above when it creates
an installation token. The token is scoped to this repository and is
revoked when the job finishes.

### 3. Configure the production ruleset

Edit the `production` ruleset that targets `master` and the default
branch (`develop`). Add the installed GitHub App to **Bypass list** and
select **For pull requests only**.

Keep the existing rules:

- Require a pull request.
- Allow regular merge only.
- Block force pushes and deletion.

The release script uses `gh pr merge --admin` to explicitly select this
bypass after verifying the expected head commit, Node.js checks, and
Vercel. The pull-request-only mode prevents direct pushes to protected
branches. Both release PRs and merge commits remain in the audit log.
The release App must create the pull request for this bypass mode to apply.
Closed, unmerged release pull requests are ignored so a later run can create
a fresh App-authored pull request from a recreated release branch.

## Running a release

1. Open **Actions → Release**.
2. Select **Run workflow** and keep the workflow branch set to
   `develop`.
3. Choose the version increment:
   - `minor` (default): `2.49.0` → `2.50.0`
   - `patch`: `2.49.0` → `2.49.1`
   - `major`: `2.49.0` → `3.0.0`
   - `custom`: use the exact value from `custom_version`
4. Optionally enable `dry_run`.
5. Select **Run workflow**.

Dry runs validate the repository state and preview release notes without
creating branches, pull requests, tags, or releases.

## Automated sequence

For a real release, the workflow:

1. Locks the repository to one active release workflow.
2. Confirms the latest GitHub Release matches the version on `master`.
3. Confirms `develop` contains unreleased content and has not drifted.
4. Creates `release/vX.Y.Z` and changes only
   `website/package.json`.
5. Installs dependencies, checks formatting, and builds the site.
6. Creates and regular-merges the version PR into `develop`.
7. Waits for the PR checks, the `develop` push build, and Vercel.
8. Creates and regular-merges `develop` into `master`.
9. Waits for the production build and Vercel deployment.
10. Creates an exact lightweight tag on the verified merge commit.
11. Generates categorized release notes and publishes the latest GitHub
    Release.
12. Verifies the tag target and published Release.

The expected check names are `node-js` and `Vercel`. Update
`scripts/release/release.mjs` if either integration is renamed.

## Failure and recovery

The workflow stops immediately when a build or deployment fails. It
never proceeds to a later merge, tag, or Release after a failed check.

Use **Re-run all jobs** on the same workflow run after fixing a
transient failure. The workflow reuses an existing release branch or
merged release PR and resumes from the first incomplete stage. A hidden
run marker in the Release prevents a successful run from publishing
twice when it is re-run.

The workflow deliberately stops if `develop` or `master` changes during
the release. This prevents unrelated, unvalidated commits from entering
the release. Follow the error shown in the workflow summary; for a
`develop` drift error, close the generated version PR, delete its release
branch, and start a new release.

## Release note categories

Release notes always contain:

- `New Content`
- `Fixes`
- `Other`

The generator first honors these optional labels:

- `release:new-content`
- `release:fix`
- `release:other`
- `release:skip`

Without a release label, `feat:` and `docs:` PR titles become New
Content, `fix:` and similar titles become Fixes, and everything else
becomes Other.

For reader-facing wording, add an optional section to the pull request
body:

```markdown
## Release note

Added a CKB debugging guide with common troubleshooting steps.
```

The generator uses this text in the Release. When the section is blank
or absent, it falls back to the pull request title with a conventional
commit prefix such as `docs:` or `fix:` removed.

Add `release:skip` to dependency updates, CI changes, and other internal
pull requests that should remain in the Full Changelog without appearing
in a category. The generated version bump PR and the production PR
targeting `master` are excluded automatically.
