import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Utensils, Star, Sparkles } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

// ============================================================================
// 4 FOOD IMAGES & DISH DATA ARRAY (Easily swap images and dish details here)
// ============================================================================
export interface OrbitFoodItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  isVeg: boolean;
  image: string;
}

export const ORBIT_FOOD_ITEMS: OrbitFoodItem[] = [
  {
    id: 'dish-1',
    name: 'Shaan-E-Punjab Tandoori Chicken',
    tagline: 'Char-roasted in traditional clay tandoor with 14 secret Punjabi spices',
    price: 360,
    isVeg: false,
    image: '/assets/aistudio/chick_3ad46ba2.jpg',
  },
  {
    id: 'dish-2',
    name: 'Paneer Tikka Angara',
    tagline: 'Fresh malai paneer & crisp peppers char-grilled over flaming coal',
    price: 280,
    isVeg: true,
    image: '/assets/aistudio/panner_612fe8e0.jpg',
  },
  {
    id: 'dish-3',
    name: 'Bhatti Da Murgh Tikka',
    tagline: 'Tender chicken cubes basted with desi butter and ground black cardamom',
    price: 340,
    isVeg: false,
    image: '/assets/aistudio/tikka_f2d0f06d.jpg',
  },
  {
    id: 'dish-4',
    name: 'Dahi Ke Sholay',
    tagline: 'Crisp golden bread pockets filled with seasoned royal hung yogurt',
    price: 240,
    isVeg: true,
    image: '/assets/aistudio/dahi_bacb1884.jpg',
  },
];

interface FoodOrbitCarouselProps {
  items?: OrbitFoodItem[];
  onEnquire?: (dishName: string) => void;
}

export const FoodOrbitCarousel: React.FC<FoodOrbitCarouselProps> = ({
  items = ORBIT_FOOD_ITEMS,
  onEnquire,
}) => {
  const { openLightbox } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const total = items.length;
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);

  // Responsive check for 3D offset calculations
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setActiveIndex(idx);
    pauseAndResume();
  };

  // Pause on touch/hover and resume after 2 seconds
  const pauseAndResume = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  // Auto-switch every 3 seconds (clean interval management)
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, nextSlide]);

  // Clean up resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null) {
      const delta = touchDeltaXRef.current;
      if (delta > 40) {
        prevSlide();
      } else if (delta < -40) {
        nextSlide();
      }
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
    pauseAndResume();
  };

  const activeDish = items[activeIndex];

  return (
    <div
      className="w-full flex flex-col items-center select-none py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={pauseAndResume}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Orbit Carousel Track */}
      <div
        className="relative w-full h-[240px] xs:h-[280px] sm:h-[340px] md:h-[380px] flex items-center justify-center overflow-hidden"
        style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
      >
        {items.map((dish, i) => {
          // Circular orbit offset: 0 is front, 1 is right, 2 is back, 3 is left
          const diff = (i - activeIndex + total) % total;
          const isActive = diff === 0;

          // 3D positioning styles based on orbit position
          let transformStyle = '';
          let zIndex = 10;
          let opacity = 0.65;
          let filter = 'blur(1.5px)';

          if (shouldReduceMotion) {
            transformStyle = isActive ? 'scale(1)' : 'scale(0.85) translateY(20px)';
            opacity = isActive ? 1 : 0;
            filter = 'none';
            zIndex = isActive ? 30 : 0;
          } else {
            switch (diff) {
              case 0:
                // Active Card: Front and Center, large and fully sharp
                transformStyle = isMobile
                  ? 'translate3d(0, 0, 80px) rotateY(0deg) scale(1)'
                  : 'translate3d(0, 0, 140px) rotateY(0deg) scale(1)';
                zIndex = 30;
                opacity = 1;
                filter = 'blur(0px)';
                break;
              case 1:
                // Right Card: Along elliptical orbit on the right
                transformStyle = isMobile
                  ? 'translate3d(36%, 6px, -45px) rotateY(-22deg) scale(0.76)'
                  : 'translate3d(180px, 8px, -60px) rotateY(-24deg) scale(0.78)';
                zIndex = 15;
                opacity = 0.68;
                filter = 'blur(1.5px)';
                break;
              case 2:
                // Back Card: Furthest along orbit, smaller and softly blurred
                transformStyle = isMobile
                  ? 'translate3d(0, -12px, -110px) rotateY(0deg) scale(0.60)'
                  : 'translate3d(0, -16px, -160px) rotateY(0deg) scale(0.62)';
                zIndex = 5;
                opacity = 0.35;
                filter = 'blur(3.5px)';
                break;
              case 3:
                // Left Card: Along elliptical orbit on the left
                transformStyle = isMobile
                  ? 'translate3d(-36%, 6px, -45px) rotateY(22deg) scale(0.76)'
                  : 'translate3d(-180px, 8px, -60px) rotateY(24deg) scale(0.78)';
                zIndex = 15;
                opacity = 0.68;
                filter = 'blur(1.5px)';
                break;
              default:
                break;
            }
          }

          return (
            <div
              key={dish.id}
              onClick={() => {
                if (!isActive) {
                  goToSlide(i);
                } else {
                  // Open full view in lightbox
                  openLightbox(
                    items.map((item) => ({
                      id: item.id,
                      title: item.name,
                      category: 'food',
                      caption: item.tagline,
                      isVerifiedPhoto: true,
                      image: item.image,
                    })),
                    i
                  );
                }
              }}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                filter,
                transition: shouldReduceMotion
                  ? 'opacity 0.2s ease'
                  : 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform, opacity, filter',
              }}
              className={`absolute cursor-pointer transition-shadow duration-500 rounded-[20px] overflow-hidden ${
                isActive
                  ? 'w-[72vw] max-w-[280px] xs:max-w-[310px] sm:max-w-[360px] md:max-w-[410px] aspect-[4/3] border border-[#FFD700]/70 shadow-[0_16px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(255,215,0,0.25)] ring-1 ring-[#FFD700]/30'
                  : 'w-[70vw] max-w-[270px] xs:max-w-[300px] sm:max-w-[350px] md:max-w-[400px] aspect-[4/3] border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
              }`}
            >
              {/* Card Image */}
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading="eager"
                decoding="async"
              />

              {/* Cinematic Vignette Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? 'bg-gradient-to-t from-black/85 via-black/25 to-transparent'
                    : 'bg-black/50 hover:bg-black/30'
                }`}
              />

              {/* Veg / Non-Veg Indicator & Price Tag Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-md bg-black/70 backdrop-blur-md border flex items-center justify-center p-0.5"
                  style={{
                    borderColor: dish.isVeg ? '#10b981' : '#ef4444',
                  }}
                  title={dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dish.isVeg ? '#10b981' : '#ef4444' }}
                  />
                </span>
                <span className="font-montserrat px-2 py-0.5 text-[11px] font-bold rounded-md bg-black/75 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/40 shadow-sm">
                  ₹{dish.price}
                </span>
              </div>

              {/* Tap to View Badge on Active Card */}
              {isActive && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/75 backdrop-blur-md border border-amber-400/40 rounded-full text-[10px] text-amber-200 font-medium">
                  <Sparkles className="w-3 h-3 text-[#FFD700]" />
                  <span>Tap to Enlarge</span>
                </div>
              )}

              {/* Bottom In-Card Title preview */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-left">
                <p className="font-cormorant text-base xs:text-lg sm:text-xl font-bold text-white line-clamp-1 drop-shadow-md">
                  {dish.name}
                </p>
              </div>
            </div>
          );
        })}

        {/* Orbit Left / Right Arrow Controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
            pauseAndResume();
          }}
          className="absolute left-1 xs:left-2 sm:left-4 z-40 p-2 sm:p-2.5 rounded-full bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] text-[#171512] transition-all shadow-md cursor-pointer group min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Previous orbit dish"
        >
          <ChevronLeft className="w-5 h-5 text-[#171512] group-hover:text-[#9B6B12] transition-colors" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
            pauseAndResume();
          }}
          className="absolute right-1 xs:right-2 sm:right-4 z-40 p-2 sm:p-2.5 rounded-full bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] text-[#171512] transition-all shadow-md cursor-pointer group min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Next orbit dish"
        >
          <ChevronRight className="w-5 h-5 text-[#171512] group-hover:text-[#9B6B12] transition-colors" />
        </button>
      </div>

      {/* Active Dish Detail Label & Action Bar */}
      <div className="w-full max-w-xl mx-auto px-4 mt-3 text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: activeDish.isVeg ? '#10b981' : '#ef4444' }}
          />
          <h4 className="font-cormorant text-xl xs:text-2xl sm:text-3xl font-bold text-[#171512] tracking-wide">
            {activeDish.name}
          </h4>
        </div>

        <p className="font-dmsans text-xs sm:text-sm text-[#514B40] max-w-md line-clamp-2 leading-relaxed">
          {activeDish.tagline}
        </p>

        {/* Action Button: Enquire for Dine-In Table */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              if (onEnquire) {
                onEnquire(activeDish.name);
              }
            }}
            className="font-inter px-4 py-2 bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Enquire For Table</span>
          </button>
          <button
            onClick={() => {
              openLightbox(
                items.map((item) => ({
                  id: item.id,
                  title: item.name,
                  category: 'food',
                  caption: item.tagline,
                  isVerifiedPhoto: true,
                  image: item.image,
                })),
                activeIndex
              );
            }}
            className="font-inter px-3 py-2 bg-[#FFF5E3] hover:bg-[#F8F0DF] text-[#171512] border border-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer min-h-[40px]"
          >
            Full View
          </button>
        </div>
      </div>

      {/* Orbit Indicator Dots */}
      <div className="flex items-center justify-center gap-2.5 mt-4 pt-1">
        {items.map((dish, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={`orbit-dot-${dish.id}`}
              onClick={() => goToSlide(idx)}
              className="p-2 cursor-pointer flex items-center justify-center min-h-[36px] min-w-[36px]"
              aria-label={`Jump to ${dish.name}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-7 h-2 bg-[#C69224] border border-[#171512] shadow-xs'
                    : 'w-2 h-2 bg-[#514B40]/30 hover:bg-[#514B40]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
