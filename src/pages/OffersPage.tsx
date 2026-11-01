import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset } from '../components/VisualAsset';
import { Card3D } from '../components/Card3D';
import { MaskedText } from '../components/MaskedText';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Info,
  Clock,
  Phone,
  Bed,
  Utensils,
  Heart,
  Users,
  Cake,
  Gift,
} from 'lucide-react';
import { Offer } from '../types';

export const OffersPage: React.FC = () => {
  const { offers, openEnquiryModal, settings, isBackNav } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  // Parallax ref for wide promotional hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOverlayY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  // Category filter state
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filterTabs = [
    'All',
    'Room Stay',
    'Restaurant',
    'Group Dining',
    'Birthday',
    'Wedding',
    'Seasonal',
  ];

  const filteredOffers = offers.filter((offer) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Room Stay') return offer.category === 'Stay';
    if (selectedFilter === 'Restaurant') return offer.category === 'Dining';
    if (selectedFilter === 'Group Dining') return offer.category === 'Group';
    if (selectedFilter === 'Birthday') return offer.category === 'Birthday';
    if (selectedFilter === 'Wedding') return offer.category === 'Wedding';
    if (selectedFilter === 'Seasonal') return offer.category === 'Seasonal';
    return true;
  });

  // Stagger animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const itemFadeUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.5,
        ease: 'easeOut',
      },
    },
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Stay':
        return <Bed className="w-3.5 h-3.5" />;
      case 'Dining':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'Group':
        return <Users className="w-3.5 h-3.5" />;
      case 'Birthday':
        return <Cake className="w-3.5 h-3.5" />;
      case 'Wedding':
        return <Heart className="w-3.5 h-3.5" />;
      default:
        return <Gift className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 pb-16 overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. WIDE PROMOTIONAL HERO BANNER                              */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative w-full h-[52vh] min-h-[440px] max-h-[580px] overflow-hidden flex items-end border-b border-[#171512]"
      >
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
            type="hotel_banquet_hall"
            aspect="hero"
            className="w-full h-full object-cover select-none"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/75 to-black/40" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#171512]/30 to-[#171512]/80 pointer-events-none" />

          {/* Festive promotional gold lighting glow */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C69224]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#E5B94F]/15 rounded-full blur-3xl pointer-events-none" />
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF5E3] border border-[#171512] rounded-full text-xs text-[#171512] shadow-md"
            >
              <Tag className="w-3.5 h-3.5 text-[#C69224]" />
              <span className="font-bold text-[#171512]">Promotions & Bundles</span>
              <span className="text-[#514B40]">·</span>
              <span className="text-[#514B40]">Topchanchi, Dhanbad (NH-19)</span>
            </motion.div>

            {/* Heading Reveals Upward */}
            <MaskedText
              as="h1"
              delay={0.2}
              showAccentLine={true}
              skipAnimation={isBackNav}
              className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide text-[#FFF5E3] leading-[1.08]"
            >
              Exclusive Packages & Offers
            </MaskedText>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="font-dmsans text-[15px] sm:text-base md:text-lg text-[#F8F0DF]/90 max-w-2xl leading-[1.7] text-balance"
            >
              Curated stay, dining, and celebration packages tailored for highway travelers, family gatherings, and wedding hosts at Shaan-E-Punjab Hotel on the Grand Trunk Road.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 2. CATEGORY FILTER CONTROLS                                  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-[#171512]/15">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
              Browse Offer Categories
            </span>
            <span className="text-xs text-[#514B40] font-medium">
              Showing {filteredOffers.length} confirmed package{filteredOffers.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                  selectedFilter === tab
                    ? 'bg-[#C69224] text-[#171512] border-[#171512] shadow-xs'
                    : 'bg-[#FFF9ED] text-[#514B40] hover:text-[#171512] border-[#171512]/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. OFFERS GRID WITH STAGGERED CARDS & ANIMATED BORDERS       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredOffers.map((offer, idx) => (
            <motion.div key={offer.id} variants={itemFadeUp}>
              <Card3D intensity={4}>
                <div className="bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
                  
                  {/* Card Image with Gentle Zoom on Hover */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-[#FFF9ED] border-b border-[#171512]">
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
                      <VisualAsset
                        type={offer.imageCategory || 'hotel_banquet_hall'}
                        src={offer.image}
                        aspect="16:9"
                        className="w-full h-full object-cover"
                        title={offer.title}
                        subtitle={offer.category}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Animated Promotional Gold Label */}
                    <motion.div
                      initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.15 + idx * 0.05 }}
                      className="absolute top-3 left-3 bg-[#C69224] text-[#171512] border border-[#171512] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5"
                    >
                      {getCategoryIcon(offer.category)}
                      <span>{offer.category} Package</span>
                    </motion.div>

                    {/* Custom Badge if supplied */}
                    {offer.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold text-[#171512] bg-[#FFF5E3] px-2.5 py-1 rounded-md border border-[#171512]">
                        {offer.badge}
                      </span>
                    )}

                    {/* Title overlay in image header */}
                    <div className="absolute bottom-3 inset-x-3 text-white">
                      <p className="text-[11px] text-[#E5B94F] drop-shadow font-semibold">
                        {offer.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#171512] group-hover:text-[#C69224] transition-colors">
                        {offer.title}
                      </h2>

                      <p className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed">
                        {offer.description}
                      </p>

                      {/* Eligibility / Included Services */}
                      <div className="p-3.5 bg-[#FFF9ED] rounded-xl border border-[#171512]/30 space-y-1.5 text-xs font-inter">
                        <span className="font-montserrat text-[10px] uppercase font-bold text-[#171512] tracking-wider block">
                          Eligible Services:
                        </span>
                        <p className="text-[#514B40] font-medium">
                          {offer.eligibleServices}
                        </p>
                        <div className="pt-2 border-t border-[#171512]/15 flex items-center gap-1.5 text-[#9B6B12] text-[11px] font-bold">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{offer.validity}</span>
                        </div>
                      </div>

                      {/* Terms & Conditions */}
                      <div className="space-y-1 font-inter">
                        <span className="font-montserrat text-[10px] uppercase font-bold text-[#171512] tracking-wider block">
                          Terms & Conditions:
                        </span>
                        <ul className="space-y-1 text-xs text-[#514B40]">
                          {offer.terms.map((term, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]">
                              <span className="text-[#C69224] font-bold mt-0.5">•</span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card Footer with Enquire Now Action */}
                    <div className="pt-4 border-t border-[#171512]/15 flex items-center justify-between gap-3 font-inter">
                      <span className="text-[10px] text-[#514B40] font-medium">
                        Direct Desk Privilege
                      </span>
                      <button
                        onClick={() => openEnquiryModal('general', offer.title)}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex items-center gap-1.5 group/btn"
                      >
                        <span>Enquire Now</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#171512] group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>

                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 4. CUSTOM GROUP & TOUR PACKAGES CALLOUT                      */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 bg-[#FFF5E3] border border-[#171512] rounded-3xl text-center max-w-3xl mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224] mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#171512]">
            Need a Tailored Group or Tour Package?
          </h2>
          <p className="text-xs sm:text-sm text-[#514B40] leading-relaxed max-w-xl mx-auto">
            We curate custom dining, lodging, and celebration packages for tourist bus groups, corporate teams, and wedding attendees passing through Dhanbad and Topchanchi.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openEnquiryModal('general', 'Custom Group Package')}
              className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Enquire for Custom Package
            </button>
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="px-5 py-3 text-xs font-bold text-[#171512] bg-[#FFF9ED] hover:bg-white border border-[#171512] rounded-xl transition-all inline-flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#C69224]" />
              <span>Call Desk: {settings.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. DIRECT BOOKING ASSURANCE                                  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#514B40] shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#C69224] shrink-0" />
            <div>
              <p className="font-bold text-[#171512] text-xs">Direct Reservation Assurance</p>
              <p className="text-[#514B40] text-[11px] mt-0.5">
                All packages are verified directly with our hotel team in Topchanchi. No middleman charges, online food ordering, or card prepayment required.
              </p>
            </div>
          </div>
          <button
            onClick={() => openEnquiryModal('room')}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Check General Dates
          </button>
        </div>
      </section>

    </div>
  );
};
