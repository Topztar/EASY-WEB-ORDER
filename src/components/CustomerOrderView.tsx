import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, OrderItem, FoodCustomization, Order, Language, Category, TableConfig, CustomAddOn } from '../types';
import { TRANSLATIONS } from '../data';
import { ShoppingCart, Clock, Check, AlertTriangle, ChevronRight, HelpCircle, X, Sparkles, BellRing, QrCode, Coins, Plus, Minus } from 'lucide-react';

interface CustomerOrderViewProps {
  currentLang: Language;
  menuItems: MenuItem[];
  categories: Category[];
  tables: TableConfig[];
  onPlaceOrder: (orderData: {
    tableNumber: string;
    items: OrderItem[];
    paymentMethod: 'cash' | 'credit' | 'member' | 'linepay';
    guestCount?: number;
  }) => Promise<Order | null>;
  lineProfile: any;
  activeOrders: Order[];
  pushNotifications: any[];
  onMarkNotificationRead: (id: string) => void;
  inventoryWarnings: any[];
  minSpend?: number;
  isOpen?: boolean;
  customerNotice?: string;
  operatingHours?: any[];
  restDays?: string[];
}

export const CustomerOrderView: React.FC<CustomerOrderViewProps> = ({
  currentLang,
  menuItems,
  categories,
  tables,
  onPlaceOrder,
  lineProfile,
  activeOrders,
  pushNotifications,
  onMarkNotificationRead,
  inventoryWarnings,
  minSpend = 200,
  isOpen = true,
  customerNotice = '',
  operatingHours = [],
  restDays = [],
}) => {
  const isTaiwanRestDay = useMemo(() => {
    const dObj = new Date();
    const utcTime = dObj.getTime() + (dObj.getTimezoneOffset() * 60000);
    const localDate = new Date(utcTime + (3600000 * 8));
    const yr = localDate.getFullYear();
    const mo = String(localDate.getMonth() + 1).padStart(2, '0');
    const dy = String(localDate.getDate()).padStart(2, '0');
    const taiwanDateStr = `${yr}-${mo}-${dy}`;
    return restDays.includes(taiwanDateStr);
  }, [restDays]);

  const [selectedTable, setSelectedTable] = useState('5');
  const [selectedCategory, setSelectedCategory] = useState('tomyum');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [qrScannedInfo, setQrScannedInfo] = useState<string | null>(null);
  const [urlProcessed, setUrlProcessed] = useState(false);
  const [isTableFixed, setIsTableFixed] = useState(false);
  const [loginCount, setLoginCount] = useState<number>(0);
  const [activeSegmentTab, setActiveSegmentTab] = useState<'bestsellers' | 'history'>('bestsellers');

  // Scan detection on URL load
  useEffect(() => {
    if (urlProcessed) return;

    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setUrlProcessed(true);
      setIsTableFixed(true);
      if (tableParam === 'takeout' || tableParam === 'take-out' || tableParam.toLowerCase() === 'takeout') {
        const triggerTakeoutScan = async () => {
          try {
            const res = await fetch('/api/takeout/scan', { method: 'POST' });
            if (res.ok) {
              const data = await res.json();
              setSelectedTable(data.tableNumber);
              setQrScannedInfo(`[QR Code 掃描外帶點餐成功] 系統已自動幫您遞增預配外帶號碼：【${data.tableNumber}】`);
            }
          } catch (err) {
            console.warn('Takeout scan API error:', err);
            setSelectedTable('外帶 #1');
          }
        };
        triggerTakeoutScan();
      } else {
        setSelectedTable(tableParam);
        setQrScannedInfo(`[QR Code 掃描桌號 ${tableParam} 點餐成功] 您目前正於 ${tableParam} 桌內用就座中。`);
      }
    } else {
      // Default table fallback from table schema
      if (tables && tables.length > 0) {
        setUrlProcessed(true);
        if (!tables.some(t => t.id === selectedTable) && !selectedTable.includes('外帶')) {
          setSelectedTable(tables[0].id);
        }
      }
    }
  }, [tables, urlProcessed, selectedTable]);

  // Handle mock scan trigger manually in UI
  const handleSimulateScan = async (tableId: string) => {
    setIsTableFixed(true);
    if (tableId === 'takeout') {
      try {
        const res = await fetch('/api/takeout/scan', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setSelectedTable(data.tableNumber);
          setQrScannedInfo(`[模擬 QR Code 掃描外帶點餐成功] 系統已自動遞增並配發外帶號碼：【${data.tableNumber}】`);
        }
      } catch (err) {
        console.warn('Takeout scan simulation API error:', err);
        setSelectedTable('外帶 #1');
      }
    } else {
      setSelectedTable(tableId);
      setQrScannedInfo(`[模擬 QR Code 掃描 ${tableId} 桌成功] 桌號欄已同步切換為內用桌號！`);
    }
    // Scroll to panel top to let users see the table header
    const topPanel = document.getElementById('customer-order-panel');
    if (topPanel) {
      topPanel.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Customization selection state
  const [isSimplifiedMode, setIsSimplifiedMode] = useState<boolean>(false);
  const [sweetness, setSweetness] = useState<number>(2); // regular
  const [spiciness, setSpiciness] = useState<number>(1); // mild/小辣
  const [noodleType, setNoodleType] = useState<'rice-noodle' | 'vermicelli' | 'none'>('rice-noodle');
  const [soupBase, setSoupBase] = useState<'plain' | 'coconut-milk'>('plain');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<CustomAddOn[]>([]);
  const [qty, setQty] = useState<number>(1);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'member' | 'linepay'>('cash');
  const [orderSentSuccess, setOrderSentSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Google Member Points and Balance state and redemption helpers
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null);

  const REWARD_ITEMS = useMemo(() => {
    // Basic definition of rewards with their menuItemId and fallback configs
    const defaultRewards = [
      {
        id: 'rew-01',
        menuItemId: 'sk-02',
        fallbackName: {
          zh: '爆汁金針菇豬肉 / 串',
          en: 'Enoki Mushroom & Pork Wrap',
          ko: '팽이버섯 삼겹살 꼬치',
          ja: '金針菇えのき豚肉巻き',
          th: 'หมูสามชั้นพันเห็ดเข็มทองย่างสะเด็ด'
        },
        fallbackPrice: 90,
      },
      {
        id: 'rew-02',
        menuItemId: 'vg-01',
        fallbackName: {
          zh: '脆脆高麗菜 / 份',
          en: 'Crispy Cabbage',
          ko: '아삭 양배추 구い',
          ja: 'あつあつキャベツ焼き',
          th: 'กะหล่ำปลีย่างน้ำปลาหอม'
        },
        fallbackPrice: 80,
      },
      {
        id: 'rew-03',
        menuItemId: 'dr-01',
        fallbackName: {
          zh: '泰式奶茶 1L 桶裝 (限定)',
          en: 'Signature Street Thai Milk Tea 1L (Bucket)',
          ko: '길거리 타이 밀크티 1L 점보 通 (限定)',
          ja: '極旨本場タイミルクティー1Lバケツ入り (テイクアウト・店内人気)',
          th: 'ชาเย็นไทยสตรีท 1 ลิตรถังยักษ์'
        },
        fallbackPrice: 180,
      },
      {
        id: 'rew-04',
        menuItemId: 'sw-01',
        fallbackName: {
          zh: '南洋香蘭手作奶酪 / 份',
          en: 'South Seas Pandan Handmade Pudding',
          ko: '남양 판단 허브 수제 푸딩',
          ja: '本格手摘みパンダンリーフ自家製ココナッツプリン',
          th: 'พุดดิ้งพานาคอตต้าใบเตยนมสด'
        },
        fallbackPrice: 90,
      },
      {
        id: 'rew-05',
        menuItemId: 'ty-01',
        fallbackName: {
          zh: '曼谷冬蔭功海鮮湯',
          en: 'Bangkok Tom Yum Seafood Soup',
          ko: '방콕 똠얌꿍 해물탕',
          ja: 'バンコトトムヤムクン海鮮スープ',
          th: 'ต้มยำกุ้งทะเลบางกอก'
        },
        fallbackPrice: 260,
      }
    ];

    return defaultRewards.map(reward => {
      const match = menuItems.find(m => m.id === reward.menuItemId);
      const originalPrice = match ? match.price : reward.fallbackPrice;
      const name = match ? match.name : reward.fallbackName;
      return {
        id: reward.id,
        menuItemId: reward.menuItemId,
        name: name,
        originalPrice: originalPrice,
        cost: originalPrice * 10
      };
    });
  }, [menuItems]);

  useEffect(() => {
    const updatePoints = () => {
      if (lineProfile && lineProfile.email) {
        const dbStr = localStorage.getItem('google-members-database');
        let points = 1500;
        let balance = 2000;
        if (dbStr) {
          try {
            const db = JSON.parse(dbStr);
            const userIndex = db.findIndex((m: any) => m.email === lineProfile.email);
            if (userIndex >= 0) {
              const member = db[userIndex];
              points = member.points;
              if (member.balance === undefined) {
                member.balance = 2000;
                localStorage.setItem('google-members-database', JSON.stringify(db));
              }
              balance = member.balance;
            } else {
              const defaultMembers = [...db];
              defaultMembers.push({
                email: lineProfile.email,
                name: lineProfile.displayName,
                avatar: lineProfile.pictureUrl,
                points: 1500,
                balance: 2000,
                joinedAt: new Date().toISOString().split('T')[0]
              });
              localStorage.setItem('google-members-database', JSON.stringify(defaultMembers));
              points = 1500;
              balance = 2000;
            }
          } catch (e) {
            console.error('[Points Sync Error]', e);
          }
        } else {
          const defaultMembers = [
            {
              email: 'topztar@gmail.com',
              name: '沙貝忠實饕客',
              avatar: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=150',
              points: 1500,
              balance: 1500,
              joinedAt: '2026-05-15'
            },
            {
              email: 'thai_foodie@gmail.com',
              name: '曼谷香辣姬',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
              points: 2840,
              balance: 3200,
              joinedAt: '2026-05-20'
            },
            {
              email: 'vegan_sabay@gmail.com',
              name: '小農蔬食愛好客',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
              points: 650,
              balance: 450,
              joinedAt: '2026-05-28'
            }
          ];
          if (lineProfile && lineProfile.email && !defaultMembers.some(m => m.email === lineProfile.email)) {
            defaultMembers.push({
              email: lineProfile.email,
              name: lineProfile.displayName,
              avatar: lineProfile.pictureUrl,
              points: 1500,
              balance: 2000,
              joinedAt: new Date().toISOString().split('T')[0]
            });
          }
          localStorage.setItem('google-members-database', JSON.stringify(defaultMembers));
          points = 1500;
          balance = 2000;
        }
        setUserPoints(points);
        setUserBalance(balance);
        localStorage.setItem(`google-points-${lineProfile.email}`, String(points));
        localStorage.setItem(`google-balance-${lineProfile.email}`, String(balance));
      } else {
        setUserPoints(0);
        setUserBalance(0);
      }
    };

    updatePoints();
    window.addEventListener('storage', updatePoints);
    window.addEventListener('local-points-updated', updatePoints);
    return () => {
      window.removeEventListener('storage', updatePoints);
      window.removeEventListener('local-points-updated', updatePoints);
    };
  }, [lineProfile]);

  // Synchronically track logged-in count for multiple visits detection
  useEffect(() => {
    if (lineProfile && lineProfile.email) {
      const email = lineProfile.email;
      const key = `login-count-${email}`;
      const stored = localStorage.getItem(key);
      let count = stored ? parseInt(stored, 10) : 0;
      
      const sessionKey = `login-session-recorded-${email}`;
      const isSessionRecorded = sessionStorage.getItem(sessionKey);
      
      if (!isSessionRecorded) {
        count += 1;
        // Seed default multi-login state for the default mock user so it's instantly active
        if (email === 'topztar@gmail.com' && count < 2) {
          count = 3;
        }
        localStorage.setItem(key, String(count));
        sessionStorage.setItem(sessionKey, 'true');
      } else {
        if (email === 'topztar@gmail.com' && count < 2) {
          count = 3;
          localStorage.setItem(key, String(count));
        }
      }
      setLoginCount(count);
      
      if (count >= 2) {
        setActiveSegmentTab('history');
      } else {
        setActiveSegmentTab('bestsellers');
      }
    } else {
      setLoginCount(0);
      setActiveSegmentTab('bestsellers');
    }
  }, [lineProfile]);

  const getSimulatedPastOrders = () => {
    return [
      {
        id: 'SB-9882',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        tableNumber: '12',
        status: 'completed' as const,
        paymentMethod: 'linepay' as const,
        total: 570,
        items: [
          {
            menuItemId: 'nd-01',
            name: { zh: '豪華版海鮮乾拌MAMA麵', en: 'Signature Seafood MAMA Noodles', ko: '호화 해산물 비빔 마마 라면', ja: '豪華シーフード和えMAMA麺', th: 'มาม่าแห้งทะเลรวมมิตรภูเขาไฟ' },
            price: 390,
            qty: 1
          },
          {
            menuItemId: 'dr-01',
            name: { zh: '泰式奶茶 1L 桶裝 (限定)', en: 'Signature Street Thai Milk Tea 1L (Bucket)', ko: '길거리 타이 밀크티 1L 점보 통 (한정)', ja: '極旨本場タイミルクティー1Lバケツ入り (テイクアウト・店内人気)', th: 'ชาเย็นไทยสตรีท 1 ลิตรถังยักษ์' },
            price: 180,
            qty: 1
          }
        ]
      },
      {
        id: 'SB-9541',
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        tableNumber: '5',
        status: 'completed' as const,
        paymentMethod: 'credit' as const,
        total: 450,
        items: [
          {
            menuItemId: 'sk-01',
            name: { zh: '泰式手工牛肉串 / 串', en: 'Handmade Thai Beef Skewer', ko: '수제 태국식 소고기 꼬치', ja: '特製スパイス牛肉串焼き', th: 'เนื้อเสียบไม้ย่างสูตรลับชาววัง Sabay' },
            price: 90,
            qty: 3
          },
          {
            menuItemId: 'sw-01',
            name: { zh: '泰小農芒果甜糯米飯', en: 'Sweet Mango Sticky Rice', ko: '망고 스티키 라이스', ja: 'マンゴースティッキーライス', th: 'ข้าวเหนียวมะม่วง' },
            price: 180,
            qty: 1
          }
        ]
      }
    ];
  };

  const handleReorderOrder = (orderItems: any[]) => {
    const newItemsToAdd = orderItems.map((oldItem: any) => {
      const cartId = `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const menuItem = menuItems.find((m) => m.id === oldItem.menuItemId);
      return {
        id: cartId,
        menuItemId: oldItem.menuItemId,
        name: menuItem ? menuItem.name : oldItem.name,
        price: menuItem ? menuItem.price : oldItem.price,
        qty: oldItem.qty,
        customization: {
          sweetness: 2,
          spiciness: 1,
          notes: '由歷史訂單一鍵加點 (Quick reordered from past orders)',
        }
      };
    });
    setCart((prev) => [...prev, ...newItemsToAdd]);
    setIsCartOpen(true);
  };

  const handleRedeemReward = (reward: any) => {
    if (!lineProfile) {
      alert('抱歉，此功能僅限登入會員使用，請先登入帳號。');
      return;
    }
    
    const userEmail = lineProfile.email || 'bbq_lover@gmail.com';
    
    // Fetch latest points directly from local storage to avoid state delay or stale closure
    let freshPoints = 0;
    const dbStr = localStorage.getItem('google-members-database');
    if (dbStr) {
      try {
        const db = JSON.parse(dbStr);
        const userIndex = db.findIndex((m: any) => m.email === userEmail);
        if (userIndex >= 0) {
          freshPoints = Number(db[userIndex].points || 0);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (freshPoints === 0 && userPoints > 0) {
      freshPoints = Number(userPoints);
    }

    if (freshPoints < Number(reward.cost)) {
      alert(`您的會員累積點數不足！(目前點數為 ${freshPoints} 點，兌換此餐點需要 ${reward.cost} 點)`);
      return;
    }

    const newPoints = freshPoints - Number(reward.cost);
    if (dbStr) {
      try {
        const db = JSON.parse(dbStr);
        const userIndex = db.findIndex((m: any) => m.email === userEmail);
        if (userIndex >= 0) {
          db[userIndex].points = newPoints;
          localStorage.setItem('google-members-database', JSON.stringify(db));
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    localStorage.setItem(`google-points-${userEmail}`, String(newPoints));
    setUserPoints(newPoints);
    window.dispatchEvent(new Event('local-points-updated'));

    const cartId = `reward-${Date.now()}-${Math.floor(Math.random() * 100)}`;
    const redeemedOrderItem: OrderItem = {
      id: cartId,
      menuItemId: reward.menuItemId,
      name: {
        zh: `🎁 點數兌換：${reward.name?.zh || '免費餐點'}`,
        en: `🎁 Points Redeemed: ${reward.name?.en || 'Complimentary Item'}`,
        ko: `🎁 포인트 교환: ${reward.name?.ko || reward.name?.en || '컴플리멘터리'}`,
        ja: `🎁 ポイント引き換え: ${reward.name?.ja || reward.name?.zh || '無料メニュー'}`,
        th: `🎁 แลกคะแนน: ${reward.name?.th || reward.name?.en || 'เมนูฟรี'}`
      },
      price: 0,
      qty: 1,
      customization: {
        sweetness: 2,
        spiciness: 0,
        noodleType: undefined,
        soupBase: undefined,
        notes: '🎁 點數免費兌換禮遇 (Loyalty Reward)',
        selectedAddOns: []
      }
    };

    setCart(prev => {
      const updated = [...prev, redeemedOrderItem];
      console.log('Appended redeemed item to cart:', updated);
      return updated;
    });
    
    setIsCartOpen(true);
    alert(`🎉 兌換成功！已扣除 ${reward.cost} 點，並將『${reward.name?.zh || '商品'}』作為點數賀禮存入購物車！`);
    
    setRedeemMessage(`🎉 兌換成功！已扣除 ${reward.cost} 點，並將『${reward.name?.zh || '商品'}』作為點數賀禮存入購物車！`);
    setTimeout(() => {
      setRedeemMessage(null);
    }, 6000);
  };

  const visibleCategories = useMemo(() => {
    return categories.filter(c => c.showOnCustomerPage !== false);
  }, [categories]);

  useEffect(() => {
    if (visibleCategories.length > 0 && !visibleCategories.some(c => c.id === selectedCategory)) {
      setSelectedCategory(visibleCategories[0].id);
    }
  }, [visibleCategories, selectedCategory]);

  const filteredItems = menuItems.filter((item) => item.category === selectedCategory);

  const handleOpenDetail = (item: MenuItem) => {
    if (!item.available) return;
    setSelectedDetailItem(item);
    setQty(1);
    setSweetness(item.category === 'drinks' || item.category === 'sweets' ? 2 : 2); // Default to less sugar / regular
    setSpiciness(item.category === 'tomyum' || item.category === 'noodles' || item.category === 'skewers' ? 1 : 0); // Default to small spicy/none
    setNoodleType('rice-noodle');
    setSoupBase('plain');
    setCustomNotes('');
    setSelectedAddOns([]);
  };

  const handleAddToCart = () => {
    if (!isOpen) return;
    if (!selectedDetailItem) return;

    // Calculate item markup if any
    let markup = selectedDetailItem.price;
    if (spiciness === 3) {
      markup += 10; // Extra spicy + 10
    }
    if (soupBase === 'coconut-milk') {
      markup += 50; // Coconut milk soup base + 50
    }

    const cartId = `cart-${Date.now()}-${Math.floor(Math.random() * 100)}`;
    const newOrderItem: OrderItem = {
      id: cartId,
      menuItemId: selectedDetailItem.id,
      name: selectedDetailItem.name,
      price: selectedDetailItem.price, // standard
      qty,
      customization: {
        sweetness,
        spiciness,
        noodleType: selectedDetailItem.hasNoodlesOption ? noodleType : undefined,
        soupBase: selectedDetailItem.hasCoconutsMilkOption ? soupBase : undefined,
        notes: customNotes,
        selectedAddOns: [...selectedAddOns],
      },
    };

    setCart([...cart, newOrderItem]);
    setSelectedDetailItem(null);
    setOrderError(null);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const handleUpdateCartQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter((i) => i.id !== id));
    } else {
      setCart(cart.map((i) => (i.id === id ? { ...i, qty: newQty } : i)));
    }
  };

  const handleQuickAddToCart = (item: MenuItem) => {
    if (!isOpen) return;
    const isSpicyCategory = !item.isNotSpicy;
    const isSweetCategory = item.category === 'drinks' || item.category === 'sweets';
    
    const newOrderItem: OrderItem = {
      id: `cart-quick-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
      customization: {
        sweetness: isSweetCategory ? 2 : 2,
        spiciness: isSpicyCategory ? 1 : 0,
        noodleType: item.hasNoodlesOption ? 'rice-noodle' : undefined,
        soupBase: item.hasCoconutsMilkOption ? 'plain' : undefined,
        notes: '🏆 今日熱銷人氣精選 ✨',
      },
    };
    setCart([...cart, newOrderItem]);
    setOrderError(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    let finalPrice = item.price;
    if (item.customization.spiciness === 3) finalPrice += 10;
    if (item.customization.soupBase === 'coconut-milk') finalPrice += 50;
    const addOnPrice = item.customization.selectedAddOns?.reduce((s, a) => s + a.price, 0) || 0;
    return sum + (finalPrice + addOnPrice) * item.qty;
  }, 0);

  // Google member points program (no subtotal discount)
  const discountedSubtotal = cartSubtotal;
  // credit card or mobile payment adds 10% service charge
  const expressFee = (paymentMethod === 'credit' || paymentMethod === 'linepay') ? Math.round(discountedSubtotal * 0.1) : 0;
  const cartTotal = discountedSubtotal + expressFee;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setOrderError(null);
    setOrderSentSuccess(null);

    const hasTopupItem = cart.some(it => it.id.startsWith('topup-') || (it.menuItemId && it.menuItemId.startsWith('item-topup-')));
    if (hasTopupItem && paymentMethod === 'member') {
      setOrderError('您的購物車中含有「會員線上儲值」加值商品，請選擇「現金」、「信用卡」或「LINE Pay」付款！您無法使用儲值餘額支付來購買儲值金商品。');
      return;
    }

    if (paymentMethod === 'member') {
      if (!lineProfile || !lineProfile.email) {
        setOrderError('請先點選上方 [選擇登入帳號] 綁定 Google 會員以使用儲值餘額支付！');
        return;
      }
      if (userBalance < cartTotal) {
        setOrderError(`您的會員儲值餘額不足！(當前儲值餘額: NT$ ${userBalance}，本日應付: NT$ ${cartTotal})。請先至下方進行會員儲值，或變更為現金/信用卡付費。`);
        return;
      }
    }

    const actual = await onPlaceOrder({
      tableNumber: selectedTable,
      items: cart,
      paymentMethod,
      guestCount: !selectedTable.includes('外帶') ? guestCount : undefined,
    });

    if (actual) {
      setOrderSentSuccess(actual.id);

      // Deduct Google Member Balance for normal orders
      if (paymentMethod === 'member' && lineProfile && lineProfile.email) {
        const dbStr = localStorage.getItem('google-members-database');
        if (dbStr) {
          try {
            const db = JSON.parse(dbStr);
            const userIndex = db.findIndex((m: any) => m.email === lineProfile.email);
            if (userIndex >= 0) {
              db[userIndex].balance = Math.max(0, db[userIndex].balance - cartTotal);
              localStorage.setItem('google-members-database', JSON.stringify(db));
              localStorage.setItem(`google-balance-${lineProfile.email}`, String(db[userIndex].balance));
              setUserBalance(db[userIndex].balance);
            }
          } catch (e) {
            console.error('[Deduct Balance Error]', e);
          }
        }
      }

      // Add purchased top-up values to membership balance
      const totalTopupAmt = cart
        .filter(it => it.id.startsWith('topup-') || (it.menuItemId && it.menuItemId.startsWith('item-topup-')))
        .reduce((sum, it) => sum + (it.price * it.qty), 0);

      if (totalTopupAmt > 0 && lineProfile && lineProfile.email) {
        const dbStr = localStorage.getItem('google-members-database');
        if (dbStr) {
          try {
            const db = JSON.parse(dbStr);
            const userIndex = db.findIndex((m: any) => m.email === lineProfile.email);
            if (userIndex >= 0) {
              db[userIndex].balance = (db[userIndex].balance || 0) + totalTopupAmt;
              localStorage.setItem('google-members-database', JSON.stringify(db));
              localStorage.setItem(`google-balance-${lineProfile.email}`, String(db[userIndex].balance));
              setUserBalance(db[userIndex].balance);
              window.dispatchEvent(new Event('local-points-updated'));
            }
          } catch (e) {
            console.error('[Credit Topup Balance Error]', e);
          }
        }
      }

      // Credit Google Member Points (每20元消費 = 1 point earned from food consumption subtotal value)
      if (lineProfile && lineProfile.email) {
        const dbStr = localStorage.getItem('google-members-database');
        if (dbStr) {
          try {
            const db = JSON.parse(dbStr);
            const userIndex = db.findIndex((m: any) => m.email === lineProfile.email);
            if (userIndex >= 0) {
              const pointsEarned = Math.floor(discountedSubtotal / 20);
              db[userIndex].points += pointsEarned;
              localStorage.setItem('google-members-database', JSON.stringify(db));
              localStorage.setItem(`google-points-${lineProfile.email}`, String(db[userIndex].points));
              window.dispatchEvent(new Event('local-points-updated'));
            }
          } catch (e) {
            console.error('[Add Points Error]', e);
          }
        }
      }

      setCart([]);
      setIsCartOpen(false);
      // Automatically clear confirmation after 8 seconds
      setTimeout(() => {
        setOrderSentSuccess(null);
      }, 9000);
    } else {
      setOrderError('下單失敗：部分配料庫存不足，未能完成點餐！或是材料已用罄。');
    }
  };

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    preparing: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    completed: 'bg-emerald-500/10 text-[#00C300] border-[#00C300]/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const statusLabels = {
    pending: { zh: '主廚排單中', en: 'Queueing', ko: '대기 중', ja: '注文審査中', th: 'รอต่อคิวอาหาร' },
    preparing: { zh: '備餐烹調中', en: 'Cooking', ko: '조리 중', ja: '全力調理中', th: 'กำลังปรุงอาหาร' },
    completed: { zh: '已送餐完成', en: 'Served', ko: '서빙 완료', ja: '配膳完了', th: 'เสิร์ฟอาหารสำเร็จ' },
    cancelled: { zh: '已取消退款', en: 'Cancelled', ko: '주문 취소됨', ja: 'キャンセル済', th: 'ยกเลิกออเดอร์' },
  };

  return (
    <div className={`space-y-6 transition-all duration-300 ${isSimplifiedMode ? 'bg-[#FFFFFF] text-[#000000] p-4 sm:p-6 min-h-screen border-4 border-black' : 'text-white'}`} id="customer-order-panel">
      {/* 📣 Customer Scrolling Notice */}
      {customerNotice && (
        <div className="w-full bg-thai-gold/10 border border-thai-gold/20 rounded-full overflow-hidden py-1.5 px-4 shadow-sm flex items-center space-x-2 text-thai-gold text-xs font-sans">
          <span className="shrink-0 font-extrabold bg-[#E5B453] text-[#0F0F0F] rounded-full px-2.5 py-0.5 text-[10px] tracking-wide flex items-center gap-1">
            📢 公告 Notice
          </span>
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap py-0.5 hover:[animation-play-state:paused] flex gap-8">
              <span className="font-extrabold pr-4">{customerNotice}</span>
              <span className="font-extrabold pr-4">{customerNotice}</span>
              <span className="font-extrabold pr-4">{customerNotice}</span>
            </div>
          </div>
        </div>
      )}

      {/* 🛑 Store Closed Warning Board */}
      {!isOpen && (
        <div className="bg-rose-950/20 border border-rose-500/30 text-rose-300 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center gap-3.5 shadow-lg select-none font-sans">
          <div className="w-12 h-12 bg-rose-500/15 border border-rose-500/25 rounded-2xl flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle size={24} className="animate-bounce" />
          </div>
          <div className="text-left flex-1 space-y-1">
            <h5 className="font-extrabold text-sm sm:text-base text-rose-300">
              {isTaiwanRestDay 
                ? '● 今日公休店休中 Rest Day / Holiday - Browsing Only' 
                : '● 店鋪休息中 (僅供瀏覽餐點) Store Closed - Browsing Only'}
            </h5>
            <p className="text-[11px] sm:text-xs text-rose-400/80 leading-relaxed">
              {isTaiwanRestDay 
                ? '今日為設定的特殊休假公休日，全天不提供購物車點餐服務。系統已鎖定點餐與加點功能，您可以自由瀏覽菜單與菜色內容！'
                : '當前不在設定 of 合法營業時間內。系統已鎖定購物車加點與點餐結帳功能，您可以自由流覽菜單餐點與價格。'}
              {!isTaiwanRestDay && operatingHours && operatingHours.length > 0 && (
                <span className="block mt-1 text-rose-400 font-mono font-bold text-[10px] sm:text-[11px]">
                  ⏰ 營業時段 Operating Hours: {operatingHours.filter((s:any) => s.isActive).map((s:any) => `${s.name} (${s.start} - ${s.end})`).join('、')}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* ⚡ Simplified Mode Toggle Action Ribbon */}
      <div 
        className={`rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg transition-all duration-300 ${
          isSimplifiedMode 
            ? 'bg-[#FFFFFF] border-4 border-black text-black' 
            : 'bg-gradient-to-r from-thai-gold/20 via-[#E5B453]/10 to-transparent border border-thai-gold/30 text-white'
        }`}
      >
        <div className="text-left space-y-1">
          <h4 className={`font-extrabold flex items-center gap-2 ${isSimplifiedMode ? 'text-black text-lg' : 'text-sm sm:text-base'}`}>
            <span>{isSimplifiedMode ? '👵👴 尊長大字/高對比點餐模式中' : '✨ 首選沙貝尊長大字點餐模式'}</span>
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
              老年友善
            </span>
          </h4>
          <p className={`${isSimplifiedMode ? 'text-black font-extrabold text-sm' : 'text-zinc-400 text-xs font-medium'}`}>
            {isSimplifiedMode 
              ? '已為您自動放大字體、啟用高對比高清晰底色，呈現超大型方塊，並移除冗餘介紹。' 
              : '一鍵開啟最溫馨、高清晰大字體、極簡潔且不含廣告簡介的點餐介面。誠邀銀髮長輩品嚐。'}
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => {
            setIsSimplifiedMode(!isSimplifiedMode);
            // Scroll to catalog top
            const topPanel = document.getElementById('customer-order-panel');
            if (topPanel) topPanel.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap ${
            isSimplifiedMode 
              ? 'bg-black hover:bg-zinc-800 text-white border-2 border-black hover:scale-[1.02]' 
              : 'bg-white hover:bg-slate-100 text-[#0F0F0F]'
          }`}
        >
          {isSimplifiedMode ? '🔄 返回標準夜色模式' : '👵👴 切換簡單/尊長大字模式'}
        </button>
      </div>

      {/* Table QR Simulation indicator Bar */}
      <div className="bg-thai-charcoal border border-thai-gold/20 text-white rounded-3xl p-3 sm:p-4 flex flex-row items-center justify-between gap-2.5 sm:gap-4 shadow-xl select-none">
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-thai-gold/10 border border-thai-gold rounded-2xl flex flex-col items-center justify-center animate-pulse text-center shrink-0">
            {selectedTable.includes('外帶') ? (
              <div className="flex flex-col items-center justify-center leading-none text-center">
                <span className="text-[9px] sm:text-[11px] font-bold text-thai-gold font-sans leading-tight">外帶</span>
                <span className="text-xs sm:text-xs font-extrabold font-mono text-thai-gold mt-0.5 leading-tight">
                  {selectedTable.replace('外帶', '').trim()}
                </span>
              </div>
            ) : (
              <>
                <span className="text-[8px] sm:text-[9px] text-thai-gold uppercase font-bold tracking-wider font-sans">TABLE</span>
                <span className="text-sm sm:text-lg font-bold font-mono text-thai-gold leading-none">{selectedTable}</span>
              </>
            )}
          </div>
          <div className="text-left min-w-0">
            <h4 className="font-extrabold text-[#f8fafc] text-[11px] sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2 font-display whitespace-nowrap">
              <span className="truncate max-w-[85px] min-[360px]:max-w-[110px] sm:max-w-none">
                {currentLang === 'zh'
                  ? (isTableFixed ? '沙貝燒烤 泰式烤肉' : '沙貝燒烤')
                  : (isTableFixed ? TRANSLATIONS.sabayBBQ[currentLang] : 'Sabay BBQ')}
              </span>
            </h4>
            <p className="text-slate-400 text-xs hidden sm:block truncate">{TRANSLATIONS.slogan[currentLang]}</p>
          </div>
        </div>

        {/* Change Table Simulation Selector / Fixed display aligned to the absolute right */}
        <div className="flex items-center justify-end shrink-0">
          {isTableFixed ? (
            <div className="h-10 sm:h-12 px-3 sm:px-4 bg-thai-gold/10 border border-thai-gold/30 rounded-2xl flex items-center justify-center space-x-1.5 sm:space-x-2 shadow-inner whitespace-nowrap text-xs sm:text-sm font-bold font-sans text-thai-gold">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00C300] animate-pulse"></span>
              <span>
                {selectedTable.includes('外帶') ? selectedTable : `${selectedTable} 桌`}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-end space-x-1 sm:space-x-2 bg-thai-dark/50 p-1 sm:p-1.5 rounded-2xl border border-slate-700 h-10 sm:h-12 pl-2">
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium pl-1 sm:pl-2">{TRANSLATIONS.table[currentLang]}</span>
              <select
                id="table-selection-selector"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-thai-charcoal text-thai-gold border-none font-bold text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl focus:ring-0 cursor-pointer h-full"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} 桌
                  </option>
                ))}
                {!tables.some((t) => t.id === selectedTable) && (
                  <option value={selectedTable}>
                    {selectedTable.includes('外帶') ? `${selectedTable} (Takeout)` : `${selectedTable} 號 (Custom)`}
                  </option>
                )}
              </select>
            </div>
          )}
        </div>
      </div>

      {!selectedTable.includes('外帶') && (
        <div className="bg-thai-charcoal border border-white/5 text-white rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg select-none">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-thai-gold/10 border border-thai-gold/30 rounded-2xl flex items-center justify-center text-[#E5B453]">
              <span className="text-lg font-bold">👤</span>
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">用餐人數 Guest Count</h5>
              <p className="text-[11px] text-white/50">內用低消 NT$ {minSpend}/人 (每桌低消依人數累計)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-thai-dark/50 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition flex items-center justify-center font-bold text-white text-lg"
            >
              -
            </button>
            <span className="w-12 text-center text-sm font-extrabold font-mono text-thai-gold">
              {guestCount} 人
            </span>
            <button
              onClick={() => setGuestCount(prev => Math.min(20, prev + 1))}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition flex items-center justify-center font-bold text-white text-lg"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* 🚀 QR Code Simulator */}
      {!isTableFixed && (
        <div className="bg-black/30 border border-white/5 rounded-3xl p-4.5 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#E5B453] flex items-center space-x-1.5 font-sans">
              <QrCode size={14} className="text-[#E5B453]" />
              <span>📲 點餐二維碼模擬器 QR Code Scan Simulator</span>
            </p>
            <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">內用桌暨外帶單一 QR 碼</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed font-sans">
            在店面營運中，顧客可直接用手機掃描設定好的 QR 碼進行免接觸點餐。請隨意點選下方按鈕模擬顧客掃描：
          </p>
          
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Takeout QR simulator */}
            <button
              type="button"
              onClick={() => handleSimulateScan('takeout')}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] px-3 py-2 rounded-xl active:scale-95 transition cursor-pointer shadow-md shadow-rose-955/20 border border-rose-500/10"
            >
              <QrCode size={13} className="animate-spin-slow" />
              <span>掃描外帶單一 QR 碼 (號碼自動累加)</span>
            </button>

            {/* Dine-in tables list */}
            {tables.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSimulateScan(t.id)}
                className="flex items-center space-x-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-bold text-[11px] px-2.5 py-2 rounded-xl active:scale-95 transition cursor-pointer"
              >
                <QrCode size={12} className="text-[#E5B453]/80" />
                <span>內用 {t.id} 桌</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scanned table notification banner */}
      {qrScannedInfo && (
        <div className="bg-amber-500/10 border border-[#E5B453]/30 text-[#E5B453] text-[11px] rounded-2xl py-3 px-4 flex items-center justify-between shadow-lg text-left">
          <span className="flex items-center space-x-2">
            <QrCode size={15} className="text-[#E5B453] shrink-0" />
            <span className="font-sans font-bold text-white/90">{qrScannedInfo}</span>
          </span>
          <button 
            type="button"
            onClick={() => setQrScannedInfo(null)} 
            className="text-white/40 hover:text-white/80 p-0.5 ml-2 cursor-pointer active:scale-90"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Dynamic Push Promos Notification Alert Queue */}
      {pushNotifications.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 text-left shadow-md flex items-start space-x-3 gap-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 text-[9px] font-sans px-2.5 py-0.5 rounded-bl-xl font-bold flex items-center space-x-1 animate-bounce">
            <BellRing size={10} />
            <span>PUSH</span>
          </div>
          <div className="bg-amber-100 text-amber-700 p-2.5 rounded-2xl shrink-0 mt-0.5">
            <Sparkles size={18} />
          </div>
          <div className="flex-1">
            <h6 className="text-[13px] font-bold text-slate-800">{pushNotifications[0].title}</h6>
            <p className="text-xs text-slate-600 mt-1">{pushNotifications[0].message}</p>
            <span className="text-[10px] text-amber-600/70 block mt-2 font-mono">
              優惠快訊・僅於 {pushNotifications[0].timestamp} 更新
            </span>
          </div>
          <button
            id="clear-promo-notif-btn"
            onClick={() => onMarkNotificationRead(pushNotifications[0].id)}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-amber-100 rounded-full"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Global Checkout warnings */}
      {orderSentSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 rounded-3xl p-5 text-left shadow-lg animate-bounce flex items-center space-x-3" id="order-success-indicator">
          <div className="bg-emerald-500 text-white p-2 rounded-full">
            <Check size={20} />
          </div>
          <div>
            <h5 className="font-extrabold text-sm">{TRANSLATIONS.orderPlaced[currentLang]}</h5>
            <p className="text-xs text-emerald-800/80 mt-1 font-mono">您的訂單序號為: <strong className="text-emerald-900 bg-white/50 px-1 py-0.5 rounded">{orderSentSuccess}</strong>，已成功送出！待後台人員確認後，即會開始列印您的點餐單並送至廚房配餐。</p>
          </div>
        </div>
      )}

      {orderError && (
        <div className="bg-rose-50 border-2 border-rose-400 text-rose-900 rounded-3xl p-5 text-left shadow-lg flex items-start space-x-3" id="order-error-indicator">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h5 className="font-extrabold text-sm">點餐受阻 Notice</h5>
            <p className="text-xs text-rose-800/80 mt-1">{orderError}</p>
          </div>
        </div>
      )}

      {/* 🎁 Google 會員累積點數與專屬好禮兌換專區 */}
      {!isSimplifiedMode && (lineProfile ? (
        <div className="bg-gradient-to-br from-[#121824] to-[#0d0e14] border border-blue-500/25 rounded-3xl p-6 text-left shadow-2xl space-y-4 relative overflow-hidden" id="google-loyalty-panel">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center space-x-3.5 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/10 shrink-0">
                <Coins size={22} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2">
                  <span>Google 會員專屬累點好禮中心</span>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-400/20">尊榮會員 VIP</span>
                </h4>
                <p className="text-slate-400 text-xs">
                  歡迎回來，<strong className="text-white font-black">{lineProfile.displayName}</strong>！每 20 元消費皆可累積 1 點，點數即可兌換免費泰式人氣熱銷美食串燒！
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <div className="bg-gradient-to-b from-blue-950/80 to-slate-900 border border-blue-400/40 px-5 py-2.5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[120px] shadow-lg">
                <span className="text-blue-300 text-[9px] font-black uppercase tracking-widest leading-none mb-1">您擁有的累積點數</span>
                <span className="text-xl font-black text-white font-mono tracking-wide flex items-baseline gap-1">
                  {userPoints.toLocaleString()} <span className="text-xs font-bold text-slate-300 font-sans">點</span>
                </span>
              </div>
              <div className="bg-gradient-to-b from-emerald-950/80 to-slate-900 border border-emerald-400/40 px-5 py-2.5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[120px] shadow-lg text-center">
                <span className="text-emerald-300 text-[9px] font-black uppercase tracking-widest leading-none mb-1">您的會員儲值餘額</span>
                <span className="text-xl font-black text-emerald-400 font-mono tracking-wide">
                  NT$ {userBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1 font-sans">
                <span>🔥 點數立即兌換專區 (Points Redemption)</span>
              </span>
              <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/15">
                點數立即抵扣 結帳自動帶入 NT$ 0 免費送
              </span>
            </div>

            {redeemMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-[#00C300] rounded-2xl p-4 text-xs font-black leading-relaxed flex items-center space-x-2 animate-pulse">
                <span>🎉</span>
                <span>{redeemMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {REWARD_ITEMS.map((item) => {
                const isEligible = userPoints >= item.cost;
                return (
                  <div 
                    key={item.id} 
                    className={`bg-zinc-950/50 rounded-2xl p-4 border flex flex-col justify-between space-y-4 relative overflow-hidden transition-all duration-300 ${
                      isEligible 
                        ? 'border-blue-500/20 hover:border-blue-400/50 bg-blue-950/5 hover:bg-blue-950/20 hover:translate-y-[-2px]' 
                        : 'border-white/5 opacity-40'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                          isEligible ? 'bg-blue-500/15 text-blue-300 border border-blue-400/10 font-sans' : 'bg-white/5 text-slate-500'
                        }`}>
                          🪙 {item.cost} 點
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-white leading-snug">{item.name[currentLang]}</h5>
                      <span className="text-[10px] text-zinc-500 block">市價 NT$ {item.originalPrice}</span>
                    </div>
                    
                    <button
                      type="button"
                      disabled={!isEligible}
                      onClick={() => handleRedeemReward(item)}
                      className={`w-full py-2.5 rounded-xl text-[11px] font-black transition active:scale-95 flex items-center justify-center space-x-1 cursor-pointer ${
                        isEligible 
                          ? 'bg-[#4285F4] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                          : 'bg-zinc-900 text-zinc-650 cursor-not-allowed font-medium'
                      }`}
                    >
                      {isEligible ? '立即兌換' : `賸餘 ${item.cost - userPoints} 點`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-950/20 via-slate-900/40 to-transparent border border-blue-500/15 rounded-3xl p-5 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
              <Coins size={18} />
            </div>
            <div>
              <h5 className="text-white font-bold text-sm">💡 登入 Google 帳號，尊享超值累點與美食兌換！</h5>
              <p className="text-slate-400 text-xs">每 20 元消費皆可累積 1 點，點數可免費兌換泰式奶茶、爆汁豬肉串與經典冬蔭功海鮮湯！</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const loginBtn = document.getElementById('google-login-trigger-btn');
              if (loginBtn) loginBtn.click();
            }}
            className="bg-[#4285F4] hover:bg-blue-600 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer transition shrink-0 active:scale-95 shadow-lg shadow-blue-500/10 font-sans"
          >
            立即登入累點
          </button>
        </div>
      ))}

      {/* Main Categories Menu Row (Horizontal Touch Carousel) */}
      <div className="space-y-2">
        <label className={`block text-xs font-bold uppercase tracking-widest text-left font-display ${isSimplifiedMode ? 'text-black font-black text-sm' : 'text-white/45'}`}>
          {TRANSLATIONS.categories[currentLang]} Menu Category
        </label>
        <div className="flex overflow-x-auto py-2.5 gap-2 scrollbar-none scroll-smooth" id="categories-tabs-carousel">
          {categories.filter(cat => cat.showOnCustomerPage !== false).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4.5 py-3 rounded-full text-sm font-bold flex items-center space-x-1.5 transition shrink-0 cursor-pointer active:scale-95 ${
                  isSelected
                    ? isSimplifiedMode
                      ? 'bg-white text-black border-2 border-black font-extrabold shadow-md text-base'
                      : 'bg-[#E5B453] text-[#0F0F0F] shadow-lg shadow-[#E5B453]/20 font-extrabold'
                    : isSimplifiedMode
                      ? 'bg-black text-white border-2 border-black text-base font-black hover:bg-zinc-800'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
              >
                <span>{cat.name[currentLang] || cat.name['zh'] || cat.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Catelog Menu Grid */}
      <div 
        className={isSimplifiedMode 
          ? "flex flex-col gap-3" 
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        } 
        id="dish-catalog-grid"
      >
        {filteredItems.map((item) => {
          if (isSimplifiedMode) {
            return (
              <div
                key={item.id}
                id={`dish-card-${item.id}`}
                onClick={() => { if (item.available) handleOpenDetail(item); }}
                className={`bg-white text-black rounded-2xl overflow-hidden shadow-md border-2 ${
                  item.available 
                    ? 'border-black hover:border-zinc-600 cursor-pointer active:scale-[1.01] transition-all' 
                    : 'border-zinc-300 opacity-60 cursor-not-allowed'
                } flex flex-row items-stretch text-left relative`}
              >
                {/* Left: Thumbnail */}
                <div className="w-28 sm:w-36 shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.name.zh}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-black text-center px-1">賣完了</span>
                    </div>
                  )}
                </div>

                {/* Right: Info + Action */}
                <div className="flex flex-col justify-between flex-1 px-4 py-3">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-black text-xl sm:text-2xl leading-snug tracking-wide font-sans">
                      {item.name.zh || item.name[currentLang]}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-black text-white text-base font-black px-3 py-1 rounded-lg">
                        NT$ {item.price} 元
                      </span>
                      {item.isNotSpicy ? (
                        <span className="bg-white text-black text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black">
                          🍃 不辣
                        </span>
                      ) : (
                        <span className="bg-white text-black text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black">
                          🌶️ 辣
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2">
                    {item.available ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(item);
                        }}
                        className="px-4 py-2 bg-black hover:bg-zinc-800 text-white font-black text-sm rounded-xl border-2 border-black transition active:scale-95 cursor-pointer shadow-sm flex items-center gap-1.5"
                      >
                        <span>🛒 點餐</span>
                        <ChevronRight size={16} className="stroke-[3]" />
                      </button>
                    ) : (
                      <span className="text-zinc-500 font-black text-sm">本日售罄</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Standard Mode remains completely pristine and unmodified
          return (
            <div
              key={item.id}
              id={`dish-card-${item.id}`}
              onClick={() => handleOpenDetail(item)}
              className={`bg-[#161616] rounded-xl overflow-hidden shadow-md hover:shadow-2xl border border-white/10 hover:border-[#E5B453]/30 transition-all duration-300 flex flex-col justify-between text-left relative ${
                item.available ? 'cursor-pointer' : 'opacity-65 cursor-not-allowed'
              }`}
            >
              {/* Out of Stock Ribbon */}
              {!item.available && (
                <div className="absolute top-3 right-3 bg-[#FF4D4D] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full z-10 uppercase tracking-widest shadow-md">
                  賣完了 Sold Out
                </div>
              )}
              
              <div>
                {/* Picture Frame */}
                <div className="h-44 sm:h-48 overflow-hidden relative bg-black border-b border-white/5">
                  <img
                    src={item.image}
                    alt={item.name[currentLang]}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex items-end justify-between">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <span className="bg-[#E5B453] text-[#0F0F0F] text-xs font-black px-2.5 py-1 rounded-lg">
                        NT$ {item.price}
                      </span>
                      {item.isNotSpicy ? (
                        <span className="bg-emerald-500/95 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide flex items-center gap-0.5 shadow-sm">
                          🍃 不辣
                        </span>
                      ) : (
                        <span className="bg-rose-600/95 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide flex items-center gap-0.5 shadow-sm">
                          🌶️ 辣
                        </span>
                      )}
                    </div>
                    {item.isSetMeal && (
                      <span className="bg-red-500 text-white text-[9px] uppercase tracking-wider font-sans font-bold px-1.5 py-0.5 rounded">
                        Set Meal
                      </span>
                    )}
                  </div>
                </div>

                {/* Text Frame */}
                <div className="p-4.5 space-y-2">
                  <h5 className="font-bold text-white text-base leading-snug line-clamp-1 font-serif tracking-wide">
                    {item.name[currentLang]}
                  </h5>
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-2">
                    {item.description[currentLang]}
                  </p>
                </div>
              </div>

              {/* Tap Action Bar */}
              <div className="p-4 border-t border-white/5 bg-white/2 flex items-center justify-between">
                <span className="text-white/40 text-[10px] font-semibold flex items-center space-x-1">
                  <Clock size={11} className="text-white/40" />
                  <span>烹調約 10-15 分鐘</span>
                </span>
                {item.available ? (
                  <button
                    id={`add-to-cart-btn-${item.id}`}
                    className="bg-white/5 hover:bg-[#E5B453] hover:text-[#0F0F0F] text-white/80 text-xs font-bold px-3.5 py-2 rounded-xl border border-white/10 transition flex items-center space-x-1 active:scale-95 cursor-pointer"
                  >
                    <span>細修選項</span>
                    <ChevronRight size={13} />
                  </button>
                ) : (
                  <span className="text-white/40 text-xs font-bold font-sans">明日請早</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating View Shopping Cart Bar Trigger (if items present) */}
      {cart.length > 0 && isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-40 animate-slide-up" id="floating-cart-bar">
          <button
            id="view-cart-trigger"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#161616] hover:bg-[#1E1E1E] text-white p-4 flex items-center justify-between border border-white/15 rounded-full shadow-2xl transition transform active:scale-95 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="relative bg-[#E5B453] text-[#0F0F0F] w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shadow-md">
                <ShoppingCart size={15} />
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF4D4D] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#161616] font-sans font-bold">
                  {cart.reduce((s, o) => s + o.qty, 0)}
                </span>
              </div>
              <div className="text-left leading-none">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">購物車清單</span>
                <p className="text-sm font-extrabold text-[#E5B453] mt-1 font-mono">
                  NT$ {cartTotal}
                </p>
              </div>
            </div>
            <span className="bg-[#E5B453] hover:bg-[#F0C46B] text-[#0F0F0F] text-xs font-black px-4 py-2 rounded-full cursor-pointer flex items-center space-x-1 shadow-sm font-sans">
              <span>立即結帳下單</span>
              <ChevronRight size={14} />
            </span>
          </button>
        </div>
      )}

      {/* Customize Options Side Sheet / Modal popup */}
      {selectedDetailItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="item-customizer-modal">
          <div className={`rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border-4 transition-all duration-300 ${isSimplifiedMode ? 'bg-[#FFFFFF] text-black border-[#FFA500]' : 'bg-[#161616] border-white/10 text-white'}`}>
            {/* Pic & Name */}
            <div className="relative h-44 bg-black shrink-0">
              <img
                src={selectedDetailItem.image}
                alt={selectedDetailItem.name[currentLang]}
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <button
                id="close-customizer-btn"
                onClick={() => setSelectedDetailItem(null)}
                className="absolute top-4 right-4 bg-black/60 text-white hover:text-[#E5B453] p-1.5 rounded-full backdrop-blur-sm transition cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-5 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`font-serif tracking-wide ${isSimplifiedMode ? 'text-white text-xl font-black' : 'text-white text-lg font-bold'}`}>
                    {selectedDetailItem.name[currentLang]}
                  </h4>
                  {selectedDetailItem.isNotSpicy ? (
                    <span className="bg-emerald-500/95 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 select-none shrink-0">
                      🍃 完全不辣
                    </span>
                  ) : (
                    <span className="bg-rose-600/95 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 select-none shrink-0">
                      🌶️ 經典手作香辣
                    </span>
                  )}
                </div>
                {!isSimplifiedMode && (
                  <p className="text-xs text-white/60 line-clamp-1 mt-1 font-sans">
                    {selectedDetailItem.description[currentLang]}
                  </p>
                )}
              </div>
            </div>

            {/* Adjusters scroll area */}
            <div className={`p-5 overflow-y-auto space-y-4 text-left ${isSimplifiedMode ? 'bg-[#FFFFFF]' : ''}`}>
              {/* Portion Control */}
              <div className={`flex items-center justify-between p-3.5 rounded-xl ${
                isSimplifiedMode 
                  ? 'bg-amber-500/15 border-2 border-[#FFA500]' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                <span className={`font-black ${isSimplifiedMode ? 'text-black text-base' : 'text-xs text-white/90 font-bold'}`}>點餐份數 Quantity</span>
                <div className={`flex items-center space-x-3 px-3 py-1.5 rounded-lg ${
                  isSimplifiedMode ? 'bg-[#FFA500] border-2 border-black' : 'bg-black/40 border border-white/10'
                }`}>
                  <button
                    id="qty-decrement"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className={`w-8 h-8 font-extrabold rounded flex items-center justify-center cursor-pointer transition ${isSimplifiedMode ? 'text-black bg-white hover:bg-zinc-200 border border-black' : 'text-white/75 hover:bg-white/10'}`}
                  >
                    -
                  </button>
                  <span className={`font-mono font-black ${isSimplifiedMode ? 'text-black text-xl' : 'text-[#E5B453]'}`}>{qty}</span>
                  <button
                    id="qty-increment"
                    onClick={() => setQty(qty + 1)}
                    className={`w-8 h-8 font-extrabold rounded flex items-center justify-center cursor-pointer transition ${isSimplifiedMode ? 'text-black bg-white hover:bg-zinc-200 border border-black' : 'text-white/75 hover:bg-white/10'}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customization adjusters were removed for simplified ordering */}
              
              {/* Noodle options - e.g. for Mama items */}
              {selectedDetailItem.hasNoodlesOption && (
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-widest ${isSimplifiedMode ? 'text-zinc-800 text-sm font-black' : 'text-white/40'}`}>
                    {TRANSLATIONS.noodleOption[currentLang]} Select noodle types
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'rice-noodle', label: '河粉', spec: 'Rice Noodle' },
                      { code: 'vermicelli', label: '米線', spec: 'Vermicelli' },
                      { code: 'none', label: '不加麵', spec: 'Plain Soup' },
                    ].map((nd) => (
                      <button
                        key={nd.code}
                        id={`noodle-opt-${nd.code}`}
                        type="button"
                        onClick={() => setNoodleType(nd.code as any)}
                        className={`p-2 rounded-xl text-center border-2 transition cursor-pointer flex flex-col items-center justify-center ${
                          noodleType === nd.code
                            ? (isSimplifiedMode ? 'border-amber-500 bg-amber-100 text-black font-extrabold' : 'border-[#E5B453] bg-[#E5B453]/15 text-[#E5B453] font-bold')
                            : (isSimplifiedMode ? 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100' : 'border-white/10 text-white/80 hover:bg-[#1C1C1C]')
                        }`}
                      >
                        <span className={`text-sm ${isSimplifiedMode ? 'text-base font-black' : ''}`}>{nd.label}</span>
                        <span className={`text-[9px] uppercase mt-0.5 ${isSimplifiedMode ? 'text-zinc-500 font-extrabold' : 'text-white/40'}`}>{nd.spec}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Soup Base coconut milk modifier */}
              {selectedDetailItem.hasCoconutsMilkOption && (
                <div className={`p-3.5 rounded-xl flex items-center justify-between border ${
                  isSimplifiedMode 
                    ? 'bg-amber-100 border-2 border-[#FFA500] text-black' 
                    : 'bg-[#E5B453]/10 border-[#E5B453]/25 p-3.5 text-white'
                }`}>
                  <div className="text-left">
                    <span className={`font-bold block ${isSimplifiedMode ? 'text-black text-base font-black' : 'text-[#E5B453] text-xs'}`}>升級奶香冬蔭功 (+NT$50)</span>
                    <span className={`text-[10px] ${isSimplifiedMode ? 'text-zinc-600 font-extrabold' : 'text-white/60'} leading-none`}>加入大罐頂級泰國椰奶，香濃誘人</span>
                  </div>
                  <input
                    type="checkbox"
                    id="coconut-soup-base-checkbox"
                    checked={soupBase === 'coconut-milk'}
                    onChange={(e) => setSoupBase(e.target.checked ? 'coconut-milk' : 'plain')}
                    className="w-6 h-6 rounded border-zinc-350 text-[#E5B453] focus:ring-[#E5B453] bg-black/40 cursor-pointer"
                  />
                </div>
              )}

              {/* Custom Add-Ons list selection */}
              {selectedDetailItem.customAddOns && selectedDetailItem.customAddOns.length > 0 && (
                <div className={`space-y-2 border-t pt-3.5 mt-3.5 ${isSimplifiedMode ? 'border-zinc-200' : 'border-white/10'}`}>
                  <label className={`block text-xs font-bold uppercase tracking-widest ${isSimplifiedMode ? 'text-black text-sm font-black' : 'text-[#E5B453]'}`}>
                    加選附加選項 Custom Options & Add-Ons
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedDetailItem.customAddOns.map((addOn) => {
                      const isSelected = selectedAddOns.some(a => a.id === addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAddOns(selectedAddOns.filter(a => a.id !== addOn.id));
                            } else {
                              setSelectedAddOns([...selectedAddOns, addOn]);
                            }
                          }}
                          className={`p-3 rounded-xl border-2 flex items-center justify-between text-left transition cursor-pointer ${
                            isSelected
                              ? (isSimplifiedMode ? 'border-amber-500 bg-amber-100 text-black font-black' : 'border-[#E5B453] bg-[#E5B453]/15 text-[#E5B453] font-bold shadow-md')
                              : (isSimplifiedMode ? 'border-zinc-300 text-zinc-800 bg-white hover:bg-zinc-150' : 'border-white/10 text-white/80 hover:bg-[#1C1C1C]')
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-amber-500 border-transparent' : 'border-zinc-305'
                            }`}>
                              {isSelected && <Check size={11} className="text-black stroke-[4]" />}
                            </div>
                            <span className={`text-xs leading-tight ${isSimplifiedMode ? 'font-black' : ''}`}>{addOn.name}</span>
                          </div>
                          <span className={`font-mono text-[11px] font-bold shrink-0 ml-1 ${isSimplifiedMode ? 'text-amber-800 font-black' : 'text-amber-400'}`}>+${addOn.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alert Warning for Ingredients if too low */}
              {inventoryWarnings.length > 0 && (
                <p className="text-[10px] text-amber-400 bg-amber-500/10 rounded-lg p-2.5 flex items-center space-x-1 font-semibold border border-amber-500/20 leading-relaxed">
                  <AlertTriangle size={15} className="shrink-0 text-amber-500 mr-1" />
                  <span>部分手作食材及海鮮數量吃緊，請儘速在下方完成下單。</span>
                </p>
              )}
            </div>

            {/* Bottom confirmation Bar */}
            <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
              isSimplifiedMode 
                ? 'bg-amber-50 border-t-2 border-zinc-200' 
                : 'bg-black/30 border-t border-white/10'
            }`}>
              <div className="text-left leading-none">
                <span className={`text-[10px] uppercase font-bold ${isSimplifiedMode ? 'text-black font-black' : 'text-white/40'}`}>總計算額金額</span>
                <p className={`text-lg font-bold mt-1 font-serif ${isSimplifiedMode ? 'text-amber-800 text-xl font-black' : 'text-[#E5B453]'}`}>
                  NT$ {(selectedDetailItem.price + (spiciness === 3 ? 10 : 0) + (soupBase === 'coconut-milk' ? 50 : 0) + selectedAddOns.reduce((sum, a) => sum + a.price, 0)) * qty}
                </p>
              </div>

              {isOpen ? (
                <button
                  id="add-to-cart-confirm"
                  onClick={handleAddToCart}
                  className={`font-black px-4 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition flex items-center space-x-2 active:scale-95 cursor-pointer text-xs min-[360px]:text-sm sm:text-base whitespace-nowrap ${
                    isSimplifiedMode 
                      ? 'bg-[#FFA500] hover:bg-amber-400 text-black border-2 border-black font-extrabold shadow-lg' 
                      : 'bg-[#E5B453] hover:bg-[#F0C46B] text-[#0F0F0F]'
                  }`}
                >
                  <ShoppingCart size={15} className="shrink-0" />
                  <span>確定加入點餐單</span>
                </button>
              ) : (
                <button
                  disabled
                  className="bg-zinc-850 text-zinc-500 font-bold px-3 min-[360px]:px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center space-x-1.5 sm:space-x-2 text-[10px] min-[360px]:text-xs sm:text-sm whitespace-nowrap border border-white/5 cursor-not-allowed"
                >
                  <Clock size={12} />
                  <span>休息中 Closed</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer Modal Sheet */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4" id="cart-drawer-overlay">
          <div className={`rounded-t-2xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border flex flex-col max-h-[85vh] animate-slide-up transition-all ${
            isSimplifiedMode 
              ? 'bg-[#FFFFFF] text-black border-[#FFA500] border-4' 
              : 'bg-[#161616] border-white/10 text-white'
          }`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              isSimplifiedMode ? 'bg-amber-100/40 border-zinc-200' : 'bg-black/30 border-white/10'
            }`}>
              <h4 className={`font-bold flex items-center space-x-1.5 font-serif tracking-wide ${
                isSimplifiedMode ? 'text-black' : 'text-white'
              }`}>
                <ShoppingCart size={18} className={isSimplifiedMode ? 'text-black' : 'text-[#E5B453]'} />
                <span>購物車結帳大廳</span>
              </h4>
              <button
                id="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                className={`p-1.5 rounded-full transition ${
                  isSimplifiedMode ? 'text-black hover:bg-zinc-200' : 'text-white/40 hover:text-[#E5B453]'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Line Items */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-left">
              {cart.length === 0 ? (
                <div className={`py-12 text-center space-y-2 ${isSimplifiedMode ? 'text-black/50' : 'text-white/40'}`}>
                  <ShoppingCart size={36} className={`mx-auto ${isSimplifiedMode ? 'text-black/30' : 'text-white/20'}`} />
                  <p className="text-sm font-semibold">購物車空空如也，馬上點餐吧！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} id={`cart-item-${item.id}`} className={`flex items-start justify-between p-3.5 rounded-xl border shadow-inner ${
                      isSimplifiedMode ? 'bg-[#FFF9EE] border-zinc-300 text-black' : 'bg-white/5 border-white/5'
                    }`}>
                      <div className="text-left space-y-1">
                        <h6 className={`font-bold text-sm leading-snug ${isSimplifiedMode ? 'text-black text-base font-black' : 'text-white'}`}>{item.name[currentLang]}</h6>
                        <div className="flex flex-wrap gap-1">
                          {item.customization.noodleType && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                              isSimplifiedMode ? 'bg-[#FFA500] text-black border-black font-extrabold' : 'bg-[#E5B453]/15 text-[#E5B453] border-[#E5B453]/15'
                            }`}>
                              {item.customization.noodleType === 'rice-noodle' ? '河粉' : '米線'}
                            </span>
                          )}
                          {item.customization.soupBase === 'coconut-milk' && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                              isSimplifiedMode ? 'bg-amber-200 text-amber-950 border-amber-400 font-extrabold' : 'bg-amber-500/10 text-amber-500 border-amber-500/15'
                            }`}>
                              加椰奶(+50)
                            </span>
                          )}
                          {item.customization.spiciness > 1 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                              isSimplifiedMode ? 'bg-red-200 text-red-950 border-red-300 font-extrabold' : 'bg-red-500/10 text-red-400 border-red-500/15'
                            }`}>
                              {item.customization.spiciness === 2 ? '小辣' : '大辣(+10)'}
                            </span>
                          )}
                          {item.customization.selectedAddOns?.map((addOn) => (
                            <span key={addOn.id} className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                              isSimplifiedMode ? 'bg-[#FFA500]/15 text-black border-[#FFA500] font-extrabold' : 'bg-[#E5B453]/15 text-[#E5B453] border-[#E5B453]/15'
                            }`}>
                              +{addOn.name}(+${addOn.price})
                            </span>
                          ))}
                        </div>
                        {item.customization.notes && (
                          <p className={`text-xs font-sans italic ${isSimplifiedMode ? 'text-zinc-700 font-black' : 'text-[#E5B453]'}`}>“{item.customization.notes}”</p>
                        )}
                        <div className="flex items-center space-x-1.5 pt-1.5">
                          <button
                            type="button"
                            id={`dec-qty-${item.id}`}
                            onClick={() => handleUpdateCartQty(item.id, item.qty - 1)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition active:scale-90 cursor-pointer border ${
                              isSimplifiedMode 
                                ? 'text-black bg-zinc-100 hover:bg-zinc-200 border-zinc-400' 
                                : 'bg-white/5 hover:bg-white/15 hover:text-white text-white/60 border-white/10'
                            }`}
                          >
                            <span className="text-sm font-bold leading-none">-</span>
                          </button>
                          <span className={`font-mono text-xs font-black min-w-[22px] text-center rounded border ${
                            isSimplifiedMode ? 'text-black bg-white border-zinc-400' : 'text-white bg-black/20 border-white/5'
                          }`}>
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            id={`inc-qty-${item.id}`}
                            onClick={() => handleUpdateCartQty(item.id, item.qty + 1)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition active:scale-90 cursor-pointer border ${
                              isSimplifiedMode 
                                ? 'text-black bg-[#FFA500] hover:bg-[#E5B453] border-black font-extrabold' 
                                : 'bg-white/5 hover:bg-white/15 hover:text-white text-[#E5B453]/90 border-[#E5B453]/20'
                            }`}
                          >
                            <span className="text-sm font-bold leading-none">+</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-right space-y-2 shrink-0 ml-4 font-sans">
                        <span className={`font-mono text-sm font-bold block ${isSimplifiedMode ? 'text-black text-base font-black' : 'text-white/95'}`}>
                          NT$ {(item.price + (item.customization.spiciness === 3 ? 10 : 0) + (item.customization.soupBase === 'coconut-milk' ? 50 : 0) + (item.customization.selectedAddOns?.reduce((sum, a) => sum + a.price, 0) || 0)) * item.qty}
                        </span>
                        <button
                          id={`delete-cart-item-${item.id}`}
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-xs text-[#FF4D4D] hover:text-white bg-[#FF4D4D]/10 hover:bg-[#FF4D4D]/35 px-2.5 py-1 rounded transition cursor-pointer whitespace-nowrap"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Payment Method selector */}
                  <div className={`space-y-2 pt-4 border-t ${isSimplifiedMode ? 'border-zinc-200' : 'border-white/10'}`}>
                    <label className={`block text-xs font-bold uppercase tracking-widest ${isSimplifiedMode ? 'text-black font-black' : 'text-white/40'}`}>
                      支付方式 Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { code: 'cash', label: '現金支付', spec: '現場免加額/有優惠' },
                        { code: 'credit', label: '信用卡支付', spec: '均含服務加收10%' },
                        { code: 'linepay', label: 'TWQR支付', spec: '預設服務費10%' },
                        { code: 'member', label: '會員儲值支付', spec: '扣抵會員帳戶餘額' }
                      ].map((pm) => {
                        const isSelected = paymentMethod === pm.code;
                        return (
                          <button
                            key={pm.code}
                            id={`pay-method-${pm.code}`}
                            type="button"
                            onClick={() => setPaymentMethod(pm.code as any)}
                            className={`p-2 rounded-xl text-center border-2 transition cursor-pointer flex flex-col items-center justify-center ${
                              isSimplifiedMode
                                ? isSelected
                                  ? 'border-black bg-black text-white font-black scale-[1.02] shadow-md'
                                  : 'border-zinc-300 text-black bg-white hover:bg-zinc-100'
                                : isSelected
                                  ? 'border-[#E5B453] bg-[#E5B453]/15 text-[#E5B453] font-extrabold shadow-md shadow-[#E5B453]/5 scale-[1.02]'
                                  : 'border-white/10 hover:border-white/25 text-white/70 hover:bg-[#1C1C1C]'
                            }`}
                          >
                            <span className={`text-[11px] font-bold ${isSimplifiedMode ? 'text-sm font-black' : ''}`}>{pm.label}</span>
                            <span className={`text-[9px] mt-0.5 leading-tight ${isSimplifiedMode ? 'text-zinc-650 font-bold' : 'opacity-50'}`}>{pm.spec}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price calculation list */}
                  <div className={`p-4 rounded-xl text-xs font-medium border ${
                    isSimplifiedMode 
                      ? 'bg-amber-50/50 border-zinc-250 text-black border-2' 
                      : 'bg-black/20 border-white/5 text-white/60'
                  }`}>
                    <div className={`flex justify-between ${isSimplifiedMode ? 'text-black font-extrabold' : 'text-white/60'}`}>
                      <span>餐點小計</span>
                      <span className="font-mono">NT$ {cartSubtotal}</span>
                    </div>

                    {lineProfile && (
                      <div className="flex justify-between text-[#4285F4] font-bold">
                        <span>Google 會員可累積點數</span>
                        <span className="font-mono">+{Math.round(cartSubtotal * 0.1)} 點</span>
                      </div>
                    )}

                    {(paymentMethod === 'credit' || paymentMethod === 'linepay') && (
                      <div className={`flex justify-between ${isSimplifiedMode ? 'text-black font-extrabold' : 'text-white/60'}`}>
                        <span>{paymentMethod === 'linepay' ? 'TWQR支付預設服務費 (10%)' : '信用卡服務加成 (10%)'}</span>
                        <span className="font-mono">+ NT$ {expressFee}</span>
                      </div>
                    )}

                    {paymentMethod === 'member' && (
                      <div className={`flex justify-between items-center rounded-lg p-2.5 my-1 font-sans border-2 ${
                        isSimplifiedMode 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        <span>👤 當前會員餘額 Account Wallet</span>
                        <span className="font-mono font-bold text-sm">NT$ {userBalance.toLocaleString()}</span>
                      </div>
                    )}

                    <div className={`flex justify-between pt-1.5 border-t ${
                      isSimplifiedMode 
                        ? 'text-base font-black text-black border-t-2 border-black' 
                        : 'text-sm font-extrabold text-white border-white/10'
                    }`}>
                      <span>本日總應付額</span>
                      <span className={`font-mono font-bold ${isSimplifiedMode ? 'text-xl text-amber-800 font-serif' : 'text-base text-[#E5B453]'}`}>NT$ {cartTotal}</span>
                    </div>

                    {/* Google Member Promo Banner */}
                    {!lineProfile && (
                      <div className={`text-[10px] border rounded-lg p-2.5 mt-2 flex items-center justify-between ${
                        isSimplifiedMode ? 'bg-zinc-100 border-zinc-250 text-black' : 'bg-white/5 border-white/10 text-white/50'
                      }`}>
                        <span>💡 綁定 Google 帳戶可累積點數！</span>
                        <span className="text-[#4285F4] font-black cursor-pointer">手刀登入</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            {cart.length > 0 && (
              <div className={`p-3 sm:p-4 border-t shrink-0 ${isSimplifiedMode ? 'bg-amber-50 border-t-2 border-zinc-200' : 'bg-black/30 border-white/10'}`}>
                <button
                  id="checkout-confirm-btn"
                  onClick={handleCheckout}
                  className={`w-full font-black px-2 min-[360px]:px-4 rounded-xl transition text-center flex items-center justify-center space-x-1 sm:space-x-1.5 active:scale-95 cursor-pointer whitespace-nowrap ${
                    isSimplifiedMode
                      ? 'bg-[#FFA500] hover:bg-amber-400 text-black border-2 border-black font-extrabold text-base py-4 sm:py-4.5 shadow-lg'
                      : 'bg-[#E5B453] hover:bg-[#F0C46B] text-[#0F0F0F] py-2.5 sm:py-3.5 text-[10px] min-[360px]:text-[11px] min-[395px]:text-xs sm:text-sm'
                  }`}
                >
                  <ShoppingCart size={isSimplifiedMode ? 18 : 12} className={isSimplifiedMode ? 'mr-1' : 'sm:size-[15px]'} />
                  <span>確認 {selectedTable.includes('外帶') ? selectedTable : `${selectedTable} 桌`} 並下單 (請至櫃台結帳)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* active check progress orders */}
      {(() => {
        const liveQueueOrders = activeOrders.filter((o) => !o.isPaid);
        if (liveQueueOrders.length === 0) return null;

        return (
          <div className="pt-6 border-t border-white/10 text-left space-y-4" id="order-history-segment">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-white flex items-center space-x-1.5 font-serif tracking-wide text-sm sm:text-base">
                <Clock size={16} className="text-[#E5B453]" />
                <span>{TRANSLATIONS.myOrders[currentLang]} Active Live Queue</span>
              </h5>
              <span className="text-xs text-white/40">系統即時連線 (一秒自動更新)</span>
            </div>

            <div className="space-y-3">
              {liveQueueOrders.map((order) => {
                const statusColors: Record<string, string> = {
                  pending: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
                  preparing: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
                  completed: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
                  cancelled: 'text-rose-400 border-rose-400/20 bg-rose-400/5'
                };

                const statusLabels: Record<string, Record<Language, string>> = {
                  pending: { zh: '⏳ 候餐排隊中', en: 'Pending', ko: 'Pending', ja: 'Pending', th: 'Pending' },
                  preparing: { zh: '🍳 師傅大火製餐中', en: 'Cooking', ko: 'Cooking', ja: 'Cooking', th: 'Cooking' },
                  completed: { zh: '✅ 餐點已上齊 (待結帳)', en: 'Dished Up', ko: 'Dished Up', ja: 'Dished Up', th: 'Dished Up' },
                  cancelled: { zh: '❌ 訂單已撤銷', en: 'Cancelled', ko: 'Cancelled', ja: 'Cancelled', th: 'Cancelled' }
                };

                return (
                  <div
                    key={order.id}
                    id={`history-order-${order.id}`}
                    className="bg-[#161616] border border-white/5 rounded-xl p-4.5 space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left space-y-0.5">
                        <span className="text-xs font-mono font-bold text-[#E5B453] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                          {order.id}
                        </span>
                        <span className="text-xs text-white/40 pl-2">
                          {new Date(order.createdAt).toLocaleTimeString()} · 桌次: {order.tableNumber} 桌
                        </span>
                      </div>

                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${statusColors[order.status] || ''}`}>
                        {statusLabels[order.status]?.[currentLang] || order.status}
                      </span>
                    </div>

                    {/* mini listing */}
                    <div className="space-y-1.5 py-1 text-white/70 text-xs text-left">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between font-medium">
                          <span>
                            {it.name[currentLang]} {it.qty} 份
                          </span>
                          <span className="font-mono text-white/40">NT$ {it.price * it.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-white/5 text-xs">
                      <span className="text-white/45 font-semibold uppercase">付費: {order.paymentMethod.toUpperCase()}</span>
                      <span className="text-white/80 font-bold text-sm">
                        應付總額: <strong className="text-[#E5B453] font-mono text-base font-bold">NT$ {order.total}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })() || (
        // Render nothing or let fallback be shown inside the parent ternary.
        // Let's verify line 1417 fallback has correct structure.
        null
      )}

      {/* If no active live queue orders are present, show the best sellers section */}
      {activeOrders.filter(o => !o.isPaid).length === 0 && (
        <div className="pt-6 border-t border-white/10 text-left space-y-4 font-sans" id="best-sellers-segment">
          {/* Segment Header or Tabs */}
          {loginCount >= 2 && !isSimplifiedMode ? (
            <div className="space-y-4">
              {/* Tabs Navigation */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveSegmentTab('history')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeSegmentTab === 'history'
                      ? 'bg-[#E5B453] text-[#0F0F0F] shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  📜 您的歷史訂單 Past Orders
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSegmentTab('bestsellers')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeSegmentTab === 'bestsellers'
                      ? 'bg-[#E5B453] text-[#0F0F0F] shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🔥 熱銷人氣 Best Sellers
                </button>
              </div>

              {activeSegmentTab === 'history' ? (
                <div className="space-y-4">
                  {/* VIP Return Banner */}
                  <div className="bg-[#E5B453]/10 border border-[#E5B453]/20 rounded-xl p-4 text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                      <span className="text-xs font-black text-[#E5B453] bg-[#E5B453]/15 border border-[#E5B453]/30 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 self-start">
                        <Sparkles size={11} className="text-[#E5B453] animate-pulse" />
                        ✨ 尊榮多次登入老饕會員 Exclusive Diner ✨
                      </span>
                      <span className="text-[10px] text-white/55 font-mono">
                        累計安全驗證登入：<strong className="text-[#E5B453] text-xs font-bold font-mono">{loginCount}</strong> 次
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed font-sans">
                      歡迎再度光臨沙貝炭烤！系統已為您加載歷史消費與餐點足跡。點擊下方 <strong className="text-[#E5B453]">「快速再點一次」</strong> 即可一鍵加入購物車快速重啟美味！
                    </p>
                  </div>

                  {/* Past Orders List */}
                  <div className="space-y-3.5">
                    {[
                      ...activeOrders.filter(o => o.status === 'completed' || o.status === 'cancelled'),
                      ...getSimulatedPastOrders()
                    ].map((pastOrder, idx) => (
                      <div 
                        key={pastOrder.id || idx} 
                        className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:border-white/10 transition space-y-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-[#E5B453] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                              {pastOrder.id}
                            </span>
                            <span className="text-[11px] text-white/40 font-mono">
                              {pastOrder.createdAt.includes('T') 
                                ? pastOrder.createdAt.split('T')[0] 
                                : pastOrder.createdAt} • 桌號: {pastOrder.tableNumber} 桌
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E5B453]/10 border border-[#E5B453]/25 text-[#E5B453]">
                            歷史消費紀錄 Past
                          </span>
                        </div>

                        {/* List items */}
                        <div className="space-y-1.5 pl-1">
                          {pastOrder.items.map((it: any, iIdx) => (
                            <div key={iIdx} className="flex justify-between text-xs text-white/80 font-sans">
                              <span className="flex items-center space-x-1">
                                <span className="text-[#E5B453]">•</span>
                                <span>{it.name[currentLang] || it.name.zh || it.name}</span>
                                <strong className="text-[#E5B453] bg-white/5 px-1.5 py-0.2 rounded text-[10px]">x {it.qty}</strong>
                              </span>
                              <span className="font-mono text-white/40">NT$ {it.price * it.qty}</span>
                            </div>
                          ))}
                        </div>

                        {/* Pricing & Reorder */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div className="text-xs text-white/55">
                            消費總金額: <strong className="text-[#E5B453] text-[13px] font-mono font-bold">NT$ {pastOrder.total}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleReorderOrder(pastOrder.items)}
                            className="flex items-center space-x-1.5 bg-[#E5B453] hover:bg-[#F0C46B] text-[#0F0F0F] text-xs font-black px-3.5 py-2 rounded-xl cursor-pointer transition active:scale-95 shadow-md shadow-[#E5B453]/10"
                          >
                            <ShoppingCart size={12} />
                            <span>快速再點一次 Reorder</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Best Sellers inside Tabs */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(() => {
                    const popularItemIds = ['ty-01', 'nd-01', 'sk-02', 'sk-01'];
                    const isVisibleItem = (item: MenuItem) => {
                      const cat = categories.find(c => c.id === item.category);
                      return !cat || cat.showOnCustomerPage !== false;
                    };
                    let popularItems = menuItems.filter(item => popularItemIds.includes(item.id) && isVisibleItem(item));
                    if (popularItems.length === 0) {
                      popularItems = menuItems.filter(isVisibleItem).slice(0, 4);
                    }
                    
                    const badges: { [key: string]: string[] } = {
                      zh: ['🔥 點食率最高', '🌟 鎮店招牌', '👍 大受好評', '🍺 宵夜首選'],
                      en: ['🔥 Top Choice', '🌟 Chef Special', '👍 Highly Rated', '🍺 Midnight Best'],
                      ja: ['🔥 一番人気', '🌟 看板メニュー', '👍 大好評', '🍺 夜食定番'],
                      ko: ['🔥 최고 인기', '🌟 시그니처', '👍 극찬 요리', '🍺 야식 추천'],
                      th: ['🔥 เมนูฮิต', '🌟 จานเด็ด', '👍 แนะนำ', '🍺 ยอดนิยม']
                    };

                    return popularItems.map((item, idx) => {
                      const badgeText = badges[currentLang] ? badges[currentLang][idx % 4] : badges['zh'][idx % 4];
                      return (
                        <div
                          key={item.id}
                          className="bg-[#161616] border border-white/5 rounded-2xl p-3.5 flex flex-col md:flex-row gap-3 shadow-md hover:border-[#E5B453]/30 transition group"
                        >
                          {/* Image block */}
                          <div 
                            onClick={() => setSelectedDetailItem(item)}
                            className="w-full md:w-28 h-28 rounded-xl overflow-hidden relative shrink-0 cursor-pointer"
                          >
                            <img
                              src={item.image}
                              alt={item.name[currentLang]}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-[#E5B453] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#E5B453]/20">
                              {badgeText}
                            </span>
                          </div>

                          {/* Meta info & Action */}
                          <div className="flex-1 flex flex-col justify-between text-left space-y-2">
                            <div className="space-y-1">
                              <h6 
                                onClick={() => setSelectedDetailItem(item)}
                                className="font-bold text-white text-sm hover:text-[#E5B453] cursor-pointer transition line-clamp-1"
                              >
                                {item.name[currentLang]}
                              </h6>
                              <p className="text-[11px] text-white/50 line-clamp-2 md:line-clamp-1">
                                {item.description[currentLang]}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-sm font-bold text-[#E5B453] font-mono">
                                NT$ {item.price}
                              </span>

                              <div className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedDetailItem(item)}
                                  className="bg-white/5 hover:bg-white/10 text-white/80 font-black text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition active:scale-95 border border-white/10"
                                >
                                  {isOpen ? '詳情/調整' : '點擊瀏覽'}
                                </button>
                                {isOpen && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickAddToCart(item)}
                                    className="bg-[#E5B453] hover:bg-[#F0C46B] text-[#0F0F0F] font-black text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition active:scale-95 shadow-md shadow-[#E5B453]/10"
                                  >
                                    直接加點
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          ) : (
            /* Normal Best Sellers when loginCount < 2 */
            <>
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white flex items-center space-x-1.5 font-serif tracking-wide text-sm sm:text-base">
                  <Sparkles size={16} className="text-[#E5B453]" />
                  <span>今日熱銷人氣餐點 Top Best-Sellers</span>
                </h5>
                <span className="text-xs text-[#E5B453] bg-[#E5B453]/10 border border-[#E5B453]/20 px-2 py-0.5 rounded font-bold animate-pulse">
                  HOT 🔥
                </span>
              </div>

              <p className="text-xs text-white/50">
                沙貝宵夜場首選人氣絕品，點擊餐點即可看詳情與調整客製，或直接快速加入購物車！
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(() => {
                  const popularItemIds = ['ty-01', 'nd-01', 'sk-02', 'sk-01'];
                  const isVisibleItem = (item: MenuItem) => {
                    const cat = categories.find(c => c.id === item.category);
                    return !cat || cat.showOnCustomerPage !== false;
                  };
                  let popularItems = menuItems.filter(item => popularItemIds.includes(item.id) && isVisibleItem(item));
                  if (popularItems.length === 0) {
                    popularItems = menuItems.filter(isVisibleItem).slice(0, 4);
                  }
                  
                  const badges: { [key: string]: string[] } = {
                    zh: ['🔥 點食率最高', '🌟 鎮店招牌', '👍 大受好評', '🍺 宵夜首選'],
                    en: ['🔥 Top Choice', '🌟 Chef Special', '👍 Highly Rated', '🍺 Midnight Best'],
                    ja: ['🔥 一番人気', '🌟 看板メニュー', '👍 大好評', '🍺 夜食定番'],
                    ko: ['🔥 최고 인기', '🌟 시그니처', '👍 극찬 요리', '🍺 야식 추천'],
                    th: ['🔥 เมนูฮิต', '🌟 จานเด็ด', '👍 แนะนำ', '🍺 ยอดนิยม']
                  };

                  return popularItems.map((item, idx) => {
                    const badgeText = badges[currentLang] ? badges[currentLang][idx % 4] : badges['zh'][idx % 4];
                    return (
                      <div
                        key={item.id}
                        className="bg-[#161616] border border-white/5 rounded-2xl p-3.5 flex flex-col md:flex-row gap-3 shadow-md hover:border-[#E5B453]/30 transition group"
                      >
                        {/* Image block */}
                        <div 
                          onClick={() => setSelectedDetailItem(item)}
                          className="w-full md:w-28 h-28 rounded-xl overflow-hidden relative shrink-0 cursor-pointer"
                        >
                          <img
                            src={item.image}
                            alt={item.name[currentLang]}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-[#E5B453] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#E5B453]/20">
                            {badgeText}
                          </span>
                        </div>

                        {/* Meta info & Action */}
                        <div className="flex-1 flex flex-col justify-between text-left space-y-2">
                          <div className="space-y-1">
                            <h6 
                              onClick={() => setSelectedDetailItem(item)}
                              className="font-bold text-white text-sm hover:text-[#E5B453] cursor-pointer transition line-clamp-1"
                            >
                              {item.name[currentLang]}
                            </h6>
                            <p className="text-[11px] text-white/50 line-clamp-2 md:line-clamp-1">
                              {item.description[currentLang]}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm font-bold text-[#E5B453] font-mono">
                              NT$ {item.price}
                            </span>

                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedDetailItem(item)}
                                className="bg-white/5 hover:bg-white/10 text-white/80 font-black text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition active:scale-95 border border-white/10"
                              >
                                {isOpen ? '詳情/調整' : '點擊瀏覽'}
                              </button>
                              {isOpen && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddToCart(item)}
                                  className="bg-[#E5B453] hover:bg-[#F0C46B] text-[#0F0F0F] font-black text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition active:scale-95 shadow-md shadow-[#E5B453]/10"
                                >
                                  直接加點
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
