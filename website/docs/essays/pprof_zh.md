---
id: pprof_zh
title: CKB 脚本分析小提示
---

在开始之前，请确保你理解 [cycles](basics/glossary#cycles) 概念。

在 dApps 的开发阶段，在很多地方都需要评估我们的 dApp 会消耗多少 cycles。

[ckb-vm-pprof](https://github.com/nervosnetwork/ckb-vm-pprof) 是一个剖析数据的可视化和分析工具。它可以在链下运行一个脚本然后收集运行时（runtime）数据，根据你的偏好，可以生成文本或者图形报告。

## 获取 ckb-vm-pprof

```
$ git clone https://github.com/nervosnetwork/ckb-vm-pprof
$ cd ckb-vm-pprof
$ cargo build --release
```

执行文件在 `./target/release/ckb-vm-pprof` 目录下，你可以将其复制到任意 `$PATH` 变量路径下。

## 基本使用

我们假设要测试的程序如下：

```c
int fib(int n) {
    if (n == 0 || n == 1) {
        return n;
    } else {
        return fib(n-1) + fib(n-2);
    }
}

int main() {
    if (fib(10) != 55) {
        return 1;
    }
    return 0;
}
```



在例子中使用了斐波那契函数，因为它不仅足够简单，而且还是一个递归函数。

### 使用 `-g` 选项编译

`-g` 选项在 gcc 文档中的描述如下：

```text
-g
以操作系统的原生格式（stabs、COFF、XCOFF或DWARF）生成调试信息。GDB 可以使用这些调试信息。

在大多数使用 stabs 格式的系统上，-g 可以使用只有 GDB 才能使用的额外调试信息；这个额外的信息可以使调试在 GDB 中更好地工作，但可能使其他调试器崩溃或拒绝读取程序。如果你想确定是否生成额外的信息，可以使用-gstabs+、-gstabs、-gxcoff+、-gxcoff 或 -gvms（见下文）。
```

编译的时候需要带上 -g 选项，所以编译命令是：

```sh
$ riscv64-unknown-elf-gcc -g -o fib fib.c
```

### 安装可视化包

> 如果你只需要文本报告，那你可以跳过该小节。

```sh
$ cargo install inferno
```

Inferno 是将 flamegraph 工具包的部分内容移植到 Rust 上，目的是提高原有 flamegraph 工具的性能。

### 获取 reports

我们只需要使用 ckb-vm-pprof 来运行二进制 fib：

```sh
$ ckb-vm-pprof --bin fib > flamegraph.txt

$ cat flamegraph.txt
??:?? 938
??:??; /src/ckb-vm-pprof/res/fib.c:main 24
??:??; /src/ckb-vm-pprof/res/fib.c:main; /src/ckb-vm-pprof/res/fib.c:fib 7311
```

文本报告的基本格式为 `Function0; Function1; ... FunctionN Cycles`，即调用栈和最终的 cycles。 `??:??` 是指一些不属于任何用户定义函数的代码（通常由编译器生成）。

生成图形报告更易于阅读：

```sh
$ cat flamegraph.txt | inferno-flamegraph > fib.svg
```

![fib.svg](https://raw.githubusercontent.com/nervosnetwork/ckb-vm-pprof/master/res/fib.svg)

请注意，比例过小的函数默认不会显示在火焰图上。

