import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MenuItem } from '../types';
import { Card3D } from './Card3D';
import { Sparkles, Utensils, Maximize2 } from 'lucide-react';
import {
  REAL_CHICKEN_DISH_PATH,
  REAL_PANEER_DISH_PATH,
  REAL_TIKKA_DISH_PATH,
  REAL_DAHI_SHOLAY_PATH,
  REAL_MUTTON_DISH_PATH,
  REAL_DAL_TADKA_PATH,
  REAL_CHICKEN_BIRYANI_PATH,
  REAL_VEG_DUM_BIRYANI_PATH,
  REAL_JEERA_RICE_PATH,
  REAL_CHUR_CHUR_KULCHA_PATH,
} from './VisualAsset';
import { useHotel } from '../context/HotelContext';

interface FoodCardProps {
  dish: MenuItem;
  onEnquire?: (dishName: string) => void;
  index?: number;
}

export const FoodCard: React.FC<FoodCardProps> = ({ dish, onEnquire, index = 0 }) => {
  const { openLightbox } = useHotel();
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  // Culinary theme background & culinary emblem based on category
  const getCulinaryTheme = () => {
    switch (dish.category) {
      case 'Tandoori Starters':
        return {
          gradient: 'from-[#3b1212] via-[#241315] to-[#121316]',
          glow: 'rgba(215, 25, 32, 0.35)',
          spiceTag: 'Clay Tandoor Char-Roast',
          accent: '#D71920',
          symbol: dish.isVeg ? 'Paneer Tikka' : 'Tandoori Murgh',
        };
      case 'Punjabi Curries':
        return {
          gradient: 'from-[#381c10] via-[#221511] to-[#121316]',
          glow: 'rgba(245, 158, 11, 0.35)',
          spiceTag: 'Hand-Ground Butter Gravy',
          accent: '#f59e0b',
          symbol: dish.isVeg ? 'Dal Makhani' : 'Butter Chicken',
        };
      case 'Biryani & Rice':
        return {
          gradient: 'from-[#332210] via-[#1e1710] to-[#121316]',
          glow: 'rgba(217, 119, 6, 0.35)',
          spiceTag: 'Clay Handi Sealed Dum',
          accent: '#d97706',
          symbol: 'Saffron Dum Biryani',
        };
      case 'Breads & Accompaniments':
        return {
          gradient: 'from-[#2a1c12] via-[#1b1511] to-[#121316]',
          glow: 'rgba(245, 158, 11, 0.25)',
          spiceTag: 'Fresh Clay Oven Baked',
          accent: '#BFC3C7',
          symbol: 'Tandoori Roti / Naan',
        };
      default:
        return {
          gradient: 'from-[#291717] via-[#1b1416] to-[#121316]',
          glow: 'rgba(215, 25, 32, 0.25)',
          spiceTag: 'Traditional Recipe',
          accent: '#D71920',
          symbol: 'Shaan-E-Punjab Specialty',
        };
    }
  };

  const theme = getCulinaryTheme();

  return (
    <Card3D
      className="bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-2xl overflow-hidden flex flex-col justify-between h-full shadow-md hover:shadow-xl transition-all duration-300 ease-out group"
      intensity={5}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex flex-col h-full justify-between"
      >
        <div>
          {/* 1. Food image/visual: fades and scales into view, zooms gently inside frame on hover */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.5,
              delay: shouldReduceMotion ? 0 : Math.min(index * 0.06, 0.3),
              ease: 'easeOut',
            }}
            className="relative aspect-[16/10] overflow-hidden bg-neutral-900 border-b border-[#171512]"
          >
            {/* Animated zoom on inner content container */}
            {(() => {
              const dishImage =
                dish.image ||
                (dish.id === 'dish-1' || dish.name.toLowerCase().includes('tandoori chicken')
                  ? REAL_CHICKEN_DISH_PATH
                  : dish.id === 'dish-2' || dish.name.toLowerCase().includes('paneer')
                  ? REAL_PANEER_DISH_PATH
                  : dish.id === 'dish-3' || dish.name.toLowerCase().includes('tikka') || dish.name.toLowerCase().includes('murgh')
                  ? REAL_TIKKA_DISH_PATH
                  : dish.id === 'dish-4' || dish.name.toLowerCase().includes('dahi') || dish.name.toLowerCase().includes('sholay')
                  ? REAL_DAHI_SHOLAY_PATH
                  : dish.id === 'dish-9' || dish.name.toLowerCase().includes('mutton') || dish.name.toLowerCase().includes('rogan')
                  ? REAL_MUTTON_DISH_PATH
                  : dish.id === 'dish-10' || dish.name.toLowerCase().includes('dal tadka')
                  ? REAL_DAL_TADKA_PATH
                  : dish.id === 'dish-11' || dish.name.toLowerCase().includes('chicken biryani')
                  ? REAL_CHICKEN_BIRYANI_PATH
                  : dish.id === 'dish-12' || dish.name.toLowerCase().includes('subz') || dish.name.toLowerCase().includes('dum handi')
                  ? REAL_VEG_DUM_BIRYANI_PATH
                  : dish.id === 'dish-13' || dish.name.toLowerCase().includes('jeera rice')
                  ? REAL_JEERA_RICE_PATH
                  : dish.id === 'dish-14' || dish.name.toLowerCase().includes('kulcha')
                  ? REAL_CHUR_CHUR_KULCHA_PATH
                  : undefined);

              if (dishImage) {
                return (
                  <div
                    onClick={() => {
                      openLightbox(
                        [
                          {
                            id: `gal-dish-${dish.id}`,
                            title: dish.name,
                            category: 'food',
                            caption: `${dish.name} (₹${dish.price}) - ${dish.description}`,
                            isVerifiedPhoto: true,
                            image: dishImage,
                          },
                        ],
                        0
                      );
                    }}
                    className={`w-full h-full relative cursor-pointer transition-transform duration-500 ease-out select-none ${
                      isHovered ? 'scale-106' : 'scale-100'
                    }`}
                    title="Click to view photograph in full size"
                  >
                    <img
                      src={dishImage}
                      alt={dish.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Diet Indicator & Chef Special Tag */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
                      <div className="flex items-center gap-1.5 bg-[#171512]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#C69224]/50 shadow-md">
                        {dish.isVeg ? (
                          <span className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 border border-red-500 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-[#FFF5E3]">
                          {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                        </span>
                      </div>

                      {dish.isChefSpecial ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#171512] bg-[#E5B94F] px-2.5 py-1 rounded-md border border-[#171512] shadow-xs">
                          Chef's Special
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-[#FFF5E3] bg-[#171512]/80 backdrop-blur-xs px-2 py-0.5 rounded border border-[#C69224]/40 flex items-center gap-1">
                          <Maximize2 className="w-2.5 h-2.5 text-[#E5B94F]" />
                          <span>Enlarge</span>
                        </span>
                      )}
                    </div>

                    {/* Pricing Badge (Bottom Left) */}
                    <div className="absolute bottom-2.5 left-3 z-20 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#171512]/90 backdrop-blur-md border border-[#C69224] text-[11px] font-black text-[#E5B94F] tracking-wide shadow-md">
                        ₹{dish.price}
                      </span>
                    </div>

                    {/* Spice tag badge bottom right */}
                    <div className="absolute bottom-2.5 right-3 z-20 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#171512]/90 backdrop-blur-md border border-[#C69224]/60 text-[10px] font-semibold text-[#FFF5E3] tracking-wide shadow-md">
                        {theme.spiceTag}
                      </span>
                    </div>

                    {/* Subtle border highlight */}
                    <div className="absolute inset-0 border border-white/10 pointer-events-none group-hover:border-[#C69224]/50 transition-colors duration-300" />
                  </div>
                );
              }

              return (
                <div
                  className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center p-6 relative transition-transform duration-500 ease-out ${
                    isHovered ? 'scale-106' : 'scale-100'
                  }`}
                >
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${theme.glow} 0%, transparent 70%)`,
                      opacity: isHovered ? 0.9 : 0.55,
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-[#C69224] flex items-center justify-center shadow-2xl transition-colors duration-300">
                      <Utensils className="w-7 h-7 text-[#E5B94F] drop-shadow" />
                    </div>
                    <div className="px-2.5 py-0.5 rounded-full bg-[#171512]/80 backdrop-blur-xs border border-[#C69224]/50 text-[10px] font-semibold text-[#E5B94F] tracking-wide">
                      {theme.spiceTag}
                    </div>
                  </div>

                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-1.5 bg-[#171512]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#171512]">
                      {dish.isVeg ? (
                        <span className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                      ) : (
                        <span className="w-3.5 h-3.5 border border-red-500 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-[#FFF5E3]">
                        {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {dish.isChefSpecial && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#171512] bg-[#E5B94F] px-2.5 py-1 rounded-md border border-[#171512] shadow-xs">
                        Chef's Special
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 border border-white/5 pointer-events-none group-hover:border-[#C69224]/40 transition-colors duration-300" />
                </div>
              );
            })()}
          </motion.div>

          {/* Details body */}
          <div className="p-5 space-y-3 bg-[#FFF5E3]">
            <div>
              <span className="font-montserrat text-[10px] uppercase font-semibold tracking-widest text-[#9B6B12] block mb-1">
                {dish.category}
              </span>

              {/* 2. Dish name */}
              <div className="overflow-hidden py-0.5">
                <motion.h3
                  initial={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.5,
                    delay: shouldReduceMotion ? 0 : 0.1 + Math.min(index * 0.04, 0.2),
                    ease: 'easeOut',
                  }}
                  className="font-cormorant text-[22px] font-bold text-[#171512] group-hover:text-[#9B6B12] transition-colors leading-tight tracking-wide"
                >
                  {dish.name}
                </motion.h3>
              </div>

              {/* 3. Gold underline animates beneath dish name */}
              <motion.div
                initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.5,
                  delay: shouldReduceMotion ? 0 : 0.2 + Math.min(index * 0.04, 0.2),
                  ease: 'easeOut',
                }}
                style={{ originX: 0 }}
                className="h-[2px] w-12 bg-[#C69224] mt-1.5 rounded-full"
              />
            </div>

            {/* 4. Description */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.45,
                delay: shouldReduceMotion ? 0 : 0.3 + Math.min(index * 0.04, 0.2),
                ease: 'easeOut',
              }}
              className="font-dmsans text-[13.5px] text-[#514B40] leading-relaxed line-clamp-2"
            >
              {dish.description}
            </motion.p>
          </div>
        </div>

        {/* Card Footer: Price & Table Enquiry Action (Strictly NO cart / ordering) */}
        <div className="p-5 pt-0 bg-[#FFF5E3]">
          <div className="flex items-center justify-between border-t border-[#171512]/20 pt-3">
            <div>
              <span className="font-inter text-base font-bold text-[#171512] tracking-tight">₹{dish.price}</span>
              <span className="font-inter text-[10px] text-[#514B40] block">Dine-in portion (Sample rate)</span>
            </div>

            {onEnquire && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnquire(dish.name);
                }}
                className="font-inter px-3.5 py-1.5 text-xs font-bold text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] rounded-lg transition-colors border border-[#171512] shadow-sm cursor-pointer"
              >
                Table Enquiry
              </button>
            )}
          </div>
        </div>
      </div>
    </Card3D>
  );
};
