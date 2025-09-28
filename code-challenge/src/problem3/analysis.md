# Code Analysis: Computational Inefficiencies and Anti-patterns

## Issues Identified

### 1. **Critical Logic Error in Filter Condition**
```typescript
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {  // ❌ Should be balancePriority
```
- **Issue**: Uses undefined variable `lhsPriority` instead of `balancePriority`
- **Impact**: Runtime error or unexpected behavior
- **Fix**: Use `balancePriority > -99`

### 2. **Incorrect Filter Logic**
```typescript
if (balance.amount <= 0) {
  return true;  // ❌ Returns true for zero/negative amounts
}
return false
```
- **Issue**: Filter keeps zero/negative balances instead of filtering them out
- **Impact**: Shows empty or negative balances in UI
- **Fix**: Return `balance.amount > 0`

### 3. **Missing Dependency in useMemo**
```typescript
const sortedBalances = useMemo(() => {
  // ... filtering and sorting logic
}, [balances, prices]);  // ❌ prices not used in the logic
```
- **Issue**: `prices` dependency is unnecessary and causes unnecessary re-computations
- **Impact**: Performance degradation
- **Fix**: Remove `prices` from dependency array

### 4. **Inefficient Re-computation**
```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed()
  }
})
```
- **Issue**: Creates new array on every render without memoization
- **Impact**: Unnecessary re-renders and memory allocation
- **Fix**: Wrap in `useMemo`

### 5. **Unnecessary Array Creation**
```typescript
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  // ...
})
```
- **Issue**: Creates new array on every render, uses `index` as key
- **Impact**: Poor performance, potential React reconciliation issues
- **Fix**: Memoize and use stable keys

### 6. **Type Inconsistency**
```typescript
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  // sortedBalances is WalletBalance[], not FormattedWalletBalance[]
```
- **Issue**: Type mismatch between `sortedBalances` and `formattedBalances`
- **Impact**: TypeScript errors, runtime issues
- **Fix**: Use correct types consistently

### 7. **Missing Error Handling**
- **Issue**: No error handling for `useWalletBalances()` or `usePrices()`
- **Impact**: App crashes if hooks fail
- **Fix**: Add error boundaries and fallbacks

### 8. **Inefficient Priority Calculation**
```typescript
const getPriority = (blockchain: any): number => {
  // Called multiple times for same blockchain
}
```
- **Issue**: Function called repeatedly for same values
- **Impact**: Unnecessary computation
- **Fix**: Memoize or use Map for O(1) lookup

### 9. **Poor Key Usage**
```typescript
key={index}  // ❌ Using array index as key
```
- **Issue**: Index-based keys cause React reconciliation problems
- **Impact**: Incorrect re-renders, state loss
- **Fix**: Use unique, stable keys like `balance.currency`

### 10. **Unused Interface**
```typescript
interface FormattedWalletBalance {
  // Defined but not properly used
}
```
- **Issue**: Interface defined but not consistently applied
- **Impact**: Code confusion, type safety issues
- **Fix**: Use consistently or remove

## Performance Impact Summary

1. **O(n²) complexity** due to repeated priority calculations
2. **Unnecessary re-renders** from missing memoization
3. **Memory leaks** from creating new arrays on every render
4. **Type safety issues** leading to runtime errors
5. **Poor React reconciliation** from index-based keys

## Recommended Improvements

1. Fix logic errors and type inconsistencies
2. Add proper memoization for expensive operations
3. Use stable keys for React elements
4. Implement error handling
5. Optimize priority calculation with caching
6. Add proper TypeScript types
7. Consider using `useCallback` for event handlers
