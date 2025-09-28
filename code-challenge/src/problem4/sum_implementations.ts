/**
 * Problem 4: Three Unique Implementations of sum_to_n
 * 
 * Task: Provide 3 different ways to calculate sum from 1 to n
 * Input: n - any integer (result < Number.MAX_SAFE_INTEGER)
 * Output: sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
 */

// Implementation A: Iterative Approach
function sum_to_n_a(n: number): number {
    // Handle edge cases
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Implementation B: Mathematical Formula (Gauss's Formula)
function sum_to_n_b(n: number): number {
    // Handle edge cases
    if (n <= 0) return 0;
    
    // Gauss's formula: n * (n + 1) / 2
    return (n * (n + 1)) / 2;
}

// Implementation C: Recursive Approach
function sum_to_n_c(n: number): number {
    // Handle edge cases
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    // Recursive case: n + sum_to_n_c(n - 1)
    return n + sum_to_n_c(n - 1);
}

// Implementation D: Array Reduce (Alternative approach)
function sum_to_n_d(n: number): number {
    if (n <= 0) return 0;
    
    // Create array from 1 to n and use reduce
    return Array.from({ length: n }, (_, i) => i + 1)
                .reduce((sum, num) => sum + num, 0);
}

// Implementation E: Tail Recursive (Optimized recursion)
function sum_to_n_e(n: number, accumulator: number = 0): number {
    if (n <= 0) return accumulator;
    return sum_to_n_e(n - 1, accumulator + n);
}

// Test function to verify all implementations
function testImplementations() {
    const testCases = [0, 1, 5, 10, 100, 1000];
    
    console.log('🧪 Testing all sum_to_n implementations:\n');
    
    testCases.forEach(n => {
        const resultA = sum_to_n_a(n);
        const resultB = sum_to_n_b(n);
        const resultC = sum_to_n_c(n);
        const resultD = sum_to_n_d(n);
        const resultE = sum_to_n_e(n);
        
        console.log(`n = ${n}:`);
        console.log(`  Iterative (A): ${resultA}`);
        console.log(`  Formula (B):   ${resultB}`);
        console.log(`  Recursive (C): ${resultC}`);
        console.log(`  Array (D):     ${resultD}`);
        console.log(`  Tail Rec (E):  ${resultE}`);
        console.log(`  All match: ${resultA === resultB && resultB === resultC && resultC === resultD && resultD === resultE ? '✅' : '❌'}\n`);
    });
}

// Performance comparison
function performanceTest() {
    const n = 10000;
    const iterations = 1000;
    
    console.log(`⚡ Performance test (n=${n}, ${iterations} iterations):\n`);
    
    // Test Implementation A (Iterative)
    console.time('Iterative (A)');
    for (let i = 0; i < iterations; i++) {
        sum_to_n_a(n);
    }
    console.timeEnd('Iterative (A)');
    
    // Test Implementation B (Formula)
    console.time('Formula (B)');
    for (let i = 0; i < iterations; i++) {
        sum_to_n_b(n);
    }
    console.timeEnd('Formula (B)');
    
    // Test Implementation D (Array - C and E too slow for large n)
    console.time('Array (D)');
    for (let i = 0; i < iterations; i++) {
        sum_to_n_d(n);
    }
    console.timeEnd('Array (D)');
}

// Export functions
export {
    sum_to_n_a,
    sum_to_n_b,
    sum_to_n_c,
    sum_to_n_d,
    sum_to_n_e,
    testImplementations,
    performanceTest
};

// Run tests if this file is executed directly
testImplementations();
performanceTest();
