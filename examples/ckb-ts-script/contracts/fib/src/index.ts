import * as bindings from "@ckb-js-std/bindings";

function fib(n: number): number {
  if (n <= 0) return 0;
  else if (n == 1) return 1;
  else return fib(n - 1) + fib(n - 2);
}

function main(): number {
  console.log("testing fib");

  var value = fib(10);
  console.assert(value == 55, "fib(10) = 55");
  return 0;
}

bindings.exit(main());
