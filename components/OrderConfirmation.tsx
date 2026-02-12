import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Calendar, MapPin, Phone, User, Home, MessageSquare } from 'lucide-react';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  house: string;
  flat: string;
  date: string;
  time: string;
  comment: string;
  isRecipient: boolean;
  recipientName: string;
  recipientPhone: string;
  tgId?: number;
}

interface OrderConfirmationProps {
  customerInfo: CustomerInfo;
  orderNumber: string;
  total: number;
  deliveryDate: string;
  onReset: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  customerInfo, 
  orderNumber, 
  total,
  onReset 
}) => {
  return (
    <div className="max-w-md mx-auto py-8 px-4 pb-20">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm border border-white/30">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 serif">Заказ принят!</h1>
        <p className="text-white/80">Спасибо за ваш заказ, {customerInfo.name.split(' ')[0]}!</p>
        <div className="mt-4 inline-block px-4 py-1.5 bg-[#D4AF37] rounded-full text-sm font-bold text-white shadow-lg border border-white/20">
          № {orderNumber.includes(':') ? orderNumber.split(':')[1].split('-')[0] : orderNumber}
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] p-6 shadow-2xl border border-stone-100 space-y-6"
      >
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-stone-800 border-b border-stone-100 pb-2 serif flex items-center gap-2">
            <Home className="w-5 h-5 text-[#D4AF37]" />
            Детали доставки
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#D4AF37] mt-1 shrink-0" />
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Когда</p>
                <p className="text-stone-700 font-bold leading-tight">
                  {new Date(customerInfo.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  <span className="text-stone-400 font-medium ml-1">в {customerInfo.time}</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D4AF37] mt-1 shrink-0" />
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Куда</p>
                <p className="text-stone-700 font-bold leading-tight">
                  {customerInfo.city}, {customerInfo.address}, д. {customerInfo.house}
                  {customerInfo.flat && `, кв. ${customerInfo.flat}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#D4AF37] mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Получатель</p>
                <p className="text-stone-700 font-bold leading-tight">
                  {customerInfo.isRecipient ? customerInfo.name : customerInfo.recipientName}
                </p>
                <p className="text-stone-500 text-sm font-medium">
                  {customerInfo.isRecipient ? customerInfo.phone : customerInfo.recipientPhone}
                </p>
              </div>
            </div>

            {customerInfo.comment && (
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <MessageSquare className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                <p className="text-sm text-stone-600 italic">"{customerInfo.comment}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#D4AF37]/5 rounded-[24px] p-5 flex justify-between items-center border border-[#D4AF37]/10">
          <span className="font-bold text-stone-600">К оплате</span>
          <span className="text-2xl font-bold text-[#D4AF37]">{total.toLocaleString('ru-RU')} ₽</span>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-4 bg-stone-800 text-white rounded-[20px] font-bold text-lg shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          Вернуться в магазин
        </button>
      </motion.div>

      <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs text-white/90 font-medium leading-relaxed">
          Статус заказа будет обновляться в вашем Telegram боте в режиме реального времени.
        </p>
      </div>
    </div>
  );
};
