import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Package, MapPin, Calendar, Clock, User, Phone, Wallet, ArrowLeft } from 'lucide-react';

interface OrderConfirmationProps {
  customerInfo: {
    name: string;
    phone: string;
    city: string;
    address: string;
    house: string;
    flat: string;
    date: string;
    time: string;
    isRecipient: boolean;
    recipientName: string;
    recipientPhone: string;
  };
  orderNumber: string;
  total: number;
  deliveryDate: string;
  onReset: () => void;
  cartItems?: any[];
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  customerInfo, 
  orderNumber, 
  total, 
  onReset,
  cartItems = []
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pb-12"
    >
      {/* Success Header */}
      <div className="bg-white rounded-[40px] p-8 text-center shadow-2xl border border-stone-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#0ABAB5]" />
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 serif mb-2">
          Привет, {customerInfo.name.split(' ')[0]}!
        </h2>
        <p className="text-stone-500 font-medium">Ура, ваш заказ {orderNumber}</p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-stone-100">
        <div className="p-6 space-y-6">
          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Package className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Состав заказа</span>
            </div>
            <div className="space-y-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-sm font-bold text-stone-700">{item.name}</span>
                  <span className="text-sm font-bold text-[#D4AF37]">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-4">
             <div className="flex gap-4">
               <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center shrink-0 border border-stone-100">
                 <MapPin className="w-5 h-5 text-stone-400" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Адрес доставки</p>
                 <p className="text-sm font-bold text-stone-700">
                   {customerInfo.address}, д. {customerInfo.house}, кв. {customerInfo.flat}
                 </p>
               </div>
             </div>

             <div className="flex gap-4">
               <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center shrink-0 border border-stone-100">
                 <Calendar className="w-5 h-5 text-stone-400" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Дата доставки</p>
                 <p className="text-sm font-bold text-stone-700">{customerInfo.date.split('-').reverse().join('.')}</p>
               </div>
             </div>

             <div className="flex gap-4">
               <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center shrink-0 border border-stone-100">
                 <Clock className="w-5 h-5 text-stone-400" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Время доставки</p>
                 <p className="text-sm font-bold text-stone-700">{customerInfo.time}</p>
               </div>
             </div>

             <div className="flex gap-4">
               <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center shrink-0 border border-stone-100">
                 <User className="w-5 h-5 text-stone-400" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Получатель</p>
                 <p className="text-sm font-bold text-stone-700">
                   {customerInfo.isRecipient ? customerInfo.name : customerInfo.recipientName}
                 </p>
               </div>
             </div>

             {!customerInfo.isRecipient && (
               <div className="flex gap-4">
                 <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center shrink-0 border border-stone-100">
                   <Phone className="w-5 h-5 text-stone-400" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Телефон получателя</p>
                   <p className="text-sm font-bold text-stone-700">{customerInfo.recipientPhone}</p>
                 </div>
               </div>
             )}
          </div>

          {/* Sum */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <span className="text-lg font-bold text-stone-800 serif">Сумма заказа:</span>
            <span className="text-2xl font-bold text-[#0ABAB5]">{total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-stone-50 border-t border-stone-100">
          <button 
            className="w-full py-5 bg-[#D4AF37] text-white rounded-2xl font-bold text-lg shadow-xl shadow-amber-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Wallet className="w-6 h-6" />
            Перейти к оплате
          </button>
        </div>
      </div>

      {/* Back to Catalog */}
      <button 
        onClick={onReset}
        className="w-full py-4 flex items-center justify-center gap-2 text-white font-bold hover:text-stone-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Вернуться в каталог
      </button>
    </motion.div>
  );
};
