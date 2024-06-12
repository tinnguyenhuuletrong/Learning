function fibonacci(n) {
    if (n == 1) return 0;
    if (n == 2) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const num = 45
const start = Date.now()
console.log(`Fibo: ${num} start`)
const val = fibonacci(num)
console.log(`Fibo: ${num} end - val: ${val} - ms: ${Date.now() - start}`)