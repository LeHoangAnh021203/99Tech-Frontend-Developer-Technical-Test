# Problem 3: React Performance Optimization

## Task Overview
Analyze the provided React TypeScript code for computational inefficiencies and anti-patterns, then provide a refactored version.

## Files
- `analysis.md` - Detailed analysis of issues found
- `refactored.tsx` - Improved version of the code
- `README.md` - This file

## Key Issues Found

### Critical Issues
1. **Logic Error**: `lhsPriority` undefined variable
2. **Incorrect Filter**: Keeps zero/negative balances instead of filtering them
3. **Type Mismatch**: Inconsistent use of `FormattedWalletBalance`
4. **Missing Memoization**: Unnecessary re-computations

### Performance Issues
1. **O(n²) Complexity**: Repeated priority calculations
2. **Unnecessary Re-renders**: Missing `useMemo` and `useCallback`
3. **Poor React Keys**: Using array index instead of stable keys
4. **Memory Leaks**: Creating new arrays on every render

## Solutions Implemented

### 1. Fixed Logic Errors
- Corrected variable name from `lhsPriority` to `balancePriority`
- Fixed filter logic to keep only positive balances
- Removed unused `prices` dependency from `useMemo`

### 2. Performance Optimizations
- Added `useMemo` for expensive computations
- Used `useCallback` for event handlers
- Implemented stable keys using `balance.currency`
- Created single memoized computation for all operations

### 3. Type Safety Improvements
- Consistent use of TypeScript interfaces
- Proper type annotations
- Removed `any` types where possible

### 4. Code Structure Improvements
- Extracted constants for blockchain priorities
- Created utility functions for reusable logic
- Better separation of concerns

## Performance Comparison

### Before (Original Code)
- **Time Complexity**: O(n²) due to repeated priority calculations
- **Re-renders**: Every render creates new arrays
- **Memory**: Multiple unnecessary object creations
- **React Reconciliation**: Poor due to index-based keys

### After (Refactored Code)
- **Time Complexity**: O(n log n) for sorting, O(1) for priority lookup
- **Re-renders**: Only when dependencies actually change
- **Memory**: Minimal object creation with proper memoization
- **React Reconciliation**: Optimal with stable keys

## Usage

```typescript
import WalletPage from './refactored';

// Use the optimized component
<WalletPage className="wallet-container">
  {/* children */}
</WalletPage>
```

## Additional Recommendations

1. **Error Handling**: Add error boundaries and fallbacks
2. **Loading States**: Implement loading indicators
3. **Virtualization**: For large lists, consider react-window
4. **Testing**: Add unit tests for utility functions
5. **Accessibility**: Add proper ARIA labels and keyboard navigation
