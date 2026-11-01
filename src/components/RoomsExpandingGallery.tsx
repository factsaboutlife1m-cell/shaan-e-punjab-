import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion, AnimatePresence, motion } from 'motion/react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Bed,
  Check,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

// ============================================================================
// 4 ROOM IMAGES & ROOM DETAILS ARRAY (Easily swap images & details here)
// ============================================================================
export interface RoomGalleryItem {
  id: string;
  name: string;
  specs: string;
  priceNote?: string;
  image: string;
  alt: string;
}

export const ROOM_GALLERY_ITEMS: RoomGalleryItem[] = [
  {
    id: 'room-1',
    name: 'Deluxe King Bedroom',
    specs: 'King Bed • Split AC • Free Wi-Fi • Ensuite Bathroom',
    priceNote: 'Confirmed tariff: ₹2,499 / night',
    image: '/assets/aistudio/delux.jpg',
    alt: 'Deluxe King Bedroom with ambient lighting, wooden flooring and wardrobe at Shaan-E-Punjab Hotel',
  },
  {
    id: 'room-2',
    name: 'Executive Suite',
    specs: 'Plush King Bed • Dedicated Lounge • 43" Smart TV • Tea/Coffee',
    priceNote: 'Special tariff: ₹3,899 / night',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=80',
    alt: 'Executive Suite with living area and upscale amenities at Shaan-E-Punjab Hotel',
  },
  {
    id: 'room-3',
    name: 'Royal Family Suite',
    specs: '2 Queen Beds • Multi-Bed Setup • 2 Bathrooms • Garden View',
    priceNote: 'Group package: ₹4,799 / night',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=80',
    alt: 'Royal Family Suite designed for family stopovers at Shaan-E-Punjab Hotel',
  },
  {
    id: 'room-4',
    name: 'Classic Comfort Room',
    specs: 'Comfort Queen Bed • Split AC • 24/7 Hot Water • Highway Rest',
    priceNote: 'Transit tariff: ₹1,899 / night',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=80',
    alt: 'Classic Comfort Room for overnight highway travellers on Grand Trunk Road NH-19',
  },
];

interface RoomsExpandingGalleryProps {
  items?: RoomGalleryItem[];
  onEnquire?: (roomName: string) => void;
}

export const RoomsExpandingGallery: React.FC<RoomsExpandingGalleryProps> = ({
  items = ROOM_GALLERY_ITEMS,
  onEnquire,
}) => {
  const { openEnquiryModal } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Auto-play refs
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<{ time: number; index: number }>({ time: 0, index: -1 });

  // Lightbox touch swipe refs
  const lbTouchStartX = useRef<number | null>(null);
  const lbTouchDeltaX = useRef<number>(0);

  const total = items.length;

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Next / Prev slide handlers
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Pause and resume after 5 seconds of inactivity
  const handleUserInteraction = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  // Auto-play interval (every 4 seconds, pauses on interaction or reduced-motion)
  useEffect(() => {
    if (isPaused || shouldReduceMotion || lightboxIndex !== null) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, lightboxIndex, nextSlide]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Double-tap detector for mobile image
  const handlePanelTouchEnd = (index: number) => {
    const now = Date.now();
    if (now - lastTapRef.current.time < 300 && lastTapRef.current.index === index) {
      // Double tap recognized -> open lightbox
      setLightboxIndex(index);
    } else {
      setActiveIndex(index);
    }
    lastTapRef.current = { time: now, index };
    handleUserInteraction();
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % total : 0));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + total) % total : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, total]);

  // Lightbox swipe handlers
  const handleLbTouchStart = (e: React.TouchEvent) => {
    lbTouchStartX.current = e.touches[0].clientX;
    lbTouchDeltaX.current = 0;
  };

  const handleLbTouchMove = (e: React.TouchEvent) => {
    if (lbTouchStartX.current !== null) {
      lbTouchDeltaX.current = e.touches[0].clientX - lbTouchStartX.current;
    }
  };

  const handleLbTouchEnd = () => {
    if (lbTouchStartX.current !== null && lightboxIndex !== null) {
      if (lbTouchDeltaX.current > 45) {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + total) % total : 0));
      } else if (lbTouchDeltaX.current < -45) {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % total : 0));
      }
    }
    lbTouchStartX.current = null;
    lbTouchDeltaX.current = 0;
  };

  return (
    <motion.section
      id="our-rooms"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 py-4"
    >
      {/* Section Header: "Our Rooms" with small golden ornament line */}
      <div className="text-center mb-8">
        <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12] block mb-1">
          Stay & Suites
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#171512] tracking-tight">
          Our Rooms
        </h2>

        {/* Small Golden Ornament Line matching site brand */}
        <div className="flex items-center justify-center gap-3 mt-3 mb-3 w-full max-w-[260px] mx-auto">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C69224] to-transparent" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#C69224] shadow-[0_0_8px_#C69224]" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C69224] to-transparent" />
        </div>

        <p className="font-dmsans text-xs sm:text-sm text-[#514B40] max-w-xl mx-auto leading-relaxed">
          Explore our range of welcoming highway accommodations, from comfortable transit rooms to expansive family suites.
        </p>
      </div>

      {/* Expanding Panels Interactive Gallery */}
      <div
        className="w-full flex flex-col md:flex-row gap-3 md:gap-4 md:h-[480px] lg:h-[530px] select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleUserInteraction}
        onTouchStart={() => setIsPaused(true)}
      >
        {items.map((room, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={room.id}
              onClick={() => {
                setActiveIndex(index);
                handleUserInteraction();
              }}
              onDoubleClick={() => setLightboxIndex(index)}
              onTouchEnd={() => handlePanelTouchEnd(index)}
              aria-label={`${room.name}. ${isActive ? 'Active panel' : 'Tap to expand'}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveIndex(index);
                }
              }}
              className={`relative overflow-hidden rounded-[20px] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive
                  ? 'h-[58vh] min-h-[340px] max-h-[500px] md:h-full md:flex-[3.8] border border-[#171512] shadow-[0_16px_45px_rgba(0,0,0,0.5),0_0_28px_rgba(198,146,36,0.22)] ring-1 ring-[#C69224]/50 z-20'
                  : 'h-[72px] md:h-full md:flex-1 md:hover:flex-[1.25] border border-[#171512]/30 shadow-md hover:border-[#171512] z-10'
              }`}
            >
              {/* Image with Ken Burns zoom effect on active panel */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={room.image}
                  alt={room.alt}
                  loading="lazy"
                  decoding="async"
                  style={{
                    animation:
                      !shouldReduceMotion && isActive
                        ? 'kenBurnsZoom 6s ease-in-out infinite alternate'
                        : 'none',
                    transform: !isActive ? 'scale(1)' : undefined,
                  }}
                  className={`w-full h-full object-cover transition-transform duration-700 select-none pointer-events-none ${
                    isActive ? '' : 'filter brightness-75 md:filter-none'
                  }`}
                />
              </div>

              {/* Cinematic Gradient Scrim at the bottom for readability */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                  isActive
                    ? 'bg-gradient-to-t from-black/95 via-black/45 to-transparent'
                    : 'bg-black/60 md:bg-black/50 hover:bg-black/35'
                }`}
              />

              {/* Active Badge (Top Right) */}
              {isActive && (
                <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171512]/90 backdrop-blur-md border border-[#C69224] text-[#E5B94F] text-[11px] font-bold shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5B94F]" />
                  <span>Featured Room</span>
                </div>
              )}

              {/* Collapsed Strip Preview Tag */}
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-between px-4 md:px-0 md:justify-end md:pb-6 z-10 pointer-events-none">
                  <span className="md:hidden font-playfair font-bold text-sm text-white drop-shadow-md line-clamp-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5B94F]" />
                    <span>{room.name}</span>
                  </span>
                  <span className="md:hidden font-inter text-[11px] text-[#E5B94F] font-bold shrink-0">
                    Tap to expand →
                  </span>

                  <div className="hidden md:flex flex-col items-center w-full px-2">
                    <span className="font-playfair text-sm lg:text-base font-bold text-white drop-shadow-md whitespace-nowrap [writing-mode:vertical-rl] rotate-180 tracking-wider">
                      {room.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Active Panel Content Overlay */}
              <div
                className={`absolute bottom-0 inset-x-0 p-5 sm:p-6 md:p-7 z-20 text-left transition-all duration-500 ${
                  isActive
                    ? 'transform translate-y-0 opacity-100 pointer-events-auto delay-150'
                    : 'transform translate-y-6 opacity-0 pointer-events-none'
                }`}
              >
                {/* Tariff Pill if provided */}
                {room.priceNote && (
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#171512]/90 border border-[#C69224] text-[#E5B94F] font-montserrat font-bold text-[11px] uppercase tracking-wider mb-2 shadow-sm">
                    {room.priceNote}
                  </div>
                )}

                {/* Room Title */}
                <h3 className="font-playfair text-xl xs:text-2xl sm:text-3xl font-bold text-[#FFF5E3] leading-tight drop-shadow-md">
                  {room.name}
                </h3>

                {/* Specs description */}
                <p className="font-dmsans text-xs sm:text-sm text-[#D8CFBF] mt-1 max-w-lg leading-relaxed drop-shadow-sm">
                  {room.specs}
                </p>

                {/* Action Buttons: "View" and "Enquire" */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(index);
                    }}
                    className="font-inter px-4 py-2 bg-[#171512]/90 hover:bg-[#171512] text-[#E5B94F] border border-[#C69224] rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
                    aria-label={`View fullscreen photo of ${room.name}`}
                  >
                    <Eye className="w-4 h-4 text-[#E5B94F]" />
                    <span>View Photo</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEnquire) {
                        onEnquire(room.name);
                      } else {
                        openEnquiryModal('room');
                      }
                    }}
                    className="font-inter px-5 py-2 bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
                    aria-label={`Enquire availability for ${room.name}`}
                  >
                    <span>Enquire Availability</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gallery Indicators / Dots */}
      <div className="flex items-center justify-center gap-2.5 mt-5">
        {items.map((room, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={`room-dot-${room.id}`}
              onClick={() => {
                setActiveIndex(idx);
                handleUserInteraction();
              }}
              className="p-2 cursor-pointer flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label={`Jump to room panel ${idx + 1}: ${room.name}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-8 h-2 bg-[#C69224] border border-[#171512] shadow-xs'
                    : 'w-2 h-2 bg-[#514B40]/30 hover:bg-[#514B40]'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* FULL-SCREEN LIGHTBOX MODAL                                   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setLightboxIndex(null)}
            onTouchStart={handleLbTouchStart}
            onTouchMove={handleLbTouchMove}
            onTouchEnd={handleLbTouchEnd}
          >
            {/* Lightbox Controls Top Bar */}
            <div
              className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Counter e.g. "2 / 4" */}
              <div className="px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 text-neutral-200 font-montserrat text-xs font-semibold tracking-wider">
                {lightboxIndex + 1} / {total}
              </div>

              {/* Close Button (X) with tap target >= 44px */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/20 hover:border-amber-400 transition-colors shadow-xl cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close fullscreen view"
              >
                <X className="w-5 h-5 text-neutral-200" />
              </button>
            </div>

            {/* Left Chevron Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + total) % total : 0));
              }}
              className="absolute left-3 sm:left-6 z-50 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 hover:border-amber-400 transition-all shadow-2xl cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-200" />
            </button>

            {/* Right Chevron Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % total : 0));
              }}
              className="absolute right-3 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 hover:border-amber-400 transition-all shadow-2xl cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6 text-neutral-200" />
            </button>

            {/* Modal Image Content */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[80vh] flex flex-col items-center justify-center"
            >
              <img
                src={items[lightboxIndex].image}
                alt={items[lightboxIndex].alt}
                className="max-w-full max-h-[72vh] rounded-2xl object-contain shadow-2xl border border-white/10 select-none"
              />

              {/* Bottom Info Bar in Lightbox */}
              <div className="w-full mt-3 px-4 py-2 bg-black/70 backdrop-blur-md rounded-xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-center sm:text-left">
                <div>
                  <h4 className="font-playfair text-base sm:text-lg font-bold text-white">
                    {items[lightboxIndex].name}
                  </h4>
                  <p className="font-dmsans text-xs text-neutral-300">
                    {items[lightboxIndex].specs}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-[#FFD700]">
                    {items[lightboxIndex].priceNote}
                  </span>
                  <button
                    onClick={() => {
                      setLightboxIndex(null);
                      if (onEnquire) {
                        onEnquire(items[lightboxIndex].name);
                      } else {
                        openEnquiryModal('room');
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors min-h-[44px] flex items-center justify-center"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Lightbox Dots Indicator */}
            <div
              className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-50 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((_, dotIdx) => (
                <span
                  key={`lb-dot-${dotIdx}`}
                  className={`block rounded-full transition-all duration-300 ${
                    dotIdx === lightboxIndex
                      ? 'w-6 h-1.5 bg-[#FFD700]'
                      : 'w-1.5 h-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
