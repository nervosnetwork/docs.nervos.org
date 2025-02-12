import { ccc } from "@ckb-ccc/shell";
import { Buffer } from "buffer";

// Basic Usage

// Molecule Basic Types
// There is only one built-in primitive type in Molecule: byte.
console.log(ccc.mol.Bytes.encode(Buffer.from("hello")).toString());
console.log(ccc.mol.Bytes.decode(Buffer.from("68656c6c6f", "hex")).toString());

// Composite Types
// array: An array consists of an item type and an unsigned integer.
console.log(ccc.mol.array(ccc.mol.Bytes, 2).encode(["hello", "world"]).toString());
console.log(ccc.mol.array(ccc.mol.Bytes, 2).decode(Buffer.from("68656c6c6f776f726c64", "hex")).toString());

// struct: A struct consists of a set of named and typed fields.
console.log(ccc.mol.struct({ a: ccc.mol.Bytes, b: ccc.mol.Bytes }).encode({ a: "hello", b: "world" }).toString());
console.log(ccc.mol.struct({ a: ccc.mol.Bytes, b: ccc.mol.Bytes }).decode(Buffer.from("68656c6c6f776f726c64", "hex")).toString());

// vector: A vector contains only one item type.
console.log(ccc.mol.table({ a: ccc.mol.Bytes, b: ccc.mol.Bytes }).encode({ a: "hello", b: "world" }).toString());
console.log(ccc.mol.table({ a: ccc.mol.Bytes, b: ccc.mol.Bytes }).decode(Buffer.from("68656c6c6f776f726c64", "hex")).toString());

// table: A table consists of a set of named and typed fields, same as struct.
console.log(ccc.mol.vector(ccc.mol.Bytes).encode(["hello", "world"]).toString());
console.log(ccc.mol.vector(ccc.mol.Bytes).decode(Buffer.from("68656c6c6f776f726c64", "hex")).toString());

// option: An option contains only an item type.
console.log(ccc.mol.option(ccc.mol.Bytes).encode("hello").toString());
console.log(ccc.mol.option(ccc.mol.Bytes).decode(Buffer.from("68656c6c6f", "hex"))?.toString());

// union: A union contains a set of item types.
console.log(ccc.mol.union({ a: ccc.mol.Bytes, b: ccc.mol.Bytes }).encode({ type: "a", value: "hello" }).toString());
console.log(ccc.mol.union({ a: ccc.mol.Bytes, b: ccc.mol.Bytes }).decode(Buffer.from("68656c6c6f", "hex")).toString());


// CCC built-in types
console.log(ccc.mol.Bool.decode("0x01")); // true
console.log(ccc.mol.Bool.encode(true).toString()); // 1

// All kinds of bytes
console.log(ccc.mol.Byte16.encode(Buffer.from("hello")).toString());
console.log(ccc.mol.Byte16.decode("0x68656c6c6f").toString());
console.log(ccc.mol.Byte32.encode(Buffer.from("hello")).toString());
console.log(ccc.mol.Byte32.decode("0x68656c6c6f").toString());

// All kinds of numbers
console.log(ccc.mol.Uint8.encode(1).toString()); // 0x01
console.log(ccc.mol.Uint8.decode("0x01")); // 1
console.log(ccc.mol.Uint128LE.decode("0x01000000000000000000000000000000")); // 1
console.log(ccc.mol.Uint128LE.encode(1).toString()); // 0x01000000000000000000000000000000

// ... 

