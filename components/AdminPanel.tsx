import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Clock, MapPin, Phone, User, CheckCircle2, Truck, Box, Sparkles, ChevronDown, Users, Coins, Search, Save, X } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminPanelProps {
  adminId: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  items: any[];
}

interface UserData {
  tgId: number;
  name: string;
  phone: string;
  points: number;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ adminId }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPoints, setEditingPoints] = useState<{tgId: number, value: number} | null>(null);

  const statuses = ["Принят", "Собираем заказ", "Заказ собран", "Доставляем заказ", "Доставлено"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/admin/orders?adminId=${adminId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success) setOrders(ordersData.orders);

      const usersRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/admin/users?adminId=${adminId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const usersData = await usersRes.json();
      if (usersData.success) setUsers(usersData.users);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const updatePoints = async (tgId: number, newPoints: number) => {
    setUpdatingId(tgId.toString());
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/admin/users/${tgId}/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ points: newPoints, adminId })
      });
      const data = await response.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.tgId === tgId ? { ...u, points: newPoints } : u));
        setEditingPoints(null);
      }
    } catch (err) {
      console.error("Error updating points:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone.includes(searchQuery) ||
    u.tgId.toString().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-medium">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24 space-y-6">
      {/* Header Tabs */}
      <div className="bg-white/10 p-1 rounded-2xl flex backdrop-blur-md">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-[#D4AF37] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
        >
          <Package className="w-4 h-4" />
          Заказы
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-[#D4AF37] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
        >
          <Users className="w-4 h-4" />
          Клиенты
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <motion.div 
            key="orders-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            {orders.length === 0 ? (
              <div className="bg-white p-10 rounded-[32px] text-center border border-stone-100 shadow-xl">
                <Package className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                <p className="text-stone-400 font-bold serif">Заказов пока нет</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-[32px] border border-stone-100 shadow-xl overflow-hidden">
                  <div className="p-5 border-b border-stone-50 flex justify-between items-start bg-stone-50/50">
                    <div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                        № {order.id.split('-')[0].replace('order:', '')}
                      </div>
                      <div className="text-xs text-stone-500 font-medium">
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-tight ${
                      order.status === 'Доставлено' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-[#D4AF37] border border-amber-100'
                    }`}>
                      {order.status}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Клиент</p>
                          <p className="text-sm font-bold text-stone-700">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Телефон</p>
                          <p className="text-sm font-bold text-stone-700">{order.customer.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Адрес</p>
                        <p className="text-sm font-bold text-stone-700">{order.customer.city}, {order.customer.address}</p>
                      </div>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-4 space-y-2 border border-stone-100">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Состав заказа</p>
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs font-medium text-stone-600">
                          <span>{item.name} <span className="text-stone-300 ml-1">x{item.quantity}</span></span>
                          <span className="font-bold text-stone-800">{item.price * item.quantity} ₽</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
                        <span>Итого:</span>
                        <span className="text-[#D4AF37]">{order.total} ₽</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Управление заказом</p>
                      <div className="grid grid-cols-2 gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(order.id, status)}
                            disabled={updatingId === order.id || order.status === status}
                            className={`px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${
                              order.status === status 
                                ? 'bg-[#D4AF37] text-white border-[#D4AF37] shadow-md' 
                                : 'bg-white text-stone-500 border-stone-100 hover:border-[#D4AF37]/30'
                            } ${updatingId === order.id ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="users-tab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {/* User Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text"
                placeholder="Поиск по имени, тел. или ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            {filteredUsers.length === 0 ? (
              <div className="bg-white p-10 rounded-[32px] text-center shadow-xl">
                <Users className="w-12 h-12 text-stone-100 mx-auto mb-4" />
                <p className="text-stone-400 font-bold serif">Клиенты не найдены</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.tgId} className="bg-white rounded-[32px] border border-stone-100 shadow-xl overflow-hidden">
                  <div className="p-5 flex items-center justify-between border-b border-stone-50 bg-stone-50/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#0ABAB5]/10 text-[#0ABAB5] rounded-full flex items-center justify-center font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800 leading-tight">{user.name}</h4>
                        <p className="text-xs text-stone-400 font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">ID</p>
                       <p className="text-xs font-mono text-stone-500">{user.tgId}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 text-[#D4AF37] rounded-xl flex items-center justify-center">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Баланс баллов</p>
                         <div className="flex items-center gap-2">
                            {editingPoints?.tgId === user.tgId ? (
                              <input 
                                type="number"
                                value={editingPoints.value}
                                onChange={(e) => setEditingPoints({...editingPoints, value: parseInt(e.target.value) || 0})}
                                className="w-20 px-2 py-1 border border-[#D4AF37] rounded-lg text-sm font-bold text-[#D4AF37] focus:outline-none"
                                autoFocus
                              />
                            ) : (
                              <span className="text-xl font-black text-stone-800">{user.points}</span>
                            )}
                            <span className="text-[10px] font-bold text-stone-400">Б</span>
                         </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingPoints?.tgId === user.tgId ? (
                        <>
                          <button 
                            onClick={() => updatePoints(user.tgId, editingPoints.value)}
                            disabled={updatingId === user.tgId.toString()}
                            className="p-2.5 bg-[#D4AF37] text-white rounded-xl shadow-md active:scale-95 transition-all"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setEditingPoints(null)}
                            className="p-2.5 bg-stone-100 text-stone-400 rounded-xl hover:bg-stone-200 transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setEditingPoints({tgId: user.tgId, value: user.points})}
                          className="px-4 py-2 bg-stone-800 text-white rounded-xl font-bold text-xs shadow-md hover:bg-black active:scale-95 transition-all"
                        >
                          Редактировать
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
