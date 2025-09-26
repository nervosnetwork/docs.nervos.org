# Deployment

This folder contains deployment configuration files for your CKB JavaScript VM contracts.

## Files

- **`system-scripts.json`** - System scripts configuration (auto-generated)
- **`scripts.json`** - Your deployed contract scripts (generated after deployment)

## Deploying Contracts

To deploy your contracts to the CKB blockchain, use the `offckb deploy` command:

### Deploy to Devnet

```bash
# Build your contracts first
pnpm run build

# Deploy to devnet (default)
offckb deploy --network devnet --target <contract-binary-path> --output /Users/retric/Desktop/docs.nervos.org/examples/simple-lock/deployment
```

### Deploy to Testnet

```bash
# Deploy to testnet
offckb deploy --network testnet --target <contract-binary-path> --output /Users/retric/Desktop/docs.nervos.org/examples/simple-lock/deployment
```

### Deploy to Mainnet

For better security, we recommend the mainnet deployment using [ckb-cli](https://github.com/nervosnetwork/ckb-cli)

## After Deployment

After successful deployment, the `scripts.json` file will be updated with your contract's deployment information, including:

- Contract code hash
- Hash type
- Cell dependencies
- Network-specific configurations

This information is automatically used by your devnet tests in the `tests/` folder.

## Notes

- The `system-scripts.json` file is automatically generated during project creation
- Make sure to commit both files to version control after deployment
- Always test on devnet before deploying to testnet or mainnet
- Keep your private keys secure and never commit them to version control
