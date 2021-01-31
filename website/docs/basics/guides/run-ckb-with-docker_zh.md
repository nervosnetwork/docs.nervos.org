---
id: run-ckb-with-docker_zh
title: 在 Docker 中运行 CKB 主网节点和测试节点
---

前面章节我们已经介绍了如何 [运行 CKB 主网节点](mainnet_zh.md) 和 [运行 CKB 测试网节点](testnet_zh.md)。但如果你想快速运行 CKB 节点或者矿工进程进行测试，推荐使用 Docker。在进行以下步骤之前，你需要先[安装 Docker](https://docs.docker.com/get-docker/) 。


## 运行 CKB 主网节点

### 获取 CKB 镜像

docker 容器默认连接主网并运行最新版本。

```bash
docker run --rm -it nervos/ckb:latest run
```


以下介绍一下 DockerHub 上列举的一些[参数符](https://hub.docker.com/r/nervos/ckb/tags) 。

-   `latest` 表示镜像是由最新 ckb 编译而来的。
-   `vx.y.z` 表示镜像是由所指定的历史发行版编译而来的。
-   `vx.y.z-rc` 表示镜像是由所指定的历史预发行版编译而来的。

### 挂载配置文件，然后运行 CKB 主网节点

我们推荐将 `/var/lib/ckb` 目录挂载到一个数据卷上。以下是挂载一个数据卷，在数据卷上生成配置文件并用之启动 CKB 的示例。

* 创建一个数据卷 volume 

```bash
docker volume create ckb-mainnet
```

* 使用以下参数规范初始化目录

```bash
docker run --rm -it \
  -v ckb-mainnet:/var/lib/ckb \
  nervos/ckb:latest init --chain mainnet --force
```

* 创建 `ckb-mainnet-node` 容器以运行节点：

```bash
docker create -it \
  -v ckb-mainnet:/var/lib/ckb \
  --name ckb-mainnet-node \
  nervos/ckb:latest run
```

* 从容器中复制生成的配置文件：

```bash
docker cp ckb-mainnet-node:/var/lib/ckb/ckb.toml .
docker cp ckb-mainnet-node:/var/lib/ckb/ckb-miner.toml .
```

* 编辑配置文件。
  如果你想要运行一个矿工程序，记得替换 `ckb.toml`文件中的 `[block_assembler] `节段，可以参考 [配置Block Assembler](http://localhost:3000/docs/basics/guides/devchain#3-configure-the-block-assembler_zh)。

* 将编辑后的配置文件复制回容器：

```bash
tar --owner=1000 --group=1000 -cf - ckb.toml ckb-miner.toml | \
  docker cp - ckb-mainnet-node:/var/lib/ckb/
```

* 启动节点：

```bash
docker start -i ckb-mainnet-node
```

* 然后在同个容器中启动矿工程序。

```bash
docker exec ckb-mainnet-node ckb miner
```
## 运行 CKB 测试网节点

### 获取 CKB 镜像
ckb v0.26.1 之后的版本，你可以通过修改环境变量  `CKB_CHAIN`，使用默认配置运行 CKB 测试网节点。

```bash
docker run -e CKB_CHAIN=testnet --rm -it nervos/ckb:latest run
```

### 挂载配置文件，然后运行 CKB 测试网节点

* 创建一个数据卷 volume：

```bash
docker volume create ckb-testnet
```

* 使用以下测试网参数规范初始化目录：

```bash
docker run --rm -it \
  -v ckb-testnet:/var/lib/ckb \
  nervos/ckb:latest init --spec testnet --force
```

* 创建 `ckb-testnet-node` 容器以运行节点：

```bash
docker create -it \
  -v ckb-testnet:/var/lib/ckb \
  --name ckb-testnet-node \
  nervos/ckb:latest run
```

* 从容器中复制生成的配置文件：

```bash
docker cp ckb-testnet-node:/var/lib/ckb/ckb.toml .
docker cp ckb-testnet-node:/var/lib/ckb/ckb-miner.toml .
```

* 编辑配置文件。
  如果你想要运行一个矿工程序，记得替换 `ckb.toml`文件中的 `[block_assembler] `节段，可以参考 [配置Block Assembler](http://localhost:3000/docs/basics/guides/devchain#3-configure-the-block-assembler_zh)。
* 将编辑后的配置文件复制回容器：

```bash
docker cp ckb-testnet-node:/var/lib/ckb/ckb.toml .
docker cp ckb-testnet-node:/var/lib/ckb/ckb-miner.toml .
```

* 启动节点：

```bash
docker start -i ckb-testnet-node
```

* 然后在同个容器中启动矿工程序：

```bash
docker exec ckb-testnet-node ckb miner
```