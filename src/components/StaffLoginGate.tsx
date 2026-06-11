import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

interface StaffLoginGateProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const StaffLoginGate: React.FC<StaffLoginGateProps> = ({ onLoginSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [errorCode, setErrorCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setErrorCode(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorCode(false);
  };

  const handleClear = () => {
    setPin('');
    setErrorCode(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorCode(false);
    try {
      const res = await fetch('/api/staff/pin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        onLoginSuccess();
      } else {
        setErrorCode(true);
        setPin('');
      }
    } catch (err) {
      console.error('[Verify error]', err);
      setErrorCode(true);
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-[#161616] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 text-center text-white" id="secure-gate-container">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1 text-xs text-white/55 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>返回點餐前台</span>
        </button>
        <span className="text-[10px] uppercase font-bold text-[#E5B453] bg-[#E5B453]/10 border border-[#E5B453]/25 px-2.5 py-0.5 rounded-full">
          Staff Only Gate
        </span>
      </div>

      <div className="space-y-2 mb-6">
        <div className="w-12 h-12 bg-[#E5B453]/10 mx-auto rounded-xl flex items-center justify-center text-[#E5B453]">
          <KeyRound size={22} className="animate-pulse" />
        </div>
        <h3 className="text-lg font-bold font-serif text-[#E5B453]">經營管理後台登入</h3>
        <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
          此區域為餐飲管理、廚房配單及數據庫存後端。請輸入 6 位數員工金鑰以完成安全驗證。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dots representing passcode */}
        <div className="flex justify-center space-x-4 py-3">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                pin.length > i
                  ? 'bg-[#E5B453] border-[#E5B453] scale-110'
                  : 'bg-transparent border-white/20'
              }`}
            />
          ))}
        </div>

        {errorCode && (
          <div className="bg-red-500/15 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 animate-bounce">
            <AlertCircle size={14} />
            <span>解鎖金鑰錯誤！(預設為 888888 或輸入變更後的 6 位數金鑰)</span>
          </div>
        )}

        {/* Pin Numeric Pad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto py-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              id={`pinpad-${num}`}
              onClick={() => handleNumberClick(num)}
              className="bg-white/5 hover:bg-white/10 active:bg-white/15 h-14 rounded-2xl text-xl font-bold font-mono transition cursor-pointer select-none"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            id="pinpad-clear"
            onClick={handleClear}
            className="text-xs text-white/45 bg-white/2 hover:bg-white/5 rounded-2xl hover:text-white font-semibold cursor-pointer transition select-none"
          >
            清除
          </button>
          <button
            type="button"
            id="pinpad-0"
            onClick={() => handleNumberClick('0')}
            className="bg-white/5 hover:bg-white/10 active:bg-white/15 h-14 rounded-2xl text-xl font-bold font-mono transition cursor-pointer select-none"
          >
            0
          </button>
          <button
            type="button"
            id="pinpad-back"
            onClick={handleBackspace}
            className="text-xs text-white/45 bg-white/2 hover:bg-white/5 rounded-2xl hover:text-white font-semibold cursor-pointer transition select-none"
          >
            刪除
          </button>
        </div>

        <button
          type="submit"
          disabled={pin.length < 6}
          id="pin-submit-button"
          className={`w-full font-bold py-3.5 px-6 rounded-2xl transition-all duration-150 flex items-center justify-center space-x-1.5 cursor-pointer text-xs ${
            pin.length === 6
              ? 'bg-[#E5B453] text-[#0F0F0F] font-black'
              : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
          }`}
        >
          <ShieldCheck size={14} />
          <span>解鎖進入後台系統</span>
        </button>
      </form>
    </div>
  );
};
