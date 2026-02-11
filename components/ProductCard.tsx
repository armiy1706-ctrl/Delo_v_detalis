import React from 'react';
import { Heart } from 'lucide-react';
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
  onClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isFavorite, onClick, onAddToCart, onToggleFavorite }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100 flex flex-col h-full cursor-pointer group active:scale-[0.98] transition-transform"
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
            className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-colors ${isFavorite ? 'text-rose-500' : 'text-stone-400 hover:text-rose-500'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-medium text-stone-800 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-stone-400 mb-3 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-rose-600">{product.price.toLocaleString('ru-RU')} ₽</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-8 h-8 flex items-center justify-center bg-rose-100 text-rose-600 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
