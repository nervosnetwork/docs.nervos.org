console.log("testing fib");
function fib(n) {
    if (n <= 0)
        return 0;
    else if (n == 1)
        return 1;
    else
        return fib(n - 1) + fib(n - 2);
};
var value = fib(10);
console.assert(value == 55, 'fib(10) = 55');
