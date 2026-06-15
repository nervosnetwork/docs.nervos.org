---
id: ai-resource
title: AI Resources
---

import LlmFileActions from "@components/LlmFileActions";

# AI Resources

Use these resources when you want an AI assistant or coding agent to answer questions with the current Nervos CKB documentation as context.

## Access LLM Files

These files make the CKB docs easier to use with AI tools, long-context models, and retrieval systems.

| File            | Description                                                                                                                              | Actions                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `llms.txt`      | A concise map of the official docs with recommended entry points and CKB-specific answer guardrails.                                     | <LlmFileActions path="/llms.txt" filename="llms.txt" />           |
| `llms-full.txt` | The full documentation corpus converted from docs source files into cleaner Markdown for long-context models, RAG, and offline indexing. | <LlmFileActions path="/llms-full.txt" filename="llms-full.txt" /> |

## Starter Prompts

Copy one of these prompts into your AI coding agent to start a common CKB development task.

<details>
<summary><strong>Build a Wallet Transfer dApp</strong></summary>

Create a minimal frontend dApp for wallet connection, CKB transfer, signing, sending, and transaction status.

```markdown
Help me build a minimal CKB wallet transfer dApp with a frontend UI.

Use official CKB docs as the source of truth:

- https://docs.nervos.org/llms.txt
- https://docs.nervos.org/llms-full.txt
- https://docs.nervos.org/docs/sdk-and-devtool/ccc
- https://docs.nervos.org/docs/integrate-wallets/ccc-wallet

The dApp should include:

- a wallet connect button
- the connected CKB address
- available balance or usable Cells
- recipient address input
- CKB amount input
- send button
- transaction status display
- error and loading states

Use CCC and React wallet connection patterns where appropriate. Build the transfer by selecting Cells, creating outputs, requesting the wallet signature, sending the transaction, and tracking confirmation.

Explain capacity, fees, witnesses, signing, and transaction status where they matter. Do not use an account-model design; model the transfer with Cells, inputs, outputs, and witnesses.
```

</details>

<details>
<summary><strong>Write, Test, and Deploy a CKB Script</strong></summary>

Design a Lock Script or Type Script, test it, and choose the right deployment path for local devnet, Testnet, or Mainnet.

```markdown
Help me write, test, and deploy a CKB on-chain Script.

Use official CKB docs as the source of truth:

- https://docs.nervos.org/llms.txt
- https://docs.nervos.org/llms-full.txt
- https://docs.nervos.org/docs/script/intro-to-script
- https://docs.nervos.org/docs/script/script-testing-guide

First clarify:

- whether this is a Lock Script or Type Script
- whether the target is local devnet, Testnet, or Mainnet
- whether upgradeability is required
- what transaction shape should pass or fail

Prefer Rust with `ckb-std`, maintained templates for scaffolding, `ckb-testtool` for tests, and OffCKB for local/devnet deployment when suitable.

For Testnet/Mainnet, verify RPC endpoint, network config, CellDeps, Type ID or deployment strategy, and generated deployment artifacts before writing code. Include success and failure tests before treating the Script as ready.
```

</details>

## Agent Instructions

Copy these instructions into your AI agent or project-level instruction file, such as `AGENTS.md`, `CLAUDE.md`, Cursor Rules, or a custom instructions field, so it uses official CKB docs as its source of truth.

```markdown
For CKB-related work, prefer official CKB documentation over model memory.

Start with:

- `https://docs.nervos.org/llms.txt`
- `https://docs.nervos.org/llms-full.txt`
- `https://ckb-ai.ckbdev.com/`

Treat official docs and LLM files as the source of truth. CKB AI MCP is useful for discovery, examples, Cell queries, RPC usage, debugging, and guidance, but it is still in active development. Verify important or version-sensitive answers against official docs, source repos, RFCs, or release notes.

CKB uses the Cell Model, not an account model. Transactions consume live Cells and create new Cells. State changes happen through Cell replacement. Lock Scripts control spending; Type Scripts validate state rules; Scripts run in CKB-VM.

Before coding, determine whether the task is dApp integration, Script/smart contract development, or node/RPC work, then use the relevant official docs, maintained templates, and tooling.

Choose defaults based on the scenario:

- For on-chain Scripts, prefer Rust with `ckb-std`. Use C with `ckb-c-stdlib` only for low-level or legacy C workflows. Use JS with `ckb-js-vm` only when the task explicitly targets the JS VM and the target network supports it.
- For dApps, prefer CCC. Use `@ckb-ccc/shell` for general TypeScript transaction work and `@ckb-ccc/connector-react` for React wallet connection flows.
- For project scaffolding, prefer maintained `ckb-script-templates`. Use manual setup only when the template does not fit the task.
- For Script unit tests, prefer `ckb-testtool`. Use `ckb-debugger` CLI to reproduce VM execution, inspect failures, or debug exported transactions.
- For debugging, prefer `ckb-debugger` with GDB when step-through inspection is needed. Use `ckb_debug!` or debug prints for quick runtime traces.
- For local development, prefer OffCKB. Use a manually configured CKB node when the task depends on node behavior, RPC behavior, networking, or custom chain configuration.
- For Script deployment, prefer Type ID when upgradeability is required. Use direct data deployment only for immutable Scripts, simple examples, or cases where upgradeability is intentionally not needed.
- For serialization, use Molecule.
- For payment channels or high-frequency off-chain payments, consider Fiber Network (`fnn`).

For Script/smart contract testing, find `script/script-testing-guide.md` in `llms-full.txt` and use it as the testing source of truth. Include both success and failure cases before treating generated Scripts as ready.

Use maintained CLI tools and templates to bootstrap projects. Do not hand-generate boilerplate when a maintained tool exists.

Do not guess version-sensitive behavior, including CKB node behavior, VM behavior, RPC schemas, SDK APIs, syscalls, deployed Scripts, network behavior, or OffCKB behavior. Verify before coding.
```

## Agent Skills

[CKB Dev Skills](https://github.com/joii2020/ckb-dev-skills/tree/dev.v0.1-2) packages CKB-specific development guidance into an agent skill. It helps agents choose the right workflow for dApp integration, Script development, Cell/transaction modeling, testing, debugging, and deployment.

:::caution
CKB Dev Skills is still under active development. Use it as guidance, and verify version-sensitive behavior, generated code, deployment details, and security-sensitive decisions against official docs, source repos, RFCs, or release notes.
:::

Install the skill manually from the repository.

Clone the repository:

```bash
git clone -b dev.v0.1-2 https://github.com/joii2020/ckb-dev-skills.git
```

Navigate to the repository:

```bash
cd ckb-dev-skills
```

Install globally:

```bash
./install.sh
```

To install into the current project workspace instead:

```bash
./install.sh --project
```

## Connect via CKB AI

:::warning
CKB AI is a community-built **MCP server** for Nervos CKB development. It is currently an **alpha version** under active development.
:::

Use it when your AI client supports MCP and needs access to CKB docs, RPC tools, development tools, or workflow prompts.

### Install via CLI

#### Claude Code

```bash
claude mcp add --transport http ckb-ai https://mcp.ckbdev.com/ckbai
```

#### Codex

```bash
codex mcp add ckb-ai --url https://mcp.ckbdev.com/ckbai
```

### Build Locally

Repo: https://github.com/sonami-tech/ckb-mcp

Run CKB AI locally if you want more control over the server, need a local CKB RPC connection, or want to test development changes.

```bash
# Build the server.
cargo build --release

# Run the unified server (default port 3112).
./target/release/ckb-ai-mcp --ckb-rpc http://127.0.0.1:8114

# Or run in docs-only mode (no CKB node required).
./target/release/ckb-ai-mcp --docs-only

# Development: Auto-rebuild on changes.
cargo watch -x "run -- --ckb-rpc http://127.0.0.1:8114"
```

After the local server is running, connect your AI client to the local MCP endpoint:

```bash
# Claude Code
claude mcp add --transport http ckb-ai http://localhost:3112/mcp

# Codex CLI
codex mcp add ckb-ai --url http://localhost:3112/mcp
```
