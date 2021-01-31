---
id: ckb-core-dev_zh
title: CKB 开发技巧
---
[Nervos CKB](https://github.com/nervosnetwork/ckb) 是 Nervos Network 的 layer1，是一条开源免准入许可的公链。下面有一些 CKB 开发技巧，希望对你有所帮助。


## Molecule

我们已经开发了一种特殊的序列化格式： **Molecule**。建议查看其 [Github](https://github.com/nervosnetwork/molecule) 了解更多。

## 已知链哈希

命令 `ckb list-hashes` 打印当前有效链的已知的哈希值。

ckb 发布包换个源代码库中的 `docs/hashes.toml` 文件包含所有链的已知哈希值。该文件通过以下方式生成：

```
cargo run list-hashes -b > docs/hashes.toml
```

## 测试

安装依赖

```
rustup component add rustfmt
rustup component add clippy
```

测试

```
make ci
```

运行验收集成测试

```
make integration
```
---

## CKB 调试

**注意：仅支持 Linux 系统**

### 在日志中追踪内存使用情况

在  `ckb.toml` 文件中添加以下配置：

```toml
[logger]
filter = "error,ckb-memory-tracker=trace"

[memory_tracker]
# Seconds between checking the process, 0 is disable, default is 0.
interval = 600
```

### 内存分析

- 启动分析 `profiling`功能，编译 `ckb`。

  ```sh
  make build-for-profiling
  ```

  ,编译完成后，在 `target` 目录下会生成 `jeprof`  文件。

  ```sh
  find target/ -name "jeprof"
  ```

- 在  `ckb.toml` 文件中启用 RPC module `Debug` 。

  ```toml
  [rpc]
  modules = ["Debug"]
  ```

- 运行 `ckb`.

- 通过调用 RPC `jemalloc_profiling_dump` 将内存使用情况转存到文件中。

  ```sh
  curl -H 'content-type: application/json' -d '{ "id": 2, "jsonrpc": "2.0", "method": "jemalloc_profiling_dump", "params": [] }' http://localhost:8114
  ```

  之后，在运行 `ckb` 的工作目录中会生成 `ckb-jeprof.$TIMESTAMP.heap`  文件。

- 生成调用图谱的 PDF 。

  **要求**： graphviz 和 ghostscript

  ```sh
  jeprof --show_bytes --pdf target/debug/ckb ckb-jeprof.$TIMESTAMP.heap > call-graph.pdf
  ```

### 参考

- [JEMALLOC: Use Case: Leak Checking](https://github.com/jemalloc/jemalloc/wiki/Use-Case%3A-Leak-Checking)
- [JEMALLOC: Use Case: Heap Profiling](https://github.com/jemalloc/jemalloc/wiki/Use-Case%3A-Heap-Profiling)
- [RocksDB: Memory usage in RocksDB](https://github.com/facebook/rocksdb/wiki/Memory-usage-in-RocksDB)





