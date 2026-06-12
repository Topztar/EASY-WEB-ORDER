import { MenuItem, Ingredient, Promotion, Language } from './types';

export const TRANSLATIONS: { [key: string]: { [lang in Language]: string } } = {
  sabayBBQ: {
    zh: '沙貝燒烤 泰式烤肉',
    en: 'Sabay BBQ Thai Barbecue',
    ko: '사바이 바베큐 태국식 바베큐',
    ja: 'サバイ バーベキュー タイ風焼き肉',
    th: 'สบาย บาร์บีคิว หมูกระทะไทย',
  },
  slogan: {
    zh: '正宗泰式碳烤、冬蔭功系列、宵夜首選',
    en: 'Authentic Thai BBQ, Tom Yum & Perfect Late Night Bites',
    ko: '정통 태국식 바베큐, 똠얌 및 심야 꼬치',
    ja: '本格タイ風炭火焼き、トムヤム、深夜の絶品串焼き',
    th: 'บาร์บีคิวไทยแท้, ต้มยำ และอาหารมื้อดึกแสนอร่อย',
  },
  table: { zh: '桌號', en: 'Table', ko: '테이블 번호', ja: 'テーブル番号', th: 'โต๊ะที่' },
  categories: { zh: '菜色分類', en: 'Categories', ko: '메뉴 분류', ja: 'カテゴリー', th: 'หมวดหมู่' },
  addToCart: { zh: '加入購物車', en: 'Add to Cart', ko: '장바구니 담기', ja: 'カートに追加', th: 'ใส่ตะกร้า' },
  customOptions: { zh: '客製化選項', en: 'Custom Options', ko: '맞춤설정 옵션', ja: 'オプション調整', th: 'ตัวเลือกเพิ่มเติม' },
  spicinessLevel: { zh: '辣度調整', en: 'Spiciness', ko: '매운맛 조절', ja: '辛さの調整', th: 'ระดับความเผ็ด' },
  sweetnessLevel: { zh: '甜度調整', en: 'Sweetness', ko: '당도 조절', ja: '甘さの調整', th: 'ระดับความหวาน' },
  noodleOption: { zh: '麵體選擇', en: 'Noodle Option', ko: '면 선택', ja: '麺タイプの選択', th: 'เลือกประเภทเส้น' },
  coconutOption: { zh: '升級奶香冬蔭 (+NT$50)', en: 'Add Coconut Milk (+NT$50)', ko: '코코넛 밀크 추가 (+NT$50)', ja: 'ココナッツミルク追加 (+NT$50)', th: 'เพิ่มน้ำกะทิ (+NT$50)' },
  spiciness: { zh: '辣度', en: 'Spiciness', ko: '매운맛', ja: '辛さ', th: 'ความเผ็ด' },
  sweetness: { zh: '甜度', en: 'Sweetness', ko: '당도', ja: '甘み', th: 'ความหวาน' },
  sauceNote: { zh: '醬料特別備註 (沙貝祕製沾醬)', en: 'Special Sauce Note (Sabay Sauce)', ko: '소스 특별 요청', ja: '特製ソースの要望', th: 'หมายเหตุซอส' },
  lineLogin: { zh: '使用 Google 帳戶登入', en: 'Google Quick Login', ko: 'Google 계정으로 간편 로그인', ja: 'Google ログイン', th: 'เข้าสู่ระบบด้วย Google' },
  checkout: { zh: '進一步結帳', en: 'Proceed to Checkout', ko: '결제하기', ja: 'お会計に進む', th: 'ดำเนินการชำระเงิน' },
  myOrders: { zh: '我的歷史訂單', en: 'My Order History', ko: '내 주문 내역', ja: '注文履歴', th: 'ประวัติการสั่งซื้อ' },
  kitchenStaff: { zh: '廚房後台連線', en: 'Kitchen Display', ko: '주방 화면', ja: '厨房機器システム', th: 'หน้าจอในครัว' },
  dashboard: { zh: '經營分析面板', en: 'Admin Management', ko: '경영 관리 대시보드', ja: '売上管理ダッシュボード', th: 'แผงจัดการร้าน' },
  inventoryTitle: { zh: '原料庫存管理', en: 'Ingredient Stock', ko: '식자재 재고 관리', ja: '原材料の在庫管理', th: 'จัดการคลังวัตถุดิบ' },
  totalPrice: { zh: '總金額', en: 'Total Price', ko: '총 합계 금액', ja: '合計金額', th: 'ราคารวม' },
  orderPlaced: { zh: '訂單成功送出！正在為您準備', en: 'Order Placed! Preparing now...', ko: '주문 완료! 준비가 곧 완료됩니다.', ja: '注文完了！調理が始まりました。', th: 'ส่งออเดอร์แล้ว! กำลังเร่งเตรียมอาหารให้คุณ...' },
  printKitchenTicket: { zh: '列印廚房單 (模擬連線)', en: 'Print Kitchen Ticket', ko: '주방 전표 출력', ja: '伝票印刷', th: 'พิมพ์ใบสั่งงานครัว' },
  memberDiscount: { zh: '已綁定 Google 會員 (點數累積中)', en: 'Google Member Connected (Points Accumulating)', ko: 'Google 회원 연동됨 (포인트 적립 중)', ja: 'Google会員連携（ポイント貯まり中）', th: 'เชื่อมโยงสมาชิก Google แล้ว (สะสมคะแนน)' },
};

export const CAT_NAMES: { [key: string]: { [lang in Language]: string } } = {
  combos: { zh: '優惠折扣 🍱', en: 'Discounts & Combos', ko: '할인 및 세트', ja: '割引・セット', th: 'ส่วนลดและคอมโบ' },
  sides: { zh: '小菜及醬料 🥬', en: 'Sides & Sauces', ko: '반찬 및 소스', ja: '小皿・ソース', th: 'เครื่องเคียงและซอส' },
  skewers: { zh: '原味碳烤肉類 🍢', en: 'Charcoal BBQ Skewers', ko: '오리지널 숯불 꼬치', ja: 'タイ風肉串炭火焼き', th: 'บาร์บีคิวเสียบไม้ย่าง' },
  noodles: { zh: '單人熱麵食 🥢', en: 'Single Noodles', ko: '단품 매운 면 요리', ja: 'お一人様用麺類', th: 'บะหมี่และก๋วยเตี๋ยวจานเดี่ยว' },
  drinks: { zh: '泰特色沁涼飲品 🍹', en: 'Thai Cold Drinks', ko: '태국식 야외 청량 음료', ja: 'タイ風さわやかドリンク', th: 'เครื่องดื่มดับร้อนรสสดชื่น' }
};

export const INITIAL_MENU: MenuItem[] = [
  {
    "id": "dish-2696007842576",
    "category": "drinks",
    "name": {
      "zh": "Vitamilk豆奶",
      "en": "Vitamilk Soy Milk",
      "ko": "비타밀크 두유",
      "ja": "ビタミルク豆乳",
      "th": "นมถั่วเหลืองไวตามิ้ลค์"
    },
    "price": 60.0,
    "image": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2606012021064",
    "category": "drinks",
    "name": {
      "zh": "麒麟啤酒",
      "en": "Kirin Beer",
      "ko": "기린 맥주",
      "ja": "キリンビール",
      "th": "เบียร์คิริน"
    },
    "price": 150.0,
    "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2605122152569",
    "category": "drinks",
    "name": {
      "zh": "SPY泰國雞尾酒",
      "en": "SPY Thai Cocktail",
      "ko": "SPY 태국 칵테일",
      "ja": "SPYタイカクテル",
      "th": "สปายค็อกเทลไทย"
    },
    "price": 110.0,
    "image": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2603132155426",
    "category": "drinks",
    "name": {
      "zh": "D餐贈可哥冰奶",
      "en": "Set D Gift: Cocoa Ice Milk",
      "ko": "D세트 증정: 코코아 아이스 밀크",
      "ja": "Dセット特典: ココアアイスミルク",
      "th": "ของแถมเซต D: โกโก้นมสดเย็น"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2603132154573",
    "category": "drinks",
    "name": {
      "zh": "D餐贈美錄",
      "en": "Set D Gift: Milo",
      "ko": "D세트 증정: 마일로",
      "ja": "Dセット特典: ミロ",
      "th": "ของแถมเซต D: ไมโล"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2603071951301",
    "category": "combos",
    "name": {
      "zh": "乳酪組合價",
      "en": "Cheese Drink Combo Price",
      "ko": "치즈 음료 콤보 가격",
      "ja": "チーズドリンクコンボ価格",
      "th": "ราคาคอมโบเครื่องดื่มชีส"
    },
    "price": -10.0,
    "image": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2602121900078",
    "category": "drinks",
    "name": {
      "zh": "桂花乳酪",
      "en": "Osmanthus Cheese Drink",
      "ko": "계화 치즈 음료",
      "ja": "キンモクセイチーズドリンク",
      "th": "เครื่องดื่มชีสดอกเก๊กฮวย"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2602121834434",
    "category": "skewers",
    "name": {
      "zh": "78.板腱牛5oz",
      "en": "78. Top Blade Beef 5oz",
      "ko": "78. 블레이드 스테이크 5oz",
      "ja": "78. 板筋牛 5oz",
      "th": "78. เนื้อวัวท็อปเบลด 5oz"
    },
    "price": 390.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2601312248029",
    "category": "drinks",
    "name": {
      "zh": "香斕乳酪",
      "en": "Pandan Cheese Drink",
      "ko": "판단 치즈 음료",
      "ja": "パンダンチーズドリンク",
      "th": "เครื่องดื่มชีสใบเตย"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2601312208252",
    "category": "combos",
    "name": {
      "zh": "啤酒10送1",
      "en": "Beer Buy 10 Get 1 Free",
      "ko": "맥주 10+1 이벤트",
      "ja": "ビール10本で1本サービス",
      "th": "ซื้อเบียร์ 10 แถม 1"
    },
    "price": -10.0,
    "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2601310009011",
    "category": "drinks",
    "name": {
      "zh": "鮮奶乳酪",
      "en": "Fresh Milk Cheese Drink",
      "ko": "신선한 우유 치즈 음료",
      "ja": "生乳チーズドリンク",
      "th": "เครื่องดื่มชีสนมสด"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2601310007093",
    "category": "drinks",
    "name": {
      "zh": "泰式奶茶乳酪",
      "en": "Thai Milk Tea Cheese",
      "ko": "태국 밀크티 치즈 음료",
      "ja": "タイミルクティーチーズ",
      "th": "ชีสชาไทย"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2601221743349",
    "category": "drinks",
    "name": {
      "zh": "3支-大摩12年",
      "en": "3-Bottle Dalmore 12 Year",
      "ko": "달모어 12년 3병",
      "ja": "ダルモア12年 3本",
      "th": "ดาลมอร์ 12 ปี 3 ขวด"
    },
    "price": 9000.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2601221741369",
    "category": "drinks",
    "name": {
      "zh": "3支-蘇格登13年",
      "en": "3-Bottle Singleton 13 Year",
      "ko": "싱글톤 13년 3병",
      "ja": "シングルトン13年 3本",
      "th": "ซิงเกิลตัน 13 ปี 3 ขวด"
    },
    "price": 6900.0,
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2601221740072",
    "category": "drinks",
    "name": {
      "zh": "3支-蘇格登12年",
      "en": "3-Bottle Singleton 12 Year",
      "ko": "싱글톤 12년 3병",
      "ja": "シングルトン12年 3本",
      "th": "ซิงเกิลตัน 12 ปี 3 ขวด"
    },
    "price": 5000.0,
    "image": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2601221737270",
    "category": "drinks",
    "name": {
      "zh": "4支-金芬黛葡萄酒14.5%",
      "en": "4-Bottle Zinfandel 14.5%",
      "ko": "진판델 와인 4병 14.5%",
      "ja": "ジンファンデルワイン 4本 14.5%",
      "th": "ไวน์ซินฟานเดล 4 ขวด 14.5%"
    },
    "price": 2400.0,
    "image": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2512111741522",
    "category": "drinks",
    "name": {
      "zh": "分解茶",
      "en": "Digestive Herbal Tea",
      "ko": "소화 허브티",
      "ja": "消化促進ハーブティー",
      "th": "ชาสมุนไพรช่วยย่อย"
    },
    "price": 100.0,
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2511271537570",
    "category": "drinks",
    "name": {
      "zh": "樂天氣泡酒",
      "en": "Lotte Sparkling Wine",
      "ko": "롯데 스파클링 와인",
      "ja": "ロッテスパークリングワイン",
      "th": "ไวน์ผลไม้สปาร์กลิ้งล็อตเต้"
    },
    "price": 280.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2511142143596",
    "category": "sides",
    "name": {
      "zh": "小熊維C棒棒糖",
      "en": "Vitamin C Lollipop",
      "ko": "비타민 C 막대사탕",
      "ja": "ビタミンCキャンディ",
      "th": "ลูกอมวิตามินซี"
    },
    "price": 300.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2511071957264",
    "category": "combos",
    "name": {
      "zh": "客家幣加碼",
      "en": "Hakka Coin Bonus",
      "ko": "하카 코인 추가 적립",
      "ja": "客家コインボーナス",
      "th": "โบนัสเหรียญฮากกา"
    },
    "price": -100.0,
    "image": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2510241901526",
    "category": "noodles",
    "name": {
      "zh": "+mama麵",
      "en": "+ MAMA Noodles Upgrade",
      "ko": "+ 마마 면 업그레이드",
      "ja": "+ MAMA麺 アップグレード",
      "th": "+ อัพเกรดมาม่า"
    },
    "price": 30.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2510101943499",
    "category": "combos",
    "name": {
      "zh": "集點兌換泰奶桶",
      "en": "Points Redeem: Thai Tea Bucket",
      "ko": "포인트 교환: 태국 밀크티 버킷",
      "ja": "ポイント交換: タイミルクティーバケツ",
      "th": "แลกคะแนน: ชาไทยถัง"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2509281752083",
    "category": "skewers",
    "name": {
      "zh": "41.泰鮮大魷魚",
      "en": "41. Thai-Style Giant Squid",
      "ko": "41. 태국식 대형 오징어",
      "ja": "41. タイ風巨大イカ",
      "th": "41. หมึกยักษ์สดสไตล์ไทย"
    },
    "price": 280.0,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2509271759269",
    "category": "noodles",
    "name": {
      "zh": "0.大魷MAMA麵",
      "en": "0. Giant Squid MAMA Noodles",
      "ko": "0. 대왕 오징어 마마 라면",
      "ja": "0. 巨大イカMAMA麺",
      "th": "0. มาม่าหมึกยักษ์"
    },
    "price": 390.0,
    "image": "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2509191634172",
    "category": "drinks",
    "name": {
      "zh": "西貢啤酒",
      "en": "Saigon Beer",
      "ko": "사이공 맥주",
      "ja": "サイゴンビール",
      "th": "เบียร์ไซ่ง่อน"
    },
    "price": 100.0,
    "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508252142113",
    "category": "skewers",
    "name": {
      "zh": "45.雞皮10串",
      "en": "45. Chicken Skin Skewers x10",
      "ko": "45. 닭껍질 꼬치 10개",
      "ja": "45. チキンスキン串 10本",
      "th": "45. เสียบไม้หนังไก่ 10 ไม้"
    },
    "price": 550.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508252141154",
    "category": "skewers",
    "name": {
      "zh": "44.牛5羊5串",
      "en": "44. Mix Beef & Lamb x10",
      "ko": "44. 소고기 5 + 양고기 5 꼬치",
      "ja": "44. 牛羊ミックス串 10本",
      "th": "44. เสียบไม้วัวผสมแกะ 10 ไม้"
    },
    "price": 680.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508252136150",
    "category": "skewers",
    "name": {
      "zh": "43.羊肉10串",
      "en": "43. Lamb Skewers x10",
      "ko": "43. 양고기 꼬치 10개",
      "ja": "43. 羊肉串 10本",
      "th": "43. เสียบไม้เนื้อแกะ 10 ไม้"
    },
    "price": 650.0,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508252133258",
    "category": "skewers",
    "name": {
      "zh": "42.牛肉10串",
      "en": "42. Beef Skewers x10",
      "ko": "42. 소고기 꼬치 10개",
      "ja": "42. 牛肉串 10本",
      "th": "42. เสียบไม้เนื้อวัว 10 ไม้"
    },
    "price": 650.0,
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508252009102",
    "category": "drinks",
    "name": {
      "zh": "57.恐龍美祿",
      "en": "57. Dino Milo",
      "ko": "57. 다이노 마일로",
      "ja": "57. ダイノミロ",
      "th": "57. ไดโนไมโล"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508252008143",
    "category": "drinks",
    "name": {
      "zh": "56.泰式可哥冰奶",
      "en": "56. Thai Cocoa Ice Milk",
      "ko": "56. 태국 코코아 아이스 밀크",
      "ja": "56. タイ風ココアアイスミルク",
      "th": "56. นมโกโก้เย็นไทย"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508252003261",
    "category": "skewers",
    "name": {
      "zh": "40.爆漿泰奶包",
      "en": "40. Thai Milk Tea Lava Bun",
      "ko": "40. 태국 밀크티 용암 빵",
      "ja": "40. タイ風ミルクティー溶岩パン",
      "th": "40. ขนมปังชาไทยไหล"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1527362439-eed8ee0d6f98?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508202144570",
    "category": "drinks",
    "name": {
      "zh": "D餐贈可樂",
      "en": "Set D Gift: Coca-Cola",
      "ko": "D세트 증정: 코카콜라",
      "ja": "Dセット特典: コーラ",
      "th": "ของแถมเซต D: โค้ก"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508202144235",
    "category": "drinks",
    "name": {
      "zh": "D餐贈椰子水",
      "en": "Set D Gift: Coconut Water",
      "ko": "D세트 증정: 코코넛 워터",
      "ja": "Dセット特典: ヤシの実水",
      "th": "ของแถมเซต D: น้ำมะพร้าว"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508202142262",
    "category": "drinks",
    "name": {
      "zh": "D餐贈泰奶",
      "en": "Set D Gift: Thai Milk Tea",
      "ko": "D세트 증정: 태국 밀크티",
      "ja": "Dセット特典: タイミルクティー",
      "th": "ของแถมเซต D: ชาไทย"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508202000500",
    "category": "skewers",
    "name": {
      "zh": "人氣D餐",
      "en": "Popular Set D",
      "ko": "인기 D 세트",
      "ja": "人気Dセット",
      "th": "เซต D ยอดฮิต"
    },
    "price": 1550.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508201955573",
    "category": "skewers",
    "name": {
      "zh": "奢華C餐",
      "en": "Luxury Set C",
      "ko": "럭셔리 C 세트",
      "ja": "ラグジュアリーCセット",
      "th": "เซต C หรูหรา"
    },
    "price": 2160.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508201952121",
    "category": "noodles",
    "name": {
      "zh": "升級套餐",
      "en": "Meal Upgrade",
      "ko": "업그레이드 세트",
      "ja": "セットアップグレード",
      "th": "อัพเกรดเซต"
    },
    "price": 140.0,
    "image": "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508201936503",
    "category": "noodles",
    "name": {
      "zh": "加點A高麗菜",
      "en": "Add-on: Cabbage",
      "ko": "추가 주문: 양배추",
      "ja": "追加オーダー: キャベツ",
      "th": "เพิ่ม: กะหล่ำปลี"
    },
    "price": 30.0,
    "image": "https://images.unsplash.com/photo-1551183053-bf91798d773e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508141908165",
    "category": "combos",
    "name": {
      "zh": "51.泰奶空桶",
      "en": "51. Thai Tea Empty Bucket",
      "ko": "51. 태국 밀크티 빈 버킷",
      "ja": "51. タイミルクティー空バケツ",
      "th": "51. ถังชาไทยเปล่า"
    },
    "price": -30.0,
    "image": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508122113366",
    "category": "noodles",
    "name": {
      "zh": "69.湯加椰奶",
      "en": "69. Add Coconut Milk to Soup",
      "ko": "69. 수프에 코코넛 밀크 추가",
      "ja": "69. スープにココナッツミルク追加",
      "th": "69. เพิ่มกะทิในซุป"
    },
    "price": 50.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508112131059",
    "category": "skewers",
    "name": {
      "zh": "8.娃娃菜2p",
      "en": "8. Baby Cabbage 2pc",
      "ko": "8. 베이비 배추 2개",
      "ja": "8. ミニ白菜 2個",
      "th": "8. ผักกาดเด็ก 2 ชิ้น"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2508112130113",
    "category": "skewers",
    "name": {
      "zh": "32.金針菇豬肉",
      "en": "32. Enoki Mushroom & Pork",
      "ko": "32. 팽이버섯 돼지고기",
      "ja": "32. エノキ豚肉巻き",
      "th": "32. เห็ดเข็มทองหมู"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2507182004409",
    "category": "combos",
    "name": {
      "zh": "客家幣刷卡",
      "en": "Hakka Coin (Card Payment)",
      "ko": "하카 코인 (카드 결제)",
      "ja": "客家コイン (カード払い)",
      "th": "เหรียญฮากกา (ชำระบัตร)"
    },
    "price": -1000.0,
    "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2507072257199",
    "category": "skewers",
    "name": {
      "zh": "招牌A餐",
      "en": "Signature Set A",
      "ko": "시그니처 A 세트",
      "ja": "看板Aセット",
      "th": "เซต A ยอดนิยม"
    },
    "price": 660.0,
    "image": "https://images.unsplash.com/photo-1527362439-eed8ee0d6f98?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2506292231385",
    "category": "drinks",
    "name": {
      "zh": "雪山",
      "en": "Snow Beer",
      "ko": "눈의 산 맥주",
      "ja": "雪山ビール",
      "th": "เบียร์หิมะ"
    },
    "price": 100.0,
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2506182247281",
    "category": "drinks",
    "name": {
      "zh": "金芬黛葡萄酒",
      "en": "Zinfandel Wine",
      "ko": "진판델 와인",
      "ja": "ジンファンデルワイン",
      "th": "ไวน์ซินฟานเดล"
    },
    "price": 800.0,
    "image": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2506132134210",
    "category": "sides",
    "name": {
      "zh": "紅醬外帶瓶",
      "en": "Red Sauce (Takeaway Bottle)",
      "ko": "레드 소스 (테이크아웃 병)",
      "ja": "レッドソース (テイクアウト)",
      "th": "น้ำจิ้มแดง (ขวดพกพา)"
    },
    "price": 150.0,
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2506132131288",
    "category": "sides",
    "name": {
      "zh": "綠醬外帶瓶",
      "en": "Green Sauce (Takeaway Bottle)",
      "ko": "그린 소스 (테이크아웃 병)",
      "ja": "グリーンソース (テイクアウト)",
      "th": "น้ำจิ้มเขียว (ขวดพกพา)"
    },
    "price": 150.0,
    "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2505242017116",
    "category": "skewers",
    "name": {
      "zh": "9.爆汁櫛瓜",
      "en": "9. Juicy Zucchini",
      "ko": "9. 즙이 가득한 애호박",
      "ja": "9. ジューシーズッキーニ",
      "th": "9. ซูกีนีฉ่ำน้ำ"
    },
    "price": 140.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2505041844456",
    "category": "noodles",
    "name": {
      "zh": "74.泰式豬肉.米線",
      "en": "74. Thai Pork Vermicelli",
      "ko": "74. 태국식 돼지고기 쌀국수 (가는면)",
      "ja": "74. タイ風豚肉米麺",
      "th": "74. เส้นหมี่หมูไทย"
    },
    "price": 240.0,
    "image": "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2505041843176",
    "category": "noodles",
    "name": {
      "zh": "73.泰式豬肉.河粉",
      "en": "73. Thai Pork Rice Noodles",
      "ko": "73. 태국식 돼지고기 쌀국수",
      "ja": "73. タイ風豚肉ライスヌードル",
      "th": "73. ก๋วยเตี๋ยวหมูไทย"
    },
    "price": 240.0,
    "image": "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2505041825592",
    "category": "drinks",
    "name": {
      "zh": "50.街頭泰奶1L",
      "en": "50. Street Thai Milk Tea 1L",
      "ko": "50. 길거리 태국 밀크티 1L",
      "ja": "50. ストリートタイミルクティー 1L",
      "th": "50. ชาไทยสตรีท 1L"
    },
    "price": 180.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2505041753253",
    "category": "noodles",
    "name": {
      "zh": "67.海陸牛冬蔭功湯",
      "en": "67. Tom Yum Beef & Seafood",
      "ko": "67. 똠얌 소고기 & 해산물",
      "ja": "67. 牛肉海鮮トムヤム",
      "th": "67. ต้มยำเนื้อทะเล"
    },
    "price": 390.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": false,
    "hasNoodlesOption": true,
    "hasCoconutsMilkOption": true
  },
  {
    "id": "dish-2505041751044",
    "category": "noodles",
    "name": {
      "zh": "66.海陸豬冬蔭功湯",
      "en": "66. Tom Yum Pork & Seafood",
      "ko": "66. 똠얌 돼지고기 & 해산물",
      "ja": "66. 豚肉海鮮トムヤム",
      "th": "66. ต้มยำหมูทะเล"
    },
    "price": 360.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": false,
    "hasNoodlesOption": true,
    "hasCoconutsMilkOption": true
  },
  {
    "id": "dish-2504161837515",
    "category": "skewers",
    "name": {
      "zh": "10.蔬菜拼盤",
      "en": "10. Vegetable Platter",
      "ko": "10. 야채 모둠",
      "ja": "10. 野菜盛り合わせ",
      "th": "10. รวมผัก"
    },
    "price": 260.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2503181902333",
    "category": "skewers",
    "name": {
      "zh": "29.小羊肩排",
      "en": "29. Lamb Shoulder Chop",
      "ko": "29. 어린양 어깨살",
      "ja": "29. ラム肩ロース",
      "th": "29. ซี่โครงแกะ"
    },
    "price": 680.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2503171838086",
    "category": "skewers",
    "name": {
      "zh": "泰式生蠔11p",
      "en": "Thai Raw Oysters 11pc",
      "ko": "태국식 생굴 11개",
      "ja": "タイ風生牡蠣 11個",
      "th": "หอยนางรมสดสไตล์ไทย 11 ตัว"
    },
    "price": 2200.0,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2503171727144",
    "category": "drinks",
    "name": {
      "zh": "柳橙氣泡飲",
      "en": "Orange Sparkling Drink",
      "ko": "오렌지 탄산음료",
      "ja": "オレンジスパークリング",
      "th": "น้ำส้มอัดลม"
    },
    "price": 50.0,
    "image": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2503012218077",
    "category": "combos",
    "name": {
      "zh": "客家幣",
      "en": "Hakka Coin",
      "ko": "하카 코인",
      "ja": "客家コイン",
      "th": "เหรียญฮากกา"
    },
    "price": -1.0,
    "image": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2502252357010",
    "category": "skewers",
    "name": {
      "zh": "多肉B餐",
      "en": "Meaty Set B",
      "ko": "고기 가득 B 세트",
      "ja": "肉盛りBセット",
      "th": "เซต B เนื้อแน่น"
    },
    "price": 460.0,
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2502031821565",
    "category": "drinks",
    "name": {
      "zh": "大摩12年",
      "en": "Dalmore 12 Year",
      "ko": "달모어 12년",
      "ja": "ダルモア 12年",
      "th": "ดาลมอร์ 12 ปี"
    },
    "price": 3200.0,
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2502031820148",
    "category": "drinks",
    "name": {
      "zh": "蘇格登13年",
      "en": "Singleton 13 Year",
      "ko": "싱글톤 13년",
      "ja": "シングルトン 13年",
      "th": "ซิงเกิลตัน 13 ปี"
    },
    "price": 2400.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2502031818015",
    "category": "drinks",
    "name": {
      "zh": "蘇格登12年",
      "en": "Singleton 12 Year",
      "ko": "싱글톤 12년",
      "ja": "シングルトン 12年",
      "th": "ซิงเกิลตัน 12 ปี"
    },
    "price": 1800.0,
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2502012109279",
    "category": "skewers",
    "name": {
      "zh": "6.有機玉米筍",
      "en": "6. Organic Baby Corn",
      "ko": "6. 유기농 미니 옥수수",
      "ja": "6. オーガニックヤングコーン",
      "th": "6. ข้าวโพดอ่อนออร์แกนิก"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1527362439-eed8ee0d6f98?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2502012029386",
    "category": "skewers",
    "name": {
      "zh": "11.澎湖花枝丸",
      "en": "11. Penghu Squid Balls",
      "ko": "11. 펑후 오징어볼",
      "ja": "11. 澎湖イカボール",
      "th": "11. ลูกชิ้นหมึกเผิงหู"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2501261510560",
    "category": "sides",
    "name": {
      "zh": "百香果青木瓜",
      "en": "Passion Fruit Green Papaya Salad",
      "ko": "패션프루트 그린 파파야 샐러드",
      "ja": "パッションフルーツグリーンパパイヤ",
      "th": "มะละกอดิบผลเสาวรส"
    },
    "price": 60.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2501142131426",
    "category": "skewers",
    "name": {
      "zh": "1.爽脆高麗菜",
      "en": "1. Crispy Cabbage",
      "ko": "1. 아삭한 양배추",
      "ja": "1. さっぱりキャベツ",
      "th": "1. กะหล่ำปลีกรอบ"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2412022102224",
    "category": "drinks",
    "name": {
      "zh": "58.炭燒奶茶(壺)",
      "en": "58. Charcoal Milk Tea (Pot)",
      "ko": "58. 숯불 밀크티 (포트)",
      "ja": "58. 炭火焼きミルクティー (ポット)",
      "th": "58. ชานมถ่าน (กา)"
    },
    "price": 180.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2412021741257",
    "category": "sides",
    "name": {
      "zh": "49.泰辣醬",
      "en": "49. Thai Chilli Sauce",
      "ko": "49. 태국식 칠리 소스",
      "ja": "49. タイ風チリソース",
      "th": "49. น้ำพริกไทย"
    },
    "price": 10.0,
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2412021734433",
    "category": "skewers",
    "name": {
      "zh": "17.手撕魷魚幹",
      "en": "17. Hand-Torn Dried Squid",
      "ko": "17. 손으로 찢은 말린 오징어",
      "ja": "17. 手裂きイカの干物",
      "th": "17. ปลาหมึกแห้งฉีกมือ"
    },
    "price": 390.0,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2412021733504",
    "category": "skewers",
    "name": {
      "zh": "18.炙燒幹貝3P",
      "en": "18. Seared Scallops 3pc",
      "ko": "18. 구운 가리비 3개",
      "ja": "18. 炙りホタテ 3個",
      "th": "18. หอยเชลล์ย่าง 3 ตัว"
    },
    "price": 390.0,
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2412021732545",
    "category": "skewers",
    "name": {
      "zh": "16.泰辣扇貝9P",
      "en": "16. Thai Spicy Scallops 9pc",
      "ko": "16. 태국식 매운 가리비 9개",
      "ja": "16. タイ風辛口ホタテ 9個",
      "th": "16. หอยเชลล์เผ็ดไทย 9 ตัว"
    },
    "price": 360.0,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": false
  },
  {
    "id": "dish-2412021732071",
    "category": "skewers",
    "name": {
      "zh": "15.大草蝦6P",
      "en": "15. Tiger Prawns 6pc",
      "ko": "15. 왕새우 6개",
      "ja": "15. 大海老 6本",
      "th": "15. กุ้งแม่น้ำ 6 ตัว"
    },
    "price": 360.0,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2411142306093",
    "category": "drinks",
    "name": {
      "zh": "60.泰醇奶酒5.6%",
      "en": "60. Thai Cream Liqueur 5.6%",
      "ko": "60. 태국 크림 리큐어 5.6%",
      "ja": "60. タイクリームリキュール 5.6%",
      "th": "60. ไวน์นม 5.6%"
    },
    "price": 380.0,
    "image": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2411142303467",
    "category": "drinks",
    "name": {
      "zh": "59.泰醇奶酒1.4%",
      "en": "59. Thai Cream Liqueur 1.4%",
      "ko": "59. 태국 크림 리큐어 1.4%",
      "ja": "59. タイクリームリキュール 1.4%",
      "th": "59. ไวน์นม 1.4%"
    },
    "price": 280.0,
    "image": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2411142030288",
    "category": "drinks",
    "name": {
      "zh": "果汁氣泡水",
      "en": "Juice Sparkling Water",
      "ko": "주스 탄산수",
      "ja": "ジュース炭酸水",
      "th": "น้ำอัดลมผลไม้"
    },
    "price": 100.0,
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2411142028551",
    "category": "drinks",
    "name": {
      "zh": "海尼根",
      "en": "Heineken",
      "ko": "하이네켄",
      "ja": "ハイネケン",
      "th": "ไฮเนเก้น"
    },
    "price": 150.0,
    "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2411112029373",
    "category": "skewers",
    "name": {
      "zh": "34.熱狗豬血糕",
      "en": "34. Hot Dog & Blood Cake",
      "ko": "34. 핫도그 돼지 선지떡",
      "ja": "34. ホットドッグ豚血餅",
      "th": "34. ไส้กรอกและข้าวเหนียวดำ"
    },
    "price": 70.0,
    "image": "https://images.unsplash.com/photo-1527362439-eed8ee0d6f98?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2411091621575",
    "category": "drinks",
    "name": {
      "zh": "可樂娜",
      "en": "Corona",
      "ko": "코로나",
      "ja": "コロナ",
      "th": "โคโรน่า"
    },
    "price": 150.0,
    "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2411042135298",
    "category": "combos",
    "name": {
      "zh": "tip",
      "en": "Tip / Gratuity",
      "ko": "팁",
      "ja": "チップ",
      "th": "ทิปพนักงาน"
    },
    "price": 10.0,
    "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2410270119261",
    "category": "drinks",
    "name": {
      "zh": "白鶴清酒",
      "en": "Hakutsuru Sake",
      "ko": "하쿠쓰루 사케",
      "ja": "白鶴清酒",
      "th": "สาเกฮาคุสึรุ"
    },
    "price": 350.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2410132030420",
    "category": "drinks",
    "name": {
      "zh": "愛之味麥茶",
      "en": "I-Mei Barley Tea",
      "ko": "아이메이 보리차",
      "ja": "愛之味麦茶",
      "th": "ชาข้าวบาร์เลย์"
    },
    "price": 100.0,
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2410022148358",
    "category": "drinks",
    "name": {
      "zh": "百威",
      "en": "Budweiser",
      "ko": "버드와이저",
      "ja": "バドワイザー",
      "th": "บัดไวเซอร์"
    },
    "price": 150.0,
    "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2409232044239",
    "category": "noodles",
    "name": {
      "zh": "68.牛小排冬蔭功湯",
      "en": "68. Tom Yum Short Rib",
      "ko": "68. 똠얌 소 갈비",
      "ja": "68. 牛ショートリブトムヤム",
      "th": "68. ต้มยำซี่โครงสั้น"
    },
    "price": 620.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": false,
    "hasNoodlesOption": true,
    "hasCoconutsMilkOption": true
  },
  {
    "id": "dish-2409232043478",
    "category": "noodles",
    "name": {
      "zh": "76.泰式牛小排.米線",
      "en": "76. Thai Short Rib Vermicelli",
      "ko": "76. 태국식 소 갈비 쌀국수 (가는면)",
      "ja": "76. タイ風牛ショートリブ米麺",
      "th": "76. เส้นหมี่ซี่โครงสั้นไทย"
    },
    "price": 620.0,
    "image": "https://images.unsplash.com/photo-1551183053-bf91798d773e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2409232042549",
    "category": "noodles",
    "name": {
      "zh": "75.泰式牛小排.河粉",
      "en": "75. Thai Short Rib Rice Noodles",
      "ko": "75. 태국식 소 갈비 쌀국수",
      "ja": "75. タイ風牛ショートリブライスヌードル",
      "th": "75. ก๋วยเตี๋ยวซี่โครงสั้นไทย"
    },
    "price": 620.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2409232024040",
    "category": "skewers",
    "name": {
      "zh": "泰式生蠔3p",
      "en": "Thai Raw Oysters 3pc",
      "ko": "태국식 생굴 3개",
      "ja": "タイ風生牡蠣 3個",
      "th": "หอยนางรมสดสไตล์ไทย 3 ตัว"
    },
    "price": 660.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2409131907512",
    "category": "drinks",
    "name": {
      "zh": "冰水(大)",
      "en": "Iced Water (Large)",
      "ko": "얼음물 (대)",
      "ja": "氷水 (大)",
      "th": "น้ำแข็ง (ใหญ่)"
    },
    "price": 100.0,
    "image": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2408192006066",
    "category": "combos",
    "name": {
      "zh": "開瓶費1支",
      "en": "Corkage Fee (1 Bottle)",
      "ko": "코키지 (1병)",
      "ja": "コルキッジ (1本)",
      "th": "ค่าเปิดขวด (1 ขวด)"
    },
    "price": 500.0,
    "image": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2408191941429",
    "category": "skewers",
    "name": {
      "zh": "33.酸肉冬粉腸",
      "en": "33. Sour Pork Glass Noodle Sausage",
      "ko": "33. 신맛 돼지고기 당면 소시지",
      "ja": "33. 酸味豚肉春雨ソーセージ",
      "th": "33. ไส้กรอกหมูเปรี้ยววุ้นเส้น"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2407231815553",
    "category": "combos",
    "name": {
      "zh": "好友折扣",
      "en": "Friend Discount",
      "ko": "친구 할인",
      "ja": "友人割引",
      "th": "ส่วนลดเพื่อน"
    },
    "price": -10.0,
    "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "超值優惠組合，物超所值，限時享用",
      "en": "Great value combo deals, enjoy the savings while they last",
      "ko": "가성비 최고의 콤보 혜택, 기간 한정 특별 가격",
      "ja": "お得な組み合わせで最高のコスパ、期間限定価格",
      "th": "คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2305152126508",
    "category": "skewers",
    "name": {
      "zh": "30.小羔羊肋",
      "en": "30. Lamb Rib Skewer",
      "ko": "30. 어린양 갈비 꼬치",
      "ja": "30. ラムリブ串",
      "th": "30. ซี่โครงลูกแกะ"
    },
    "price": 70.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2304041737306",
    "category": "drinks",
    "name": {
      "zh": "54.果肉椰子水",
      "en": "54. Coconut Water with Pulp",
      "ko": "54. 과육 코코넛 워터",
      "ja": "54. 果肉入りコナッツウォーター",
      "th": "54. น้ำมะพร้าวเนื้อ"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2303301719168",
    "category": "skewers",
    "name": {
      "zh": "20.泰式生蠔1P",
      "en": "20. Thai Raw Oyster 1pc",
      "ko": "20. 태국식 생굴 1개",
      "ja": "20. タイ風生牡蠣 1個",
      "th": "20. หอยนางรมสดสไตล์ไทย 1 ตัว"
    },
    "price": 250.0,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2302272107257",
    "category": "drinks",
    "name": {
      "zh": "勝獅",
      "en": "Singha Beer",
      "ko": "싱하 맥주",
      "ja": "シンハービール",
      "th": "เบียร์สิงห์"
    },
    "price": 110.0,
    "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2302162152176",
    "category": "drinks",
    "name": {
      "zh": "泰象",
      "en": "Chang Beer",
      "ko": "창 맥주",
      "ja": "チャンビール",
      "th": "เบียร์ช้าง"
    },
    "price": 110.0,
    "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2211162026366",
    "category": "skewers",
    "name": {
      "zh": "7.秋葵(季節)",
      "en": "7. Okra (Seasonal)",
      "ko": "7. 오크라 (계절)",
      "ja": "7. オクラ (旬)",
      "th": "7. กระเจี๊ยบเขียว (ตามฤดูกาล)"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2209081804158",
    "category": "noodles",
    "name": {
      "zh": "72.泰式海鮮.米線",
      "en": "72. Thai Seafood Vermicelli",
      "ko": "72. 태국식 해산물 쌀국수 (가는면)",
      "ja": "72. タイ風海鮮米麺",
      "th": "72. เส้นหมี่ทะเลไทย"
    },
    "price": 240.0,
    "image": "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2209081753180",
    "category": "skewers",
    "name": {
      "zh": "26.牛小排-5oz",
      "en": "26. Short Rib 5oz",
      "ko": "26. 소 갈비 5oz",
      "ja": "26. 牛ショートリブ 5oz",
      "th": "26. ซี่โครงสั้น 5oz"
    },
    "price": 590.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2209081751117",
    "category": "skewers",
    "name": {
      "zh": "21.特大七裏香",
      "en": "21. XL Chicken Oysters",
      "ko": "21. 특대 닭 굴살",
      "ja": "21. 特大チキンオイスター",
      "th": "21. เนื้อไก่ตะโพก XL"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2208121916271",
    "category": "sides",
    "name": {
      "zh": "46.辣椒粉",
      "en": "46. Chilli Powder",
      "ko": "46. 고춧가루",
      "ja": "46. チリパウダー",
      "th": "46. พริกป่น"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2208121912457",
    "category": "noodles",
    "name": {
      "zh": "71.泰式海鮮.河粉",
      "en": "71. Thai Seafood Rice Noodles",
      "ko": "71. 태국식 해산물 쌀국수",
      "ja": "71. タイ風海鮮ライスヌードル",
      "th": "71. ก๋วยเตี๋ยวทะเลไทย"
    },
    "price": 240.0,
    "image": "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2208071821298",
    "category": "skewers",
    "name": {
      "zh": "38.泰酥豆皮",
      "en": "38. Thai Crispy Tofu Skin",
      "ko": "38. 태국식 바삭한 두부피",
      "ja": "38. タイ風カリカリ湯葉",
      "th": "38. เต้าหู้ฉาบกรอบสไตล์ไทย"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1527362439-eed8ee0d6f98?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2208071820475",
    "category": "skewers",
    "name": {
      "zh": "13.月亮蝦餅",
      "en": "13. Moon Shrimp Cake",
      "ko": "13. 월남 새우전",
      "ja": "13. 月型エビ餅",
      "th": "13. แผ่นกุ้งทอด"
    },
    "price": 320.0,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2208071816553",
    "category": "noodles",
    "name": {
      "zh": "64.玉米濃湯",
      "en": "64. Corn Chowder",
      "ko": "64. 옥수수 크림수프",
      "ja": "64. コーンポタージュ",
      "th": "64. ซุปข้าวโพด"
    },
    "price": 160.0,
    "image": "https://images.unsplash.com/photo-1551183053-bf91798d773e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122341556",
    "category": "noodles",
    "name": {
      "zh": "65.海鮮冬蔭功湯",
      "en": "65. Tom Yum Seafood Soup",
      "ko": "65. 똠얌 해산물 수프",
      "ja": "65. 海鮮トムヤムスープ",
      "th": "65. ต้มยำทะเล"
    },
    "price": 260.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": false,
    "hasNoodlesOption": true,
    "hasCoconutsMilkOption": true
  },
  {
    "id": "dish-2207122341013",
    "category": "noodles",
    "name": {
      "zh": "77.越南鮮牛肉河粉",
      "en": "77. Vietnamese Rare Beef Pho",
      "ko": "77. 베트남 신선한 소고기 쌀국수",
      "ja": "77. ベトナム風フォー (生牛肉)",
      "th": "77. เฝอเนื้อวัวสดเวียดนาม"
    },
    "price": 250.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122338495",
    "category": "noodles",
    "name": {
      "zh": "62.紫菜蛋花湯",
      "en": "62. Seaweed Egg Drop Soup",
      "ko": "62. 해초 계란 탕",
      "ja": "62. 海苔かき玉スープ",
      "th": "62. ซุปสาหร่ายไข่ตุ๋น"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122336248",
    "category": "noodles",
    "name": {
      "zh": "63.鮮味蛤蜊湯",
      "en": "63. Fresh Clam Soup",
      "ko": "63. 신선한 조개 수프",
      "ja": "63. あさり出汁スープ",
      "th": "63. ซุปหอยลาย"
    },
    "price": 150.0,
    "image": "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122331502",
    "category": "drinks",
    "name": {
      "zh": "金牌",
      "en": "Gold Medal Beer (Taiwan Beer)",
      "ko": "금메달 맥주",
      "ja": "金牌ビール",
      "th": "เบียร์โกลด์เมดัล"
    },
    "price": 100.0,
    "image": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122330338",
    "category": "drinks",
    "name": {
      "zh": "金樽",
      "en": "Jinzun Beer",
      "ko": "진준 맥주",
      "ja": "金樽ビール",
      "th": "เบียร์จินจุน"
    },
    "price": 150.0,
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122323590",
    "category": "drinks",
    "name": {
      "zh": "55.可口可樂",
      "en": "55. Coca-Cola",
      "ko": "55. 코카콜라",
      "ja": "55. コカ・コーラ",
      "th": "55. โค้ก"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122322371",
    "category": "drinks",
    "name": {
      "zh": "52.泰式奶茶400ml",
      "en": "52. Thai Milk Tea 400ml",
      "ko": "52. 태국 밀크티 400ml",
      "ja": "52. タイミルクティー 400ml",
      "th": "52. ชาไทย 400ml"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "沁涼消暑，口感清爽，搭配燒烤絕配",
      "en": "Refreshing and cool, a perfect match for BBQ",
      "ko": "시원하고 상쾌한 음료로 바베큐와 완벽한 조화",
      "ja": "冷たくさわやか、BBQに最高の組み合わせ",
      "th": "เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122316233",
    "category": "sides",
    "name": {
      "zh": "特製辣椒醬(外帶)",
      "en": "Special Chilli Sauce (Takeaway)",
      "ko": "특제 칠리 소스 (테이크아웃)",
      "ja": "特製チリソース (テイクアウト)",
      "th": "น้ำจิ้มพริกพิเศษ (พกพา)"
    },
    "price": 160.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122312525",
    "category": "sides",
    "name": {
      "zh": "47.泰式綠醬",
      "en": "47. Thai Green Sauce",
      "ko": "47. 태국식 그린 소스",
      "ja": "47. タイ風グリーンソース",
      "th": "47. น้ำจิ้มเขียวไทย"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122311467",
    "category": "sides",
    "name": {
      "zh": "48.泰式紅醬",
      "en": "48. Thai Red Sauce",
      "ko": "48. 태국식 레드 소스",
      "ja": "48. タイ風レッドソース",
      "th": "48. น้ำจิ้มแดงไทย"
    },
    "price": 0.0,
    "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "精心調製，口感層次豐富，為您的餐點添彩",
      "en": "Carefully crafted with rich flavors to complement your meal",
      "ko": "정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다",
      "ja": "丁寧に仕上げた豊かな風味で食事に彩りを添える",
      "th": "ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร"
    },
    "available": false,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122252395",
    "category": "skewers",
    "name": {
      "zh": "2.四季豆",
      "en": "2. Green Beans",
      "ko": "2. 강낭콩",
      "ja": "2. インゲン豆",
      "th": "2. ถั่วแขก"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122141316",
    "category": "skewers",
    "name": {
      "zh": "37.新竹貢丸",
      "en": "37. Hsinchu Pork Meatball",
      "ko": "37. 신주 돼지고기 미트볼",
      "ja": "37. 新竹豚肉つみれ",
      "th": "37. ลูกชิ้นหมูซินจู"
    },
    "price": 60.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122140364",
    "category": "skewers",
    "name": {
      "zh": "12.澎澎甜不辣",
      "en": "12. Tempura Fish Cake",
      "ko": "12. 어묵 튀김",
      "ja": "12. さつま揚げ",
      "th": "12. ทอดมันปลา"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122132048",
    "category": "skewers",
    "name": {
      "zh": "19.鯖甘魚下巴",
      "en": "19. Yellowtail Fish Jaw",
      "ko": "19. 방어 턱살",
      "ja": "19. ブリのカマ",
      "th": "19. คางปลาฮามาจิ"
    },
    "price": 390.0,
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122058577",
    "category": "skewers",
    "name": {
      "zh": "22.烤雞翅-4p",
      "en": "22. Grilled Chicken Wings 4pc",
      "ko": "22. 구운 닭날개 4개",
      "ja": "22. 焼きチキンウィング 4本",
      "th": "22. ปีกไก่ย่าง 4 ชิ้น"
    },
    "price": 160.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122056269",
    "category": "skewers",
    "name": {
      "zh": "27.泰式手工牛",
      "en": "27. Thai Handmade Beef Skewer",
      "ko": "27. 태국식 수제 소고기 꼬치",
      "ja": "27. タイ風手作り牛肉串",
      "th": "27. เสียบไม้เนื้อวัวทำมือสไตล์ไทย"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122053275",
    "category": "skewers",
    "name": {
      "zh": "35.噴水香腸",
      "en": "35. Juicy Taiwanese Sausage",
      "ko": "35. 즙이 나오는 대만 소시지",
      "ja": "35. ジューシー台湾ソーセージ",
      "th": "35. ไส้อั่วไต้หวันฉ่ำน้ำ"
    },
    "price": 60.0,
    "image": "https://images.unsplash.com/photo-1527362439-eed8ee0d6f98?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122051592",
    "category": "skewers",
    "name": {
      "zh": "25.啃的雞皮",
      "en": "25. Crispy Chicken Skin",
      "ko": "25. 바삭한 닭껍질",
      "ja": "25. パリパリチキンスキン",
      "th": "25. หนังไก่กรอบ"
    },
    "price": 60.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2207122037251",
    "category": "skewers",
    "name": {
      "zh": "23.去骨雞腿8兩",
      "en": "23. Boneless Chicken Leg 300g",
      "ko": "23. 뼈 없는 닭다리 300g",
      "ja": "23. 骨なし鶏もも 300g",
      "th": "23. น่องไก่ไม่มีกระดูก 300g"
    },
    "price": 160.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-2005282340194",
    "category": "noodles",
    "name": {
      "zh": "70.海鮮mama麵",
      "en": "70. Seafood MAMA Noodles",
      "ko": "70. 해산물 마마 라면",
      "ja": "70. 海鮮MAMA麺",
      "th": "70. มาม่าทะเล"
    },
    "price": 190.0,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "道地泰式風味湯麵，濃郁湯底暖心暖胃",
      "en": "Authentic Thai-style soup noodles with rich, warming broth",
      "ko": "정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다",
      "ja": "本格タイ風スープ麺、濃厚なスープで体が温まる",
      "th": "ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-1909192003211",
    "category": "skewers",
    "name": {
      "zh": "5.杏鮑菇",
      "en": "5. King Oyster Mushroom",
      "ko": "5. 새송이버섯",
      "ja": "5. エリンギ",
      "th": "5. เห็ดเป๋าฮื้อ"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-1909191959076",
    "category": "skewers",
    "name": {
      "zh": "14.秋刀魚2p",
      "en": "14. Pacific Saury 2pc",
      "ko": "14. 꽁치 2개",
      "ja": "14. サンマ 2本",
      "th": "14. ปลาแมคเคอเรล 2 ชิ้น"
    },
    "price": 320.0,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": true,
    "isNotSpicy": true
  },
  {
    "id": "dish-1909191946205",
    "category": "skewers",
    "name": {
      "zh": "4.香菇",
      "en": "4. Shiitake Mushroom",
      "ko": "4. 표고버섯",
      "ja": "4. 椎茸",
      "th": "4. เห็ดหอม"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-1909191945086",
    "category": "skewers",
    "name": {
      "zh": "3.青椒",
      "en": "3. Green Bell Pepper",
      "ko": "3. 청피망",
      "ja": "3. ピーマン",
      "th": "3. พริกหวานเขียว"
    },
    "price": 80.0,
    "image": "https://images.unsplash.com/photo-1527362439-eed8ee0d6f98?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-1909191943297",
    "category": "skewers",
    "name": {
      "zh": "36.精選肥腸",
      "en": "36. Premium Pork Intestine",
      "ko": "36. 프리미엄 돼지 대창",
      "ja": "36. 厳選豚の大腸",
      "th": "36. ลำไส้หมูคัดพิเศษ"
    },
    "price": 60.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-1909191940395",
    "category": "skewers",
    "name": {
      "zh": "28.原塊牛肋",
      "en": "28. Whole Beef Rib",
      "ko": "28. 통 소갈비",
      "ja": "28. 塊牛バラ",
      "th": "28. ซี่โครงวัวชิ้นใหญ่"
    },
    "price": 70.0,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": true,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-1909191316572",
    "category": "skewers",
    "name": {
      "zh": "24.肉雞七裏香",
      "en": "24. Chicken Oyster Skewers",
      "ko": "24. 닭 굴살 꼬치",
      "ja": "24. チキンオイスター串",
      "th": "24. เนื้อไก่ตะโพกเสียบไม้"
    },
    "price": 70.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": false,
    "containsSeafood": false,
    "isNotSpicy": true
  },
  {
    "id": "dish-1909191310334",
    "category": "skewers",
    "name": {
      "zh": "31.香菜豬肉捲",
      "en": "31. Coriander Pork Roll",
      "ko": "31. 고수 돼지고기 롤",
      "ja": "31. パクチー豚肉ロール",
      "th": "31. หมูม้วนผักชี"
    },
    "price": 90.0,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400",
    "description": {
      "zh": "炭火慢烤，香氣四溢，每一口都是極致美味",
      "en": "Slowly grilled over charcoal, bursting with aroma and flavor",
      "ko": "숯불에 천천히 구워 향이 진하고 맛이 풍부합니다",
      "ja": "炭火でじっくり焼き上げ、香ばしさと旨みが凝縮",
      "th": "ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ"
    },
    "available": true,
    "containsBeef": false,
    "containsPork": true,
    "containsSeafood": false,
    "isNotSpicy": true
  }
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ig-01', name: { zh: '大鮮蝦', en: 'Fresh Prawns', ko: '생새우', ja: '新鮮なえび', th: 'กุ้งแชบ๊วย大' }, stock: 100, minThreshold: 15, unit: 'pcs' },
  { id: 'ig-02', name: { zh: '頂級牛肉串', en: 'USDA Beef', ko: '수제 소고기', ja: '厳選牛肉串', th: 'เนื้อวัวพรีเมียม' }, stock: 100, minThreshold: 20, unit: 'skewers' },
  { id: 'ig-03', name: { zh: '鮮甜高麗菜', en: 'Organic Cabbage', ko: '유기농 양배추', ja: 'キャベツ', th: 'กะหล่ำปลีหวาน' }, stock: 100, minThreshold: 10, unit: 'kg' },
  { id: 'ig-04', name: { zh: '生食干貝/生蠔', en: 'Oysters / Scallops', ko: '석화 굴 및 가리비', ja: '生牡蠣・干貝', th: 'หอยนางรมยักษ์/หอยเชลล์' }, stock: 100, minThreshold: 8, unit: 'pcs' },
  { id: 'ig-05', name: { zh: '多隆功泡麵/米粉', en: 'Mama / Rice Noodles', ko: '라면 사리', ja: 'ラーメン・フォー', th: 'บะหมี่มาม่า/ก๋วยเตี๋ยว' }, stock: 120, minThreshold: 25, unit: 'packs' },
  { id: 'ig-06', name: { zh: '頂級椰奶罐', en: 'Rich Coconut Milk', ko: '코코넛 밀크', ja: 'ココナッツミルク缶', th: 'กะทิกระป๋องออร์แกนิก' }, stock: 100, minThreshold: 12, unit: 'cans' },
  { id: 'ig-07', name: { zh: '泰手標紅茶原料', en: 'Thai Red Tea Brew', ko: '홍차 베이스', ja: 'タイ茶葉', th: 'ชาแดงตรามือเกรดส่งออก' }, stock: 100, minThreshold: 20, unit: 'liters' },
  { id: 'ig-08', name: { zh: '爆香豬五花 / 金針菇', en: 'Pork Belly & Enoki', ko: '돼지 삼겹 및 팽이', ja: '豚バラ・えのき', th: 'หมูสามชั้น/เห็ดเข็มทอง' }, stock: 100, minThreshold: 15, unit: 'skewers' },
];

export const INGREDIENT_RECIPE_MAP: { [foodId: string]: { ingredientId: string; amount: number }[] } = {};

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'pm-01',
    title: { zh: 'Google帳戶限定！消費可累積會員點數', en: 'Google Member Exclusive - Earn Loyalty Points', ko: 'Google 계정 전용! 멤버십 포인트 적립', ja: 'Google 会員限定！ポイント貯まる', th: 'สิทธิพิเศษสมาชิก Google สะสมคะแนนได้ทันที' },
    code: 'SABAYGOOGLEPOINTS',
    discountRate: 1.0,
    description: {
      zh: '凡綁定 Google 帳號登入，在沙貝燒烤手機點餐結帳即可累積點數，不限低消。',
      en: 'Log in with Google to earn loyalty points on every purchase made via your mobile device.',
      ko: '구글 연동 회원 가입 후 주문 시 고유 포인트 자동 적립 혜택',
      ja: 'Googleログインでお会計いただくと、お買い上げ金額總額よりその場でポイント還元。',
      th: 'เข้าสู่ระบบผ่าน Google เพื่อรับคะแนนสะสมพิเศษได้ทุกยอดบิล ไม่มีขั้นต่ำ',
    },
    active: true,
  }
];
