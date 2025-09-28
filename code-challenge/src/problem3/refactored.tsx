import React, { useMemo, useCallback } from 'react';

// Define BoxProps interface locally to avoid external dependency
interface BoxProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// Types
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {
  children?: React.ReactNode;
}

// Constants
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const DEFAULT_PRIORITY = -99;

// Custom hooks (mock implementations)
const useWalletBalances = (): WalletBalance[] => {
  // Mock implementation - replace with actual hook
  return [];
};

const usePrices = (): Record<string, number> => {
  // Mock implementation - replace with actual hook
  return {};
};

// Utility functions
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
};

const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

// Main component
const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoized priority calculation
  const balancesWithPriority = useMemo(() => {
    return balances.map(balance => ({
      ...balance,
      priority: getPriority(balance.blockchain)
    }));
  }, [balances]);

  // Memoized filtering and sorting
  const sortedBalances = useMemo(() => {
    return balancesWithPriority
      .filter(balance => {
        // Fix: Check balancePriority instead of lhsPriority
        // Fix: Return true for positive amounts (filter out zero/negative)
        return balance.priority > DEFAULT_PRIORITY && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        // Sort by priority (descending)
        return rhs.priority - lhs.priority;
      });
  }, [balancesWithPriority]);

  // Memoized formatted balances
  const formattedBalances = useMemo((): FormattedWalletBalance[] => {
    return sortedBalances.map(balance => ({
      ...balance,
      formatted: formatAmount(balance.amount)
    }));
  }, [sortedBalances]);

  // Memoized row rendering
  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      
      return (
        <WalletRow
          key={balance.currency} // Fix: Use stable key instead of index
          className="wallet-row"
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

// Mock WalletRow component
const WalletRow: React.FC<{
  className: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}> = ({ className, amount, usdValue, formattedAmount }) => {
  return (
    <div className={className}>
      <span>Amount: {formattedAmount}</span>
      <span>USD Value: ${usdValue.toFixed(2)}</span>
    </div>
  );
};

export default WalletPage;

// Alternative optimized version with additional improvements
export const OptimizedWalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Single memoized computation for all operations
  const processedBalances = useMemo(() => {
    return balances
      .map(balance => ({
        ...balance,
        priority: getPriority(balance.blockchain),
        formatted: formatAmount(balance.amount)
      }))
      .filter(balance => 
        balance.priority > DEFAULT_PRIORITY && balance.amount > 0
      )
      .sort((a, b) => b.priority - a.priority);
  }, [balances]);

  // Memoized row rendering with useCallback for event handlers
  const renderRow = useCallback((balance: typeof processedBalances[0]) => {
    const usdValue = prices[balance.currency] * balance.amount;
    
    return (
      <WalletRow
        key={balance.currency}
        className="wallet-row"
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }, [prices]);

  const rows = useMemo(() => {
    return processedBalances.map(renderRow);
  }, [processedBalances, renderRow]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};
