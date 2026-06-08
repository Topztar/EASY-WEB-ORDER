import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Language } from '../types';
import { ChefHat, Printer, Trash2, Check, Flame, Ban, RefreshCw, Volume2, Wifi, Edit, Save, Settings } from 'lucide-react';

interface KitchenDisplaySystemProps {
  currentLang: Language;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  printLogs: any[];
  onClearPrintLogs: () => Promise<void>;
  printerIp: string;
  onUpdatePrinterIp: (ip: string) => Promise<{ success: boolean; error?: string }>;
  onPrintTestPage: () => Promise<{ success: boolean; error?: string }>;
}

export const KitchenDisplaySystem: React.FC<KitchenDisplaySystemProps> = ({
  currentLang,
  orders,
  onUpdateOrderStatus,
  printLogs,
  onClearPrintLogs,
  printerIp,
  onUpdatePrinterIp,
  onPrintTestPage,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active'>('active');
  const [beepSim, setBeepSim] = useState(false);

  // Printer configuration states
  const [isEditingIp, setIsEditingIp] = useState(false);
  const [ipInput, setIpInput] = useState(printerIp);
  const [testLoading, setTestLoading] = useState(false);
  const [printerSuccess, setPrinterSuccess] = useState<string | null>(null);
  const [printerError, setPrinterError] = useState<string | null>(null);

  useEffect(() => {
    setIpInput(printerIp);
  }, [printerIp]);

  // Filter orders
  const activeOrders = orders.filter((o) => {
    if (filterStatus === 'active') {
      return o.status === 'pending' || o.status === 'preparing';
    }
    return true;
  });

  const handleStatusChange = async (id: string, nextStatus: OrderStatus) => {
    // Play sound simulation
    setBeepSim(true);
    setTimeout(() => setBeepSim(false), 800);
    await onUpdateOrderStatus(id, nextStatus);
  };

  const getUrgencyText = (createdAt: string) => {
    const diffMins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    if (diffMins < 5) return { text: '剛剛下單 Fresh', style: 'bg-emerald-500/10 text-[#00C300] border-emerald-500/20' };
    if (diffMins < 15) return { text: `延遲 ${diffMins} 分鐘`, style: 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold animate-pulse' };
    return { text: `嚴重超時 ${diffMins} 分!`, style: 'bg-red-500/10 text-red-400 border-red-500/20 uppercase font-black tracking-wider animate-bounce' };
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 text-left text-white" id="kds-panel">
      {/* Sound notification indicator simulation */}
      {beepSim && (
        <div className="fixed top-8 right-8 bg-[#161616] border border-[#E5B453] shadow-2xl text-white px-5 py-3 rounded-xl flex items-center space-x-2 z-50 animate-bounce">
          <Volume2 className="text-[#E5B453] animate-pulse" size={20} />
          <span className="font-bold text-xs text-[#E5B453]">🔊 [逼逼！廚房票據機已列印全新工作單]</span>
        </div>
      )}

      {/* Main Culinary Tickets Workspace */}
      <div className="xl:col-span-3 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#161616] text-white rounded-xl p-5 border border-white/10 gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="bg-[#E5B453] text-[#0F0F0F] p-2.5 rounded-xl">
              <ChefHat size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif tracking-wide text-white">沙貝廚房備餐顯示屏 (KDS Monitor)</h2>
              <p className="text-white/40 text-xs">即時同步桌席點單 · 最新 1 秒連線正常</p>
            </div>
          </div>

          <div className="flex bg-black/40 p-1.5 rounded-xl self-start sm:self-center border border-white/10">
            <button
              id="kds-filter-active"
              onClick={() => setFilterStatus('active')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                filterStatus === 'active' ? 'bg-[#E5B453] text-[#0F0F0F]' : 'text-white/40 hover:text-white'
              }`}
            >
              未完成 (備餐中)
            </button>
            <button
              id="kds-filter-all"
              onClick={() => setFilterStatus('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                filterStatus === 'all' ? 'bg-[#E5B453] text-[#0F0F0F]' : 'text-white/40 hover:text-white'
              }`}
            >
              全部歷史票 (All)
            </button>
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-[#161616] border border-white/10 text-center py-20 rounded-xl space-y-3">
            <ChefHat size={45} className="mx-auto text-white/10" />
            <p className="text-white/40 font-bold text-sm">目前沒有任何待備餐點，大家辛苦了！✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="kds-tickets-grid">
            {activeOrders.map((order) => {
              const urg = getUrgencyText(order.createdAt);
              return (
                <div
                  key={order.id}
                  id={`kds-card-${order.id}`}
                  className={`bg-[#161616] border rounded-xl overflow-hidden shadow-md flex flex-col justify-between text-left transition ${
                    order.status === 'pending'
                      ? 'border-[#E5B453]/40 hover:border-[#E5B453]'
                      : (order.status === 'preparing' ? 'border-sky-500/40 hover:border-sky-500' : 'border-white/10')
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/25 shrink-0">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-white/5 border border-white/10 text-[#E5B453] font-mono font-bold text-xs px-2.5 py-0.5 rounded">
                          {order.id}
                        </span>
                        <span className="font-bold text-base text-white font-serif">
                          {order.tableNumber} 桌
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono block mt-1">
                        下單: {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${urg.style}`}>
                      {urg.text}
                    </span>
                  </div>

                  {/* Ingredients detailed tasks in Chinese */}
                  <div className="p-5 flex-1 min-h-[140px] space-y-4">
                    <div className="space-y-3.5">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-start justify-between border-b border-dashed border-white/5 pb-2">
                          <div className="text-left w-full">
                            <span className="font-bold text-white text-sm block">
                              {it.name.zh} <strong className="text-[#E5B453] font-mono text-base">x {it.qty}</strong> 份
                            </span>

                            {/* customize modifiers indicator */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              <span className="bg-white/5 text-white/85 border border-white/15 text-[10px] font-semibold px-1 rounded font-sans">
                                甜: {it.customization.sweetness === 0 ? '無糖' : (it.customization.sweetness === 1 ? '三分' : (it.customization.sweetness === 2 ? '半糖' : '正常'))}
                              </span>
                              <span className="bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] font-semibold px-1 rounded font-mono">
                                辣: {it.customization.spiciness === 0 ? '不辣' : (it.customization.spiciness === 1 ? '小辣' : (it.customization.spiciness === 2 ? '中辣' : '泰大辣'))}
                              </span>
                              {it.customization.noodleType && (
                                <span className="bg-[#E5B453]/10 text-[#E5B453] border border-[#E5B453]/20 text-[10px] font-semibold px-1 rounded font-sans">
                                  麵: {it.customization.noodleType === 'rice-noodle' ? '河粉' : (it.customization.noodleType === 'vermicelli' ? '米線' : '無')}
                                </span>
                              )}
                              {it.customization.soupBase === 'coconut-milk' && (
                                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-semibold px-1 rounded font-mono">
                                  椰奶(+50)
                                </span>
                              )}
                            </div>
                            
                            {it.customization.notes && (
                              <p className="text-xs text-[#FF4D4D] bg-[#FF4D4D]/5 border border-[#FF4D4D]/15 p-2.5 rounded-xl font-sans mt-2.5">
                                📌 備註：{it.customization.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Status updater actions */}
                  <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between shrink-0">
                    <span className="text-white/40 text-[10px] font-bold uppercase font-mono">
                      付費: {order.paymentMethod.toUpperCase()}
                    </span>

                    <div className="flex space-x-1.5">
                      {order.status === 'pending' && (
                        <button
                          id={`kds-cook-btn-${order.id}`}
                          onClick={() => handleStatusChange(order.id, 'preparing')}
                          className="bg-[#E5B453] hover:bg-[#F0C46B] text-[#0F0F0F] px-4 py-1.5 rounded-lg font-black text-xs flex items-center space-x-1 transition cursor-pointer"
                        >
                          <Flame size={13} className="animate-pulse" />
                          <span>下鍋烹調</span>
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          id={`kds-complete-btn-${order.id}`}
                          onClick={() => handleStatusChange(order.id, 'completed')}
                          className="bg-[#00C300] hover:bg-emerald-500 text-[#0F0F0F] px-4 py-1.5 rounded-lg font-black text-xs flex items-center space-x-1 transition cursor-pointer animate-pulse"
                        >
                          <Check size={13} />
                          <span>出餐完成</span>
                        </button>
                      )}

                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <button
                          id={`kds-cancel-btn-${order.id}`}
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="bg-[#FF4D4D]/10 hover:bg-[#FF4D4D]/25 text-[#FF4D4D] border border-rose-500/20 px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1 transition cursor-pointer"
                          title="取消此單"
                        >
                          <Ban size={12} />
                          <span>刪除</span>
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <span className="text-[#00C300] text-xs font-bold flex items-center space-x-0.5">
                          <Check size={14} />
                          <span>已順利出餐 Done</span>
                        </span>
                      )}

                      {order.status === 'cancelled' && (
                        <span className="text-white/30 text-xs font-bold line-through">
                          已廢棄 Cancel
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LAN Receipt Printer Simulator Terminal Sidebar */}
      <div className="space-y-4">
        <div className="bg-[#161616] border border-white/10 text-white rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2 flex-1 mr-2">
              <Printer className="text-[#E5B453] shrink-0 font-bold" size={18} />
              <div className="text-left w-full">
                <span className="text-[10px] text-white/40 block font-mono">LAN BILL PRINTER</span>
                {isEditingIp ? (
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <input
                      type="text"
                      className="bg-black border border-white/20 text-white font-mono text-[11px] font-bold rounded px-1.5 py-0.5 w-28 focus:outline-none focus:border-[#E5B453]"
                      value={ipInput}
                      onChange={(e) => setIpInput(e.target.value)}
                    />
                    <button
                      onClick={async () => {
                        setPrinterError(null);
                        setPrinterSuccess(null);
                        const res = await onUpdatePrinterIp(ipInput);
                        if (res.success) {
                          setPrinterSuccess('位址設定成功！');
                          setIsEditingIp(false);
                        } else {
                          setPrinterError(res.error || '儲存失敗');
                        }
                      }}
                      className="bg-[#E5B453] text-[#0F0F0F] hover:bg-amber-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition active:scale-95"
                    >
                      儲存
                    </button>
                    <button
                      onClick={() => {
                        setIpInput(printerIp);
                        setIsEditingIp(false);
                      }}
                      className="bg-white/15 h-5 text-white/75 hover:bg-white/25 text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition active:scale-95"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-xs font-bold font-mono text-[#00C300]">{printerIp}</span>
                    <button
                      onClick={() => setIsEditingIp(true)}
                      className="text-white/40 hover:text-[#E5B453] transition rounded p-0.5 cursor-pointer active:scale-95"
                      title="修改印表機位址"
                    >
                      <Edit size={11} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              id="clear-print-logs-btn"
              onClick={onClearPrintLogs}
              className="text-white/45 hover:text-white p-1 rounded hover:bg-white/5 transition"
              title="清除印表管線"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Print Test Action Card */}
          <div className="bg-black/25 rounded-lg border border-white/5 p-2.5 flex flex-col space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50 font-sans flex items-center space-x-1">
                <Wifi size={10} className="text-[#00C300]" />
                <span>通訊埠 3000/TCP 在線</span>
              </span>
              <button
                id="kitchen-print-test-btn"
                disabled={testLoading}
                onClick={async () => {
                  setTestLoading(true);
                  setPrinterSuccess(null);
                  setPrinterError(null);
                  const res = await onPrintTestPage();
                  setTestLoading(false);
                  if (res.success) {
                    setPrinterSuccess('列印測試頁成功發送！');
                  } else {
                    setPrinterError(res.error || '列印失敗');
                  }
                }}
                className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-[#E5B453] hover:text-white font-extrabold text-[10px] py-1 px-2.5 rounded-lg transition flex items-center space-x-1 cursor-pointer disabled:opacity-40"
              >
                {testLoading ? (
                  <RefreshCw size={11} className="animate-spin text-white" />
                ) : (
                  <Printer size={11} />
                )}
                <span>列印測試頁 Test Page</span>
              </button>
            </div>

            {printerSuccess && (
              <p className="text-[9.5px] text-emerald-400 font-sans font-bold">✓ {printerSuccess}</p>
            )}
            {printerError && (
              <p className="text-[9.5px] text-rose-400 font-sans font-bold">⚠️ {printerError}</p>
            )}
          </div>

          <div className="bg-black/40 text-[11px] font-mono p-3.5 rounded-xl overflow-y-auto max-h-[450px] space-y-4 border border-white/5 text-left scrollbar-thin">
            {printLogs.length === 0 ? (
              <div className="text-white/20 text-center py-16 space-y-2">
                <Printer size={25} className="mx-auto text-white/10" />
                <p className="text-xs">列印管線管道閒置中</p>
                <p className="text-[9px] text-white/30 leading-relaxed font-sans max-w-[200px] mx-auto">
                  當點擊加入購物車或完成付款時，系統將模擬 LAN 熱感印表機出單拋送至此。
                </p>
              </div>
            ) : (
              printLogs.map((log, index) => (
                <div
                  key={index}
                  className="bg-[#1C1C1C] text-white p-3.5 rounded-lg border border-white/10 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#E5B453] text-[#0F0F0F] text-[8px] font-black px-1.5 py-0.5 rounded-bl uppercase tracking-wider">
                    {log.type === 'kitchen' ? 'KITCHEN_TKT' : 'CLIENT_BILL'}
                  </div>
                  <div className="text-white/40 text-[9px] mb-2 font-sans flex justify-between">
                    <span>時間: {log.timestamp}</span>
                  </div>
                  <pre className="whitespace-pre font-mono leading-relaxed overflow-x-auto text-[9px] text-white/90">
                    {log.content}
                  </pre>
                  {/* Virtual rip paper edge effect */}
                  <div className="mt-3 border-t border-dashed border-white/10 pt-1 flex justify-between text-[8px] text-white/30 font-sans">
                    <span>sabay_boca_v1.2</span>
                    <span className="text-[#00C300]">100% 傳送正常</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
