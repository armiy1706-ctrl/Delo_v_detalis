import React from 'react';
import { Heart, Star, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  rating?: { average: number; count: number };
  onClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isFavorite, 
  rating,
  onClick, 
  onAddToCart, 
  onToggleFavorite 
}) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-2xl overflow-hidden shadow-xl border border-white/20 flex flex-col h-full cursor-pointer group active:scale-[0.98] transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-colors ${isFavorite ? 'text-[#D4AF37]' : 'text-stone-300 hover:text-[#D4AF37]'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {rating && rating.count > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-stone-100">
            <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
            <span className="text-xs font-bold text-stone-800">{rating.average}</span>
            <span className="text-[10px] text-stone-400">({rating.count})</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-stone-800 mb-1 line-clamp-1 serif">{product.name}</h3>
        <p className="text-[11px] text-stone-400 mb-3 line-clamp-1 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-stone-900">{product.price.toLocaleString('ru-RU')} ₽</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-9 h-9 flex items-center justify-center bg-[#D4AF37] text-white rounded-xl shadow-lg shadow-[#D4AF37]/20 hover:bg-[#B8860B] transition-colors"
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
