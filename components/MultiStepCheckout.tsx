import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ChevronUp, Check, ArrowLeft, ArrowRight, Wallet, Calendar, Clock as ClockIcon, AlertCircle } from 'lucide-react';

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

interface MultiStepCheckoutProps {
  initialInfo: CustomerInfo;
  onComplete: (info: CustomerInfo) => void;
  onCancel: () => void;
  total: number;
}

export const MultiStepCheckout: React.FC<MultiStepCheckoutProps> = ({ 
  initialInfo, 
  onComplete, 
  onCancel,
  total
}) => {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<CustomerInfo>(initialInfo);

  // Time Slots Logic
  const allSlots = [
    "08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", 
    "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00", 
    "20:00 - 22:00", "22:00 - 00:00"
  ];

  const availableSlots = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    if (info.date !== today) return allSlots;

    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    
    return allSlots.filter(slot => {
      const startHour = parseInt(slot.split(':')[0]);
      // Slot must start at least 1 hour from now
      return startHour >= currentHour + 1;
    });
  }, [info.date]);

  useEffect(() => {
    // If current selected time is not in available slots, reset it
    if (availableSlots.length > 0 && !availableSlots.includes(info.time)) {
      setInfo(prev => ({ ...prev, time: availableSlots[0] }));
    } else if (availableSlots.length === 0 && info.date === new Date().toISOString().split('T')[0]) {
        // No slots for today, suggest tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        setInfo(prev => ({ ...prev, date: tomorrowStr, time: allSlots[0] }));
    }
  }, [availableSlots, info.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setInfo(prev => ({ ...prev, [name]: val }));
  };

  const nextStep = () => setStep(s => Math.min(3, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col min-h-[80vh] pb-24">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-800 serif">Оформление заказа</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-400">{step}/3</span>
            <button onClick={onCancel} className="p-1.5 bg-stone-50 rounded-lg text-stone-400 hover:text-stone-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#0ABAB5]"
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 1: Customer Contacts */}
        <div className={`bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 transition-all ${step === 1 ? 'ring-2 ring-[#0ABAB5]/20' : ''}`}>
          <div className="p-5 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#0ABAB5] text-white' : 'bg-stone-200 text-stone-500'}`}>
                1
              </div>
              <div>
                <h3 className="font-bold text-stone-800">Заказчик</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Контакты</p>
              </div>
            </div>
            {step > 1 && <Check className="w-5 h-5 text-[#0ABAB5]" />}
          </div>
          
          <AnimatePresence>
            {step === 1 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-5 space-y-4 border-t border-stone-100"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Имя</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={info.name} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all text-sm"
                    placeholder="Артём Юрьевич"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Телефон</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={info.phone} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all text-sm"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">E-mail</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={info.email} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all text-sm"
                    placeholder="mail@example.com"
                  />
                </div>
                <button 
                  onClick={nextStep}
                  disabled={!info.name || !info.phone}
                  className="w-full py-3.5 bg-[#0ABAB5] text-white rounded-xl font-bold shadow-lg shadow-[#0ABAB5]/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Продолжить
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 2: Delivery Info */}
        <div className={`bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 transition-all ${step === 2 ? 'ring-2 ring-[#0ABAB5]/20' : ''}`}>
          <div className="p-5 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#0ABAB5] text-white' : 'bg-stone-200 text-stone-500'}`}>
                2
              </div>
              <div>
                <h3 className="font-bold text-stone-800">Адрес доставки</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Дата и время</p>
              </div>
            </div>
            {step > 2 && <Check className="w-5 h-5 text-[#0ABAB5]" />}
          </div>

          <AnimatePresence>
            {step === 2 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-5 space-y-4 border-t border-stone-100"
              >
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-stone-300" />
                    <input 
                      name="address" 
                      value={info.address} 
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all text-sm" 
                      placeholder="Улица, дом" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      name="house" 
                      value={info.house} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all text-sm" 
                      placeholder="Корп/Стр" 
                    />
                    <input 
                      name="flat" 
                      value={info.flat} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all text-sm" 
                      placeholder="Кв/Офис" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 pt-2">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                       <Calendar className="w-3 h-3" />
                       Дата доставки
                     </label>
                     <input 
                        type="date" 
                        name="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={info.date} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none text-sm font-bold text-stone-700" 
                      />
                   </div>
                   
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                       <ClockIcon className="w-3 h-3" />
                       Интервал доставки
                     </label>
                     <div className="relative">
                        <select 
                          name="time" 
                          value={info.time} 
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none appearance-none text-sm font-bold text-stone-700 pr-10"
                        >
                          {availableSlots.length > 0 ? (
                            availableSlots.map(slot => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))
                          ) : (
                            <option disabled>Нет доступных интервалов</option>
                          )}
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                     </div>
                     {info.date === new Date().toISOString().split('T')[0] && availableSlots.length === 0 && (
                       <div className="flex items-center gap-1.5 text-amber-500 mt-1 px-1">
                         <AlertCircle className="w-3.5 h-3.5" />
                         <span className="text-[10px] font-bold">На сегодня доставка окончена</span>
                       </div>
                     )}
                   </div>
                </div>

                <textarea 
                  name="comment" 
                  value={info.comment} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all text-sm min-h-[80px]" 
                  placeholder="Комментарий к заказу (код домофона, этаж...)" 
                />

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={prevStep} className="py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm">Назад</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!info.address}
                    className="py-3 bg-[#0ABAB5] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#0ABAB5]/10 disabled:opacity-50"
                  >
                    Продолжить
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 3: Recipient */}
        <div className={`bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 transition-all ${step === 3 ? 'ring-2 ring-[#0ABAB5]/20' : ''}`}>
          <div className="p-5 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-[#0ABAB5] text-white' : 'bg-stone-200 text-stone-500'}`}>
                3
              </div>
              <div>
                <h3 className="font-bold text-stone-800">Получатель</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Кому вручить</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {step === 3 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-5 space-y-4 border-t border-stone-100"
              >
                <label className="flex items-center gap-3 p-4 rounded-xl bg-stone-50 border border-stone-100 cursor-pointer transition-all active:scale-[0.98]">
                  <input 
                    type="checkbox" 
                    name="isRecipient" 
                    checked={info.isRecipient} 
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-stone-300 text-[#0ABAB5] focus:ring-[#0ABAB5]" 
                  />
                  <span className="font-bold text-stone-700 text-sm">Я являюсь получателем</span>
                </label>

                {!info.isRecipient && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Имя получателя</label>
                      <input 
                        name="recipientName" 
                        value={info.recipientName} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none text-sm" 
                        placeholder="Кого поздравить?" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Телефон получателя</label>
                      <input 
                        name="recipientPhone" 
                        value={info.recipientPhone} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none text-sm" 
                        placeholder="+7 (___) ___-__-__" 
                      />
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={prevStep} className="py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm">Назад</button>
                  <button 
                    onClick={() => onComplete(info)} 
                    className="py-3 bg-[#0ABAB5] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    Подтвердить
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Payment Section */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl p-6 rounded-t-[32px] border-t border-stone-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Итого к оплате</span>
            <span className="text-2xl font-bold text-[#0ABAB5]">{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest block">Доставка</span>
             <span className="text-xs font-bold text-stone-600">{info.date.split('-').reverse().join('.')}</span>
          </div>
        </div>
        
        {step === 3 && (
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => onComplete(info)}
            className="w-full py-4 bg-[#D4AF37] text-white rounded-2xl font-bold text-lg shadow-xl shadow-amber-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all mb-4"
          >
            <Wallet className="w-5 h-5" />
            Перейти к оплате
          </motion.button>
        )}

        <p className="text-[10px] text-stone-400 text-center leading-relaxed">
          Нажимая кнопку, вы подтверждаете данные заказа. Оплата откроется в Telegram.
        </p>
      </div>
    </div>
  );
};

// Re-defining icons used but not imported
const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
