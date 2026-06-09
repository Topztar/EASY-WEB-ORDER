/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Language, MenuItem, Ingredient, Order, OrderStatus, OrderItem, Category, TableConfig, OperatingHourSlot } from './types';

import { TRANSLATIONS } from './data';
import { LanguageSelector } from './components/LanguageSelector';
import { GoogleLoginMock } from './components/GoogleLoginMock';
import { CustomerOrderView } from './components/CustomerOrderView';
import { KitchenDisplaySystem } from './components/KitchenDisplaySystem';
import { ManagerDashboard } from './components/ManagerDashboard';
import { StaffLoginGate } from './components/StaffLoginGate';
import { ChefHat, Smartphone, BarChart3, HelpCircle, UtensilsCrossed, Sparkles, LogOut, Lock, Phone, MapPin, Eye, EyeOff, Coins } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  ordersCount: number;
  categorySales: { category: string; revenue: number }[];
  hourlyDistribution: { timeSlot: string; orders: number }[];
  topDishes: { name: string; qty: number }[];
  stockWarnings: Ingredient[];
}

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [activeTab, setActiveTab] = useState<'customer' | 'kitchen' | 'admin' | 'cashier'>('customer');
  const [lineProfile, setLineProfile] = useState<any>(null);

  // Secure staff role gating
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [isVerifyingStaff, setIsVerifyingStaff] = useState<boolean>(false);

  // Path routing states
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Core synchronized application state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<TableConfig[]>([]);
  const [minSpend, setMinSpend] = useState<number>(200);
  const [operatingHours, setOperatingHours] = useState<OperatingHourSlot[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [restDays, setRestDays] = useState<string[]>([]);
  const [customerNotice, setCustomerNotice] = useState<string>('');

  const [printLogs, setPrintLogs] = useState<any[]>([]);
  const [printerIp, setPrinterIp] = useState<string>('10.0.0.124');
  const [pushNotifications, setPushNotifications] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    ordersCount: 0,
    categorySales: [],
    hourlyDistribution: [],
    topDishes: [],
    stockWarnings: [],
  });

  const [localOrderIds, setLocalOrderIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sabay-my-submitted-order-ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [showContactDetails, setShowContactDetails] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const fallbackAnalytics = {
        totalRevenue: 0,
        ordersCount: 0,
        categorySales: [],
        hourlyDistribution: [],
        topDishes: [],
        stockWarnings: [],
      };

      // Ensure fetch doesn't throw a "Failed to fetch" global exception when server is reloading
      const safeFetch = async (url: string, fallbackVal: any) => {
        try {
          const res = await fetch(url);
          return res;
        } catch (err) {
          console.warn(`[Sabay Sync] Failed network fetch for ${url}:`, err);
          return {
            ok: false,
            status: 503,
            headers: new Headers(),
            json: async () => fallbackVal,
            text: async () => '',
            clone: function() { return this; }
          } as unknown as Response;
        }
      };

      // Parallel REST calls with localized connection protection
      const [menuRes, ingRes, ordRes, printRes, notifRes, alyRes, catRes, tablesRes, printerRes, minSpendRes, opHoursRes, noticeRes] = await Promise.all([
        safeFetch('/api/menu', []),
        safeFetch('/api/ingredients', []),
        safeFetch('/api/orders', []),
        safeFetch('/api/print-logs', []),
        safeFetch('/api/push-notifications', []),
        safeFetch('/api/analytics', fallbackAnalytics),
        safeFetch('/api/categories', []),
        safeFetch('/api/tables', []),
        safeFetch('/api/printer/config', {}),
        safeFetch('/api/settings/min-spend', { minSpend: 200 }),
        safeFetch('/api/settings/operating-hours', {}),
        safeFetch('/api/settings/customer-notice', {}),
      ]);

      const safeJson = async (res: Response, fallback: any, label: string) => {
        try {
          if (!res.ok) {
            console.warn(`[Sabay Sync] ${label} returned status ${res.status}`);
            return fallback;
          }
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const bodyPeek = await res.clone().text().catch(() => '');
            console.warn(`[Sabay Sync] ${label} returned non-JSON content (temporary startup or offline). Content-Type: ${contentType}. Body preview:`, bodyPeek.substring(0, 200));
            return fallback;
          }
          return await res.json();
        } catch (e) {
          console.warn(`[Sabay Sync] Failed to parse JSON for ${label}:`, e);
          return fallback;
        }
      };

      const [menuData, ingData, ordData, printData, notifData, alyData, catData, tablesData, printerData, minSpendData, opHoursData, noticeData] = await Promise.all([
        safeJson(menuRes, [], 'menu'),
        safeJson(ingRes, [], 'ingredients'),
        safeJson(ordRes, [], 'orders'),
        safeJson(printRes, [], 'print-logs'),
        safeJson(notifRes, [], 'push-notifications'),
        safeJson(alyRes, fallbackAnalytics, 'analytics'),
        safeJson(catRes, [], 'categories'),
        safeJson(tablesRes, [], 'tables'),
        safeJson(printerRes, {}, 'printer-config'),
        safeJson(minSpendRes, { minSpend: 200 }, 'min-spend'),
        safeJson(opHoursRes, {}, 'operating-hours'),
        safeJson(noticeRes, {}, 'customer-notice'),
      ]);

      setMenuItems(menuData);
      setIngredients(ingData);
      setOrders(ordData);
      setPrintLogs(printData);
      setPrinterIp(printerData.ip || '10.0.0.124');
      if (minSpendData && minSpendData.minSpend !== undefined) {
        setMinSpend(minSpendData.minSpend);
      }
      if (opHoursData) {
        if (opHoursData.slots) {
          setOperatingHours(opHoursData.slots);
        }
        if (opHoursData.restDays) {
          setRestDays(opHoursData.restDays);
        }
        setIsOpen(opHoursData.isOpen ?? true);
      }
      if (noticeData && noticeData.notice !== undefined) {
        setCustomerNotice(noticeData.notice);
      }
      if (Array.isArray(notifData)) {
        setPushNotifications(notifData.filter((n: any) => !n.isRead)); // show only unread notifications
      }
      if (alyData) {
        setAnalytics(alyData);
      }
      setCategories(catData);
      setTables(tablesData);

    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes('Failed to fetch') || errMsg.includes('Load failed')) {
        console.warn('[Sabay Sync] Network connection temporarily offline:', errMsg);
      } else {
        console.warn('[Sabay Sync] Fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Installs high frequency polling logs every 4 seconds to simulate real-time socket connections for kitchens and tables
    const timer = setInterval(() => {
      fetchData();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Actions

  // 1. Submit Online Order
  const handlePlaceOrder = async (orderData: {
    tableNumber: string;
    items: OrderItem[];
    paymentMethod: 'cash' | 'credit' | 'member' | 'linepay';
    guestCount?: number;
  }) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          customerName: lineProfile ? lineProfile.displayName : undefined,
          customerAvatar: lineProfile ? lineProfile.pictureUrl : undefined,
          isMember: !!lineProfile,
        }),
      });

      if (!res.ok) {
        const errorDetail = await res.json();
        console.error('[Sabay Ordering Error]', errorDetail.error);
        return null;
      }

      const completedOrder = await res.json();
      if (completedOrder && completedOrder.id) {
        setLocalOrderIds((prev) => {
          const updated = [...prev, completedOrder.id];
          localStorage.setItem('sabay-my-submitted-order-ids', JSON.stringify(updated));
          return updated;
        });
      }
      // Re-trigger global sync
      await fetchData();
      return completedOrder;
    } catch (err) {
      console.error('[Sabay Ordering failed]', err);
      return null;
    }
  };

  // 2. Kitchen Status Updater
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (err) {
      console.error('[Sabay Chef-KDS Update error]', err);
    }
  };

  // 2.3 Order Table Number / Takeout Modifier (Admin/Cashier View Override)
  const handleUpdateTableNumber = async (orderId: string, tableNumber: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/table-number`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber }),
      });
      if (res.ok) {
        await fetchData();
        return { success: true };
      }
      return { success: false, error: '後台修改桌席/外帶失敗' };
    } catch (err: any) {
      console.error('[Sabay Update table error]', err);
      return { success: false, error: err.message || '網路連線錯誤' };
    }
  };

  // 2.5 Order Cashier Register Checkout handler
  const handlePayOrder = async (
    orderId: string,
    checkoutData?: {
      paymentMethod?: string;
      subtotal?: number;
      serviceCharge?: number;
      total?: number;
      discount?: number;
      isPaid?: boolean;
    }
  ) => {
    try {
      await fetch(`/api/orders/${orderId}/checkout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData || { isPaid: true }),
      });
      await fetchData();
    } catch (err) {
      console.error('[Sabay Cashier Checkout Error]', err);
    }
  };

  // 3. Manager Raw materials Restock
  const handleRestock = async (id: string, amount: number) => {
    try {
      await fetch('/api/ingredients/restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, amount }),
      });
      await fetchData();
    } catch (err) {
      console.error('[Sabay Stocking update error]', err);
    }
  };

  // 4. Send Promotional Push Notification Coupon
  const handleSendPromoPush = async (notif: { title: string; message: string; badge: string }) => {
    try {
      await fetch('/api/send-promo-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif),
      });
      await fetchData();
    } catch (err) {
      console.error('[Sabay Push delivery failed]', err);
    }
  };

  // 5. Hide / Show out-of-stock items
  const handleToggleMenuItemAvailability = async (id: string) => {
    try {
      await fetch('/api/menu/toggle-available', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await fetchData();
    } catch (err) {
      console.error('[Sabay Menu lock toggle error]', err);
    }
  };

  // 6. Virtual Printing Tray Cleared
  const handleClearPrintLogs = async () => {
    try {
      await fetch('/api/print-logs/clear', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('[Sabay Printer Clear error]', err);
    }
  };

  // 7. Add Menu Item (Dishes)
  const handleAddMenuItem = async (itemData: any) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('[Sabay Menu Add error]', err);
    }
  };

  // 8. Edit Menu Item (Dishes)
  const handleEditMenuItem = async (id: string, itemData: any) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('[Sabay Menu Edit error]', err);
    }
  };

  // Category Mutation Handlers
  const handleAddCategory = async (id: string, name: any) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      if (res.ok) {
        await fetchData();
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || '無法新增類別' };
      }
    } catch (err: any) {
      console.error('[Sabay Category Add error]', err);
      return { success: false, error: err.message || '連線錯誤' };
    }
  };

  const handleEditCategory = async (id: string, name: any) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await fetchData();
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || '無法編輯類別' };
      }
    } catch (err: any) {
      console.error('[Sabay Category Edit error]', err);
      return { success: false, error: err.message || '連線錯誤' };
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchData();
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || '無法刪除類別' };
      }
    } catch (err: any) {
      console.error('[Sabay Category Delete error]', err);
      return { success: false, error: err.message || '連線錯誤' };
    }
  };

  // Table Mutation Handlers
  const handleAddTable = async (id: string, qrCodeUrl?: string) => {
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, qrCodeUrl }),
      });
      if (res.ok) {
        await fetchData();
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || '無法新增桌號' };
      }
    } catch (err: any) {
      console.error('[Add Table error]', err);
      return { success: false, error: err.message || '連線錯誤' };
    }
  };

  const handleEditTable = async (id: string, qrCodeUrl: string) => {
    try {
      const res = await fetch(`/api/tables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeUrl }),
      });
      if (res.ok) {
        await fetchData();
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || '無法編輯桌號 QR CODE' };
      }
    } catch (err: any) {
      console.error('[Edit Table error]', err);
      return { success: false, error: err.message || '連線錯誤' };
    }
  };

  const handleDeleteTable = async (id: string) => {
    try {
      const res = await fetch(`/api/tables/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchData();
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || '無法刪除桌號' };
      }
    } catch (err: any) {
      console.error('[Delete Table error]', err);
      return { success: false, error: err.message || '連線錯誤' };
    }
  };

  const handleUpdateMinSpend = async (newVal: number) => {
    try {
      const res = await fetch('/api/settings/min-spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minSpend: newVal }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.minSpend !== undefined) {
          setMinSpend(data.minSpend);
          return { success: true };
        }
      }
      return { success: false, error: '無法更新低消設定' };
    } catch (e: any) {
      console.error('[Update Min Spend Error]', e);
      return { success: false, error: e.message || '連線錯誤' };
    }
  };

  const handleUpdateOperatingHours = async (slots: OperatingHourSlot[], restDays?: string[]) => {
    try {
      const res = await fetch('/api/settings/operating-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots, restDays }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.slots) {
          setOperatingHours(data.slots);
          if (data.restDays) {
            setRestDays(data.restDays);
          }
          setIsOpen(data.isOpen ?? true);
          return { success: true };
        }
      }
      return { success: false, error: '無法更新營業時間設定' };
    } catch (e: any) {
      console.error('[Update Operating Hours Error]', e);
      return { success: false, error: e.message || '連線錯誤' };
    }
  };

  const handleUpdateCustomerNotice = async (notice: string) => {
    try {
      const res = await fetch('/api/settings/customer-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notice }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.notice !== undefined) {
          setCustomerNotice(data.notice);
          return { success: true };
        }
      }
      return { success: false, error: '無法更新顧客注意事項' };
    } catch (e: any) {
      console.error('[Update Customer Notice Error]', e);
      return { success: false, error: e.message || '連線錯誤' };
    }
  };

  const handleUpdatePrinterIp = async (ip: string) => {
    try {
      const res = await fetch('/api/printer/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      });
      if (res.ok) {
        const d = await res.json();
        setPrinterIp(d.ip);
        return { success: true };
      } else {
        const d = await res.json();
        return { success: false, error: d.error || '無法更新印表機 IP' };
      }
    } catch (err: any) {
      console.error('[Update printer IP error]', err);
      return { success: false, error: err.message || '連線錯誤' };
    }
  };

  const handlePrintTestPage = async () => {
    try {
      const res = await fetch('/api/printer/test', {
        method: 'POST',
      });
      if (res.ok) {
        await fetchData();
        return { success: true };
      } else {
        const d = await res.json();
        return { success: false, error: d.error || '列印測試頁失敗' };
      }
    } catch (err: any) {
      console.error('[Print test page error]', err);
      return { success: false, error: err.message || '連線錯誤' };
    }
  };

  // Clear a single push notifying coupon on click
  const handleMarkNotificationRead = (notifId: string) => {
    setPushNotifications(pushNotifications.filter((n) => n.id !== notifId));
  };

  // Group active orders that belong to this customer
  // Since we simulate per-table sessions without real persistent cookies, we group by tableNumber or lineProfile name
  const filteredActiveOrdersForClient = orders.filter((o) => {
    if (lineProfile) {
      return o.customerName === lineProfile.displayName;
    }
    // When not logged in, we only display the orders placed directly on this device
    return localOrderIds.includes(o.id);
  });

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col font-sans">
      {/* 1. COMPREHENSIVE NAVBAR */}
      <nav className="bg-[#161616] border-b border-white/10 text-white shrink-0 sticky top-0 z-40 transition-colors shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo area */}
            <div className="flex items-center space-x-2 sm:space-x-3 text-left min-w-0 flex-1 sm:flex-none">
              <div className="bg-[#E5B453] text-[#0F0F0F] p-1.5 sm:p-2 rounded-xl flex items-center justify-center shadow-md shadow-[#E5B453]/15 shrink-0">
                <UtensilsCrossed size={15} className="rotate-45 sm:size-[18px]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-[10px] min-[360px]:text-[11px] min-[395px]:text-xs sm:text-sm md:text-base font-bold sm:tracking-widest font-serif flex items-center text-[#E5B453]">
                  <span className="block whitespace-normal break-words leading-tight max-w-[120px] min-[360px]:max-w-[150px] min-[395px]:max-w-[180px] sm:max-w-none">
                    {currentPath === '/staff-login' 
                      ? '沙貝泰式燒烤 經營管理中心' 
                      : (lang === 'zh' 
                          ? (lineProfile ? '沙貝燒烤' : '沙貝燒烤 泰式烤肉') 
                          : (lineProfile ? 'Sabay BBQ' : TRANSLATIONS.sabayBBQ[lang]))}
                  </span>
                </h1>
                <span className="text-[10px] text-white/50 hidden sm:block font-sans tracking-wide truncate">
                  {currentPath === '/staff-login' 
                    ? '🛡️ 員工專屬隔離安全驗證終端 (Autonomous Admin Terminal)' 
                    : '桃園市大園區高鐵北路二段198號1樓 · 電話: 0966626408'}
                </span>
              </div>
            </div>

            {/* Viewport switch tabs */}
            <div className="hidden lg:flex items-center space-x-2">
              {currentPath === '/staff-login' ? (
                isStaff ? (
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 space-x-1" id="desktop-tab-selector">
                    <button
                      id="tab-btn-cashier-main"
                      onClick={() => setActiveTab('cashier')}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        activeTab === 'cashier'
                          ? 'bg-[#E5B453] text-[#0F0F0F] shadow-md shadow-[#E5B453]/15'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Coins size={14} />
                      <span>🛎️ 櫃檯收銀台</span>
                    </button>

                    <button
                      id="tab-btn-kitchen"
                      onClick={() => setActiveTab('kitchen')}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        activeTab === 'kitchen'
                          ? 'bg-[#E5B453] text-[#0F0F0F] shadow-md shadow-[#E5B453]/15'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <ChefHat size={14} />
                      <span>🍳 廚房監控 (KDS)</span>
                    </button>

                    <button
                      id="tab-btn-admin"
                      onClick={() => setActiveTab('admin')}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        activeTab === 'admin'
                          ? 'bg-[#E5B453] text-[#0F0F0F] shadow-md shadow-[#E5B453]/15'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <BarChart3 size={14} />
                      <span>📊 經營分析與上架</span>
                    </button>

                    <button
                      id="tab-btn-customer-from-staff"
                      onClick={() => navigateTo('/')}
                      className="flex items-center space-x-1.5 px-4 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition text-xs font-black"
                    >
                      <Smartphone size={14} />
                      <span>📱 返回顧客點餐</span>
                    </button>

                    <button
                      id="tab-btn-logout-staff"
                      onClick={() => {
                        setIsStaff(false);
                        navigateTo('/');
                      }}
                      className="flex items-center space-x-1 px-3.5 py-2 text-rose-400 hover:text-rose-300 font-bold text-xs hover:bg-white/5 rounded-xl cursor-pointer transition ml-1"
                    >
                      <LogOut size={13} />
                      <span>員工登出</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-[#E5B453]/80 bg-[#E5B453]/5 border border-[#E5B453]/10 px-3.5 py-1.5 rounded-xl font-bold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SECURE AUTH PORTAL MODE</span>
                  </div>
                )
              ) : null}
            </div>

            {/* Loyalty LINE login & Multilingual flags selectors */}
            <div className="flex items-center space-x-3">
              {currentPath !== '/staff-login' && (
                <GoogleLoginMock
                  currentLang={lang}
                  currentProfile={lineProfile}
                  onLoginSuccess={(profile) => {
                    setLineProfile(profile);
                  }}
                />
              )}
              <LanguageSelector currentLang={lang} onLanguageChange={(l) => setLang(l)} />
            </div>
          </div>
        </div>
      </nav>

      {/* Interactive Collapsible Contact Banner (Middle Area between First Column/Navbar and Second Column/Workspace) */}
      {currentPath !== '/staff-login' && (
        <div className="bg-[#121212] border-b border-white/5 py-1.5 px-4" id="contact-info-reveal-bar">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex items-center space-x-2 text-white/35 text-[11px] font-sans font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B453]/80 animate-pulse" />
              <span>沙貝餐飲聯盟店鋪資訊 Branch & Contact</span>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3 flex-1">
              <div className="min-h-6 flex items-center">
                {showContactDetails ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-white/90 text-xs font-medium">
                    <span className="flex items-center space-x-1">
                      <Phone size={12} className="text-[#E5B453]" />
                      <span className="font-mono text-[11px] text-white/85">0966-626408</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin size={12} className="text-[#E5B453]" />
                      <span className="font-sans text-[11px] text-white/85">桃園市大園區高鐵北路二段198號1樓</span>
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-white/20 italic font-mono tracking-widest bg-black/10 px-2 py-0.5 rounded">
                    •••• 聯絡細節與物理地址已安全隱蔽 ••••
                  </span>
                )}
              </div>

              <button
                type="button"
                id="toggle-contact-reveal-btn"
                onClick={() => setShowContactDetails(!showContactDetails)}
                className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-black uppercase text-[#E5B453] hover:text-[#f3cd78] hover:bg-white/5 bg-white/2 rounded-lg border border-[#E5B453]/25 transition cursor-pointer active:scale-95 shrink-0"
              >
                {showContactDetails ? (
                  <>
                    <EyeOff size={10.5} />
                    <span>隱藏隱私 Hide Info</span>
                  </>
                ) : (
                  <>
                    <Eye size={10.5} />
                    <span>點擊解鎖 Reveal Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Tab selectors, only shown to logged-in staff on staff login path */}
      {currentPath === '/staff-login' && isStaff && (
        <div className="lg:hidden bg-[#121212] border-b border-white/10 p-2 flex justify-around sticky top-18 z-30 shadow-md" id="mobile-tab-selector">
          <button
            id="m-tab-btn-cashier"
            onClick={() => setActiveTab('cashier')}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
              activeTab === 'cashier' ? 'text-[#E5B453]' : 'text-white/40'
            }`}
          >
            <Coins size={15} />
            <span>櫃檯收銀</span>
          </button>

          <button
            id="m-tab-btn-kitchen"
            onClick={() => setActiveTab('kitchen')}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
              activeTab === 'kitchen' ? 'text-[#E5B453]' : 'text-white/40'
            }`}
          >
            <ChefHat size={15} />
            <span>廚房 KDS</span>
          </button>

          <button
            id="m-tab-btn-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
              activeTab === 'admin' ? 'text-[#E5B453]' : 'text-white/40'
            }`}
          >
            <BarChart3 size={15} />
            <span>數據庫存</span>
          </button>

          <button
            onClick={() => navigateTo('/')}
            className="flex-1 py-1.5 text-center text-[10px] text-white/65 font-bold flex flex-col items-center gap-1 cursor-pointer"
          >
            <Smartphone size={15} />
            <span>顧客前台</span>
          </button>

          <button
            onClick={() => {
              setIsStaff(false);
              navigateTo('/');
            }}
            className="flex-1 py-1.5 text-center text-[10px] text-rose-400 font-bold flex flex-col items-center gap-1 cursor-pointer"
          >
            <LogOut size={15} />
            <span>登出員工</span>
          </button>
        </div>
      )}

      {/* 2. CORE WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-[#E5B453] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/50 font-bold text-sm">沙貝燒烤 雲端主機連線中...</p>
          </div>
        ) : currentPath === '/staff-login' ? (
          !isStaff ? (
            <div className="py-8">
              <div className="max-w-md mx-auto text-center space-y-2 mb-6">
                <span className="text-xs font-bold text-amber-500 bg-[#E5B453]/10 px-3.5 py-1.5 rounded-full border border-[#E5B453]/20 uppercase tracking-widest leading-none my-1 flex items-center justify-center gap-1.5 w-fit mx-auto">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse animate-duration-1000" />
                  🔒 ADMINISTRATIVE CONTROL PORTAL
                </span>
                <h2 className="text-2xl font-serif font-black text-white tracking-wide mt-2">沙貝管理後台獨立驗證門戶</h2>
                <p className="text-xs text-white/50 max-w-xs mx-auto">
                  本頁面為管理階層專屬之獨立防護選單。已與顧客共用選單安全防禦硬化，防止任何未授權之側錄、入侵或探測。
                </p>
              </div>
              <StaffLoginGate
                onLoginSuccess={() => {
                  setIsStaff(true);
                  setActiveTab('admin');
                }}
                onCancel={() => {
                  navigateTo('/');
                }}
              />
            </div>
          ) : (
            <div>
              {activeTab === 'kitchen' ? (
                <KitchenDisplaySystem
                  currentLang={lang}
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  printLogs={printLogs}
                  onClearPrintLogs={handleClearPrintLogs}
                  printerIp={printerIp}
                  onUpdatePrinterIp={handleUpdatePrinterIp}
                  onPrintTestPage={handlePrintTestPage}
                  onUpdateTableNumber={handleUpdateTableNumber}
                />
              ) : (
                <ManagerDashboard
                  currentLang={lang}
                  analytics={analytics}
                  ingredients={ingredients}
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onRestock={handleRestock}
                  promotions={[]}
                  onToggleMenuItemAvailability={handleToggleMenuItemAvailability}
                  onSendPromoPush={handleSendPromoPush}
                  menuItems={menuItems}
                  onAddMenuItem={handleAddMenuItem}
                  onEditMenuItem={handleEditMenuItem}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                  tables={tables}
                  onAddTable={handleAddTable}
                  onEditTable={handleEditTable}
                  onDeleteTable={handleDeleteTable}
                  onPayOrder={handlePayOrder}
                  onUpdateTableNumber={handleUpdateTableNumber}
                  defaultSubTab={activeTab === 'cashier' ? 'cashier' : undefined}
                  minSpend={minSpend}
                  onUpdateMinSpend={handleUpdateMinSpend}
                  operatingHours={operatingHours}
                  restDays={restDays}
                  onUpdateOperatingHours={handleUpdateOperatingHours}
                  customerNotice={customerNotice}
                  onUpdateCustomerNotice={handleUpdateCustomerNotice}
                />
              )}
            </div>
          )
        ) : (
          <div>
            <CustomerOrderView
              currentLang={lang}
              menuItems={menuItems}
              categories={categories}
              tables={tables}
              lineProfile={lineProfile}
              onPlaceOrder={handlePlaceOrder}
              activeOrders={filteredActiveOrdersForClient}
              pushNotifications={pushNotifications}
              onMarkNotificationRead={handleMarkNotificationRead}
              inventoryWarnings={analytics.stockWarnings}
              minSpend={minSpend}
              isOpen={isOpen}
              customerNotice={customerNotice}
              operatingHours={operatingHours}
              restDays={restDays}
            />
          </div>
        )}
      </main>

      {/* 3. Humble footer matching design constraints */}
      <footer className="bg-[#0A0A0A] border-t border-white/10 text-white/40 py-6 text-center text-xs space-y-1.5 mt-auto shrink-0">
        <p className="italic font-mono font-light tracking-widest text-[10px] sm:text-xs text-[#E5B453]/90 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent py-2 select-none uppercase flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-4 mx-auto w-full">
          <span>Designed by</span>
          <span className="font-extrabold text-white/95 tracking-widest drop-shadow-[0_0_8px_rgba(229,180,83,0.3)]">FlyShine A.S.R. System Technology.</span>
        </p>
         {currentPath === '/staff-login' && (
           <div className="flex items-center justify-center space-x-4 pt-1">
             <button
               type="button"
               id="footer-customer-portal-link"
               onClick={() => navigateTo('/')}
               className="text-[#E5B453]/30 hover:text-[#E5B453] text-[9px] font-mono tracking-widest uppercase cursor-pointer transition py-0.5 px-1 rounded flex items-center space-x-1"
             >
               <Smartphone size={11} />
               <span>Customer View</span>
             </button>
           </div>
         )}
        <div className="text-[9px] text-[#E5B453]/20 italic font-mono uppercase tracking-widest pt-1">
          A.S.R. Cloud Engine v4.2 // Secured Connection Terminal
        </div>
      </footer>
    </div>
  );
}
