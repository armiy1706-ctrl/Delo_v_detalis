import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Package, Settings, LogOut, ChevronRight, IdCard, Loader2, Calendar, Truck, CreditCard, RotateCcw, FileText, ArrowLeft } from 'lucide-react';
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

type ActiveSection = 'main' | 'history' | 'privacy' | 'delivery' | 'returns';

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('main');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (activeSection === 'history') {
      fetchHistory();
    }
  }, [activeSection]);

  const renderHistory = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-4 pt-6 space-y-6 pb-12"
    >
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setActiveSection('main')} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
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
            <div key={order.id} className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase">№ {order.id.split(':')[1]}</p>
                  <div className="flex items-center gap-1 text-stone-500 text-sm mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <span className="bg-amber-50 text-[#D4AF37] text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                  Завершен
                </span>
              </div>
              <div className="border-t border-stone-50 pt-3 flex justify-between items-center">
                <p className="text-stone-600 text-sm">
                  {order.items.length} {order.items.length === 1 ? 'букет' : 'букета'}
                </p>
                <p className="font-bold text-[#D4AF37]">{order.total.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderContentPage = (title: string, icon: React.ReactNode, content: string) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-4 pt-6 space-y-6 pb-12"
    >
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setActiveSection('main')} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white serif leading-tight">{title}</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-lg text-stone-600 space-y-4 leading-relaxed">
        {content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
        <div className="pt-4 border-t border-stone-50 text-xs text-stone-400">
          Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
        </div>
      </div>
    </motion.div>
  );

  if (activeSection === 'history') return renderHistory();
  if (activeSection === 'privacy') return renderContentPage(
    'Политика обработки данных', 
    <FileText className="w-5 h-5 text-[#D4AF37]" />,
    "Мы серьезно относимся к защите ваших данных. При использовании Bloom & Stem вы доверяете нам свою личную информацию.\n\nМы собираем только необходимые данные: ваше имя, номер телефона и адрес для обеспечения доставки заказов. Ваши данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством.\n\nИспользуя сервис, вы соглашаетесь на хранение и обработку предоставленной информации в рамках работы приложения."
  );
  if (activeSection === 'delivery') return renderContentPage(
    'Доставка и оплата', 
    <Truck className="w-5 h-5 text-[#D4AF37]" />,
    "Доставка осуществляется ежедневно с 08:00 до 22:00. Мы доставляем заказы в пределах города и области.\n\nСтоимость доставки рассчитывается автоматически при оформлении заказа. Мы гарантируем свежесть цветов и своевременность прибытия курьера.\n\nОплата возможна онлайн через Telegram Pay, банковской картой или наличными при получении. Все платежи защищены."
  );
  if (activeSection === 'returns') return renderContentPage(
    'Условия возврата', 
    <RotateCcw className="w-5 h-5 text-[#D4AF37]" />,
    "Согласно законодательству РФ, срезанные цветы и горшечные растения надлежащего качества возврату и обмену не подлежат.\n\nОднако, мы дорожим своей репутацией. Если вы получили некачественный товар, пожалуйста, свяжитесь с нами в течение 2 часов после получения, приложив фото. Мы заменим букет или вернем средства, если претензия обоснована."
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 pt-6 space-y-6 pb-12"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white shadow-inner overflow-hidden border-4 border-white">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white serif">
            {user ? `${user.first_name} ${user.last_name || ''}` : 'Гость'}
          </h2>
          <p className="text-white/70 text-sm">@{user?.username || 'user'}</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-3xl border border-white/20 divide-y divide-white/10 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 text-white rounded-xl">
              <IdCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Telegram ID</p>
              <p className="font-mono text-white text-sm">{user?.id || 'Не определен'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest px-4">Сервис и поддержка</h3>
        <div className="bg-white rounded-3xl border border-stone-100 divide-y divide-stone-50 shadow-lg overflow-hidden">
          <button 
            onClick={() => setActiveSection('history')}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 active:bg-stone-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-[#D4AF37] rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <span className="font-medium text-stone-700">История заказов</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
          
          <button 
            onClick={() => setActiveSection('privacy')}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 active:bg-stone-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-[#D4AF37] rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-medium text-stone-700">Политика обработки данных</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>

          <button 
            onClick={() => setActiveSection('delivery')}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 active:bg-stone-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-[#D4AF37] rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <span className="font-medium text-stone-700">Доставка и оплата</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>

          <button 
            onClick={() => setActiveSection('returns')}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 active:bg-stone-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-[#D4AF37] rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="font-medium text-stone-700">Условия возврата</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-stone-50 active:bg-stone-100 transition-colors">
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

      <button className="w-full py-4 text-white font-semibold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors mt-4 border border-white/20">
        <LogOut className="w-5 h-5" />
        Выйти из аккаунта
      </button>

      <div className="text-center pt-4">
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Bloom & Stem v1.4.0</p>
      </div>
    </motion.div>
  );
};
