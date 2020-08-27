---
id: Header--compact_target
title: Header compact_target
---

`compact_target` is the encoded form of the target threshold as it appears in the block header.

It is similar to `nBits` of bitcoin, the original `nBits` implementation inherits properties from a signed data class, allowing the target threshold to be negative if the high bit of the significand is set. This is useless—the header hash is treated as an unsigned number, so it can never be equal to or lower than a negative target threshold.

In CKB, the "compact" format is a representation of a whole number N using an unsigned 32bit number similar to a
floating-point format. 

* The most significant 8 bits are the unsigned exponent of base 256.
* This exponent can be thought of as "number of bytes of N". 
* The lower 24 bits are the mantissa. 

N = mantissa * 256^(exponent-3)

Python 3 Example and test vectors:
```python
import unittest

def compact_to_target(compact):
    exponent = compact >> 24
    mantissa = compact & 0x00ffffff
    rtn = 0
    if (exponent <= 3):
        mantissa >>= (8 * (3 - exponent))
        rtn = mantissa
    else:
        rtn = mantissa
        rtn <<= (8 * (exponent - 3))
    overflow = mantissa != 0 and (exponent > 32)
    return rtn, overflow


def target_to_compact(target):
    bits = (target).bit_length()
    exponent = ((bits + 7) // 8)
    compact = target << (
        8 * (3 - exponent)) if exponent <= 3 else (target >> (8 * (exponent - 3)))
    compact = (compact | (exponent << 24))
    return compact


class TestCompactTarget(unittest.TestCase):

    def test_compact_target1(self):
        compact = target_to_compact(0x2)
        self.assertEqual('0x1020000', hex(compact))
        target, overflow = compact_to_target(0x1020000)
        self.assertTupleEqual((2, False), (target, overflow))

    def test_compact_target2(self):
        compact = target_to_compact(0xfe)
        self.assertEqual('0x1fe0000', hex(compact))
        target, overflow = compact_to_target(0x1fedcba)
        self.assertTupleEqual((0xfe, False), (target, overflow))


if __name__ == '__main__':
    unittest.main()

```
more https://github.com/nervosnetwork/ckb/blob/develop/util/types/src/utilities/difficulty.rs#L103


