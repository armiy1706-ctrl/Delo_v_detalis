import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ChevronUp, Check, ArrowLeft, ArrowRight, Wallet } from 'lucide-react';

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
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 focus:border-[#0ABAB5] outline-none transition-all"
                    placeholder="mail@example.com"
                  />
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full py-3 bg-[#0ABAB5] text-white rounded-xl font-bold shadow-lg shadow-[#0ABAB5]/20"
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
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    name="city" 
                    value={info.city} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100" 
                    placeholder="Город" 
                  />
                  <input 
                    name="address" 
                    value={info.address} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100" 
                    placeholder="Улица" 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      name="house" 
                      value={info.house} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100" 
                      placeholder="Дом" 
                    />
                    <input 
                      name="flat" 
                      value={info.flat} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100" 
                      placeholder="Кв/Офис" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Дата доставки</label>
                     <input 
                        type="date" 
                        name="date" 
                        value={info.date} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100" 
                      />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Время доставки</label>
                     <select 
                        name="time" 
                        value={info.time} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 appearance-none"
                      >
                        <option value="12:00 - 14:00">12:00 - 14:00</option>
                        <option value="14:00 - 16:00">14:00 - 16:00</option>
                        <option value="16:00 - 18:00">16:00 - 18:00</option>
                        <option value="18:00 - 20:00">18:00 - 20:00</option>
                        <option value="20:00 - 22:00">20:00 - 22:00</option>
                      </select>
                   </div>
                </div>

                <textarea 
                  name="comment" 
                  value={info.comment} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100 min-h-[80px]" 
                  placeholder="Комментарий к заказу" 
                />

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={prevStep} className="py-3 bg-stone-100 text-stone-600 rounded-xl font-bold">Назад</button>
                  <button onClick={nextStep} className="py-3 bg-[#0ABAB5] text-white rounded-xl font-bold">Продолжить</button>
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
                <label className="flex items-center gap-3 p-4 rounded-xl bg-stone-50 border border-stone-100 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isRecipient" 
                    checked={info.isRecipient} 
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-stone-300 text-[#0ABAB5] focus:ring-[#0ABAB5]" 
                  />
                  <span className="font-bold text-stone-700">Я являюсь получателем</span>
                </label>

                {!info.isRecipient && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Имя получателя</label>
                      <input 
                        name="recipientName" 
                        value={info.recipientName} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100" 
                        placeholder="Имя получателя" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Телефон получателя</label>
                      <input 
                        name="recipientPhone" 
                        value={info.recipientPhone} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-100" 
                        placeholder="+7 (___) ___-__-__" 
                      />
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={prevStep} className="py-3 bg-stone-100 text-stone-600 rounded-xl font-bold">Назад</button>
                  <button 
                    onClick={() => onComplete(info)} 
                    className="py-3 bg-[#0ABAB5] text-white rounded-xl font-bold flex items-center justify-center gap-2"
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
          <span className="text-lg font-bold text-stone-800 serif">Итого к оплате</span>
          <span className="text-2xl font-bold text-[#0ABAB5]">{total.toLocaleString('ru-RU')} ₽</span>
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
