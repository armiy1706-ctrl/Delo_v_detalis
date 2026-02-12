import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingCart, Star, MessageSquare, Send } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface Review {
  productId: number;
  rating: number;
  text: string;
  userName: string;
  createdAt: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  tgUser?: { first_name?: string };
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, tgUser }) => {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      fetchReviews();
      setQuantity(1);
      setShowReviewForm(false);
      setNewRating(5);
      setNewText("");
    }
  }, [isOpen, product]);

  const fetchReviews = async () => {
    if (!product) return;
    setLoadingReviews(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/reviews/${product.id}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!product || !newText.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c325e4cf/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify({
          productId: product.id,
          rating: newRating,
          text: newText,
          userName: tgUser?.first_name || "Клиент"
        })
      });
      const data = await response.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setShowReviewForm(false);
        setNewText("");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] z-[60] overflow-hidden flex flex-col max-h-[95vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-500 hover:text-stone-900 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="overflow-y-auto no-scrollbar">
              <div className="aspect-square w-full">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-8 pb-24">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-stone-900 mb-1 serif">{product.name}</h2>
                      {averageRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#D4AF37] fill-current" />
                          <span className="text-sm font-bold text-stone-800">{averageRating}</span>
                          <span className="text-xs text-stone-400">({reviews.length} отзывов)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-stone-400 uppercase font-bold tracking-wider">Цена</span>
                      <span className="text-2xl font-bold text-[#D4AF37]">{product.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                  <p className="text-stone-500 leading-relaxed">{product.description}</p>
                </div>

                {/* Reviews Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2 serif">
                      <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                      Отзывы
                    </h3>
                    <button 
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="text-sm font-bold text-[#D4AF37] hover:underline"
                    >
                      {showReviewForm ? "Отмена" : "Оставить отзыв"}
                    </button>
                  </div>

                  {showReviewForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-stone-50 p-4 rounded-2xl space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-500">Ваша оценка:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => setNewRating(s)}>
                              <Star className={`w-6 h-6 ${s <= newRating ? 'text-[#D4AF37] fill-current' : 'text-stone-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          placeholder="Поделитесь вашим мнением..."
                          className="w-full p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-white min-h-[100px] text-sm"
                        />
                        <button 
                          disabled={isSubmitting || !newText.trim()}
                          onClick={handleSubmitReview}
                          className="absolute bottom-3 right-3 p-2 bg-[#D4AF37] text-white rounded-lg disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {loadingReviews ? (
                      <div className="text-center py-4 text-stone-400 text-sm italic">Загрузка отзывов...</div>
                    ) : reviews.length > 0 ? (
                      reviews.map((review, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-stone-100 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-stone-800 text-sm">{review.userName}</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-[#D4AF37] fill-current' : 'text-stone-200'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-stone-600 italic">"{review.text}"</p>
                          <p className="text-[10px] text-stone-400">
                            {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-stone-400 text-sm italic">Пока нет отзывов. Будьте первым!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-stone-100 flex items-center gap-4">
              <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-95 transition-transform"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-95 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#D4AF37] text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {(product.price * quantity).toLocaleString('ru-RU')} ₽
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
