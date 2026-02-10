import React from 'react';
import { motion } from 'motion/react';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
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
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-stone-800">Информация о доставке</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-600">Имя получателя</label>
            <input
              required
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-stone-50/50"
              placeholder="Имя Фамилия"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-600">Email</label>
              <input
                required
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-stone-50/50"
                placeholder="example@mail.ru"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-600">Телефон</label>
              <input
                required
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-stone-50/50"
                placeholder="+7 (999) 000-00-00"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-600">Адрес</label>
            <input
              required
              type="text"
              name="address"
              value={customerInfo.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-stone-50/50"
              placeholder="Улица, дом, квартира"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-600">Город</label>
              <input
                required
                type="text"
                name="city"
                value={customerInfo.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-stone-50/50"
                placeholder="Москва"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-600">Индекс</label>
              <input
                required
                type="text"
                name="zipCode"
                value={customerInfo.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-stone-50/50"
                placeholder="101000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-600">Страна</label>
            <select
              name="country"
              value={customerInfo.country}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-stone-50/50 appearance-none"
            >
              <option value="Россия">Россия</option>
              <option value="Казахстан">Казахстан</option>
              <option value="Беларусь">Беларусь</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-rose-600 text-white rounded-2xl font-semibold shadow-lg shadow-rose-200 hover:bg-rose-700 active:scale-[0.98] transition-all"
      >
        Перейти к оплате
      </button>
    </motion.form>
  );
};
