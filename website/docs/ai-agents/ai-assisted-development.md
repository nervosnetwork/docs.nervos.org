---
id: ai-assisted-script-development
title: AI-Assisted CKB Script Development and Debugging
description: Use project-level instructions to guide AI coding agents through developing, testing, and debugging CKB Scripts.
---

# AI-Assisted CKB Script Development and Debugging

This guide explains how to use project-provided instructions to help AI coding agents develop and troubleshoot CKB Scripts. Here, “agent support” means that a project provides agent-readable documentation, such as an `AGENTS.md` file or a user guide. It does not mean that the project includes a purpose-built agent.

## Development and Debugging Workflow

During development and troubleshooting, work through the following layers in order:

`ckb-script-templates` (create and manage the project) → `ckb-debugger` (debug Script execution) → `ckb-vm` (investigate lower-level behavior)

Usually, you only need the repository relevant to the current stage. Move to the next layer only when the available information cannot explain the issue.

### 1. Create and Manage Projects with `ckb-script-templates`

Use `ckb-script-templates` to create or manage a CKB Script project. For detailed instructions, see [Rust Quick Start](/docs/script/rust/rust-quick-start).

Projects generated from the template include an [`AGENTS.md` file with CKB Script-specific instructions](https://github.com/nervosnetwork/ckb-script-templates/blob/main/workspace/AGENTS.md). Start the coding agent from the project root, then provide the business rules and the transaction scenarios that the Script should accept or reject. The agent can then help implement the Script, add tests, and run the project's checks.

### 2. Debug with `ckb-debugger`

If the code and test output alone do not reveal the cause, give the agent the error messages, logs, or an exported transaction file, and ask it to read the [CKB Debugger User Guide](https://github.com/nervosnetwork/ckb-standalone-debugger/blob/develop/ckb-debugger/guide.md) first. The agent can help construct debugging commands, identify the target Script Group, and interpret exit codes, logs, and cycle consumption. For detailed usage, see [Debug Scripts](/docs/script/debug-script).

### 3. Consult `ckb-vm` When Necessary

Consult `ckb-vm` only when the debugging results may depend on the CKB-VM version, instruction support, cycle accounting, or differences between interpreters. Ask the agent to read the repository's [`AGENTS.md`](https://github.com/nervosnetwork/ckb-vm/blob/develop/AGENTS.md) first, then verify its conclusions against the relevant source code and tests.

## Usage Guidelines

- Start the agent from the project root so that it can discover and apply the project-level instructions.
- If a user guide is outside the current project, give the agent an explicit link or file and ask it to read the guide before investigating the issue.
- Provide only the code, transactions, and logs needed for the current stage; there is no need to load all three repositories into context at once.
- Unless the task specifically involves modifying CKB-VM, treat `ckb-vm` as a read-only reference.

:::caution
An agent is not a substitute for testing, code review, or security audits. Any Script that safeguards assets still requires an independent audit proportionate to its risk.
:::
