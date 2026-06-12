#!/usr/bin/env python3
"""
Generate a clean, well-structured src/data.ts from data.csv
with proper multilingual translations, curated images, and semantic flags.
"""

import csv
import json
import re

# ── Category Mapping ────────────────────────────────────────────────────────
CSV_CAT_MAP = {
    '烤類':     'skewers',
    '酒水':     'drinks',
    '小菜及醬料': 'sides',
    '湯麵類':   'noodles',
    '優惠折扣':  'combos',
}

# ── Curated image URLs by category ──────────────────────────────────────────
CATEGORY_IMAGES = {
    'skewers': [
        'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1527362439-eed8ee0d6f98?auto=format&fit=crop&q=80&w=400',
    ],
    'drinks': [
        'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400',
    ],
    'sides': [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=400',
    ],
    'noodles': [
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1551183053-bf91798d773e?auto=format&fit=crop&q=80&w=400',
    ],
    'combos': [
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=400',
    ],
}

# ── Specific item images (barcode -> URL) for important/popular items ───────
ITEM_IMAGES = {
    # Drinks
    '2606012021064': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',  # Kirin Beer
    '2411142028551': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',  # Heineken
    '2410022148358': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',  # Budweiser
    '2302272107257': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',  # 勝獅
    '2302162152176': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',  # 泰象
    '2509191634172': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',  # 西貢啤酒
    '2411091621575': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',  # 可樂娜
    '2207122323590': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80&w=400',  # 可口可樂
    '2207122322371': 'https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400',  # 泰式奶茶
    '2505041825592': 'https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400',  # 街頭泰奶
    '2412022102224': 'https://images.unsplash.com/photo-1558618047-f4d7e7e23e6e?auto=format&fit=crop&q=80&w=400',  # 炭燒奶茶
    '2696007842576': 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400',  # 豆奶
    '2304041737306': 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=400',  # 椰子水
    # Skewers - specific
    '2207122037251': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400',  # 去骨雞腿
    '2207122058577': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400',  # 烤雞翅
    '1909191316572': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400',  # 七裡香
    '2209081751117': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400',  # 特大七裡香
    '2207122056269': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',  # 泰式手工牛
    '2209081753180': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',  # 牛小排
    '1909191940395': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',  # 原塊牛肋
    '2602121834434': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',  # 板腱牛
    '2305152126508': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',  # 小羔羊肋
    '2503181902333': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400',  # 小羊肩排
    '2208071820475': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',  # 月亮蝦餅
    '2412021732071': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',  # 大草蝦
    '2412021732545': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',  # 扇貝
    '2509281752083': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',  # 大魷魚
    # Noodles
    '2505041753253': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',  # 海陸牛冬蔭功
    '2505041751044': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',  # 海陸豬冬蔭功
    '2409232044239': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',  # 牛小排冬蔭功
    '2207122341556': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',  # 海鮮冬蔭功
    '2207122341013': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',  # 越南鮮牛肉河粉
    '2005282340194': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',  # 海鮮mama麵
}

# ── Translation helpers ──────────────────────────────────────────────────────
# Maps Chinese item name -> {en, ko, ja, th}
# For items with specific known translations:
KNOWN_TRANSLATIONS = {
    'Vitamilk豆奶': {'en': 'Vitamilk Soy Milk', 'ko': '비타밀크 두유', 'ja': 'ビタミルク豆乳', 'th': 'นมถั่วเหลืองไวตามิ้ลค์'},
    '麒麟啤酒': {'en': 'Kirin Beer', 'ko': '기린 맥주', 'ja': 'キリンビール', 'th': 'เบียร์คิริน'},
    'SPY泰國雞尾酒': {'en': 'SPY Thai Cocktail', 'ko': 'SPY 태국 칵테일', 'ja': 'SPYタイカクテル', 'th': 'สปายค็อกเทลไทย'},
    '桂花乳酪': {'en': 'Osmanthus Cheese Drink', 'ko': '계화 치즈 음료', 'ja': 'キンモクセイチーズドリンク', 'th': 'เครื่องดื่มชีสดอกเก๊กฮวย'},
    '香斕乳酪': {'en': 'Pandan Cheese Drink', 'ko': '판단 치즈 음료', 'ja': 'パンダンチーズドリンク', 'th': 'เครื่องดื่มชีสใบเตย'},
    '鮮奶乳酪': {'en': 'Fresh Milk Cheese Drink', 'ko': '신선한 우유 치즈 음료', 'ja': '生乳チーズドリンク', 'th': 'เครื่องดื่มชีสนมสด'},
    '泰式奶茶乳酪': {'en': 'Thai Milk Tea Cheese', 'ko': '태국 밀크티 치즈 음료', 'ja': 'タイミルクティーチーズ', 'th': 'ชีสชาไทย'},
    '西貢啤酒': {'en': 'Saigon Beer', 'ko': '사이공 맥주', 'ja': 'サイゴンビール', 'th': 'เบียร์ไซ่ง่อน'},
    '海尼根': {'en': 'Heineken', 'ko': '하이네켄', 'ja': 'ハイネケン', 'th': 'ไฮเนเก้น'},
    '可樂娜': {'en': 'Corona', 'ko': '코로나', 'ja': 'コロナ', 'th': 'โคโรน่า'},
    '百威': {'en': 'Budweiser', 'ko': '버드와이저', 'ja': 'バドワイザー', 'th': 'บัดไวเซอร์'},
    '泰象': {'en': 'Chang Beer', 'ko': '창 맥주', 'ja': 'チャンビール', 'th': 'เบียร์ช้าง'},
    '勝獅': {'en': 'Singha Beer', 'ko': '싱하 맥주', 'ja': 'シンハービール', 'th': 'เบียร์สิงห์'},
    '金牌': {'en': 'Gold Medal Beer (Taiwan Beer)', 'ko': '금메달 맥주', 'ja': '金牌ビール', 'th': 'เบียร์โกลด์เมดัล'},
    '金樽': {'en': 'Jinzun Beer', 'ko': '진준 맥주', 'ja': '金樽ビール', 'th': 'เบียร์จินจุน'},
    '白鶴清酒': {'en': 'Hakutsuru Sake', 'ko': '하쿠쓰루 사케', 'ja': '白鶴清酒', 'th': 'สาเกฮาคุสึรุ'},
    '大摩12年': {'en': 'Dalmore 12 Year', 'ko': '달모어 12년', 'ja': 'ダルモア 12年', 'th': 'ดาลมอร์ 12 ปี'},
    '蘇格登12年': {'en': 'Singleton 12 Year', 'ko': '싱글톤 12년', 'ja': 'シングルトン 12年', 'th': 'ซิงเกิลตัน 12 ปี'},
    '蘇格登13年': {'en': 'Singleton 13 Year', 'ko': '싱글톤 13년', 'ja': 'シングルトン 13年', 'th': 'ซิงเกิลตัน 13 ปี'},
    '金芬黛葡萄酒': {'en': 'Zinfandel Wine', 'ko': '진판델 와인', 'ja': 'ジンファンデルワイン', 'th': 'ไวน์ซินฟานเดล'},
    '4支-金芬黛葡萄酒14.5%': {'en': '4-Bottle Zinfandel 14.5%', 'ko': '진판델 와인 4병 14.5%', 'ja': 'ジンファンデルワイン 4本 14.5%', 'th': 'ไวน์ซินฟานเดล 4 ขวด 14.5%'},
    '3支-大摩12年': {'en': '3-Bottle Dalmore 12 Year', 'ko': '달모어 12년 3병', 'ja': 'ダルモア12年 3本', 'th': 'ดาลมอร์ 12 ปี 3 ขวด'},
    '3支-蘇格登13年': {'en': '3-Bottle Singleton 13 Year', 'ko': '싱글톤 13년 3병', 'ja': 'シングルトン13年 3本', 'th': 'ซิงเกิลตัน 13 ปี 3 ขวด'},
    '3支-蘇格登12年': {'en': '3-Bottle Singleton 12 Year', 'ko': '싱글톤 12년 3병', 'ja': 'シングルトン12年 3本', 'th': 'ซิงเกิลตัน 12 ปี 3 ขวด'},
    '樂天氣泡酒': {'en': 'Lotte Sparkling Wine', 'ko': '롯데 스파클링 와인', 'ja': 'ロッテスパークリングワイン', 'th': 'ไวน์ผลไม้สปาร์กลิ้งล็อตเต้'},
    '雪山': {'en': 'Snow Beer', 'ko': '눈의 산 맥주', 'ja': '雪山ビール', 'th': 'เบียร์หิมะ'},
    '可口可樂': {'en': 'Coca-Cola', 'ko': '코카콜라', 'ja': 'コカ・コーラ', 'th': 'โค้ก'},
    '果汁氣泡水': {'en': 'Juice Sparkling Water', 'ko': '주스 탄산수', 'ja': 'ジュース炭酸水', 'th': 'น้ำอัดลมผลไม้'},
    '分解茶': {'en': 'Digestive Herbal Tea', 'ko': '소화 허브티', 'ja': '消化促進ハーブティー', 'th': 'ชาสมุนไพรช่วยย่อย'},
    '愛之味麥茶': {'en': 'I-Mei Barley Tea', 'ko': '아이메이 보리차', 'ja': '愛之味麦茶', 'th': 'ชาข้าวบาร์เลย์'},
    '冰水(大)': {'en': 'Iced Water (Large)', 'ko': '얼음물 (대)', 'ja': '氷水 (大)', 'th': 'น้ำแข็ง (ใหญ่)'},
    '泰醇奶酒5.6%': {'en': 'Thai Cream Liqueur 5.6%', 'ko': '태국 크림 리큐어 5.6%', 'ja': 'タイクリームリキュール 5.6%', 'th': 'ไวน์นม 5.6%'},
    '泰醇奶酒1.4%': {'en': 'Thai Cream Liqueur 1.4%', 'ko': '태국 크림 리큐어 1.4%', 'ja': 'タイクリームリキュール 1.4%', 'th': 'ไวน์นม 1.4%'},
    '泰式奶茶400ml': {'en': 'Thai Milk Tea 400ml', 'ko': '태국 밀크티 400ml', 'ja': 'タイミルクティー 400ml', 'th': 'ชาไทย 400ml'},
    '50.街頭泰奶1L': {'en': '50. Street Thai Milk Tea 1L', 'ko': '50. 길거리 태국 밀크티 1L', 'ja': '50. ストリートタイミルクティー 1L', 'th': '50. ชาไทยสตรีท 1L'},
    '炭燒奶茶(壺)': {'en': 'Charcoal Milk Tea (Pot)', 'ko': '숯불 밀크티 (포트)', 'ja': '炭火焼きミルクティー (ポット)', 'th': 'ชานมถ่าน (กา)'},
    '桂花乳酪飲': {'en': 'Osmanthus Cheese Latte', 'ko': '계화 치즈 라떼', 'ja': 'キンモクセイチーズラテ', 'th': 'ลาเต้ชีสดอกเก๊กฮวย'},
    '恐龍美祿': {'en': 'Dino Milo', 'ko': '다이노 마일로', 'ja': 'ダイノミロ', 'th': 'ไดโนไมโล'},
    '泰式可哥冰奶': {'en': 'Thai Cocoa Ice Milk', 'ko': '태국 코코아 아이스 밀크', 'ja': 'タイ風ココアアイスミルク', 'th': 'นมโกโก้เย็นไทย'},
    '柳橙氣泡飲': {'en': 'Orange Sparkling Drink', 'ko': '오렌지 탄산음료', 'ja': 'オレンジスパークリング', 'th': 'น้ำส้มอัดลม'},
    '果肉椰子水': {'en': 'Coconut Water with Pulp', 'ko': '과육 코코넛 워터', 'ja': '果肉入りコナッツウォーター', 'th': 'น้ำมะพร้าวเนื้อ'},
    # Skewers
    '1.爽脆高麗菜': {'en': '1. Crispy Cabbage', 'ko': '1. 아삭한 양배추', 'ja': '1. さっぱりキャベツ', 'th': '1. กะหล่ำปลีกรอบ'},
    '2.四季豆': {'en': '2. Green Beans', 'ko': '2. 강낭콩', 'ja': '2. インゲン豆', 'th': '2. ถั่วแขก'},
    '3.青椒': {'en': '3. Green Bell Pepper', 'ko': '3. 청피망', 'ja': '3. ピーマン', 'th': '3. พริกหวานเขียว'},
    '4.香菇': {'en': '4. Shiitake Mushroom', 'ko': '4. 표고버섯', 'ja': '4. 椎茸', 'th': '4. เห็ดหอม'},
    '5.杏鮑菇': {'en': '5. King Oyster Mushroom', 'ko': '5. 새송이버섯', 'ja': '5. エリンギ', 'th': '5. เห็ดเป๋าฮื้อ'},
    '6.有機玉米筍': {'en': '6. Organic Baby Corn', 'ko': '6. 유기농 미니 옥수수', 'ja': '6. オーガニックヤングコーン', 'th': '6. ข้าวโพดอ่อนออร์แกนิก'},
    '7.秋葵(季節)': {'en': '7. Okra (Seasonal)', 'ko': '7. 오크라 (계절)', 'ja': '7. オクラ (旬)', 'th': '7. กระเจี๊ยบเขียว (ตามฤดูกาล)'},
    '8.娃娃菜2p': {'en': '8. Baby Cabbage 2pc', 'ko': '8. 베이비 배추 2개', 'ja': '8. ミニ白菜 2個', 'th': '8. ผักกาดเด็ก 2 ชิ้น'},
    '9.爆汁櫛瓜': {'en': '9. Juicy Zucchini', 'ko': '9. 즙이 가득한 애호박', 'ja': '9. ジューシーズッキーニ', 'th': '9. ซูกีนีฉ่ำน้ำ'},
    '10.蔬菜拼盤': {'en': '10. Vegetable Platter', 'ko': '10. 야채 모둠', 'ja': '10. 野菜盛り合わせ', 'th': '10. รวมผัก'},
    '11.澎湖花枝丸': {'en': '11. Penghu Squid Balls', 'ko': '11. 펑후 오징어볼', 'ja': '11. 澎湖イカボール', 'th': '11. ลูกชิ้นหมึกเผิงหู'},
    '12.澎澎甜不辣': {'en': '12. Tempura Fish Cake', 'ko': '12. 어묵 튀김', 'ja': '12. さつま揚げ', 'th': '12. ทอดมันปลา'},
    '13.月亮蝦餅': {'en': '13. Moon Shrimp Cake', 'ko': '13. 월남 새우전', 'ja': '13. 月型エビ餅', 'th': '13. แผ่นกุ้งทอด'},
    '14.秋刀魚2p': {'en': '14. Pacific Saury 2pc', 'ko': '14. 꽁치 2개', 'ja': '14. サンマ 2本', 'th': '14. ปลาแมคเคอเรล 2 ชิ้น'},
    '15.大草蝦6P': {'en': '15. Tiger Prawns 6pc', 'ko': '15. 왕새우 6개', 'ja': '15. 大海老 6本', 'th': '15. กุ้งแม่น้ำ 6 ตัว'},
    '16.泰辣扇貝9P': {'en': '16. Thai Spicy Scallops 9pc', 'ko': '16. 태국식 매운 가리비 9개', 'ja': '16. タイ風辛口ホタテ 9個', 'th': '16. หอยเชลล์เผ็ดไทย 9 ตัว'},
    '17.手撕魷魚幹': {'en': '17. Hand-Torn Dried Squid', 'ko': '17. 손으로 찢은 말린 오징어', 'ja': '17. 手裂きイカの干物', 'th': '17. ปลาหมึกแห้งฉีกมือ'},
    '18.炙燒幹貝3P': {'en': '18. Seared Scallops 3pc', 'ko': '18. 구운 가리비 3개', 'ja': '18. 炙りホタテ 3個', 'th': '18. หอยเชลล์ย่าง 3 ตัว'},
    '19.鯖甘魚下巴': {'en': '19. Yellowtail Fish Jaw', 'ko': '19. 방어 턱살', 'ja': '19. ブリのカマ', 'th': '19. คางปลาฮามาจิ'},
    '20.泰式生蠔1P': {'en': '20. Thai Raw Oyster 1pc', 'ko': '20. 태국식 생굴 1개', 'ja': '20. タイ風生牡蠣 1個', 'th': '20. หอยนางรมสดสไตล์ไทย 1 ตัว'},
    '21.特大七裏香': {'en': '21. XL Chicken Oysters', 'ko': '21. 특대 닭 굴살', 'ja': '21. 特大チキンオイスター', 'th': '21. เนื้อไก่ตะโพก XL'},
    '22.烤雞翅-4p': {'en': '22. Grilled Chicken Wings 4pc', 'ko': '22. 구운 닭날개 4개', 'ja': '22. 焼きチキンウィング 4本', 'th': '22. ปีกไก่ย่าง 4 ชิ้น'},
    '23.去骨雞腿8兩': {'en': '23. Boneless Chicken Leg 300g', 'ko': '23. 뼈 없는 닭다리 300g', 'ja': '23. 骨なし鶏もも 300g', 'th': '23. น่องไก่ไม่มีกระดูก 300g'},
    '24.肉雞七裏香': {'en': '24. Chicken Oyster Skewers', 'ko': '24. 닭 굴살 꼬치', 'ja': '24. チキンオイスター串', 'th': '24. เนื้อไก่ตะโพกเสียบไม้'},
    '25.啃的雞皮': {'en': '25. Crispy Chicken Skin', 'ko': '25. 바삭한 닭껍질', 'ja': '25. パリパリチキンスキン', 'th': '25. หนังไก่กรอบ'},
    '26.牛小排-5oz': {'en': '26. Short Rib 5oz', 'ko': '26. 소 갈비 5oz', 'ja': '26. 牛ショートリブ 5oz', 'th': '26. ซี่โครงสั้น 5oz'},
    '27.泰式手工牛': {'en': '27. Thai Handmade Beef Skewer', 'ko': '27. 태국식 수제 소고기 꼬치', 'ja': '27. タイ風手作り牛肉串', 'th': '27. เสียบไม้เนื้อวัวทำมือสไตล์ไทย'},
    '28.原塊牛肋': {'en': '28. Whole Beef Rib', 'ko': '28. 통 소갈비', 'ja': '28. 塊牛バラ', 'th': '28. ซี่โครงวัวชิ้นใหญ่'},
    '29.小羊肩排': {'en': '29. Lamb Shoulder Chop', 'ko': '29. 어린양 어깨살', 'ja': '29. ラム肩ロース', 'th': '29. ซี่โครงแกะ'},
    '30.小羔羊肋': {'en': '30. Lamb Rib Skewer', 'ko': '30. 어린양 갈비 꼬치', 'ja': '30. ラムリブ串', 'th': '30. ซี่โครงลูกแกะ'},
    '31.香菜豬肉捲': {'en': '31. Coriander Pork Roll', 'ko': '31. 고수 돼지고기 롤', 'ja': '31. パクチー豚肉ロール', 'th': '31. หมูม้วนผักชี'},
    '32.金針菇豬肉': {'en': '32. Enoki Mushroom & Pork', 'ko': '32. 팽이버섯 돼지고기', 'ja': '32. エノキ豚肉巻き', 'th': '32. เห็ดเข็มทองหมู'},
    '33.酸肉冬粉腸': {'en': '33. Sour Pork Glass Noodle Sausage', 'ko': '33. 신맛 돼지고기 당면 소시지', 'ja': '33. 酸味豚肉春雨ソーセージ', 'th': '33. ไส้กรอกหมูเปรี้ยววุ้นเส้น'},
    '34.熱狗豬血糕': {'en': '34. Hot Dog & Blood Cake', 'ko': '34. 핫도그 돼지 선지떡', 'ja': '34. ホットドッグ豚血餅', 'th': '34. ไส้กรอกและข้าวเหนียวดำ'},
    '35.噴水香腸': {'en': '35. Juicy Taiwanese Sausage', 'ko': '35. 즙이 나오는 대만 소시지', 'ja': '35. ジューシー台湾ソーセージ', 'th': '35. ไส้อั่วไต้หวันฉ่ำน้ำ'},
    '36.精選肥腸': {'en': '36. Premium Pork Intestine', 'ko': '36. 프리미엄 돼지 대창', 'ja': '36. 厳選豚の大腸', 'th': '36. ลำไส้หมูคัดพิเศษ'},
    '37.新竹貢丸': {'en': '37. Hsinchu Pork Meatball', 'ko': '37. 신주 돼지고기 미트볼', 'ja': '37. 新竹豚肉つみれ', 'th': '37. ลูกชิ้นหมูซินจู'},
    '38.泰酥豆皮': {'en': '38. Thai Crispy Tofu Skin', 'ko': '38. 태국식 바삭한 두부피', 'ja': '38. タイ風カリカリ湯葉', 'th': '38. เต้าหู้ฉาบกรอบสไตล์ไทย'},
    '40.爆漿泰奶包': {'en': '40. Thai Milk Tea Lava Bun', 'ko': '40. 태국 밀크티 용암 빵', 'ja': '40. タイ風ミルクティー溶岩パン', 'th': '40. ขนมปังชาไทยไหล'},
    '41.泰鮮大魷魚': {'en': '41. Thai-Style Giant Squid', 'ko': '41. 태국식 대형 오징어', 'ja': '41. タイ風巨大イカ', 'th': '41. หมึกยักษ์สดสไตล์ไทย'},
    '42.牛肉10串': {'en': '42. Beef Skewers x10', 'ko': '42. 소고기 꼬치 10개', 'ja': '42. 牛肉串 10本', 'th': '42. เสียบไม้เนื้อวัว 10 ไม้'},
    '43.羊肉10串': {'en': '43. Lamb Skewers x10', 'ko': '43. 양고기 꼬치 10개', 'ja': '43. 羊肉串 10本', 'th': '43. เสียบไม้เนื้อแกะ 10 ไม้'},
    '44.牛5羊5串': {'en': '44. Mix Beef & Lamb x10', 'ko': '44. 소고기 5 + 양고기 5 꼬치', 'ja': '44. 牛羊ミックス串 10本', 'th': '44. เสียบไม้วัวผสมแกะ 10 ไม้'},
    '45.雞皮10串': {'en': '45. Chicken Skin Skewers x10', 'ko': '45. 닭껍질 꼬치 10개', 'ja': '45. チキンスキン串 10本', 'th': '45. เสียบไม้หนังไก่ 10 ไม้'},
    '泰式生蠔11p': {'en': 'Thai Raw Oysters 11pc', 'ko': '태국식 생굴 11개', 'ja': 'タイ風生牡蠣 11個', 'th': 'หอยนางรมสดสไตล์ไทย 11 ตัว'},
    '泰式生蠔3p': {'en': 'Thai Raw Oysters 3pc', 'ko': '태국식 생굴 3개', 'ja': 'タイ風生牡蠣 3個', 'th': 'หอยนางรมสดสไตล์ไทย 3 ตัว'},
    '78.板腱牛5oz': {'en': '78. Top Blade Beef 5oz', 'ko': '78. 블레이드 스테이크 5oz', 'ja': '78. 板筋牛 5oz', 'th': '78. เนื้อวัวท็อปเบลด 5oz'},
    # Sets / Combos
    '招牌A餐': {'en': 'Signature Set A', 'ko': '시그니처 A 세트', 'ja': '看板Aセット', 'th': 'เซต A ยอดนิยม'},
    '多肉B餐': {'en': 'Meaty Set B', 'ko': '고기 가득 B 세트', 'ja': '肉盛りBセット', 'th': 'เซต B เนื้อแน่น'},
    '奢華C餐': {'en': 'Luxury Set C', 'ko': '럭셔리 C 세트', 'ja': 'ラグジュアリーCセット', 'th': 'เซต C หรูหรา'},
    '人氣D餐': {'en': 'Popular Set D', 'ko': '인기 D 세트', 'ja': '人気Dセット', 'th': 'เซต D ยอดฮิต'},
    # Noodles
    '0.大魷MAMA麵': {'en': '0. Giant Squid MAMA Noodles', 'ko': '0. 대왕 오징어 마마 라면', 'ja': '0. 巨大イカMAMA麺', 'th': '0. มาม่าหมึกยักษ์'},
    '+mama麵': {'en': '+ MAMA Noodles Upgrade', 'ko': '+ 마마 면 업그레이드', 'ja': '+ MAMA麺 アップグレード', 'th': '+ อัพเกรดมาม่า'},
    '升級套餐': {'en': 'Meal Upgrade', 'ko': '업그레이드 세트', 'ja': 'セットアップグレード', 'th': 'อัพเกรดเซต'},
    '加點A高麗菜': {'en': 'Add-on: Cabbage', 'ko': '추가 주문: 양배추', 'ja': '追加オーダー: キャベツ', 'th': 'เพิ่ม: กะหล่ำปลี'},
    '69.湯加椰奶': {'en': '69. Add Coconut Milk to Soup', 'ko': '69. 수프에 코코넛 밀크 추가', 'ja': '69. スープにココナッツミルク追加', 'th': '69. เพิ่มกะทิในซุป'},
    '62.紫菜蛋花湯': {'en': '62. Seaweed Egg Drop Soup', 'ko': '62. 해초 계란 탕', 'ja': '62. 海苔かき玉スープ', 'th': '62. ซุปสาหร่ายไข่ตุ๋น'},
    '63.鮮味蛤蜊湯': {'en': '63. Fresh Clam Soup', 'ko': '63. 신선한 조개 수프', 'ja': '63. あさり出汁スープ', 'th': '63. ซุปหอยลาย'},
    '64.玉米濃湯': {'en': '64. Corn Chowder', 'ko': '64. 옥수수 크림수프', 'ja': '64. コーンポタージュ', 'th': '64. ซุปข้าวโพด'},
    '65.海鮮冬蔭功湯': {'en': '65. Tom Yum Seafood Soup', 'ko': '65. 똠얌 해산물 수프', 'ja': '65. 海鮮トムヤムスープ', 'th': '65. ต้มยำทะเล'},
    '66.海陸豬冬蔭功湯': {'en': '66. Tom Yum Pork & Seafood', 'ko': '66. 똠얌 돼지고기 & 해산물', 'ja': '66. 豚肉海鮮トムヤム', 'th': '66. ต้มยำหมูทะเล'},
    '67.海陸牛冬蔭功湯': {'en': '67. Tom Yum Beef & Seafood', 'ko': '67. 똠얌 소고기 & 해산물', 'ja': '67. 牛肉海鮮トムヤム', 'th': '67. ต้มยำเนื้อทะเล'},
    '68.牛小排冬蔭功湯': {'en': '68. Tom Yum Short Rib', 'ko': '68. 똠얌 소 갈비', 'ja': '68. 牛ショートリブトムヤム', 'th': '68. ต้มยำซี่โครงสั้น'},
    '70.海鮮mama麵': {'en': '70. Seafood MAMA Noodles', 'ko': '70. 해산물 마마 라면', 'ja': '70. 海鮮MAMA麺', 'th': '70. มาม่าทะเล'},
    '71.泰式海鮮.河粉': {'en': '71. Thai Seafood Rice Noodles', 'ko': '71. 태국식 해산물 쌀국수', 'ja': '71. タイ風海鮮ライスヌードル', 'th': '71. ก๋วยเตี๋ยวทะเลไทย'},
    '72.泰式海鮮.米線': {'en': '72. Thai Seafood Vermicelli', 'ko': '72. 태국식 해산물 쌀국수 (가는면)', 'ja': '72. タイ風海鮮米麺', 'th': '72. เส้นหมี่ทะเลไทย'},
    '73.泰式豬肉.河粉': {'en': '73. Thai Pork Rice Noodles', 'ko': '73. 태국식 돼지고기 쌀국수', 'ja': '73. タイ風豚肉ライスヌードル', 'th': '73. ก๋วยเตี๋ยวหมูไทย'},
    '74.泰式豬肉.米線': {'en': '74. Thai Pork Vermicelli', 'ko': '74. 태국식 돼지고기 쌀국수 (가는면)', 'ja': '74. タイ風豚肉米麺', 'th': '74. เส้นหมี่หมูไทย'},
    '75.泰式牛小排.河粉': {'en': '75. Thai Short Rib Rice Noodles', 'ko': '75. 태국식 소 갈비 쌀국수', 'ja': '75. タイ風牛ショートリブライスヌードル', 'th': '75. ก๋วยเตี๋ยวซี่โครงสั้นไทย'},
    '76.泰式牛小排.米線': {'en': '76. Thai Short Rib Vermicelli', 'ko': '76. 태국식 소 갈비 쌀국수 (가는면)', 'ja': '76. タイ風牛ショートリブ米麺', 'th': '76. เส้นหมี่ซี่โครงสั้นไทย'},
    '77.越南鮮牛肉河粉': {'en': '77. Vietnamese Rare Beef Pho', 'ko': '77. 베트남 신선한 소고기 쌀국수', 'ja': '77. ベトナム風フォー (生牛肉)', 'th': '77. เฝอเนื้อวัวสดเวียดนาม'},
    # Sides
    '小熊維C棒棒糖': {'en': 'Vitamin C Lollipop', 'ko': '비타민 C 막대사탕', 'ja': 'ビタミンCキャンディ', 'th': 'ลูกอมวิตามินซี'},
    '百香果青木瓜': {'en': 'Passion Fruit Green Papaya Salad', 'ko': '패션프루트 그린 파파야 샐러드', 'ja': 'パッションフルーツグリーンパパイヤ', 'th': 'มะละกอดิบผลเสาวรส'},
    '49.泰辣醬': {'en': '49. Thai Chilli Sauce', 'ko': '49. 태국식 칠리 소스', 'ja': '49. タイ風チリソース', 'th': '49. น้ำพริกไทย'},
    '46.辣椒粉': {'en': '46. Chilli Powder', 'ko': '46. 고춧가루', 'ja': '46. チリパウダー', 'th': '46. พริกป่น'},
    '47.泰式綠醬': {'en': '47. Thai Green Sauce', 'ko': '47. 태국식 그린 소스', 'ja': '47. タイ風グリーンソース', 'th': '47. น้ำจิ้มเขียวไทย'},
    '48.泰式紅醬': {'en': '48. Thai Red Sauce', 'ko': '48. 태국식 레드 소스', 'ja': '48. タイ風レッドソース', 'th': '48. น้ำจิ้มแดงไทย'},
    '紅醬外帶瓶': {'en': 'Red Sauce (Takeaway Bottle)', 'ko': '레드 소스 (테이크아웃 병)', 'ja': 'レッドソース (テイクアウト)', 'th': 'น้ำจิ้มแดง (ขวดพกพา)'},
    '綠醬外帶瓶': {'en': 'Green Sauce (Takeaway Bottle)', 'ko': '그린 소스 (테이크아웃 병)', 'ja': 'グリーンソース (テイクアウト)', 'th': 'น้ำจิ้มเขียว (ขวดพกพา)'},
    '特製辣椒醬(外帶)': {'en': 'Special Chilli Sauce (Takeaway)', 'ko': '특제 칠리 소스 (테이크아웃)', 'ja': '特製チリソース (テイクアウト)', 'th': 'น้ำจิ้มพริกพิเศษ (พกพา)'},
    # Combos / Discounts
    '乳酪組合價': {'en': 'Cheese Drink Combo Price', 'ko': '치즈 음료 콤보 가격', 'ja': 'チーズドリンクコンボ価格', 'th': 'ราคาคอมโบเครื่องดื่มชีส'},
    '啤酒10送1': {'en': 'Beer Buy 10 Get 1 Free', 'ko': '맥주 10+1 이벤트', 'ja': 'ビール10本で1本サービス', 'th': 'ซื้อเบียร์ 10 แถม 1'},
    '客家幣加碼': {'en': 'Hakka Coin Bonus', 'ko': '하카 코인 추가 적립', 'ja': '客家コインボーナス', 'th': 'โบนัสเหรียญฮากกา'},
    '集點兌換泰奶桶': {'en': 'Points Redeem: Thai Tea Bucket', 'ko': '포인트 교환: 태국 밀크티 버킷', 'ja': 'ポイント交換: タイミルクティーバケツ', 'th': 'แลกคะแนน: ชาไทยถัง'},
    '51.泰奶空桶': {'en': '51. Thai Tea Empty Bucket', 'ko': '51. 태국 밀크티 빈 버킷', 'ja': '51. タイミルクティー空バケツ', 'th': '51. ถังชาไทยเปล่า'},
    '客家幣刷卡': {'en': 'Hakka Coin (Card Payment)', 'ko': '하카 코인 (카드 결제)', 'ja': '客家コイン (カード払い)', 'th': 'เหรียญฮากกา (ชำระบัตร)'},
    '客家幣': {'en': 'Hakka Coin', 'ko': '하카 코인', 'ja': '客家コイン', 'th': 'เหรียญฮากกา'},
    '好友折扣': {'en': 'Friend Discount', 'ko': '친구 할인', 'ja': '友人割引', 'th': 'ส่วนลดเพื่อน'},
    '開瓶費1支': {'en': 'Corkage Fee (1 Bottle)', 'ko': '코키지 (1병)', 'ja': 'コルキッジ (1本)', 'th': 'ค่าเปิดขวด (1 ขวด)'},
    'tip': {'en': 'Tip / Gratuity', 'ko': '팁', 'ja': 'チップ', 'th': 'ทิปพนักงาน'},
    'D餐贈可哥冰奶': {'en': 'Set D Gift: Cocoa Ice Milk', 'ko': 'D세트 증정: 코코아 아이스 밀크', 'ja': 'Dセット特典: ココアアイスミルク', 'th': 'ของแถมเซต D: โกโก้นมสดเย็น'},
    'D餐贈美錄': {'en': 'Set D Gift: Milo', 'ko': 'D세트 증정: 마일로', 'ja': 'Dセット特典: ミロ', 'th': 'ของแถมเซต D: ไมโล'},
    'D餐贈可樂': {'en': 'Set D Gift: Coca-Cola', 'ko': 'D세트 증정: 코카콜라', 'ja': 'Dセット特典: コーラ', 'th': 'ของแถมเซต D: โค้ก'},
    'D餐贈椰子水': {'en': 'Set D Gift: Coconut Water', 'ko': 'D세트 증정: 코코넛 워터', 'ja': 'Dセット特典: ヤシの実水', 'th': 'ของแถมเซต D: น้ำมะพร้าว'},
    'D餐贈泰奶': {'en': 'Set D Gift: Thai Milk Tea', 'ko': 'D세트 증정: 태국 밀크티', 'ja': 'Dセット特典: タイミルクティー', 'th': 'ของแถมเซต D: ชาไทย'},
}

# ── Semantic flag helpers ──────────────────────────────────────────────────
def detect_beef(name):
    keywords = ['牛', 'beef', 'short rib']
    return any(k in name.lower() for k in ['牛', '板腱'])

def detect_pork(name):
    return any(k in name for k in ['豬', '腸', '肥腸', '香腸', '貢丸', '豬血', '肉捲', '香菜豬', '酸肉', '熱狗'])

def detect_seafood(name):
    return any(k in name for k in ['蝦', '魷', '蠔', '貝', '海鮮', '魚', '花枝', '蛤蜊', '扇貝', '幹貝', '生蠔', '秋刀', '鯖'])

def detect_spicy(name, category):
    not_spicy_cat = ['drinks', 'sides', 'combos']
    if category in not_spicy_cat:
        return True
    # Known spicy items
    spicy_keywords = ['辣', '冬蔭', 'tom yum', 'spicy']
    for kw in spicy_keywords:
        if kw in name.lower():
            return False
    # Most BBQ items are not necessarily spicy by default
    return True  # default not spicy for skewers (grilled, no sauce applied)

def get_description(zh_name, category):
    cat_desc = {
        'skewers': {'zh': '炭火慢烤，香氣四溢，每一口都是極致美味', 'en': 'Slowly grilled over charcoal, bursting with aroma and flavor', 'ko': '숯불에 천천히 구워 향이 진하고 맛이 풍부합니다', 'ja': '炭火でじっくり焼き上げ、香ばしさと旨みが凝縮', 'th': 'ย่างถ่านช้าๆ หอมกรุ่น อร่อยทุกคำ'},
        'drinks': {'zh': '沁涼消暑，口感清爽，搭配燒烤絕配', 'en': 'Refreshing and cool, a perfect match for BBQ', 'ko': '시원하고 상쾌한 음료로 바베큐와 완벽한 조화', 'ja': '冷たくさわやか、BBQに最高の組み合わせ', 'th': 'เย็นชื่นใจ รสสดชื่น เข้ากับบาร์บีคิวได้อย่างลงตัว'},
        'sides': {'zh': '精心調製，口感層次豐富，為您的餐點添彩', 'en': 'Carefully crafted with rich flavors to complement your meal', 'ko': '정성껏 만든 다채로운 맛으로 식사에 특별함을 더합니다', 'ja': '丁寧に仕上げた豊かな風味で食事に彩りを添える', 'th': 'ปรุงอย่างพิถีพิถัน รสชาติหลากหลาย เพิ่มความอร่อยให้มื้ออาหาร'},
        'noodles': {'zh': '道地泰式風味湯麵，濃郁湯底暖心暖胃', 'en': 'Authentic Thai-style soup noodles with rich, warming broth', 'ko': '정통 태국식 국수, 진하고 따뜻한 육수가 몸을 녹입니다', 'ja': '本格タイ風スープ麺、濃厚なスープで体が温まる', 'th': 'ก๋วยเตี๋ยวแบบไทยแท้ น้ำซุปข้นอร่อยอุ่นท้อง'},
        'combos': {'zh': '超值優惠組合，物超所值，限時享用', 'en': 'Great value combo deals, enjoy the savings while they last', 'ko': '가성비 최고의 콤보 혜택, 기간 한정 특별 가격', 'ja': 'お得な組み合わせで最高のコスパ、期間限定価格', 'th': 'คอมโบคุ้มค่า ลดราคาพิเศษ ใช้ได้ในเวลาที่กำหนด'},
    }
    return cat_desc.get(category, cat_desc['skewers'])

# ── Read CSV ─────────────────────────────────────────────────────────────────
rows = []
with open(r'C:\Users\admin\Desktop\data.csv', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

# ── Build menu items ──────────────────────────────────────────────────────────
image_counters = {cat: 0 for cat in CATEGORY_IMAGES}

menu_items = []
for row in rows:
    zh_name = row['名稱'].strip()
    if not zh_name:
        continue
    
    csv_cat = row['分類'].strip()
    category = CSV_CAT_MAP.get(csv_cat, 'skewers')
    
    barcode = row['條碼'].strip()
    item_id = f"dish-{barcode}" if barcode else f"dish-{zh_name[:8]}"
    
    # Price: use 銷售價
    try:
        price = float(row['銷售價'].replace(',', ''))
    except (ValueError, KeyError):
        price = 0.0
    
    # Available: items with price <= 0 or 商品狀態 != 啟用 are hidden
    status = row.get('商品狀態', '啟用').strip()
    available = (status == '啟用') and (price > 0)
    
    # Translations
    trans = KNOWN_TRANSLATIONS.get(zh_name, {})
    en_name = trans.get('en', zh_name)
    ko_name = trans.get('ko', zh_name)
    ja_name = trans.get('ja', zh_name)
    th_name = trans.get('th', zh_name)
    
    # Image
    if barcode in ITEM_IMAGES:
        image_url = ITEM_IMAGES[barcode]
    else:
        imgs = CATEGORY_IMAGES.get(category, CATEGORY_IMAGES['skewers'])
        idx = image_counters[category] % len(imgs)
        image_url = imgs[idx]
        image_counters[category] += 1
    
    # Flags
    contains_beef = detect_beef(zh_name)
    contains_pork = detect_pork(zh_name)
    contains_seafood = detect_seafood(zh_name)
    is_not_spicy = detect_spicy(zh_name, category)
    
    # Has noodle option (Tom Yum soups)
    has_noodles = category == 'noodles' and any(k in zh_name for k in ['冬蔭功', '鮮牛肉', '海陸'])
    has_coconut = has_noodles
    
    desc = get_description(zh_name, category)
    
    item = {
        'id': item_id,
        'category': category,
        'name': {'zh': zh_name, 'en': en_name, 'ko': ko_name, 'ja': ja_name, 'th': th_name},
        'price': price,
        'image': image_url,
        'description': desc,
        'available': available,
        'containsBeef': contains_beef,
        'containsPork': contains_pork,
        'containsSeafood': contains_seafood,
        'isNotSpicy': is_not_spicy,
    }
    if has_noodles:
        item['hasNoodlesOption'] = True
        item['hasCoconutsMilkOption'] = True
    
    menu_items.append(item)

# ── Generate TypeScript ───────────────────────────────────────────────────────
def ts_string(s):
    """Escape a string for TypeScript."""
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')

def ts_bool(b):
    return 'true' if b else 'false'

lines = []
lines.append("import { MenuItem, Ingredient, Promotion, Language } from './types';")
lines.append("")
lines.append("export const TRANSLATIONS: { [key: string]: { [lang in Language]: string } } = {")
lines.append("  sabayBBQ: {")
lines.append("    zh: '沙貝燒烤 泰式烤肉',")
lines.append("    en: 'Sabay BBQ Thai Barbecue',")
lines.append("    ko: '사바이 바베큐 태국식 바베큐',")
lines.append("    ja: 'サバイ バーベキュー タイ風焼き肉',")
lines.append("    th: 'สบาย บาร์บีคิว หมูกระทะไทย',")
lines.append("  },")
lines.append("  slogan: {")
lines.append("    zh: '正宗泰式碳烤、冬蔭功系列、宵夜首選',")
lines.append("    en: 'Authentic Thai BBQ, Tom Yum & Perfect Late Night Bites',")
lines.append("    ko: '정통 태국식 바베큐, 똠얌 및 심야 꼬치',")
lines.append("    ja: '本格タイ風炭火焼き、トムヤム、深夜の絶品串焼き',")
lines.append("    th: 'บาร์บีคิวไทยแท้, ต้มยำ และอาหารมื้อดึกแสนอร่อย',")
lines.append("  },")
lines.append("  table: { zh: '桌號', en: 'Table', ko: '테이블 번호', ja: 'テーブル番号', th: 'โต๊ะที่' },")
lines.append("  categories: { zh: '菜色分類', en: 'Categories', ko: '메뉴 분류', ja: 'カテゴリー', th: 'หมวดหมู่' },")
lines.append("  addToCart: { zh: '加入購物車', en: 'Add to Cart', ko: '장바구니 담기', ja: 'カートに追加', th: 'ใส่ตะกร้า' },")
lines.append("  customOptions: { zh: '客製化選項', en: 'Custom Options', ko: '맞춤설정 옵션', ja: 'オプション調整', th: 'ตัวเลือกเพิ่มเติม' },")
lines.append("  spicinessLevel: { zh: '辣度調整', en: 'Spiciness', ko: '매운맛 조절', ja: '辛さの調整', th: 'ระดับความเผ็ด' },")
lines.append("  sweetnessLevel: { zh: '甜度調整', en: 'Sweetness', ko: '당도 조절', ja: '甘さの調整', th: 'ระดับความหวาน' },")
lines.append("  noodleOption: { zh: '麵體選擇', en: 'Noodle Option', ko: '면 선택', ja: '麺タイプの選択', th: 'เลือกประเภทเส้น' },")
lines.append("  coconutOption: { zh: '升級奶香冬蔭 (+NT$50)', en: 'Add Coconut Milk (+NT$50)', ko: '코코넛 밀크 추가 (+NT$50)', ja: 'ココナッツミルク追加 (+NT$50)', th: 'เพิ่มน้ำกะทิ (+NT$50)' },")
lines.append("  spiciness: { zh: '辣度', en: 'Spiciness', ko: '매운맛', ja: '辛さ', th: 'ความเผ็ด' },")
lines.append("  sweetness: { zh: '甜度', en: 'Sweetness', ko: '당도', ja: '甘み', th: 'ความหวาน' },")
lines.append("  sauceNote: { zh: '醬料特別備註 (沙貝祕製沾醬)', en: 'Special Sauce Note (Sabay Sauce)', ko: '소스 특별 요청', ja: '特製ソースの要望', th: 'หมายเหตุซอส' },")
lines.append("  lineLogin: { zh: '使用 Google 帳戶登入', en: 'Google Quick Login', ko: 'Google 계정으로 간편 로그인', ja: 'Google ログイン', th: 'เข้าสู่ระบบด้วย Google' },")
lines.append("  checkout: { zh: '進一步結帳', en: 'Proceed to Checkout', ko: '결제하기', ja: 'お会計に進む', th: 'ดำเนินการชำระเงิน' },")
lines.append("  myOrders: { zh: '我的歷史訂單', en: 'My Order History', ko: '내 주문 내역', ja: '注文履歴', th: 'ประวัติการสั่งซื้อ' },")
lines.append("  kitchenStaff: { zh: '廚房後台連線', en: 'Kitchen Display', ko: '주방 화면', ja: '厨房機器システム', th: 'หน้าจอในครัว' },")
lines.append("  dashboard: { zh: '經營分析面板', en: 'Admin Management', ko: '경영 관리 대시보드', ja: '売上管理ダッシュボード', th: 'แผงจัดการร้าน' },")
lines.append("  inventoryTitle: { zh: '原料庫存管理', en: 'Ingredient Stock', ko: '식자재 재고 관리', ja: '原材料の在庫管理', th: 'จัดการคลังวัตถุดิบ' },")
lines.append("  totalPrice: { zh: '總金額', en: 'Total Price', ko: '총 합계 금액', ja: '合計金額', th: 'ราคารวม' },")
lines.append("  orderPlaced: { zh: '訂單成功送出！正在為您準備', en: 'Order Placed! Preparing now...', ko: '주문 완료! 준비가 곧 완료됩니다.', ja: '注文完了！調理が始まりました。', th: 'ส่งออเดอร์แล้ว! กำลังเร่งเตรียมอาหารให้คุณ...' },")
lines.append("  printKitchenTicket: { zh: '列印廚房單 (模擬連線)', en: 'Print Kitchen Ticket', ko: '주방 전표 출력', ja: '伝票印刷', th: 'พิมพ์ใบสั่งงานครัว' },")
lines.append("  memberDiscount: { zh: '已綁定 Google 會員 (點數累積中)', en: 'Google Member Connected (Points Accumulating)', ko: 'Google 회원 연동됨 (포인트 적립 중)', ja: 'Google会員連携（ポイント貯まり中）', th: 'เชื่อมโยงสมาชิก Google แล้ว (สะสมคะแนน)' },")
lines.append("};")
lines.append("")
lines.append("export const CAT_NAMES: { [key: string]: { [lang in Language]: string } } = {")
lines.append("  combos: { zh: '優惠折扣 🍱', en: 'Discounts & Combos', ko: '할인 및 세트', ja: '割引・セット', th: 'ส่วนลดและคอมโบ' },")
lines.append("  sides: { zh: '小菜及醬料 🥬', en: 'Sides & Sauces', ko: '반찬 및 소스', ja: '小皿・ソース', th: 'เครื่องเคียงและซอส' },")
lines.append("  skewers: { zh: '原味碳烤肉類 🍢', en: 'Charcoal BBQ Skewers', ko: '오리지널 숯불 꼬치', ja: 'タイ風肉串炭火焼き', th: 'บาร์บีคิวเสียบไม้ย่าง' },")
lines.append("  noodles: { zh: '單人熱麵食 🥢', en: 'Single Noodles', ko: '단품 매운 면 요리', ja: 'お一人様用麺類', th: 'บะหมี่และก๋วยเตี๋ยวจานเดี่ยว' },")
lines.append("  drinks: { zh: '泰特色沁涼飲品 🍹', en: 'Thai Cold Drinks', ko: '태국식 야외 청량 음료', ja: 'タイ風さわやかドリンク', th: 'เครื่องดื่มดับร้อนรสสดชื่น' }")
lines.append("};")
lines.append("")
lines.append("export const INITIAL_MENU: MenuItem[] = [")

for i, item in enumerate(menu_items):
    comma = '' if i == len(menu_items) - 1 else ','
    n = item['name']
    d = item['description']
    lines.append("  {")
    lines.append(f'    "id": "{ts_string(item["id"])}",')
    lines.append(f'    "category": "{item["category"]}",')
    lines.append(f'    "name": {{')
    lines.append(f'      "zh": "{ts_string(n["zh"])}",')
    lines.append(f'      "en": "{ts_string(n["en"])}",')
    lines.append(f'      "ko": "{ts_string(n["ko"])}",')
    lines.append(f'      "ja": "{ts_string(n["ja"])}",')
    lines.append(f'      "th": "{ts_string(n["th"])}"')
    lines.append(f'    }},')
    lines.append(f'    "price": {item["price"]},')
    lines.append(f'    "image": "{item["image"]}",')
    lines.append(f'    "description": {{')
    lines.append(f'      "zh": "{ts_string(d["zh"])}",')
    lines.append(f'      "en": "{ts_string(d["en"])}",')
    lines.append(f'      "ko": "{ts_string(d["ko"])}",')
    lines.append(f'      "ja": "{ts_string(d["ja"])}",')
    lines.append(f'      "th": "{ts_string(d["th"])}"')
    lines.append(f'    }},')
    lines.append(f'    "available": {ts_bool(item["available"])},')
    lines.append(f'    "containsBeef": {ts_bool(item["containsBeef"])},')
    lines.append(f'    "containsPork": {ts_bool(item["containsPork"])},')
    lines.append(f'    "containsSeafood": {ts_bool(item["containsSeafood"])},')
    end_props = f'    "isNotSpicy": {ts_bool(item["isNotSpicy"])}'
    if item.get('hasNoodlesOption'):
        lines.append(end_props + ',')
        lines.append(f'    "hasNoodlesOption": true,')
        lines.append(f'    "hasCoconutsMilkOption": true')
    else:
        lines.append(end_props)
    lines.append(f'  }}{comma}')

lines.append("];")
lines.append("")

# ── Keep the existing INGREDIENTS, RECIPE_MAP, PROMOTIONS from the old file ──
# (We only regenerate INITIAL_MENU, keeping everything else intact)
lines.append("// ── Ingredients, Recipe Map and Promotions are defined below ──────────────")

output = '\n'.join(lines)
print(output[:500])
print(f"\n✅ Generated {len(menu_items)} menu items")
print(f"   Skewers: {sum(1 for x in menu_items if x['category']=='skewers')}")
print(f"   Drinks:  {sum(1 for x in menu_items if x['category']=='drinks')}")
print(f"   Noodles: {sum(1 for x in menu_items if x['category']=='noodles')}")
print(f"   Sides:   {sum(1 for x in menu_items if x['category']=='sides')}")
print(f"   Combos:  {sum(1 for x in menu_items if x['category']=='combos')}")

# Write to a temp file for inspection
with open(r'E:\20260607\EASY-WEB-ORDER\src\data_menu_only.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print("\n📄 Saved to src/data_menu_only.ts for review")
