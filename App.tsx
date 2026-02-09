import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowLeft, X, Heart, Search, Menu, User, Minus, Plus, Loader2, CheckCircle, Calendar, MapPin, Phone, Mail } from 'lucide-react';

// --- ТИПЫ ДАННЫХ ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

// --- ДАННЫЕ ТОВАРОВ ---
const PRODUCTS: Product[] = [
  { id: 1, name: "Розовое Облако", price: 4500, image: "https://images.unsplash.com/photo-1764423805989-ec426dfb8de8?q=80&w=1080", description: "Нежное сочетание пионовидных роз и эвкалипта." },
  { id: 2, name: "Весенний Рассвет", price: 3200, image: "https://images.unsplash.com/photo-1745570647583-08120794d68d?q=80&w=1080", description: "Яркие тюльпаны и хризантемы в пастельных тонах." },
  { id: 3, name: "Королевский Сад", price: 7500, image: "https://images.unsplash.com/photo-1766910700520-698f0bf334b2?q=80&w=1080", description: "Роскошный букет из 51 розы высшего качества." },
  { id: 4, name: "Белая Лилия", price: 2800, image: "https://images.unsplash.com/photo-1758673825420-3e7fb0eb199a?q=80&w=1080", description: "Классический букет белых лилий, символ чистоты." },
  { id: 5, name: "Солнечный Микс", price: 2100, image: "https://images.unsplash.com/photo-1752765579894-9a7aef6fb359?q=80&w=1080", description: "Яркие подсолнухи для хорошего настроения." },
  { id: 6, name: "Тюльпановый Рай", price: 2400, image: "https://images.unsplash.com/photo-1658925799003-4ff57ce83ea7?q=80&w=1080", description: "Свежие весенние тюльпаны разных оттенков." }
];

// --- КОМПОНЕНТ 1: КАРТОЧКА ТОВАРА ---
const ProductCard = ({ product, onClick, onAddToCart }: { product: Product, onClick: (p: Product) => void, onAddToCart: (p: Product) => void }) => (
  <div onClick={() => onClick(product)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100 flex flex-col h-full cursor-pointer active:scale-[0.98] transition-transform">
    <div className="aspect-square relative overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-medium text-stone-800 line-clamp-1">{product.name}</h3>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-lg font-bold text-rose-600">{product.price.toLocaleString('ru-RU')} ₽</span>
        <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="w-8 h-8 flex items-center justify-center bg-rose-100 text-rose-600 rounded-full">+</button>
      </div>
    </div>
  </div>
);

// --- КОМПОНЕНТ 2: МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ ---
const ProductModal = ({ product, isOpen, onClose, onAddToCart }: { product: Product | null, isOpen: boolean, onClose: () => void, onAddToCart: (p: Product, q: number) => void }) => {
  const [q, setQ] = useState(1);
  if (!product || !isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="relative w-full max-w-md bg-white rounded-t-[32px] overflow-hidden p-6">
        <img src={product.image} className="w-full aspect-square object-cover rounded-2xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-stone-500 mb-6">{product.description}</p>
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-bold text-rose-600">{product.price.toLocaleString('ru-RU')} ₽</span>
          <div className="flex items-center gap-4 bg-stone-100 p-2 rounded-xl">
            <button onClick={() => setQ(Math.max(1, q - 1))}>-</button>
            <span className="font-bold">{q}</span>
            <button onClick={() => setQ(q + 1)}>+</button>
          </div>
        </div>
        <button onClick={() => { onAddToCart(product, q); onClose(); }} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold">Добавить в корзину</button>
      </motion.div>
    </div>
  );
};

// --- КОМПОНЕНТ 3: ФОРМА ЗАКАЗА ---
const CheckoutForm = ({ customerInfo, setCustomerInfo, onNext }: { customerInfo: CustomerInfo, setCustomerInfo: (c: CustomerInfo) => void, onNext: () => void }) => (
  <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
    <input required placeholder="Имя Фамилия" className="w-full p-4 bg-stone-50 rounded-xl border" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
    <input required type="email" placeholder="Email" className="w-full p-4 bg-stone-50 rounded-xl border" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} />
    <input required type="tel" placeholder="Телефон" className="w-full p-4 bg-stone-50 rounded-xl border" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
    <input required placeholder="Адрес доставки" className="w-full p-4 bg-stone-50 rounded-xl border" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
    <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold">Оформить заказ</button>
  </form>
);

// --- ГЛАВНОЕ ПРИЛОЖЕНИЕ ---
export default function App() {
  const [page, setPage] = useState<'home' | 'cart' | 'checkout' | 'confirmation'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', email: '', phone: '', address: '', city: 'Москва', zipCode: '', country: 'Россия' });

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { ...product, quantity }];
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 max-w-md mx-auto pb-20">
      <header className="p-4 bg-white border-b flex justify-between items-center sticky top-0 z-40">
        <span className="text-xl font-bold text-rose-600" onClick={() => setPage('home')}>Bloom & Stem</span>
        <button onClick={() => setPage('cart')} className="relative">
          <ShoppingCart />
          {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
        </button>
      </header>

      <main className="p-4">
        {page === 'home' && (
          <div className="grid grid-cols-2 gap-4">
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} onClick={setSelected} onAddToCart={(p) => addToCart(p, 1)} />)}
          </div>
        )}

        {page === 'cart' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Корзина</h2>
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border">
                <img src={item.image} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-rose-600 font-bold">{item.price.toLocaleString()} ₽ x {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t flex justify-between items-center">
               <span className="text-lg font-bold">Итого: {total.toLocaleString()} ₽</span>
               <button onClick={() => setPage('checkout')} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold">Далее</button>
            </div>
          </div>
        )}

        {page === 'checkout' && <CheckoutForm customerInfo={customer} setCustomerInfo={setCustomer} onNext={() => setPage('confirmation')} />}

        {page === 'confirmation' && (
          <div className="text-center py-10">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Заказ принят!</h2>
            <p className="mb-6">Спасибо, {customer.name}! Мы свяжемся с вами.</p>
            <button onClick={() => { setCart([]); setPage('home'); }} className="bg-stone-900 text-white px-8 py-3 rounded-xl">Вернуться в магазин</button>
          </div>
        )}
      </main>

      <ProductModal product={selected} isOpen={!!selected} onClose={() => setSelected(null)} onAddToCart={addToCart} />
    </div>
  );
}
