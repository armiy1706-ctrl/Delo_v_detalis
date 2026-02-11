import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Package, Settings, LogOut, ChevronRight, IdCard, Loader2, Calendar } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  items: any[];
}

interface ProfilePageProps {
  user: TelegramUser | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/history?tgId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  if (showHistory) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-4 pt-6 space-y-6 pb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-stone-100 rounded-full">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h2 className="text-2xl font-bold text-stone-900">История заказов</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            <p className="text-stone-500">Загружаем заказы...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200">
            <Package className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500">У вас пока нет заказов</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase">№ {order.id.split(':')[1]}</p>
                    <div className="flex items-center gap-1 text-stone-500 text-sm mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    Завершен
                  </span>
                </div>
                <div className="border-t border-stone-50 pt-3 flex justify-between items-center">
                  <p className="text-stone-600 text-sm">
                    {order.items.length} {order.items.length === 1 ? 'букет' : 'букета'}
                  </p>
                  <p className="font-bold text-rose-600">{order.total.toLocaleString('ru-RU')} ₽</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 pt-6 space-y-6 pb-12"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 shadow-inner">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-12 h-12" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-900">
            {user ? `${user.first_name} ${user.last_name || ''}` : 'Гость'}
          </h2>
          <p className="text-stone-500 text-sm">@{user?.username || 'user'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 divide-y divide-stone-50 shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
              <IdCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Telegram ID</p>
              <p className="font-mono text-stone-700">{user?.id || 'Не определен'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest px-2">Личные данные</h3>
        <div className="bg-white rounded-3xl border border-stone-100 divide-y divide-stone-50 shadow-sm overflow-hidden">
          <button 
            onClick={() => setShowHistory(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <span className="font-medium text-stone-700">История заказов</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
          
          <button className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-medium text-stone-700">Конфиденциальность</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-100 text-stone-500 rounded-xl">
                <Settings className="w-5 h-5" />
              </div>
              <span className="font-medium text-stone-700">Настройки</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
        </div>
      </div>

      <button className="w-full py-4 text-rose-500 font-semibold flex items-center justify-center gap-2 hover:bg-rose-50 rounded-2xl transition-colors mt-4">
        <LogOut className="w-5 h-5" />
        Выйти из аккаунта
      </button>

      <div className="text-center">
        <p className="text-[10px] text-stone-300 font-bold uppercase tracking-[0.2em]">Bloom & Stem v1.2.0</p>
      </div>
    </motion.div>
  );
};
