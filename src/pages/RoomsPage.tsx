import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset } from '../components/VisualAsset';
import { Card3D } from '../components/Card3D';
import { MaskedText } from '../components/MaskedText';
import { RoomSlider } from '../components/RoomSlider';
import {
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Bed,
  Maximize2,
  Tv,
  Wifi,
  Wind,
  Droplets,
  Phone,
  Clock,
  Car,
  UtensilsCrossed,
  Sparkle,
  Info,
  Calendar,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const { rooms, navigateTo, openEnquiryModal, settings, isBackNav } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');

  // Parallax ref for wide room hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOverlayY = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  // Stagger animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemFadeUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        ease: 'easeOut',
      },
    },
  };

  // Verified Hotel-Wide Amenities
  const verifiedAmenities = [
    {
      icon: <Wind className="w-5 h-5 text-[#C69224]" />,
      title: 'Split Air Conditioning',
      desc: 'Independent high-efficiency climate control units in every room with remote management.',
    },
    {
      icon: <Wifi className="w-5 h-5 text-[#C69224]" />,
      title: 'High-Speed Wi-Fi',
      desc: 'Complimentary high-bandwidth internet connectivity throughout all guest rooms and corridors.',
    },
    {
      icon: <Droplets className="w-5 h-5 text-[#C69224]" />,
      title: '24/7 Hot & Cold Water',
      desc: 'Instant, reliable geyser hot water and high-pressure showers for weary highway travelers.',
    },
    {
      icon: <Tv className="w-5 h-5 text-[#C69224]" />,
      title: 'Flat-Screen HD TV',
      desc: 'Wall-mounted LED televisions equipped with popular national and regional cable channels.',
    },
    {
      icon: <Car className="w-5 h-5 text-[#C69224]" />,
      title: 'Secured Forecourt Parking',
      desc: 'Spacious on-site parking directly off NH-19 with 24-hour security guards and CCTV monitoring.',
    },
    {
      icon: <Clock className="w-5 h-5 text-[#C69224]" />,
      title: '24-Hour Reception Desk',
      desc: 'Express check-in assistance, late-night reception, and early-morning wake-up calls.',
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5 text-[#C69224]" />,
      title: 'On-Site Restaurant',
      desc: 'Authentic Punjabi clay tandoor and multi-cuisine dine-in service just steps from your room.',
    },
    {
      icon: <Sparkle className="w-5 h-5 text-[#C69224]" />,
      title: 'Daily Sanitisation & Linens',
      desc: 'Rigorous housekeeping protocols with fresh bed linens, clean towels, and sanitized floors.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 pb-16 overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. WIDE ROOM HERO IMAGE & HEADING                            */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative w-full h-[54vh] min-h-[440px] max-h-[600px] overflow-hidden flex items-end"
      >
        {/* Background Visual Asset with slow zoom */}
        <motion.div
          initial={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          animate={{ scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 7,
            ease: 'easeOut',
          }}
          className="absolute inset-0 z-0 origin-center"
        >
          <VisualAsset
            type="hotel_deluxe_room"
            aspect="hero"
            className="w-full h-full object-cover select-none"
            priority={true}
          />
          {/* Layered cinematic vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/95 via-[#171512]/60 to-[#171512]/40" />

          {/* Subtle warm accent lighting reflections */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C69224]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#E5B94F]/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

        {/* Hero Content Overlay */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : heroOverlayY,
            opacity: shouldReduceMotion ? 1 : heroOpacity,
          }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16"
        >
          <div className="max-w-3xl space-y-4">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF5E3]/95 border border-[#171512] rounded-full backdrop-blur-md text-xs text-[#171512] shadow-lg font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-[#C69224] animate-pulse" />
              <span className="font-montserrat font-bold text-[#171512]">Accommodations in Topchanchi</span>
              <span className="text-[#514B40]">·</span>
              <span className="font-inter text-[#514B40]">Grand Trunk Road (NH-19)</span>
            </motion.div>

            {/* Masked Heading: "Your Stay, Your Comfort" */}
            <MaskedText
              as="h1"
              delay={0.2}
              showAccentLine={true}
              skipAnimation={isBackNav}
              className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.08] drop-shadow-md"
            >
              Your Stay, Your Comfort
            </MaskedText>

            {/* Short Introduction */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="font-dmsans text-[15px] sm:text-base md:text-lg text-[#FFF5E3] max-w-2xl leading-[1.7] text-balance drop-shadow-sm"
            >
              Discover well-appointed, air-conditioned rooms and suites designed for highway travelers, visiting families, and wedding guests seeking pristine hygiene and peaceful rest in Dhanbad.
            </motion.p>
          </div>
        </motion.div>

        {/* Soft bottom transition mask */}
        <div className="absolute -bottom-1 inset-x-0 h-28 bg-gradient-to-t from-[#F8F0DF] via-[#F8F0DF]/80 to-transparent pointer-events-none z-10" />
      </section>

      {/* ============================================================ */}
      {/* 2. TRUST MARKERS BAR                                         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#FFF5E3] border border-[#171512] rounded-2xl shadow-xl text-center text-xs">
          <div className="space-y-0.5">
            <span className="font-montserrat font-bold text-[#171512] block text-sm">12:00 PM / 11:00 AM</span>
            <span className="font-inter text-[11px] text-[#514B40] font-medium">Standard Check-in / Out</span>
          </div>
          <div className="space-y-0.5">
            <span className="font-montserrat font-bold text-[#171512] block text-sm">24/7 Geyser Supply</span>
            <span className="font-inter text-[11px] text-[#514B40] font-medium">Instant Hot & Cold Water</span>
          </div>
          <div className="space-y-0.5">
            <span className="font-montserrat font-bold text-[#171512] block text-sm">High-Speed Wi-Fi</span>
            <span className="font-inter text-[11px] text-[#514B40] font-medium">Complimentary In Every Room</span>
          </div>
          <div className="space-y-0.5">
            <span className="font-montserrat font-bold text-[#171512] block text-sm">Highway Forecourt</span>
            <span className="font-inter text-[11px] text-[#514B40] font-medium">Secured Parking with CCTV</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. RESPONSIVE ROOM CARD GRID                                 */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
              Accommodations
            </span>
            <MaskedText
              as="h2"
              delay={0.1}
              showAccentLine={true}
              className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] mt-1 leading-tight"
            >
              Choose Your Perfect Accommodation
            </MaskedText>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-2 max-w-xl leading-relaxed">
              All room categories feature split air conditioning, modern attached bathrooms, high-speed Wi-Fi, and access to secure on-site parking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto font-inter">
            <div className="p-1 bg-[#FFF5E3] border border-[#171512] rounded-xl flex items-center gap-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-[#C69224] text-[#171512] border border-[#171512] shadow-xs'
                    : 'text-[#514B40] hover:text-[#171512]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Slider View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#C69224] text-[#171512] border border-[#171512] shadow-xs'
                    : 'text-[#514B40] hover:text-[#171512]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All Grid</span>
              </button>
            </div>

            <div className="text-xs text-[#171512] font-semibold hidden sm:flex items-center gap-1.5 bg-[#FFF5E3] px-3 py-1.5 rounded-xl border border-[#171512]">
              <Info className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
              <span>Direct Rates</span>
            </div>
          </div>
        </div>

        {/* Room View: Interactive Slider or Full Grid */}
        {viewMode === 'slider' ? (
          <div className="mt-2">
            <RoomSlider rooms={rooms} />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
          {rooms.map((room) => (
            <motion.div key={room.id} variants={itemFadeUp}>
              <Card3D intensity={4}>
                <div className="bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group">
                  
                  {/* Top Image Section with Smooth Zoom */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-[#FFF9ED]">
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
                      <VisualAsset
                        type="hotel_deluxe_room"
                        aspect="16:9"
                        className="w-full h-full object-cover"
                        title={room.name}
                        subtitle={`${room.size} • ${room.bedType}`}
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-[#171512]/90 backdrop-blur-md text-[#E5B94F] border border-[#C69224]/50 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg shadow-md font-montserrat">
                      {room.category} Category
                    </div>

                    {/* Capacity & Size Badge on Image Bottom */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-[#FFF5E3] font-inter">
                      <span className="flex items-center gap-1.5 bg-[#171512]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#C69224]/30 font-semibold">
                        <Users className="w-3.5 h-3.5 text-[#C69224]" />
                        <span>{room.capacity}</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#171512]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#C69224]/30 font-semibold">
                        <Maximize2 className="w-3.5 h-3.5 text-[#E5B94F]" />
                        <span>{room.size}</span>
                      </span>
                    </div>
                  </div>

                  {/* Middle Content Section */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-montserrat text-xl font-bold text-[#171512] group-hover:text-[#9B6B12] transition-colors leading-snug">
                          {room.name}
                        </h3>
                        {/* Price display only if supplied */}
                        {room.samplePrice && (
                          <div className="text-right shrink-0 font-inter">
                            <span className="text-xs text-[#514B40] font-medium">Tariff:</span>
                            <p className="text-lg font-bold text-[#171512] tracking-tight">
                              ₹{room.samplePrice.toLocaleString('en-IN')}
                              <span className="text-[10px] text-[#514B40] font-normal"> / night (est.)</span>
                            </p>
                          </div>
                        )}
                      </div>

                      <p className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed">
                        {room.shortDesc}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-[#514B40] pt-1 font-inter font-medium">
                        <Bed className="w-3.5 h-3.5 text-[#C69224]" />
                        <span>{room.bedType}</span>
                      </div>
                    </div>

                    {/* Verified Amenities Chips */}
                    <div className="border-t border-[#171512]/15 pt-3">
                      <p className="font-montserrat text-[10px] uppercase font-bold text-[#171512] tracking-wider mb-2">
                        Verified Amenities:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-[#514B40] font-inter">
                        {room.amenities.slice(0, 4).map((amenity, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate font-medium">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Note if available */}
                    {room.priceNote && (
                      <p className="font-dmsans text-[10px] text-[#9B6B12] bg-[#FFF9ED] px-2.5 py-1 rounded border border-[#C69224]/30 font-medium">
                        {room.priceNote}
                      </p>
                    )}

                    {/* Card Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2 font-inter">
                      <button
                        onClick={() => navigateTo('room-detail', room.slug)}
                        className="w-full py-2.5 px-3 text-xs font-bold text-[#171512] hover:text-[#171512] bg-[#FFF9ED] hover:bg-[#F8F0DF] rounded-xl transition-colors border border-[#171512] text-center cursor-pointer flex items-center justify-center gap-1.5 group/btn"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C69224] group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => openEnquiryModal('room', room.name)}
                        className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-sm text-center cursor-pointer"
                      >
                        Enquire Availability
                      </button>
                    </div>

                  </div>

                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 4. ROOM DETAILS & COMFORT STANDARDS                          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="max-w-2xl">
            <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
              Stay Standards
            </span>
            <MaskedText
              as="h2"
              delay={0.1}
              showAccentLine={true}
              className="font-playfair text-2xl sm:text-3xl font-bold text-[#171512] mt-1 leading-tight"
            >
              Why Travelers Choose Our Accommodations
            </MaskedText>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-2 leading-relaxed">
              Every room at Shaan-E-Punjab Hotel has been intentionally crafted around the core needs of highway transit, family comfort, and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#FFF9ED] border border-[#171512] rounded-2xl space-y-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#FFF5E3] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Acoustic Highway Insulation</h3>
              <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                Sound-dampened window installations ensure the bustling activity of National Highway 19 remains outside, granting you undisturbed night sleep.
              </p>
            </div>

            <div className="p-5 bg-[#FFF9ED] border border-[#171512] rounded-2xl space-y-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#FFF5E3] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">24/7 Geyser Hot Showers</h3>
              <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                Dedicated water heating infrastructure guarantees continuous hot water supply at any hour of the day or night.
              </p>
            </div>

            <div className="p-5 bg-[#FFF9ED] border border-[#171512] rounded-2xl space-y-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#FFF5E3] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Round-the-Clock Support</h3>
              <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                Whether requesting extra pillows, seeking travel guidance toward Parasnath Hills, or ordering hot tea, our front desk is on duty 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. VERIFIED AMENITIES SECTION                                */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
            Verified Amenities
          </span>
          <MaskedText
            as="h2"
            delay={0.1}
            showAccentLine={true}
            className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] justify-center leading-tight"
          >
            Thoughtfully Appointed for Your Transit
          </MaskedText>
          <p className="font-dmsans text-xs sm:text-sm text-[#514B40]">
            Standard amenities provided across our rooms and property to ensure your comfort.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {verifiedAmenities.map((item, idx) => (
            <motion.div key={idx} variants={itemFadeUp}>
              <Card3D intensity={4}>
                <div className="p-5 bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-2xl space-y-2.5 h-full transition-all duration-300 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-montserrat text-sm font-bold text-[#171512]">{item.title}</h3>
                  <p className="font-inter text-xs text-[#514B40] leading-relaxed">{item.desc}</p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 6. ROOM ENQUIRY CTA                                          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative overflow-hidden bg-[#171512] rounded-3xl p-8 sm:p-12 text-center text-[#FFF5E3] shadow-2xl border-2 border-[#C69224]"
        >
          {/* Background glow highlights */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#C69224]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E5B94F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#E5B94F]">
              Direct Desk Availability
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF5E3] leading-tight">
              Reserve Your Highway Sanctuary
            </h2>
            <p className="font-dmsans text-xs sm:text-sm text-[#FFF5E3]/85 leading-relaxed max-w-xl mx-auto">
              Planning an overnight stopover on NH-19 or booking rooms for visiting family and wedding guests in Topchanchi? Contact our reception desk directly for confirmed availability and assistance.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 font-inter">
              <button
                onClick={() => openEnquiryModal('room')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                Enquire For Dates
              </button>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#FFF5E3] bg-[#24201A] hover:bg-[#2F2A22] border border-[#C69224]/60 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#C69224]" />
                <span>Call Desk: {settings.phone}</span>
              </a>
              <button
                onClick={() => openEnquiryModal('room', 'Group / Wedding Block')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#E5B94F] hover:bg-[#F3CE74] border border-[#171512] rounded-xl transition-all cursor-pointer"
              >
                Group / Wedding Block
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
