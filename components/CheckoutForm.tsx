import React, { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock } from 'lucide-react';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  deliveryDate: string;
  deliveryTime: string;
  tgId?: number;
}

interface CheckoutFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  onNext: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ customerInfo, setCustomerInfo, onNext }) => {
  const WORKING_HOURS_START = 9;
  const WORKING_HOURS_END = 22;

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const now = new Date();
    const isToday = customerInfo.deliveryDate === now.toISOString().split('T')[0];
    
    let startHour = WORKING_HOURS_START;
    
    if (isToday) {
      // Start at least 1 hour from now
      const minStartHour = now.getHours() + 1;
      startHour = Math.max(WORKING_HOURS_START, minStartHour);
    }

    for (let hour = startHour; hour < WORKING_HOURS_END; hour += 2) {
      const endHour = Math.min(hour + 2, WORKING_HOURS_END);
      const slotLabel = `${hour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
      slots.push(slotLabel);
    }

    return slots;
  }, [customerInfo.deliveryDate]);

  // Ensure deliveryTime is valid when slots change
  useEffect(() => {
    if (timeSlots.length > 0) {
      if (!timeSlots.includes(customerInfo.deliveryTime)) {
        setCustomerInfo({ ...customerInfo, deliveryTime: timeSlots[0] });
      }
    } else if (customerInfo.deliveryTime !== '') {
      setCustomerInfo({ ...customerInfo, deliveryTime: '' });
    }
  }, [timeSlots, customerInfo.deliveryDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.deliveryTime) {
      alert("Пожалуйста, выберите доступное время доставки.");
      return;
    }
    onNext();
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-stone-800 serif">Информация о доставке</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">Имя получателя</label>
            <input
              required
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all bg-stone-50"
              placeholder="Имя Фамилия"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">Телефон</label>
            <input
              required
              type="tel"
              name="phone"
              value={customerInfo.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all bg-stone-50"
              placeholder="+7 (999) 000-00-00"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">Город</label>
            <input
              required
              type="text"
              name="city"
              value={customerInfo.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all bg-stone-50"
              placeholder="Москва"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">Адрес</label>
            <input
              required
              type="text"
              name="address"
              value={customerInfo.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all bg-stone-50"
              placeholder="Улица, дом, квартира"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                Дата
              </label>
              <input
                required
                type="date"
                name="deliveryDate"
                value={customerInfo.deliveryDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all bg-stone-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                Время
              </label>
              <div className="relative">
                <select
                  required
                  name="deliveryTime"
                  value={customerInfo.deliveryTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all bg-stone-50 appearance-none cursor-pointer pr-10"
                >
                  {timeSlots.length > 0 ? (
                    timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))
                  ) : (
                    <option value="">Нет слотов</option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              {timeSlots.length === 0 && (
                <p className="text-[10px] text-red-500 mt-1 leading-tight font-medium">Доставка на сегодня окончена. Выберите завтрашний день.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={timeSlots.length === 0}
        className="w-full py-4 bg-[#D4AF37] disabled:bg-stone-300 text-white rounded-2xl font-bold shadow-xl hover:bg-[#B8860B] active:scale-[0.98] transition-all"
      >
        Оформить заказ
      </button>
    </motion.form>
  );
};
