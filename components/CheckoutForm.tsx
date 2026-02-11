import React from 'react';
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              <input
                required
                type="time"
                name="deliveryTime"
                value={customerInfo.deliveryTime}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all bg-stone-50"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-[#D4AF37] text-white rounded-2xl font-bold shadow-xl hover:bg-[#B8860B] active:scale-[0.98] transition-all"
      >
        Оформить заказ
      </button>
    </motion.form>
  );
};
