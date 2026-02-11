import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Calendar, MapPin, Phone, User } from 'lucide-react';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  deliveryDate: string;
  deliveryTime: string;
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
    <div className="max-w-md mx-auto py-8 px-4">
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
        <div className="mt-4 inline-block px-4 py-1 bg-[#D4AF37] rounded-full text-sm font-bold text-white shadow-lg">
          Номер заказа: {orderNumber.includes(':') ? orderNumber.split(':')[1] : orderNumber}
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 space-y-6"
      >
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-stone-800 border-b border-stone-50 pb-2 serif">Детали доставки</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#D4AF37] mt-0.5" />
              <div>
                <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Дата и время</p>
                <p className="text-stone-700 font-medium">
                  {new Date(customerInfo.deliveryDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} в {customerInfo.deliveryTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5" />
              <div>
                <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Адрес</p>
                <p className="text-stone-700 font-medium">
                  {customerInfo.city}, {customerInfo.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#D4AF37] mt-0.5" />
              <div>
                <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Получатель</p>
                <p className="text-stone-700 font-medium">{customerInfo.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#D4AF37] mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Телефон</p>
                <p className="text-stone-700 font-medium">{customerInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 flex justify-between items-center border border-amber-100">
          <span className="font-bold text-stone-700">Итого оплачено</span>
          <span className="text-2xl font-bold text-[#D4AF37]">{total.toLocaleString('ru-RU')} ₽</span>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold shadow-lg hover:bg-stone-800 transition-colors"
        >
          Вернуться в магазин
        </button>
      </motion.div>

      <p className="text-center text-white/60 text-sm mt-8">
        Статус заказа будет отправлен в ваш Telegram бот.
      </p>
    </div>
  );
};
