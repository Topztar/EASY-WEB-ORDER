import { useState, useCallback, useMemo } from 'react';
import { OrderItem } from '../types';

export function useCart() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((item: OrderItem) => {
    setCart((prev) => [...prev, item]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      let finalPrice = item.price;
      if (item.customization.spiciness === 3) finalPrice += 10;
      if (item.customization.soupBase === 'coconut-milk') finalPrice += 50;
      const addOnPrice = item.customization.selectedAddOns?.reduce((s, a) => s + a.price, 0) || 0;
      return sum + (finalPrice + addOnPrice) * item.qty;
    }, 0);
  }, [cart]);

  return {
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
  };
}
