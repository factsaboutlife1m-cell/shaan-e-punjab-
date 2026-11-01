import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { X, ChevronLeft, ChevronRight, ShieldCheck, Info } from 'lucide-react';
import { VisualAsset, REAL_HOTEL_EXTERIOR_PATH } from './VisualAsset';

export const LightboxModal: React.FC = () => {
  const { lightbox, closeLightbox, nextLightboxImage, prevLightboxImage } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (!lightbox.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen, closeLightbox, nextLightboxImage, prevLightboxImage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      nextLightboxImage();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      prevLightboxImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    if (lightbox.isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [lightbox.isOpen]);

  const currentItem = lightbox.items[lightbox.currentIndex];
  const isActualPhoto =
    currentItem &&
    currentItem.isVerifiedPhoto &&
    (currentItem.image === REAL_HOTEL_EXTERIOR_PATH ||
      currentItem.category === 'exterior');

  return (
    <AnimatePresence>
      {lightbox.isOpen && currentItem && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 select-none"
        >
        {/* Top Header Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-[#FFF5E3] z-30"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E5B94F]">
              Shaan-E-Punjab
            </span>
            <span className="text-xs text-[#514B40]">·</span>
            <span className="text-xs font-mono text-[#FFF5E3] bg-[#171512]/90 px-2.5 py-0.5 rounded-md border border-[#C69224]/50">
              {lightbox.currentIndex + 1} / {lightbox.items.length}
            </span>
            <span className="text-xs text-[#171512] font-semibold capitalize bg-[#E5B94F] px-2.5 py-0.5 rounded-md border border-[#171512]">
              {currentItem.category}
            </span>

            {/* Authenticity Badge */}
            {isActualPhoto ? (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#171512] bg-[#E5B94F] px-2.5 py-0.5 rounded-md border border-[#171512] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#171512]" />
                <span>Verified Hotel Exterior Photo</span>
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#FFF5E3] bg-[#171512]/90 px-2.5 py-0.5 rounded-md border border-[#C69224]/40">
                <Info className="w-3.5 h-3.5 text-[#E5B94F]" />
                <span>Hospitality Preview</span>
              </span>
            )}
          </div>

          <button
            onClick={closeLightbox}
            className="p-2.5 text-[#171512] hover:text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] rounded-full border border-[#171512] transition-colors shadow-xl cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Image Container */}
        <motion.div
          key={currentItem.id}
          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={shouldReduceMotion ? { scale: 1, opacity: 0 } : { scale: 0.95, opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[75vh] flex items-center justify-center my-auto"
        >
          <div className="w-full overflow-hidden rounded-2xl shadow-2xl border-2 border-[#C69224] bg-black">
            <VisualAsset
              type={
                currentItem.category === 'exterior'
                  ? 'hotel_exterior_hero'
                  : currentItem.category === 'restaurant'
                  ? 'hotel_restaurant_dining'
                  : currentItem.category === 'food'
                  ? 'hotel_tandoori_feast'
                  : currentItem.category === 'banquet' || currentItem.category === 'events'
                  ? 'hotel_banquet_hall'
                  : currentItem.category === 'rooms'
                  ? 'hotel_deluxe_room'
                  : 'surroundings'
              }
              src={currentItem.image}
              aspect="16:9"
              className="w-full"
              title={currentItem.title}
              subtitle={currentItem.caption}
            />
          </div>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightboxImage();
            }}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#171512]/95 text-[#FFF5E3] border border-[#C69224] hover:bg-[#C69224] hover:text-[#171512] transition-colors shadow-2xl cursor-pointer z-30"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightboxImage();
            }}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#171512]/95 text-[#FFF5E3] border border-[#C69224] hover:bg-[#C69224] hover:text-[#171512] transition-colors shadow-2xl cursor-pointer z-30"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Bottom Caption Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 inset-x-4 sm:inset-x-8 text-center text-xs text-[#FFF5E3] z-30 pointer-events-none"
        >
          <div className="max-w-2xl mx-auto bg-[#171512]/95 border border-[#C69224]/60 px-5 py-3 rounded-2xl shadow-2xl pointer-events-auto">
            <p className="font-bold text-[#E5B94F] text-sm sm:text-base drop-shadow">
              {currentItem.title}
            </p>
            <p className="text-[#D8CFBF] text-xs mt-1 leading-relaxed">
              {currentItem.caption}
            </p>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
