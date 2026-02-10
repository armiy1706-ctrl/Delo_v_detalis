import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowLeft, X, Heart, Search, Menu, User, Minus, Plus, Loader2 } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderConfirmation } from './components/OrderConfirmation';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { projectId, publicAnonKey } from './utils/supabase/info';

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

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Розовое Облако",
    price: 4500,
    image: "https://images.unsplash.com/photo-1764423805989-ec426dfb8de8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZmxvd2VyJTIwYm91cXVldCUyMHJvc2UlMjBwZW9ueXxlbnwxfHx8fDE3NzA2MTk4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Нежное сочетание пионовидных роз и эвкалипта. Идеально подходит для романтического подарка."
  },
  {
    id: 2,
    name: "Весенний Рассвет",
    price: 3200,
    image: "https://images.unsplash.com/photo-1745570647583-08120794d68d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjBmbG9yYWwlMjBhcnJhbmdlbWVudCUyMHBhc3RlbHxlbnwxfHx8fDE3NzA2MTk4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Яркие тюльпаны и хризантемы в пастельных тонах. Наполнит дом весенней свежестью."
  },
  {
    id: 3,
    name: "Королевский Сад",
    price: 7500,
    image: "https://images.unsplash.com/photo-1766910700520-698f0bf334b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBib3VxdWV0JTIwZmxvd2VycyUyMGdpZnR8ZW58MXx8fHwxNzcwNjE5ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Роскошный букет из 51 розы высшего качества. Классика, которая никогда не выходит из моды."
  },
  {
    id: 4,
    name: "Белая Лилия",
    price: 2800,
    image: "https://images.unsplash.com/photo-1758673825420-3e7fb0eb199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfH3doaXRlJTIwbGlsaWVzJTIwYm91cXVldCUyMGVsZWdhbnR8ZW58MXx8fHwxNzcwNjE5ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Классический букет белых лилий, символ чистоты и благородства. Имеет прекрасный аромат."
  },
  {
    id: 5,
    name: "Солнечный Микс",
    price: 2100,
    image: "https://images.unsplash.com/photo-1752765579894-9a7aef6fb359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXJzJTIwYm91cXVldCUyMGJyaWdodHxlbnwxfHx8fDE3NzA1MTEzNDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Яркие подсолнухи для хорошего настроения. Подарите кусочек солнца своим близким."
  },
  {
    id: 6,
    name: "Тюльпановый Рай",
    price: 2400,
    image: "https://images.unsplash.com/photo-1658925799003-4ff57ce83ea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWxpcHMlMjBjb2xvcmZ1bCUyMGJvdXF1ZXQlMjBzcHJpbmd8ZW58MXx8fHwxNzcwNjE5ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Свежие весенние тюльпаны разных оттенков. Самый популярный выбор для поздравления."
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'cart' | 'checkout' | 'confirmation'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Россия'
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          customer: customerInfo,
          items: cart,
          total: total
        })
      });

      const result = await response.json();
      if (result.success) {
        setOrderId(result.orderId);
        setCurrentPage('confirmation');
      } else {
        console.error("Order error:", result.error);
        alert("Произошла ошибка при оформлении заказа. Попробуйте еще раз.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Не удалось связаться с сервером.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const resetOrder = () => {
    setCart([]);
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      country: 'Россия'
    });
    setOrderId(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 text-stone-500 hover:text-stone-900 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">Bloom & Stem</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentPage('cart')}
            className="relative p-2 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-6 space-y-8"
            >
              {/* Hero */}
              <section className="relative h-48 rounded-3xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1745570647583-08120794d68d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjBmbG9yYWwlMjBhcnJhbmdlbWVudCUyMHBhc3RlbHxlbnwxfHx8fDE3NzA2MTk4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Floral background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h1 className="text-2xl font-bold text-white mb-1">Дарите Эмоции</h1>
                  <p className="text-rose-50 text-sm">Свежие букеты с доставкой за 60 минут</p>
                </div>
              </section>

              {/* Grid */}
              <div className="grid grid-cols-2 gap-4">
                {PRODUCTS.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={setSelectedProduct}
                    onAddToCart={(p) => addToCart(p, 1)} 
                  />
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'cart' && (
            <motion.div 
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 pt-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setCurrentPage('home')} className="p-2 hover:bg-stone-100 rounded-full">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold">Корзина</h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <p className="text-stone-500">Ваша корзина пуста</p>
                  <button onClick={() => setCurrentPage('home')} className="px-8 py-3 bg-stone-900 text-white rounded-2xl">В магазин</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-stone-100 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-stone-800">{item.name}</h4>
                        <p className="text-sm font-bold text-rose-600">{item.price.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-xl">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-white rounded-lg">-</button>
                        <span className="w-4 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 bg-white rounded-lg">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-stone-300"><X className="w-5 h-5" /></button>
                    </div>
                  ))}
                  <div className="bg-white p-6 rounded-3xl border border-stone-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Итого</span>
                      <span className="text-2xl font-bold text-rose-600">{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <button 
                      onClick={() => setCurrentPage('checkout')}
                      className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold"
                    >
                      К оформлению
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentPage === 'checkout' && (
            <motion.div 
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 pt-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setCurrentPage('cart')} className="p-2 hover:bg-stone-100 rounded-full">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold">Оформление</h2>
              </div>

              <CheckoutForm 
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                onNext={handleCheckout}
              />
              
              {isSubmitting && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                    <p className="font-medium text-stone-600">Сохраняем заказ...</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentPage === 'confirmation' && (
            <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <OrderConfirmation 
                customerInfo={customerInfo}
                orderNumber={orderId || "BP-000000"}
                total={total}
                deliveryDate={getDeliveryDate()}
                onReset={resetOrder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {currentPage === 'home' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-stone-100 px-8 py-3 flex justify-between items-center z-40 max-w-md mx-auto rounded-t-2xl shadow-2xl">
          <button className="flex flex-col items-center gap-1 text-rose-600" onClick={() => setCurrentPage('home')}>
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Магазин</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-rose-500 transition-colors relative"
            onClick={() => setCurrentPage('cart')}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Корзина</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button className="flex flex-col items-center gap-1 text-stone-400">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Профиль</span>
          </button>
        </nav>
      )}
    </div>
  );
}
