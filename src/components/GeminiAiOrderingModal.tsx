import React, { useState } from 'react';
import { Sparkles, X, Check, Loader2, Compass, AlertCircle, ShoppingCart } from 'lucide-react';
import { MenuItem, OrderItem, Language } from '../types';

interface GeminiAiOrderingModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  cart: OrderItem[];
  onAddRecommendedToCart: (item: MenuItem, spiciness: number, sweetness: number) => void;
}

export const GeminiAiOrderingModal: React.FC<GeminiAiOrderingModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  menuItems,
  cart,
  onAddRecommendedToCart,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [selectedPreference, setSelectedPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    reasoningText: string;
    recommendations: {
      itemId: string;
      reason: string;
      suggestedSpiciness: number;
      suggestedSweetness: number;
    }[];
  } | null>(null);

  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const preferenceTabs = [
    { id: 'seafood', label: '招牌海鮮狂 🦐', desc: '熱愛大蝦、香茅酸辣冬蔭湯與海藍色海鮮乾拌麵' },
    { id: 'no-beef', label: '不吃牛肉 🚫🥩', desc: '排除任何牛製品，偏好極品炭烤爆汁豬肉串及嫩烤雞串' },
    { id: 'spicy', label: '辛辣崇拜者 🌶️', desc: '泰國當地特調火爆香辣，無辣不解饞' },
    { id: 'dessert', label: '椰香甜食控 🍮', desc: '經典熱帶椰香，鎖定鮮蒸芒果甜糯米飯與冰沁甜品' },
    { id: 'healthy', label: '小農蔬食派 🥬', desc: '清爽低負擔，偏好炭烤高麗菜、櫛瓜與爆汁烤菇' },
    { id: 'meat-lover', label: '肉食狂熱者 🍖🍢', desc: '點滿頂級手工牛肉串、小羔羊串、肉汁爆棚烤翅' },
    { id: 'not-spicy', label: '完全不辣星人 🍃', desc: '絕對不辣！享受淡淡炭香與主廚秘製黃金鹹甜醬汁' },
    { id: 'sour-savory', label: '酸檸開胃派 🍋🧪', desc: '偏愛泰式酸青檸、香茅草本與香料疊加的豐富層次' },
    { id: 'drinks-refreshing', label: '沁涼消暑組 🧊🍹', desc: '首選秒速解膩特級泰奶、大杯手搖、高空熱帶果飲' },
  ];

  const handleStartAnalysis = async () => {
    setLoading(true);
    setError(null);
    setAiAnalysis(null);
    setAddedItemIds([]);

    try {
      // Prepare simplified cart for server payload to save token sizes
      const simpleCart = cart.map(item => ({
        id: item.menuItemId,
        name: item.name,
        qty: item.qty,
      }));

      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery,
          preference: selectedPreference,
          currentCart: simpleCart,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 分析暫時遇到瓶頸，請稍後再試！');
      }

      const data = await response.json();
      setAiAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '無法連線到 AI 智慧分析模組');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWithAiConfigs = (item: MenuItem, spiciness: number, sweetness: number) => {
    onAddRecommendedToCart(item, spiciness, sweetness);
    setAddedItemIds(prev => [...prev, item.id]);
    
    // Quick timeout to reset added animation
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== item.id));
    }, 2000);
  };

  const getSpicinessLabel = (level: number) => {
    switch (level) {
      case 0: return '不辣/不可調 🍃';
      case 1: return '微辣 🌱';
      case 2: return '中辣 🔥';
      case 3: return '重泰大辣 🌶️🔥';
      default: return '推薦辣度';
    }
  };

  const getSweetnessLabel = (level: number) => {
    switch (level) {
      case 0: return '無糖 🧊';
      case 1: return '微甜 🍯';
      case 2: return '半糖/正常 🍹';
      case 3: return '泰國當地甜 🇹🇭🍮';
      default: return '推薦甜度';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4 select-none animate-fade-in"
      id="gemini-ai-ordering-modal"
    >
      <div className="bg-[#18181A] text-slate-100 rounded-3xl w-full max-w-lg border border-thai-gold/25 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-scale-up">
        
        {/* Header Title Bar */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-thai-gold via-amber-400 to-amber-200 flex items-center justify-center shadow-lg shadow-thai-gold/10 animation-pulse">
              <Sparkles className="w-5 h-5 text-thai-charcoal animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide font-display flex items-center gap-1.5">
                Gemini 智慧 AI 主廚點餐分析
              </h3>
              <p className="text-[10px] text-slate-400 font-sans">
                泰式料理風情偏好與專屬辛辣比例調配諮詢
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal content body, scrollable */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 min-h-0 text-left">
          
          {/* Preference Selection Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-[#E5B453] tracking-widest block">
              步驟 1：選擇您的泰式口味偏好 (Select Preference Tag)
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {preferenceTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPreference(tab.id)}
                  type="button"
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center space-x-1.5 ${
                    selectedPreference === tab.id
                      ? 'bg-thai-gold/20 border-thai-gold text-thai-gold shadow-md shadow-thai-gold/5'
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            {selectedPreference && (
              <p className="text-[10px] text-slate-400 italic pl-1 animate-fade-in pl-0.5">
                💡 {preferenceTabs.find(t => t.id === selectedPreference)?.desc}
              </p>
            )}
          </div>

          {/* User Custom Request Message */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-[#E5B453] tracking-widest block">
              步驟 2：輸入您的詳細點餐需求 (Custom Request / Optional)
            </span>
            <textarea
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
              placeholder="例如：『我們有兩大一小，小朋友不吃辣，想來點炭烤牛肉跟消暑的飲品』或是『有沒有必點的主廚熱湯與不辣特色甜品？』"
              rows={3}
              className="w-full bg-[#202022] border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-thai-gold/50 font-sans leading-relaxed resize-none"
            />
          </div>

          {/* Submit Action Button */}
          <button
            onClick={handleStartAnalysis}
            type="button"
            disabled={loading}
            className="w-full bg-gradient-to-r from-thai-gold to-amber-500 text-thai-charcoal py-3 rounded-xl font-bold text-xs sm:text-sm tracking-widest cursor-pointer hover:opacity-95 active:scale-98 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>AI 主廚正在精心琢磨調料秘方...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>提報 AI 首席主廚分析推薦</span>
              </>
            )}
          </button>

          {/* Error Indicator */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex items-center space-x-2 text-xs text-red-300 animate-fade-in">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Result Presentation Sheet */}
          {aiAnalysis && (
            <div className="space-y-4 pt-2 animate-slide-up border-t border-white/5">
              
              {/* Reasoning Commentary Chatbox */}
              <div className="p-4 bg-thai-gold/5 border border-thai-gold/15 rounded-2xl space-y-1.5 relative">
                <div className="absolute -top-2 left-4 bg-thai-gold text-thai-charcoal text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1 uppercase tracking-wider">
                  <Compass size={11} className="animate-spin-slow" />
                  <span>AI 主廚分析報告 Response</span>
                </div>
                <p className="text-xs text-slate-200 pt-1.5 leading-relaxed font-sans text-justify">
                  {aiAnalysis.reasoningText}
                </p>
              </div>

              {/* Recommendations Catalogue Grid */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-black uppercase text-[#E5B453] tracking-widest block">
                  AI 精選菜色提案 (Recommended Combination)
                </span>
                
                <div className="space-y-2.5">
                  {aiAnalysis.recommendations.map((rec, idx) => {
                    // Match with offline full menu configuration detail
                    const matchItem = menuItems.find(item => item.id === rec.itemId);
                    if (!matchItem) return null;

                    const isAdded = addedItemIds.includes(matchItem.id);

                    return (
                      <div
                        key={idx}
                        className="bg-[#202022] hover:bg-[#252528] rounded-2xl p-3 border border-white/5 hover:border-white/10 transition flex gap-3 animate-fade-in"
                      >
                        {/* Food Image */}
                        <img
                          src={matchItem.imageUrl}
                          alt={matchItem.name.zh}
                          className="w-16 h-16 rounded-xl object-cover border border-white/5 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Recommendation Description Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-white truncate pr-1">
                                {matchItem.name.zh}
                              </h4>
                              <span className="text-xs font-extrabold text-[#E5B453] font-mono shrink-0">
                                NT$ {matchItem.price}
                              </span>
                            </div>
                            
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-normal">
                              📝 {rec.reason}
                            </p>
                          </div>

                          {/* Suggested Parameters & Cart CTA */}
                          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/5">
                            <div className="flex flex-wrap gap-1.5">
                              {rec.suggestedSpiciness !== undefined && (
                                <span className="bg-red-500/10 text-red-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-red-500/15">
                                  🌶️ {getSpicinessLabel(rec.suggestedSpiciness)}
                                </span>
                              )}
                              {rec.suggestedSweetness !== undefined && (
                                <span className="bg-amber-500/10 text-[#E5B453] text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-amber-500/15">
                                  🍯 {getSweetnessLabel(rec.suggestedSweetness)}
                                </span>
                              )}
                            </div>

                            <button
                              id={`ai-add-btn-${matchItem.id}`}
                              onClick={() => handleAddWithAiConfigs(matchItem, rec.suggestedSpiciness, rec.suggestedSweetness)}
                              type="button"
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition flex items-center space-x-1 cursor-pointer select-none active:scale-95 shrink-0 ${
                                isAdded
                                  ? 'bg-[#00C300] text-white'
                                  : 'bg-[#E5B453]/20 text-[#E5B453] hover:bg-[#E5B453] hover:text-[#0F0F0F]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={10} />
                                  <span>已加選</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart size={10} />
                                  <span>+ 一鍵加選</span>
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Tip Bar */}
        <div className="py-3 px-5 border-t border-white/5 bg-black/10 text-center shrink-0">
          <p className="text-[9px] text-[#E5B453]/60 italic font-sans flex items-center justify-center gap-1">
            <span>✨ Gemini 智慧分析將自動結合當前原物料庫存，為您推算完美的舌尖搭配！</span>
          </p>
        </div>

      </div>
    </div>
  );
};
