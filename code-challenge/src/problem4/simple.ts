// Problem 4: Three Unique Implementations of sum_to_n
// Simple and direct approach

// Implementation A: Iterative Loop
function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Implementation B: Mathematical Formula (Gauss)
function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}

// Implementation C: Recursive
function sum_to_n_c(n: number): number {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
}

// Test the functions
console.log("Testing sum_to_n functions:");
console.log("sum_to_n_a(5) =", sum_to_n_a(5)); // 15
console.log("sum_to_n_b(5) =", sum_to_n_b(5)); // 15  
console.log("sum_to_n_c(5) =", sum_to_n_c(5)); // 15

// Complexity Analysis:
console.log("\nComplexity Analysis:");
console.log("A (Iterative): Time O(n), Space O(1)");
console.log("B (Formula):   Time O(1), Space O(1) - BEST");
console.log("C (Recursive): Time O(n), Space O(n)");
