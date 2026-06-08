import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, CheckCircle, Shield, ArrowLeft, Key, ExternalLink, HelpCircle } from 'lucide-react';
import { TRANSLATIONS } from '../data';
import { Language } from '../types';

interface GoogleUserProfile {
  id: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
  email: string;
}

interface GoogleLoginMockProps {
  currentLang: Language;
  onLoginSuccess: (profile: GoogleUserProfile | null) => void;
  currentProfile: GoogleUserProfile | null;
}

export const GoogleLoginMock: React.FC<GoogleLoginMockProps> = ({
  currentLang,
  onLoginSuccess,
  currentProfile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('bbq_lover@gmail.com');
  const [displayName, setDisplayName] = useState('沙貝忠實饕客');
  const [avatarIndex, setAvatarIndex] = useState(0);
  
  // Real authentication configurations
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);
  const [showGcpGuide, setShowGcpGuide] = useState(false);

  const mockAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  ];

  // Detect server status on open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/auth/google/status')
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setIsGoogleConfigured(!!data?.configured);
        })
        .catch((err) => {
          // Graceful fallback for local development or disconnected states
          console.log('Google Auth is unconfigured or server is offline during initial ping:', err.message || err);
          setIsGoogleConfigured(false);
        });
    }
  }, [isOpen]);

  // Bind postMessage listener for actual Google OAuth pop-up redirection callback swaps
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Guarantee matching context signature
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.profile) {
        onLoginSuccess(event.data.profile);
        setIsOpen(false);
        setIsCustomMode(false);
        setShowGcpGuide(false);
      }
    };
    
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onLoginSuccess]);

  // Handle authentic popup trigger to execute real flow
  const handleRealGoogleLogin = async () => {
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const response = await fetch(`/api/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '無法取得 Google 驗證網址。');
      }
      
      const { url } = await response.json();
      
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const authWindow = window.open(
        url,
        'google_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
      );
      
      if (!authWindow) {
        alert('彈出視窗已被瀏覽器封鎖，請允許本網站顯示彈出視窗以完成 Google 帳戶驗證。');
      }
    } catch (error: any) {
      console.error('Real Google Authentication initiation failed:', error);
      alert(`初始化 Google 驗證服務端失敗：\n${error.message || error}`);
    }
  };

  const handleQuickLogin = (email: string, name: string, picUrl: string) => {
    const mockProfile: GoogleUserProfile = {
      id: `google-usr-${Math.floor(1000 + Math.random() * 9000)}`,
      displayName: name,
      pictureUrl: picUrl,
      statusMessage: '今天也要吃爆泰味冬蔭功與碳烤雞皮！🔥🍢',
      email: email,
    };
    onLoginSuccess(mockProfile);
    setIsOpen(false);
    setIsCustomMode(false);
  };

  const handleSimulateLogin = () => {
    const mockProfile: GoogleUserProfile = {
      id: `google-usr-${Math.floor(1000 + Math.random() * 9000)}`,
      displayName: displayName.trim() || 'Google 點餐會員',
      pictureUrl: mockAvatars[avatarIndex],
      statusMessage: '今天也要吃爆泰味冬蔭功與碳烤雞皮！🔥🍢',
      email: customEmail.trim() || 'member@gmail.com',
    };
    onLoginSuccess(mockProfile);
    setIsOpen(false);
    setIsCustomMode(false);
  };

  const handleLogout = () => {
    onLoginSuccess(null);
  };

  return (
    <div id="google-login-container">
      {currentProfile ? (
        <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-white/10 shrink-0">
          <div className="text-right">
            <div className="text-[10px] sm:text-xs font-black text-white font-sans truncate max-w-[65px] sm:max-w-[125px]">
              {currentProfile.displayName}
            </div>
            <div className="text-[8px] sm:text-[10px] text-[#4285F4] font-black leading-none mt-0.5 truncate max-w-[65px] sm:max-w-[125px]">
              {currentProfile.email}
            </div>
          </div>
          <img
            src={currentProfile.pictureUrl}
            alt={currentProfile.displayName}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#4285F4] shrink-0"
            referrerPolicy="no-referrer"
          />
          <button
            id="google-logout-btn"
            onClick={handleLogout}
            className="p-1 sm:p-1.5 hover:bg-white/5 text-white/50 hover:text-white rounded-lg transition cursor-pointer shrink-0"
            title="登出 Google 帳號"
          >
            <LogOut size={12} />
          </button>
        </div>
      ) : (
        <button
          id="google-login-trigger-btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-1 sm:space-x-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold py-1 px-2.5 sm:py-2 sm:px-4 rounded-full shadow-md text-[11px] sm:text-xs cursor-pointer transition active:scale-95 border border-slate-200 whitespace-nowrap shrink-0"
        >
          {/* Custom Google logo 'G' icon */}
          <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.63v3.01h3.89c2.28-2.1 3.56-5.19 3.56-8.49z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3.01c-1.08.72-2.45 1.16-4.04 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.11C3.18 21.88 7.39 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.28a7.16 7.16 0 0 1 0-2.56V8.61H1.21a11.94 11.94 0 0 0 0 6.78l4.11-3.11z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.39 0 3.18 2.12 1.21 5.5V8.61l4.11 3.11c.94-2.85 3.57-4.97 6.68-4.97z"
              />
            </svg>
          </div>
          <span className="font-sans font-black">
            {currentLang === 'zh' ? (
              <>
                <span className="hidden sm:inline">使用 Google 帳戶登入</span>
                <span className="inline sm:hidden">Google 登入</span>
              </>
            ) : (
              'Sign in with Google'
            )}
          </span>
        </button>
      )}

      {/* Google Simple Auth Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in" id="google-login-modal">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100 animate-slide-up">
            {/* Header with Google-like UI */}
            <div className="bg-slate-50 p-4 text-center border-b border-slate-100 relative shrink-0 font-sans">
              <div className="absolute top-3 left-3 text-[9px] font-mono bg-slate-200/65 text-slate-600 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Shield size={9} />
                <span>Google Secure Auth</span>
              </div>
              
              <div className="w-9 h-9 bg-white rounded-xl mx-auto flex items-center justify-center mb-1.5 shadow-sm border border-slate-100 mt-2.5">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.63v3.01h3.89c2.28-2.1 3.56-5.19 3.56-8.49z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3.01c-1.08.72-2.45 1.16-4.04 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.11C3.18 21.88 7.39 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.28a7.16 7.16 0 0 1 0-2.56V8.61H1.21a11.94 11.94 0 0 0 0 6.78l4.11-3.11z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.39 0 3.18 2.12 1.21 5.5V8.61l4.11 3.11c.94-2.85 3.57-4.97 6.68-4.97z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-black text-slate-800">登入您的 Google 帳戶</h3>
              <p className="text-[10px] text-slate-500">使用 Google 驗證身分，防範虛擬與無效帳號</p>
            </div>

            {/* CONDITIONAL BODY RENDER */}
            {!isCustomMode ? (
              <div className="p-4 overflow-y-auto space-y-3 flex-grow select-none font-sans flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Real-time configuration status banner */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold border border-slate-100 bg-slate-50/50">
                    {isGoogleConfigured ? (
                      <div className="flex items-center space-x-1.5 text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>已連線至 Google 官方驗證端</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-orange-600">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span>開發模擬沙盒 (請見設定指引)</span>
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={() => setShowGcpGuide(!showGcpGuide)}
                      className="text-slate-400 hover:text-[#4285F4] flex items-center space-x-0.5 cursor-pointer text-[10px]"
                    >
                      <HelpCircle size={11} />
                      <span className="underline font-bold">設定指引</span>
                    </button>
                  </div>

                  {/* Dynamic GCP config walkthrough */}
                  {showGcpGuide && (
                    <div className="bg-amber-50/45 border border-amber-200/50 rounded-2xl p-3 text-[10.5px] text-slate-600 space-y-1.5 leading-normal animate-fade-in font-sans">
                      <div className="font-extrabold text-[#4285F4] flex items-center space-x-1 border-b border-amber-100 pb-1">
                        <Key size={11} className="text-amber-600" />
                        <span>Google 雲端帳戶官方驗證配置</span>
                      </div>
                      <p>請前往 <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline inline-flex items-center gap-0.5" referrerPolicy="no-referrer">Google Cloud Platform <ExternalLink size={8} /></a> 註冊用戶憑證：</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>申請 <strong>OAuth 2.0 用戶端 ID</strong> 及 <strong>秘密金鑰</strong></li>
                        <li>設定「已授權的重新導向 URI」，請填入本應用的回調網址：
                          <div className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] font-mono break-all text-slate-800 font-bold select-all mt-1">
                            {window.location.origin}/auth/callback
                          </div>
                        </li>
                        <li>
                          請在設定中將取得的憑證填寫至 <strong className="font-extrabold text-zinc-850">GOOGLE_CLIENT_ID</strong> 與 <strong className="font-extrabold text-zinc-850">GOOGLE_CLIENT_SECRET</strong> 秘密金鑰
                        </li>
                      </ol>
                    </div>
                  )}

                  {/* MAIN REAL GOOGLE AUTH VERIFICATION ENTRANCE */}
                  <div className="py-1">
                    <button
                      type="button"
                      id="google-confirm-btn"
                      onClick={handleRealGoogleLogin}
                      className="w-full flex items-center justify-center space-x-2.5 p-3.5 bg-[#4285F4] hover:bg-[#357ae8] text-white rounded-2xl shadow-md transition cursor-pointer text-center ring-4 ring-blue-500/10 hover:ring-blue-500/20 active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ffffff" opacity="0.9" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#ffffff" opacity="0.8" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ffffff" opacity="0.95" />
                      </svg>
                      <div className="text-left font-sans">
                        <div className="text-xs font-black">使用 Google 帳戶真實現證</div>
                        <div className="text-[9.5px] text-blue-100 font-medium">Verify via Real Google Account</div>
                      </div>
                    </button>

                    {/* Highly Targeted Hint warning for the Google 401 error */}
                    <div className="mt-2.5 bg-amber-500/5 border border-amber-500/15 rounded-2xl p-3 text-[10.5px] text-slate-600 leading-relaxed font-sans shrink-0" id="google-401-troubleshoot-panel">
                      <div className="font-extrabold text-amber-800 flex items-center gap-1 text-[11px] mb-1">
                        ⚠️ 看到 Google 顯示「錯誤 401：invalid_client」？
                      </div>
                      <p className="text-slate-500 text-[10px] leading-normal">
                        這代表您在 AI Studio「Secrets (密鑰設定)」中填寫的 <code className="bg-slate-150 px-1 py-0.5 rounded font-mono font-bold text-[9px] text-[#4285F4]">GOOGLE_CLIENT_ID</code> 有誤或尚未儲存。請務必複製 GCP 憑證頁面中完整的用戶端 ID 欄位。
                      </p>
                      <div className="mt-1.5 font-bold text-[#4285F4] bg-[#4285F4]/5 p-2 rounded-xl text-[9.5px]">
                        💡 預覽小幫手：如果是普通體驗，建議「直接點擊下方：測試快速登入」即可一秒模擬授權登入哦！
                      </div>
                    </div>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-100 text-center"></div>
                    <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold tracking-wider">或在沙盒模擬環境下登入</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>



                  <div className="space-y-1.5">
                    {/* Account 1: User's real email */}
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('topztar@gmail.com', '沙貝忠實饕客', mockAvatars[0])}
                      className="w-full flex items-center space-x-2.5 p-3.5 bg-slate-50 hover:bg-slate-100/80 active:bg-slate-200/50 border border-slate-100 hover:border-slate-200 rounded-2xl transition cursor-pointer text-left focus:outline-none"
                    >
                      <img src={mockAvatars[0]} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-800 truncate">沙貝忠實饕客 (模擬沙盒)</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">topztar@gmail.com</div>
                      </div>
                      <div className="text-[9px] font-black text-[#4285F4] bg-blue-50 px-2 py-1 rounded-full shrink-0">
                        測試登入
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCustomMode(true)}
                    className="w-full text-center py-2 text-xs text-[#4285F4] hover:text-[#357ae8] font-black border border-dashed border-slate-200 hover:border-[#4285F4]/40 rounded-xl bg-white transition hover:bg-blue-50/20 cursor-pointer"
                  >
                    + 測試其他 Google 模擬帳戶
                  </button>
                </div>

                <div className="pt-2">
                  <div className="bg-blue-50/60 rounded-xl p-2 border border-blue-500/10 flex items-start space-x-1.5 text-[9px] text-blue-900 leading-normal mb-2.5 font-sans">
                    <CheckCircle size={11} className="mt-0.5 shrink-0 text-blue-600" />
                    <p>
                      <strong className="text-blue-950 font-bold">點數狂飆：</strong>
                      一鍵快速授權安全登入，餐點消費享每 20 元累積 1 點，隨時兌換美食豪禮！
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    退出登入
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 overflow-y-auto space-y-3 flex-grow select-none font-sans flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Back Link */}
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className="flex items-center space-x-1 text-slate-400 hover:text-[#4285F4] text-[10px] font-black cursor-pointer transition mb-2"
                  >
                    <ArrowLeft size={11} />
                    <span>返回選擇帳戶 (Back)</span>
                  </button>

                  {/* Custom Email Input */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Google 帳戶電子信箱 (Google Account Email)
                    </label>
                    <input
                      type="email"
                      id="google-email-input"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="請輸入 Google 信箱 (例如: info@gmail.com)"
                      className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#4285F4] rounded-xl px-2.5 py-2 text-xs text-slate-800 font-mono font-bold"
                    />
                  </div>

                  {/* Custom Name Input */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Google 會員帳戶暱稱 (Google Account Name)
                    </label>
                    <input
                      type="text"
                      id="google-username-input"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="請輸入暱稱"
                      className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#4285F4] rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold"
                    />
                  </div>

                  {/* Avatar select */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      選擇 Google 帳戶頭像 (Google Avatar)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {mockAvatars.map((url, i) => (
                        <button
                          key={i}
                          id={`google-avatar-btn-${i}`}
                          type="button"
                          onClick={() => setAvatarIndex(i)}
                          className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                            avatarIndex === i ? 'border-[#4285F4] scale-102 shadow-sm' : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <img src={url} alt="mock avatar" className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
                          {avatarIndex === i && (
                            <div className="absolute top-0.5 right-0.5 bg-[#4285F4] text-white rounded-full p-0.5">
                              <CheckCircle size={8} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50/60 rounded-xl p-2 border border-blue-150/50 text-[10px] text-blue-900 leading-tight">
                    📌 填妥上方 Google 帳戶欄位即可安全進行模擬帳戶串接。
                  </div>
                </div>

                <div className="flex space-x-2 pt-2 font-sans shrink-0">
                  <button
                    id="google-cancel-btn"
                    onClick={() => setIsCustomMode(false)}
                    className="flex-1 border border-slate-200 text-slate-500 py-2 rounded-xl font-semibold text-xs text-center cursor-pointer hover:bg-slate-50 transition"
                  >
                    取消
                  </button>
                  <button
                    id="google-confirm-btn"
                    onClick={handleSimulateLogin}
                    className="flex-1 bg-[#4285F4] hover:bg-[#357ae8] text-white py-2 rounded-xl font-black text-xs text-center cursor-pointer transition flex items-center justify-center space-x-1"
                  >
                    <LogIn size={12} />
                    <span>授權並登入</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
