---
id: ckbhash
title: ckbhash
---

CKB uses [blake2b](https://blake2.net/blake2.pdf) as the default hash algorithm with following configurations:

- output digest size: 32
- personalization: ckb-default-hash

We'll use the name `ckbhash` to denote the blake2b hash with the configurations above.

Python 3 Example and test vectors:

```python
import hashlib
import unittest

def ckbhash():
    return hashlib.blake2b(digest_size=32, person=b'ckb-default-hash')

class TestCKBBlake2b(unittest.TestCase):

    def test_empty_message(self):
        hasher = ckbhash()
        hasher.update(b'')
        self.assertEqual('44f4c69744d5f8c55d642062949dcae49bc4e7ef43d388c5a12f42b5633d163e', hasher.hexdigest())

if __name__ == '__main__':
    unittest.main()
```

