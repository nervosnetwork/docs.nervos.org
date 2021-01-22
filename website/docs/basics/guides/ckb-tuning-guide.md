---
id: ckb-tuning-guide
title: CKB Tuning Guide (For Advanced Users)
---

**Please note that all features in this guide are advanced user features.
Some of them are experimental, they may be changed or disappear in the future.
And please make sure you understand these features clearly before using them.**

## Memory Usage

### Memory Usage during Initial Blockchain Download (aka IBD)

During IBD, CKB will fetch all headers before downloading the blocks.

All headers whose blocks haven't been downloaded are saved in the memory at first, but some of them will cache in the disk if the size of headers reaches a limit.

As an example, we can configure the limit by appending the follow configurations into `ckb.toml` to reduce the memory usage:

```toml
[network.header_map]
# The maximum size of data in memory (default: 300_000)
primary_limit = 3000
# Disable cache if the size of data in memory less than this threshold (default: 20_000)
backend_close_threshold = 200
```

### **[Linux Only]** Memory Allocator Tuning

CKB use [Jemalloc] as the memory allocator on Linux platform, so we can use [`MALLOC_CONF`] environment variable to tune it.

For example, run the follow command before starting CKB could reduce the memory usage in usual cases:

```bash
export MALLOC_CONF="abort_conf:true,thp:never,metadata_thp:disabled,narenas:1,tcache:false,background_thread:true,dirty_decay_ms:0,muzzy_decay_ms:0"
```

## Storage Tuning

### [RocksDB] Tuning

CKB use [RocksDB] as the storage, so we can just follow the [RocksDB Tuning Guide] to configure the CKB storage.

CKB supports loading a [RocksDB] options file directly.
So we can just create a [RocksDB] options file with optimized parameters and let CKB load it as [RocksDB] configuration.

For example, create a file named `small-memory.options` in the CKB working directory:

```ini
[DBOptions]
  max_total_wal_size=134217728
  keep_log_file_num=8

[CFOptions "default"]
  write_buffer_size=4096 # 4 KiB
  min_write_buffer_number_to_merge=1
  max_write_buffer_number=2
  max_write_buffer_size_to_maintain=-1

[TableOptions/BlockBasedTable "default"]
  no_block_cache=true

[CFOptions "0"]
  write_buffer_size=4194304 # 4 MiB
[CFOptions "1"]
  write_buffer_size=8388608 # 8 MiB
[CFOptions "2"]
  write_buffer_size=16777216 # 16 MiB
[CFOptions "3"]
  write_buffer_size=2097152 # 2 MiB
[CFOptions "4"]
  write_buffer_size=1048576 # 1 MiB
[CFOptions "5"]
  write_buffer_size=4194304 # 4 MiB
[CFOptions "6"]
  write_buffer_size=4194304 # 4 MiB
[CFOptions "7"]
  write_buffer_size=1048576 # 1 MiB
[CFOptions "8"]
  write_buffer_size=2097152 # 2 MiB
[CFOptions "9"]
  write_buffer_size=8388608 # 8 MiB
[CFOptions "10"]
  write_buffer_size=8388608 # 8 MiB
[CFOptions "11"]
  write_buffer_size=524288 # 512 KiB
```

Then update the follow configurations in `ckb.toml` to use the `small-memory.options` file:

```toml
[db]
options_file = "small-memory.options"
```

[Jemalloc]: http://jemalloc.net/
[`MALLOC_CONF`]: http://jemalloc.net/jemalloc.3.html#tuning
[RocksDB]: https://rocksdb.org/
[RocksDB Tuning Guide]: https://github.com/facebook/rocksdb/wiki/RocksDB-Tuning-Guide
