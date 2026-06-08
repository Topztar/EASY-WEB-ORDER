// Types for Sabay BBQ Web Ordering App

export type Language = 'zh' | 'en' | 'ko' | 'ja' | 'th';

export interface FoodCustomization {
  sweetness: number; // 0=No, 1=Less, 2=Regular, 3=Extra
  spiciness: number; // 0=None, 1=Mild (小辣), 2=Medium (中辣), 3=Thai Spicy (大辣, +10)
  noodleType?: 'rice-noodle' | 'vermicelli' | 'none'; // for Tom Yum noodles
  soupBase?: 'plain' | 'coconut-milk'; // +50
  notes: string;
}

export interface MenuItem {
  id: string;
  category: string;
  name: { [key in Language]: string };
  price: number;
  image: string;
  description: { [key in Language]: string };
  available: boolean;
  isSetMeal?: boolean;
  requiredSaucesOption?: boolean; // needs dipping options
  hasNoodlesOption?: boolean;
  hasCoconutsMilkOption?: boolean;
  containsBeef?: boolean;
  containsPork?: boolean;
  containsSeafood?: boolean;
  isNotSpicy?: boolean;
}

export interface OrderItem {
  id: string; // instance id
  menuItemId: string;
  name: { [key in Language]: string };
  price: number;
  qty: number;
  customization: FoodCustomization;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  serviceCharge: number; // 10% for dine-in if credit card, or 10% standard fee
  total: number;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  customerAvatar: string;
  paymentMethod: 'cash' | 'credit' | 'member';
  isMember: boolean;
  isPaid?: boolean;
}

export interface Ingredient {
  id: string;
  name: { [key in Language]: string };
  stock: number;
  minThreshold: number; // triggers alerts
  unit: string;
}

// Map menu food item ID to its ingredient cost mapping
export interface IngredientCost {
  ingredientId: string;
  amount: number;
}

export interface Promotion {
  id: string;
  title: { [key in Language]: string };
  code: string;
  discountRate: number; // e.g. 0.9 for 10% off
  description: { [key in Language]: string };
  active: boolean;
}

export interface Category {
  id: string;
  name: { [key in Language]: string };
}

export interface TableConfig {
  id: string;
  qrCodeUrl: string;
}
