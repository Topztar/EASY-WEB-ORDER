import React, { useState, useEffect, useMemo } from 'react';
import { Ingredient, Promotion, Language, Category, TableConfig, Order, OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Package, Users, AlertTriangle, Play, RefreshCw, Layers, Sparkles, Send, Coins, KeyRound, Lock, QrCode, Trash2, Plus, Edit, Download, Calendar, Eye, FileText, ShoppingBag, Copy, Check, ExternalLink, Minus } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}


interface ManagerDashboardProps {
  currentLang: Language;
  analytics: {
    totalRevenue: number;
    ordersCount: number;
    categorySales: { category: string; revenue: number }[];
    hourlyDistribution: { timeSlot: string; orders: number }[];
    topDishes: { name: string; qty: number }[];
    stockWarnings: Ingredient[];
  };
  ingredients: Ingredient[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onRestock: (id: string, amount: number) => Promise<void>;
  promotions: Promotion[];
  onSendPromoPush: (notif: { title: string; message: string; badge: string }) => Promise<void>;
  onToggleMenuItemAvailability: (id: string) => Promise<void>;
  menuItems: any[];
  onAddMenuItem?: (item: any) => Promise<void>;
  onEditMenuItem?: (id: string, item: any) => Promise<void>;
  categories: Category[];
  onAddCategory?: (id: string, name: any, showOnCustomerPage?: boolean) => Promise<{ success: boolean; error?: string }>;
  onEditCategory?: (id: string, name: any, showOnCustomerPage?: boolean) => Promise<{ success: boolean; error?: string }>;
  onDeleteCategory?: (id: string) => Promise<{ success: boolean; error?: string }>;
  tables: TableConfig[];
  onAddTable: (id: string, qrCodeUrl?: string) => Promise<{ success: boolean; error?: string }>;
  onEditTable: (id: string, qrCodeUrl: string) => Promise<{ success: boolean; error?: string }>;
  onDeleteTable: (id: string) => Promise<{ success: boolean; error?: string }>;
  onUpdateOrderItems?: (orderId: string, items: any[]) => Promise<void>;
  onPayOrder?: (
    orderId: string,
    checkoutData?: {
      paymentMethod?: string;
      subtotal?: number;
      serviceCharge?: number;
      total?: number;
      discount?: number;
      isPaid?: boolean;
    }
  ) => Promise<void>;
  defaultSubTab?: 'stats' | 'orders' | 'inventory' | 'menu' | 'members' | 'cashier' | 'printer' | 'options' | 'eod';
  onSubTabChange?: (subTab: 'stats' | 'orders' | 'inventory' | 'menu' | 'members' | 'cashier' | 'printer' | 'options' | 'eod') => void;
  minSpend?: number;
  onUpdateMinSpend?: (newVal: number) => Promise<{ success: boolean; error?: string }>;
  operatingHours?: any[];
  restDays?: string[];
  onUpdateOperatingHours?: (slots: any[], restDays?: string[]) => Promise<{ success: boolean; error?: string }>;
  customerNotice?: string;
  onUpdateCustomerNotice?: (notice: string) => Promise<{ success: boolean; error?: string }>;
  onUpdateTableNumber?: (orderId: string, tableNumber: string) => Promise<{ success: boolean; error?: string }>;
  staffPin?: string;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  currentLang,
  analytics,
  ingredients,
  orders,
  onUpdateOrderStatus,
  onRestock,
  promotions,
  onSendPromoPush,
  onToggleMenuItemAvailability,
  menuItems,
  onAddMenuItem,
  onEditMenuItem,
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  tables,
  onAddTable,
  onEditTable,
  onDeleteTable,
  onUpdateOrderItems,
  onPayOrder,
  onUpdateTableNumber,
  defaultSubTab,
  onSubTabChange,
  minSpend = 200,
  onUpdateMinSpend,
  operatingHours = [],
  restDays = [],
  onUpdateOperatingHours,
  customerNotice = '',
  onUpdateCustomerNotice,
  staffPin,
}) => {
  // Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'orders' | 'inventory' | 'menu' | 'members' | 'cashier' | 'printer' | 'options' | 'eod'>(defaultSubTab || 'stats');

  useEffect(() => {
    if (defaultSubTab) {
      setActiveSubTab(defaultSubTab);
    }
  }, [defaultSubTab]);

  // Table Config States
  const [isTableFormOpen, setIsTableFormOpen] = useState(false);
  const [editingTableObj, setEditingTableObj] = useState<TableConfig | null>(null);
  const [tableIdInput, setTableIdInput] = useState('');
  const [tableQrUrlInput, setTableQrUrlInput] = useState('');
  const [tableError, setTableError] = useState<string | null>(null);
  const [tableSuccess, setTableSuccess] = useState<string | null>(null);
  const [takeoutStatus, setTakeoutStatus] = useState({ sequence: 0, lastResetDate: '' });
  const [selectedQrPreviewId, setSelectedQrPreviewId] = useState<string>('1');
  const [copiedTableId, setCopiedTableId] = useState<string | null>(null);
  const [tableToDeleteId, setTableToDeleteId] = useState<string | null>(null);

  // PIN security states
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);
  const [pinChangeLoading, setPinChangeLoading] = useState(false);

  // Min spend states
  const [tempMinSpend, setTempMinSpend] = useState<number>(minSpend);
  const [minSpendSaveError, setMinSpendSaveError] = useState<string | null>(null);
  const [minSpendSaveSuccess, setMinSpendSaveSuccess] = useState<string | null>(null);
  const [simulatedElapsedOrders, setSimulatedElapsedOrders] = useState<string[]>([]);

  // Operating hours states
  const [tempOperatingHours, setTempOperatingHours] = useState<any[]>(operatingHours);
  const [tempRestDays, setTempRestDays] = useState<string[]>(restDays);
  const [opHoursError, setOpHoursError] = useState<string | null>(null);
  const [opHoursSuccess, setOpHoursSuccess] = useState<string | null>(null);

  // Customer notice states
  const [tempCustomerNotice, setTempCustomerNotice] = useState<string>(customerNotice);
  const [noticeError, setNoticeError] = useState<string | null>(null);
  const [noticeSuccess, setNoticeSuccess] = useState<string | null>(null);

  // Refs to prevent periodic polling from disrupting active inputs
  const prevOperatingHoursRef = React.useRef<string>(JSON.stringify(operatingHours));
  const prevRestDaysRef = React.useRef<string>(JSON.stringify(restDays));
  const prevCustomerNoticeRef = React.useRef<string>(customerNotice);
  const prevMinSpendRef = React.useRef<number>(minSpend);

  // Active Order Table/Takeout editing states
  const [editingOrderTableId, setEditingOrderTableId] = useState<string | null>(null);
  const [editingOrderTableValue, setEditingOrderTableValue] = useState<string>('');

  useEffect(() => {
    const currentStr = JSON.stringify(operatingHours);
    if (currentStr !== prevOperatingHoursRef.current) {
      setTempOperatingHours(operatingHours);
      prevOperatingHoursRef.current = currentStr;
    }
  }, [operatingHours]);

  useEffect(() => {
    const currentStr = JSON.stringify(restDays);
    if (currentStr !== prevRestDaysRef.current) {
      setTempRestDays(restDays);
      prevRestDaysRef.current = currentStr;
    }
  }, [restDays]);

  useEffect(() => {
    if (customerNotice !== prevCustomerNoticeRef.current) {
      setTempCustomerNotice(customerNotice);
      prevCustomerNoticeRef.current = customerNotice;
    }
  }, [customerNotice]);

  const handleSaveOperatingHoursLocal = async (updatedSlots: any[], updatedRestDays: string[]) => {
    setOpHoursError(null);
    setOpHoursSuccess(null);
    if (onUpdateOperatingHours) {
      const res = await onUpdateOperatingHours(updatedSlots, updatedRestDays);
      if (res.success) {
        setOpHoursSuccess('營業時間與公休日排程配置已成功儲存！');
        prevOperatingHoursRef.current = JSON.stringify(updatedSlots);
        prevRestDaysRef.current = JSON.stringify(updatedRestDays);
      } else {
        setOpHoursError(res.error || '儲存營業時間及公休設定失敗');
      }
    }
  };

  const handleSaveCustomerNotice = async () => {
    setNoticeError(null);
    setNoticeSuccess(null);
    if (onUpdateCustomerNotice) {
      const res = await onUpdateCustomerNotice(tempCustomerNotice);
      if (res.success) {
        setNoticeSuccess('顧客注意事項已成功更新！');
        prevCustomerNoticeRef.current = tempCustomerNotice;
      } else {
        setNoticeError(res.error || '更新注意事項失敗');
      }
    }
  };

  useEffect(() => {
    if (minSpend !== prevMinSpendRef.current) {
      setTempMinSpend(minSpend);
      prevMinSpendRef.current = minSpend;
    }
  }, [minSpend]);

  const handleSaveMinSpend = async () => {
    setMinSpendSaveError(null);
    setMinSpendSaveSuccess(null);
    if (onUpdateMinSpend) {
      const res = await onUpdateMinSpend(tempMinSpend);
      if (res.success) {
        setMinSpendSaveSuccess('低消門檻已成功更新！');
        prevMinSpendRef.current = tempMinSpend;
      } else {
        setMinSpendSaveError(res.error || '無法更新狀態');
      }
    }
  };

  // Sales Query states
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [orderQueryStartDate, setOrderQueryStartDate] = useState('');
  const [orderQueryEndDate, setOrderQueryEndDate] = useState('');
  const [orderQueryStatus, setOrderQueryStatus] = useState<string>('all');
  const [orderQueryKeyword, setOrderQueryKeyword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cashReceivedInput, setCashReceivedInput] = useState<number>(0);

  // Synchronize cashReceivedInput with order total
  useEffect(() => {
    if (selectedOrder) {
      setCashReceivedInput(selectedOrder.total);
    }
  }, [selectedOrder]);

  // Paid Order Modifications (Return & Refund workflow)
  const [paidModDetails, setPaidModDetails] = useState<{ item?: any; menuItemId?: string; delta: number; isAddingNew: boolean } | null>(null);
  const [modReason, setModReason] = useState('input_error');
  const [modNotes, setModNotes] = useState('');
  const [modPin, setModPin] = useState('');

  const handleSavePaidModification = async () => {
    if (!selectedOrder || !onUpdateOrderItems || !paidModDetails) return;

    // Validate PIN with backend
    try {
      const pinRes = await fetch('/api/staff/pin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: modPin.trim() })
      });
      if (!pinRes.ok) {
        const errData = await pinRes.json().catch(() => ({}));
        alert(`❌ 簽核失敗：${errData.error || '員工授權 PIN 碼不正確！請重新輸入。'}`);
        return;
      }
    } catch (e) {
      alert('❌ 網路連線或伺服器驗證失敗，請稍後再試。');
      return;
    }

    let updatedItems = [...selectedOrder.items];
    let originalPrice = selectedOrder.total;
    let qtyChange = paidModDetails.delta;
    let itemName = '';
    let unitPrice = 0;

    if (paidModDetails.isAddingNew) {
      // Step 1: Manual item adding
      const dish = menuItems.find((m: any) => m.id === paidModDetails.menuItemId);
      if (!dish) {
        alert('❌ 找不到該餐點資料！');
        return;
      }
      itemName = dish.name.zh || dish.name;
      unitPrice = dish.price;

      const existing = updatedItems.find((it: any) => it.menuItemId === dish.id);
      if (existing) {
        updatedItems = updatedItems.map((it: any) => {
          if (it.menuItemId === dish.id) {
            return { ...it, qty: it.qty + 1 };
          }
          return it;
        });
      } else {
        const newItem = {
          id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          menuItemId: dish.id,
          name: typeof dish.name === 'object' ? dish.name : { zh: dish.name, en: dish.name }, // keep consistent
          price: dish.price,
          qty: 1,
          customization: {
            sweetness: 2,
            spiciness: 1,
            notes: '已結帳後台手動補加 / Post-payment added',
          }
        };
        updatedItems = [...updatedItems, newItem];
      }
    } else {
      // Step 2: Modifying existing quantity
      const targetItem = updatedItems.find((it: any) => it.id === paidModDetails.item.id);
      if (!targetItem) {
        alert('❌ 點單中查無此餐點！');
        return;
      }
      itemName = targetItem.name?.zh || targetItem.name;
      unitPrice = targetItem.price;

      updatedItems = updatedItems.map((it: any) => {
        if (it.id === paidModDetails.item.id) {
          return { ...it, qty: it.qty + qtyChange };
        }
        return it;
      }).filter((it: any) => it.qty > 0);
    }

    // Recompute total & diff
    let subtotal = 0;
    updatedItems.forEach((it: any) => {
      subtotal += it.price * it.qty;
    });
    const serviceCharge = (selectedOrder.paymentMethod === 'credit' || selectedOrder.paymentMethod === 'linepay') ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + serviceCharge;
    const totalDiff = total - originalPrice;

    // Create unique log item
    const REASONS_MAP: Record<string, string> = {
      kitchen_prep_error: '🍳 廚房製餐瑕疵 / 食安事件',
      wrong_delivery: '🚶‍♂️ 員工送錯桌席 / 漏做重出',
      customer_cancel: '⏳ 餐期延誤 / 顧客臨時取消',
      input_error: '收銀點錯帳目更正 / 系統修正',
      sold_out: '🚫 食材告罄 / 沽清被迫退餐',
      vip_promo: '🎁 VIP 招待 / 自主促銷補償',
      customer_addon: '➕ 客人追加現場點餐',
    };

    const newLog = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type: totalDiff < 0 ? 'refund' : 'addon',
      itemName: itemName,
      pricePerUnit: unitPrice,
      qtyChange: qtyChange,
      totalDiff: totalDiff,
      reason: REASONS_MAP[modReason] || modReason,
      notes: modNotes.trim() || '無特別備註',
      authorizedByPin: `Staff PIN: ****${modPin.slice(-2)}`,
    };

    // If payment method is member, sync membership database
    if (selectedOrder.paymentMethod === 'member') {
      const dbStr = localStorage.getItem('google-members-database');
      if (dbStr) {
        try {
          const db = JSON.parse(dbStr);
          let vipEmail = 'topztar@gmail.com';
          if (selectedOrder.customerName) {
            const matched = db.find((m: any) => m.name === selectedOrder.customerName);
            if (matched) vipEmail = matched.email;
          }
          const userIndex = db.findIndex((m: any) => m.email === vipEmail);
          if (userIndex !== -1) {
            const currentBal = db[userIndex].balance || 0;
            const finalBal = currentBal - totalDiff; // Negative totalDiff means refund, which increases balance (+ absolute totalDiff)
            
            if (finalBal < 0) {
              alert(`⚠️ 警告：此會員儲值卡餘額不足（剩餘: NT$ ${currentBal}）！自動扣減使餘額透支，請現場向顧客索取差額 ${Math.abs(finalBal)} 元！`);
            }
            db[userIndex].balance = Math.max(0, finalBal);
            localStorage.setItem('google-members-database', JSON.stringify(db));
            alert(`💳 因應本次退貨/加點核銷：會員額度已自動變更，原額: NT$ ${currentBal} ➔ 現額: NT$ ${db[userIndex].balance}`);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } else if (selectedOrder.paymentMethod === 'cash') {
      if (totalDiff < 0) {
        alert(`💵 現金退款核銷通知：本更動完成後，請現場從收銀機退還顧客現金 NT$ ${Math.abs(totalDiff)} 元！`);
      } else if (totalDiff > 0) {
        alert(`💵 現金補款稽核通知：本更動完成後，請向顧客加收額外現金 NT$ ${totalDiff} 元，並確認投入收銀機中！`);
      }
    } else {
      // Credit/LINEPay
      alert(`💳 電子款項金流調帳通知：此單採線上電子支付。差額 NT$ ${totalDiff} 元，已對應記為店家記帳退補核對項。`);
    }

    // Save and sync with backend
    const logs = selectedOrder.refundLogs ? [...selectedOrder.refundLogs, newLog] : [newLog];
    await onUpdateOrderItems(selectedOrder.id, updatedItems, logs);

    // Update selectedOrder modal state to sync UI
    setSelectedOrder({
      ...selectedOrder,
      items: updatedItems,
      subtotal,
      serviceCharge,
      total,
      refundLogs: logs
    });

    // Reset state & close modal
    setPaidModDetails(null);
    setModReason('input_error');
    setModNotes('');
    setModPin('');
    alert('✅ 已結帳點單帳目異動稽查記錄，已與 Cloud Firestore 資料庫安全核算並同步更新！');
  };

  // Cashier Subsystem States
  const [selectedCashierOrderId, setSelectedCashierOrderId] = useState<string | null>(null);
  const [cashierDiscountRate, setCashierDiscountRate] = useState<number>(0); // percentage, e.g. 10 for 10% off
  const [cashierDiscountFlat, setCashierDiscountFlat] = useState<number>(0); // flat NT$ off
  const [cashierDiscountType, setCashierDiscountType] = useState<'percent' | 'flat'>('percent');
  const [cashierSurchargeRate, setCashierSurchargeRate] = useState<number>(0); // percentage surcharge, e.g. 10 for +10% service charge
  const [cashierSurchargeFlat, setCashierSurchargeFlat] = useState<number>(0); // flat NT$ surcharge
  const [cashierSurchargeType, setCashierSurchargeType] = useState<'percent' | 'flat'>('percent');
  const [cashierPaymentMethod, setCashierPaymentMethod] = useState<'cash' | 'credit' | 'member' | 'linepay'>('cash');
  const [cashierCashChannel, setCashierCashChannel] = useState<'counter' | 'kiosk' | 'delivery'>('counter');
  const [cashierCashReceived, setCashierCashReceived] = useState<number>(0);
  const [cashierListFilter, setCashierListFilter] = useState<'all' | 'completed' | 'dinein' | 'takeout'>('all');
  const [isAdjustingDiscount, setIsAdjustingDiscount] = useState<boolean>(false);
  const [isAdjustingSurcharge, setIsAdjustingSurcharge] = useState<boolean>(false);

  const filteredCashierOrders = useMemo(() => {
    switch (cashierListFilter) {
      case 'completed':
        return orders.filter(o => !o.isPaid && o.status === 'completed');
      case 'dinein':
        return orders.filter(o => !o.isPaid && !o.tableNumber.includes('外帶'));
      case 'takeout':
        return orders.filter(o => !o.isPaid && o.tableNumber.includes('外帶'));
      case 'all':
      default:
        return orders.filter(o => !o.isPaid);
    }
  }, [orders, cashierListFilter]);

  const cashierSelectedOrder = useMemo(() => {
    if (!selectedCashierOrderId) return null;
    return orders.find(o => o.id === selectedCashierOrderId) || null;
  }, [orders, selectedCashierOrderId]);

  // Cashier item addition dropdown state
  const [cashierNewItemInput, setCashierNewItemInput] = useState<string>('');

  const handleCashierQtyChange = async (itemId: string, delta: number) => {
    if (!cashierSelectedOrder || !onUpdateOrderItems) return;
    const updatedItems = cashierSelectedOrder.items.map((it: any) => {
      if (it.id === itemId) {
        return { ...it, qty: it.qty + delta };
      }
      return it;
    }).filter((it: any) => it.qty > 0);

    await onUpdateOrderItems(cashierSelectedOrder.id, updatedItems);
  };

  const handleCashierRemoveItem = async (itemId: string) => {
    if (!cashierSelectedOrder || !onUpdateOrderItems) return;
    const updatedItems = cashierSelectedOrder.items.filter((it: any) => it.id !== itemId);
    await onUpdateOrderItems(cashierSelectedOrder.id, updatedItems);
  };

  const handleCashierAddMenuItem = async (menuItemId: string) => {
    if (!cashierSelectedOrder || !onUpdateOrderItems) return;
    const dish = menuItems.find((m: any) => m.id === menuItemId);
    if (!dish) return;

    const existing = cashierSelectedOrder.items.find((it: any) => it.menuItemId === menuItemId);
    let updatedItems;
    if (existing) {
      updatedItems = cashierSelectedOrder.items.map((it: any) => {
        if (it.menuItemId === menuItemId) {
          return { ...it, qty: it.qty + 1 };
        }
        return it;
      });
    } else {
      const newItem = {
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItemId: dish.id,
        name: dish.name,
        price: dish.price,
        qty: 1,
        customization: {
          sweetness: 2,
          spiciness: 1,
          notes: '櫃檯收銀加點',
        }
      };
      updatedItems = [...cashierSelectedOrder.items, newItem];
    }

    await onUpdateOrderItems(cashierSelectedOrder.id, updatedItems);
    setCashierNewItemInput('');
  };

  useEffect(() => {
    if (cashierSelectedOrder) {
      setCashierDiscountRate(0);
      setCashierDiscountFlat(0);
      setCashierDiscountType('percent');
      setIsAdjustingDiscount(false);
      setIsAdjustingSurcharge(false);
      
      const method = cashierSelectedOrder.paymentMethod === 'credit' ? 'credit' : 
                     cashierSelectedOrder.paymentMethod === 'member' ? 'member' :
                     cashierSelectedOrder.paymentMethod === 'linepay' ? 'linepay' : 'cash';
      setCashierPaymentMethod(method);

      if (method === 'credit' || method === 'linepay') {
        setCashierSurchargeRate(10);
        setCashierSurchargeFlat(0);
        setCashierSurchargeType('percent');
      } else {
        setCashierSurchargeRate(0);
        setCashierSurchargeFlat(0);
        setCashierSurchargeType('percent');
      }
    }
  }, [selectedCashierOrderId]);

  const cashierCalculatedTotals = useMemo(() => {
    if (!cashierSelectedOrder) return { subtotal: 0, discount: 0, surcharge: 0, total: 0 };
    
    const sub = cashierSelectedOrder.subtotal || 0;
    
    let discount = 0;
    if (cashierDiscountType === 'percent') {
      discount = Math.round(sub * (cashierDiscountRate / 100));
    } else {
      discount = Math.round(cashierDiscountFlat);
    }
    
    if (discount > sub) discount = sub;
    if (discount < 0) discount = 0;
    
    const afterDiscount = sub - discount;
    
    let surcharge = 0;
    if (cashierSurchargeType === 'percent') {
      surcharge = Math.round(afterDiscount * (cashierSurchargeRate / 100));
    } else {
      surcharge = Math.round(cashierSurchargeFlat);
    }
    if (surcharge < 0) surcharge = 0;
    
    const finalTotal = afterDiscount + surcharge;
    
    return {
      subtotal: sub,
      discount,
      surcharge,
      total: finalTotal
    };
  }, [cashierSelectedOrder, cashierDiscountType, cashierDiscountRate, cashierDiscountFlat, cashierSurchargeType, cashierSurchargeRate, cashierSurchargeFlat]);

  useEffect(() => {
    if (cashierCalculatedTotals) {
      setCashierCashReceived(cashierCalculatedTotals.total);
    }
  }, [cashierCalculatedTotals.total]);

  const handleCashierCheckoutSubmit = async () => {
    if (!cashierSelectedOrder || !onPayOrder) return;
    
    if (cashierPaymentMethod === 'cash' && cashierCashReceived < cashierCalculatedTotals.total) {
      alert(`⚠️ 實收現金金額不足！實收 (NT$ ${cashierCashReceived}) 需大於或等於應收總額 (NT$ ${cashierCalculatedTotals.total})。`);
      return;
    }

    if (cashierPaymentMethod === 'member') {
      const dbStr = localStorage.getItem('google-members-database');
      if (dbStr) {
        try {
          const db = JSON.parse(dbStr);
          let vipEmail = 'topztar@gmail.com';
          if (cashierSelectedOrder?.customerName) {
            const matched = db.find((m: any) => m.name === cashierSelectedOrder.customerName);
            if (matched) {
              vipEmail = matched.email;
            }
          }
          const userIndex = db.findIndex((m: any) => m.email === vipEmail);
          if (userIndex >= 0) {
            const currentBal = db[userIndex].balance || 0;
            if (currentBal < cashierCalculatedTotals.total) {
              alert(`⚠️ 會員餘額不足 (剩餘: NT$ ${currentBal})！無法進行扣底結帳，請先在右側點選【儲值增額】。`);
              return;
            }
            // Deduct
            db[userIndex].balance = currentBal - cashierCalculatedTotals.total;
            localStorage.setItem('google-members-database', JSON.stringify(db));
            window.dispatchEvent(new Event('local-points-updated'));
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    
    try {
      const change = cashierPaymentMethod === 'cash' ? (cashierCashReceived - cashierCalculatedTotals.total) : 0;
      
      const checkoutRecord = {
        id: `TX-${Date.now()}`,
        orderId: cashierSelectedOrder.id,
        tableNumber: cashierSelectedOrder.tableNumber,
        subtotal: cashierCalculatedTotals.subtotal,
        discount: cashierCalculatedTotals.discount,
        serviceCharge: cashierCalculatedTotals.surcharge,
        total: cashierCalculatedTotals.total,
        amountPaid: cashierPaymentMethod === 'cash' ? cashierCashReceived : cashierCalculatedTotals.total,
        changeProvided: change,
        paymentMethod: cashierPaymentMethod,
        staffPin: staffPin || '888888',
        checkoutTime: new Date().toISOString()
      };

      let docRef;
      try {
        docRef = await addDoc(collection(db, 'checkouts'), checkoutRecord);
      } catch (err: any) {
        handleFirestoreError(err, OperationType.CREATE, 'checkouts');
      }
      console.log('✓ Successfully uploaded cashier checkout record to Cloud Firestore. Doc ID:', docRef?.id);
      
      await onPayOrder(cashierSelectedOrder.id, {
        paymentMethod: cashierPaymentMethod,
        subtotal: cashierCalculatedTotals.subtotal,
        serviceCharge: cashierCalculatedTotals.surcharge,
        discount: cashierCalculatedTotals.discount,
        total: cashierCalculatedTotals.total,
        isPaid: true
      });
      
      setSelectedCashierOrderId(null);
      
      alert(`✅ 收銀結帳成功！\n單號: ${cashierSelectedOrder.id}\n客座: ${cashierSelectedOrder.tableNumber}\n原價: NT$ ${checkoutRecord.subtotal}\n折扣: NT$ ${checkoutRecord.discount}\n服務費/加成: NT$ ${checkoutRecord.serviceCharge}\n實收應付: NT$ ${checkoutRecord.total}\n${cashierPaymentMethod === 'cash' ? `Cash 實收: NT$ ${cashierCashReceived}\n找零金額: NT$ ${change}` : `付款方式: ${cashierPaymentMethod.toUpperCase()}`}\n雲端資料庫（Cloud Firestore）記錄已妥善儲存！`);

    } catch (err: any) {
      console.error('[Cashier Checkout processing error]', err);
      alert(`❌ 收銀失敗: ${err?.message || String(err)}`);
    }
  };

  const handleLocalQtyChange = async (itemId: string, delta: number) => {
    if (!selectedOrder || !onUpdateOrderItems) return;
    const updatedItems = selectedOrder.items.map((it: any) => {
      if (it.id === itemId) {
        return { ...it, qty: it.qty + delta };
      }
      return it;
    }).filter((it: any) => it.qty > 0);

    // Call callback to sync with backend
    await onUpdateOrderItems(selectedOrder.id, updatedItems);
    
    // Also update selectedOrder local modal state to prevent lag
    let subtotal = 0;
    updatedItems.forEach((it: any) => {
      subtotal += it.price * it.qty;
    });
    const serviceCharge = (selectedOrder.paymentMethod === 'credit' || selectedOrder.paymentMethod === 'linepay') ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + serviceCharge;

    setSelectedOrder({
      ...selectedOrder,
      items: updatedItems,
      subtotal,
      serviceCharge,
      total,
    });
  };

  const handleAddLocalItem = async (menuItemId: string) => {
    if (!selectedOrder || !onUpdateOrderItems) return;
    const dish = menuItems.find((m: any) => m.id === menuItemId);
    if (!dish) return;

    const existing = selectedOrder.items.find((it: any) => it.menuItemId === menuItemId);
    let updatedItems;
    if (existing) {
      updatedItems = selectedOrder.items.map((it: any) => {
        if (it.menuItemId === menuItemId) {
          return { ...it, qty: it.qty + 1 };
        }
        return it;
      });
    } else {
      const newItem = {
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItemId: dish.id,
        name: dish.name,
        price: dish.price,
        qty: 1,
        customization: {
          sweetness: 2,
          spiciness: 1,
          notes: '後台手動加點 / Added by admin',
        }
      };
      updatedItems = [...selectedOrder.items, newItem];
    }

    // Sync with backend
    await onUpdateOrderItems(selectedOrder.id, updatedItems);

    let subtotal = 0;
    updatedItems.forEach((it: any) => {
      subtotal += it.price * it.qty;
    });
    const serviceCharge = (selectedOrder.paymentMethod === 'credit' || selectedOrder.paymentMethod === 'linepay') ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + serviceCharge;

    setSelectedOrder({
      ...selectedOrder,
      items: updatedItems,
      subtotal,
      serviceCharge,
      total,
    });
  };

  const handleProcessCheckout = async () => {
    if (!selectedOrder || !onPayOrder) return;

    if (selectedOrder.paymentMethod === 'cash' && cashReceivedInput < selectedOrder.total) {
      alert(`⚠️ 實收金額不足！實收 (NT$ ${cashReceivedInput}) 需大於或等於總額 (NT$ ${selectedOrder.total})。`);
      return;
    }

    if (selectedOrder.paymentMethod === 'member') {
      const dbStr = localStorage.getItem('google-members-database');
      if (dbStr) {
        try {
          const db = JSON.parse(dbStr);
          let vipEmail = 'topztar@gmail.com';
          if (selectedOrder.customerName) {
            const matched = db.find((m: any) => m.name === selectedOrder.customerName);
            if (matched) {
              vipEmail = matched.email;
            }
          }
          const userIndex = db.findIndex((m: any) => m.email === vipEmail);
          if (userIndex >= 0) {
            const currentBal = db[userIndex].balance || 0;
            if (currentBal < selectedOrder.total) {
              alert(`⚠️ 會員餘額不足 (剩餘: NT$ ${currentBal})！無法進行扣抵結帳，請先至收銀台點選【儲值增額】。`);
              return;
            }
            // Deduct
            db[userIndex].balance = currentBal - selectedOrder.total;
            localStorage.setItem('google-members-database', JSON.stringify(db));
            window.dispatchEvent(new Event('local-points-updated'));
          } else {
            alert(`⚠️ 會員帳號不存在，無法使用會員扣抵方式。`);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        alert(`⚠️ 未能獲取會員資料庫，請確認會員數據已初始化。`);
        return;
      }
    }

    try {
      const change = selectedOrder.paymentMethod === 'cash' ? (cashReceivedInput - selectedOrder.total) : 0;
      
      const checkoutRecord = {
        id: `TX-${Date.now()}`,
        orderId: selectedOrder.id,
        tableNumber: selectedOrder.tableNumber,
        subtotal: selectedOrder.subtotal,
        serviceCharge: selectedOrder.serviceCharge,
        total: selectedOrder.total,
        amountPaid: selectedOrder.paymentMethod === 'cash' ? cashReceivedInput : selectedOrder.total,
        changeProvided: change,
        paymentMethod: selectedOrder.paymentMethod,
        staffPin: staffPin || '888888',
        checkoutTime: new Date().toISOString()
      };

      let docRef;
      try {
        docRef = await addDoc(collection(db, 'checkouts'), checkoutRecord);
      } catch (error: any) {
        handleFirestoreError(error, OperationType.CREATE, 'checkouts');
      }
      console.log('✓ Successfully uploaded checkout record to Cloud Firestore. Doc ID:', docRef?.id);

      await onPayOrder(selectedOrder.id);

      setSelectedOrder({
        ...selectedOrder,
        isPaid: true,
        status: (selectedOrder.status === 'pending' || selectedOrder.status === 'preparing') ? 'completed' : selectedOrder.status
      });

      alert(`✅ 結帳成功！
單號: ${selectedOrder.id}
實收: NT$ ${checkoutRecord.amountPaid}
找零: NT$ ${checkoutRecord.changeProvided}
交易憑證已妥善上傳儲存至 Cloud Firestore！`);

    } catch (error: any) {
      console.error('Failed to processed checkout to database:', error);
      alert(`⚠️ 資料庫寫入失敗！請確認 Firebase 設定。錯誤: ${error.message || error}`);
    }
  };

  // Inventory transaction ledger logs
  const [dbInventoryLogs, setDbInventoryLogs] = useState<any[]>([]);
  const [manualAdjustId, setManualAdjustId] = useState('');
  const [manualAdjustQty, setManualAdjustQty] = useState('');
  const [manualAdjustNote, setManualAdjustNote] = useState('');
  const [inventoryLogSearch, setInventoryLogSearch] = useState('');
  const [restockAmount, setRestockAmount] = useState<{ [key: string]: number }>({});

  // Menu Creation/Editing states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemNameZh, setItemNameZh] = useState('');
  const [itemNameEn, setItemNameEn] = useState('');
  const [itemCategory, setItemCategory] = useState('skewers');
  const [itemPrice, setItemPrice] = useState(100);
  const [itemImage, setItemImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400');
  const [itemDescZh, setItemDescZh] = useState('');
  const [itemDescEn, setItemDescEn] = useState('');
  const [hasNoodles, setHasNoodles] = useState(false);
  const [isNotSpicy, setIsNotSpicy] = useState(false);
  const [customAddOns, setCustomAddOns] = useState<any[]>([]);

  // Category Creation/Editing states
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catId, setCatId] = useState('');
  const [catNameZh, setCatNameZh] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameTh, setCatNameTh] = useState('');
  const [catNameJa, setCatNameJa] = useState('');
  const [catNameKo, setCatNameKo] = useState('');
  const [catError, setCatError] = useState<string | null>(null);
  const [catShowOnCustomer, setCatShowOnCustomer] = useState<boolean>(true);

  // Google Members state and points database
  const [membersList, setMembersList] = useState<any[]>([]);

  // Push notifications state
  const [promoTitle, setPromoTitle] = useState('沙貝宵夜慶典｜香烤雞皮限量大特惠！');
  const [promoMessage, setPromoMessage] = useState('今日九點後，到店綁定會員下單，兩串炭烤雞肉串免費送，數量有限點完為止！');
  const [promoBadge, setPromoBadge] = useState('🔥 限量狂狂');
  const [pushSentConfirm, setPushSentConfirm] = useState(false);

  // Option Rules States
  const [globalRules, setGlobalRules] = useState<any[]>([]);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState('加配料');
  const [newRulePrice, setNewRulePrice] = useState(20);

  // Printer Configuration States
  const [kitchenPrinter, setKitchenPrinter] = useState({
    connectionType: 'IP',
    ip: '192.168.1.101',
    usbPort: 'USB001',
    width: '80mm',
    fontSizeFactor: 1.0,
    restaurantName: '沙貝燒烤 泰式廚房',
    printTelephone: '02-1234-5678',
    printAddress: '台北市信義區泰式一番街8號',
    printTimeEnabled: true,
    headerPrefix: '★★★ 廚房工作備餐單 ★★★',
    footerSuffix: '請主廚盡速配餐出餐！'
  });
  const [billPrinter, setBillPrinter] = useState({
    connectionType: 'USB',
    ip: '192.168.1.102',
    usbPort: 'USB002',
    width: '58mm',
    fontSizeFactor: 0.8,
    restaurantName: '沙貝燒烤 SABAY BBQ',
    printTelephone: '02-1234-5678',
    printAddress: '台北市信義區泰式一番街8號',
    printTimeEnabled: true,
    headerPrefix: '★★★ 顧客結帳明細單 ★★★',
    footerSuffix: '謝謝光臨，歡迎再度光臨！'
  });

  const [printerSaveSuccess, setPrinterSaveSuccess] = useState<string | null>(null);

  const fetchGlobalRules = async () => {
    try {
      const res = await fetch('/api/option-rules');
      if (res.ok) {
        const data = await res.json();
        setGlobalRules(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPrinterSettings = async () => {
    try {
      const res = await fetch('/api/printer/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.kitchen) setKitchenPrinter(data.kitchen);
        if (data.bill) setBillPrinter(data.bill);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePrinters = async () => {
    try {
      const res = await fetch('/api/printer/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kitchen: kitchenPrinter, bill: billPrinter })
      });
      if (res.ok) {
        setPrinterSaveSuccess('✅ 印表機與硬體設定儲存成功！');
        setTimeout(() => setPrinterSaveSuccess(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddGlobalRule = async () => {
    if (!newRuleName.trim()) {
      alert('請輸入名稱！');
      return;
    }
    try {
      const res = await fetch('/api/option-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRuleName, category: newRuleCategory, price: newRulePrice })
      });
      if (res.ok) {
        setNewRuleName('');
        fetchGlobalRules();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteGlobalRule = async (id: string) => {
    try {
      const res = await fetch(`/api/option-rules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchGlobalRules();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchGlobalRules();
    fetchPrinterSettings();
  }, []);

  // Polling servers
  useEffect(() => {
    const fetchTakeoutStatus = async () => {
      try {
        const res = await fetch('/api/takeout/status');
        if (res.ok) {
          const d = await res.json();
          setTakeoutStatus(d);
        }
      } catch (e) {
        console.warn('[Takeout Polling Warning]:', e);
      }
    };
    fetchTakeoutStatus();
    const interval = setInterval(fetchTakeoutStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Inventory Logs
  const fetchInventoryLogs = async () => {
    try {
      const res = await fetch('/api/inventory/logs');
      if (res.ok) {
        const data = await res.json();
        setDbInventoryLogs(data);
      }
    } catch (e) {
      console.warn('[Inventory logs load error]:', e);
    }
  };

  useEffect(() => {
    fetchInventoryLogs();
  }, [ingredients, orders]);

  // Load Google members statistics
  const loadMembers = () => {
    const dbStr = localStorage.getItem('google-members-database');
    if (dbStr) {
      try {
        setMembersList(JSON.parse(dbStr));
      } catch (e) {
        setMembersList([]);
      }
    } else {
      const defaultMembers = [
        { email: 'topztar@gmail.com', name: '沙貝忠實饕客', avatar: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=150', points: 1500, joinedAt: '2026-05-15' },
        { email: 'thai_foodie@gmail.com', name: '曼谷香辣姬', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', points: 2840, joinedAt: '2026-05-20' },
        { email: 'vegan_sabay@gmail.com', name: '小農蔬食愛好客', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', points: 650, joinedAt: '2026-05-28' }
      ];
      localStorage.setItem('google-members-database', JSON.stringify(defaultMembers));
      setMembersList(defaultMembers);
    }
  };

  useEffect(() => {
    loadMembers();
    window.addEventListener('storage', loadMembers);
    window.addEventListener('local-points-updated', loadMembers);
    return () => {
      window.removeEventListener('storage', loadMembers);
      window.removeEventListener('local-points-updated', loadMembers);
    };
  }, []);

  // Members points modification rules
  const handleAdjustPoints = (email: string) => {
    const amountStr = window.prompt(`請輸入要為 ${email} 調整的點數金額 (輸入正整數增加累計點數，輸入負數扣除扣除點數，如: -300)：`);
    if (amountStr === null) return;
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount)) {
      alert('❌ 請輸入有效的整數金額！');
      return;
    }
    const dbStr = localStorage.getItem('google-members-database');
    if (dbStr) {
      try {
        const db = JSON.parse(dbStr);
        const updated = db.map((m: any) => {
          if (m.email === email) {
            const finalPoints = Math.max(0, m.points + amount);
            localStorage.setItem(`google-points-${email}`, String(finalPoints));
            return { ...m, points: finalPoints };
          }
          return m;
        });
        localStorage.setItem('google-members-database', JSON.stringify(updated));
        setMembersList(updated);
        window.dispatchEvent(new Event('local-points-updated'));
        alert(`✅ 會員點數手動核銷調整成功！`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteMember = (email: string) => {
    if (window.confirm(`⚠️ 安全確定：您真的要刪除 ${email} 會員帳號嗎？該累積點數將一併註銷清空。`)) {
      const dbStr = localStorage.getItem('google-members-database');
      if (dbStr) {
        try {
          const db = JSON.parse(dbStr);
          const updated = db.filter((m: any) => m.email !== email);
          localStorage.setItem('google-members-database', JSON.stringify(updated));
          setMembersList(updated);
          localStorage.removeItem(`google-points-${email}`);
          window.dispatchEvent(new Event('local-points-updated'));
          alert(`✅ 已刪除該會員帳目統計。`);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Change PIN Security Rule
  const handlePinChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    setPinChangeSuccess(null);
    if (newPinInput !== confirmPinInput) {
      setPinChangeError('兩次輸入的新金鑰不一致！');
      return;
    }
    if (!/^\d{6}$/.test(newPinInput)) {
      setPinChangeError('新金鑰必須為 6 位半形數字！');
      return;
    }
    setPinChangeLoading(true);
    try {
      const res = await fetch('/api/printer/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin: currentPinInput, newPin: newPinInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setPinChangeSuccess('🎉 員工解鎖金鑰變更成功！');
        setCurrentPinInput('');
        setNewPinInput('');
        setConfirmPinInput('');
      } else {
        setPinChangeError(data.error || '金鑰更新失敗');
      }
    } catch (err) {
      setPinChangeError('與伺服器連線或程序異常！');
    } finally {
      setPinChangeLoading(false);
    }
  };

  // Restock trigger
  const handleRestockClick = async (id: string) => {
    const qty = restockAmount[id] || 20;
    await onRestock(id, qty);
    setRestockAmount({ ...restockAmount, [id]: 0 });
    alert('🎉 材料進貨完成！原料總水位已更新。');
  };

  const handleManualAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAdjustId || !manualAdjustQty) {
      alert('❌ 請選擇原料並輸入異動數量！');
      return;
    }
    const qty = Number(manualAdjustQty);
    if (isNaN(qty) || qty === 0) {
      alert('❌ 數量必須為非零有效實數！');
      return;
    }
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId: manualAdjustId,
          quantityChanged: qty,
          note: manualAdjustNote.trim() || '大後台管理員手動盤存調整'
        })
      });
      if (res.ok) {
        alert('🎉 耗損調整登記登入成功！進銷存日記帳已重算。');
        setManualAdjustQty('');
        setManualAdjustNote('');
        await fetchInventoryLogs();
        await onRestock(manualAdjustId, 0); // Sync parent
      } else {
        const d = await res.json();
        alert(`❌ 手動調整失敗：${d.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper utility to write out an Excel-friendly CSV with UTF-8 BOM
  const exportToCSV = (data: any[], headersMap: { [key: string]: string }, filename: string) => {
    if (!data || data.length === 0) {
      alert('❌ 無明細數據可供匯出！');
      return;
    }
    const rawKeys = Object.keys(data[0]);
    const headersLine = rawKeys.map(k => headersMap[k] || k).join(',');
    const rows = data.map(item => {
      return rawKeys.map(k => {
        let val = item[k];
        let str = typeof val === 'object' ? JSON.stringify(val) : String(val === undefined || val === null ? '' : val);
        str = str.replace(/"/g, '""');
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
          return `"${str}"`;
        }
        return str;
      }).join(',');
    });
    const csvContent = "\uFEFF" + [headersLine, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Order Filtering Engine
  const filteredOrders = useMemo(() => {
    let list = [...orders];
    const todayStr = new Date().toISOString().split('T')[0];

    if (dateRangeFilter === 'today') {
      list = list.filter(o => o.createdAt.startsWith(todayStr));
    } else if (dateRangeFilter === 'week') {
      const sevenDays = new Date(Date.now() - 7 * 24 * 3600 * 1000);
      list = list.filter(o => new Date(o.createdAt) >= sevenDays);
    } else if (dateRangeFilter === 'month') {
      const thirtyDays = new Date(Date.now() - 30 * 24 * 3600 * 1000);
      list = list.filter(o => new Date(o.createdAt) >= thirtyDays);
    } else if (dateRangeFilter === 'custom') {
      if (orderQueryStartDate) {
        const start = new Date(orderQueryStartDate + 'T00:00:00');
        list = list.filter(o => new Date(o.createdAt) >= start);
      }
      if (orderQueryEndDate) {
        const end = new Date(orderQueryEndDate + 'T23:59:59');
        list = list.filter(o => new Date(o.createdAt) <= end);
      }
    }

    if (orderQueryStatus !== 'all') {
      list = list.filter(o => o.status === orderQueryStatus);
    }

    if (orderQueryKeyword.trim()) {
      const k = orderQueryKeyword.toLowerCase().trim();
      list = list.filter(o => 
        o.id.toLowerCase().includes(k) || 
        o.customerName.toLowerCase().includes(k) ||
        (o.tableNumber && o.tableNumber.includes(k))
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, dateRangeFilter, orderQueryStartDate, orderQueryEndDate, orderQueryStatus, orderQueryKeyword]);

  // Aggregate stats in the filtered interval:
  const filteredStats = useMemo(() => {
    const activeOrders = filteredOrders.filter(o => o.status !== 'cancelled');
    const totalRev = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const count = filteredOrders.length;
    const aov = count > 0 ? Math.round(totalRev / count) : 0;
    
    const memberSales = activeOrders.filter(o => o.isMember).reduce((sum, o) => sum + o.total, 0);
    const memberShare = totalRev > 0 ? (memberSales / totalRev) * 100 : 0;

    return { revenue: totalRev, count, aov, memberShare };
  }, [filteredOrders]);

  // Export Orders CSV Report
  const handleExportOrdersReport = () => {
    const flatData = filteredOrders.map(o => ({
      id: o.id,
      createdAt: new Date(o.createdAt).toLocaleString(),
      tableNumber: o.tableNumber,
      customerName: o.customerName,
      paymentMethod: o.paymentMethod === 'linepay' ? 'TWQR支付' : (o.paymentMethod === 'credit' ? '信用卡' : (o.paymentMethod === 'member' ? '會員儲值' : '現金')),
      subtotal: o.subtotal,
      serviceCharge: o.serviceCharge,
      total: o.total,
      status: o.status === 'completed' ? '已出餐完成' : (o.status === 'pending' ? '未處置待理' : (o.status === 'preparing' ? '配餐準備中' : '已取消復歸')),
      isMember: o.isMember ? 'Google會員' : '非會員一般餐客'
    }));
    const map = {
      id: '訂單單號', createdAt: '銷售日期時間', tableNumber: '桌位號碼',
      customerName: '客戶名稱', paymentMethod: '付清途徑',
      subtotal: '餐點小計金額', serviceCharge: '服務費', total: '結賬實付總金額',
      status: '點單狀態', isMember: '是否已綁載Google會員'
    };
    exportToCSV(flatData, map, `沙貝燒烤-銷售財務報表-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Export Inventory CSV Report 
  const handleExportInventoryReport = () => {
    const flatData = dbInventoryLogs.map(l => ({
      timestamp: new Date(l.timestamp).toLocaleString(),
      ingredientName: l.ingredientName,
      type: l.type === 'incoming' ? '大批入採進貨' : (l.type === 'outgoing' ? '顧客消費抵消' : '手控盤核壞報'),
      quantityChanged: `${l.quantityChanged > 0 ? '+' : ''}${l.quantityChanged}`,
      remainingStock: l.remainingStock,
      note: l.note
    }));
    const map = {
      timestamp: '交易過帳時間', ingredientName: '原料名稱',
      type: '交易屬性型態', quantityChanged: '異動數量增減',
      remainingStock: '期末殘存現有庫量', note: '盤損事件錄記備註'
    };
    exportToCSV(flatData, map, `沙貝燒烤-進銷存流帳報表-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Recharts calculations
  const chartCategoryData = useMemo(() => {
    return analytics.categorySales.map((item) => {
      const foundCat = categories.find((c) => c.id === item.category);
      return {
        name: foundCat ? foundCat.name[currentLang] || foundCat.name['zh'] : item.category,
        '營業額 NT$': item.revenue,
      };
    });
  }, [analytics.categorySales, categories, currentLang]);

  const chartHourlyData = useMemo(() => {
    return analytics.hourlyDistribution.map((item) => ({
      '用餐時段': item.timeSlot,
      '下單數量': item.orders,
    }));
  }, [analytics.hourlyDistribution]);

  // Categories forms triggers
  const triggerAddCatMode = () => {
    setEditingCategory(null);
    setCatId('');
    setCatNameZh('');
    setCatNameEn('');
    setCatNameTh('');
    setCatNameJa('');
    setCatNameKo('');
    setCatError(null);
    setCatShowOnCustomer(true);
    setIsCatFormOpen(true);
  };

  const triggerEditCatMode = (cat: Category) => {
    setEditingCategory(cat);
    setCatId(cat.id);
    setCatNameZh(cat.name?.zh || '');
    setCatNameEn(cat.name?.en || '');
    setCatNameTh(cat.name?.th || '');
    setCatNameJa(cat.name?.ja || '');
    setCatNameKo(cat.name?.ko || '');
    setCatError(null);
    setCatShowOnCustomer(cat.showOnCustomerPage !== false);
    setIsCatFormOpen(true);
  };

  const handleSaveCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError(null);
    const cleanId = catId.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
    if (!cleanId || !catNameZh) {
      setCatError('請輸入完整的類別識別 ID 碼以及中文正體標題！');
      return;
    }
    const payloadName = {
      zh: catNameZh,
      en: catNameEn || catNameZh,
      th: catNameTh || catNameZh,
      ja: catNameJa || catNameZh,
      ko: catNameKo || catNameZh,
    };
    if (editingCategory) {
      if (onEditCategory) {
        const r = await onEditCategory(editingCategory.id, payloadName, catShowOnCustomer);
        if (r.success) setIsCatFormOpen(false);
        else setCatError(r.error || '保存出錯');
      }
    } else {
      if (onAddCategory) {
        const r = await onAddCategory(cleanId, payloadName, catShowOnCustomer);
        if (r.success) setIsCatFormOpen(false);
        else setCatError(r.error || '新增出錯');
      }
    }
  };

  // Table form triggers
  const triggerEditTableMode = (tb: TableConfig) => {
    setEditingTableObj(tb);
    setTableIdInput(tb.id);
    setTableQrUrlInput(tb.qrCodeUrl);
    setTableError(null);
    setTableSuccess(null);
    setIsTableFormOpen(true);
  };

  const handleTableSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTableError(null);
    setTableSuccess(null);
    const cleanId = tableIdInput.trim();
    if (!cleanId) {
      setTableError('請填載桌位號碼！');
      return;
    }
    if (editingTableObj) {
      const r = await onEditTable(editingTableObj.id, tableQrUrlInput);
      if (r.success) {
        setTableSuccess('桌次資訊儲存更新成功！');
        setTimeout(() => setIsTableFormOpen(false), 1200);
      } else {
        setTableError(r.error || '儲存更新失敗');
      }
    } else {
      const r = await onAddTable(cleanId, tableQrUrlInput);
      if (r.success) {
        setTableSuccess('成功新增全店桌席與 QR 點餐定位元件！');
        setTableIdInput('');
        setTableQrUrlInput('');
        setTimeout(() => setIsTableFormOpen(false), 1500);
      } else {
        setTableError(r.error || '此桌號已存在');
      }
    }
  };

  // Menu Items form triggers
  const triggerAddMenuItemMode = () => {
    setEditingItem(null);
    setItemNameZh('');
    setItemNameEn('');
    setItemCategory(categories[0]?.id || 'skewers');
    setItemPrice(100);
    setItemImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400');
    setItemDescZh('');
    setItemDescEn('');
    setHasNoodles(false);
    setIsNotSpicy(false);
    setCustomAddOns([]);
    setIsFormOpen(true);
  };

  const triggerEditMenuItemMode = (item: any) => {
    setEditingItem(item);
    setItemNameZh(item.name.zh || '');
    setItemNameEn(item.name.en || '');
    setItemCategory(item.category || 'skewers');
    setItemPrice(item.price || 100);
    setItemImage(item.image || '');
    setItemDescZh(item.description?.zh || '');
    setItemDescEn(item.description?.en || '');
    setHasNoodles(!!item.hasNoodlesOption);
    setIsNotSpicy(!!item.isNotSpicy);
    setCustomAddOns(Array.isArray(item.customAddOns) ? [...item.customAddOns] : []);
    setIsFormOpen(true);
  };

  const handleSaveItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemNameZh || itemPrice <= 0) {
      alert('請填載正確餐點名稱及有效金額！');
      return;
    }
    const payload = {
      name: { zh: itemNameZh, en: itemNameEn || itemNameZh, ko: itemNameZh, ja: itemNameZh, th: itemNameZh },
      price: Number(itemPrice),
      image: itemImage,
      description: { zh: itemDescZh, en: itemDescEn || itemDescZh, ko: itemDescZh, ja: itemDescZh, th: itemDescZh },
      category: itemCategory,
      available: true,
      hasNoodlesOption: hasNoodles,
      isNotSpicy: isNotSpicy,
      customAddOns: customAddOns,
    };
    if (editingItem) {
      if (onEditMenuItem) {
        await onEditMenuItem(editingItem.id, payload);
      }
    } else {
      if (onAddMenuItem) {
        await onAddMenuItem(payload);
      }
    }
    setIsFormOpen(false);
    setEditingItem(null);
    alert('🎉 餐點設定資訊儲存成功！');
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !promoMessage) return;
    await onSendPromoPush({ title: promoTitle, message: promoMessage, badge: promoBadge });
    setPushSentConfirm(true);
    setTimeout(() => setPushSentConfirm(false), 4500);
  };

  // Ingredient Recipe Maps definition for local recipe cards auditing 
  const recipeCompositionMap: { [key: string]: { name: string; qty: string }[] } = {
    'ty-01': [{ name: '大鮮蝦', qty: '3 只 / pcs' }, { name: '頂級椰奶罐', qty: '0.1 罐 / can' }],
    'ty-02': [{ name: '大鮮蝦', qty: '2 只 / pcs' }, { name: '頂級牛肉串面料', qty: '1 串 / skewer' }, { name: '頂級椰奶罐', qty: '0.1 罐' }],
    'nd-01': [{ name: '大鮮蝦', qty: '4 只' }, { name: '多隆功泡麵 / 米線', qty: '1 包 / pack' }],
    'nd-02': [{ name: '大鮮蝦', qty: '2 只' }, { name: '多隆功泡麵 / 米線', qty: '1 包' }],
    'cb-01': [{ name: '頂級牛肉串', qty: '1 串' }, { name: '爆香豬五花 / 金針', qty: '1 份' }, { name: '泰手標紅茶原料', qty: '0.35 升' }]
  };

  return (
    <div className="space-y-6 text-white" id="manager-dashboard-container">
      {/* 1. Dynamic Tab Switcher */}
      {activeSubTab !== 'eod' && activeSubTab !== 'cashier' && (
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4" id="admin-subtabs-nav">
          {[
            { id: 'stats', label: '📊 營運數據分析', desc: '全店每日銷售分析、客流量時段與菜品排行' },
            { id: 'orders', label: '💳 帳務核數與細單', desc: '日/周/月、自訂區間銷售合算，明細登錄核對' },
            { id: 'inventory', label: '📦 進銷存與耗損', desc: '原料庫存流動日誌、安全警量、盤損核對調整' },
            { id: 'menu', label: '🍜 菜品與類別編輯', desc: '菜單單品與可售狀態、客製選項、全店類別更新' },
            { id: 'members', label: '⚙️ 會員、桌席與系統', desc: 'Google 會員統計、桌席二維碼、員工PIN變更' },
            { id: 'printer', label: '🖨️ 印表機與硬體', desc: '分離雙機：廚房印表機、帳單印表機寬度與連線' },
            { id: 'options', label: '🧩 客製選項管理器', desc: '設定全店客製選項規則 (例如：加河粉、熟度、辣度)' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                if (onSubTabChange) {
                  onSubTabChange(tab.id as any);
                }
              }}
              className={`flex flex-col items-start px-5 py-3 rounded-lg border text-left transition-all outline-none ${
                activeSubTab === tab.id
                  ? 'bg-[#E5B453] border-[#E5B453] text-black shadow-md font-black scale-[1.01]'
                  : 'bg-[#121212] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="font-bold text-sm tracking-wide">{tab.label}</span>
              <span className="text-[10px] opacity-80 mt-1 font-normal line-clamp-1">{tab.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* ==================== TAB 1: OPERATIONAL ANALYTICS ==================== */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6 animate-fadeIn" id="subtab-section-stats">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-kpi-grid">
            <div className="bg-[#161616] rounded-xl p-5 border border-white/10 shadow-sm flex items-center space-x-4">
              <div className="bg-amber-500/10 text-[#E5B453] p-3 rounded-lg">
                <Coins size={22} className="text-[#E5B453]" />
              </div>
              <div className="text-left font-sans">
                <span className="text-xs text-white/45 font-black uppercase tracking-wider block">累計點餐營業額</span>
                <p className="text-xl font-black text-white font-mono mt-0.5">NT$ {analytics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-[#161616] rounded-xl p-5 border border-white/10 shadow-sm flex items-center space-x-4">
              <div className="bg-blue-500/10 text-blue-400 p-3 rounded-lg">
                <TrendingUp size={22} className="text-blue-400" />
              </div>
              <div className="text-left font-sans">
                <span className="text-xs text-white/45 font-black uppercase tracking-wider block">完成出單交易量</span>
                <p className="text-xl font-black text-white font-mono mt-0.5">{analytics.ordersCount} 筆交易</p>
              </div>
            </div>
            <div className="bg-[#161616] rounded-xl p-5 border border-white/10 shadow-sm flex items-center space-x-4">
              <div className="bg-rose-500/10 text-rose-400 p-3 rounded-lg">
                <AlertTriangle size={22} className="text-rose-400" />
              </div>
              <div className="text-left font-sans">
                <span className="text-xs text-white/45 font-black uppercase tracking-wider block">食材庫存水位警報</span>
                <p className="text-xl font-black text-white font-mono mt-0.5">
                  {analytics.stockWarnings.length > 0 ? (
                    <span className="text-rose-400 animate-pulse">{analytics.stockWarnings.length} 個料件告警</span>
                  ) : (
                    <span className="text-emerald-400 text-sm font-semibold">健康安全 ok</span>
                  )}
                </p>
              </div>
            </div>
            <div className="bg-[#161616] rounded-xl p-5 border border-white/10 shadow-sm flex items-center space-x-4">
              <div className="bg-[#E5B453]/10 text-[#E5B453] p-3 rounded-lg">
                <ShoppingBag size={22} className="text-[#E5B453]" />
              </div>
              <div className="text-left font-sans">
                <span className="text-xs text-white/45 font-black uppercase tracking-wider block">外帶編號取餐序列</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  目前外帶累計: <span className="font-mono text-base font-extrabold text-[#E5B453]">#{takeoutStatus.sequence}</span> 號
                </p>
              </div>
            </div>
          </div>

          {/* Business Charts with Recharts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="manager-charts-workspace">
            {/* Category breakdown sales BarChart */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-5 shadow-sm space-y-2 text-left">
              <h4 className="font-bold text-sm text-white font-serif tracking-wide">
                📊 各類別銷售營業額分析 Sales Breakdown by Categories
              </h4>
              <p className="text-white/40 text-xs text-sans">用以分析哪些料理為沙貝之金雞母類別</p>
              <div className="h-64 pt-3" id="revenue-barchart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartCategoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickFormatter={formattedValue => `NT$ ${formattedValue}`} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#161616', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }} formatter={(value) => [`NT$ ${value}`, '營業額']} />
                    <Bar dataKey="營業額 NT$" fill="#E5B453" radius={[5, 5, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hourly busy dining line graph */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-5 shadow-sm space-y-2 text-left">
              <h4 className="font-bold text-sm text-white font-serif tracking-wide">
                📈 宵夜尖峰點餐時段趨勢 Hourly Dining Orders Trends
              </h4>
              <p className="text-white/40 text-xs">營業時間 17:30 - 00:30。有助於適當調度內外場人力。</p>
              <div className="h-64 pt-3" id="busy-hours-linechart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartHourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="用餐時段" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#161616', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }} />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="下單數量" stroke="#00C300" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top selling food rankings */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 text-left">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4">
              <Sparkles size={16} className="text-[#E5B453]" />
              <h4 className="font-bold text-sm">🔥 本店熱門人氣銷售排行 (銷量排行 Top Dishes)</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
              {analytics.topDishes.map((dish, i) => (
                <div key={dish.name} className="bg-black/30 border border-white/5 p-3 rounded-lg text-center relative overflow-hidden">
                  <span className="absolute top-0 left-0 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-br">
                    NO.{i + 1}
                  </span>
                  <p className="font-bold text-xs text-white truncate mt-2">{dish.name}</p>
                  <p className="font-mono text-xs text-blue-400 font-extrabold mt-1">{dish.qty} 份</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ==================== TAB: CASHIER REGISTRY SYSTEM ==================== */}
      {activeSubTab === 'cashier' && (
        <div className="space-y-6 animate-fadeIn" id="subtab-section-cashier">
          {/* Top Banner Alert */}
          <div className="bg-gradient-to-r from-[#E5B453]/15 via-transparent to-transparent border-l-4 border-[#E5B453] p-4 rounded-r-xl">
            <h4 className="font-bold text-sm text-[#E5B453] flex items-center gap-1.5">
              <Coins size={18} />
              <span>櫃檯收銀結帳系統 (Cashier Registry Console)</span>
            </h4>
            <p className="text-xs text-white/60 mt-1 max-w-3xl font-sans">
              此功能為櫃檯員工專用，在此操作已出餐之桌席或外帶單進行收銀結帳。支援員工手動設定「折扣減折」與「加成服務費」，設定完畢後可點擊確認完成結帳，變更將同步更新於系統銷售帳目，並即時自動備份至 Cloud Firestore 雲端資料庫。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cashier-workspace-grid">
            {/* LEFT COLUMN: ACTIVE UNPAID ORDER QUEUE (Spans full width now for a beautiful dashboard grid list) */}
            <div className="lg:col-span-12 flex flex-col space-y-4" id="cashier-queue-panel">
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-4.5 flex flex-col min-h-[500px] overflow-hidden">
                <div className="border-b border-white/5 pb-3">
                  <h5 className="font-black text-sm tracking-wide flex items-center justify-between">
                    <span>⏳ 待結帳帳單佇列 (點擊任一項目進行結帳)</span>
                    <span className="font-mono text-xs bg-amber-500/10 border border-amber-500/25 text-[#E5B453] px-2 py-0.5 rounded-full">
                      {orders.filter(o => !o.isPaid).length} 筆未結
                    </span>
                  </h5>
                </div>

                {/* Sub-Queue Filter Tabs */}
                <div className="flex flex-wrap gap-1 mt-3 mb-3">
                  {[
                    { id: 'all', label: '🗂️ 全部未結', count: orders.filter(o => !o.isPaid).length },
                    { id: 'completed', label: '✅ 廚房出餐完成', count: orders.filter(o => !o.isPaid && o.status === 'completed').length },
                    { id: 'dinein', label: '🪑 客席桌出席', count: orders.filter(o => !o.isPaid && !o.tableNumber.includes('外帶')).length },
                    { id: 'takeout', label: '🛍️ 外帶佇列', count: orders.filter(o => !o.isPaid && o.tableNumber.includes('外帶')).length }
                  ].map((subT) => {
                    const subCount = subT.count;
                    const isActive = cashierListFilter === subT.id;
                    return (
                      <button
                        key={subT.id}
                        type="button"
                        onClick={() => {
                          setCashierListFilter(subT.id as any);
                        }}
                        className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-bold h-8 flex items-center gap-1 cursor-pointer transition active:scale-95 ${
                          isActive
                            ? 'bg-[#E5B453] text-zinc-950 border-[#E5B453] font-black'
                            : 'bg-[#181818] text-white/50 border-white/5 hover:bg-white/5'
                        }`}
                      >
                        <span>{subT.label}</span>
                        {subCount > 0 && (
                          <span className={`font-mono text-[9px] px-1 rounded ${isActive ? 'bg-zinc-950 text-[#E5B453]' : 'bg-white/10 text-white/70'}`}>
                            {subCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Grid Scroll Queue */}
                <div className="flex-1 overflow-y-auto pr-1 font-sans mt-2">
                  {orders.filter(o => !o.isPaid).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/30 space-y-2 py-32">
                      <Check className="text-emerald-500 mx-auto" size={32} />
                      <p className="text-xs font-bold text-white/80">
                        目前全店暫無已出餐或未結帳訂單！
                      </p>
                      <p className="text-[10px]">
                        所有客人的帳目均已收銀完成。
                      </p>
                    </div>
                  ) : filteredCashierOrders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/30 py-32">
                      <p className="text-xs font-bold">此篩選條件下無待結帳帳單</p>
                      <p className="text-[10px] mt-1">請切換其他佇列類別</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCashierOrders.map((order) => {
                        const isSelected = selectedCashierOrderId === order.id;
                        const isCompletedInKitchen = order.status === 'completed';
                        
                        // Calculate minimum spend warning criteria
                        const isDineIn = !order.tableNumber.includes('外帶');
                        const orderGuests = order.guestCount || 1;
                        const avgAmt = order.total / orderGuests;
                        const orderCreatedAtTime = new Date(order.createdAt).getTime();
                        const timeElapsedMs = Date.now() - orderCreatedAtTime;
                        const isSimulated = simulatedElapsedOrders.includes(order.id);
                        
                        const orderIsHourElapsed = (timeElapsedMs >= 3600000) || isSimulated;
                        const orderBelowMinSpend = avgAmt < minSpend;
                        const showDineInAlert = isDineIn && orderBelowMinSpend && orderIsHourElapsed;

                        return (
                          <div
                            key={order.id}
                            id={`cashier-queue-item-${order.id}`}
                            onClick={() => setSelectedCashierOrderId(order.id)}
                            className={`border rounded-xl p-4 text-left cursor-pointer transition duration-150 relative overflow-hidden group flex flex-col justify-between ${
                              isSelected
                                ? 'bg-zinc-950 border-[#E5B453] shadow-md shadow-[#E5B453]/10'
                                : showDineInAlert
                                  ? 'bg-rose-950/20 border-rose-500/50 hover:bg-rose-950/30'
                                  : 'bg-[#181818] border-white/5 hover:border-[#E5B453]/40 hover:bg-zinc-900 shadow-sm'
                            }`}
                          >
                            {/* Corner accent if kitchen is completed */}
                            {isCompletedInKitchen && (
                              <span className="absolute top-0 right-0 text-[9px] font-black bg-emerald-500/10 text-emerald-400 border-l border-b border-emerald-500/20 px-2 py-0.5 rounded-bl">
                                ✨ 廚房已出餐
                              </span>
                            )}

                            <div>
                              <div className="flex justify-between items-start">
                                <div className="space-y-1 font-sans">
                                  <div className="flex items-center gap-1.55">
                                    <span className="font-mono text-xs font-extrabold text-white/40 group-hover:text-white/60">
                                      #{order.id}
                                    </span>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded font-mono ${
                                      order.tableNumber.includes('外帶')
                                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    }`}>
                                      {order.tableNumber.includes('外帶') ? '🛍️ 外帶' : `🪑 客出席`}
                                    </span>
                                  </div>
                                  <h6 className="font-bold text-sm text-white/95 mt-1">
                                    桌次: {order.tableNumber} 桌 {isDineIn && <span className="text-zinc-400 font-normal text-xs">({orderGuests} 人)</span>}
                                  </h6>
                                </div>
                                <div className="text-right space-y-1">
                                  <p className="font-mono text-sm font-extrabold text-[#E5B453]">
                                    NT$ {order.total}
                                  </p>
                                  <p className="text-[10px] text-zinc-500">
                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>

                              {isDineIn && (
                                <div className="mt-2 text-[10px] text-zinc-400 space-y-1 bg-black/30 p-2 rounded-lg border border-white/5">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">均消限額:</span>
                                    <span className="font-bold text-white">NT$ {Math.round(avgAmt)} /人</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">內用低消:</span>
                                    <span className="font-bold text-amber-500">NT$ {minSpend} /人</span>
                                  </div>
                                  <div className="flex justify-between text-[9px] text-zinc-500 pt-1 border-t border-white/5">
                                    <span>用時: {Math.floor(timeElapsedMs / 60000)} 分鐘</span>
                                    {!orderIsHourElapsed ? (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSimulatedElapsedOrders(prev => [...prev, order.id]);
                                        }}
                                        className="text-[9px] hover:text-[#E5B453] bg-white/5 hover:bg-[#E5B453]/10 border border-white/10 px-1.5 py-0.5 rounded transition cursor-pointer"
                                      >
                                        ⏱️ 模擬 +1hr
                                      </button>
                                    ) : (
                                      <span className="text-amber-500 font-bold">⚠️ 用餐超時已解鎖</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {showDineInAlert && (
                                <div className="mt-2.5 p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-extrabold rounded-lg animate-pulse text-center leading-normal">
                                  🚨 未達到低消，用餐時間結束
                                </div>
                              )}

                              <div className="mt-3 text-[11px] text-zinc-400 border-t border-white/5 pt-2.5">
                                <p className="truncate text-left text-zinc-300">
                                  {order.items.map(it => `${it.name.zh} x${it.qty}`).join(', ')}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3.5 pt-2 border-t border-dashed border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                              <span className="text-[10px] text-zinc-500">
                                支付: {order.paymentMethod.toUpperCase()}
                              </span>
                              <span className="font-bold text-[#E5B453] bg-[#E5B453]/10 border border-[#E5B453]/20 px-3 py-1 rounded-lg group-hover:bg-[#E5B453] group-hover:text-black transition whitespace-nowrap">
                                {isSelected ? '收銀中' : '現正結帳 ➔'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FLOATING CASHIER MODAL DIALOG OVERLAY (Pops up when an order is selected) */}
            {cashierSelectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" id="cashier-checkout-details-panel">
                <div className="bg-[#121212] border border-white/15 rounded-2xl p-6 w-full max-w-4xl max-h-[96vh] flex flex-col relative shadow-2xl animate-scaleUp">
                  {/* Top Close button icon */}
                  <button
                    type="button"
                    onClick={() => setSelectedCashierOrderId(null)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition p-2.5 hover:bg-white/5 rounded-full cursor-pointer z-10"
                    title="關閉視窗 Close Dialog"
                  >
                    ✕
                  </button>

                  <div className="flex-1 flex flex-col justify-between min-h-0" id="cashier-active-register-area">
                    {/* Upper content scrollable */}
                    <div className="flex-1 overflow-y-auto space-y-4 text-left pr-2">
                      {/* Active Order Header */}
                      <div className="border-b border-white/5 pb-3.5 flex justify-between items-start">
                        <div className="space-y-1 font-sans">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-[#E5B453] bg-[#E5B453]/10 border border-[#E5B453]/35 px-2 py-0.5 rounded font-black">
                              {cashierSelectedOrder.id}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-400">
                              {new Date(cashierSelectedOrder.createdAt).toLocaleTimeString()} · 下單時間
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap mt-1">
                            <h4 className="font-extrabold text-base text-white flex items-center gap-1.5">
                              <ShoppingBag size={18} className="text-[#E5B453]" />
                              <span>櫃檯收銀中： 第 {cashierSelectedOrder.tableNumber} {cashierSelectedOrder.tableNumber.includes('外帶') ? '' : '桌'}</span>
                            </h4>
                            {editingOrderTableId === cashierSelectedOrder.id ? (
                              <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-lg px-2 py-1" id="editing-order-table-section-cashier">
                                <select
                                  value={editingOrderTableValue}
                                  onChange={(e) => setEditingOrderTableValue(e.target.value)}
                                  className="bg-[#1c1c1c] border border-white/20 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E5B453]"
                                >
                                  <optgroup label="客席就座桌號">
                                    {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((num) => (
                                      <option key={num} value={num}>
                                        🪑 第 {num} 桌 (Dine-in)
                                      </option>
                                    ))}
                                    {tables && tables.map((t) => (
                                      !Array.from({ length: 12 }, (_, i) => String(i + 1)).includes(t.id) && (
                                        <option key={t.id} value={t.id}>
                                          🪑 第 {t.id} 桌
                                        </option>
                                      )
                                    ))}
                                  </optgroup>
                                  <optgroup label="外帶自取佇列">
                                    {Array.from({ length: 15 }, (_, i) => `外帶 #${i + 1}`).map((takeoutId) => (
                                      <option key={takeoutId} value={takeoutId}>
                                        🛍️ {takeoutId} (Takeout)
                                      </option>
                                    ))}
                                  </optgroup>
                                </select>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (onUpdateTableNumber) {
                                      const res = await onUpdateTableNumber(cashierSelectedOrder.id, editingOrderTableValue);
                                      if (res.success) {
                                        cashierSelectedOrder.tableNumber = editingOrderTableValue;
                                        setEditingOrderTableId(null);
                                      } else {
                                        alert(res.error || '變更桌號失敗');
                                      }
                                    } else {
                                      cashierSelectedOrder.tableNumber = editingOrderTableValue;
                                      setEditingOrderTableId(null);
                                    }
                                  }}
                                  className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded cursor-pointer transition active:scale-95"
                                >
                                  儲存
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingOrderTableId(null)}
                                  className="text-[10px] bg-zinc-700 hover:bg-zinc-650 text-zinc-300 font-extrabold px-2 py-0.5 rounded cursor-pointer transition active:scale-95"
                                >
                                  取消
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingOrderTableId(cashierSelectedOrder.id);
                                  setEditingOrderTableValue(cashierSelectedOrder.tableNumber);
                                }}
                                className="text-[10px] text-[#E5B453] hover:text-amber-300 bg-white/5 border border-white/5 hover:border-[#E5B453]/20 px-2 py-1 rounded cursor-pointer transition font-bold"
                              >
                                ✎ 更改桌號/外帶
                              </button>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedCashierOrderId(null)}
                          className="mr-8 text-zinc-400 hover:text-white transition active:scale-95 text-xs border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 cursor-pointer font-bold"
                        >
                          關閉帳單 Exit
                        </button>
                      </div>

                      {/* Dine-In Minimum Spend Reminder Alert (Flashing/Flashing) */}
                      {(() => {
                        const isDineIn = !cashierSelectedOrder.tableNumber.includes('外帶');
                        const orderGuests = cashierSelectedOrder.guestCount || 1;
                        const avgAmt = cashierSelectedOrder.total / orderGuests;
                        const orderCreatedAtTime = new Date(cashierSelectedOrder.createdAt).getTime();
                        const timeElapsedMs = Date.now() - orderCreatedAtTime;
                        const isSimulated = simulatedElapsedOrders.includes(cashierSelectedOrder.id);
                        
                        const orderIsHourElapsed = (timeElapsedMs >= 3600000) || isSimulated;
                        const orderBelowMinSpend = avgAmt < minSpend;
                        const showDineInAlert = isDineIn && orderBelowMinSpend && orderIsHourElapsed;

                        if (showDineInAlert) {
                          return (
                            <div className="bg-rose-500/10 border border-rose-500 text-rose-300 p-4 rounded-xl text-center font-extrabold text-xs sm:text-sm animate-pulse tracking-wide font-sans leading-relaxed">
                              🚨 未達到低消，用餐時間結束
                              <div className="text-[11px] font-medium text-rose-400 mt-1">
                                每桌內用低消人數限制: {orderGuests} 人 · 應達最低總額: {orderGuests * minSpend} 元 (目前僅有 NT$ {cashierSelectedOrder.total}，人均餐額 NT$ {Math.round(avgAmt)})
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Items Brief */}
                      <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-3">
                        <span className="text-[10px] text-zinc-500 block font-bold tracking-wider uppercase">
                          🍽️ 點餐菜品明細 ({cashierSelectedOrder.items.length} 項)
                        </span>
                        <div className="space-y-1.5 divide-y divide-white/5 text-xs">
                          {cashierSelectedOrder.items.map((it) => (
                            <div key={it.id} className="pt-1.5 flex justify-between items-center text-zinc-300 font-sans">
                              <div className="text-left space-y-0.5">
                                <p className="font-bold text-white">
                                  {it.name.zh} <span className="font-mono text-[#E5B453] ml-1">x{it.qty}</span>
                                </p>
                                {it.customization && (
                                  <span className="text-[10px] text-zinc-500 block">
                                    辣度: {['不辣', '微辣', '中辣', '泰式大辣'][it.customization.spiciness]} · 
                                    甜度: {['無糖', '減糖', '標準', '多糖'][it.customization.sweetness]}
                                    {it.customization.notes ? ` (${it.customization.notes})` : ''}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 shrink-0">
                                {/* Qty adjustments */}
                                <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5">
                                  <button
                                    type="button"
                                    onClick={() => handleCashierQtyChange(it.id, -1)}
                                    className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition cursor-pointer"
                                    title="減少"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="px-1 text-[10px] font-black text-white min-w-[12px] text-center">{it.qty}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCashierQtyChange(it.id, 1)}
                                    className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition cursor-pointer"
                                    title="增加"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                                {/* Remove button */}
                                <button
                                  type="button"
                                  onClick={() => handleCashierRemoveItem(it.id)}
                                  className="p-1 hover:bg-red-500/15 rounded text-red-400 hover:text-red-300 transition cursor-pointer"
                                  title="移除"
                                >
                                  <Trash2 size={11} />
                                </button>
                                <span className="font-mono text-white/50 text-xs min-w-[55px] text-right">
                                  NT$ {it.price * it.qty}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Dropdown to add custom new item */}
                        <div className="pt-2 border-t border-white/5 flex gap-2 items-center">
                          <label className="text-[10px] text-zinc-400 shrink-0 font-bold">加點餐點：</label>
                          <select
                            value={cashierNewItemInput}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleCashierAddMenuItem(e.target.value);
                              }
                            }}
                            className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#E5B453]"
                          >
                            <option value="">-- 🔎 選擇加點品項 (Add Dish) --</option>
                            {menuItems && menuItems.filter(item => item.isAvailable !== false).map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name.zh} (+NT$ {item.price})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Cashier Adjustments (Discount & Surcharge) Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Discount Card */}
                        <div className="bg-[#181818] border border-white/5 rounded-xl p-4 space-y-3">
                          <h6 className="text-[11px] font-bold text-white/90 flex justify-between items-center">
                            <span>🏷️ 手動折扣 (Discount Modifier)</span>
                            <span className="text-[10px] text-[#E5B453] font-mono font-bold">
                              {cashierDiscountType === 'percent' ? `${cashierDiscountRate}% OFF` : `折 NT$ ${cashierDiscountFlat}`}
                            </span>
                          </h6>

                          {/* Percent vs Flat toggle */}
                          <div className="grid grid-cols-2 bg-black/40 p-0.5 rounded-lg border border-white/5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setCashierDiscountType('percent')}
                              className={`py-1 rounded font-bold transition cursor-pointer ${
                                cashierDiscountType === 'percent'
                                  ? 'bg-[#E5B453] text-zinc-950 font-black'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              % 百分比例
                            </button>
                            <button
                              type="button"
                              onClick={() => setCashierDiscountType('flat')}
                              className={`py-1 rounded font-bold transition cursor-pointer ${
                                cashierDiscountType === 'flat'
                                  ? 'bg-[#E5B453] text-zinc-950 font-black'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              $ 固定折價
                            </button>
                          </div>

                          {/* Quick Value Selectors */}
                          {cashierDiscountType === 'percent' ? (
                            <div className="grid grid-cols-5 gap-1.5 text-[9px] font-bold font-sans">
                              {[
                                { val: 0, lbl: '無' },
                                { val: 5, lbl: '95折' },
                                { val: 10, lbl: '9折' },
                                { val: 15, lbl: '85折' },
                                { val: 20, lbl: '8折' }
                              ].map((btn) => (
                                <button
                                  key={btn.val}
                                  type="button"
                                  onClick={() => setCashierDiscountRate(btn.val)}
                                  className={`py-1 rounded-md border text-center transition cursor-pointer ${
                                    cashierDiscountRate === btn.val
                                      ? 'bg-amber-400/10 text-amber-400 border-amber-400/40 font-black'
                                      : 'bg-black/20 text-zinc-400 border-transparent hover:border-white/10'
                                  }`}
                                >
                                  {btn.lbl}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-5 gap-1.5 text-[9px] font-bold font-sans">
                              {[
                                { val: 0, lbl: '無' },
                                { val: 50, lbl: '$50' },
                                { val: 100, lbl: '$100' },
                                { val: 200, lbl: '$200' },
                                { val: 300, lbl: '$300' }
                              ].map((btn) => (
                                <button
                                  key={btn.val}
                                  type="button"
                                  onClick={() => setCashierDiscountFlat(btn.val)}
                                  className={`py-1 rounded-md border text-center transition cursor-pointer ${
                                    cashierDiscountFlat === btn.val
                                      ? 'bg-amber-400/10 text-amber-400 border-amber-400/40 font-black'
                                      : 'bg-black/20 text-zinc-400 border-transparent hover:border-white/10'
                                  }`}
                                >
                                  {btn.lbl}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Manual Input field */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-500 block">自訂調整數值</span>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max={cashierDiscountType === 'percent' ? 100 : cashierSelectedOrder.subtotal}
                                value={cashierDiscountType === 'percent' ? cashierDiscountRate || '' : cashierDiscountFlat || ''}
                                onChange={(e) => {
                                  const val = Math.max(0, parseFloat(e.target.value) || 0);
                                  if (cashierDiscountType === 'percent') {
                                    setCashierDiscountRate(Math.min(100, val));
                                  } else {
                                    setCashierDiscountFlat(Math.min(cashierSelectedOrder.subtotal, val));
                                  }
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white font-mono text-xs font-bold focus:outline-none focus:border-[#E5B453]"
                              />
                              <span className="absolute right-2 top-1 text-[10px] font-bold text-zinc-500 font-mono">
                                {cashierDiscountType === 'percent' ? '%' : '元'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Surcharge Fee Card */}
                        <div className="bg-[#181818] border border-white/5 rounded-xl p-4 space-y-3">
                          <h6 className="text-[11px] font-bold text-white/90 flex justify-between items-center">
                            <span>📈 手動加成 (Surcharge Modifier)</span>
                            <span className="text-[10px] text-blue-400 font-mono font-bold">
                              {cashierSurchargeType === 'percent' ? `+ ${cashierSurchargeRate}%` : `+ NT$ ${cashierSurchargeFlat}`}
                            </span>
                          </h6>

                          {/* Percent vs Flat toggle */}
                          <div className="grid grid-cols-2 bg-black/40 p-0.5 rounded-lg border border-white/5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setCashierSurchargeType('percent')}
                              className={`py-1 rounded font-bold transition cursor-pointer ${
                                cashierSurchargeType === 'percent'
                                  ? 'bg-blue-500 text-white font-black'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              % 百分比例
                            </button>
                            <button
                              type="button"
                              onClick={() => setCashierSurchargeType('flat')}
                              className={`py-1 rounded font-bold transition cursor-pointer ${
                                cashierSurchargeType === 'flat'
                                  ? 'bg-blue-500 text-white font-black'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              $ 固定加成
                            </button>
                          </div>

                          {/* Quick Value Selectors */}
                          {cashierSurchargeType === 'percent' ? (
                            <div className="grid grid-cols-4 gap-1.5 text-[9px] font-bold font-sans">
                              {[
                                { val: 0, lbl: '無' },
                                { val: 5, lbl: '5% 服務' },
                                { val: 10, lbl: '10% 標準' },
                                { val: 15, lbl: '15% 加值' }
                              ].map((btn) => (
                                <button
                                  key={btn.val}
                                  type="button"
                                  onClick={() => setCashierSurchargeRate(btn.val)}
                                  className={`py-1 rounded-md border text-center transition cursor-pointer ${
                                    cashierSurchargeRate === btn.val
                                      ? 'bg-blue-400/10 text-blue-400 border-blue-400/40 font-black'
                                      : 'bg-black/20 text-zinc-400 border-transparent hover:border-white/10'
                                  }`}
                                >
                                  {btn.lbl}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-4 gap-1.5 text-[9px] font-bold font-sans">
                              {[
                                { val: 0, lbl: '無' },
                                { val: 30, lbl: '$30' },
                                { val: 50, lbl: '$50' },
                                { val: 100, lbl: '$100' }
                              ].map((btn) => (
                                <button
                                  key={btn.val}
                                  type="button"
                                  onClick={() => setCashierSurchargeFlat(btn.val)}
                                  className={`py-1 rounded-md border text-center transition cursor-pointer ${
                                    cashierSurchargeFlat === btn.val
                                      ? 'bg-blue-400/10 text-blue-400 border-blue-400/40 font-black'
                                      : 'bg-black/20 text-zinc-400 border-transparent hover:border-white/10'
                                  }`}
                                >
                                  {btn.lbl}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Manual Input field */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-500 block">自訂調整數值</span>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max={cashierSurchargeType === 'percent' ? 100 : cashierSelectedOrder.subtotal}
                                value={cashierSurchargeType === 'percent' ? cashierSurchargeRate || '' : cashierSurchargeFlat || ''}
                                onChange={(e) => {
                                  const val = Math.max(0, parseFloat(e.target.value) || 0);
                                  if (cashierSurchargeType === 'percent') {
                                    setCashierSurchargeRate(Math.min(100, val));
                                  } else {
                                    setCashierSurchargeFlat(Math.min(cashierSelectedOrder.subtotal, val));
                                  }
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white font-mono text-xs font-bold focus:outline-none focus:border-blue-500"
                              />
                              <span className="absolute right-2 top-1 text-[10px] font-bold text-zinc-500 font-mono">
                                {cashierSurchargeType === 'percent' ? '%' : '元'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method Selector Grid */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase block">
                          💳 選擇收銀支付管道 (Payment Method Selector)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'cash', label: '💵 現金收銀', desc: '實收大鈔與選管道' },
                            { id: 'credit', label: '💳 信用卡結', desc: '預設 10% 服務加成' },
                            { id: 'member', label: '⭐️ 會員儲值', desc: '扣抵會員與儲值管理' },
                            { id: 'linepay', label: '📱 TWQR支付', desc: 'TWQR 安全行動電子支付' }
                          ].map((pay) => {
                            const isAct = cashierPaymentMethod === pay.id;
                            return (
                              <button
                                key={pay.id}
                                type="button"
                                onClick={() => {
                                  const method = pay.id as any;
                                  setCashierPaymentMethod(method);
                                  if (method === 'credit' || method === 'linepay') {
                                    setCashierSurchargeRate(10);
                                    setCashierSurchargeFlat(0);
                                    setCashierSurchargeType('percent');
                                    setCashierDiscountRate(0);
                                    setCashierDiscountFlat(0);
                                  } else {
                                    setCashierSurchargeRate(0);
                                    setCashierSurchargeFlat(0);
                                    setCashierDiscountRate(0);
                                    setCashierDiscountFlat(0);
                                  }
                                }}
                                className={`text-left rounded-xl p-2.5 border cursor-pointer flex flex-col justify-between transition-all active:scale-95 duration-100 ${
                                  isAct
                                    ? pay.id === 'member'
                                      ? 'bg-amber-400/10 border-amber-400 text-white shadow shadow-amber-400/10'
                                      : 'bg-[#E5B453]/10 border-[#E5B453] text-white shadow shadow-[#E5B453]/10'
                                    : 'bg-[#161616] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                                }`}
                              >
                                <span className={`font-bold text-xs ${isAct ? 'text-[#E5B453]' : 'text-zinc-300'}`}>
                                  {pay.label}
                                </span>
                                <span className="text-[9px] opacity-60 mt-0.5 block leading-tight">
                                  {pay.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cash handling drawer if cash is chosen */}
                      {cashierPaymentMethod === 'cash' && (
                        <div className="bg-black/40 border border-white/12 p-3.5 rounded-xl flex flex-col lg:flex-row gap-4 font-sans mt-2 justify-between">
                          {/* Left Panel: Received Cash Calculations */}
                          <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-[#E5B453] font-bold block tracking-wider uppercase">💶 實收大鈔 (Cash Received Option)</span>
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <span className="absolute left-2.5 top-2 font-bold font-mono text-[#E5B453] text-[13px]">NT$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    id="cashier-received-amt-input"
                                    value={cashierCashReceived === 0 ? '' : cashierCashReceived}
                                    onChange={(e) => setCashierCashReceived(parseFloat(e.target.value.replace(/\D/g, '')) || 0)}
                                    className="w-full bg-[#161616] border border-white/10 rounded-lg py-1.5 px-2.5 pl-10 text-white font-mono text-sm font-extrabold focus:outline-none focus:border-[#E5B453] transition"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setCashierCashReceived(cashierCalculatedTotals.total)}
                                  className="px-2.5 py-2 text-xs font-sans bg-amber-500/10 border border-amber-500/30 text-[#E5B453] hover:bg-[#E5B453] hover:text-black rounded-lg transition font-black cursor-pointer whitespace-nowrap active:scale-95"
                                >
                                  剛好 Total: NT$ {cashierCalculatedTotals.total}
                                </button>
                              </div>
                            </div>

                            {/* 2. 現金收銀管道選擇 */}
                            <div className="space-y-1.5 bg-black/30 p-2 rounded-lg border border-white/5">
                              <span className="text-[9px] text-zinc-400 block font-bold uppercase tracking-wide">📦 選擇現金收銀管道 (Cash Channel)</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                {[
                                  { id: 'counter', title: '🏢 櫃檯現金', desc: 'Counter' },
                                  { id: 'kiosk', title: '🏪 自助收銀', desc: 'Self Kiosk' },
                                  { id: 'delivery', title: '🛵 外送代收', desc: 'Delivery' }
                                ].map((chan) => (
                                  <button
                                    key={`cash-chan-${chan.id}`}
                                    type="button"
                                    onClick={() => setCashierCashChannel(chan.id as any)}
                                    className={`py-1 px-1 rounded-lg border text-left cursor-pointer transition flex flex-col justify-center items-center ${
                                      cashierCashChannel === chan.id
                                        ? 'bg-[#E5B453]/20 border-[#E5B453] text-[#E5B453] font-black'
                                        : 'bg-[#121212]/90 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                                    }`}
                                  >
                                    <span className="text-[9px] font-extrabold block leading-none">{chan.title}</span>
                                    <span className="text-[8px] opacity-60 mt-0.5 block leading-none">{chan.desc}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 1. 實收大鈔可選1000、500、100 */}
                            <div className="space-y-1">
                              <span className="text-[9px] text-zinc-500 block font-bold">單張面額付鈔 Set Denomination</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                {[1000, 500, 100].map((note) => (
                                  <button
                                    key={`note-set-${note}`}
                                    type="button"
                                    onClick={() => setCashierCashReceived(note)}
                                    className="py-1.5 text-xs font-mono font-black border border-white/10 hover:border-[#E5B453] hover:bg-[#E5B453]/10 bg-zinc-900 rounded-lg text-white transition cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95"
                                  >
                                    <span>NT$ {note}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] text-zinc-500 block font-bold">累加點鈔 Add Bill Notes</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                {[1000, 500, 100].map((note) => (
                                  <button
                                    key={`note-add-${note}`}
                                    type="button"
                                    onClick={() => setCashierCashReceived(prev => (prev || 0) + note)}
                                    className="py-1 text-xs font-mono font-bold border border-white/5 hover:border-[#E5B453]/40 hover:bg-[#E5B453]/10 bg-zinc-950 rounded-lg text-zinc-300 transition cursor-pointer flex items-center justify-center gap-0.5 active:scale-95"
                                  >
                                    <span>＋{note}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 💳 現金結帳確認欄 (Cash Checkout Confirmation Summary Panel) */}
                            <div className="bg-amber-500/5 border border-amber-500/30 p-2.5 rounded-xl space-y-1.5 mt-1 text-[11px] font-sans">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1 flex-wrap">
                                <span className="text-[#E5B453] font-black uppercase text-xs">📝 櫃檯現金付款確認 (Cashier Checkout Confirmation)</span>
                                <span className="bg-amber-500/10 text-amber-500 text-[9px] px-1.5 py-0.5 rounded font-black font-mono">
                                  核收核對
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-zinc-300">
                                <div className="space-y-0.5">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">應收總額 Total Due:</span>
                                    <span className="font-mono font-bold text-white">NT$ {cashierCalculatedTotals.total}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">實收現鈔 Cash Paid:</span>
                                    <span className="font-mono font-bold text-amber-400">NT$ {cashierCashReceived}</span>
                                  </div>
                                </div>
                                <div className="space-y-0.5 border-l border-white/5 pl-2.5">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">應找零錢 Change:</span>
                                    <span className="font-mono font-extrabold text-emerald-400">
                                      NT$ {Math.max(0, cashierCashReceived - cashierCalculatedTotals.total)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">收銀管道 Channel:</span>
                                    <span className="font-bold text-blue-400">
                                      {cashierCashChannel === 'counter' ? '🏢 櫃檯現金' : cashierCashChannel === 'kiosk' ? '🏪 自助收銀' : '🛵 外送代收'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {cashierCashReceived < cashierCalculatedTotals.total ? (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-1 px-2 rounded text-[10px] text-center font-bold">
                                  ⚠️ 實收金額不足！尚差 NT$ {cashierCalculatedTotals.total - cashierCashReceived} 元
                                </div>
                              ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1 px-2 rounded text-[10px] text-center font-bold">
                                  ⚡ 現金經現場核對無誤，可安全核可付款並上傳 Firestore 資料庫
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Panel: Compact, touchscreen numeric keypad */}
                          <div className="w-full lg:w-48 bg-black/20 p-2 border border-white/5 rounded-xl flex flex-col gap-1.5 self-start">
                            <span className="text-[9px] text-zinc-500 font-extrabold block text-center uppercase tracking-wider">🎯 觸控快速鍵盤 Touch Keypad</span>
                            <div className="grid grid-cols-3 gap-1">
                              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                                <button
                                  key={`keypad-${num}`}
                                  type="button"
                                  onClick={() => {
                                    setCashierCashReceived(prev => {
                                      const s = String(prev);
                                      if (prev === 0 || prev === cashierCalculatedTotals.total) {
                                        return parseFloat(num) || 0;
                                      } else {
                                        return parseFloat(s + num) || 0;
                                      }
                                    });
                                  }}
                                  className="w-full h-8 flex items-center justify-center font-mono text-xs font-bold text-white hover:text-black bg-[#1c1c1c] hover:bg-[#E5B453] border border-white/5 hover:border-transparent rounded-lg transition active:scale-95 cursor-pointer"
                                >
                                  {num}
                                </button>
                              ))}
                              {/* Bottom row: Clear, 0, Backspace */}
                              <button
                                type="button"
                                onClick={() => setCashierCashReceived(0)}
                                className="w-full h-8 flex items-center justify-center font-bold text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition active:scale-95 cursor-pointer"
                                title="清除 Clear"
                              >
                                C
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCashierCashReceived(prev => {
                                    const s = String(prev);
                                    if (prev === 0 || prev === cashierCalculatedTotals.total) {
                                      return 0;
                                    } else {
                                      return parseFloat(s + '0') || 0;
                                    }
                                  });
                                }}
                                className="w-full h-8 flex items-center justify-center font-mono text-xs font-bold text-white bg-[#1c1c1c] hover:bg-[#E5B453] hover:text-black border border-white/5 rounded-lg transition active:scale-95 cursor-pointer"
                              >
                                0
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCashierCashReceived(prev => {
                                    const s = String(prev);
                                    if (s.length <= 1) return 0;
                                    return parseFloat(s.slice(0, -1)) || 0;
                                  });
                                }}
                                className="w-full h-8 flex items-center justify-center font-mono text-xs font-bold text-zinc-400 hover:text-white bg-[#1a1a1a] hover:bg-zinc-800 border border-white/5 rounded-lg transition active:scale-95 cursor-pointer"
                                title="倒退 Backspace"
                              >
                                ⌫
                              </button>
                            </div>
                            
                            {/* Extra touch helpers: +00 */}
                            <div className="grid grid-cols-2 gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setCashierCashReceived(prev => {
                                    const s = String(prev);
                                    if (prev === 0 || prev === cashierCalculatedTotals.total) {
                                      return 0;
                                    } else {
                                      return parseFloat(s + '00') || 0;
                                    }
                                  });
                                }}
                                className="py-1 flex items-center justify-center font-mono text-[10px] bg-[#1c1c1c] border border-white/5 hover:border-zinc-700 rounded-lg transition active:scale-95 cursor-pointer text-zinc-300 font-bold"
                              >
                                00
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCashierCashReceived(prev => {
                                    const s = String(prev);
                                    if (prev === 0 || prev === cashierCalculatedTotals.total) {
                                      return 0;
                                    } else {
                                      return parseFloat(s + '000') || 0;
                                    }
                                  });
                                }}
                                className="py-1 flex items-center justify-center font-mono text-[10px] bg-[#1c1c1c] border border-white/5 hover:border-zinc-700 rounded-lg transition active:scale-95 cursor-pointer text-zinc-300 font-bold"
                              >
                                000
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Member management drawer if member is chosen */}
                      {cashierPaymentMethod === 'member' && (
                        <div className="bg-[#121824]/80 border border-blue-500/20 p-3.5 rounded-xl flex flex-col gap-3 font-sans mt-2 text-left">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-2">
                            <div className="space-y-0.5 bg-transparent">
                              <span className="text-[11px] text-blue-400 font-bold block tracking-wider uppercase">⭐️ 儲值卡結帳與快捷儲值 (Cashier Member Admin)</span>
                              <p className="text-zinc-400 text-[10px]">
                                {cashierSelectedOrder?.isMember 
                                  ? `結帳單已綁定會員：${cashierSelectedOrder.customerName}` 
                                  : '本結帳單尚未在點餐時綁定會員。預設載入沙貝忠實饕客會員進行餘額抵扣。'
                                }
                              </p>
                            </div>
                          </div>

                          {/* Quick member top-up / list check */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Left part: Member Balance Deduction Details */}
                            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-2.5">
                              <span className="text-[10px] text-blue-400 font-extrabold block uppercase tracking-wider">💳 餘額扣抵狀態</span>
                              
                              {(() => {
                                const dbStr = localStorage.getItem('google-members-database');
                                if (dbStr) {
                                  try {
                                    const db = JSON.parse(dbStr);
                                    let vipEmail = 'topztar@gmail.com'; // Default mock email
                                    
                                    // If order has an owner, check their email
                                    if (cashierSelectedOrder?.customerName) {
                                      const matched = db.find((m: any) => m.name === cashierSelectedOrder.customerName);
                                      if (matched) {
                                        vipEmail = matched.email;
                                      }
                                    }
                                    
                                    const member = db.find((m: any) => m.email === vipEmail);
                                    if (member) {
                                      const hasEnough = member.balance >= cashierCalculatedTotals.total;
                                      return (
                                        <div className="space-y-2.5">
                                          <div className="flex items-center space-x-2.5 bg-white/5 p-2 rounded-lg border border-white/5">
                                            <img referrerPolicy="no-referrer" src={member.avatar || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=150'} className="w-8 h-8 rounded-full object-cover border border-white/10" alt="" />
                                            <div>
                                              <p className="text-xs font-black text-white">{member.name}</p>
                                              <p className="text-[9px] text-zinc-500 font-mono leading-none mt-0.5">{member.email}</p>
                                            </div>
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-1.5 text-center">
                                            <div className="bg-zinc-900 px-1.5 py-1 rounded border border-white/5">
                                              <span className="text-[8px] text-zinc-500 block leading-none">當前帳存餘額</span>
                                              <span className="text-xs font-mono font-bold text-emerald-400">NT$ {member.balance || 0}</span>
                                            </div>
                                            <div className="bg-zinc-900 px-1.5 py-1 rounded border border-white/5">
                                              <span className="text-[8px] text-zinc-500 block leading-none">本次扣除金額</span>
                                              <span className="text-xs font-mono font-bold text-rose-400">NT$ {cashierCalculatedTotals.total}</span>
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between text-[11px] pt-1">
                                            <span className="text-zinc-400">扣抵後剩餘：</span>
                                            <span className="font-mono font-bold text-zinc-200">
                                              NT$ {Math.max(0, (member.balance || 0) - cashierCalculatedTotals.total)}
                                            </span>
                                          </div>

                                          {!hasEnough && (
                                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded text-[9px] font-bold">
                                              ⚠️ 顧客儲值餘額不足！請先點擊右側進行【快捷現金增值】以補足差額扣抵。
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }
                                return <p className="text-xs text-zinc-500">無會員資料或初始化錯誤</p>;
                              })()}
                            </div>

                            {/* Right part: Top up management */}
                            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-2.5">
                              <span className="text-[10px] text-zinc-300 font-extrabold block uppercase tracking-wider">💸 收銀台即時儲值 (Top-Up Engine)</span>
                              
                              <p className="text-[9px] text-zinc-400 leading-normal">
                                顧客提供現場代收現金時，收銀員在此一鍵寫入儲值額：
                              </p>

                              <div className="grid grid-cols-2 gap-1.5">
                                {[
                                  { amt: 500, lbl: '＋儲值 $500' },
                                  { amt: 1000, lbl: '＋儲值 $1000' },
                                  { amt: 2000, lbl: '＋儲值 $2000' },
                                  { amt: 3000, lbl: '＋儲值 $3000' }
                                ].map((choice) => (
                                  <button
                                    key={`cashier-top-${choice.amt}`}
                                    type="button"
                                    onClick={() => {
                                      const dbStr = localStorage.getItem('google-members-database');
                                      if (dbStr) {
                                        try {
                                          const db = JSON.parse(dbStr);
                                          let vipEmail = 'topztar@gmail.com';
                                          
                                          if (cashierSelectedOrder?.customerName) {
                                            const matched = db.find((m: any) => m.name === cashierSelectedOrder.customerName);
                                            if (matched) {
                                              vipEmail = matched.email;
                                            }
                                          }
                                          
                                          const userIndex = db.findIndex((m: any) => m.email === vipEmail);
                                          if (userIndex >= 0) {
                                            db[userIndex].balance = (db[userIndex].balance || 0) + choice.amt;
                                            localStorage.setItem('google-members-database', JSON.stringify(db));
                                            window.dispatchEvent(new Event('local-points-updated'));
                                            // Force state refresh
                                            setCashierCashReceived(prev => prev + 1);
                                            setTimeout(() => setCashierCashReceived(prev => prev - 1), 50);
                                          }
                                        } catch (e) {
                                          console.error(e);
                                        }
                                      }
                                    }}
                                    className="py-1.5 text-[10px] font-sans font-black border border-[#E5B453]/20 hover:border-[#E5B453] hover:bg-[#E5B453]/10 bg-zinc-900 text-white rounded-lg transition active:scale-95 cursor-pointer text-center"
                                  >
                                    {choice.lbl}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Area: Calculation & Submit */}
                    <div className="bg-[#161616] border-t border-white/10 p-4 rounded-xl space-y-3 font-sans mt-2.5">
                      {/* Detailed billing list */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs text-zinc-400">
                        <div className="text-left bg-black/20 p-2 border border-white/5 rounded-lg">
                          <span className="text-[9px] text-zinc-500 font-sans">原小計 Subtotal</span>
                          <p className="font-mono text-xs text-white font-bold mt-0.5">NT$ {cashierCalculatedTotals.subtotal}</p>
                        </div>
                        <div 
                          onClick={() => {
                            setIsAdjustingDiscount(!isAdjustingDiscount);
                            setIsAdjustingSurcharge(false);
                          }}
                          className={`text-left bg-black/20 p-2 border rounded-lg cursor-pointer transition active:scale-95 duration-100 group ${
                            isAdjustingDiscount ? 'border-[#E5B453] bg-zinc-900 shadow-lg' : 'border-white/5 hover:border-[#E5B453] hover:bg-zinc-900'
                          }`}
                          title="點擊此處可快速調整折扣 (Discount Modifier)"
                        >
                          <span className="text-[9px] text-[#E5B453]/80 group-hover:text-[#E5B453] font-bold flex items-center justify-between font-sans">
                            <span>割引折扣 Discount ⚙️</span>
                            <span className="text-[8px] opacity-65">{isAdjustingDiscount ? '調整中' : '點擊調整'}</span>
                          </span>
                          <p className="font-mono text-xs text-rose-400 font-bold mt-0.5">
                            {cashierCalculatedTotals.discount > 0 ? `- NT$ ${cashierCalculatedTotals.discount}` : 'NT$ 0'}
                          </p>
                        </div>
                        <div 
                          onClick={() => {
                            setIsAdjustingSurcharge(!isAdjustingSurcharge);
                            setIsAdjustingDiscount(false);
                          }}
                          className={`text-left bg-black/20 p-2 border rounded-lg cursor-pointer transition active:scale-95 duration-100 group ${
                            isAdjustingSurcharge ? 'border-blue-500 bg-zinc-900 shadow-lg' : 'border-white/5 hover:border-blue-500 hover:bg-zinc-900'
                          }`}
                          title="點擊此處可快速調整加成 (Surcharge Modifier)"
                        >
                          <span className="text-[9px] text-[#4b9eff]/80 group-hover:text-blue-400 font-bold flex items-center justify-between font-sans">
                            <span>服務成加 Surcharge ⚙️</span>
                            <span className="text-[8px] opacity-65">{isAdjustingSurcharge ? '調整中' : '點擊調整'}</span>
                          </span>
                          <p className="font-mono text-xs text-blue-400 font-bold mt-0.5">
                            {cashierCalculatedTotals.surcharge > 0 ? `+ NT$ ${cashierCalculatedTotals.surcharge}` : 'NT$ 0'}
                          </p>
                        </div>
                        <div className="text-left bg-[#1f1e1b] p-2 border border-amber-500/20 rounded-lg">
                          <span className="text-[9px] text-amber-500 font-bold">總實收 Pay Total</span>
                          <p className="font-mono text-sm text-[#E5B453] font-black mt-0.5">NT$ {cashierCalculatedTotals.total}</p>
                        </div>
                      </div>

                      {/* Interactive Drawer for Adjusting Discount or Surcharge */}
                      {(isAdjustingDiscount || isAdjustingSurcharge) && (
                        <div className="bg-zinc-950 border border-white/10 p-3.5 rounded-xl space-y-3.5 animate-fadeIn">
                          {isAdjustingDiscount && (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[#E5B453] flex items-center gap-1.5 font-sans">
                                  <span>🏷️ 調整折扣 Discount Modifier</span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-[#E5B453]/25">
                                    {cashierDiscountType === 'percent' ? `${cashierDiscountRate}% OFF` : `折抵 NT$ ${cashierDiscountFlat}`}
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setIsAdjustingDiscount(false)}
                                  className="text-[11px] font-bold text-zinc-400 hover:text-white px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 transition active:scale-95 cursor-pointer font-sans"
                                >
                                  確認帶入 Apply & Close
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex bg-black p-0.5 rounded-xl border border-white/10 text-[11px] font-sans">
                                  <button
                                    type="button"
                                    onClick={() => setCashierDiscountType('percent')}
                                    className={`px-3.5 py-1.5 rounded-lg font-bold transition duration-150 cursor-pointer ${
                                      cashierDiscountType === 'percent'
                                        ? 'bg-[#E5B453] text-zinc-950 font-black'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                                  >
                                    % 比例折扣
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCashierDiscountType('flat')}
                                    className={`px-3.5 py-1.5 rounded-lg font-bold transition duration-150 cursor-pointer ${
                                      cashierDiscountType === 'flat'
                                        ? 'bg-[#E5B453] text-zinc-950 font-black'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                                  >
                                    $ 固定金額
                                  </button>
                                </div>

                                <div className="flex-1 relative flex items-center">
                                  <span className="absolute left-3 font-mono font-bold text-zinc-500 text-xs">
                                    {cashierDiscountType === 'percent' ? '%' : 'NT$'}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={cashierDiscountType === 'percent' ? 100 : cashierSelectedOrder.subtotal}
                                    value={cashierDiscountType === 'percent' ? cashierDiscountRate || '' : cashierDiscountFlat || ''}
                                    onChange={(e) => {
                                      const val = Math.max(0, parseFloat(e.target.value) || 0);
                                      if (cashierDiscountType === 'percent') {
                                        setCashierDiscountRate(Math.min(100, val));
                                      } else {
                                        setCashierDiscountFlat(Math.min(cashierSelectedOrder.subtotal, val));
                                      }
                                    }}
                                    className="w-full bg-[#121212] border border-white/10 focus:border-[#E5B453] rounded-xl py-1.5 px-3 pl-10 text-white font-mono text-sm font-black focus:outline-none transition"
                                    placeholder="輸入折扣 Enter value"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5 font-sans">
                                {cashierDiscountType === 'percent' ? (
                                  [
                                    { val: 0, lbl: '免折 (0%)' },
                                    { val: 5, lbl: '95折 (5% OFF)' },
                                    { val: 10, lbl: '9折 (10% OFF)' },
                                    { val: 15, lbl: '85折 (15% OFF)' },
                                    { val: 20, lbl: '8折 (20% OFF)' },
                                    { val: 50, lbl: '半價 (50% OFF)' }
                                  ].map((btn) => (
                                    <button
                                      key={`summary-disc-${btn.val}`}
                                      type="button"
                                      onClick={() => setCashierDiscountRate(btn.val)}
                                      className={`px-3 py-1.5 text-xs rounded-lg border transition cursor-pointer font-bold ${
                                        cashierDiscountRate === btn.val
                                          ? 'bg-[#E5B453]/20 text-[#E5B453] border-[#E5B453]/60 font-black scale-105 shadow-md shadow-amber-500/5'
                                          : 'bg-black/40 text-zinc-400 border-white/5 hover:border-white/25 hover:text-white'
                                      }`}
                                    >
                                      {btn.lbl}
                                    </button>
                                  ))
                                ) : (
                                  [
                                    { val: 0, lbl: '無 $0' },
                                    { val: 50, lbl: '折 $50' },
                                    { val: 100, lbl: '折 $100' },
                                    { val: 150, lbl: '折 $150' },
                                    { val: 200, lbl: '折 $200' },
                                    { val: 300, lbl: '折 $300' }
                                  ].map((btn) => (
                                    <button
                                      key={`summary-disc-flat-${btn.val}`}
                                      type="button"
                                      onClick={() => setCashierDiscountFlat(btn.val)}
                                      className={`px-3 py-1.5 text-xs rounded-lg border transition cursor-pointer font-bold ${
                                        cashierDiscountFlat === btn.val
                                          ? 'bg-[#E5B453]/20 text-[#E5B453] border-[#E5B453]/60 font-black scale-105 shadow-md shadow-amber-500/5'
                                          : 'bg-black/40 text-zinc-400 border-white/5 hover:border-white/25 hover:text-white'
                                      }`}
                                    >
                                      {btn.lbl}
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          )}

                          {isAdjustingSurcharge && (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                                  <span>📈 調整加成 Surcharge Modifier</span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/25">
                                    {cashierSurchargeType === 'percent' ? `+ ${cashierSurchargeRate}%` : `加 NT$ ${cashierSurchargeFlat}`}
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setIsAdjustingSurcharge(false)}
                                  className="text-[11px] font-bold text-zinc-400 hover:text-white px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 transition active:scale-95 cursor-pointer font-sans"
                                >
                                  確認帶入 Apply & Close
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex bg-black p-0.5 rounded-xl border border-white/10 text-[11px] font-sans">
                                  <button
                                    type="button"
                                    onClick={() => setCashierSurchargeType('percent')}
                                    className={`px-3.5 py-1.5 rounded-lg font-bold transition duration-150 cursor-pointer ${
                                      cashierSurchargeType === 'percent'
                                        ? 'bg-blue-500 text-white font-black'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                                  >
                                    % 比例加成
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCashierSurchargeType('flat')}
                                    className={`px-3.5 py-1.5 rounded-lg font-bold transition duration-150 cursor-pointer ${
                                      cashierSurchargeType === 'flat'
                                        ? 'bg-blue-500 text-white font-black'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                                  >
                                    $ 固定加成
                                  </button>
                                </div>

                                <div className="flex-1 relative flex items-center">
                                  <span className="absolute left-3 font-mono font-bold text-zinc-500 text-xs">
                                    {cashierSurchargeType === 'percent' ? '%' : 'NT$'}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={cashierSurchargeType === 'percent' ? cashierSurchargeRate || '' : cashierSurchargeFlat || ''}
                                    onChange={(e) => {
                                      const val = Math.max(0, parseFloat(e.target.value) || 0);
                                      if (cashierSurchargeType === 'percent') {
                                        setCashierSurchargeRate(val);
                                      } else {
                                        setCashierSurchargeFlat(val);
                                      }
                                    }}
                                    className="w-full bg-[#121212] border border-white/10 focus:border-blue-500 rounded-xl py-1.5 px-3 pl-10 text-white font-mono text-sm font-black focus:outline-none transition"
                                    placeholder="輸入加成數值 Surcharge amt"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5 font-sans">
                                {cashierSurchargeType === 'percent' ? (
                                  [
                                    { val: 0, lbl: '無加成 (0%)' },
                                    { val: 5, lbl: '5% 服務費' },
                                    { val: 10, lbl: '10% 服務費' },
                                    { val: 15, lbl: '15% 服務費' }
                                  ].map((btn) => (
                                    <button
                                      key={`summary-sur-${btn.val}`}
                                      type="button"
                                      onClick={() => setCashierSurchargeRate(btn.val)}
                                      className={`px-3 py-1.5 text-xs rounded-lg border transition cursor-pointer font-bold ${
                                        cashierSurchargeRate === btn.val
                                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/60 font-black scale-105 shadow-md shadow-blue-500/5'
                                          : 'bg-black/40 text-zinc-400 border-white/5 hover:border-white/25 hover:text-white'
                                      }`}
                                    >
                                      {btn.lbl}
                                    </button>
                                  ))
                                ) : (
                                  [
                                    { val: 0, lbl: '無加值 $0' },
                                    { val: 10, lbl: '清潔費 $10' },
                                    { val: 30, lbl: '服務費 $30' },
                                    { val: 50, lbl: '包廂費 $50' },
                                    { val: 100, lbl: '特別加值 $100' }
                                  ].map((btn) => (
                                    <button
                                      key={`summary-sur-flat-${btn.val}`}
                                      type="button"
                                      onClick={() => setCashierSurchargeFlat(btn.val)}
                                      className={`px-3 py-1.5 text-xs rounded-lg border transition cursor-pointer font-bold ${
                                        cashierSurchargeFlat === btn.val
                                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/60 font-black scale-105 shadow-md shadow-blue-500/5'
                                          : 'bg-black/40 text-zinc-400 border-white/5 hover:border-white/25 hover:text-white'
                                      }`}
                                    >
                                      {btn.lbl}
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Cash handling drawer if cash is chosen */}
                      {false && cashierPaymentMethod === 'cash' && (
                        <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row gap-5 font-sans mt-1.5 justify-between">
                          {/* Left Panel: Received Cash Calculations & Bill Notes selector */}
                          <div className="flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-2">
                              <span className="text-[11px] text-[#E5B453] font-bold block tracking-wider uppercase">💶 實收大鈔 (Cash Received Option)</span>
                              <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                  <span className="absolute left-3 top-2.5 font-bold font-mono text-[#E5B453] text-sm">NT$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    id="cashier-received-amt-input"
                                    value={cashierCashReceived === 0 ? '' : cashierCashReceived}
                                    onChange={(e) => setCashierCashReceived(parseFloat(e.target.value.replace(/\D/g, '')) || 0)}
                                    className="w-full bg-[#161616] border border-white/10 rounded-xl py-2 px-3 pl-11 text-white font-mono text-base font-extrabold focus:outline-none focus:border-[#E5B453] transition"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setCashierCashReceived(cashierCalculatedTotals.total)}
                                  className="px-3.5 py-2.5 text-xs font-sans bg-amber-500/10 border border-amber-500/30 text-[#E5B453] hover:bg-[#E5B453] hover:text-black rounded-lg transition font-black cursor-pointer whitespace-nowrap active:scale-95 animate-pulse"
                                >
                                  剛好 Total: NT$ {cashierCalculatedTotals.total}
                                </button>
                              </div>
                            </div>

                            {/* 2. 現金收銀管道選擇 */}
                            <div className="space-y-1.5 bg-black/30 p-2.5 rounded-lg border border-white/5">
                              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wide">📦 選擇現金收銀管道 (Cash Channel)</span>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { id: 'counter', title: '🏢 櫃檯現金', desc: 'Counter' },
                                  { id: 'kiosk', title: '🏪 自助收銀', desc: 'Self Kiosk' },
                                  { id: 'delivery', title: '🛵 外送代收', desc: 'Delivery' }
                                ].map((chan) => (
                                  <button
                                    key={`cash-chan-${chan.id}`}
                                    type="button"
                                    onClick={() => setCashierCashChannel(chan.id as any)}
                                    className={`py-1 px-1.5 rounded-lg border text-left cursor-pointer transition flex flex-col justify-center items-center ${
                                      cashierCashChannel === chan.id
                                        ? 'bg-[#E5B453]/20 border-[#E5B453] text-[#E5B453] font-black'
                                        : 'bg-[#121212]/90 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                                    }`}
                                  >
                                    <span className="text-[10px] font-extrabold block leading-none">{chan.title}</span>
                                    <span className="text-[8px] opacity-60 mt-0.5 block leading-none">{chan.desc}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 1. 實收大鈔可選1000、500、100 */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-zinc-500 block font-bold">單張面額付鈔 Set Denomination</span>
                              <div className="grid grid-cols-3 gap-2">
                                {[1000, 500, 100].map((note) => (
                                  <button
                                    key={`note-set-${note}`}
                                    type="button"
                                    onClick={() => setCashierCashReceived(note)}
                                    className="py-2 text-xs font-mono font-black border border-white/10 hover:border-[#E5B453] hover:bg-[#E5B453]/10 bg-zinc-900 rounded-lg text-white transition cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95"
                                  >
                                    <span className="text-[9px] text-[#E5B453]">💶 付</span>
                                    <span>NT$ {note}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[10px] text-zinc-500 block font-bold">累加點鈔 Add Bill Notes</span>
                              <div className="grid grid-cols-3 gap-2">
                                {[1000, 500, 100].map((note) => (
                                  <button
                                    key={`note-add-${note}`}
                                    type="button"
                                    onClick={() => setCashierCashReceived(prev => (prev || 0) + note)}
                                    className="py-1.5 text-xs font-mono font-bold border border-white/5 hover:border-[#E5B453]/40 hover:bg-[#E5B453]/10 bg-zinc-950 rounded-lg text-zinc-300 transition cursor-pointer flex items-center justify-center gap-0.5 active:scale-95"
                                  >
                                    <span>＋{note}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 💳 現金結帳確認欄 (Cash Checkout Confirmation Summary Panel) */}
                            <div className="bg-amber-500/5 border border-amber-500/30 p-3 rounded-xl space-y-2 mt-1 text-[11px] font-sans">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1 flex-wrap">
                                <span className="text-[#E5B453] font-black uppercase text-xs">📝 櫃檯現金付款確認 (Cashier Checkout Confirmation)</span>
                                <span className="bg-amber-500/10 text-amber-500 text-[9px] px-1.5 py-0.5 rounded font-black font-mono">
                                  核收核對
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-zinc-300">
                                <div className="space-y-0.5">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">應收總額 Total Due:</span>
                                    <span className="font-mono font-bold text-white">NT$ {cashierCalculatedTotals.total}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">實收現鈔 Cash Paid:</span>
                                    <span className="font-mono font-bold text-amber-400">NT$ {cashierCashReceived}</span>
                                  </div>
                                </div>
                                <div className="space-y-0.5 border-l border-white/5 pl-2.5">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">應找零錢 Change:</span>
                                    <span className="font-mono font-extrabold text-emerald-400">
                                      NT$ {Math.max(0, cashierCashReceived - cashierCalculatedTotals.total)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">收銀管道 Channel:</span>
                                    <span className="font-bold text-blue-400">
                                      {cashierCashChannel === 'counter' ? '🏢 櫃檯現金' : cashierCashChannel === 'kiosk' ? '🏪 自助收銀' : '🛵 外送代收'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {cashierCashReceived < cashierCalculatedTotals.total ? (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-1 px-2 rounded text-[10px] text-center font-bold">
                                  ⚠️ 實收金額不足！尚差 NT$ {cashierCalculatedTotals.total - cashierCashReceived} 元
                                </div>
                              ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1 px-2 rounded text-[10px] text-center font-bold">
                                  ⚡ 現金經現場核對無誤，可安全核可付款並上傳 Firestore 資料庫
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Panel: Large touchscreen numeric keypad */}
                          <div className="w-full md:w-56 bg-black/20 p-3 border border-white/5 rounded-xl flex flex-col gap-2">
                            <span className="text-[10px] text-zinc-500 font-extrabold block text-center uppercase tracking-wider">🎯 觸控鍵盤 Touch Keypad</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                                <button
                                  key={`keypad-${num}`}
                                  type="button"
                                  onClick={() => {
                                    setCashierCashReceived(prev => {
                                      const s = String(prev);
                                      if (prev === 0 || prev === cashierCalculatedTotals.total) {
                                        return parseFloat(num) || 0;
                                      } else {
                                        return parseFloat(s + num) || 0;
                                      }
                                    });
                                  }}
                                  className="w-full h-11 flex items-center justify-center font-mono text-base font-black text-white hover:text-black bg-[#1c1c1c] hover:bg-[#E5B453] border border-white/5 hover:border-transparent rounded-lg transition active:scale-95 cursor-pointer"
                                >
                                  {num}
                                </button>
                              ))}
                              {/* Bottom row: Clear, 0, Backspace */}
                              <button
                                type="button"
                                onClick={() => setCashierCashReceived(0)}
                                className="w-full h-11 flex items-center justify-center font-bold text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition active:scale-95 cursor-pointer"
                                title="清除 Clear"
                              >
                                C
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCashierCashReceived(prev => {
                                    const s = String(prev);
                                    if (prev === 0 || prev === cashierCalculatedTotals.total) {
                                      return 0;
                                    } else {
                                      return parseFloat(s + '0') || 0;
                                    }
                                  });
                                }}
                                className="w-full h-11 flex items-center justify-center font-mono text-base font-black text-white bg-[#1c1c1c] hover:bg-[#E5B453] hover:text-black border border-white/5 rounded-lg transition active:scale-95 cursor-pointer"
                              >
                                0
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCashierCashReceived(prev => {
                                    const s = String(prev);
                                    if (s.length <= 1) return 0;
                                    return parseFloat(s.slice(0, -1)) || 0;
                                  });
                                }}
                                className="w-full h-11 flex items-center justify-center font-mono text-base font-black text-zinc-400 hover:text-white bg-[#1a1a1a] hover:bg-zinc-800 border border-white/5 rounded-lg transition active:scale-95 cursor-pointer"
                                title="倒退 Backspace"
                              >
                                ⌫
                              </button>
                            </div>
                            
                            {/* Extra touch helpers: +00 */}
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setCashierCashReceived(prev => {
                                    const s = String(prev);
                                    if (prev === 0 || prev === cashierCalculatedTotals.total) {
                                      return 0;
                                    } else {
                                      return parseFloat(s + '00') || 0;
                                    }
                                  });
                                }}
                                className="py-1 flex items-center justify-center font-mono text-xs font-extrabold text-zinc-300 bg-[#1c1c1c] border border-white/5 hover:border-zinc-700 rounded-lg transition active:scale-95 cursor-pointer"
                              >
                                00
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCashierCashReceived(prev => {
                                    const s = String(prev);
                                    if (prev === 0 || prev === cashierCalculatedTotals.total) {
                                      return 0;
                                    } else {
                                      return parseFloat(s + '000') || 0;
                                    }
                                  });
                                }}
                                className="py-1 flex items-center justify-center font-mono text-xs font-extrabold text-zinc-300 bg-[#1c1c1c] border border-white/5 hover:border-zinc-700 rounded-lg transition active:scale-95 cursor-pointer"
                              >
                                000
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Member management drawer if member is chosen */}
                      {false && cashierPaymentMethod === 'member' && (
                        <div className="bg-[#121824]/80 border border-blue-500/20 p-4 rounded-xl flex flex-col gap-4 font-sans mt-1.5 text-left">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                            <div className="space-y-1 bg-transparent">
                              <span className="text-[11px] text-blue-400 font-bold block tracking-wider uppercase">⭐️ 儲值卡結帳與快捷儲值 (Cashier Member Admin)</span>
                              <p className="text-zinc-400 text-[11px]">
                                {cashierSelectedOrder?.isMember 
                                  ? `結帳單已綁定會員：${cashierSelectedOrder.customerName}` 
                                  : '本結帳單尚未在點餐時綁定會員。預設載入沙貝忠實饕客會員進行餘額抵扣。'
                                }
                              </p>
                            </div>
                          </div>

                          {/* Quick member top-up / list check */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left part: Member Balance Deduction Details */}
                            <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-3">
                              <span className="text-[10px] text-blue-400 font-extrabold block uppercase tracking-wider">💳 餘額扣抵狀態</span>
                              
                              {(() => {
                                const dbStr = localStorage.getItem('google-members-database');
                                if (dbStr) {
                                  try {
                                    const db = JSON.parse(dbStr);
                                    let vipEmail = 'topztar@gmail.com'; // Default mock email
                                    
                                    // If order has an owner, check their email
                                    if (cashierSelectedOrder?.customerName) {
                                      const matched = db.find((m: any) => m.name === cashierSelectedOrder.customerName);
                                      if (matched) {
                                        vipEmail = matched.email;
                                      }
                                    }
                                    
                                    const member = db.find((m: any) => m.email === vipEmail);
                                    if (member) {
                                      const hasEnough = member.balance >= cashierCalculatedTotals.total;
                                      return (
                                        <div className="space-y-3">
                                          <div className="flex items-center space-x-3 bg-white/5 p-2.5 rounded-lg border border-white/5">
                                            <img referrerPolicy="no-referrer" src={member.avatar || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=150'} className="w-9 h-9 rounded-full object-cover border border-white/10" alt="" />
                                            <div>
                                              <p className="text-xs font-black text-white">{member.name}</p>
                                              <p className="text-[10px] text-zinc-500 font-mono">{member.email}</p>
                                            </div>
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-2 text-center">
                                            <div className="bg-zinc-900 px-2 py-1.5 rounded border border-white/5">
                                              <span className="text-[9px] text-zinc-500 block leading-none">當前帳存餘額</span>
                                              <span className="text-sm font-mono font-bold text-emerald-400">NT$ {member.balance || 0}</span>
                                            </div>
                                            <div className="bg-zinc-900 px-2 py-1.5 rounded border border-white/5">
                                              <span className="text-[9px] text-zinc-500 block leading-none">本次應扣除金額</span>
                                              <span className="text-sm font-mono font-bold text-rose-400">NT$ {cashierCalculatedTotals.total}</span>
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between text-xs pt-1">
                                            <span className="text-zinc-400">扣抵後剩餘：</span>
                                            <span className="font-mono font-bold text-zinc-200">
                                              NT$ {Math.max(0, (member.balance || 0) - cashierCalculatedTotals.total)}
                                            </span>
                                          </div>

                                          {!hasEnough && (
                                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-lg text-[10px] font-bold">
                                              ⚠️ 顧客儲值餘額不足！請先點擊右側進行【快捷現金增值】以補足差額扣抵。
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }
                                return <p className="text-xs text-zinc-500">無會員資料或初始化錯誤</p>;
                              })()}
                            </div>

                            {/* Right part: Top up management */}
                            <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-3">
                              <span className="text-[10px] text-zinc-300 font-extrabold block uppercase tracking-wider">💸 收銀台即時儲值 (Top-Up Engine)</span>
                              
                              <p className="text-[10px] text-zinc-400 leading-relaxed">
                                顧客提供現場代收現金/感應卡片時，收銀員在此一鍵寫入儲值額到顧客的會員帳戶中：
                              </p>

                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { amt: 500, lbl: '＋增額 $500' },
                                  { amt: 1000, lbl: '＋增額 $1000' },
                                  { amt: 2000, lbl: '＋增額 $2000' },
                                  { amt: 3000, lbl: '＋增額 $3000' }
                                ].map((choice) => (
                                  <button
                                    key={`cashier-top-${choice.amt}`}
                                    type="button"
                                    onClick={() => {
                                      const dbStr = localStorage.getItem('google-members-database');
                                      if (dbStr) {
                                        try {
                                          const db = JSON.parse(dbStr);
                                          let vipEmail = 'topztar@gmail.com';
                                          
                                          if (cashierSelectedOrder?.customerName) {
                                            const matched = db.find((m: any) => m.name === cashierSelectedOrder.customerName);
                                            if (matched) {
                                              vipEmail = matched.email;
                                            }
                                          }
                                          
                                          const userIndex = db.findIndex((m: any) => m.email === vipEmail);
                                          if (userIndex >= 0) {
                                            db[userIndex].balance = (db[userIndex].balance || 0) + choice.amt;
                                            localStorage.setItem('google-members-database', JSON.stringify(db));
                                            window.dispatchEvent(new Event('local-points-updated'));
                                            // Force state refresh
                                            setCashierCashReceived(prev => prev + 1);
                                            setTimeout(() => setCashierCashReceived(prev => prev - 1), 50);
                                          }
                                        } catch (e) {
                                          console.error(e);
                                        }
                                      }
                                    }}
                                    className="py-2 text-[11px] font-sans font-black border border-[#E5B453]/20 hover:border-[#E5B453] hover:bg-[#E5B453]/10 bg-zinc-900 text-white rounded-lg transition active:scale-95 cursor-pointer text-center"
                                  >
                                    {choice.lbl}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Giant Checkout Action Button */}
                      <div className="flex items-center space-x-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedCashierOrderId(null)}
                          className="px-4 py-2 border border-white/5 hover:bg-white/5 rounded-lg font-bold text-xs text-zinc-400 transition cursor-pointer active:scale-95"
                        >
                          放棄本單
                        </button>
                        <button
                          type="button"
                          id="cashier-submit-checkout-btn"
                          onClick={handleCashierCheckoutSubmit}
                          className="flex-1 py-2 text-xs font-black text-slate-900 bg-[#E5B453] hover:bg-amber-400 active:scale-[0.98] transition shadow-md shadow-[#E5B453]/10 cursor-pointer rounded-lg flex items-center justify-center gap-1.5"
                        >
                          <Coins size={14} />
                          <span>🎯 確認收銀並將桌號設為「已付清」 (NT$ {cashierCalculatedTotals.total})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ==================== TAB 2: ACCOUNTING LOG CHART & SINGLE DRILLDOWN ==================== */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn text-left" id="subtab-section-orders">
          {/* Preset Buttons & Advanced Filters */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white font-serif">💳 營業核數、點單明細與自訂統計查詢</h4>
                <p className="text-white/40 text-xs font-sans">可篩選指定時間、進行單筆交易對帳。點擊表格項目直接下鑽查閱顧客點餐規格細節。</p>
              </div>
              <button
                type="button"
                onClick={handleExportOrdersReport}
                className="mt-3 md:mt-0 flex items-center justify-center space-x-1.5 bg-[#E5B453] hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-black text-xs active:scale-95 transition whitespace-nowrap cursor-pointer shadow-md"
              >
                <Download size={13} />
                <span>匯出查詢結果 (EXCEL格式報表)</span>
              </button>
            </div>

            {/* Date Preset Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: '全部歷史 orders' },
                { id: 'today', label: '📅 今日銷售 (Today)' },
                { id: 'week', label: '📅 本周銷售 (Last 7 Days)' },
                { id: 'month', label: '📅 本月銷售 (Last 30 Days)' },
                { id: 'custom', label: '🔍 自訂日期區間 (Custom)' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setDateRangeFilter(btn.id as any)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition active:scale-95 cursor-pointer ${
                    dateRangeFilter === btn.id
                      ? 'bg-amber-400/20 border-amber-400 text-[#E5B453] font-extrabold'
                      : 'bg-black/20 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Date Custom Inputs */}
            {dateRangeFilter === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/20 p-4 rounded-lg border border-white/5 animate-slideDown text-xs">
                <div className="space-y-1">
                  <span className="text-white/40 font-bold block">起始日期 Start Date</span>
                  <input
                    type="date"
                    value={orderQueryStartDate}
                    onChange={(e) => setOrderQueryStartDate(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#E5B453]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-white/40 font-bold block">截止日期 End Date</span>
                  <input
                    type="date"
                    value={orderQueryEndDate}
                    onChange={(e) => setOrderQueryEndDate(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#E5B453]"
                  />
                </div>
              </div>
            )}

            {/* Search Key Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-white/40 font-bold">單號/顧客別搜尋 Keyword Search</label>
                <input
                  type="text"
                  placeholder="輸入 訂單單號 (如 SB-1001) 或顧客姓名搜尋"
                  value={orderQueryKeyword}
                  onChange={(e) => setOrderQueryKeyword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#E5B453] placeholder-white/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-white/40 font-bold">點單流向狀態 Order Status</label>
                <select
                  value={orderQueryStatus}
                  onChange={(e) => setOrderQueryStatus(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#E5B453]"
                >
                  <option value="all">顯示全部種類狀態</option>
                  <option value="pending">⏳ 待處理 Pending</option>
                  <option value="preparing">🍳 配備中 Preparing</option>
                  <option value="completed">✅ 已送出熟餐 Completed</option>
                  <option value="cancelled">❌ 已取消退料 Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Aggregated analytics widgets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#121212] border border-white/5 rounded-xl p-4">
              <span className="text-[10px] text-white/45 font-black uppercase tracking-wider block">篩選區間總營業額</span>
              <p className="text-xl font-black text-[#E5B453] font-mono leading-none mt-2">
                NT$ {filteredStats.revenue.toLocaleString()}
              </p>
              <p className="text-[9px] text-zinc-500 mt-1">（已扣除已取消訂單）</p>
            </div>
            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#121212] border border-white/5 rounded-xl p-4">
              <span className="text-[10px] text-white/45 font-black uppercase tracking-wider block">篩選期間總點單筆數</span>
              <p className="text-xl font-black text-white font-mono leading-none mt-2">
                {filteredStats.count} <span className="text-xs text-zinc-400 font-sans">筆</span>
              </p>
              <p className="text-[9px] text-zinc-500 mt-1">（含歷史已取消案件）</p>
            </div>
            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#121212] border border-white/5 rounded-xl p-4">
              <span className="text-[10px] text-white/45 font-black uppercase tracking-wider block">篩選客單價 (Average Ticket)</span>
              <p className="text-xl font-black text-blue-400 font-mono leading-none mt-2">
                NT$ {filteredStats.aov.toLocaleString()}
              </p>
              <p className="text-[9px] text-zinc-500 mt-1">平均每張訂單消費額</p>
            </div>
            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#121212] border border-white/5 rounded-xl p-4">
              <span className="text-[10px] text-white/45 font-black uppercase tracking-wider block">Google 會員佔銷比率</span>
              <p className="text-xl font-black text-emerald-400 font-mono leading-none mt-2">
                {filteredStats.memberShare.toFixed(1)}%
              </p>
              <p className="text-[9px] text-zinc-500 mt-1">核定 Google 會員之消費貢獻</p>
            </div>
          </div>

          {/* Orders Chronology list */}
          <div className="bg-[#161616] border border-white/10 rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-white/45 border-b border-white/10 font-bold uppercase tracking-wide">
                    <th className="py-3 px-4 font-normal text-[10px] text-zinc-400">訂單 ID</th>
                    <th className="py-3 px-4 font-normal text-[10px] text-zinc-400">點單時間</th>
                    <th className="py-3 px-4 font-normal text-[10px] text-zinc-400">客用桌號</th>
                    <th className="py-3 px-4 font-normal text-[10px] text-zinc-400">餐客 / 顧客別</th>
                    <th className="py-3 px-4 font-normal text-[10px] text-zinc-400 text-right">總計金額</th>
                    <th className="py-3 px-4 font-normal text-[10px] text-zinc-400 text-center">出餐進度</th>
                    <th className="py-3 px-4 font-normal text-[10px] text-zinc-400 text-center">核對下鑽</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-white/30 font-medium">
                        無任何符合目前篩選準則的訂單交易紀錄。
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/[2%] transition duration-150">
                        <td className="py-3 px-4 font-mono font-bold text-white text-sm">{o.id}</td>
                        <td className="py-3 px-4 text-zinc-500">{new Date(o.createdAt).toLocaleString()}</td>
                        <td className="py-3 px-4 text-center font-bold text-white">{o.tableNumber} 桌</td>
                        <td className="py-3 px-4 flex items-center space-x-2.5">
                          <img src={o.customerAvatar} defaultValue="" alt="avatar" className="w-6 h-6 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <span className="font-bold text-white truncate max-w-[120px] block">{o.customerName}</span>
                          {o.isMember && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold px-1 py-0.2 rounded font-sans">⭐ 會員</span>}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-100 font-extrabold text-sm">NT$ {o.total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-extrabold ${
                            o.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : o.status === 'preparing'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : o.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {o.status === 'completed' ? '已完成出餐' : (o.status === 'preparing' ? '廚房配餐中' : (o.status === 'pending' ? '新單待理' : '已取消復歸'))}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(o)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1 rounded-lg font-bold transition active:scale-95 text-[11px] cursor-pointer"
                          >
                            🔎 明細單
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* ==================== TAB 3: INVENTORY LEDGER (進銷存) ==================== */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-6 animate-fadeIn text-left animate-fadeIn" id="subtab-section-inventory">
          {/* Warning state board */}
          {analytics.stockWarnings.length > 0 ? (
            <div className="bg-rose-550/10 border border-rose-500/25 p-4.5 rounded-xl flex items-start space-x-3 text-left">
              <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <h5 className="font-bold text-xs text-rose-400 uppercase tracking-wider">下列原料項目已低於安全防線！</h5>
                <p className="text-white/70 text-[11px] leading-tight">
                  建議立即辦理原料進貨或利用手動庫存調整以確保正常配餐原料消耗：
                  {analytics.stockWarnings.map(ig => `【${ig.name.zh} 剩餘 ${ig.stock} ${ig.unit}】`).join('、')}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-emerald-400 font-bold text-xs">安全保障：目前全店原料大體儲量充足，無任何瀕危低限原料。</span>
            </div>
          )}

          {/* Table list from standard ingredients block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div className="flex items-center space-x-1.5 text-white">
                  <Package size={15} />
                  <h4 className="font-bold text-sm tracking-wide">📦 食材原料庫水位 (安全警備與大宗採購進貨)</h4>
                </div>
              </div>
              <div className="overflow-x-auto text-xs rounded-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-white/40 border-b border-white/5 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">序碼</th>
                      <th className="py-2.5 px-3">原料項目名稱</th>
                      <th className="py-2.5 px-3">現有儲量</th>
                      <th className="py-2.5 px-3">安全水位</th>
                      <th className="py-2.5 px-3">容量單位</th>
                      <th className="py-2.5 px-3 text-center">進貨登入額</th>
                      <th className="py-2.5 px-3 text-center">管理處置</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {ingredients.map((ig) => {
                      const isWarning = ig.stock <= ig.minThreshold;
                      return (
                        <tr key={ig.id} className="hover:bg-white/5">
                          <td className="py-3 px-3 font-mono text-zinc-500">{ig.id}</td>
                          <td className="py-3 px-3 font-bold text-white">{ig.name.zh}</td>
                          <td className={`py-3 px-3 font-mono font-bold text-sm ${isWarning ? 'text-rose-400 font-black' : 'text-zinc-100'}`}>
                            {ig.stock}
                          </td>
                          <td className="py-3 px-3 font-mono text-zinc-400">{ig.minThreshold}</td>
                          <td className="py-3 px-3 text-zinc-500 text-[11px]">{ig.unit}</td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min={1}
                              id={`input-restock-${ig.id}`}
                              placeholder="20"
                              value={restockAmount[ig.id] === undefined ? '' : (restockAmount[ig.id] === 0 ? '' : restockAmount[ig.id])}
                              onChange={(e) => setRestockAmount({ ...restockAmount, [ig.id]: Math.max(0, parseInt(e.target.value, 10)) })}
                              className="w-16 bg-black/60 border border-white/10 rounded px-2 py-1 text-center font-mono font-bold outline-none text-white focus:border-[#E5B453]"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRestockClick(ig.id)}
                              className="bg-[#E5B453]/15 hover:bg-[#E5B453]/25 text-[#E5B453] border border-[#E5B453]/35 px-2.5 py-1 rounded font-bold transition active:scale-95 text-[11px] cursor-pointer"
                            >
                              進貨
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manual adjustment and stock audits */}
            <div className="lg:col-span-4 bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h4 className="font-bold text-sm text-[#E5B453] font-serif">⚙️ 安全盤點。手動核銷調整庫量</h4>
                <p className="text-[10px] text-white/40 leading-tight mt-1">耗損、報廢、招待用、補發或期末實際庫存不對時，在此校正，亦將產生過帳明細流向日誌以資備忘備查。</p>
              </div>
              <form onSubmit={handleManualAdjustStock} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400">選擇原料 Item Selector</label>
                  <select
                    value={manualAdjustId}
                    onChange={(e) => setManualAdjustId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-2 outline-none text-white"
                  >
                    <option value="">請選擇要盤調的原料...</option>
                    {ingredients.map(ig => <option key={ig.id} value={ig.id}>{ig.name.zh} ({ig.stock} {ig.unit})</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">增減異動量 (Change Amount)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="輸入正整數增加，如 10；輸入負數耗扣損，如 -2.5"
                    value={manualAdjustQty}
                    onChange={(e) => setManualAdjustQty(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-2 outline-none text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">日誌記帳備註 Note reason</label>
                  <input
                    type="text"
                    placeholder="例如：櫛瓜發霉毀損、今日盤點損差、招待貴品"
                    value={manualAdjustNote}
                    onChange={(e) => setManualAdjustNote(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-2 outline-none text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 font-extrabold text-white rounded-lg transition active:scale-95 cursor-pointer shadow-md text-xs"
                >
                  📝 寫入並過帳盤點調整
                </button>
              </form>
            </div>
          </div>

          {/* Dynamic Ingredient Recipe recipe cost definitions */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 text-left">
            <span className="text-[10px] text-[#E5B453] uppercase font-black tracking-widest block mb-1">食材配方扣減審核卡</span>
            <h4 className="text-sm font-bold border-b border-white/5 pb-2 mb-3">菜單食材配方定額與消耗原理 (Recipe Composition Specifications)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs font-sans">
              {Object.keys(recipeCompositionMap).map((key) => {
                const menuItem = menuItems.find(m => m.id === key);
                return (
                  <div key={key} className="bg-black/30 border border-white/5 p-3 rounded-lg space-y-1.5">
                    <span className="font-bold text-[#E5B453] line-clamp-1">{menuItem ? menuItem.name.zh : key}</span>
                    <div className="space-y-1 text-[11px] text-zinc-400">
                      {recipeCompositionMap[key].map((rec, i) => (
                        <p key={i} className="flex justify-between">
                          <span>{rec.name}</span>
                          <span className="font-mono text-white text-right font-semibold">{rec.qty}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Searchable Transaction history table list */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white font-serif">📜 進銷存交易流動流水帳 (Inventory Transaction Logs Ledger)</h4>
                <p className="text-white/40 text-[11px]">本表格詳實記載進貨、點餐系統自動配銷、手動調整、取消歸庫等各類流向明細，保障店鋪帳實吻合。</p>
              </div>
              <button
                type="button"
                onClick={handleExportInventoryReport}
                className="mt-3.5 sm:mt-0 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 font-black text-xs text-white rounded-lg px-3.5 py-1.5 active:scale-95 transition cursor-pointer"
              >
                <Download size={13} />
                <span>匯出進銷存 CSV 報表</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <label className="text-zinc-400 shrink-0">速尋過濾:</label>
              <input
                type="text"
                placeholder="輸入原料名稱、備註描述或單號關鍵字..."
                value={inventoryLogSearch}
                onChange={(e) => setInventoryLogSearch(e.target.value)}
                className="bg-black/40 border border-white/10 rounded px-3 py-1.5 focus:border-[#E5B453] focus:outline-none w-full outline-none placeholder-white/25 text-white"
              />
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-white/45 border-b border-white/10 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">交易過帳時間</th>
                    <th className="py-2.5 px-3">對象原料</th>
                    <th className="py-2.5 px-3 text-center">異動類別</th>
                    <th className="py-2.5 px-3 text-right">變化量額</th>
                    <th className="py-2.5 px-3 text-right">變動後殘餘</th>
                    <th className="py-2.5 px-3">交易事件備註原因</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {dbInventoryLogs.filter(l => {
                    const k = inventoryLogSearch.toLowerCase().trim();
                    if (!k) return true;
                    return l.ingredientName.toLowerCase().includes(k) || l.note.toLowerCase().includes(k);
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-white/30 font-medium">
                        無任何庫存異動日誌登錄。
                      </td>
                    </tr>
                  ) : (
                    dbInventoryLogs.filter(l => {
                      const k = inventoryLogSearch.toLowerCase().trim();
                      if (!k) return true;
                      return l.ingredientName.toLowerCase().includes(k) || l.note.toLowerCase().includes(k);
                    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((l, i) => (
                      <tr key={l.id || i} className="hover:bg-white/[2%] font-sans">
                        <td className="py-2.5 px-3 text-zinc-500 font-mono">{new Date(l.timestamp).toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-bold text-white">{l.ingredientName}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            l.type === 'incoming'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : l.type === 'outgoing'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {l.type === 'incoming' ? '進貨流入' : (l.type === 'outgoing' ? '系統配銷' : '手控盤核')}
                          </span>
                        </td>
                        <td className={`py-2.5 px-3 text-right font-mono font-bold ${l.quantityChanged > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {l.quantityChanged > 0 ? '+' : ''}{l.quantityChanged}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-zinc-400 font-semibold">{l.remainingStock}</td>
                        <td className="py-2.5 px-3 text-zinc-400 text-[11.5px] max-w-[200px] truncate">{l.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* ==================== TAB 4: MENU ITEMS MANAGER ==================== */}
      {activeSubTab === 'menu' && (
        <div className="space-y-6 animate-fadeIn text-left" id="subtab-section-menu">
          {/* Main List & Create trigger */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <h4 className="font-bold text-sm text-white font-serif">🍜 菜單全品編輯與可售狀態 Availability Dashboard</h4>
                <p className="text-white/40 text-xs mt-1">變更餐點是否沽清、客製配料或上下架，保障線上顧客不點錯沒料的菜品。</p>
              </div>
              <button
                type="button"
                onClick={triggerAddMenuItemMode}
                className="flex items-center space-x-1 bg-[#E5B453] hover:bg-amber-400 text-slate-900 border border-white/5 px-3.5 py-1.5 rounded-lg text-xs font-bold' active:scale-95 transition cursor-pointer font-sans"
              >
                <Plus size={14} />
                <span>新增全新品項 Add</span>
              </button>
            </div>

            {/* Excel-style table of menu items catalog */}
            <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/10">
              <table className="w-full min-w-[800px] border-collapse text-xs text-left font-sans">
                <thead>
                  <tr className="bg-zinc-800/80 border-b border-white/10 text-[11px] font-bold text-amber-400">
                    <th scope="col" className="p-3 border-r border-white/10 text-center w-10">#</th>
                    <th scope="col" className="p-3 border-r border-white/10">ID碼 (ID Code)</th>
                    <th scope="col" className="p-3 border-r border-white/10">菜品分類 (Category)</th>
                    <th scope="col" className="p-3 border-r border-white/10">品名 (Dish Name)</th>
                    <th scope="col" className="p-3 border-r border-white/10 text-right">定價 (Price)</th>
                    <th scope="col" className="p-3 border-r border-white/10 text-center">可售狀態 (Stock Status)</th>
                    <th scope="col" className="p-3 border-r border-white/10">附加規格 (Options)</th>
                    <th scope="col" className="p-3 text-center">後端控制 (Operations)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {menuItems.map((item, index) => {
                    const foundCategoryObj = categories.find(c => c.id === item.category);
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-[#E5B453]/5 transition-colors ${
                          index % 2 === 0 ? 'bg-zinc-900/20' : 'bg-black/30'
                        }`}
                      >
                        {/* # Row Index */}
                        <td className="p-2.5 border-r border-white/10 text-center text-zinc-500 font-mono text-[10px]">{index + 1}</td>
                        
                        {/* ID碼 */}
                        <td className="p-2.5 border-r border-white/10 font-mono text-zinc-400 font-medium select-all">{item.id}</td>
                        
                        {/* 菜品分類 */}
                        <td className="p-2.5 border-r border-white/10">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {foundCategoryObj?.name.zh || item.category}
                          </span>
                        </td>
                        
                        {/* 品名 */}
                        <td className="p-2.5 border-r border-white/10 font-sans">
                          <div className="space-y-0.5">
                            <p className="font-bold text-white text-[13px]">{item.name.zh}</p>
                            {item.name.en && <p className="text-[10px] text-zinc-500">{item.name.en}</p>}
                          </div>
                        </td>
                        
                        {/* 定價 */}
                        <td className="p-2.5 border-r border-white/10 text-right font-mono font-bold text-white">
                          NT$ {item.price}
                        </td>
                        
                        {/* 可售狀態 */}
                        <td className="p-2.5 border-r border-white/10 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.available
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.available ? '● 販售中 Supply' : '✕ 沽清 Sold Out'}
                          </span>
                        </td>
                        
                        {/* 附加規格 */}
                        <td className="p-2.5 border-r border-white/10 text-zinc-400 text-[10px]">
                          <div className="flex flex-wrap gap-1">
                            {item.hasNoodlesOption && (
                              <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[9px] border border-blue-500/15">麵類自選</span>
                            )}
                            {item.isNotSpicy && (
                              <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] border border-emerald-500/15">完全不辣</span>
                            )}
                            {Array.isArray(item.customAddOns) && item.customAddOns.length > 0 ? (
                              <span className="bg-zinc-500/15 text-zinc-300 px-1.5 py-0.5 rounded text-[9px] border border-zinc-500/20">
                                加價項目x{item.customAddOns.length}
                              </span>
                            ) : (
                              <span className="text-zinc-600 italic">無加選</span>
                            )}
                          </div>
                        </td>
                        
                        {/* 後端控制 */}
                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => onToggleMenuItemAvailability(item.id)}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition cursor-pointer select-none active:scale-95 ${
                                item.available 
                                  ? 'bg-[#E5B453]/10 text-amber-300 border-amber-500/30 hover:bg-[#E5B453]/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              }`}
                            >
                              {item.available ? '設為沽清' : '恢復販售'}
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerEditMenuItemMode(item)}
                              className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer select-none active:scale-95 flex items-center space-x-1"
                            >
                              <span>編輯品項 ✏️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Business categories settings panel */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-3" id="manager-categories-panel">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex items-center space-x-1.5">
                <Layers size={15} className="text-[#E5B453]" />
                <h4 className="font-bold text-sm">🗂️ 菜色分類標籤控制 Categories Panel</h4>
              </div>
              {onAddCategory && (
                <button
                  type="button"
                  onClick={triggerAddCatMode}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition cursor-pointer"
                >
                  新增菜色分類標籤
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-black/35 border border-white/10 rounded-lg px-3 py-2 flex items-center space-x-2">
                  <div className="text-left font-sans text-xs">
                    <p className="font-bold text-white leading-normal flex items-center gap-1.5">
                      <span>{cat.name.zh}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${cat.showOnCustomerPage !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {cat.showOnCustomerPage !== false ? '顧客可見' : '後台限定'}
                      </span>
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">標記 ID: {cat.id}</p>
                  </div>
                  {onEditCategory && (
                    <button
                      type="button"
                      onClick={() => triggerEditCatMode(cat)}
                      className="p-1 hover:bg-white/10 rounded text-[#E5B453] transition cursor-pointer"
                      title="編輯該分類名稱"
                    >
                      <Edit size={11} />
                    </button>
                  )}
                  {onDeleteCategory && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`⚠️ 安全確定：您真的要刪除 [${cat.name.zh}] 分類標籤嗎？線上顧客端的該分類將被移除。`)) {
                          await onDeleteCategory(cat.id);
                        }
                      }}
                      className="p-1 hover:bg-rose-500/10 rounded text-rose-400 transition cursor-pointer"
                      title="刪除"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ==================== TAB 5: MEMBERS, ACCESS PRIVILEGE AND PIN ==================== */}
      {activeSubTab === 'members' && (
        <div className="space-y-6 animate-fadeIn text-left animate-fadeIn" id="subtab-section-members">
          {/* Members Stats & Controls */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4 font-sans">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Coins className="text-[#E5B453] shrink-0" size={17} />
              <div>
                <h4 className="font-bold text-sm text-white font-serif tracking-wide">Google Quick Member / 顧客會員累計點數系統</h4>
                <p className="text-white/40 text-xs">取代 LINE 傳統推播行銷，本介面詳實登錄全體 Google 帳戶顧客之累計點數。店員可在結算時手動輸入消除或微調點數。</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">已核定 Google 會員</span>
                <p className="text-2xl font-black text-white font-mono leading-none">
                  {membersList.length} <span className="text-xs font-semibold text-zinc-400 font-sans">位</span>
                </p>
              </div>
              <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">累存總流通點數</span>
                <p className="text-2xl font-black text-[#E5B453] font-mono leading-none">
                  {membersList.reduce((acc, cur) => acc + (cur.points || 0), 0).toLocaleString()} <span className="text-xs font-semibold text-zinc-400 font-sans">點</span>
                </p>
              </div>
              <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">消點累計兑消匯率</span>
                <p className="text-2xl font-black text-blue-400 font-mono leading-none">
                  100 <span className="text-xs font-semibold text-zinc-400 font-sans">點抵 NT$10 元</span>
                </p>
              </div>
            </div>

            {/* Members table */}
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-xs text-left text-zinc-300">
                <thead>
                  <tr className="bg-white/5 text-white/50 border-b border-white/5">
                    <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-wider">成員頭像/名稱</th>
                    <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-wider">綁定電子郵箱 Email</th>
                    <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-wider text-center">登載註冊時間</th>
                    <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-wider text-right">當前統計儲值點數</th>
                    <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-wider text-center">手動消點累點變更</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {membersList.map((m) => (
                    <tr key={m.email} className="hover:bg-white/[2%]">
                      <td className="py-3.5 px-4 flex items-center space-x-3 text-white font-bold">
                        <img src={m.avatar} alt="member-avatar" className="w-8 h-8 rounded-full border border-blue-500/20 object-cover" referrerPolicy="no-referrer" />
                        <span>{m.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-400">{m.email}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-zinc-500">{m.joinedAt || '2026-06-01'}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-400 font-black text-sm">{m.points.toLocaleString()} 點</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustPoints(m.email)}
                            className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded transition text-[10px] cursor-pointer"
                          >
                            加減消點
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(m.email)}
                            className="bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded transition text-[10px] cursor-pointer"
                          >
                            移除帳戶
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table layout configurator */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div className="flex items-center space-x-1.5">
                  <QrCode size={15} className="text-[#E5B453]" />
                  <h4 className="font-bold text-sm">🥢 餐廳客用桌席與 QR Code 連結設定</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTableObj(null);
                    setTableIdInput('');
                    setTableQrUrlInput('');
                    setTableError(null);
                    setTableSuccess(null);
                    setIsTableFormOpen(true);
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-2.5 py-1.5 rounded text-xs transition font-extrabold cursor-pointer"
                >
                  新增桌次定位 Add
                </button>
              </div>

              {/* Table details list */}
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                {tables.map(tb => (
                  <div key={tb.id} className="p-3 bg-black/30 border border-white/5 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-white">{tb.id} 號桌位</p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[150px]" title={tb.qrCodeUrl}>連結: {tb.qrCodeUrl}</p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {tableToDeleteId === tb.id ? (
                        <div className="flex items-center space-x-1 bg-rose-500/10 border border-rose-500/20 py-0.5 px-1.5 rounded-lg">
                          <button
                            type="button"
                            onClick={async () => {
                              await onDeleteTable(tb.id);
                              setTableToDeleteId(null);
                            }}
                            className="text-rose-400 hover:text-rose-300 font-extrabold text-[10px] cursor-pointer"
                          >
                            確定刪除
                          </button>
                          <span className="text-zinc-600 text-[9px]">|</span>
                          <button
                            type="button"
                            onClick={() => setTableToDeleteId(null)}
                            className="text-zinc-400 hover:text-white text-[10px] cursor-pointer"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => triggerEditTableMode(tb)}
                            className="p-1 hover:bg-white/5 rounded text-[#E5B453] cursor-pointer"
                            title="編輯桌次 QR 碼"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTableToDeleteId(tb.id)}
                            className="p-1 hover:bg-rose-500/10 rounded text-rose-400 cursor-pointer"
                            title="刪除客座"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PIN changer & Security configuration */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-[#E5B453] tracking-widest block uppercase">安全鑰控制與系統加密安全</span>
                <h4 className="font-bold text-sm mt-0.5">變更 6 位數員工解鎖解鎖金鑰 PIN Changer</h4>
              </div>
              <form onSubmit={handlePinChangeSubmit} className="space-y-4 text-xs">
                {pinChangeError && <div className="p-2 bg-rose-500/10 text-rose-400 text-[11px] font-bold rounded-lg">⚠️ {pinChangeError}</div>}
                {pinChangeSuccess && <div className="p-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-lg">🎯 {pinChangeSuccess}</div>}
                <div className="space-y-1">
                  <label className="text-zinc-400 block">目前解鎖金鑰 Current PIN (預設為 888888)</label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-center tracking-widest text-[14px]"
                    placeholder="輸入解鎖 PIN"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-400 block">新 PIN-Key</label>
                    <input
                      type="password"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-center tracking-widest text-[14px]"
                      placeholder="全新 6 碼"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400 block">強確校對新 Key</label>
                    <input
                      type="password"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-center tracking-widest text-[14px]"
                      placeholder="再次確認"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={pinChangeLoading}
                  className="w-full py-2 bg-[#E5B453] hover:bg-amber-400 text-slate-900 font-extrabold rounded-lg active:scale-95 cursor-pointer text-[12px] shadow-sm tracking-wide transition"
                >
                  {pinChangeLoading ? '執行中...' : '💾 確認變更安全解鎖金鑰 PIN'}
                </button>
              </form>
            </div>

            {/* Minimum Spend per Person configuration */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4 font-sans">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-[#E5B453] tracking-widest block uppercase">內用點餐控制與消費門檻</span>
                <h4 className="font-bold text-sm mt-0.5">內用每人低消限制 Dine-in Min Spend Setting</h4>
              </div>
              <div className="space-y-3 text-xs">
                {minSpendSaveError && <div className="p-2 bg-rose-500/10 text-rose-400 text-[11px] font-bold rounded-lg">⚠️ {minSpendSaveError}</div>}
                {minSpendSaveSuccess && <div className="p-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-lg">🎯 {minSpendSaveSuccess}</div>}
                <div className="space-y-1">
                  <label className="text-zinc-400 block">當前每人最低消費金額 (NT$)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={tempMinSpend}
                    onChange={(e) => setTempMinSpend(Math.max(0, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0))}
                    className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-center text-white tracking-wide text-sm"
                    placeholder="例如: 200"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveMinSpend}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg active:scale-95 cursor-pointer text-[12px] shadow-sm tracking-wide transition"
                >
                  💾 儲存低消限制門檻 Settings
                </button>
              </div>
            </div>

            {/* 客戶注意事項欄位 */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4 font-sans text-left">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-[#E5B453] tracking-widest block uppercase">客席資訊與跑馬燈公告</span>
                <h4 className="font-bold text-sm mt-0.5">滾動式客席注意事項公告 Customer Scrolling Notice</h4>
              </div>
              <div className="space-y-3.5 text-xs">
                {noticeError && <div className="p-2 bg-rose-500/10 text-rose-400 text-[11px] font-bold rounded-lg border border-rose-500/20">⚠️ {noticeError}</div>}
                {noticeSuccess && <div className="p-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/20">🎯 {noticeSuccess}</div>}
                
                <p className="text-[11px] text-zinc-400 leading-normal">
                  此訊息會以「滾動式跑馬燈」在所有顧客桌別的點餐頁面最上方即時輪播，適合填寫：最新優惠、滿額贈禮、低消或限時說明。
                </p>

                <div className="space-y-1">
                  <label className="text-zinc-500 block font-semibold">公告內容 (字數不限，支援英文及多語系跑馬輪播)</label>
                  <textarea
                    rows={3}
                    value={tempCustomerNotice}
                    onChange={(e) => setTempCustomerNotice(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white leading-relaxed text-xs focus:ring-1 focus:ring-[#E5B453] focus:outline-none focus:border-[#E5B453]"
                    placeholder="輸入你要在頂部跑馬燈輪播的消息..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveCustomerNotice}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg active:scale-95 cursor-pointer text-[12px] shadow-sm tracking-wide transition flex items-center justify-center gap-1"
                >
                  <span>💾 儲存並即時推播公告</span>
                </button>
              </div>
            </div>

            {/* 時段營業時間設定 (精確到分鐘) */}
            <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4 font-sans text-left md:col-span-2">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-[#E5B453] tracking-widest block uppercase">營業控制與點餐時間鎖定</span>
                <h4 className="font-bold text-sm mt-0.5">時段營業時間設定 Custom Operating Hours (精確到分鐘)</h4>
              </div>
              <div className="space-y-4 text-xs select-none">
                {opHoursError && <div className="p-2 bg-rose-500/10 text-rose-400 text-[11px] font-bold rounded-lg border border-rose-500/20">⚠️ {opHoursError}</div>}
                {opHoursSuccess && <div className="p-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/20">🎯 {opHoursSuccess}</div>}
                
                <p className="text-[11px] text-zinc-400 leading-normal">
                  系統在設定的營業時間內自動解鎖「顧客購物車」點餐下單權限。非營業時間，顧客僅能「瀏覽菜單」但無法加入購物車或點餐。安全與時間同步以伺服器為精準標準基準，防止任何用戶端修改時間繞過機制的操作！
                </p>

                <div className="space-y-4">
                  {tempOperatingHours.map((slot, idx) => {
                    const daysOfWeekLabels = ['日', '一', '二', '三', '四', '五', '六'];
                    return (
                      <div key={slot.id || idx} className="p-3 bg-black/40 border border-[#E5B453]/10 rounded-xl space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={slot.name}
                            onChange={(e) => {
                              const updated = [...tempOperatingHours];
                              updated[idx].name = e.target.value;
                              setTempOperatingHours(updated);
                            }}
                            className="bg-transparent border-b border-white/10 hover:border-white/30 focus:border-[#E5B453] text-[12px] font-bold text-white focus:outline-none pb-0.5 w-[160px] truncate"
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...tempOperatingHours];
                                updated[idx].isActive = !updated[idx].isActive;
                                setTempOperatingHours(updated);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                                slot.isActive 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50'
                              }`}
                            >
                              {slot.isActive ? '● 啟用中 Open' : '○ 已關閉 Closed'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = tempOperatingHours.filter((_, sIdx) => sIdx !== idx);
                                setTempOperatingHours(updated);
                              }}
                              className="p-1 hover:bg-rose-500/10 rounded text-rose-400"
                              title="刪除此時段"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Start and End Inputs */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-zinc-400 block mb-1 font-semibold">開始時間 (HH:MM)</label>
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => {
                                const updated = [...tempOperatingHours];
                                updated[idx].start = e.target.value;
                                setTempOperatingHours(updated);
                              }}
                              className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 font-mono text-center text-white focus:ring-1 focus:ring-[#E5B453] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-400 block mb-1 font-semibold">結束時間 (HH:MM)</label>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => {
                                const updated = [...tempOperatingHours];
                                updated[idx].end = e.target.value;
                                setTempOperatingHours(updated);
                              }}
                              className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 font-mono text-center text-white focus:ring-1 focus:ring-[#E5B453] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Weekday Selection */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-400 block font-semibold">星期重複設定</span>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {daysOfWeekLabels.map((label, dayNum) => {
                              const isSelected = slot.days ? slot.days.includes(dayNum) : false;
                              return (
                                <button
                                  type="button"
                                  key={dayNum}
                                  onClick={() => {
                                    const updated = [...tempOperatingHours];
                                    let currentDays = slot.days ? [...slot.days] : [];
                                    if (currentDays.includes(dayNum)) {
                                      currentDays = currentDays.filter(d => d !== dayNum);
                                    } else {
                                      currentDays.push(dayNum);
                                      currentDays.sort((a, b) => a - b);
                                    }
                                    updated[idx].days = currentDays;
                                    setTempOperatingHours(updated);
                                  }}
                                  className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition border ${
                                    isSelected
                                      ? 'bg-thai-gold/20 text-thai-gold border-thai-gold/40'
                                      : 'bg-black/40 text-zinc-500 border-white/5 hover:border-white/10'
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      const newSlot = {
                        id: `oh-manual-${Date.now()}`,
                        name: `時段 ${tempOperatingHours.length + 1}`,
                        start: '11:00',
                        end: '14:30',
                        days: [0, 1, 2, 3, 4, 5, 6],
                        isActive: true
                      };
                      setTempOperatingHours([...tempOperatingHours, newSlot]);
                    }}
                    className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-750 text-white font-extrabold rounded-lg active:scale-95 cursor-pointer text-[11px] shadow-sm tracking-wide border border-white/10 flex items-center justify-center gap-1 transition"
                  >
                    <Plus size={13} />
                    <span>新增自訂營業時段</span>
                  </button>
                </div>

                <div className="border-t border-white/5 pt-4 mt-2">
                  <span className="text-[10px] font-bold text-[#E5B453] tracking-widest block uppercase mb-1">公休日 / 特殊店休設定 (Rest Days)</span>
                  <p className="text-[11px] text-zinc-400 mb-2 leading-relaxed">
                    在下方指定的日期，系統將會自動處於全天公休店休狀態 (鎖定點餐購物車)。您可以自訂任何日期，格式為 YYYY-MM-DD。
                  </p>
                  
                  {/* Rest days tags list */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tempRestDays.length === 0 ? (
                      <span className="text-[11px] text-zinc-500 italic">目前無設定公休日 No scheduled rest days.</span>
                    ) : (
                      tempRestDays.map((dateStr, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded-md text-[11px] font-mono font-bold">
                          <span>📅 {dateStr}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setTempRestDays(tempRestDays.filter((_, idx) => idx !== dIdx));
                            }}
                            className="bg-transparent text-rose-400 hover:text-rose-200 ml-1 font-bold focus:outline-none cursor-pointer text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add holiday date picker & button */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="date"
                      id="new-rest-day-input"
                      className="bg-[#121212] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:ring-1 focus:ring-[#E5B453] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('new-rest-day-input') as HTMLInputElement;
                        if (el && el.value) {
                          const val = el.value.trim();
                          if (tempRestDays.includes(val)) {
                            alert('該公休日期已經存在於列表中！');
                            return;
                          }
                          setTempRestDays([...tempRestDays, val].sort());
                          el.value = '';
                        } else {
                          alert('請先選擇有效的日期！');
                        }
                      }}
                      className="bg-zinc-800 hover:bg-zinc-750 text-white font-extrabold px-3 py-1 rounded-lg text-xs tracking-wider transition active:scale-95 cursor-pointer border border-white/10"
                    >
                      + 新增此公休日期
                    </button>
                  </div>
                </div>

                <div className="pt-2 font-sans border-t border-white/5 mt-4">
                  <button
                    type="button"
                    onClick={() => handleSaveOperatingHoursLocal(tempOperatingHours, tempRestDays)}
                    className="w-full py-2.5 bg-[#E5B453] hover:bg-amber-400 text-[#0F0F0F] font-black rounded-lg active:scale-95 cursor-pointer text-[12px] shadow-md tracking-widest transition flex items-center justify-center gap-1 uppercase"
                  >
                    <span>💾 儲存營業時間與公休日配置</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 📢 客席專用 QR CODE 與 NFC 感應點餐配置面板 (Firebase 託管驗證) */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 text-left text-xs space-y-4 col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5 gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#E5B453] tracking-widest block uppercase">FIREBASE DEPLOYED PORTAL</span>
                <h4 className="font-bold text-sm text-white">📲 餐廳感應點餐元件：QR Code 暨 NFC 智慧標籤全球管理器</h4>
              </div>
              <div className="bg-[#E5B453]/10 text-[#E5B453] px-2.5 py-1 rounded-full font-mono text-[10px] border border-[#E5B453]/20 flex items-center gap-1.5 self-start sm:self-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                託管網站: sabay--easy-web-order.asia-east1.hosted.app
              </div>
            </div>

            <p className="text-white/50 leading-relaxed font-sans">
              系統已對接並完全優化顧客端的 <strong>?table=桌號</strong> 參數監聽器與 <strong>?table=takeout</strong> 外帶自動序號生成邏輯。
              管理人員在此處可一鍵式預覽、印製各桌別的 NFC 感應與 QR Code 連結，並提供完整 NFC 手機感應燒錄指引，實現顧客貼近手機一鍵極速開網即點！
            </p>

            {/* Quick validation dashboard */}
            <div className="bg-black/25 rounded-xl border border-white/5 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <p className="font-bold text-white/40 uppercase tracking-wider text-[9px]">系統核心路由驗證 Network Gateway</p>
                <div className="space-y-1 text-zinc-300">
                  <div className="flex items-center text-emerald-400 font-bold gap-1 text-[11px]">
                    <span className="text-emerald-400">✓</span> 顧客端監聽接收器 (Param Listener) Active
                  </div>
                  <div className="flex items-center text-emerald-400 font-bold gap-1 text-[11px]">
                    <span className="text-emerald-400">✓</span> 外帶自取自動派發序列 (Seq Generator) Active
                  </div>
                  <div className="flex items-center text-emerald-400 font-bold gap-1 text-[11px]">
                    <span className="text-emerald-400">✓</span> NFC NDEF URI 符合 100% 行動裝置規約
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5 md:col-span-2">
                <p className="font-bold text-white/40 uppercase tracking-wider text-[9px]">Firebase 主域名生產分發鏈 Deployed Routing Target</p>
                <div className="bg-[#0e0e0e] border border-white/5 rounded-lg p-2 flex items-center justify-between gap-1 font-mono text-[10.5px]">
                  <span className="text-zinc-400 truncate">https://sabay--easy-web-order.asia-east1.hosted.app/</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('https://sabay--easy-web-order.asia-east1.hosted.app/');
                        setCopiedTableId('main-logo');
                        setTimeout(() => setCopiedTableId(null), 1500);
                      }}
                      className="text-[#E5B453] hover:text-amber-400 p-1 bg-white/[0.03] hover:bg-white/[0.08] rounded transition cursor-pointer"
                      title="複製主域名"
                    >
                      {copiedTableId === 'main-logo' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                    <a
                      href="https://sabay--easy-web-order.asia-east1.hosted.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white p-1 bg-white/[0.03] hover:bg-white/[0.08] rounded"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 italic">這是系統部署於 Firebase Hosting 的最終外連網址分發中樞，可對應全店桌席感應需求。</p>
              </div>
            </div>

            {/* QR/NFC Selection Slider / Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
              {/* Left Selector & Link Lists */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="border border-white/5 bg-black/25 rounded-lg p-3">
                  <span className="text-[10px] font-bold text-[#E5B453] uppercase tracking-wider block mb-2">① 請選擇欲檢視與生成的席位點：</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedQrPreviewId('takeout');
                        setTableError(null);
                        setTableSuccess(null);
                      }}
                      className={`py-2 px-1 rounded font-bold transition flex flex-col items-center justify-center gap-0.5 border cursor-pointer ${
                        selectedQrPreviewId === 'takeout'
                          ? 'bg-[#E5B453] text-[#0F0F0F] border-[#E5B453] shadow-md'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                      }`}
                    >
                      <ShoppingBag size={14} className="mb-0.5" />
                      <span className="text-[10px]">🥡 外帶專用</span>
                    </button>
                    {tables.map(tb => (
                      <button
                        key={tb.id}
                        type="button"
                        onClick={() => {
                          setSelectedQrPreviewId(tb.id);
                          setTableError(null);
                          setTableSuccess(null);
                        }}
                        className={`py-2 px-1 rounded font-bold transition flex flex-col items-center justify-center gap-0.5 border cursor-pointer ${
                          selectedQrPreviewId === tb.id
                            ? 'bg-[#E5B453] text-[#0F0F0F] border-[#E5B453] shadow-md'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                        }`}
                      >
                        <QrCode size={14} className="mb-0.5" />
                        <span className="text-[10px]">{tb.id} 號桌席</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-white/5 bg-black/20 rounded-lg p-3 space-y-2 text-[11px] text-zinc-300">
                  <span className="text-[10px] font-bold text-[#E5B453] uppercase tracking-wider block">Firebase 託管下的 NFC/QR 精準指向連結</span>
                  
                  {(() => {
                    const isTakeout = selectedQrPreviewId === 'takeout';
                    const label = isTakeout ? '🥡 外帶自取顧客專用定位點' : `🥢 內用客席第 ${selectedQrPreviewId} 桌`;
                    const relativePath = isTakeout ? '/?table=takeout' : `/?table=${selectedQrPreviewId}`;
                    const firebaseProdUrl = `https://sabay--easy-web-order.asia-east1.hosted.app/${isTakeout ? '?table=takeout' : `?table=${selectedQrPreviewId}`}`;
                    
                    return (
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-white font-extrabold text-xs">
                          <span>{label}</span>
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 px-1.5 py-0.5 rounded text-[9px]">路由校核良好 ✓</span>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 block">內部相對路徑 (Local Route Match):</label>
                          <div className="bg-[#121212] p-1.5 rounded font-mono text-[10px] text-zinc-400 border border-white/5 break-all select-all flex justify-between items-center">
                            <span>{relativePath}</span>
                            <span className="text-[8px] bg-sky-500/10 text-sky-400 px-1 rounded-sm uppercase tracking-widest shrink-0 ml-1">模擬運作</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 block">Firebase 生產域名路徑 (Production Host URL):</label>
                          <div className="bg-[#121212] p-1.5 rounded font-mono text-[10px] text-amber-100 border border-white/10 break-all select-all flex items-center justify-between gap-1">
                            <span className="text-amber-200">{firebaseProdUrl}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(firebaseProdUrl);
                                setCopiedTableId(selectedQrPreviewId);
                                setTimeout(() => setCopiedTableId(null), 1500);
                              }}
                              className="text-[#E5B453] hover:text-amber-400 p-1 bg-white/[0.03] hover:bg-white/[0.1] rounded transition shrink-0 cursor-pointer"
                              title="複製完整點餐網址"
                            >
                              {copiedTableId === selectedQrPreviewId ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Media Previews, QR Standee Rendering, NFC Guides */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual QR Code Card standee */}
                {(() => {
                  const isTakeout = selectedQrPreviewId === 'takeout';
                  const label = isTakeout ? 'TAKE-OUT' : `TABLE ${selectedQrPreviewId}`;
                  const labelZh = isTakeout ? '外 帶 自 取 由 此 點 餐' : `第 ${selectedQrPreviewId} 桌 位 內 用 點 餐`;
                  const prodUrl = isTakeout 
                    ? 'https://sabay--easy-web-order.asia-east1.hosted.app/?table=takeout' 
                    : `https://sabay--easy-web-order.asia-east1.hosted.app/?table=${selectedQrPreviewId}`;
                  
                  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=20-20-20&data=${encodeURIComponent(prodUrl)}`;

                  return (
                    <div className="border border-white/10 bg-black/35 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden group">
                      {/* Decorative brand tag */}
                      <div className="absolute top-0 inset-x-0 bg-[#E5B453] text-[#0F0F0F] text-[9px] font-black tracking-widest text-center uppercase py-0.5 select-none font-mono">
                        SABAY BBQ Thai Express
                      </div>
                      
                      <div className="bg-white p-3 rounded-xl shadow-lg border border-white/20 mt-3 flex flex-col items-center justify-center max-w-[170px] w-full">
                        <img 
                          src={qrImgUrl} 
                          alt={`QR Code Table ${selectedQrPreviewId}`}
                          className="w-full aspect-square border border-slate-100 object-contain select-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="mt-1 text-[8px] text-slate-400 font-mono tracking-tighter uppercase font-bold text-center">
                          sabay bbq cloud system
                        </div>
                      </div>

                      <div className="text-center space-y-1 w-full">
                        <div className="text-[13px] text-[#E5B453] font-serif font-black tracking-widest uppercase">
                          {label}
                        </div>
                        <div className="text-[10px] text-white/95 font-bold tracking-wider bg-white/5 px-2 py-0.5 rounded truncate">
                          {labelZh}
                        </div>
                        <p className="text-[8.5px] text-zinc-400">請用智慧手機感應 NFC 或相機掃描條碼</p>
                      </div>

                      <div className="w-full flex gap-1 text-[10px] pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const printWindow = window.open();
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>列印-席位 QR CODE</title>
                                    <style>
                                      body { text-align: center; font-family: system-ui, sans-serif; padding: 40px; }
                                      .card { border: 3px solid #000; padding: 40px; border-radius: 20px; display: inline-block; width: 300px; }
                                      h1 { font-size: 28px; margin: 0 0 10px; }
                                      h2 { font-size: 20px; margin: 0 0 20px; color: #555; }
                                      img { width: 220px; height: 220px; }
                                      .footer { margin-top: 25px; font-size: 11px; color: #888; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="card">
                                      <h1>SABAY BBQ & THAI HOTPOT</h1>
                                      <h2>${labelZh}</h2>
                                      <img src="${qrImgUrl}" />
                                      <div class="footer">
                                        NFC 感應同效 • 雙向無接觸點餐元件<br/>
                                        連結: ${prodUrl}
                                      </div>
                                    </div>
                                    <script>window.onload = function() { window.print(); }</script>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }
                          }}
                          className="flex-1 py-1.5 border border-[#E5B453]/30 hover:border-[#E5B453] text-[#E5B453] hover:bg-[#E5B453]/5 font-bold rounded transition text-[10px] active:scale-95 cursor-pointer text-center"
                        >
                          🖨️ 獨立列印
                        </button>
                        <a
                          href={qrImgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded text-center block transition text-[10px]"
                        >
                          📥 下載條碼
                        </a>
                      </div>
                    </div>
                  );
                })()}

                {/* NFC Burning Instructions */}
                <div className="border border-white/10 bg-black/35 rounded-xl p-4 flex flex-col justify-between text-left space-y-3 relative overflow-hidden">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-extrabold border-b border-white/5 pb-1.5">
                    <span className="text-[12px]">📶 NTAG 晶片寫入與 NFC 標籤燒錄指示</span>
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                    NFC (近場通訊貼紙) 為進階點餐的完美體驗。將貼紙貼於餐桌桌面或玻璃立牌，顧客不需打開相機，只需手機靠近即可喚醒此點餐頁面並帶入桌號座次：
                  </p>

                  <div className="space-y-1.5 bg-[#0A0A0A] p-2 rounded-lg border border-white/5 text-[9.5px]">
                    <div className="space-y-1">
                      <span className="text-[#E5B453]/95 block font-bold">🛠️ 燒寫步驟 / Writing Tool Steps</span>
                      <ol className="list-decimal list-inside text-zinc-400 space-y-0.5 font-sans">
                        <li>下載手機 App：<span className="text-white">NFC Tools</span> (免費下載)</li>
                        <li>進入 App 點選：<span className="text-white">【Write (寫入)】</span></li>
                        <li>選擇：<span className="text-white">【Add a record】</span> &rarr; <span className="text-white">【URL / URI】</span></li>
                        <li>將下方網址複製並寫入 NTAG213晶片：</li>
                      </ol>
                      <div className="bg-black border border-white/10 p-1 rounded font-mono text-[9px] text-[#E5B453] break-all select-all">
                        {selectedQrPreviewId === 'takeout' 
                          ? 'https://sabay--easy-web-order.asia-east1.hosted.app/?table=takeout' 
                          : `https://sabay--easy-web-order.asia-east1.hosted.app/?table=${selectedQrPreviewId}`}
                      </div>
                      <ol start="5" className="list-decimal list-inside text-zinc-400 space-y-0.5 font-sans">
                        <li>點擊 <span className="text-white">【Write】</span>，手機靠貼紙即完成！</li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded p-1.5 flex items-start gap-1 text-[9.5px]">
                    <span className="shrink-0">ℹ️</span>
                    <span>建議選用防金屬干擾NTAG213系列貼紙，能防止因鋼製木餐桌造成的電磁波感應下降。</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing push notification dispatch tools */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 text-left text-xs">
            <h4 className="font-bold text-sm text-[#E5B453] mb-1">🎁 虛擬行銷與桌上驚喜快遞 simulation dispatcher</h4>
            <p className="text-white/40 mb-3 leading-snug">此模擬工具可針對現正入店顧客桌面的平板推播限定驚喜，以提高點單流速與庫存流轉率：</p>
            <form onSubmit={handleSendPush} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="space-y-1">
                <label className="text-zinc-400">推播徽章標題 Badge</label>
                <input type="text" value={promoBadge} onChange={(e) => setPromoBadge(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2 px-2.5 py-1.5 text-white" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-zinc-400">推播文字內容 Message</label>
                <input type="text" value={promoMessage} onChange={(e) => setPromoMessage(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white" />
              </div>
              <div>
                <button type="submit" className="w-full py-1.5 bg-[#E5B453] hover:bg-amber-400 text-slate-900 font-black rounded active:scale-95 transition cursor-pointer text-xs">
                  ⚡ 立即發送全店面板廣播
                </button>
              </div>
            </form>
            {pushSentConfirm && <div className="mt-2.5 text-emerald-400 font-bold animate-pulse text-[11px]">🎉 模擬廣播推播已成功發送！全店面板將同步收到提示通知。</div>}
          </div>
        </div>
      )}


      {/* ==================== SCREEN SUBTAB: PRINTER SETTINGS ==================== */}
      {activeSubTab === 'printer' && (
        <div className="space-y-6 animate-fadeIn text-left font-sans" id="subtab-section-printer">
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <span className="text-xl">🖨️</span>
              <div>
                <h4 className="font-bold text-sm text-white">印表機與硬體規格管理器 (Printer Setup Center)</h4>
                <p className="text-white/40 text-xs">分離設置廚房KDS備餐印表機與前台帳單收銀印表機，不同模組各司其職，隨寬度自適應縮放字體大小。</p>
              </div>
            </div>

            {printerSaveSuccess && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl text-center text-xs">
                {printerSaveSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. KDS Kitchen Printer config */}
              <div className="bg-black/40 border border-[#E5B453]/20 p-4 rounded-xl space-y-4">
                <span className="text-xs text-[#E5B453] font-extrabold block uppercase tracking-wider">🍳 廚房 KDS 工作票印表機</span>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">連接方式 Connection Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['USB', 'IP'].map(type => (
                        <button
                          key={`kit-conn-${type}`}
                          type="button"
                          onClick={() => setKitchenPrinter({ ...kitchenPrinter, connectionType: type as any })}
                          className={`py-1.5 rounded-lg border font-bold text-center cursor-pointer ${
                            kitchenPrinter.connectionType === type
                              ? 'bg-[#E5B453]/20 border-[#E5B453] text-[#E5B453]'
                              : 'bg-zinc-900 border-white/5 text-zinc-400'
                          }`}
                        >
                          {type === 'USB' ? '🔌 USB 連線' : '🌐 網路 IP 連線'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {kitchenPrinter.connectionType === 'IP' ? (
                    <div>
                      <label className="text-zinc-400 block mb-1">印表機固定 IP 位址</label>
                      <input
                        type="text"
                        value={kitchenPrinter.ip}
                        onChange={(e) => setKitchenPrinter({ ...kitchenPrinter, ip: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                        placeholder="例如: 192.168.1.101"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-zinc-400 block mb-1">USB 埠位置 USB Port (ComPath)</label>
                      <input
                        type="text"
                        value={kitchenPrinter.usbPort}
                        onChange={(e) => setKitchenPrinter({ ...kitchenPrinter, usbPort: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                        placeholder="例如: USB001, /dev/usb/lp0"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-zinc-400 block mb-1">紙張出單寬度 Width Specs</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['58mm', '80mm'].map(w => (
                        <button
                          key={`kit-w-${w}`}
                          type="button"
                          onClick={() => setKitchenPrinter({ ...kitchenPrinter, width: w as any, fontSizeFactor: w === '58mm' ? 0.8 : 1.0 })}
                          className={`py-1.5 rounded-lg border font-bold text-center cursor-pointer ${
                            kitchenPrinter.width === w
                              ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                              : 'bg-zinc-900 border-white/5 text-zinc-400'
                          }`}
                        >
                          {w} {w === '58mm' ? '(縮放 0.8x)' : '(標準 1.0x)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">出單字體縮放比例 Font Scale</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={kitchenPrinter.fontSizeFactor}
                      onChange={(e) => setKitchenPrinter({ ...kitchenPrinter, fontSizeFactor: parseFloat(e.target.value) })}
                      className="w-full accent-[#E5B453]"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-zinc-500 mt-1">
                      <span>最小(0.5x)</span>
                      <span className="text-[#E5B453] font-bold">當前: {kitchenPrinter.fontSizeFactor}x</span>
                      <span>最大(2.0x)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">自訂列印抬頭 (廚房名稱)</label>
                    <input
                      type="text"
                      value={kitchenPrinter.restaurantName}
                      onChange={(e) => setKitchenPrinter({ ...kitchenPrinter, restaurantName: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">表頭自訂引言 Pre-title Message</label>
                    <input
                      type="text"
                      value={kitchenPrinter.headerPrefix}
                      onChange={(e) => setKitchenPrinter({ ...kitchenPrinter, headerPrefix: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">表尾注意事項 Footer Warning</label>
                    <input
                      type="text"
                      value={kitchenPrinter.footerSuffix}
                      onChange={(e) => setKitchenPrinter({ ...kitchenPrinter, footerSuffix: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Front Receipt/Bill Printer config */}
              <div className="bg-black/40 border border-blue-500/20 p-4 rounded-xl space-y-4">
                <span className="text-xs text-blue-400 font-extrabold block uppercase tracking-wider">🧾 前台帳單與收銀明細印表機</span>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">連接方式 Connection Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['USB', 'IP'].map(type => (
                        <button
                          key={`bill-conn-${type}`}
                          type="button"
                          onClick={() => setBillPrinter({ ...billPrinter, connectionType: type as any })}
                          className={`py-1.5 rounded-lg border font-bold text-center cursor-pointer ${
                            billPrinter.connectionType === type
                              ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                              : 'bg-zinc-900 border-white/5 text-zinc-400'
                          }`}
                        >
                          {type === 'USB' ? '🔌 USB 連線' : '🌐 網路 IP 連線'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {billPrinter.connectionType === 'IP' ? (
                    <div>
                      <label className="text-zinc-400 block mb-1">印表機固定 IP 位址</label>
                      <input
                        type="text"
                        value={billPrinter.ip}
                        onChange={(e) => setBillPrinter({ ...billPrinter, ip: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white font-mono"
                        placeholder="例如: 192.168.1.102"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-zinc-400 block mb-1">USB 埠位置 USB Port (ComPath)</label>
                      <input
                        type="text"
                        value={billPrinter.usbPort}
                        onChange={(e) => setBillPrinter({ ...billPrinter, usbPort: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg p-2 text-white font-mono"
                        placeholder="例如: USB002, /dev/usb/lp1"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-zinc-400 block mb-1">紙張出單寬度 Width Specs</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['58mm', '80mm'].map(w => (
                        <button
                          key={`bill-w-${w}`}
                          type="button"
                          onClick={() => setBillPrinter({ ...billPrinter, width: w as any, fontSizeFactor: w === '58mm' ? 0.8 : 1.0 })}
                          className={`py-1.5 rounded-lg border font-bold text-center cursor-pointer ${
                            billPrinter.width === w
                              ? 'bg-blue-400/20 border-blue-400 text-blue-300'
                              : 'bg-zinc-900 border-white/5 text-zinc-400'
                          }`}
                        >
                          {w} {w === '58mm' ? '(縮放 0.8x)' : '(標準 1.0x)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">出單字體縮放比例 Font Scale</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={billPrinter.fontSizeFactor}
                      onChange={(e) => setBillPrinter({ ...billPrinter, fontSizeFactor: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-zinc-500 mt-1">
                      <span>最小(0.5x)</span>
                      <span className="text-blue-400 font-bold">當前: {billPrinter.fontSizeFactor}x</span>
                      <span>最大(2.0x)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">抬頭餐廳名稱 Restaurant Name</label>
                    <input
                      type="text"
                      value={billPrinter.restaurantName}
                      onChange={(e) => setBillPrinter({ ...billPrinter, restaurantName: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-zinc-400 block mb-1">電話 Tel</label>
                      <input
                        type="text"
                        value={billPrinter.printTelephone}
                        onChange={(e) => setBillPrinter({ ...billPrinter, printTelephone: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">開啟出單時間戳</label>
                      <div className="flex items-center h-9 pl-1">
                        <input
                          type="checkbox"
                          id="bill-checkbox-time"
                          checked={billPrinter.printTimeEnabled}
                          onChange={(e) => setBillPrinter({ ...billPrinter, printTimeEnabled: e.target.checked })}
                          className="w-4 h-4 text-blue-500 bg-[#161616] border-white/10 rounded focus:ring-0"
                        />
                        <label htmlFor="bill-checkbox-time" className="text-[11px] text-zinc-300 ml-2 cursor-pointer font-bold">列印時標記精確時間</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">列印餐廳地址 Address</label>
                    <input
                      type="text"
                      value={billPrinter.printAddress}
                      onChange={(e) => setBillPrinter({ ...billPrinter, printAddress: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white font-sans text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">表頭促銷首語 Header Slogan</label>
                    <input
                      type="text"
                      value={billPrinter.headerPrefix}
                      onChange={(e) => setBillPrinter({ ...billPrinter, headerPrefix: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">副聯結尾致謝辭 Thank You Message</label>
                    <input
                      type="text"
                      value={billPrinter.footerSuffix}
                      onChange={(e) => setBillPrinter({ ...billPrinter, footerSuffix: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-2">
              <button
                type="button"
                onClick={handleSavePrinters}
                className="flex-1 py-3 bg-[#E5B453] hover:bg-amber-400 text-black font-black rounded-lg text-xs tracking-wider transition active:scale-95 cursor-pointer text-center"
              >
                💾 儲存並同步雙模組印表機設定 Store Printer Profiles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN SUBTAB: MENU OPTION RULES MANAGER ==================== */}
      {activeSubTab === 'options' && (
        <div className="space-y-6 animate-fadeIn text-left font-sans" id="subtab-section-options">
          <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <span className="text-xl">🧩</span>
              <div>
                <h4 className="font-bold text-sm text-white">餐點客製附加選項規則管理器 (Global Choice Rules Manager)</h4>
                <p className="text-white/40 text-xs">在此建立全店共用客製選項規則。例如：加配料與價格、辣度熟度細則等，統一發布至餐點附加池中。</p>
              </div>
            </div>

            {/* Create Rule Form */}
            <div className="bg-[#202020] border border-white/5 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold text-[#E5B453] tracking-widest block uppercase">➕ 新增一筆全域附加共用選項規則</span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">選項名稱 (e.g. 加河粉, 小鮮蝦)</label>
                  <input
                    type="text"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                    placeholder="輸入例如：加河粉"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">客製項目分類</label>
                  <select
                    value={newRuleCategory}
                    onChange={(e) => setNewRuleCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="加配料">加配料 (Extra Ingredients)</option>
                    <option value="熟度調整">熟度調整 (Cooking Level)</option>
                    <option value="辣度調整">辣度調整 (Spiciness)</option>
                    <option value="主食更換">主食更換 (Main Carb)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">額外附加價格 NT$</label>
                  <input
                    type="number"
                    min="0"
                    value={newRulePrice}
                    onChange={(e) => setNewRulePrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddGlobalRule}
                    className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs leading-none transition active:scale-95 cursor-pointer"
                  >
                    新增此選項規則
                  </button>
                </div>
              </div>
            </div>

            {/* Rules DB List */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 font-bold block uppercase tracking-wider">🗂️ 全店共用客製選項規則資料庫</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {globalRules.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic p-4">暫未建立任何全域加選選項</p>
                ) : (
                  globalRules.map((rule) => (
                    <div key={rule.id} className="p-3 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold text-[#E5B453] bg-[#E5B453]/10 px-1.5 py-0.5 rounded border border-[#E5B453]/20">
                            {rule.category}
                          </span>
                          <span className="text-xs font-bold text-white leading-none">{rule.name}</span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-400">額外附帶價格: <span className="text-amber-300 font-extrabold">NT$ {rule.price}</span></p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteGlobalRule(rule.id)}
                        className="text-[10px] bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-400 hover:text-white px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer"
                      >
                        刪除
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN SUBTAB: EOD DAILY CHECKOUT ==================== */}
      {activeSubTab === 'eod' && (() => {
        const paidOrders = orders.filter(o => o.isPaid);
        const unpaidOrders = orders.filter(o => !o.isPaid && o.status !== 'cancelled');
        const totalRev = paidOrders.reduce((sum, ord) => sum + ord.total, 0);
        const cashSum = paidOrders.filter(o => o.paymentMethod === 'cash').reduce((sum, ord) => sum + ord.total, 0);
        const creditSum = paidOrders.filter(o => o.paymentMethod === 'credit').reduce((sum, ord) => sum + ord.total, 0);
        const linepaySum = paidOrders.filter(o => o.paymentMethod === 'linepay').reduce((sum, ord) => sum + ord.total, 0);
        const memberSum = paidOrders.filter(o => o.paymentMethod === 'member').reduce((sum, ord) => sum + ord.total, 0);

        // Calculate quantities of each item sold
        const itemQuants: { [name: string]: { zh: string; qty: number } } = {};
        paidOrders.forEach(o => {
          o.items.forEach(it => {
            const label = it.name.zh;
            if (!itemQuants[label]) {
              itemQuants[label] = { zh: label, qty: 0 };
            }
            itemQuants[label].qty += it.qty;
          });
        });

        // Calculate standard ingredient consumption based on recipes
        const calculatedDeductions: { [ingId: string]: number } = {};
        ingredients.forEach(ig => {
          calculatedDeductions[ig.id] = 0;
        });

        paidOrders.forEach(o => {
          o.items.forEach(it => {
            const recipe = recipeCompositionMap[it.id];
            if (recipe) {
              recipe.forEach(rec => {
                const ingObj = ingredients.find(ig => ig.name.zh === rec.name || ig.id === rec.name);
                if (ingObj) {
                  const match = rec.qty.match(/([\d\.]+)/);
                  const amountPerItem = match ? parseFloat(match[1]) : 1;
                  calculatedDeductions[ingObj.id] += amountPerItem * it.qty;
                }
              });
            }
          });
        });

        const handlePerformInventoryEodDeduction = async () => {
          let successCount = 0;
          try {
            for (const ig of ingredients) {
              const consumption = calculatedDeductions[ig.id] || 0;
              if (consumption > 0) {
                const res = await fetch('/api/inventory/adjust', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ingredientId: ig.id,
                    quantityChanged: -consumption,
                    note: `EOD 每日關帳自動扣減：已售餐品配方消耗核銷`
                  })
                });
                if (res.ok) {
                  successCount++;
                }
              }
            }
            alert(`🎉 庫存連動扣除成功！已為您同步自動化核銷對應 ${successCount} 項餐品配方食材物料流向。`);
            if (ingredients.length > 0) {
              await onRestock(ingredients[0].id, 0); // Sync parent state
            }
            await fetchInventoryLogs();
          } catch (err) {
            console.error(err);
            alert('❌ 自動配方庫存扣減時發生預期外錯誤');
          }
        };

        const handleEodReceiptPrint = () => {
          const lines = Object.entries(itemQuants).map(([lbl, val]) => `  • ${lbl.padEnd(16)} x${val.qty}`).join('\n');
          const ingredientLines = ingredients.map(ig => {
            const consumption = calculatedDeductions[ig.id] || 0;
            return `  • ${ig.name.zh.padEnd(12)}: 剩餘 ${ig.stock} ${ig.unit} (今日已扣減 ${consumption} ${ig.unit})`;
          }).join('\n');

          const receiptBody = `
========================================
       沙貝燒烤 (每日營業結算日報表)
========================================
列印時間: ${new Date().toLocaleString()}
報表日期: ${new Date().toLocaleDateString()}
-----------------------------------------
【今日營業數據加總】
今日實收總額 (Net Revenue): NT$ ${totalRev} 元
成功收款單數 (Paid Bills): ${paidOrders.length} 筆
未收細單單數 (Unpaid Bills): ${unpaidOrders.length} 筆

【付款方式明細匯總】
  - 💵 現金收銀 (Cash):   NT$ ${cashSum} 元
  - 💳 信用卡結 (Credit): NT$ ${creditSum} 元
  - 🖥️ 行動支付 (TWQR):   NT$ ${linepaySum} 元
  - 👤 會員儲值 (Member): NT$ ${memberSum} 元
-----------------------------------------
【餐點熱銷排行明細】
${lines || '  (今天尚無完成收銀單商品)'}
-----------------------------------------
【連動數據庫存原料位變動】
${ingredientLines || '  (尚無庫存異動記錄)'}
-----------------------------------------
設定店名: ${billPrinter.restaurantName}
聯絡電話: ${billPrinter.printTelephone}
店鋪地址: ${billPrinter.printAddress}
========================================
          `.trim();

          const pWin = window.open();
          if (pWin) {
            pWin.document.write(`
              <html>
                <head>
                  <title>SABAY 每日結帳報表 (EOD)</title>
                  <style>
                    body {
                      font-family: monospace;
                      background: #fff;
                      color: #000;
                      padding: 20px;
                      font-size: ${billPrinter.width === '58mm' ? '12px' : '14px'};
                      max-width: ${billPrinter.width === '58mm' ? '280px' : '400px'};
                      margin: 0 auto;
                      white-space: pre-wrap;
                    }
                  </style>
                </head>
                <body>
                  <pre>${receiptBody}</pre>
                  <script>window.onload = function() { window.print(); }</script>
                </body>
              </html>
            `);
            pWin.document.close();
          }
        };

        const handleCompleteEodAndLogout = () => {
          alert('🏁 每日關帳作業與庫存對帳已核銷完畢，即將登出工作人員並鎖定客用介面！');
          localStorage.removeItem('google-current-member');
          localStorage.removeItem('line-profile');
          window.location.href = '/';
        };

        return (
          <div className="space-y-6 animate-fadeIn text-left font-sans" id="subtab-section-eod">
            <div className="bg-[#161616] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                <span className="text-xl">🏁</span>
                <div>
                  <h4 className="font-bold text-sm text-white">沙貝每日關帳結核系統 (Daily Business EOD Checkout Portal)</h4>
                  <p className="text-white/40 text-xs">執行每日店面關帳結算，一鍵更新餐點銷售與原料配銷，產印熱感報表與結存變更，強化營運動能。</p>
                </div>
              </div>

              {/* Stats KPI Card in Checkout Panel */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-black/30 p-4 rounded-xl border border-white/5">
                <div className="text-center p-2.5 bg-zinc-900 border border-white/5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 block font-semibold">今日關帳實收金額</span>
                  <span className="text-lg font-mono font-black text-[#E5B453]">NT$ {totalRev}</span>
                </div>
                <div className="text-center p-2.5 bg-zinc-900 border border-white/5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 block font-semibold">已收款單數</span>
                  <span className="text-lg font-mono font-black text-white">{paidOrders.length} 筆</span>
                </div>
                <div className="text-center p-2.5 bg-zinc-900 border border-white/5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 block font-semibold">現金收訖 (Cash)</span>
                  <span className="text-lg font-mono font-black text-emerald-400">NT$ {cashSum}</span>
                </div>
                <div className="text-center p-2.5 bg-zinc-900 border border-white/5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 block font-semibold">信用卡收訖 (Credit)</span>
                  <span className="text-lg font-mono font-black text-blue-400">NT$ {creditSum}</span>
                </div>
                <div className="text-center p-2.5 bg-zinc-900 border border-white/5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 block font-semibold">TWQR/會員扣抵合計</span>
                  <span className="text-lg font-mono font-black text-teal-400">NT$ {linepaySum + memberSum}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Unpaid orders & Payment State transitions */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-4">
                  <div className="space-y-0.5 border-b border-white/5 pb-2">
                    <h5 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                      ⏱️ 待核銷未收細單明細 ({unpaidOrders.length})
                    </h5>
                    <p className="text-[10px] text-zinc-500">此為今日仍維持未結帳狀態之點單，關帳前可一鍵變更支付方式或進行收銀狀態流轉。</p>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {unpaidOrders.length === 0 ? (
                      <div className="text-center py-8 text-xs text-zinc-500 italic">
                        🎉 太棒了！今日已無任何未結帳點單。
                      </div>
                    ) : (
                      unpaidOrders.map(ord => (
                        <div key={ord.id} className="p-3 bg-zinc-900/80 rounded-lg border border-white/5 text-xs text-zinc-300 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-white">{ord.id.slice(-6).toUpperCase()} ({ord.tableNumber} 桌)</span>
                            <span className="font-mono text-[#E5B453] font-black">NT$ {ord.total}</span>
                          </div>
                          
                          <div className="flex gap-1.5 pt-1 border-t border-white/5">
                            {(['cash', 'credit', 'linepay'] as const).map(pm => (
                              <button
                                key={pm}
                                type="button"
                                onClick={async () => {
                                  if (onPayOrder) {
                                    await onPayOrder(ord.id, {
                                      paymentMethod: pm,
                                      isPaid: true
                                    });
                                    alert(`💸 已將點單 ${ord.id.slice(-6).toUpperCase()} 修改為【已結款 (${pm === 'cash' ? '現金' : pm === 'credit' ? '信用卡' : 'TWQR'})】`);
                                  }
                                }}
                                className="flex-1 py-1 rounded bg-zinc-800 hover:bg-[#E5B453] hover:text-black transition-colors text-[9px] font-black"
                              >
                                {pm === 'cash' ? '現結' : pm === 'credit' ? '刷卡' : 'TWQR'}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 2: Inventory deductions analysis */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-4">
                  <div className="space-y-0.5 border-b border-white/5 pb-2">
                    <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                      📦 連動「數據庫存」今日配餐配銷扣減
                    </h5>
                    <p className="text-[10px] text-zinc-500">系統即時比對已收款餐品之食材配方，模擬計算當日營業流失的理論庫存量。</p>
                  </div>

                  <div className="space-y-2.5 text-xs text-zinc-300">
                    <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/5 space-y-1.5 max-h-72 overflow-y-auto">
                      {ingredients.map(ig => {
                        const consumption = calculatedDeductions[ig.id] || 0;
                        const isWarning = ig.stock - consumption <= ig.minThreshold;
                        return (
                          <div key={ig.id} className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span>{ig.name.zh}</span>
                            <div className="text-right font-mono text-[11px]">
                              <span className="text-zinc-500">今日應扣: </span>
                              <span className="text-amber-400 font-bold pr-2">{consumption} {ig.unit}</span>
                              <span className="text-zinc-500">預估剩餘: </span>
                              <span className={isWarning ? 'text-rose-400 font-black' : 'text-zinc-300'}>
                                {Math.max(0, Math.round((ig.stock - consumption) * 100) / 100)} {ig.unit}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handlePerformInventoryEodDeduction}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-lg text-xs tracking-wider transition active:scale-95 cursor-pointer uppercase text-center shadow-lg"
                    >
                      📊 連動扣減：一鍵對應「數據庫存」扣位
                    </button>
                  </div>
                </div>

                {/* Column 3: Print Receipt Preview layout */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-4">
                  <div className="space-y-0.5 border-b border-white/5 pb-2">
                    <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                      🖨️ 每日營業關帳日報表列印預覽
                    </h5>
                    <p className="text-[10px] text-zinc-500">根據當前設定之熱感式出單硬體寬度（目前：{billPrinter.width}），模擬產生實體對帳聯（含原料變動紀錄）。</p>
                  </div>

                  {/* Thermal paper simulator */}
                  <div className="bg-zinc-950 border border-white/15 p-4 rounded-xl text-[10px] font-mono text-zinc-300 pointer-events-none select-none max-h-64 overflow-y-auto space-y-1 leading-tight">
                    <p className="text-center font-bold text-white">沙貝燒烤 每日營業日報表</p>
                    <p className="text-[9px] text-zinc-500 text-center">列印時間: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                    <div className="border-t border-dashed border-zinc-700 my-1"></div>
                    <div className="flex justify-between">
                      <span>今日實收總額 (Net):</span>
                      <span className="font-bold text-[#E5B453]">NT$ {totalRev}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>成功收款單數:</span>
                      <span>{paidOrders.length} 筆</span>
                    </div>
                    <div className="border-t border-dashed border-zinc-700 my-1"></div>
                    <p className="text-[9px] text-[#E5B453] uppercase font-bold">付款方式細點明細:</p>
                    <p>  💵 現金收銀 (Cash):   NT$ {cashSum}元</p>
                    <p>  💳 信用卡結 (Credit): NT$ {creditSum}元</p>
                    <p>  🖥️ 行動支付 (TWQR):   NT$ {linepaySum}元</p>
                    <p>  👤 会員帳抵 (Member): NT$ {memberSum}元</p>
                    <div className="border-t border-dashed border-zinc-700 my-1"></div>
                    <p className="text-[9px] text-[#E5B453] uppercase font-bold">餐點累計熱售排行:</p>
                    {Object.entries(itemQuants).length === 0 ? (
                      <p className="italic text-zinc-650">  (今日尚無完成結帳商品)</p>
                    ) : (
                      Object.entries(itemQuants).map(([lbl, val]) => (
                        <p key={lbl}>  • {lbl.slice(0, 10).padEnd(12)} x{val.qty}</p>
                      ))
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleEodReceiptPrint}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white font-bold rounded-lg text-xs transition active:scale-95 cursor-pointer uppercase text-center"
                  >
                    🖨️ 列印預覽並傳送至熱感印表機 (Print)
                  </button>
                </div>
              </div>

              {/* Action and Safe lock Gate */}
              <div className="bg-[#202020] border border-rose-500/20 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-1">
                  <span className="text-xs font-bold text-rose-400 tracking-widest block uppercase">🏁 安全結帳與登出強制安全鎖</span>
                  <p className="text-[11px] text-zinc-400">執行總營業終結轉後，為求當日帳款安全，系統將自動清理當日點餐通道並登出，返回訪客用餐前台頁面。</p>
                </div>
                
                <button
                  type="button"
                  onClick={handleCompleteEodAndLogout}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-lg text-xs tracking-wider transition active:scale-95 cursor-pointer uppercase text-center whitespace-nowrap shrink-0"
                >
                  🏁 立即執行每日總結帳登出 Exit Safely
                </button>
              </div>
            </div>
          </div>
        );
      })()}




      {/* ========================================================================= */}
      {/* ==================== SCREEN POPUP RESILIENT MODALS ==================== */}
      {/* ========================================================================= */}

      {/* SINGLE ORDER DRILLDOWN DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="order-detail-drilldown-modal" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-left" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="bg-[#E5B453] text-black font-extrabold px-2.5 py-1 rounded text-xs">單筆點單核數明細</span>
                <h3 className="font-bold text-base font-mono">{selectedOrder.id}</h3>
                <span className="text-xs text-white/50">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white transition text-xs cursor-pointer outline-none bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
              >
                關閉 ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Customer & Status Controls */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-black tracking-widest text-[#E5B453] uppercase block">顧客與桌席定位</span>
                  <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
                    <img src={selectedOrder.customerAvatar} defaultValue="" alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedOrder.customerName}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">會員身份：{selectedOrder.isMember ? '⭐ Google Quick 會員' : '本桌一般餐客'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase">餐客桌位/服務類型</span>
                      {editingOrderTableId === selectedOrder.id ? (
                        <div className="mt-1 space-y-1.5" id="editing-order-table-section-drilldown">
                          <select
                            value={editingOrderTableValue}
                            onChange={(e) => setEditingOrderTableValue(e.target.value)}
                            className="w-full bg-[#1c1c1c] border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E5B453]"
                          >
                            <optgroup label="客席就座桌號">
                              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((num) => (
                                <option key={num} value={num}>
                                  🪑 第 {num} 桌 (Dine-in)
                                </option>
                              ))}
                              {tables && tables.map((t) => (
                                !Array.from({ length: 12 }, (_, i) => String(i + 1)).includes(t.id) && (
                                  <option key={t.id} value={t.id}>
                                    🪑 第 {t.id} 桌
                                  </option>
                                )
                              ))}
                            </optgroup>
                            <optgroup label="外帶自取佇列號碼">
                              {Array.from({ length: 15 }, (_, i) => `外帶 #${i + 1}`).map((takeoutId) => (
                                <option key={takeoutId} value={takeoutId}>
                                  🛍️ {takeoutId} (Takeout)
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={async () => {
                                if (onUpdateTableNumber) {
                                  const res = await onUpdateTableNumber(selectedOrder.id, editingOrderTableValue);
                                  if (res.success) {
                                    selectedOrder.tableNumber = editingOrderTableValue;
                                    setEditingOrderTableId(null);
                                  } else {
                                    alert(res.error || '變更桌號失敗');
                                  }
                                } else {
                                  selectedOrder.tableNumber = editingOrderTableValue;
                                  setEditingOrderTableId(null);
                                }
                              }}
                              className="text-[9px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded cursor-pointer transition active:scale-95"
                            >
                              確改 OK
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingOrderTableId(null)}
                              className="text-[9px] bg-zinc-700 hover:bg-zinc-650 text-zinc-300 font-extrabold px-2 py-0.5 rounded cursor-pointer transition active:scale-95"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start gap-1 mt-0.5">
                          <p className="font-extrabold text-sm text-white">{selectedOrder.tableNumber} {selectedOrder.tableNumber.includes('外帶') ? '' : '桌'}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOrderTableId(selectedOrder.id);
                              setEditingOrderTableValue(selectedOrder.tableNumber);
                            }}
                            className="text-[9px] text-[#E5B453] hover:text-amber-300 bg-white/5 border border-white/5 hover:border-[#E5B453]/20 px-1.5 py-0.5 rounded cursor-pointer transition font-bold"
                          >
                            ✎ 更改桌號/外帶
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase">支付途徑管道</span>
                      <p className="font-bold text-sm text-white capitalize mt-0.5">
                        {selectedOrder.paymentMethod === 'linepay' ? 'TWQR支付' : (selectedOrder.paymentMethod === 'credit' ? '信用卡支付' : (selectedOrder.paymentMethod === 'member' ? '會員儲值支付' : '現場現金結算'))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status modifier triggers */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-black tracking-widest text-[#E5B453] uppercase block">出餐進度狀態變更</span>
                  <p className="text-[10px] text-white/40 leading-tight">切換此狀態將向 KDS 後台及客端即時同步。點選「已取消」將會自動算退釋原物料庫存！</p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {[
                      { status: 'pending', label: '⏳ 待處理 Pending', color: 'hover:bg-amber-500/20 text-amber-400 border-amber-500/30' },
                      { status: 'preparing', label: '🍳 準備中 Preparing', color: 'hover:bg-blue-500/20 text-blue-400 border-blue-500/30' },
                      { status: 'completed', label: '✅ 已完成 Completed', color: 'hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                      { status: 'cancelled', label: '❌ 已取消 Cancelled', color: 'hover:bg-rose-500/20 text-rose-400 border-rose-500/30' }
                    ].map((btn) => (
                      <button
                        type="button"
                        key={btn.status}
                        onClick={async () => {
                          if (btn.status === 'cancelled') {
                            if (!window.confirm(`⚠️ 接單安全性確定：要取消訂單 ${selectedOrder.id} 嗎？此操作將會把消耗的配料存量算退。`)) return;
                          }
                          await onUpdateOrderStatus(selectedOrder.id, btn.status as any);
                          setSelectedOrder({ ...selectedOrder, status: btn.status as any });
                        }}
                        className={`py-2 px-3 border rounded-lg text-[11px] font-bold transition active:scale-95 text-left flex items-center justify-between cursor-pointer ${btn.color} ${
                          selectedOrder.status === btn.status
                            ? 'bg-white/10 border-white/30 text-white font-black'
                            : 'bg-black/20'
                        }`}
                      >
                        <span>{btn.label}</span>
                        {selectedOrder.status === btn.status && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B453]"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Print simulator option */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3 text-xs">
                  <span className="text-[10px] font-black tracking-widest text-[#E5B453] uppercase block">店鋪出餐熱感存票模擬</span>
                  <p className="text-[10px] text-white/40">可將顧客結賬明細或廚房交代工作票重寄發送列印隊列備用明細單：</p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => alert(`🖨️ 模擬重行印列【防爆/防油熱感廚房交代票】成功！`)}
                      className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10.5px] border border-white/10 font-bold active:scale-95 transition cursor-pointer"
                    >
                      🧾 再印工作廚房票
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`🖨️ 模擬重行印列【顧客結賬發票與消點收據】成功！`)}
                      className="flex-1 py-1.5 bg-[#E5B453]/15 hover:bg-[#E5B453]/25 text-[#E5B453] rounded-lg text-[10.5px] border border-[#E5B453]/25 font-bold active:scale-95 transition cursor-pointer"
                    >
                      💵 再印顧客結算收據
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Ordered dishes list and checkout status */}
              {!selectedOrder.isPaid ? (
                /* ----------------- UNPAID ORDER PANEL ----------------- */
                <div className="md:col-span-7 space-y-4 font-sans">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black tracking-widest text-[#E5B453] uppercase block">餐點規格與特配耗用</span>
                      <h4 className="text-white text-xs mt-0.5">本單餐點品項與客製需求：</h4>
                    </div>
                    
                    <div className="divide-y divide-white/5 space-y-3">
                      {selectedOrder.items.map((it: any) => {
                        const spec = [
                          it.customization?.spiciness === 0 ? '不辣' : (it.customization?.spiciness === 1 ? '小辣' : (it.customization?.spiciness === 2 ? '中辣' : '泰辣')),
                          it.customization?.sweetness === 0 ? '無糖' : (it.customization?.sweetness === 1 ? '微糖' : (it.customization?.sweetness === 2 ? '正常甜' : '多糖')),
                          it.customization?.noodleType === 'rice-noodle' ? '河粉' : (it.customization?.noodleType === 'vermicelli' ? '米線' : ''),
                          it.customization?.soupBase === 'coconut-milk' ? '升級奶香冬蔭' : '',
                          it.customization?.notes ? `客備：${it.customization?.notes}` : ''
                        ].filter(Boolean).join(' / ');

                        return (
                          <div key={it.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs font-sans">
                            <div className="space-y-1 pr-4">
                              <p className="font-bold text-white text-[13px]">{it.name?.zh || it.name}</p>
                              {spec && <p className="text-[10px] text-amber-400 font-sans">{spec}</p>}
                              <p className="text-[10px] text-zinc-500 font-mono">定額單價: NT$ {it.price}</p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              {/* Quantity Editor Buttons */}
                              <div className="flex items-center border border-white/10 rounded-lg bg-black/40 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => handleLocalQtyChange(it.id, -1)}
                                  className="p-1 px-2 hover:bg-white/5 text-zinc-400 hover:text-white transition cursor-pointer"
                                  title="減少數量"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="px-2 font-mono text-xs font-bold text-white select-none">{it.qty}</span>
                                <button
                                  type="button"
                                  onClick={() => handleLocalQtyChange(it.id, 1)}
                                  className="p-1 px-2 hover:bg-white/5 text-zinc-400 hover:text-white transition cursor-pointer"
                                  title="增加數量"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>

                              <div className="text-right whitespace-nowrap min-w-[70px]">
                                <p className="font-mono text-white font-bold text-[13px]">NT$ {(it.price * it.qty).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add dish tool inline */}
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <span className="text-[10px] text-white/40 font-bold block mb-1">➕ 後台手動新增餐點到此單：</span>
                      <div className="flex gap-2">
                        <select id="modal-append-item-select" className="bg-[#1e1e1e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white flex-1 cursor-pointer outline-none">
                          {menuItems.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.name.zh || item.name} (NT$ {item.price})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const selectEl = document.getElementById('modal-append-item-select') as HTMLSelectElement;
                            if (selectEl && selectEl.value) {
                              handleAddLocalItem(selectEl.value);
                            }
                          }}
                          className="bg-[#E5B453] hover:bg-[#ebd594] text-black px-4 py-1.5 font-bold rounded-lg text-xs transition cursor-pointer active:scale-95"
                        >
                          確認加點
                        </button>
                      </div>
                    </div>

                    {/* Summary math calculation */}
                    <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs font-sans">
                      <div className="flex justify-between text-zinc-400">
                        <span>餐點客用金額小計 Subtotal</span>
                        <span className="font-mono text-white">NT$ {selectedOrder.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>刷卡等計10%客用服務費 Charge</span>
                        <span className="font-mono text-white">NT$ {selectedOrder.serviceCharge.toLocaleString()}</span>
                      </div>
                      {selectedOrder.isMember && (
                        <div className="flex justify-between text-emerald-400">
                          <span>⭐ Google Quick 會員累點優惠</span>
                          <span>0 元免點累存中</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-white/5 pt-3.5 text-sm font-extrabold text-white">
                        <span className="text-[#E5B453]">親享解算總金額 Total</span>
                        <span className="font-mono text-xl text-[#E5B453]">NT$ {selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout screen block */}
                  <div className="mt-4 pt-1 font-sans">
                    <div className="bg-gradient-to-br from-[#1a1a1a] via-[#121212] to-[#0a0a0a] border border-[#E5B453]/20 rounded-xl p-4.5 space-y-3.5">
                      <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                        <Coins className="text-[#E5B453]" size={16} />
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">櫃檯現收收款結帳 Counter Checkout</h4>
                        <span className="bg-amber-500/10 text-amber-400 font-extrabold px-1.5 py-0.5 rounded text-[8px] animate-pulse">
                          待結帳 Unpaid
                        </span>
                      </div>
                      
                      <div className="text-xs space-y-3">
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>應收總計 Final Total:</span>
                          <span className="font-mono font-black text-[#E5B453] text-[15px]">
                            NT$ {selectedOrder.total.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] text-zinc-400 block font-bold">自選結帳管道 Payment Method</span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {['cash', 'credit', 'member'].map((m) => (
                              <button
                                type="button"
                                key={m}
                                onClick={() => {
                                  setSelectedOrder({ ...selectedOrder, paymentMethod: m as any });
                                }}
                                className={`py-1.5 rounded-lg font-bold text-[10px] uppercase border transition cursor-pointer text-center ${
                                  selectedOrder.paymentMethod === m
                                    ? 'bg-[#E5B453]/20 border-[#E5B453] text-[#E5B453]'
                                    : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/10'
                                  }`}
                              >
                                {m === 'cash' ? '💵 現金' : m === 'credit' ? '💳 刷卡' : '⭐️ 會員儲值'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedOrder.paymentMethod === 'cash' && (
                          <div className="space-y-2 pt-1 font-sans border-t border-[#ffffff08]">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-zinc-400 block font-bold">顧客支付現鈔 Received Bill (NT$)</span>
                              <span className="text-[9px] text-zinc-500">(請點選下方快選或手動輸入)</span>
                            </div>
                            <div className="flex gap-1 justify-between">
                              {[selectedOrder.total, 500, 1000, 2000].map((amt) => (
                                <button
                                  type="button"
                                  key={amt}
                                  onClick={() => setCashReceivedInput(Math.max(selectedOrder.total, amt))}
                                  className="bg-white/5 hover:bg-white/10 border border-white/5 px-2 py-1 rounded text-[10px] text-white font-mono transition cursor-pointer flex-1 text-center"
                                >
                                  ${amt}
                                </button>
                              ))}
                            </div>
                            <input
                              type="number"
                              min={selectedOrder.total}
                              value={cashReceivedInput || ''}
                              onChange={(e) => setCashReceivedInput(parseInt(e.target.value, 10) || 0)}
                              className="w-full bg-[#1b1b1b] border border-white/10 rounded-lg p-2 text-white font-mono text-xs focus:border-[#E5B453]/40 outline-none leading-none"
                            />
                            {/* 💳 櫃檯現場付款結帳確認欄 (Single Order Cash Checkout Confirmation Panel) */}
                            <div className="bg-amber-500/5 border border-amber-500/30 p-2.5 rounded-xl space-y-2 mt-2 text-[10px] font-sans">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1 flex-wrap">
                                <span className="text-[#E5B453] font-black uppercase text-[10.5px]">📝 現場付訖核算確認 (Checkout Confirmation)</span>
                                <span className="bg-amber-500/10 text-amber-500 text-[8px] px-1 py-0.5 rounded font-black font-mono">
                                  現金收款
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-zinc-300">
                                <div className="space-y-0.5">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">應付金額 Final:</span>
                                    <span className="font-mono font-bold text-white">NT$ {selectedOrder.total}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">實收金額 Received:</span>
                                    <span className="font-mono font-bold text-amber-400">NT$ {cashReceivedInput}</span>
                                  </div>
                                </div>
                                <div className="space-y-0.5 border-l border-white/5 pl-2">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">找零金額 Change:</span>
                                    <span className="font-mono font-bold text-emerald-400">
                                      NT$ {Math.max(0, cashReceivedInput - selectedOrder.total)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">狀態 Status:</span>
                                    <span className="font-bold text-zinc-300">款項確認中</span>
                                  </div>
                                </div>
                              </div>
                              {cashReceivedInput < selectedOrder.total ? (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-1 px-2 rounded text-[9px] text-center font-bold">
                                  ⚠️ 實收金額不足！尚差 NT$ {selectedOrder.total - cashReceivedInput} 元
                                </div>
                              ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1 px-2 rounded text-[9px] text-center font-bold">
                                  ⚡ 現金經核算正確，可安全核可付款並上傳 Firestore 資料庫
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedOrder.paymentMethod === 'member' && (
                          <div className="bg-[#121824]/80 border border-blue-500/20 p-3 rounded-lg font-sans space-y-2.5 text-left">
                            <span className="text-[10px] text-blue-400 font-extrabold block uppercase tracking-wider">👤 會員餘額扣扣狀態 (Member Status)</span>
                            {(() => {
                              const dbStr = localStorage.getItem('google-members-database');
                              if (dbStr) {
                                try {
                                  const db = JSON.parse(dbStr);
                                  let vipEmail = 'topztar@gmail.com';
                                  if (selectedOrder.customerName) {
                                    const matched = db.find((m: any) => m.name === selectedOrder.customerName);
                                    if (matched) {
                                      vipEmail = matched.email;
                                    }
                                  }
                                  const member = db.find((m: any) => m.email === vipEmail);
                                  if (member) {
                                    const hasEnough = member.balance >= selectedOrder.total;
                                    return (
                                      <div className="space-y-2 text-xs">
                                        <div className="flex items-center space-x-2 bg-white/5 p-2 rounded border border-white/5">
                                          <img referrerPolicy="no-referrer" src={member.avatar || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=150'} className="w-6 h-6 rounded-full object-cover" alt="" />
                                          <div>
                                            <p className="text-[11px] font-bold text-white leading-none">{member.name}</p>
                                            <p className="text-[8px] text-zinc-500 font-mono leading-none mt-0.5">{member.email}</p>
                                          </div>
                                        </div>
                                        <div className="flex justify-between font-mono bg-zinc-950 p-1.5 rounded">
                                          <span className="text-zinc-500 text-[10px]">儲值餘額 Balance:</span>
                                          <span className="text-emerald-400 font-black">NT$ {member.balance || 0}</span>
                                        </div>
                                        {!hasEnough && (
                                          <p className="text-[9px] text-red-400">⚠️ 餘額不足，請先往收銀台為會員儲值再回到這裡或改為其他付費方式。</p>
                                        )}
                                      </div>
                                    );
                                  }
                                } catch (e) {
                                  console.error(e);
                                }
                              }
                              return <p className="text-[10px] text-zinc-500">查無對應 Google 會員</p>;
                            })()}
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleProcessCheckout}
                            className="w-full bg-[#E5B453] hover:bg-[#e4cd91] text-black font-extrabold py-2.5 rounded-xl transition font-sans text-xs active:scale-95 cursor-pointer text-center"
                          >
                            🛒 確定現場付款收款，並將結帳紀錄上傳 Cloud Firestore 資料庫
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Print simulator option */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3 text-xs">
                    <span className="text-[10px] font-black tracking-widest text-[#E5B453] uppercase block">店鋪出餐熱感存票模擬</span>
                    <p className="text-[10px] text-white/40">可將顧客結賬明細或廚房交代工作票重寄發送列印隊列備用明細單：</p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => alert(`🖨️ 模擬重行印列【防爆/防油熱感廚房交代票】成功！`)}
                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10.5px] border border-white/10 font-bold active:scale-95 transition cursor-pointer"
                      >
                        🧾 再印工作廚房票
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`🖨️ 模擬重行印列【顧客結賬發票與消點收據】成功！`)}
                        className="flex-1 py-1.5 bg-[#E5B453]/15 hover:bg-[#E5B453]/25 text-[#E5B453] rounded-lg text-[10.5px] border border-[#E5B453]/25 font-bold active:scale-95 transition cursor-pointer"
                      >
                        💵 再印顧客結算收據
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ----------------- PAID ORDER PANEL ----------------- */
                <div className="md:col-span-7 space-y-4 font-sans">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black tracking-widest text-[#E5B453] uppercase block">餐點規格與特配耗用 (已結帳)</span>
                      <h4 className="text-white text-xs mt-0.5">本單餐點品項與客製需求（變更項目需配合退貨稽核簽核）：</h4>
                    </div>
                    
                    <div className="divide-y divide-white/5 space-y-3">
                      {selectedOrder.items.map((it: any) => {
                        const spec = [
                          it.customization?.spiciness === 0 ? '不辣' : (it.customization?.spiciness === 1 ? '小辣' : (it.customization?.spiciness === 2 ? '中辣' : '泰辣')),
                          it.customization?.sweetness === 0 ? '無糖' : (it.customization?.sweetness === 1 ? '微糖' : (it.customization?.sweetness === 2 ? '正常甜' : '多糖')),
                          it.customization?.noodleType === 'rice-noodle' ? '河粉' : (it.customization?.noodleType === 'vermicelli' ? '米線' : ''),
                          it.customization?.soupBase === 'coconut-milk' ? '升級奶香冬蔭' : '',
                          it.customization?.notes ? `客備：${it.customization?.notes}` : ''
                        ].filter(Boolean).join(' / ');

                        return (
                          <div key={it.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs font-sans">
                            <div className="space-y-1 pr-4">
                              <p className="font-bold text-white text-[13px]">{it.name?.zh || it.name}</p>
                              {spec && <p className="text-[10px] text-amber-400 font-sans">{spec}</p>}
                              <p className="text-[10px] text-zinc-500 font-mono">定額單價: NT$ {it.price}</p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              {/* Quantity Editor Buttons with Return Workflow */}
                              <div className="flex items-center border border-white/10 rounded-lg bg-black/40 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => setPaidModDetails({ item: it, delta: -1, isAddingNew: false })}
                                  className="p-1 px-2 hover:bg-white/5 text-rose-450 hover:text-rose-450 text-rose-400 transition cursor-pointer"
                                  title="欲進行已結帳退貨，請點擊以發起核銷簽核"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="px-2 font-mono text-xs font-bold text-white select-none">{it.qty}</span>
                                <button
                                  type="button"
                                  onClick={() => setPaidModDetails({ item: it, delta: 1, isAddingNew: false })}
                                  className="p-1 px-2 hover:bg-white/5 text-emerald-450 hover:text-emerald-450 text-emerald-400 transition cursor-pointer"
                                  title="欲進行已結帳加點，請點擊以發起補收簽核"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>

                              <div className="text-right whitespace-nowrap min-w-[70px]">
                                <p className="font-mono text-white font-bold text-[13px]">NT$ {(it.price * it.qty).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Append item selection dropdown for paid orders */}
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <span className="text-[10px] text-amber-500 font-extrabold block mb-1">➕ 連動退貨或追加異動（點擊下方以追加商品）：</span>
                      <div className="flex gap-2">
                        <select id="paid-modal-append-item-select" className="bg-[#1c1c1c] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white flex-1 cursor-pointer outline-none">
                          {menuItems.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.name.zh || item.name} (NT$ {item.price})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const selectEl = document.getElementById('paid-modal-append-item-select') as HTMLSelectElement;
                            if (selectEl && selectEl.value) {
                              const dish = menuItems.find((m: any) => m.id === selectEl.value);
                              if (dish) {
                                setPaidModDetails({ menuItemId: dish.id, item: { name: dish.name, price: dish.price }, delta: 1, isAddingNew: true });
                              }
                            }
                          }}
                          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 font-bold rounded-lg text-xs transition cursor-pointer active:scale-95 shadow-sm shadow-amber-500/10 whitespace-nowrap"
                        >
                          確認追加餐點
                        </button>
                      </div>
                    </div>

                    {/* Summary math calculation */}
                    <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs font-sans">
                      <div className="flex justify-between text-zinc-400">
                        <span>餐點實收金額小計 Subtotal</span>
                        <span className="font-mono text-white">NT$ {selectedOrder.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>刷卡等計10%客用服務費 Charge</span>
                        <span className="font-mono text-white">NT$ {selectedOrder.serviceCharge.toLocaleString()}</span>
                      </div>
                      {selectedOrder.isMember && (
                        <div className="flex justify-between text-emerald-400">
                          <span>⭐ Google Quick 會員累點優惠</span>
                          <span>0 元免點累存中</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-white/5 pt-3.5 text-sm font-extrabold text-white">
                        <span className="text-[#E5B453]">已結帳核實總金額 Total</span>
                        <span className="font-mono text-xl text-[#E5B453]">NT$ {selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Ledger Audit Rail for modifications */}
                    {selectedOrder.refundLogs && selectedOrder.refundLogs.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-orange-500/20 bg-orange-500/5 p-3 rounded-lg space-y-2">
                        <span className="text-[10px] text-orange-400 font-extrabold block uppercase tracking-wider">📔 已簽核已結帳退貨與追加款稽核明細 ({selectedOrder.refundLogs.length} 筆)</span>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {selectedOrder.refundLogs.map((log: any) => (
                            <div key={log.id} className="text-[10.5px] border-b border-orange-500/10 pb-2 last:border-0 last:pb-0 font-sans">
                              <div className="flex justify-between font-bold text-white">
                                <span>{log.type === 'refund' ? '🏮 已核准退貨核銷' : '📈 已簽核追加補款'}</span>
                                <span className={log.totalDiff < 0 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                                  {log.totalDiff < 0 ? `退核 NT$ ${Math.abs(log.totalDiff)}` : `補收 NT$ ${log.totalDiff}`}
                                </span>
                              </div>
                              <p className="text-zinc-300 mt-0.5">標的物: {log.itemName} (增減量: {log.qtyChange > 0 ? `+${log.qtyChange}` : log.qtyChange})</p>
                              <div className="flex justify-between text-zinc-400 text-[9.5px] mt-1 italic font-mono">
                                <span>原因: {log.reason} {log.notes && `(${log.notes})`}</span>
                                <span>經辦: {log.authorizedByPin}</span>
                              </div>
                              <span className="block text-zinc-500 text-[8.5px] text-right mt-0.5">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Billing complete banner */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center space-y-1">
                    <p className="text-emerald-400 font-extrabold text-xs">💸 此訂單已完成結帳</p>
                    <p className="text-[9.5px] text-zinc-500 font-sans">
                      本筆資金已被安全收付，且對應流水交易紀錄已在 Firebase 成功建檔。如因餐點規格異動已自動登錄對沖帳目。
                    </p>
                  </div>

                  {/* Print simulator option */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3 text-xs">
                    <span className="text-[10px] font-black tracking-widest text-[#E5B453] uppercase block">店鋪出餐熱感存票模擬</span>
                    <p className="text-[10px] text-white/40">可將顧客結賬明細或廚房交代工作票重寄發送列印隊列備用明細單：</p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => alert(`🖨️ 模擬重行印列【防爆/防油熱感廚房交代票】成功！`)}
                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10.5px] border border-white/10 font-bold active:scale-95 transition cursor-pointer"
                      >
                        🧾 再印工作廚房票
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`🖨️ 模擬重行印列【顧客結賬發票與消點收據】成功！`)}
                        className="flex-1 py-1.5 bg-[#E5B453]/15 hover:bg-[#E5B453]/25 text-[#E5B453] rounded-lg text-[10.5px] border border-[#E5B453]/25 font-bold active:scale-95 transition cursor-pointer"
                      >
                        💵 再印顧客結算收據
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white/5 px-6 py-4.5 border-t border-white/10 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 hover:bg-white/5 border border-white/10 rounded-xl text-xs font-bold active:scale-95 transition cursor-pointer"
              >
                關閉視窗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAID ORDER MODIFICATION APPROVAL MODAL (退貨與追加安全簽核對話框) */}
      {paidModDetails && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[60] flex items-center justify-center p-4" id="paid-order-mod-modal">
          <div className="bg-[#18181b] border border-[#E5B453]/40 rounded-2xl w-full max-w-md p-6 space-y-5 text-left shadow-2xl">
            {/* Title block */}
            <div className="space-y-1">
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider block w-fit">
                🛡️ SECURE BILLING RECONCILIATION GATEWAY
              </span>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 pt-1">
                已結帳實收帳目 ➔ 安全退改換貨稽核簽核
              </h3>
              <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                本對單已完成付款。任何品項退計或追加加點將影響總流水帳。請在此登記核銷並輸入授權碼安全記帳。
              </p>
            </div>

            {/* Change Detail Card */}
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-[#E5B453] block uppercase tracking-wider font-extrabold font-mono">標的異動明細 (Target change)</span>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white text-sm">
                  {paidModDetails.isAddingNew ? '追加餐點: ' : ''}
                  {typeof paidModDetails.item?.name === 'object'
                    ? (paidModDetails.item.name.zh || paidModDetails.item.name.en || '')
                    : (paidModDetails.item?.name || '')}
                </span>
                <span className="font-mono bg-white/5 border border-white/15 px-2 py-0.5 rounded text-white font-bold text-[10px]">
                  單價 NT$ {paidModDetails.item?.price}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-white/5">
                <span className="text-zinc-400">異動內容：</span>
                <span className="font-bold text-[#E5B453]">
                  {paidModDetails.isAddingNew 
                    ? `全新追加 +1 份` 
                    : (paidModDetails.delta < 0 ? `減少單項餐點數量 -1 份 (退貨)` : `增加單項餐點數量 +1 份 (追加)`)}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-zinc-400">預估本筆變更差額：</span>
                <span className={`font-mono font-black text-sm ${paidModDetails.delta < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {paidModDetails.delta < 0 ? '-' : '+'}NT$ {paidModDetails.item?.price}
                </span>
              </div>
            </div>

            {/* Input Reason and notes */}
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 block font-bold">選擇已結帳退減變更之「防弊原因分類」：</label>
                <select
                  value={modReason}
                  onChange={(e) => setModReason(e.target.value)}
                  className="w-full bg-[#202020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E5B453]/60 cursor-pointer"
                >
                  <option value="kitchen_prep_error">🍳 廚房製餐瑕疵 / 出餐食安退餐</option>
                  <option value="wrong_delivery">🚶‍♂️ 員工送錯桌席 / 漏做重出變更</option>
                  <option value="customer_cancel">⏳ 餐期延誤過長 / 顧客臨時取消</option>
                  <option value="input_error">收銀點錯帳目更正 / 單據錯誤補救</option>
                  <option value="sold_out">🚫 食材中途告罄 / 沽清被迫退餐</option>
                  <option value="vip_promo">🎁 現場 VIP 招待 / 自主促銷補償</option>
                  <option value="customer_addon">➕ 顧客追加點餐 / 現正加碼單量</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block font-bold">稽核備註/詳情文字描述 (Optional)：</label>
                <input
                  type="text"
                  placeholder="請輸入詳情（例如：客席反應烤玉米過焦、漏給醬汁、顧客要求追加等）"
                  value={modNotes}
                  onChange={(e) => setModNotes(e.target.value)}
                  className="w-full bg-[#202020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E5B453]/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#E5B453] block font-black flex items-center justify-between">
                  <span>🔒 輸入經理人/員工安全簽核 PIN 碼：</span>
                </label>
                <input
                  type="password"
                  maxLength={10}
                  placeholder="請輸入員工授權 PIN 密碼"
                  value={modPin}
                  onChange={(e) => setModPin(e.target.value)}
                  className="w-full bg-black/60 border border-yellow-500/30 rounded-lg px-4 py-2 text-center text-sm tracking-widest text-[#E5B453] font-mono focus:outline-none focus:border-[#E5B453] focus:ring-1 focus:ring-[#E5B453]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPaidModDetails(null);
                  setModReason('input_error');
                  setModNotes('');
                  setModPin('');
                }}
                className="flex-1 py-2 border border-white/10 rounded-xl hover:bg-white/5 text-zinc-300 font-bold transition text-xs cursor-pointer text-center"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSavePaidModification}
                className="flex-1 py-2 bg-[#E5B453] hover:bg-[#e4cd91] text-black font-extrabold rounded-xl transition text-xs cursor-pointer text-center shadow-lg shadow-[#E5B453]/10"
              >
                📝 核准並對沖登錄流水賬
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISH CREATION/EDITING MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-xs font-sans" onClick={() => setIsFormOpen(false)}>
          <form onSubmit={handleSaveItemSubmit} className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-5 pb-3 border-b border-white/5 flex-shrink-0">
              <h3 className="font-bold text-sm text-amber-400">
                {editingItem ? `✏️ 編輯餐點品項 Spec: ${editingItem.id}` : '➕ 新增菜單美食單品 Add Dish'}
              </h3>
            </div>
            
            {/* Modal Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {itemImage && (
                <div className="w-full h-32 rounded-xl overflow-hidden relative border border-white/10 [content-visibility:auto]">
                  <img src={itemImage} alt="dish mockup preview" className="w-full h-full object-cover bg-neutral-950" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                    <span className="text-[10px] text-zinc-300 font-bold font-sans">🖼️ 菜品圖片預覽 Dish Photo Preview</span>
                  </div>
                </div>
              )}
              <div className="space-y-3.5 text-left text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">正體中文標題 Name Zh</label>
                  <input type="text" required value={itemNameZh} onChange={(e) => setItemNameZh(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">英文對應 Name En</label>
                  <input type="text" value={itemNameEn} onChange={(e) => setItemNameEn(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">食材分類標記 category</label>
                  <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white leading-tight">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name.zh}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">售價 Price (NT$)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" required value={itemPrice} onChange={(e) => setItemPrice(Math.max(1, parseInt(e.target.value.replace(/\D/g, ''), 10) || 1))} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400">餐品圖片鏈接(外置 CDN) url</label>
                <input type="url" value={itemImage} onChange={(e) => setItemImage(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400">正體中文描述 Description Zh</label>
                <textarea rows={2} value={itemDescZh} onChange={(e) => setItemDescZh(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400">英文寫法 Desc En</label>
                <textarea rows={2} value={itemDescEn} onChange={(e) => setItemDescEn(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white" />
              </div>
               <div className="flex items-center space-x-2 text-left pt-1">
                <input type="checkbox" id="checkbox-has-noodles" checked={hasNoodles} onChange={(e) => setHasNoodles(e.target.checked)} className="w-3.5 h-3.5 outline-none rounded bg-[#1e1e1e] border-white/10 text-amber-500 focus:ring-0 active:scale-95 transition" />
                <label htmlFor="checkbox-has-noodles" className="text-zinc-300 font-bold cursor-pointer select-none">此餐品開啟自選細麵 / 米線 / 河粉選項</label>
              </div>
              <div className="flex items-center space-x-2 text-left pt-1">
                <input type="checkbox" id="checkbox-is-not-spicy" checked={isNotSpicy} onChange={(e) => setIsNotSpicy(e.target.checked)} className="w-3.5 h-3.5 outline-none rounded bg-[#1e1e1e] border-white/10 text-amber-500 focus:ring-0 active:scale-95 transition" />
                <label htmlFor="checkbox-is-not-spicy" className="text-zinc-300 font-bold cursor-pointer select-none">此餐品為【完全不辣】(不勾選則為預設香辣/可調辣度)</label>
              </div>

              {/* 自訂加選項目配置 panel (User customizable options) */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <label className="text-amber-400 font-bold block text-[11px] tracking-wider uppercase">可自訂單品附加選項 Custom Extra Add-Ons</label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {customAddOns.length === 0 ? (
                    <p className="text-[10px] text-zinc-500 italic">目前無自訂附加選項 (可使用下方控制列添加專屬加料或客製配件如: 加蛋, 加肉)</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-1.5">
                      {customAddOns.map((opt, idx) => (
                        <div key={opt.id || idx} className="flex items-center justify-between bg-white/5 px-2.5 py-2 rounded-lg border border-white/10 text-[11px]">
                          <span className="font-bold text-white/90">{opt.name}</span>
                          <div className="flex items-center space-x-2.5">
                            <span className="font-mono text-[#E5B453] font-bold">+NT$ {opt.price}</span>
                            <button
                              type="button"
                              onClick={() => setCustomAddOns(customAddOns.filter((_, i) => i !== idx))}
                              className="text-rose-400 hover:text-rose-300 font-bold active:scale-90 transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-rose-500/10"
                            >
                              移除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 快速導入全域規則庫 */}
                {globalRules.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 block">💡 快速點選匯入全域客製選項規則 (Quick Import Global Rules)：</span>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto bg-[#0C0C0C] p-1.5 rounded-lg border border-white/5">
                      {globalRules.map(gr => {
                        const isAdded = customAddOns.some(o => o.name === gr.name);
                        return (
                          <button
                            key={`quick-${gr.id}`}
                            type="button"
                            disabled={isAdded}
                            onClick={() => {
                              const newOption = {
                                id: `addon-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                                name: gr.name,
                                price: gr.price
                              };
                              setCustomAddOns([...customAddOns, newOption]);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] transition font-semibold flex items-center space-x-1 border ${
                              isAdded
                                ? 'bg-zinc-800/40 border-zinc-700/20 text-zinc-600 cursor-not-allowed'
                                : 'bg-[#E5B453]/10 hover:bg-[#E5B453]/20 border-[#E5B453]/30 text-[#E5B453] cursor-pointer'
                            }`}
                          >
                            <span>{gr.name} (+${gr.price})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 增加選項輸入列 */}
                <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-xl border border-white/5 mt-1.5">
                  <input
                    type="text"
                    id="new-opt-name"
                    placeholder="例如: 加蛋 Add Egg, 加倍肉"
                    className="flex-1 bg-[#222222] border border-white/10 rounded px-2.5 py-1 text-white text-[11px]"
                  />
                  <input
                    type="number"
                    id="new-opt-price"
                    placeholder="金額"
                    className="w-16 bg-[#222222] border border-white/10 rounded px-2 py-1 text-white font-mono text-[11px]"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nameInput = document.getElementById('new-opt-name') as HTMLInputElement;
                      const priceInput = document.getElementById('new-opt-price') as HTMLInputElement;
                      if (!nameInput || !priceInput) return;
                      const name = nameInput.value.trim();
                      const price = parseInt(priceInput.value, 10) || 0;
                      if (!name) {
                        alert('請輸入選項名稱！');
                        return;
                      }
                      const newOption = {
                        id: `addon-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        name,
                        price
                      };
                      setCustomAddOns([...customAddOns, newOption]);
                      nameInput.value = '';
                      priceInput.value = '';
                    }}
                    className="px-3 py-1 bg-[#E5B453] hover:bg-amber-400 text-slate-900 font-extrabold rounded text-[11px] active:scale-95 transition cursor-pointer shadow"
                  >
                    ➕ 新增
                  </button>
                </div>
              </div>
            </div>
            </div>
            {/* Modal Fixed Footer */}
            <div className="flex justify-end space-x-2 p-5 border-t border-white/5 bg-zinc-900/40 flex-shrink-0">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 hover:bg-white/5 border border-white/10 rounded-lg font-bold transition active:scale-95 cursor-pointer text-white">取消</button>
              <button type="submit" className="px-5 py-2 bg-[#E5B453] hover:bg-amber-400 text-slate-900 font-extrabold rounded-lg active:scale-95 transition cursor-pointer shadow-md">儲存餐點</button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORY ADDITION/EDITING MODAL FORM */}
      {isCatFormOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-xs font-sans" onClick={() => setIsCatFormOpen(false)}>
          <form onSubmit={handleSaveCatSubmit} className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-5 pb-3 border-b border-white/5 flex-shrink-0">
              <h3 className="font-bold text-sm text-amber-400">
                {editingCategory ? `✏️ 編輯分類：${editingCategory.id}` : '➕ 新增菜單分類標籤 Create Category'}
              </h3>
            </div>
            
            {/* Modal Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {catError && <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-bold">{catError}</div>}
              <div className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-zinc-400">分類標記 ID 碼 (英文小寫，如 tomyum，儲存後不得修改)</label>
                <input type="text" required disabled={!!editingCategory} value={catId} onChange={(e) => setCatId(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono disabled:opacity-40" />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400">中文正體類別名稱 Name Zh</label>
                <input type="text" required value={catNameZh} onChange={(e) => setCatNameZh(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white" />
              </div>
              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="cat-show-on-customer"
                  checked={catShowOnCustomer}
                  onChange={(e) => setCatShowOnCustomer(e.target.checked)}
                  className="rounded border-zinc-700 bg-[#1e1e1e] text-[#E5B453] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="cat-show-on-customer" className="text-zinc-350 cursor-pointer font-bold select-none">
                  顯示於顧客線上點餐頁面 (Show on Customer Page)
                </label>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400">英文對應 Name En</label>
                <input type="text" value={catNameEn} onChange={(e) => setCatNameEn(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white" />
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-[11px]">
                <div className="space-y-1">
                  <label className="text-zinc-500">泰文 Name Th</label>
                  <input type="text" value={catNameTh} onChange={(e) => setCatNameTh(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2 py-1 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-500">日文 Name Ja</label>
                  <input type="text" value={catNameJa} onChange={(e) => setCatNameJa(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2 py-1 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-500">韓文 Name Ko</label>
                  <input type="text" value={catNameKo} onChange={(e) => setCatNameKo(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2 py-1 text-white" />
                </div>
              </div>
            </div>
            </div>
            {/* Modal Fixed Footer */}
            <div className="flex justify-end space-x-2 p-5 border-t border-white/5 bg-zinc-900/40 flex-shrink-0 text-xs">
              <button type="button" onClick={() => setIsCatFormOpen(false)} className="px-4 py-1.5 hover:bg-white/5 border border-white/10 rounded font-bold transition active:scale-95 cursor-pointer text-white">取消</button>
              <button type="submit" className="px-4 py-1.5 bg-[#E5B453] hover:bg-amber-400 text-slate-900 font-extrabold rounded transition active:scale-95 cursor-pointer shadow-sm">儲存分類</button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE SETTING MODAL FORM */}
      {isTableFormOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-xs font-sans" onClick={() => setIsTableFormOpen(false)}>
          <form onSubmit={handleTableSaveSubmit} className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-5 pb-3 border-b border-white/5 flex-shrink-0">
              <h3 className="font-bold text-sm text-amber-400">
                {editingTableObj ? `✏️ 編輯客座：第 ${editingTableObj.id} 桌` : '➕ 新增客座與條碼定位 Create Table'}
              </h3>
            </div>
            
            {/* Modal Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {tableError && <div className="p-2.5 bg-rose-500/10 text-rose-400 font-bold rounded">{tableError}</div>}
              {tableSuccess && <div className="p-2.5 bg-emerald-500/10 text-emerald-400 font-bold rounded">{tableSuccess}</div>}
              <div className="space-y-3.5 text-left">
              <div className="space-y-1">
                <span className="text-zinc-500 block">桌鍵號碼 Table ID (限阿拉伯數字，保存後不改)</span>
                <input type="text" inputMode="numeric" pattern="[0-9]*" required disabled={!!editingTableObj} value={tableIdInput} onChange={(e) => setTableIdInput(e.target.value.replace(/\D/g, ''))} className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono font-bold" />
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 block">客用條碼定位 URL QR (點餐自動扣桌號用連結)</span>
                <input type="url" value={tableQrUrlInput} onChange={(e) => setTableQrUrlInput(e.target.value)} placeholder="如 https://sabaybbq.com/?table=6" className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono placeholder-white/20" />
                <div className="pt-1.5 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      const finalId = tableIdInput.trim() || '6';
                      setTableQrUrlInput(`https://sabay--easy-web-order.asia-east1.hosted.app/?table=${finalId}`);
                    }}
                    className="text-[9.5px] text-[#E5B453] hover:text-amber-300 font-bold bg-[#E5B453]/10 border border-[#E5B453]/35 px-2.5 py-1 rounded-lg transition whitespace-nowrap inline-flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    ✨ 免手打：自動帶入 Firebase 託管點餐連結
                  </button>
                </div>
              </div>
            </div>
            </div>
            {/* Modal Fixed Footer */}
            <div className="flex justify-end space-x-2 p-5 border-t border-white/5 bg-zinc-900/40 flex-shrink-0 text-xs">
              <button type="button" onClick={() => setIsTableFormOpen(false)} className="px-4 py-1.5 hover:bg-white/5 border border-white/10 rounded transition cursor-pointer text-white">取消</button>
              <button type="submit" className="px-4 py-1.5 bg-[#E5B453] hover:bg-amber-400 text-slate-900 font-extrabold rounded transition cursor-pointer shadow-md">儲存桌次</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
