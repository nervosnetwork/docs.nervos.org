---
id: run-ckb-with-docker
title: Run a CKB Mainnet Node and Testnet Node with Docker
---

We have introduced [Run a CKB Mainnet Node](mainnet.md) & [Run a CKB Testnet Node](testnet.md).If you want to run CKB node or miner process quickly for testing, it is recommended to use Docker. Before follow the instructions below, you need to [Install Docker](https://docs.docker.com/get-docker/) first.


## Run a CKB Mainnet Node

### Get CKB image

The docker container connects to mainnet by default and will run the latest release version.

```bash
docker run --rm -it nervos/ckb:latest run
```


Let me introduce [tags](https://hub.docker.com/r/nervos/ckb/tags) listed in DockerHub.

-   Tag `latest` means that the image is built from the latest master branch of ckb.
-   Tags `vx.y.z` means that the image is built from the historical release version.
-   Tags `vx.y.z-rc` means that the image is built from the preview release version.

### Mount the configuration file and Run a CKB Mainnet node

It is recommended to mount a volume at `/var/lib/ckb` in the container.There is an example to mount a volume, generate config files in the volume
and start CKB from it.

* Create a volume

```bash
docker volume create ckb-mainnet
```

* Initialize the directory with mainnet chain spec.

```bash
docker run --rm -it \
  -v ckb-mainnet:/var/lib/ckb \
  nervos/ckb:latest init --chain mainnet --force
```

* Create a container `ckb-mainnet-node` to run a node:

```bash
docker create -it \
  -v ckb-mainnet:/var/lib/ckb \
  --name ckb-mainnet-node \
  nervos/ckb:latest run
```

* Copy the generated config files from the container:

```bash
docker cp ckb-mainnet-node:/var/lib/ckb/ckb.toml .
docker cp ckb-mainnet-node:/var/lib/ckb/ckb-miner.toml .
```

* Edit the config files.
If you want to run a miner, remember to replace `[block_assembler]` section in `ckb.toml`. you can refer to [Configure the Block Assembler](http://localhost:3000/docs/basics/guides/devchain#3-configure-the-block-assembler).

* Copy back the edited config files back to container:

```bash
tar --owner=1000 --group=1000 -cf - ckb.toml ckb-miner.toml | \
  docker cp - ckb-mainnet-node:/var/lib/ckb/
```

* start the node:

```bash
docker start -i ckb-mainnet-node
```

* And start the miner in the same container

```bash
docker exec ckb-mainnet-node ckb miner
```
## Run a CKB Testnet node

### Get the CKB image
After the release of ckb v0.26.1, by modifying the environment variable `CKB_CHAIN`, you can run CKB Testnet node with default configuration，such as:

```bash
docker run -e CKB_CHAIN=testnet --rm -it nervos/ckb:latest run
```

### Mount the configuration file and Run a CKB Testnet node

* Create a volume

```bash
docker volume create ckb-testnet
```

* Initialize the directory with testnet chain spec.

```bash
docker run --rm -it \
  -v ckb-testnet:/var/lib/ckb \
  nervos/ckb:latest init --spec testnet --force
```

* Create a container `ckb-testnet-node` to run a node:

```bash
docker create -it \
  -v ckb-testnet:/var/lib/ckb \
  --name ckb-testnet-node \
  nervos/ckb:latest run
```

* Copy the generated config files from the container:

```bash
docker cp ckb-testnet-node:/var/lib/ckb/ckb.toml .
docker cp ckb-testnet-node:/var/lib/ckb/ckb-miner.toml .
```

* Edit the config files. 
If you want to run a miner, remember to replace `[block_assembler]` section in `ckb.toml`. you can refer to [Configure the Block Assembler](http://localhost:3000/docs/basics/guides/devchain#3-configure-the-block-assembler).

* Copy back the edited config files back to container:

```bash
docker cp ckb-testnet-node:/var/lib/ckb/ckb.toml .
docker cp ckb-testnet-node:/var/lib/ckb/ckb-miner.toml .
```

* start the node:

```bash
docker start -i ckb-testnet-node
```

* And start the miner in the same container

```bash
docker exec ckb-testnet-node ckb miner
```