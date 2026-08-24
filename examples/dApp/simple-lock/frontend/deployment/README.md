# Frontend Deployment Artifacts

The frontend reads network-specific contract and system-script information from this directory.

Do not edit these JSON files manually. The root deploy command validates the contract and `ckb-js-vm` entries and copies both deployment files here after a successful Devnet or Testnet deployment. Current OffCKB Mainnet exports do not contain `ckb-js-vm`, so a complete Mainnet artifact cannot be synchronized.

If the page reports a stale OutPoint, redeploy for the active network, confirm both files match their counterparts in `../../deployment/`, and restart the frontend.
