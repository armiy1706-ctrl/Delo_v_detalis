import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Clock, MapPin, Phone, User, CheckCircle2, Truck, Box, Sparkles, ChevronDown } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminPanelProps {
  adminId: number;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ adminId }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses = ["Принят", "Собираем заказ", "Заказ собран", "Доставляем заказ", "Доставлено"];

  const fetchOrders = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/admin/orders?adminId=${adminId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [adminId]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status: newStatus, adminId })
      });
      const data = await response.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium">Загрузка заказов...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800 serif">Панель управления</h1>
        <button 
          onClick={fetchOrders}
          className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-stone-200"
        >
          <Clock className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center border border-stone-100 shadow-sm">
            <Package className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400">Заказов пока нет</p>
          </div>
        ) : (
          orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-stone-50 flex justify-between items-start bg-stone-50/50">
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                    ID: {order.id.split('-')[0].replace('order:', '')}
                  </div>
                  <div className="text-xs text-stone-500">
                    {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                  order.status === 'Доставлено' ? 'bg-green-100 text-green-600' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                }`}>
                  {order.status}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <User className="w-4 h-4 text-stone-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Клиент</p>
                      <p className="text-sm font-medium text-stone-700">{order.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Телефон</p>
                      <p className="text-sm font-medium text-stone-700">{order.customer.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Адрес</p>
                    <p className="text-sm font-medium text-stone-700">{order.customer.city}, {order.customer.address}</p>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Товары</p>
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs text-stone-600">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-bold">{item.price * item.quantity} ₽</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-800">
                    <span>Итого:</span>
                    <span>{order.total} ₽</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Сменить статус</p>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        disabled={updatingId === order.id || order.status === status}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                          order.status === status 
                            ? 'bg-[#D4AF37] text-white' 
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        } ${updatingId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
