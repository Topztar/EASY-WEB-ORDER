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
  table: {
    zh: '桌號',
    en: 'Table',
    ko: '테이블 번호',
    ja: 'テーブル番号',
    th: 'โต๊ะที่',
  },
  categories: {
    zh: '菜色分類',
    en: 'Categories',
    ko: '메뉴 분류',
    ja: 'カテゴリー',
    th: 'หมวดหมู่',
  },
  addToCart: {
    zh: '加入購物車',
    en: 'Add to Cart',
    ko: '장바구니 담기',
    ja: 'カートに追加',
    th: 'ใส่ตะกร้า',
  },
  customOptions: {
    zh: '客製化選項',
    en: 'Custom Options',
    ko: '맞춤설정 옵션',
    ja: 'オプション調整',
    th: 'ตัวเลือกเพิ่มเติม',
  },
  spicinessLevel: {
    zh: '辣度調整',
    en: 'Spiciness',
    ko: '매운맛 조절',
    ja: '辛さの調整',
    th: 'ระดับความเผ็ด',
  },
  sweetnessLevel: {
    zh: '甜度調整',
    en: 'Sweetness',
    ko: '당도 조절',
    ja: '甘さの調整',
    th: 'ระดับความหวาน',
  },
  noodleOption: {
    zh: '麵體選擇',
    en: 'Noodle Option',
    ko: '면 선택',
    ja: '麺タイプの選択',
    th: 'เลือกประเภทเส้น',
  },
  coconutOption: {
    zh: '升級奶香冬蔭 (+NT$50)',
    en: 'Add Coconut Milk (+NT$50)',
    ko: '코코넛 밀크 추가 (+NT$50)',
    ja: 'ココナッツミルク追加 (+NT$50)',
    th: 'เพิ่มน้ำกะทิ (+NT$50)',
  },
  spiciness: {
    zh: '辣度',
    en: 'Spiciness',
    ko: '매운맛',
    ja: '辛さ',
    th: 'ความเผ็ด',
  },
  sweetness: {
    zh: '甜度',
    en: 'Sweetness',
    ko: '당도',
    ja: '甘み',
    th: 'ความหวาน',
  },
  sauceNote: {
    zh: '醬料特別備註 (沙貝祕製沾醬)',
    en: 'Special Sauce Note (Sabay Sauce)',
    ko: '소스 특별 요청',
    ja: '特製ソースの要望',
    th: 'หมายเหตุซอส',
  },
  lineLogin: {
    zh: '使用 Google 帳戶登入',
    en: 'Google Quick Login',
    ko: 'Google 계정으로 간편 로그인',
    ja: 'Google ログイン',
    th: 'เข้าสู่ระบบด้วย Google',
  },
  checkout: {
    zh: '進一步結帳',
    en: 'Proceed to Checkout',
    ko: '결제하기',
    ja: 'お会計に進む',
    th: 'ดำเนินการชำระเงิน',
  },
  myOrders: {
    zh: '我的歷史訂單',
    en: 'My Order History',
    ko: '내 주문 내역',
    ja: '注文履歴',
    th: 'ประวัติการสั่งซื้อ',
  },
  kitchenStaff: {
    zh: '廚房後台連線',
    en: 'Kitchen Display',
    ko: '주방 화면',
    ja: '厨房機器システム',
    th: 'หน้าจอในครัว',
  },
  dashboard: {
    zh: '經營分析面板',
    en: 'Admin Management',
    ko: '경영 관리 대시보드',
    ja: '売上管理ダッシュボード',
    th: 'แผงจัดการร้าน',
  },
  inventoryTitle: {
    zh: '原料庫存管理',
    en: 'Ingredient Stock',
    ko: '식자재 재고 관리',
    ja: '原材料の在庫管理',
    th: 'จัดการคลังวัตถุดิบ',
  },
  totalPrice: {
    zh: '總金額',
    en: 'Total Price',
    ko: '총 합계 금액',
    ja: '合計金額',
    th: 'ราคารวม',
  },
  orderPlaced: {
    zh: '訂單成功送出！正在為您準備',
    en: 'Order Placed! Preparing now...',
    ko: '주문 완료! 준비가 곧 완료됩니다.',
    ja: '注文完了！調理が始まりました。',
    th: 'ส่งออเดอร์แล้ว! กำลังเร่งเตรียมอาหารให้คุณ...',
  },
  printKitchenTicket: {
    zh: '列印廚房單 (模擬連線)',
    en: 'Print Kitchen Ticket',
    ko: '주방 전표 출력',
    ja: '伝票印刷',
    th: 'พิมพ์ใบสั่งงานครัว',
  },
  memberDiscount: {
    zh: '已綁定 Google 會員 (點數累積中)',
    en: 'Google Member Connected (Points Accumulating)',
    ko: 'Google 회원 연동됨 (포인트 적립 중)',
    ja: 'Google会員連携（ポイント貯まり中）',
    th: 'เชื่อมโยงสมาชิก Google แล้ว (สะสมคะแนน)',
  },
};

export const CAT_NAMES: { [key: string]: { [lang in Language]: string } } = {
  tomyum: {
    zh: '多隆功系列 🍜',
    en: 'Tom Yum Soups',
    ko: '똠얌 수프 시리즈',
    ja: 'トムヤムスープ類',
    th: 'ชุดต้มยำสุดแซ่บ',
  },
  noodles: {
    zh: '單人熱麵食 🥢',
    en: 'Single Noodles',
    ko: '단품 매운 면 요리',
    ja: 'お一人様用麺類',
    th: 'บะหมี่และก๋วยเตี๋ยวจานเดี่ยว',
  },
  combos: {
    zh: '主廚精選套餐 🍱',
    en: 'Signature Meals',
    ko: '시그니처 세트 요리',
    ja: '主理人お得セット',
    th: 'เซตเมนูยอดนิยม Sabay',
  },
  veggies: {
    zh: '小農鮮蔬菜 🥬',
    en: 'Fresh Veggies',
    ko: '신선한 채소 구이',
    ja: '地元新鮮野菜焼き',
    th: 'ผักสดฟาร์มย่าง炭',
  },
  skewers: {
    zh: '原味碳烤肉類 🍢',
    en: 'Charcoal BBQ Skewers',
    ko: '오리지널 숯불 꼬치',
    ja: 'タイ風肉串炭火焼き',
    th: 'บาร์บีคิวเสียบไม้ย่าง',
  },
  seafood: {
    zh: '招牌泰式海鮮 🦐',
    en: 'Thai Seafood BBQ',
    ko: '시그니처 태국식 해산물 구이',
    ja: '本格タイ風炭火焼きシーフード',
    th: 'อาหารทะเลเผาสูตรเด็ด',
  },
  sweets: {
    zh: '泰式特色甜品 🍰',
    en: 'Desserts & Sweets',
    ko: '태국식 달콤 디저트',
    ja: 'タイ風特製デザート',
    th: 'ขนมหวานและพุดดิ้งสูตรพิเศษ',
  },
  drinks: {
    zh: '泰特色沁涼飲品 🍹',
    en: 'Thai Cold Drinks',
    ko: '태국식 야외 청량 음료',
    ja: 'タイ風さわやかドリンク',
    th: 'เครื่องดื่มดับร้อนรสสดชื่น',
  },
};

export const INITIAL_MENU: MenuItem[] = [
  // Tom Yum Series
  {
    id: 'ty-01',
    category: 'tomyum',
    name: {
      zh: '曼谷冬蔭功海鮮湯',
      en: 'Bangkok Tom Yum Seafood Soup',
      ko: '방콕 똠얌꿍 해물탕',
      ja: 'バンコトトムヤムクン海鮮スープ',
      th: 'ต้มยำกุ้งทะเลบางกอก',
    },
    price: 260,
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '酸辣帶勁，融合鮮蝦與新鮮蛤蜊的精緻冬蔭功，椰香馥郁。',
      en: 'A zesty and fiery savory hot soup loaded with fresh prawns, clams, herbs and mushrooms.',
      ko: '신선한 생새우와 조개, 태국 허브가 어우러져 시원하고 매콤한 대표 방콕 똠얌',
      ja: 'タイハーブと新鮮なエビ、ハマグリをふんだんに使用した、マイルドな酸味と奥深い辛さ의特製スープ。',
      th: 'น้ำซุปต้มยำรสแซ่บจัดจ้านถึงเครื่องสมุนไพร ใส่กุ้งสด หอยลาย และเห็ดอย่างดี',
    },
    available: true,
    hasCoconutsMilkOption: true,
  },
  {
    id: 'ty-02',
    category: 'tomyum',
    name: {
      zh: '泰滿足海陸牛肉冬蔭功湯',
      en: 'Signature Seafood & Beef Tom Yum Soup',
      ko: '해물 소고기 똠얌 수프',
      ja: '牛肉・海鮮デラックス トムヤムスープ',
      th: 'ต้มยำทะเลและเนื้อวัวพรีเมียม',
    },
    price: 390,
    image: 'https://images.unsplash.com/photo-1626804475315-9644b37a2fc4?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '頂級雪花牛遇上豐盛海鮮冬蔭湯，海陸夾擊的極致鮮甜饗宴。',
      en: 'Premium short-plate beef slides combined with a rich seafood Tom Yum soup.',
      ko: '인기 가득 차돌소고기와 신선한 해산물이 만나 국물 맛을 배가시킨 똠얌 투 인 원',
      ja: '上質な薄切り牛肉と新鮮なエビが贅沢な極みトムヤムスープで競演。',
      th: 'เนื้อวัวขาลายเกรดพรีเมียมจับคู่กับอาหารทะเลในต้มยำเข้มข้น หอมอร่อยกลมกล่อม',
    },
    available: true,
    hasCoconutsMilkOption: true,
  },

  // Single Noodles
  {
    id: 'nd-01',
    category: 'noodles',
    name: {
      zh: '豪華版海鮮乾拌MAMA麵',
      en: 'Signature Spicy Seafood Mama Noodles',
      ko: '호화 해산물 비빔 마마 라면',
      ja: '豪華シーフード和えMAMA麺',
      th: 'มาม่าแห้งทะเลรวมมิตรภูเขาไฟ',
    },
    price: 390,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '招牌必點！多份草蝦、滿滿蛤蜊拌入泰式經典秘製酸辣乾麵醬。',
      en: 'Loaded with prawns and scallops, dry-tossed in signature secret spicy lime sauce.',
      ko: '가장 핫한 대표 라면! 통통한 초새우와 조개가 듬뿍 버무려져 매콤새콤',
      ja: 'エビ、ホタテがゴロゴロ、極旨ピリ辛レモンソースで香ばしく和えた極上ヌードル。',
      th: 'มาม่าแห้งรสแซ่บ ทะลักด้วยยอดกุ้งสดเนื้อเด้งๆ และพริกสูตรลับของร้าน',
    },
    available: true,
  },
  {
    id: 'nd-02',
    category: 'noodles',
    name: {
      zh: '經典海鮮酸辣湯MAMA麵',
      en: 'Classic Tom Yum Seafood MAMA Noodles Soup',
      ko: '클래식 해물 똠얌 마마 국수',
      ja: 'クラシック トムヤム シーフード MAMAヌードル',
      th: 'มาม่าต้มยำซีฟู้ดออริจินัล',
    },
    price: 180,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '可選河粉或米線。正宗泰式泡麵與酸辣香料的經典湯麵。',
      en: 'Classic tangy pork & shrimp Mama broth. Select Rice Noodles or Vermicelli.',
      ko: '쌀국수 혹은 버미셀리 선택 가능. 시원하고 얼큰한 해산물 스프 국수',
      ja: 'フォーか細麺のライスヌードルを選択可能。代表的なタイトムヤムベースのまろやかそば。',
      th: 'มีเส้นก๋วยเตี๋ยวหรือเส้นหมี่ให้เลือก มาม่าปรุงน้ำข้นออริจินัลนัวสุดๆ',
    },
    available: true,
    hasNoodlesOption: true,
  },

  // Set Meals
  {
    id: 'cb-01',
    category: 'combos',
    name: {
      zh: 'A套餐 $660 人氣招牌盤',
      en: 'Sabay $660 Signature Set A',
      ko: 'A세트 $660 인기 클래식 플레이트',
      ja: 'Aセット $660 定番人気盛り合わせ',
      th: 'ชุดอิ่มฟิน A $660 ยอดฮิตซิกเนเจอร์',
    },
    price: 660,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '美味組合：泰酥豆腐+烤雞翅*4+泰北酸肉冬粉腸+爆汁金針菇豬肉+手工牛肉串+甜不辣+經典泰奶乙杯。',
      en: 'Crispy Tofu, Grilled Chicken Wings, Sausage with Glass Noodles, Mushroom Pork wrap, Beef Skewers, Tempura & Thai Tea.',
      ko: '인기 만점 구성: 타이 크리스피 두부피, 닭날개 구이*4, 이산 소시지 당면순대, 팽이버섯 삼겹말이, 수제 소고기 꼬치, 타이 밀크티 한잔.',
      ja: '本格盛り：揚げ豆腐、手羽先焼き4本、タイ風春雨ソーセージ、金針菇豚巻、特製牛肉串、タイミルクティー1杯。',
      th: 'เซตอร่อยคลาสสิก: เต้าหู้กรอบ, ปีกไก่ย่าง 4 ชิ้น, ไส้กรอกวุ้นเส้นอีสาน, หมูย่างพันเห็ดเข็มทอง, เนื้อเสียบไม้ และ ชาไทย 1 แก้ว',
    },
    available: true,
    isSetMeal: true,
  },
  {
    id: 'cb-02',
    category: 'combos',
    name: {
      zh: 'B套餐 $460 純肉狂歡串',
      en: 'Sabay $460 Meaty Set B',
      ko: 'B세트 $460 고기 러버 플레이트',
      ja: 'Bセット $460 厳選肉フェス串焼き',
      th: 'ชุดราชาเนื้อบาร์บีคิว B $460',
    },
    price: 460,
    image: 'https://images.unsplash.com/photo-1432139548775-87f61ef5975b?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '肉控最愛：香烤雞皮+小羔羊肋串+泰式手工牛肉串+原塊牛肉串+噴水香腸+精選肥腸+雞七里香。',
      en: 'Meaty heaven: Crispy Chicken Skin, Cumin Lamb Skewer, Thai Beef, Rib Skewer, Pork Sausage, Intestine & Chicken Butts.',
      ko: '육즙 가득 소양닭 총집합: 바삭 닭껍질 구이, 양꼬치, 소고기 꼬치, 갈비살 꼬치, 특제 돼지 소시지, 곱창 구이, 닭똥집.',
      ja: 'お肉大好き向け：鶏皮串、羊肉・ラム香ばし串、特製牛肉串、炭火豚ソーセージ、網焼きホルモン、ぼんじり串。',
      th: 'สวรรค์ของคนรักเนื้อ: หนังไก่ย่างกรอบ, ไม้แกะปรุงสไตล์คูมิน, เนื้อวัวเสียบไม้, เสียบเนื้อพรีเมียม, ไส้กรอกย่างหมูซู่ซ่า และ ส่วยตรูดไก่ฟินๆ',
    },
    available: true,
    isSetMeal: true,
  },

  // Fresh Vegetables
  {
    id: 'vg-01',
    category: 'veggies',
    name: {
      zh: '脆脆高麗菜 / 份',
      en: 'Crispy Cabbage',
      ko: '아삭 양배추 구이',
      ja: 'あつあつキャベツ焼き',
      th: 'กะหล่ำปลีย่างน้ำปลาหอม',
    },
    price: 80,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '嚴選小農脆甜高麗菜，碳烤出微微焦香並帶有清甜汁液，美味十足。',
      en: 'Freshly farmed local cabbage grilled over natural wood charcoal to release deep sweet flavors.',
      ko: '바삭하고 달큼한 양배추를 숯불에 구워 불릿과 소스로 감칠맛을 높인 구이',
      ja: '香ばしい甘みが美味しい、地元の契約農家から仕入れたシャキシャキ甘い焼きキャベツ。',
      th: 'กะหล่ำปลีเนื้อหวานคัดพิเศษ ย่างบนเตาจนได้กลิ่นหอมไหม้กระทะและกระเทียมหอมฟุ้ง',
    },
    available: true,
  },
  {
    id: 'vg-02',
    category: 'veggies',
    name: {
      zh: '爆汁櫛瓜 / 份 (限量)',
      en: 'Juicy Grilled Zucchini',
      ko: '육즙 폭발 호박 구이',
      ja: 'ジューシー焼きズッキーニ (数量限定)',
      th: 'ซูชินี่ย่างชุ่มฉ่ำ',
    },
    price: 140,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '每一口都溢出豐沛清甜果汁，泰式祕醬調和後的限量絕品。',
      en: 'Perfectly sliced prime green zucchini, grilled soft while retaining locked juicy sweet nectar.',
      ko: '한입 베어 물면 달콤한 채즙이 쏟아지는 특제 소스 곁들임 한정판 주키니 구이',
      ja: '一口噛めばジュワッと溢れ出る極上の瑞々しさ。特製シーズニングで仕上げた限定お野菜。',
      th: 'ซูชินี่เนื้ออวบ ย่างสุกพอดีสกัดด้วยความหวานธรรมชาติฉ่ำคอ ราดซอสสูตรลับสะท้านลิ้น',
    },
    available: true,
  },
  {
    id: 'vg-03',
    category: 'veggies',
    name: {
      zh: '奶油碳烤杏鮑菇 / 份',
      en: 'Butter Grilled King Oyster Mushroom',
      ko: '버터 새송이버섯 구ი',
      ja: 'エリンギバター炭火焼き',
      th: 'เห็ดออรินจิย่างเนยกระเทียม',
    },
    price: 100,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '厚切杏鮑菇多汁飽滿，刷上滑順香郁奶油與沙貝特調香草海鮮鹽。',
      en: 'Thickly sliced plump king oyster mushroom basted in rich butter and specialty herbs.',
      ko: '도톰한 새송이버섯에 고소한 버터 양념을 발라 구워 풍부한 시그니처 한 꼬치',
      ja: '肉厚でジューシーなエリンギを焦がしバターと塩ハーブで焼き上げました。',
      th: 'เห็ดออรินจิเนื้อหนึบ ย่างเนยหอมฟุ้งจนฉ่ำน้ำรสหวานตามธรรมชาติ',
    },
    available: true,
  },
  {
    id: 'vg-04',
    category: 'veggies',
    name: {
      zh: '鮮脆四季豆 / 串',
      en: 'Grilled Green Beans',
      ko: '아삭 그린빈 꼬치',
      ja: 'シャキシャキいんげん串',
      th: 'ถั่วฝักยาวหมักซอสย่างเตาถ่าน',
    },
    price: 70,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '大火炭烤保留清脆綠意，爽脆多汁，灑上黑胡椒與泰式辛香料。',
      en: 'High-fire grilled green beans preserving natural crunch and flavor, spiced with tellicherry black pepper.',
      ko: '혹시 아삭아삭한 식감이 살아있고 수분감이 가득한 태국풍 꼬투리 꼬치',
      ja: '強火の炭風で一気に焼き上げ、シャキシャキ食感と甘みを引き出したいんげん串。',
      th: 'ถั่วฝักยาวเกรดคัด ย่างพริกไทยเกลือ ให้รสชาติหวานกรอบสดชื่น',
    },
    available: true,
  },
  {
    id: 'vg-05',
    category: 'veggies',
    name: {
      zh: '香脆烤豆皮 / 串',
      en: 'Crispy Grilled Tofu Skin',
      ko: '바삭 구운 두부피 꼬치',
      ja: '香ばし焼き湯葉串',
      th: 'ฟองเต้าหู้ย่างกรอบเสียบไม้',
    },
    price: 45,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '炭火慢烤至表面金黃焦香、爽脆無比，刷上沙貝獨門椒鹽醬汁。',
      en: 'Slow-grilled on charcoal until golden and extra crunchy, brushed with signature peppercorn glaze.',
      ko: '숯불에 앞뒤로 바삭하게 구워내고 감칠맛 도는 허브 간장으로 깔끔히 마무리한 별미',
      ja: '炭火でじっくり熱を入れ外はカリッと、噛むと濃厚な豆のコクが溢れる特製甘辛だれ。',
      th: 'ฟองเต้าหู้บางกรอบสะใจ ย่างเตาถ่านหมักเครื่องเทศเข้มข้น รสชาติหวานมันกรุบกรอบ',
    },
    available: true,
  },
  {
    id: 'vg-06',
    category: 'veggies',
    name: {
      zh: '烤糯米血糕 / 串',
      en: 'Grilled Sticky Rice Blood Cake',
      ko: '쫀득 구운 돼지피 찹쌀떡 꼬치',
      ja: 'もちもち台湾風米血ケーキ串焼き',
      th: 'ข้าวเหนียวดำปรุงรสย่างกะลา',
    },
    price: 45,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '綿密具黏性的口感，醬香濃郁入味，帶有微焦香氣的道地宵夜。',
      en: 'Chewy, flavor-packed sticky rice blood cake grilled with garlic-herb soy sauce.',
      ko: '쫀득쫀득하면서도 특제 마늘 향신료 양념이 깊게 베여 겉바속촉 매력을 뽐내는 대만식 야시장 간식',
      ja: '炭火ならではの香ばしいパリパリ感ともちもち中身。ニンニク香る特製甘辛ソース仕上げ。',
      th: 'ข้าวเหนียวดำชั้นดี ย่างเนยซอสพริกไทยดำ เปลือกนอกกรอบในเหนียวนุ่มโดนใจ',
    },
    available: true,
  },

  // Meat BBQ Skewers
  {
    id: 'sk-01',
    category: 'skewers',
    name: {
      zh: '泰式手工牛肉串 / 串',
      en: 'Handmade Thai Beef Skewer',
      ko: '수제 태국식 소고기 꼬치',
      ja: '特製スパイス牛肉串焼き',
      th: 'เนื้อเสียบไม้ย่างสูตรลับชาววัง Sabay',
    },
    price: 90,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '沙貝祕製調配配方醃製，肉質軟嫩，炭烤出經典泰南辛香風味。',
      en: 'Marinated in custom Southern Thai herbs, charred perfectly on order.',
      ko: '사바이의 비밀 향신료 비법 레시피로 숙성하여 부드러운 육즙 소고기 수제 꼬치',
      ja: '数種類の秘伝ハーブで漬け込んで炭火焼きにした、とても柔らかく旨味の詰まった一串。',
      th: 'เนื้อขาลายสไลด์หมักเครื่องเทศตำรับใต้ นุ่มลิ้น หอมเตาถ่านกะลามะพร้าวแบบพิเศษ',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-02',
    category: 'skewers',
    name: {
      zh: '爆汁金針菇豬肉 / 串',
      en: 'Enoki Mushroom & Pork Wrap',
      ko: '팽이버섯 삼겹살 꼬치',
      ja: '金針菇えのき豚肉巻き',
      th: 'หมูสามชั้นพันเห็ดเข็มทองย่างสะเด็ด',
    },
    price: 90,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '肥瘦相間的特選五花豬包覆飽水金針菇，表皮酥脆、咬下多汁。',
      en: 'Succulent pork belly ribbon tightly wrapped around moisture-rich fresh enoki mushrooms.',
      ko: '삼겹 가득 팽이버섯을 감싸 겉은 바삭하고 속안 식감은 씹을수록 아삭하고 주시한 베스트 꼬치',
      ja: '外側はカリカリに焼いた豚バラ、中は驚くほどジューシーなえのき茸で満たされた人気串。',
      th: 'เบคอนหมูสไลด์เกรดดี ห่อเห็ดเข็มทองอวบน้ำแน่นๆ ย่างจนหนังเบคอนกรอบสนั่นเนื้อในฉ่ำสุดๆ',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-03',
    category: 'skewers',
    name: {
      zh: '小羔羊肋串 / 串',
      en: 'Cumin Premium Lamb Skewer',
      ko: '양꼬치 구이',
      ja: '小羔羊ラム串炭火焼きクミン風味',
      th: 'เนื้อลูกแกะพรีเมียมเสียบไม้ย่างคูมิน',
    },
    price: 95,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '選用紐西蘭優質小羔羊肋脊肉，富含不飽和油脂，肉質細緻、香料氣息濃郁。',
      en: 'New Zealand farm-raised tender lamb ribs skewered and heavily seasoned with roasted cumin seeds.',
      ko: '청정 뉴질랜드 육즙 양고기에 특제 쯔란 씨앗 스파이스를 풍부히 얹은 고단백 갈비살',
      ja: 'ニュージーランド産の高級ラムを使用。特製クミンスパイスがラムの香ばしい脂の旨みを引き立てます。',
      th: 'ลูกแกะนิวซีแลนด์เกรดพรีเมียม ไขมันแทรกนุ่ม ย่างพริกคูมินหอมฟุ้งลอยไปสามบ้าน',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-04',
    category: 'skewers',
    name: {
      zh: '原塊牛肉串 / 串',
      en: 'Premium Beef Cubes Skewer',
      ko: '원육 소고기 주사위 꼬치',
      ja: '極味原塊牛肉サイコロ串焼き',
      th: 'เนื้อสเต็กเต๋าย่างเตาถ่านพรีเมียม',
    },
    price: 90,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '整塊原牛排厚切原味碳烤，撒上黑胡椒與玫瑰鹽，極致醇香有嚼勁。',
      en: 'Thickly sliced raw block ribeye beef grilled directly to medium-well, seasoned with gourmet sea salts.',
      ko: '마블링 좋은 원육 스테이크 부위를 큼직하게 썰어 순성하게 구운 육즙 대폭발 소고기 꼬치',
      ja: '大ぶりのステーキ肉を贅沢に一口大にカット。噛みしめるほどに赤身의旨みが溢れ出す。',
      th: 'เนื้อสเต็กรสชาติเข้มข้น หั่นเต๋าหนาพอดีคำ ย่างไฟอ่อนๆโรยเกลือหิมาลัยและพริกไทยดำป่น',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-05',
    category: 'skewers',
    name: {
      zh: '爆汁噴水香腸 / 串',
      en: 'Squirting Pork Sausage',
      ko: '육즙 톡톡 대만풍 돼지 소시지',
      ja: 'ジューシー爆汁炭焼きソーセージ',
      th: 'ไส้กรอกหมูย่างสตรีทฟู้ด',
    },
    price: 70,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '嚴選黃金肥瘦比例黑豬肉，咬下流滿甘美肉汁，香甜彈牙。',
      en: 'Sweet and savory traditional plump pork sausage, explodes with honey-sweet warm pork juice.',
      ko: '달콤 짭조름한 전통 비법으로 빚은 육즙 소시지를 그릴링하여 한입 자를 때마다 환상적인 즙이 나옵니다.',
      ja: '噛むとジュワッとお口に広がるポークのエキス。ほんのり甘く香ばしい台湾・タイ屋台名物。',
      th: 'หมูบดละเอียดสูตรคลาสสิก ปรุงรสหวานละมุน นุ่มเด้งในปาก ย่างจนหนังเปรี๊ยะสเปรย์น้ำช่ำ',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-06',
    category: 'skewers',
    name: {
      zh: '精選烤肥腸 / 串',
      en: 'Crispy Pork Intestines Skewer',
      ko: '바삭 돼지 곱창 구이',
      ja: '厳選ホルモン・テッチャン炭火焼き串',
      th: 'ไส้หมูอวบย่างซอสหวานสะเด็ด',
    },
    price: 90,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '肥腸慢火滷至入味，再高溫炭烤至外表金黃微酥，肥而不膩，極佳下酒菜。',
      en: 'Braised until fork-soft then charred over extreme fire to lock crispy crust and smooth rich collagen.',
      ko: '비법 한방 소스에 장시간 졸인 뒤 숯불 고온에 바삭하게 구워내 잡내가 없고 쫄깃고소함 극대화',
      ja: '指名大人気ホルモン串焼き。特製たれ漬け後、極高火で一気に仕上げました。',
      th: 'ไส้ใหญ่อ่อนลวกพะโล้ ย่างกับเตาถ่านทาซอสซีอิ๊วขาวพริกไทยจนขึ้นสีน้ำตาลทอง หอมกลิ่นกระทะ',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-07',
    category: 'skewers',
    name: {
      zh: '雞七里香 / 串',
      en: 'Crispy Chicken Butt Skewer',
      ko: '닭꼬리 미창 구이 꼬치',
      ja: 'ジューシーぼんじり炭火焼き串',
      th: 'ตรูดไก่ย่างถ่านสะท้านทรวง',
    },
    price: 70,
    image: 'https://images.unsplash.com/photo-1432139548775-87f61ef5975b?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '經典夜市必點。經過獨特工法調味去腥，烤出酥脆焦香外皮與香潤油脂。',
      en: 'Indulgent local night market specialty. Crispy on the outside, tender buttery fat inside.',
      ko: '대만의 베스트셀러 야시장 닭꼬리살. 잡내를 완전히 차단하고 부드러우면서도 숯향 머금은 지존 꼬치',
      ja: '熱々網のうえで脂を落としながらカリカリになるまで焼き上げ、旨味だけを凝縮した激推し部位。',
      th: 'ตูดไก่ล้างจนสะอาด ปราศจากกลิ่นคาว ย่างจนเปลือกนอกกรอบกรุบ มันหยดอร่อยมาก',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-08',
    category: 'skewers',
    name: {
      zh: '香烤嫩雞翅 / 4隻',
      en: 'Gourmet Grilled Chicken Wings (4 pcs)',
      ko: '오븐 숯불 닭날개 구이 (4개)',
      ja: '本格手羽先焦がし醤油焼き (4本)',
      th: 'ปีกไก่ย่างสูตรเข้มข้น (4 ชิ้น)',
    },
    price: 100,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '醃製入味的特頂雞中翅與前翅，慢烤熟成，外皮輕柔酥口、肉汁滿溢。',
      en: 'Plump premium chicken mid-joint and drummettes grilled slowly to preserve maximum tenderness.',
      ko: '살이 실한 국내산 닭날개를 수제 허브간장에 밤새 숙성하여 부드럽고 든든한 꼬치',
      ja: '醤油ベースの特製ダレにじっくり漬け込み、黄金色になるまで香ばしく手焼きした人気の一品。',
      th: 'ปีกกลางและปีกบน คัดไซส์อวบใหญ่ หมักน้ำปลาแท้จากตราด ย่างจนหนังพองกรอบหอมเนียนตา',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-09',
    category: 'skewers',
    name: {
      zh: '香烤雞皮 / 串',
      en: 'Crispy Grilled Chicken Skin',
      ko: '바삭바삭 닭껍질 구이',
      ja: '大人気カリカリ鶏皮ねぎ塩串',
      th: 'หนังไก่ย่างเตาถ่านกรอบสนั่น',
    },
    price: 60,
    image: 'https://images.unsplash.com/photo-1432139548775-87f61ef5975b?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '脫油酥烤雞皮，一咬發出咔嚓脆響，酥脆而不膩。',
      en: 'De-fat and roasted chicken skin skewers yielding a potato-chip-like crispy sensation.',
      ko: '지방을 완전히 빼내고 가마솥 숯불에 구워 감자칩보다 더 바삭해서 계속 들어가는 인생 맥주안주',
      ja: '余分な脂を丁寧に取り除き、カリカリになるまで炙り上げた軽快な歯ごたえのやみつき串。',
      th: 'หนังไก่ย่างรีดน้ำมันจนหมดห่วง กรอบฟู เคี้ยวแล้วส่งเสียงกรุบกรับมันส์คอ',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-10',
    category: 'skewers',
    name: {
      zh: '手工烤甜不辣 / 串',
      en: 'Handmade Grilled Tempura',
      ko: '수제 구운 오뎅/어묵 꼬치',
      ja: '手作り香ばし網焼き天ぷら（甜不辣）',
      th: 'ลูกชิ้นปลาแบนย่างถ่านฟินๆ',
    },
    price: 50,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '高含魚肉量的手作厚甜不辣，外表因大火碳烤膨脹酥焦，口感Q彈有嚼勁。',
      en: 'Farmed fish paste traditional tempura, grilled puffed up with perfect air pockets.',
      ko: '어육 함량이 높은 고급 가마보코식 대만 정통 텐푸라를 거칠게 구워 촉촉쫀득 씹을수록 깊은 단맛',
      ja: '魚肉をたっぷり使用したモチモチの手作り天ぷら。直火でふっくらと、焦がし醤油だれがたまらない。',
      th: 'โอเด้งไต้หวันเนื้อปลาหนึบข้น ย่างพองลมกรอบขобในเหนียวนุ่มเคี้ยวเพลิน',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-11',
    category: 'skewers',
    name: {
      zh: '泰北酸肉冬粉腸 / 串',
      en: 'Thai Isan sausage with Glass Noodles',
      ko: '태국 이산 당면 유산균 소시지',
      ja: 'タイ東北イサーン風春雨酸味ソーセージ',
      th: 'ไส้กรอกวุ้นเส้นอีสานถ่านหอม',
    },
    price: 90,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '正宗泰北發酵酸腸，包覆飽水冬粉，碳烤出完美微酸滋味與香脆皮衣。',
      en: 'Authentic fermented Northeastern Thai style sausage stuffed with premium glass noodles.',
      ko: '정통 태국 북동부 이산 지역의 발효 돼지고기 및 당면 소시지. 숯불에 구워 알싸하고 이국적인 최고의 안주',
      ja: 'タイイサーン地方の酸っぱ美味しい手作りソーセージ。もちもちの春雨と乳酸菌の発酵香が絶品。',
      th: 'ไส้กรอกหมูวุ้นเส้นเปรี้ยวกำลังดี หมักสมุนไพรสดแน่น ย่างไฟรุมๆ ทานเคียงกับขิงพริกขี้หนูสวน',
    },
    available: true,
    requiredSaucesOption: true,
  },
  {
    id: 'sk-12',
    category: 'skewers',
    name: {
      zh: '泰酥豆腐 / 份',
      en: 'Sabay Golden Crispy Tofu',
      ko: '사바이 크리스피 두부피 요리',
      ja: 'サバイ特製サクサク揚げ豆腐ピリ辛ソース',
      th: 'เต้าหู้ทอดกรอบซอสหวาน',
    },
    price: 120,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '大火高溫炸到表皮蓬鬆金黃的極脆豆腐，淋上精心熬製的泰式甜酸辣醬。',
      en: 'Ultra fluffy crispy tofu blocks drizzled with sweet-tangy street chili sauce.',
      ko: '고온에 빠르게 튀겨내어 껍질은 깃털처럼 가볍고 속은 비단같이 부드러운 사바이 시그니처 두부 요리',
      ja: '外側は非常に軽くサクサク、中はおぼろ豆腐のように温かく滑らか。酸味と甘みの特製チリが絶頂マリアージュ。',
      th: 'เต้าหู้หั่นเต๋าใหญ่ทอดแบบกรอบนอกนุ่มในไหลพราก ด้วยน้ำจิ้มไก่สูตรมะขามสดเผ็ดอ่อน',
    },
    available: true,
  },

  // Seafood BBQ
  {
    id: 'sf-01',
    category: 'seafood',
    name: {
      zh: '椰碳烤大草蝦 (6隻/份)',
      en: 'Coconut Charcoal Grilled Prawns (6 pcs)',
      ko: '코코넛 숯불 타이거 왕새우 (6마리)',
      ja: 'タイ風ヤシ炭焼き大ブラックタイガーエビ (6尾)',
      th: 'กุ้งแชบ๊วยย่างเตาถ่านกะลา (6 ตัว)',
    },
    price: 360,
    image: 'https://images.unsplash.com/photo-1559737145-73f1a0af807d?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '利用椰子殼木炭的高溫鎖住鮮甜，大蝦肉質紮實無比、鮮味彈牙。',
      en: 'High-temperature natural coconut shell charcoal locked sweet shellfish succulence.',
      ko: '천연 코코넛 숯을 활용하여 육질을 탱글탱글하게 굽고 수분을 보존한 프리미엄 타이거 새우 구이',
      ja: '極高熱のヤシの実炭で一気に焼き上げることで、エビ本来の濃密な甘みとぷりぷり食感を完全にキープ。',
      th: 'ใช้พรีเมียมถ่านกะลามะพร้าวเผาความร้อนสูง ทำให้เนื้อกุ้งแน่นหวานกรอบสู้เนื้อฟันเสิร์ฟคู่กับน้ำจิ้มยอดฮิต',
    },
    available: true,
  },
  {
    id: 'sf-02',
    category: 'seafood',
    name: {
      zh: '泰式大生蠔 (3顆/份)',
      en: 'Oyster in Thai-Style (3 pcs)',
      ko: '태국식 신선 석화 생굴 (3개)',
      ja: 'タイ風ジューシー大生牡蠣 (3個)',
      th: 'หอยนางรมยักษ์ราดน้ำจิ้มซีฟู้ดพริกเผา (3 ตัว)',
    },
    price: 320,
    image: 'https://images.unsplash.com/photo-1553618551-fba689030290?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '極鮮肥美生蠔，淋上祕製泰式青檸海鮮醬與香脆油蔥酥。',
      en: 'Super plump raw oysters topped with zesty proprietary lemongrass-lime sauce and crisp shallots.',
      ko: '초신선 굴에 타이 고수 라임 소스와 바삭한 태국 샬롯 튀김을 얹어 맛을 끌어올린 최고급 굴 석화',
      ja: '極上の大ぶり生牡蠣に、タイ独自のさわやかなライム＆チリシーフードソース and フライドシャルロットをトッピング。',
      th: 'หอยนางรมสดไซส์เบิ้ม คัดพิเศษ ทานกับยอดกระถิน หอมเจียวทอดกรอบ และพริกเผารสโหดเด็ดดวง',
    },
    available: true,
  },
  {
    id: 'sf-03',
    category: 'seafood',
    name: {
      zh: '烤日本鯖魚 / 份',
      en: 'Grilled Japanese Mackerel Sabah',
      ko: '고등어 구и',
      ja: '真サバ炭火塩焼き一夜干し',
      th: 'ปลาซาบะย่างซีอิ๊วหอมหวาน',
    },
    price: 180,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '日本產鮮肥鯖魚碳烤，油脂富裕、魚肉細緻，淋上檸檬與胡椒鹽最對味。',
      en: 'Fat-rich ocean wild Japanese Mackerel grilled with crispy skin and juicy flaked meat.',
      ko: '최고급 노르웨이 일산 고등어를 천일염으로 염장 후 숯불에 구워 짜지않고 기름기 흐르는 담백함',
      ja: '脂の乗った日本産サバを使用。ジューシーにじっくりと炭風で。レモンと塩コショウが最高。',
      th: 'ปลาซาบะนำเข้าจากแดนปลาดิบ ย่างซอสเทอริยากิรสชาติหวานเข้ม โดนใจทั้งผู้ใหญ่และเด็ก',
    },
    available: true,
  },
  {
    id: 'sf-04',
    category: 'seafood',
    name: {
      zh: '原味烤鮮扇貝 / 4顆',
      en: 'Gourmet Grilled Sea Scallops (4 pcs)',
      ko: '가리비 허브 구이 (4개)',
      ja: '日本産海川大ホタテ貝焼き (4個)',
      th: 'หอยเชลล์ย่างเนยกระเทียมพรีเมียม (4 ตัว)',
    },
    price: 240,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '整粒鮮美扇貝帶殼炭烤，釋放出濃郁原汁，淋上大蒜奶油香。',
      en: 'Fresh whole scallops grilled on its shell basted in custom garlic-herb butter brew.',
      ko: '조개 껍데기째 올려 천연 소금을 가볍게 얹어 구워낸 바다 향이 물씬 나는 달콤 가리비 구이',
      ja: '殻付きのまま新鮮な大ホタテを網焼き。バターニンニク醤油が磯の香ばしい匂いと見事に調和。',
      th: 'หอยเชลล์ฝาแก้วไซส์สะใจ อบร้อนด้วยเนยกระเทียมกริลล์สดๆ หวานอร่อยนุ่มเหนียว',
    },
    available: true,
  },
  {
    id: 'sf-05',
    category: 'seafood',
    name: {
      zh: '鮮甜碳烤蛤蜊 / 份',
      en: 'Sweet Charred Baby Clams Bowl',
      ko: '싱싱 모시조개 가마솥 구이',
      ja: '旨味たっぷり新鮮ハマグリ酒蒸し焼き',
      th: 'หอยลายอบสมุนไพรสดหม้อไฟ',
    },
    price: 150,
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '大火將大蛤蜊烤到開口，鎖住天然原味鹹甜海味鮮湯，極地海洋甜美滋味。',
      en: 'Heavy clams grilled to open instantly over fire to catch all aromatic ocean juices.',
      ko: '주문과 동시에 구워내어 입을 쩍 벌릴 때 머금고 있는 바다 에센스 육즙을 온전히 느낄 수 있는 조개 요리',
      ja: '注文をうけてから焼き上げ、貝が開いた瞬間のスープを一滴も逃さず上品に。濃厚な出汁が体に染み渡る。',
      th: 'หอยตลับ สดใหญ่ ย่างร้อนจนเด้งฝาพ่นไอยักษ์ เสิร์ฟเคล้ากระเทียมและเกลือ คอเบียร์ห้ามพลาด',
    },
    available: true,
  },

  // Desserts
  {
    id: 'sw-01',
    category: 'sweets',
    name: {
      zh: '南洋香蘭手作奶酪 / 份',
      en: 'South Seas Pandan Handmade Pudding',
      ko: '남양 판단 허브 수제 푸딩',
      ja: '本格手摘みパンダンリーフ自家製ココナッツプリン',
      th: 'พุดดิ้งพานาคอตต้าใบเตยนมสด',
    },
    price: 90,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '新鮮香蘭葉熬煮，完美融合純滑牛奶與淡淡草香椰甜。',
      en: 'Slow-simmered freshly squeezed green screwpine leaves blended into premium milk cream.',
      ko: '당일 수확한 판단 잎을 정성스레 다려 깊은 아로마 허브 향과 풍성한 우유 풍미를 담은 웰빙 푸딩',
      ja: '新鮮な生のパンダンリーフから抽出した華やかな香りと、濃厚で滑らかなミルクプリンが驚くほど絶妙にマッチ。',
      th: 'ใช้น้ำใบเตยสดคั้นแท้ 100% กลิ่นหอมกรุ่นอบอวล คลุกเคล้านมสดเนื้อละเอียดนุ่มนิ่ม ละลาย在口',
    },
    available: true,
  },
  {
    id: 'sw-02',
    category: 'sweets',
    name: {
      zh: '碳烤爆漿煉奶麵包 (1顆)',
      en: 'Charcoal-Grilled Thai Milk Bread',
      ko: '숯불 폭포 연유 버터 식빵 (1개)',
      ja: '爆汁炭焼きとろーりバター練乳パン(1個)',
      th: 'ขนมปังเนยนมน้ำตาลภูเขาไฟย่างถ่าน',
    },
    price: 80,
    image: 'https://images.unsplash.com/photo-1600431521340-491dea26b01a?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '限量必點！酥烤香甜厚吐司，一咬流出滾熱濃醇煉奶焦糖。',
      en: 'Fresh soft bun roasted crispy on coals, filled with cascading warm condensed milk and butter.',
      ko: '품절 대란! 연유와 수입 버터를 식빵 사이에 가득 채워 구워낸 달콤함 한도초과 야외 한정 번',
      ja: 'ココナッツ風味パンをこんがり手焼きし、中は溶けだす練乳と焦がしバターがたまらない特製デザート。',
      th: 'ขนมปังย่างกรอบหอมไฟถ่าน ทะลักด้วยเนยนมข้นเยิ้มเต็มคำ หวานมันสะใจ',
    },
    available: true,
  },

  // Drinks
  {
    id: 'dr-01',
    category: 'drinks',
    name: {
      zh: '泰式奶茶 1L 桶裝 (限定)',
      en: 'Signature Street Thai Milk Tea 1L (Bucket)',
      ko: '길거리 타이 밀크티 1L 점보 通 (限定)',
      ja: '極旨本場タイミルクティー1Lバケツ入り (テイクアウト・店内人気)',
      th: 'ชาเย็นไทยสตรีท 1 ลิตรถังยักษ์',
    },
    price: 180,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '進口手標紅茶佐煉乳、鮮乳大容量，濃郁滑順，還原曼谷經典滋味。',
      en: 'Authentic imported Cha-Tra-Mue red tea brewed freshly and masterfully over rich milk toppings.',
      ko: '태국 유명 손표 차트라뮤 홍차 시럽에 넉넉한 연유와 카네이션 우유가 만난 극상의 시원함',
      ja: 'タイ有名な「手標(チャトラムー)」茶葉を使用。コンデンスミルクとフレッシュミルクを混ぜた、現地屋台そのままの美味しさ。',
      th: 'ผงชาตรามือแท้นำเข้า ชงสุดฝีมือ อร่อยเข้ม เต็มอรรถรสความละมุนสไตล์ถังยักษ์สะใจ',
    },
    available: true,
  },
  {
    id: 'dr-02',
    category: 'drinks',
    name: {
      zh: '泰式奶茶 單杯裝',
      en: 'Signature Thai Milk Tea (Cup)',
      ko: '타이 밀크티 (단품 컵)',
      ja: '本格タイミルクティー（グラス）',
      th: 'ชาเย็นไทยสตรีทสูตรกลมกล่อม',
    },
    price: 90,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '經典手標紅茶佐滑順鮮乳與香濃煉乳，微冰甜美。',
      en: 'Perfect pour of hand-labeled black tea with sweet condensed milk, ice-cold.',
      ko: '하루 숙성시킨 수입 찻잎 홍차에 프리미엄 우유와 연유를 황금 배합하여 매장에서 조제한 인기 컵 음료',
      ja: '手標茶葉を濃く抽出し、独自のブレンド。甘みと渋みがベストバランスな一杯。',
      th: 'ชาตรามือชงเข้มข้นสะใจ ใส่แก้วดื่มง่าย หอมเท่ นมข้นสะดุ้งกลิ่นชาฟุ้งเตะจมูก',
    },
    available: true,
  },
  {
    id: 'dr-03',
    category: 'drinks',
    name: {
      zh: '天然百分百椰子水 / 杯',
      en: '100% Raw Pure Coconut Water',
      ko: '100% 천연 코코넛 야자 주스',
      ja: 'お口さっぱり天然100%ココナッツジュース（果肉入り）',
      th: 'น้ำมะพร้าวอ่อนน้ำหอมแท้ 100%',
    },
    price: 100,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '空運頂級泰國香椰水，清甜無比、降火去燥，富含天然椰肉。',
      en: 'Air-shipped young fragrant coconut juice with soft pulp pieces, ultimate cooling refreshment.',
      ko: '태국 유명 야자농장에서 원산지 수입한 수분 공급 최고봉인 리얼 코코넛 워터 (과육 포함)',
      ja: 'タイ特製のヤングココナッツを丸ごと。すっきりした高貴な甘みと、ジューシーな果肉。串焼きのお供に最適。',
      th: 'น้ำมะพร้าวสดหอมหวานสดชื่นคัดสดๆ มีเนื้อชิ้นนุ่มละเอียด ดื่มดับกระหายแก้เผ็ดดีเยี่ยม',
    },
    available: true,
  },
  {
    id: 'dr-04',
    category: 'drinks',
    name: {
      zh: '泰國勝獅 Singha 啤酒',
      en: 'Thai Singha Premium Beer',
      ko: '태국 전통 싱하 맥주 (Singha)',
      ja: 'タイ王室御用達 シンハー ビール (Singha)',
      th: 'เบียร์สิงห์พรีเมียมเย็นเจี๊ยบ',
    },
    price: 100,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '泰國皇室御用傳奇啤酒，口感細滑、麥葉微苦香甜，完美搭配香辣串燒。 (禁止酒駕 飲酒過量有害健康)',
      en: 'Legendary premium Thai lager with a prominent clover-herb hops aroma. (Please drink responsibly)',
      ko: '태국 왕실에서 수여하는 카루다 문장을 지닌 국보급 라거 맥주. 청량함과 알싸한 麥香이 구이와 찰떡궁합',
      ja: 'タイで最も歴史のある王室公認ビール。ピュアで高品質な麦芽100%ラガー。肉串のお供ナンバーワン。',
      th: 'เบียร์ค่ายสิงห์คลาสสิกฟองนุ่มละมุน คัดเกรดมอลต์นำเข้า ดื่มเคล้าเนื้อย่างชื่นใจชัวร์',
    },
    available: true,
  },
  {
    id: 'dr-05',
    category: 'drinks',
    name: {
      zh: '泰國大象 Chang 啤酒',
      en: 'Classic Thai Chang Beer',
      ko: '태국 창 맥주 (Chang)',
      ja: 'タイ定番 チャーン ビール (Chang)',
      th: 'เบียร์ช้างคลาสสิกสตรีทเย็นฉ่ำ',
    },
    price: 100,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400',
    description: {
      zh: '泰國市佔NO.1暢爽拉格，豐盈大麥與純凈深層地下泉水釀製，去油解膩。 (安全駕駛 醉不上道)',
      en: 'Classic crisp and full-bodied Thai pale lager brewed with soft volcanic water. (Enjoy responsibly)',
      ko: '태국 대표적인 친근한 맥주. 라벨의 한 쌍 대끼리 코끼리처럼 시원하고 뒤끝없는 개운함',
      ja: 'コクとすっきりした後味が大人気のタイ屈指のビール。さわやかな炭酸が串焼き의脂をサッと流します。',
      th: 'เบียร์ช้างคู่ยอดฮิตแห่งยุคสตรีท ดีกรีเข้มสะใจ ดับเลี่ยนขจัดล้างไขมันเตาลอยลม',
    },
    available: true,
  },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ig-01', name: { zh: '大鮮蝦', en: 'Fresh Prawns', ko: '생새우', ja: '新鮮なえび', th: 'กุ้งแชบ๊วยใหญ่' }, stock: 65, minThreshold: 15, unit: 'pcs' },
  { id: 'ig-02', name: { zh: '頂級牛肉串', en: 'USDA Beef', ko: '수제 소고기', ja: '厳選牛肉串', th: 'เนื้อวัวพรีเมียม' }, stock: 80, minThreshold: 20, unit: 'skewers' },
  { id: 'ig-03', name: { zh: '鮮甜高麗菜', en: 'Organic Cabbage', ko: '유기농 양배추', ja: 'キャベツ', th: 'กะหล่ำปลีหวาน' }, stock: 45, minThreshold: 10, unit: 'kg' },
  { id: 'ig-04', name: { zh: '生食干貝/生蠔', en: 'Oysters / Scallops', ko: '석화 굴 및 가리비', ja: '生牡蠣・干貝', th: 'หอยนางรมยักษ์/หอยเชลล์' }, stock: 35, minThreshold: 8, unit: 'pcs' },
  { id: 'ig-05', name: { zh: '多隆功泡麵/米粉', en: 'Mama / Rice Noodles', ko: '라면 사리', ja: 'ラーメン・フォー', th: 'บะหมี่มาม่า/ก๋วยเตี๋ยว' }, stock: 120, minThreshold: 25, unit: 'packs' },
  { id: 'ig-06', name: { zh: '頂級椰奶罐', en: 'Rich Coconut Milk', ko: '코코넛 밀크', ja: 'ココナッツミルク缶', th: 'กะทิกระป๋องออร์แกนิก' }, stock: 50, minThreshold: 12, unit: 'cans' },
  { id: 'ig-07', name: { zh: '泰手標紅茶原料', en: 'Thai Red Tea Brew', ko: '홍차 베이스', ja: 'タイ茶葉', th: 'ชาแดงตรามือเกรดส่งออก' }, stock: 95, minThreshold: 20, unit: 'liters' },
  { id: 'ig-08', name: { zh: '爆香豬五花 / 金針菇', en: 'Pork Belly & Enoki', ko: '돼지 삼겹 및 팽이', ja: '豚バラ・えのき', th: 'หมูสามชั้น/เห็ดเข็มทอง' }, stock: 75, minThreshold: 15, unit: 'skewers' },
];

export const INGREDIENT_RECIPE_MAP: { [foodId: string]: { ingredientId: string; amount: number }[] } = {
  'ty-01': [
    { ingredientId: 'ig-01', amount: 3 }, // 3 prawns
    { ingredientId: 'ig-06', amount: 0.1 }, // 0.1 can coconut milk
  ],
  'ty-02': [
    { ingredientId: 'ig-01', amount: 2 }, // 2 prawns
    { ingredientId: 'ig-02', amount: 1 }, // 1 portion beef
    { ingredientId: 'ig-06', amount: 0.1 },
  ],
  'nd-01': [
    { ingredientId: 'ig-01', amount: 4 }, // 4 prawns
    { ingredientId: 'ig-05', amount: 1 }, // 1 pack noodle
  ],
  'nd-02': [
    { ingredientId: 'ig-01', amount: 2 },
    { ingredientId: 'ig-05', amount: 1 },
  ],
  'cb-01': [
    { ingredientId: 'ig-02', amount: 1 }, // Handmade beef skewer
    { ingredientId: 'ig-08', amount: 1 }, // Pork wrap
    { ingredientId: 'ig-07', amount: 0.35 }, // 0.35L Thai Milk Tea
  ],
  'cb-02': [
    { ingredientId: 'ig-02', amount: 2 }, // 2 skewers beef
  ],
  'vg-01': [
    { ingredientId: 'ig-03', amount: 0.25 }, // 0.25kg cabbage
  ],
  'vg-02': [
    { ingredientId: 'ig-03', amount: 0.2 }, // 0.2kg zucchini
  ],
  'vg-03': [
    { ingredientId: 'ig-03', amount: 0.15 }, // mushrooms
  ],
  'vg-04': [
    { ingredientId: 'ig-03', amount: 0.1 }, // green beans
  ],
  'vg-05': [
    { ingredientId: 'ig-03', amount: 0.1 }, // bean skin
  ],
  'vg-06': [
    { ingredientId: 'ig-03', amount: 0.1 }, // rice cake
  ],
  'sk-01': [
    { ingredientId: 'ig-02', amount: 1 }, // 1 skewer beef
  ],
  'sk-02': [
    { ingredientId: 'ig-08', amount: 1 }, // 1 portion pork/enoki wrap
  ],
  'sk-03': [
    { ingredientId: 'ig-02', amount: 1 }, // lamb uses similar meat allocation
  ],
  'sk-04': [
    { ingredientId: 'ig-02', amount: 1.2 }, // thick beef cut
  ],
  'sk-05': [
    { ingredientId: 'ig-08', amount: 0.8 }, // sausage fat/pork
  ],
  'sk-06': [
    { ingredientId: 'ig-08', amount: 1 }, // pork intestine
  ],
  'sk-07': [
    { ingredientId: 'ig-08', amount: 0.8 }, // chicken butt / pork fat equivalent
  ],
  'sk-08': [
    { ingredientId: 'ig-08', amount: 1.2 }, // chicken wings
  ],
  'sk-09': [
    { ingredientId: 'ig-08', amount: 0.8 }, // chicken skin
  ],
  'sk-10': [
    { ingredientId: 'ig-08', amount: 0.6 }, // tempura fish paste
  ],
  'sk-11': [
    { ingredientId: 'ig-08', amount: 1 }, // Isan sausage
  ],
  'sk-12': [
    { ingredientId: 'ig-03', amount: 0.2 }, // crispy tofu uses vegetable stock-tracking tag
  ],
  'sf-01': [
    { ingredientId: 'ig-01', amount: 6 }, // 6 heavy prawns
  ],
  'sf-02': [
    { ingredientId: 'ig-04', amount: 3 }, // 3 raw fresh oysters
  ],
  'sf-03': [
    { ingredientId: 'ig-04', amount: 1 }, // fish tracking
  ],
  'sf-04': [
    { ingredientId: 'ig-04', amount: 4 }, // 4 scallops
  ],
  'sf-05': [
    { ingredientId: 'ig-04', amount: 2 }, // baby clams bowl
  ],
  'sw-01': [
    { ingredientId: 'ig-07', amount: 0.1 }, // pandan mix uses small tea flavor allocation
  ],
  'sw-02': [
    { ingredientId: 'ig-06', amount: 0.05 }, // butter/creamy coconut
  ],
  'dr-01': [
    { ingredientId: 'ig-07', amount: 1 }, // 1.0 Liters tea brew
  ],
  'dr-02': [
    { ingredientId: 'ig-07', amount: 0.35 }, // 0.35 Liters tea brew
  ],
  'dr-03': [
    { ingredientId: 'ig-06', amount: 0.15 }, // coconut water mapping
  ],
  'dr-04': [
    { ingredientId: 'ig-07', amount: 0.35 }, // beer placeholder tracking
  ],
  'dr-05': [
    { ingredientId: 'ig-07', amount: 0.35 }, // beer placeholder tracking
  ],
};

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
      ja: 'Googleログインでお会計いただくと、お買い上げ金額総額よりその場でポイント還元。',
      th: 'เข้าสู่ระบบผ่าน Google เพื่อรับคะแนนสะสมพิเศษได้ทุกยอดบิล ไม่มีขั้นต่ำ',
    },
    active: true,
  },
  {
    id: 'pm-02',
    title: { zh: '夏季暖心 泰奶同品項第二杯半價', en: 'Summer Splash: Thai Tea 2nd Cup 50% Off', ko: '여름 감사 타이 밀크티 1+1 반값 할인', ja: '夏祭り タイミルクティー2杯目半値引', th: 'ฉลองฤดูร้อน ชาไทยแก้วที่สองลด 50%' },
    code: 'THAITEA50',
    discountRate: 0.75, // average discount for 2 items is 25% off or custom code value
    description: {
      zh: '加點沙貝特大桶裝泰式奶茶，第二件自動折價，暢飲曼谷經典。',
      en: 'Order any Thai Tea beverage and enter THAITEA50 to redeem special price rewards.',
      ko: '점보 차 타이랜드 밀크티 주문 시 더블 매치 쿠폰 번호 입력으로 가성비 만족',
      ja: '当店自慢の大容量バケツ入りタイティーご注文の際、2個目が半額となるサマークーポン。',
      th: 'ชาไทยถังยักษ์ 1 ลิตร สดชื่นสะใจ ซื้อแก้วที่สอง ลดคั้นใจทันที 50%',
    },
    active: true,
  },
];
