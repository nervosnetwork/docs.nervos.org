import { ccc } from "@ckb-ccc/shell";

// Basic Usage

// Molecule Basic Types
// There is only one built-in primitive type in Molecule: byte.

// First usage: 
//  - We can use ccc.mol.Bytes to represent a byte array.
console.log(ccc.mol.Bytes.encode("0x1234567890").toString());
console.log(ccc.mol.Bytes.decode(ccc.bytesFrom([5,0,0,0,18,52,86,120,144])).toString());


// Composite Types
// array: An array consists of an item type and an unsigned integer.
console.log(ccc.mol.array(ccc.mol.Byte4, 2).encode(["0x12345678", "0x12345678"]).toString());
console.log(ccc.mol.array(ccc.mol.Byte4, 2).decode("0x1234567812345678").toString());

// struct: A struct consists of a set of named and typed fields.
console.log(ccc.mol.struct({ a: ccc.mol.Byte4, b: ccc.mol.Byte4 }).encode({ a: "0x12345678", b: "0x12345678" }).toString());
console.log(ccc.mol.struct({ a: ccc.mol.Byte4, b: ccc.mol.Byte4 }).decode(ccc.bytesFrom([18,52,86,120,18,52,86,120])));

// table: A table consists of a set of named and typed fields, same as struct.
console.log(ccc.mol.table({ a: ccc.mol.Byte4, b: ccc.mol.Byte4 }).encode({ a: "0x12345678", b: "0x12345678" }).toString());
console.log(ccc.mol.table({ a: ccc.mol.Byte4, b: ccc.mol.Byte4 }).decode(ccc.bytesFrom([20,0,0,0,12,0,0,0,16,0,0,0,18,52,86,120,18,52,86,120])));

// vector: A vector contains only one item type.
console.log(ccc.mol.vector(ccc.mol.Byte4).encode(["0x12345678", "0x12345678"]).toString());
console.log(ccc.mol.vector(ccc.mol.Byte4).decode(ccc.bytesFrom([2,0,0,0,18,52,86,120,18,52,86,120])));

// option: An option contains only an item type.
console.log(ccc.mol.option(ccc.mol.Bytes).encode("0x68656c6c6f").toString());
console.log(ccc.mol.option(ccc.mol.Bytes).decode([5,0,0,0,104,101,108,108,111]));

// union: A union contains a set of item types.
console.log(ccc.mol.union({ a: ccc.mol.Bytes, b: ccc.mol.Bytes }).encode({ type: "a", value: "0x12345678" }).toString());
console.log(ccc.mol.union({ a: ccc.mol.Bytes, b: ccc.mol.Bytes }).decode([0,0,0,0,4,0,0,0,18,52,86,120]));


// CCC built-in types
console.log(ccc.mol.Bool.decode("0x01")); // true
console.log(ccc.mol.Bool.encode(true).toString()); // 1

// All kinds of bytes
console.log(ccc.mol.Byte16.encode("0x12345678901234567890123456789012"));
console.log(ccc.mol.Byte16.decode(ccc.bytesFrom([18,52,86,120,144,18,52,86,120,144,18,52,86,120,144,18])));
console.log(ccc.mol.Byte32.encode("0x1234567890123456789012345678901212345678901234567890123456789012"));
console.log(ccc.mol.Byte32.decode(ccc.bytesFrom([18,52,86,120,144,18,52,86,120,144,18,52,86,120,144,18,18,52,86,120,144,18,52,86,120,144,18,52,86,120,144,18])));

// All kinds of numbers
console.log(ccc.mol.Uint8.encode(1).toString()); // 0x01
console.log(ccc.mol.Uint8.decode("0x01")); // 1
console.log(ccc.mol.Uint128LE.decode("0x01000000000000000000000000000000")); // 1
console.log(ccc.mol.Uint128LE.encode(1).toString()); // 0x01000000000000000000000000000000

// ... 

