import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Package, Settings, LogOut, ChevronRight, IdCard, Loader2, Calendar, Truck, CreditCard, RotateCcw, FileText, ArrowLeft, Gift, Star } from 'lucide-react';
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
  status?: string;
}

interface ProfilePageProps {
  user: TelegramUser | null;
  points: number;
}

type ActiveSection = 'main' | 'history' | 'privacy' | 'delivery' | 'returns';

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, points }) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('main');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

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

  const fetchUserPhoto = async () => {
    if (!user?.id) return;
    if (user.photo_url) {
      setProfilePhoto(user.photo_url);
      return;
    }
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/user-photo?tgId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      if (data.success && data.photoUrl) {
        setProfilePhoto(data.photoUrl);
      }
    } catch (err) {
      console.error("User photo fetch error:", err);
    }
  };

  useEffect(() => {
    if (user?.id) { fetchUserPhoto(); }
  }, [user?.id]);

  useEffect(() => {
    if (activeSection === 'history') { fetchHistory(); }
  }, [activeSection]);

  const renderHistory = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-0 pt-6 space-y-6 pb-12">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setActiveSection('main')} className="p-2 bg-white/20 rounded-full text-white"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-2xl font-bold text-white serif">История заказов</h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
          <p className="text-white/80">Загружаем заказы...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white/10 rounded-3xl border border-dashed border-white/20 backdrop-blur-sm">
          <Package className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/80">У вас пока нет заказов</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-[28px] border border-stone-100 shadow-xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">№ {order.id.split(':')[1].split('-')[0]}</p>
                  <div className="flex items-center gap-1 text-stone-400 text-xs mt-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-tighter ${
                  order.status === 'Доставлено' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-[#D4AF37] border border-amber-100'
                }`}>
                  {order.status || 'Принят'}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                 {order.items.map((item, idx) => (
                   <div key={idx} className="w-12 h-12 rounded-lg bg-stone-100 shrink-0 border border-stone-200 overflow-hidden">
                     <img src={item.image} alt="" className="w-full h-full object-cover opacity-80" />
                   </div>
                 ))}
              </div>
              <div className="pt-3 border-t border-stone-50 flex justify-between items-center">
                <p className="text-stone-500 text-sm font-medium">Сумма заказа</p>
                <p className="font-bold text-[#D4AF37] text-lg">{order.total.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderContentPage = (title: string, icon: React.ReactNode, content: string) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-0 pt-6 space-y-6 pb-12">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setActiveSection('main')} className="p-2 bg-white/20 rounded-full text-white"><ArrowLeft className="w-6 h-6" /></button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl text-white">{icon}</div>
          <h2 className="text-xl font-bold text-white serif leading-tight">{title}</h2>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-xl text-stone-600 space-y-4 leading-relaxed">
        {content.split('\n\n').map((paragraph, idx) => (<p key={idx}>{paragraph}</p>))}
        <div className="pt-4 border-t border-stone-50 text-xs text-stone-400">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</div>
      </div>
    </motion.div>
  );

  if (activeSection === 'history') return renderHistory();
  if (activeSection === 'privacy') return renderContentPage('Конфиденциальность', <Shield className="w-5 h-5" />, "Ваши данные в безопасности...");
  if (activeSection === 'delivery') return renderContentPage('Доставка', <Truck className="w-5 h-5" />, "Доставка по всему городу...");
  if (activeSection === 'returns') return renderContentPage('Возврат', <RotateCcw className="w-5 h-5" />, "Возврат невозможен для цветов...");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white shadow-2xl overflow-hidden border-4 border-white relative">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" onError={() => setProfilePhoto(null)} />
          ) : (
            <User className="w-12 h-12 text-white/50" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white serif">{user ? `${user.first_name} ${user.last_name || ''}` : 'Гость'}</h2>
          <p className="text-white/60 text-sm font-medium">@{user?.username || 'user'}</p>
        </div>
      </div>

      {/* Bonus Card */}
      <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-[32px] p-6 shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-black/5 rounded-full blur-xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/20">
             <Star className="w-3.5 h-3.5 text-white fill-current" />
             <span className="text-[10px] font-bold text-white uppercase tracking-widest">Premium Bonus</span>
          </div>
          <span className="text-4xl font-black text-white">{points}</span>
          <span className="text-xs font-bold text-white/80 uppercase tracking-[0.2em]">Бонусных баллов</span>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center text-white/80 text-[10px] font-bold uppercase tracking-widest">
           <span>1 балл = 1 рубль</span>
           <div className="flex items-center gap-1">
             <Gift className="w-3 h-3" />
             <span>Кэшбэк 1%</span>
           </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        <div className="bg-white rounded-[32px] border border-stone-100 divide-y divide-stone-50 shadow-xl overflow-hidden">
          <button onClick={() => setActiveSection('history')} className="w-full p-5 flex items-center justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-[#D4AF37] rounded-2xl flex items-center justify-center"><Package className="w-5 h-5" /></div>
              <span className="font-bold text-stone-700">История заказов</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
          <button onClick={() => setActiveSection('delivery')} className="w-full p-5 flex items-center justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-[#D4AF37] rounded-2xl flex items-center justify-center"><Truck className="w-5 h-5" /></div>
              <span className="font-bold text-stone-700">Доставка и оплата</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
          <button onClick={() => setActiveSection('returns')} className="w-full p-5 flex items-center justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-[#D4AF37] rounded-2xl flex items-center justify-center"><RotateCcw className="w-5 h-5" /></div>
              <span className="font-bold text-stone-700">Условия возврата</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
          <button onClick={() => setActiveSection('privacy')} className="w-full p-5 flex items-center justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-stone-50 text-stone-400 rounded-2xl flex items-center justify-center"><Shield className="w-5 h-5" /></div>
              <span className="font-bold text-stone-700">Приватность</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">Дело в деталях v1.5.0</p>
      </div>
    </motion.div>
  );
};
