import { useState, useCallback, useEffect } from 'react';

export function useLoyaltyPoints(initialEmail: string | null) {
  const [points, setPoints] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  // Initialize or fetch points based on email
  useEffect(() => {
    if (initialEmail) {
      const savedPoints = localStorage.getItem(`google-points-${initialEmail}`);
      const savedBalance = localStorage.getItem(`google-balance-${initialEmail}`);

      if (savedPoints !== null) {
        setPoints(parseInt(savedPoints, 10));
      } else {
        setPoints(0);
      }

      if (savedBalance !== null) {
        setBalance(parseInt(savedBalance, 10));
      } else {
        setBalance(0);
      }
    } else {
      setPoints(0);
      setBalance(0);
    }
  }, [initialEmail]);

  const addPoints = useCallback(
    (amount: number) => {
      setPoints((prev) => {
        const newPoints = prev + amount;
        if (initialEmail) {
          localStorage.setItem(`google-points-${initialEmail}`, String(newPoints));
        }
        return newPoints;
      });
    },
    [initialEmail],
  );

  const deductPoints = useCallback(
    (amount: number) => {
      setPoints((prev) => {
        const newPoints = Math.max(0, prev - amount);
        if (initialEmail) {
          localStorage.setItem(`google-points-${initialEmail}`, String(newPoints));
        }
        return newPoints;
      });
    },
    [initialEmail],
  );

  const addBalance = useCallback(
    (amount: number) => {
      setBalance((prev) => {
        const newBalance = prev + amount;
        if (initialEmail) {
          localStorage.setItem(`google-balance-${initialEmail}`, String(newBalance));
        }
        return newBalance;
      });
    },
    [initialEmail],
  );

  const deductBalance = useCallback(
    (amount: number) => {
      setBalance((prev) => {
        const newBalance = Math.max(0, prev - amount);
        if (initialEmail) {
          localStorage.setItem(`google-balance-${initialEmail}`, String(newBalance));
        }
        return newBalance;
      });
    },
    [initialEmail],
  );

  return {
    points,
    balance,
    addPoints,
    deductPoints,
    addBalance,
    deductBalance,
  };
}
