---
id: integrity-check_zh
title: CKB 版本的完整性检查
---

 [CKB 版本](https://github.com/nervosnetwork/ckb/releases) 中的所有二进制文件都是通过以下PGP密钥进行签名的。

| Version   | Package              | Unique ID                              | OpenPGP Key                                                                          | Fingerprint                                        |
| --------- | -------------------- | -------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------- |
| >= 0.13.0 | macOS, Linux, CentOS | Nervos Travis Builder <bot@nervos.org> | [F4631C0A](https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x4F37F694F4631C0A) | 64B7 05B5 6078 1FC5 4047  7B82 4F37 F694 F463 1C0A |
| >= 0.14.0 | Windows              | Nervos Azure Builder <bot@nervos.org>  | [AD748F26](https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x5EBA64ECAD748F26) | 0849 A2D2 4CA7 CFFC FA80  BCD4 5EBA 64EC AD74 8F26 |

你可以从密钥服务器网络中导入公钥。

```
gpg --recv-keys 4F37F694F4631C0A 5EBA64ECAD748F26
```

一旦你已经导入了公钥，请下载存档和文件来验证签名。例如，要检查 
`ckb_v0.13.0_x86_64-apple-darwin.zip `文件的签名。

```
gpg --verify ckb_v0.13.0_x86_64-apple-darwin.zip.asc ckb_v0.13.0_x86_64-apple-darwin.zip
```

注意：请千万不要使用刚下载的 GnuPG 版本来检查源码的完整性，请使用现有的、可信任的 GnuPG 安装，例如，你的发行版提供的安装。

如果上述命令的输出与下面类似，说明你没有我们的公钥，或者签名是由别人生成的，所以你应该对该文件进行可疑的处理。

```
gpg: Signature made Wed 05 Jun 2019 10:12:22 PM UTC using RSA key ID F4631C0A
gpg: Can't check signature: No public key
```

如果你得到如下输出：

```
gpg: Signature made Wed 05 Jun 2019 10:12:22 PM UTC using RSA key ID F4631C0A
gpg: Good signature from "Nervos Travis Builder <bot@nervos.org>"
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 64B7 05B5 6078 1FC5 4047  7B82 4F37 F694 F463 1C0A
```

那么你有我们的密钥副本，签名也是有效的，但是你没有将密钥标记为可信的，或者密钥是伪造的。在这种情况下，你至少应该对比一下上面显示的指纹。

理想情况下，你将会得到以下结果：

```
gpg: Signature made Wed 05 Jun 2019 10:12:22 PM UTC using RSA key ID F4631C0A
gpg: checking the trustdb
gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: next trustdb check due at 2023-06-05
gpg: Good signature from "Nervos Travis Builder <bot@nervos.org>"
```

