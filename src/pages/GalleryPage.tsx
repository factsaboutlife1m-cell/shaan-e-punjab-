import React, { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset, REAL_HOTEL_EXTERIOR_PATH } from '../components/VisualAsset';
import { Card3D } from '../components/Card3D';
import { MaskedText } from '../components/MaskedText';
import { GALLERY_ITEMS } from '../data/hotelData';
import { Eye, ShieldCheck, Sparkles, Camera, Info, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const { openLightbox, isBackNav, galleryItems } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All Photos', value: 'all' },
    { label: 'Exterior', value: 'exterior' },
    { label: 'Rooms', value: 'rooms' },
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Food', value: 'food' },
    { label: 'Banquets', value: 'banquet' },
    { label: 'Events', value: 'events' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? galleryItems.filter((item) => item.category !== 'surroundings')
      : galleryItems.filter((item) => item.category === selectedCategory);

  // Stagger animation container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: shouldReduceMotion ? 0 : 0.02,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.45,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* ============================================================ */}
      {/* 1. LARGE HEADING WITH MASKED TEXT REVEAL                     */}
      {/* ============================================================ */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF5E3] border border-[#171512] rounded-full text-xs text-[#171512] shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 text-[#C69224]" />
          <span className="font-bold text-[#171512]">Visual Experience</span>
          <span className="text-[#514B40]">·</span>
          <span className="text-[#514B40]">Topchanchi, Dhanbad (NH-19)</span>
        </motion.div>

        <div className="flex justify-center">
          <MaskedText
            as="h1"
            delay={0.15}
            showAccentLine={true}
            skipAnimation={isBackNav}
            className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#171512] text-center justify-center tracking-tight leading-[1.1]"
          >
            Visual Tour & Photo Gallery
          </MaskedText>
        </div>

        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed max-w-2xl mx-auto"
        >
          Explore our modern architectural facade, comfortable air-conditioned rooms, vibrant dining spaces, clay tandoor delicacies, and celebratory banquet ballrooms in Topchanchi.
        </motion.p>
      </div>

      {/* ============================================================ */}
      {/* 2. CATEGORY FILTERS WITH ANIMATED ACTIVE INDICATOR           */}
      {/* ============================================================ */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 bg-[#FFF5E3] rounded-2xl border border-[#171512] shadow-sm overflow-x-auto max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'text-[#171512]'
                    : 'text-[#514B40] hover:text-[#171512] hover:bg-[#FFF9ED]'
                }`}
              >
                <span>{cat.label}</span>

                {/* Animated thin gold line under selected category filter */}
                {isActive && (
                  <motion.div
                    layoutId="activeGalleryTabUnderline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute -bottom-1 inset-x-2.5 h-[2.5px] bg-[#C69224] rounded-full shadow-[0_0_8px_#C69224]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Counter & Authenticity Transparency Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#514B40] border-b border-[#171512]/15 pb-3">
        <div className="flex items-center gap-2">
          <span>Showing <strong className="text-[#171512] font-bold">{filteredItems.length}</strong> photo{filteredItems.length === 1 ? '' : 's'}</span>
          <span>·</span>
          <span>Consistent 4:3 high-definition view</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#171512] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#C69224] animate-pulse" />
            <span>Official Hotel Photos Available</span>
          </span>
          <span className="text-[#514B40] hidden sm:inline">|</span>
          <span className="text-[#514B40] hidden sm:inline">Click any image for interactive lightbox view</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RESPONSIVE GRID LAYOUT WITH CONSISTENT IMAGE RATIOS       */}
      {/* ============================================================ */}
      <motion.div
        key={selectedCategory}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredItems.map((item, idx) => {
          const isRealPhoto =
            item.isVerifiedPhoto &&
            (item.image === REAL_HOTEL_EXTERIOR_PATH ||
              item.category === 'exterior');

          return (
            <motion.div key={item.id} variants={itemVariants}>
              <Card3D intensity={4} onClick={() => openLightbox(filteredItems, idx)}>
                <div className="bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer">
                  
                  {/* Image Container with Consistent 4:3 Ratio & Subtle Hover Zoom */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF9ED] border-b border-[#171512]">
                    <div className="w-full h-full group-hover:scale-106 transition-transform duration-700 ease-out">
                      <VisualAsset
                        type={
                          item.category === 'exterior'
                            ? 'hotel_exterior_hero'
                            : item.category === 'restaurant'
                            ? 'hotel_restaurant_dining'
                            : item.category === 'food'
                            ? 'hotel_tandoori_feast'
                            : item.category === 'banquet' || item.category === 'events'
                            ? 'hotel_banquet_hall'
                            : item.category === 'rooms'
                            ? 'hotel_deluxe_room'
                            : 'surroundings'
                        }
                        src={item.image}
                        aspect="4:3"
                        className="w-full h-full object-cover"
                        title={item.title}
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                    {/* Category Label Chip */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#171512] bg-[#FFF5E3] px-2.5 py-1 rounded-md border border-[#171512]">
                        {item.category}
                      </span>
                    </div>

                    {/* Authenticity Indicator Badge */}
                    {isRealPhoto && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#E5B94F] bg-[#171512] px-2 py-0.5 rounded border border-[#171512]">
                          <ShieldCheck className="w-3 h-3 text-[#E5B94F]" />
                          <span>Official</span>
                        </span>
                      </div>
                    )}

                    {/* Hover Zoom & Eye Prompt Overlay */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20">
                      <div className="p-3 bg-[#C69224] text-[#171512] border border-[#171512] rounded-full shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300 flex items-center justify-center">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Caption Card Details */}
                  <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-cormorant text-lg font-bold text-[#171512] group-hover:text-[#C69224] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="font-dmsans text-xs text-[#514B40] line-clamp-2 leading-relaxed mt-1">
                        {item.caption}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#171512]/15 flex items-center justify-between text-[11px] text-[#514B40]">
                      <span>Click to enlarge</span>
                      <span className="text-[#171512] font-bold group-hover:text-[#C69224] transition-colors">
                        View Photo →
                      </span>
                    </div>
                  </div>

                </div>
              </Card3D>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ============================================================ */}
      {/* 4. REAL PHOTOGRAPHY TRANSPARENCY NOTICE                      */}
      {/* ============================================================ */}
      <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#514B40] shadow-xs">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-[#C69224] shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-[#171512]">Authentic Hospitality Standard:</strong> Photographs marked with the verified badge feature the real building facade supplied by Shaan-E-Punjab Hotel on NH-19, Topchanchi. Additional preview imagery accurately reflects the architectural layout, room specifications, and live tandoor offerings.
          </p>
        </div>
      </div>

    </div>
  );
};
