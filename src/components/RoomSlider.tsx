import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { Room } from '../types';
import { REAL_HOTEL_BEDROOM_PATH } from './VisualAsset';
import { GALLERY_ITEMS } from '../data/hotelData';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Users,
  Bed,
  Check,
  Calendar,
  Phone,
  ArrowRight,
} from 'lucide-react';

interface RoomSliderProps {
  rooms?: Room[];
  showHeading?: boolean;
}

export const RoomSlider: React.FC<RoomSliderProps> = ({ rooms: propRooms, showHeading = false }) => {
  const { rooms: contextRooms, navigateTo, openEnquiryModal, openLightbox, settings } = useHotel();
  const rooms = propRooms || contextRooms;
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalRooms = rooms.length;
  const currentRoom = rooms[currentIndex] || rooms[0];

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalRooms);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalRooms) % totalRooms);
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Touch Swipe for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      // Swiped left -> next
      nextSlide();
    } else if (distance < -45) {
      // Swiped right -> prev
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Check if current room is Deluxe King
  const isDeluxeKing =
    currentRoom.id === 'room-deluxe-king' ||
    currentRoom.slug === 'deluxe-king-bedroom' ||
    currentIndex === 0;

  const displayName = isDeluxeKing ? 'Deluxe King Bedroom' : currentRoom.name;
  const displayCategory = isDeluxeKing ? 'Premium Accommodation' : currentRoom.category;
  const displayPrice = isDeluxeKing ? 2499 : (currentRoom.samplePrice || 2499);
  const imgSrc = isDeluxeKing
    ? REAL_HOTEL_BEDROOM_PATH
    : currentRoom.image?.startsWith('/')
    ? currentRoom.image
    : undefined;

  const handleLightboxOpen = () => {
    const bedGalleryItem = GALLERY_ITEMS.find((g) => g.id === 'gal-3') || {
      id: 'gal-deluxe-king',
      title: displayName,
      category: 'rooms',
      caption: `${displayName} at Shaan-E-Punjab Hotel, Topchanchi (NH-19).`,
      isVerifiedPhoto: true,
      image: imgSrc || REAL_HOTEL_BEDROOM_PATH,
    };
    openLightbox([bedGalleryItem], 0);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 120 : -120,
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -120 : 120,
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
    }),
  };

  return (
    <div className="w-full select-none">
      {/* Top Slide Navigation Bar & Room Selector Pills */}
      <div className="space-y-3 mb-5">
        {/* Slide Counter & Mobile Helper */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C69224] animate-pulse" />
            <span className="font-montserrat text-xs uppercase font-semibold tracking-wider text-[#514B40]">
              Room <strong className="text-[#171512]">{currentIndex + 1}</strong> of <strong className="text-[#171512]">{totalRooms}</strong>
            </span>
            <span className="text-[#514B40]/50 hidden xs:inline">·</span>
            <span className="font-inter text-[11px] text-[#9B6B12] font-semibold hidden xs:inline">
              Slide or tap arrows to view
            </span>
          </div>

          {/* Top Arrows (Next & Prev) */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={prevSlide}
              aria-label="Previous Room Slide"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFF5E3] hover:bg-[#C69224] border border-[#171512] text-[#171512] transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Room Slide"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFF5E3] hover:bg-[#C69224] border border-[#171512] text-[#171512] transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Room Tab Selectors (Horizontal scrollable pill list) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
          {rooms.map((rm, idx) => {
            const isActive = idx === currentIndex;
            const rmName = idx === 0 ? 'Deluxe King Bedroom' : rm.name;
            return (
              <button
                key={rm.id}
                onClick={() => goToSlide(idx)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-[13px] whitespace-nowrap font-inter transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-[#C69224] text-[#171512] font-bold border-[#171512] shadow-xs scale-[1.02]'
                    : 'bg-[#FFF5E3] text-[#514B40] hover:text-[#171512] hover:bg-[#FFF9ED] border-[#171512]/30'
                }`}
              >
                <span>{rmName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Slide Card Container with Touch Handling */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#171512] bg-[#FFF5E3] shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentRoom.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              
              {/* Left Column: Room Image */}
              <div className="lg:col-span-7 relative bg-neutral-900 overflow-hidden group">
                <div
                  onClick={handleLightboxOpen}
                  className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:h-full cursor-pointer overflow-hidden"
                  title="Click to view full photo in lightbox"
                >
                  <img
                    src={imgSrc || REAL_HOTEL_BEDROOM_PATH}
                    alt={displayName}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                  />
                  
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-[#171512]/90 backdrop-blur-md border border-[#C69224] text-[10px] sm:text-[11px] font-bold text-[#E5B94F] uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C69224] animate-pulse" />
                      <span className="font-montserrat font-bold">{displayCategory}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-lg bg-[#171512]/80 backdrop-blur-md text-[10px] sm:text-xs text-[#FFF5E3] border border-[#C69224]/40 flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5 text-[#E5B94F]" />
                      <span className="font-inter">Tap to Zoom</span>
                    </span>
                  </div>

                  {/* Bottom Specs Bar on Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10 pointer-events-none">
                    <div className="flex items-center gap-2 bg-[#171512]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#C69224]/40 font-inter text-[11px] sm:text-xs text-[#FFF5E3]">
                      <Bed className="w-3.5 h-3.5 text-[#E5B94F]" />
                      <span className="font-semibold">{currentRoom.bedType || '1 King Size Bed'}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#171512]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#C69224]/40 font-inter text-[11px] sm:text-xs text-[#E5B94F]">
                      <span className="font-bold">{currentRoom.size || '280 sq.ft.'}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Floating Slide Arrows Over Image */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous room"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#171512]/80 hover:bg-[#C69224] text-white border border-[#C69224] backdrop-blur-md flex items-center justify-center transition-colors shadow-xl lg:hidden z-20 cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next room"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#171512]/80 hover:bg-[#C69224] text-white border border-[#C69224] backdrop-blur-md flex items-center justify-center transition-colors shadow-xl lg:hidden z-20 cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Right Column: Room Details & Actions */}
              <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4 bg-[#FFF5E3]">
                
                {/* Header Information */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-[#171512]/15 pb-3">
                    <span className="font-montserrat text-xs uppercase font-bold text-[#9B6B12] tracking-wider">
                      {displayCategory}
                    </span>
                    <span className="font-inter text-xs text-[#514B40] flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#9B6B12]" />
                      <span>{currentRoom.capacity}</span>
                    </span>
                  </div>

                  <h3 className="font-montserrat text-xl sm:text-2xl lg:text-3xl font-bold text-[#171512] leading-tight">
                    {displayName}
                  </h3>

                  <p className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed sm:leading-[1.7]">
                    {currentRoom.shortDesc}
                  </p>

                  {/* Room Highlights / Key Amenities */}
                  <div className="pt-1">
                    <span className="font-montserrat text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#171512] block mb-2">
                      Key Inclusions:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#514B40] font-inter">
                      {currentRoom.amenities.slice(0, 4).map((amenity, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium">
                          <Check className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
                          <span className="truncate">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & CTAs */}
                <div className="pt-3 border-t border-[#171512]/15 space-y-3.5 font-inter">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-[#514B40] uppercase tracking-wider block font-medium">
                        Estimated Tariff
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-bold text-[#171512] tracking-tight">
                          ₹{displayPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#514B40]">/ night</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#9B6B12] bg-[#FFF9ED] border border-[#171512] px-2 py-0.5 rounded-md font-bold">
                      Direct Rate
                    </span>
                  </div>

                  {/* Primary Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => openEnquiryModal('room', displayName)}
                      className="w-full py-3 px-4 bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Enquire Availability</span>
                    </button>

                    <button
                      onClick={() => navigateTo('room-detail', currentRoom.slug)}
                      className="w-full py-3 px-4 bg-[#FFF9ED] hover:bg-[#F8F0DF] text-[#171512] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors border border-[#171512] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#171512]" />
                    </button>
                  </div>

                  {/* Front Desk Call Helper */}
                  <div className="flex items-center justify-between text-[11px] text-[#514B40] pt-1">
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-[#171512] hover:text-[#9B6B12] transition-colors font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C69224]" />
                      <span>Direct Desk: <strong className="text-[#171512]">{settings.phone}</strong></span>
                    </a>
                    <span className="text-[#514B40] hidden sm:inline">24/7 Check-in Support</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Slider Dots & Navigation Controls */}
      <div className="flex items-center justify-between gap-4 mt-4 pt-1">
        {/* Previous Room Button */}
        <button
          onClick={prevSlide}
          className="px-3.5 py-2 rounded-xl bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] text-xs text-[#171512] font-inter font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-[#C69224]" />
          <span className="hidden xs:inline">Previous</span>
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {rooms.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to room ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 sm:w-8 bg-[#C69224] border border-[#171512]'
                  : 'w-2 sm:w-2.5 bg-[#514B40]/30 hover:bg-[#514B40]'
              }`}
            />
          ))}
        </div>

        {/* Next Room Button */}
        <button
          onClick={nextSlide}
          className="px-3.5 py-2 rounded-xl bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] text-xs text-[#171512] font-inter font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-4 h-4 text-[#C69224]" />
        </button>
      </div>
    </div>
  );
};
