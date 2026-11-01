import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MenuItem } from '../types';
import { Flame, ChevronRight, Check, Utensils, Maximize2 } from 'lucide-react';
import { MaskedText } from './MaskedText';
import { REAL_TANDOOR_OVEN_PATH } from './VisualAsset';
import { useHotel } from '../context/HotelContext';

interface FeaturedFoodSectionProps {
  dishes: MenuItem[];
  onEnquireTable: (dishName: string) => void;
  onViewMenu: () => void;
}

export const FeaturedFoodSection: React.FC<FeaturedFoodSectionProps> = ({
  dishes,
  onEnquireTable,
  onViewMenu,
}) => {
  const { openLightbox } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  const signatureDishes = dishes.filter((d) => d.isChefSpecial).slice(0, 5);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentDish = signatureDishes[selectedIndex] || dishes[0];

  const getVisualDetails = (dishName: string) => {
    if (dishName.includes('Tandoori Chicken')) {
      return {
        tagline: 'Char-Roasted Overnight Clay Oven Sensation',
        accentBg: 'from-[#3a1212] via-[#221214] to-[#121214]',
        highlights: ['Slow-charred over hot coal embers', '14 secret Punjabi spices marinade', 'Fresh mint and coriander chutney accompaniment'],
      };
    }
    if (dishName.includes('Butter Chicken')) {
      return {
        tagline: 'Velvety Cashew-Tomato White Butter Gravy',
        accentBg: 'from-[#3a1812] via-[#221314] to-[#121214]',
        highlights: ['Simmered ripe vine tomatoes', 'Pure white hand-churned butter', 'Kasoori methi fragrant aroma'],
      };
    }
    if (dishName.includes('Dal Makhani')) {
      return {
        tagline: '18-Hour Slow-Simmered Bukhara Heritage',
        accentBg: 'from-[#2e1d13] via-[#1c1412] to-[#121214]',
        highlights: ['Whole black urad & kidney beans', 'Simmered overnight on charcoal', 'Enriched with fresh cream and desi butter'],
      };
    }
    if (dishName.includes('Biryani')) {
      return {
        tagline: 'Fragrant Clay Handi Sealed Dum Cooking',
        accentBg: 'from-[#332212] via-[#1d1612] to-[#121214]',
        highlights: ['Aged long-grain royal basmati', 'Real saffron and golden fried birista', 'Dough-sealed handi dum steam'],
      };
    }
    return {
      tagline: 'Signature Punjabi Recipe from Our Clay Oven',
      accentBg: 'from-[#281c15] via-[#1a1412] to-[#121214]',
      highlights: ['Freshly rolled and baked on charcoal', 'Brushed with pure dairy ghee', 'Crispy flaky tandoor layers'],
    };
  };

  const details = getVisualDetails(currentDish?.name || '');

  return (
    <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#171512]/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF9ED] border border-[#C69224] rounded-full text-xs text-[#9B6B12] mb-2 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#C69224]" />
            <span className="font-montserrat font-bold uppercase tracking-wider text-[11px]">Chef's Spotlight</span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#171512] leading-tight">
            Featured Food & Menu Highlights
          </h2>
          <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-2 max-w-2xl leading-relaxed">
            Authentic North Indian highway dining prepared fresh in our clay tandoor. Explore signature culinary items and reserve your table.
          </p>
        </div>

        <button
          onClick={onViewMenu}
          className="font-inter inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9B6B12] hover:text-[#171512] transition-colors self-start md:self-auto cursor-pointer group"
        >
          <span>View Complete Menu</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Dish Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#171512]/15">
        {signatureDishes.map((dish, i) => (
          <button
            key={dish.id}
            onClick={() => setSelectedIndex(i)}
            className={`font-inter px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedIndex === i
                ? 'bg-[#C69224] text-[#171512] font-bold border border-[#171512] shadow-xs'
                : 'bg-[#FFF9ED] text-[#514B40] hover:text-[#171512] hover:bg-[#F8F0DF] border border-[#171512]/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dish.isVeg ? '#10b981' : '#ef4444' }} />
            <span>{dish.name}</span>
          </button>
        ))}
      </div>

      {/* Split Spotlight Panel with Timing Offset for Depth */}
      <AnimatePresence mode="wait">
        <div
          key={currentDish?.id}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFF9ED] border border-[#171512] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xs"
        >
          {/* Left: Food Visual Card */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : 0.08, ease: 'easeOut' }}
            className="lg:col-span-6 relative aspect-[16/11] rounded-2xl overflow-hidden bg-neutral-900 border border-[#171512] flex items-center justify-center group shadow-md"
          >
            {/* Real Clay Tandoor Oven Visual Div with dynamic text & price */}
            <div
              onClick={() => {
                openLightbox(
                  [
                    {
                      id: 'gal-tandoor-oven',
                      title: 'Clay Tandoor Oven',
                      category: 'food',
                      caption: 'Authentic high-heat clay tandoor oven with flatbreads baking on glowing charcoal embers at Shaan-E-Punjab Hotel, Topchanchi.',
                      isVerifiedPhoto: true,
                      image: REAL_TANDOOR_OVEN_PATH,
                    },
                  ],
                  0
                );
              }}
              className="absolute inset-0 cursor-pointer overflow-hidden group/img select-none"
              title="Click to view Clay Tandoor Oven photograph in full view"
            >
              <img
                src={REAL_TANDOOR_OVEN_PATH}
                alt="Clay Tandoor Oven"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25 pointer-events-none" />

              {/* Text Badge: Clay Tandoor Oven */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2 bg-[#171512]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#C69224] shadow-xl pointer-events-none">
                <Flame className="w-3.5 h-3.5 text-[#E5B94F] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold text-[#E5B94F] uppercase tracking-wider">
                  Clay Tandoor Oven
                </span>
              </div>

              {/* Enlarge prompt button */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 flex items-center gap-1.5 bg-[#171512]/80 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-lg border border-[#C69224]/40 text-[10px] text-[#FFF5E3] pointer-events-none">
                <Maximize2 className="w-3.5 h-3.5 text-[#E5B94F]" />
                <span className="hidden xs:inline">Enlarge</span>
              </div>

              {/* Dietary Indicator */}
              <div className="absolute bottom-18 sm:bottom-22 left-3 sm:left-4 z-20 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#171512]/90 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#C69224]/50 shadow-md">
                  {currentDish?.isVeg ? (
                    <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 border border-emerald-500 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </span>
                  ) : (
                    <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 border border-red-500 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    </span>
                  )}
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#FFF5E3]">
                    {currentDish?.isVeg ? 'Pure Veg' : 'Non-Veg'}
                  </span>
                </div>
              </div>

              {/* Bottom Dynamic Text & Dynamic Price Display */}
              <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 z-20 flex items-end justify-between pointer-events-none gap-2">
                <div className="bg-[#171512]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-[#C69224]/50 shadow-lg max-w-[55%] truncate">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#E5B94F] tracking-wider block truncate">
                    {currentDish?.name || 'Fresh Tandoor Specialty'}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#FFF5E3] font-medium truncate block">
                    Clay Tandoor Oven
                  </span>
                </div>

                <div className="bg-[#171512]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-[#C69224] text-right shadow-xl shrink-0">
                  <span className="font-montserrat text-[9px] sm:text-[10px] text-[#A69E8F] block uppercase tracking-wider font-semibold">
                    Dynamic Price
                  </span>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="font-inter text-lg sm:text-2xl font-bold text-[#E5B94F] tracking-tight">
                      ₹{currentDish?.price ? currentDish.price.toLocaleString('en-IN') : '360'}
                    </span>
                    <span className="font-inter text-[9px] sm:text-[10px] text-[#D8CFBF] font-normal">/ portion</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-[inherit]" />
            </div>
          </motion.div>

          {/* Right: Dish Title & Narrative */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, delay: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-5"
          >
            <div>
              <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
                {currentDish?.category}
              </span>

              <div className="mt-1">
                <MaskedText
                  as="h3"
                  className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-bold text-[#171512] tracking-wide"
                  showAccentLine={true}
                >
                  {currentDish?.name || ''}
                </MaskedText>
              </div>

              <p className="font-dmsans text-xs sm:text-sm text-[#9B6B12] font-semibold mt-2">
                {details.tagline}
              </p>
            </div>

            <p className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed">
              {currentDish?.description}
            </p>

            <div className="space-y-2 border-t border-[#171512]/15 pt-4">
              <span className="font-montserrat text-[11px] uppercase font-bold text-[#171512] tracking-wider block">
                Why It's Special:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#514B40] font-dmsans">
                {details.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clay Tandoor Oven & Dynamic Price Highlight */}
            <div className="flex items-center justify-between p-3.5 bg-[#FFF5E3] border border-[#171512] rounded-xl shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C69224]/20 border border-[#C69224] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-[#9B6B12]" />
                </div>
                <div>
                  <span className="font-montserrat text-xs font-bold text-[#171512] block">Clay Tandoor Oven</span>
                  <span className="font-dmsans text-[11px] text-[#514B40]">Charcoal-fired traditional technique</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-montserrat text-[10px] text-[#514B40] block uppercase font-bold">Dynamic Price</span>
                <span className="font-inter text-base font-bold text-[#171512] tracking-tight">
                  ₹{currentDish?.price ? currentDish.price.toLocaleString('en-IN') : '360'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onEnquireTable(currentDish?.name || '')}
                className="font-inter px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Enquire for This Table
              </button>
              <button
                onClick={onViewMenu}
                className="font-inter px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-[#F8F0DF] border border-[#171512] rounded-xl transition-colors cursor-pointer"
              >
                Browse All Dishes
              </button>
            </div>

            <p className="text-[11px] text-[#514B40] italic">
              Notice: Prepared for on-premises dining & table reservations only. Online food delivery is not offered.
            </p>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};
