import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, X, Info, ChevronRight, Gift } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartPageProps {
  items: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  userPoints: number;
  usePoints: boolean;
  setUsePoints: (value: boolean) => void;
  onCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  updateQuantity,
  removeFromCart,
  userPoints,
  usePoints,
  setUsePoints,
  onCheckout
}) => {
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceCharge = Math.round(itemsTotal * 0.1); // 10% service charge
  const deliveryCost = 350;
  const potentialPoints = Math.round(itemsTotal * 0.01); // 1% cashback
  
  const discount = usePoints ? Math.min(Math.floor(userPoints * 0.3), itemsTotal) : 0;
  const total = itemsTotal + serviceCharge + deliveryCost - discount;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
          <Gift className="w-10 h-10 text-white/50" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 serif">Корзина пуста</h3>
        <p className="text-white/60 mb-8">Добавьте в корзину наши прекрасные букеты, чтобы порадовать близких.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {/* Items List */}
      <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-stone-100">
        <div className="p-1">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 items-center border-b border-stone-50 last:border-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-stone-800 line-clamp-1 serif">{item.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-[#D4AF37]">{item.price.toLocaleString('ru-RU')} ₽</span>
                  <div className="flex items-center gap-3 bg-stone-50 px-2 py-1 rounded-xl border border-stone-100">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-1 text-stone-200 hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Charge & Delivery */}
      <div className="bg-white rounded-[24px] p-5 shadow-xl border border-stone-100 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-stone-400 font-bold uppercase tracking-wider">Сервисный сбор</span>
          <span className="font-bold text-stone-800">{serviceCharge.toLocaleString('ru-RU')} ₽</span>
        </div>
        
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Ближайшая доставка</span>
            <span className="text-sm font-bold text-stone-700">Сегодня, 18:00 - 20:00</span>
          </div>
          <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-xl text-xs font-bold border border-[#D4AF37]/20">
            {deliveryCost} ₽
          </div>
        </div>
      </div>

      {/* Bonus Points Toggle */}
      <div className="bg-white rounded-[24px] p-5 shadow-xl border border-stone-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37]">
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-stone-700">Списать баллы (30%)</span>
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">Доступно: {Math.floor(userPoints * 0.3)} Б</span>
            </div>
          </div>
          <button 
            onClick={() => userPoints > 0 && setUsePoints(!usePoints)}
            disabled={userPoints === 0}
            className={`w-12 h-6 rounded-full transition-all relative ${usePoints ? 'bg-[#D4AF37]' : 'bg-stone-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${usePoints ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        {usePoints && (
          <div className="text-[10px] text-stone-400 italic px-2">
            *Можно списать не более 30% от накопленных баллов
          </div>
        )}
      </div>

      {/* Summary & Checkout */}
      <div className="bg-white rounded-[32px] p-6 shadow-xl border border-stone-100 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-stone-800 serif">Итого:</span>
          <div className="flex flex-col items-end">
             {usePoints && discount > 0 && (
               <span className="text-xs text-red-500 font-bold line-through">{(total + discount).toLocaleString('ru-RU')} ₽</span>
             )}
             <span className="text-2xl font-bold text-[#D4AF37]">{total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <button 
          onClick={onCheckout}
          className="w-full py-4 bg-stone-800 text-white rounded-[20px] font-bold text-lg shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Перейти к оформлению
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="bg-stone-50 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-400 font-medium">Накоплено баллов:</span>
            <span className="font-bold text-stone-800">{userPoints}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-400 font-medium">Будет начислено:</span>
            <span className="font-bold text-[#D4AF37]">+{potentialPoints}</span>
          </div>
          <div className="pt-2 border-t border-stone-100 flex justify-center">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">1 балл = 1 рубль</span>
          </div>
        </div>
      </div>
    </div>
  );
};
