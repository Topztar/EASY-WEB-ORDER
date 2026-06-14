import { renderHook, act } from '@testing-library/react';
import { useLoyaltyPoints } from './useLoyaltyPoints';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('useLoyaltyPoints', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with 0 points and balance when no email is provided', () => {
    const { result } = renderHook(() => useLoyaltyPoints(null));
    expect(result.current.points).toBe(0);
    expect(result.current.balance).toBe(0);
  });

  it('should load points from localStorage if email is provided', () => {
    localStorage.setItem('google-points-test@example.com', '150');
    localStorage.setItem('google-balance-test@example.com', '500');
    
    const { result } = renderHook(() => useLoyaltyPoints('test@example.com'));
    
    expect(result.current.points).toBe(150);
    expect(result.current.balance).toBe(500);
  });

  it('should add points and save to localStorage', () => {
    const { result } = renderHook(() => useLoyaltyPoints('test@example.com'));
    
    act(() => {
      result.current.addPoints(50);
    });
    
    expect(result.current.points).toBe(50);
    expect(localStorage.getItem('google-points-test@example.com')).toBe('50');
  });

  it('should deduct points and save to localStorage without going below 0', () => {
    localStorage.setItem('google-points-test@example.com', '100');
    const { result } = renderHook(() => useLoyaltyPoints('test@example.com'));
    
    act(() => {
      result.current.deductPoints(30);
    });
    
    expect(result.current.points).toBe(70);
    expect(localStorage.getItem('google-points-test@example.com')).toBe('70');
    
    act(() => {
      result.current.deductPoints(100);
    });
    
    expect(result.current.points).toBe(0);
  });
});
