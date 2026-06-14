import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import { describe, it, expect } from 'vitest';
import { OrderItem } from '../types';

const mockItem: OrderItem = {
  id: 'item-1',
  menuItemId: 'menu-1',
  name: { zh: '測試商品', en: 'Test Item', ko: '', ja: '', th: '' },
  price: 100,
  qty: 1,
  customization: {
    sweetness: 2,
    spiciness: 0,
    notes: ''
  }
};

describe('useCart', () => {
  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.cart).toEqual([]);
    expect(result.current.isCartOpen).toBe(false);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(mockItem);
    });
    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0]).toEqual(mockItem);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(mockItem);
    });
    expect(result.current.cart.length).toBe(1);
    
    act(() => {
      result.current.removeFromCart('item-1');
    });
    expect(result.current.cart.length).toBe(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart(mockItem);
    });
    
    act(() => {
      result.current.updateQuantity('item-1', 5);
    });
    expect(result.current.cart[0].qty).toBe(5);
  });

  it('should calculate subtotal correctly with customization', () => {
    const { result } = renderHook(() => useCart());
    const itemWithCustomization: OrderItem = {
      ...mockItem,
      qty: 2,
      customization: {
        ...mockItem.customization,
        spiciness: 3, // +10
        soupBase: 'coconut-milk', // +50
        selectedAddOns: [{ id: 'addon-1', name: 'Egg', price: 15 }]
      }
    };
    
    act(() => {
      result.current.addToCart(itemWithCustomization);
    });
    
    // (100 base + 10 spicy + 50 soup + 15 addon) * 2 qty = 175 * 2 = 350
    expect(result.current.cartSubtotal).toBe(350);
  });
});
