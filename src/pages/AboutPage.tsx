import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset, REAL_HOTEL_EXTERIOR_PATH } from '../components/VisualAsset';
import { Card3D } from '../components/Card3D';
import { MaskedText } from '../components/MaskedText';
import {
  ShieldCheck,
  Utensils,
  Heart,
  MapPin,
  Users,
  Clock,
  Car,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Phone,
  CheckCircle2,
  Compass,
  Calendar,
  Building2,
  Award,
} from 'lucide-react';

// Animated Section Divider in Brand Gold & Thin Black Accent
const GoldBlackDivider: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  return (
    <div className="flex items-center justify-center gap-3 py-6 sm:py-8 overflow-hidden select-none">
      <motion.div
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.65,
          delay: shouldReduceMotion ? 0 : delay,
          ease: 'easeOut',
        }}
        style={{ originX: 1 }}
        className="h-[2px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#C69224]"
      />
      <div className="w-2.5 h-2.5 rounded-full bg-[#C69224] shadow-[0_0_8px_#C69224]" />
      <motion.div
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.65,
          delay: shouldReduceMotion ? 0 : delay + 0.1,
          ease: 'easeOut',
        }}
        style={{ originX: 0 }}
        className="h-[2px] w-12 sm:w-20 bg-gradient-to-r from-[#171512] to-transparent"
      />
    </div>
  );
};

export const AboutPage: React.FC = () => {
  const { navigateTo, openEnquiryModal, settings, isBackNav } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  // Parallax ref for hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOverlayY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  // Staggered variants for cards
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

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 pb-16 overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. ARCHITECTURAL HERO BANNER: "Our Story"                    */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative w-full h-[62vh] min-h-[460px] max-h-[640px] overflow-hidden flex items-end"
      >
        {/* Real Exterior Photograph Background with slow zoom */}
        <motion.div
          initial={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          animate={{ scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 7,
            ease: 'easeOut',
          }}
          className="absolute inset-0 z-0 origin-center"
        >
          <img
            src={REAL_HOTEL_EXTERIOR_PATH}
            alt="Shaan-E-Punjab Hotel Architectural Exterior, Topchanchi"
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
          />
          {/* Cinematic Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/95 via-[#171512]/60 to-[#171512]/40" />

          {/* Accent lighting reflections */}
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
              <span className="font-montserrat font-bold text-[#171512]">Shaan-E-Punjab Hotel</span>
              <span className="text-[#514B40]">·</span>
              <span className="font-inter text-[#514B40]">Topchanchi, Dhanbad, NH-19</span>
            </motion.div>

            {/* Masked Heading Reveal */}
            <MaskedText
              as="h1"
              delay={0.2}
              showAccentLine={true}
              skipAnimation={isBackNav}
              className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08] drop-shadow-md"
            >
              Our Story
            </MaskedText>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="font-dmsans text-[15px] sm:text-base md:text-lg text-[#FFF5E3] max-w-2xl leading-[1.7] text-balance drop-shadow-sm"
            >
              A distinguished highway destination for restful stays, authentic Punjabi flavours, and memorable celebrations along the historic Grand Trunk Road.
            </motion.p>
          </div>
        </motion.div>

        {/* Soft bottom transition mask */}
        <div className="absolute -bottom-1 inset-x-0 h-28 bg-gradient-to-t from-[#F8F0DF] via-[#F8F0DF]/80 to-transparent pointer-events-none z-10" />
      </section>

      {/* ============================================================ */}
      {/* 2. INTRODUCTION TO THE HOTEL (Text Left, Image Right)        */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Text Reveal */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-5"
          >
            <div>
              <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
                Welcoming GT Road Travelers
              </span>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] mt-1 leading-tight"
              >
                A Sanctuary of Rest & Flavour
              </MaskedText>
            </div>

            <p className="font-dmsans text-[15px] sm:text-base text-[#514B40] leading-[1.7]">
              Situated in the picturesque landscape of Topchanchi along the National Highway 19 (historic Grand Trunk Road), Shaan-E-Punjab Hotel was established with a clear commitment: to provide an oasis of comfort, genuine warmth, and culinary excellence for highway travelers, local families, and event hosts.
            </p>

            <p className="font-dmsans text-[15px] sm:text-base text-[#514B40] leading-[1.7]">
              Positioned conveniently between Kolkata, Asansol, Dhanbad, and Varanasi, our property combines modern architectural comforts with the legendary hospitality tradition of Punjab. Whether arriving late at night after hours of driving, stopping for a leisurely multi-cuisine lunch with family, or hosting a multi-day wedding celebration, every guest is met with attentive, round-the-clock service.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#FFF5E3] border border-[#171512] rounded-xl shadow-sm">
                <span className="font-montserrat text-xs font-bold text-[#171512] block">Strategic Stopover</span>
                <span className="font-dmsans text-[11px] text-[#514B40] mt-0.5 block">Direct NH-19 corridor access</span>
              </div>
              <div className="p-3.5 bg-[#FFF5E3] border border-[#171512] rounded-xl shadow-sm">
                <span className="font-montserrat text-xs font-bold text-[#171512] block">Family-First Care</span>
                <span className="font-dmsans text-[11px] text-[#514B40] mt-0.5 block">Clean, secure & respectful</span>
              </div>
            </div>
          </motion.div>

          {/* Right Image Reveal with 3D Depth */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <Card3D intensity={5}>
              <div className="relative rounded-2xl overflow-hidden border border-[#171512] shadow-xl group">
                <img
                  src={REAL_HOTEL_EXTERIOR_PATH}
                  alt="Shaan-E-Punjab Hotel, Topchanchi Front View"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/90 via-[#171512]/25 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 inset-x-4 p-4 bg-[#171512]/90 backdrop-blur-md rounded-xl border border-[#C69224]/40 text-xs">
                  <p className="font-bold text-[#FFF5E3] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C69224]" />
                    <span>Topchanchi Highway Landmark</span>
                  </p>
                  <p className="text-[#FFF5E3]/80 text-[11px] mt-1 leading-relaxed">
                    Instantly recognizable along NH-19 with bright red panels, silver cladding, and bright night illumination.
                  </p>
                </div>
              </div>
            </Card3D>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 3. HOTEL EXTERIOR & PROPERTY OVERVIEW (Image Left, Text Right)*/}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Image Reveal with 3D Depth */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            <Card3D intensity={5}>
              <div className="relative rounded-2xl overflow-hidden border border-[#171512] shadow-xl group">
                <img
                  src={REAL_HOTEL_EXTERIOR_PATH}
                  alt="Shaan-E-Punjab Hotel Architectural Cladding & Forecourt"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/90 via-[#171512]/25 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 inset-x-4 p-4 bg-[#FFF5E3] border border-[#171512] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#171512]">Modern Architectural Design</span>
                    <span className="text-[10px] text-[#9B6B12] font-bold uppercase">NH-19 Frontage</span>
                  </div>
                  <p className="text-[#514B40] text-[11px] leading-relaxed">
                    Featuring bright red composite facade panels, metallic silver borders, dark charcoal window styling, and illuminated signage.
                  </p>
                </div>
              </div>
            </Card3D>
          </motion.div>

          {/* Right Text Reveal */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="order-1 lg:order-2 space-y-5"
          >
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
                Property & Facilities
              </span>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="text-2xl sm:text-3xl font-extrabold text-[#171512] mt-1"
              >
                Engineered for Highway Convenience
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              The physical layout of Shaan-E-Punjab Hotel has been intentionally crafted to simplify arrival and transit. Positioned directly on the highway edge without requiring navigation through tight local alleys, vehicles of all sizes enjoy immediate access.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              Our spacious private forecourt provides ample secured parking, supervised round-the-clock by security personnel and CCTV cameras. Inside, guests discover clean air-conditioned accommodations, a welcoming dining floor, and vast banquet facilities serviced by dedicated back-of-house staff.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3 p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl shadow-sm">
                <Car className="w-5 h-5 text-[#C69224] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#171512] block">Secured Forecourt Parking</span>
                  <span className="text-[11px] text-[#514B40]">Accommodating private cars, tour buses & wedding convoys</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl shadow-sm">
                <Clock className="w-5 h-5 text-[#C69224] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#171512] block">24/7 Front Desk & Assistance</span>
                  <span className="text-[11px] text-[#514B40]">Ready for late-night arrivals and early-morning departures</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 4. HOSPITALITY & GUEST EXPERIENCE (Staggered Feature Cards)  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
            Our Pillars of Care
          </span>
          <MaskedText
            as="h2"
            delay={0.1}
            showAccentLine={true}
            className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] justify-center leading-tight"
          >
            Hospitality Rooted in Respect & Hygiene
          </MaskedText>
          <p className="font-dmsans text-xs sm:text-sm text-[#514B40]">
            Carefully curated standards ensuring every stay and dining visit is restful and reassuring.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={itemFadeUp}>
            <Card3D intensity={5}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">24/7 Highway Transit Care</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Round-the-clock reception, express check-in, night assistance, and hot tea service for highway drivers arriving at any hour.
                </p>
              </div>
            </Card3D>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemFadeUp}>
            <Card3D intensity={5}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Pristine Hygiene & Rest</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Every room undergoes thorough sanitization, linen replacement, and temperature checks. High-pressure geysers provide instant hot water.
                </p>
              </div>
            </Card3D>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemFadeUp}>
            <Card3D intensity={5}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Family-Centric Comfort</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  A respectful, safe environment for families traveling with children and elderly members, with prompt dining service and courteous attendants.
                </p>
              </div>
            </Card3D>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemFadeUp}>
            <Card3D intensity={5}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Honest & Transparent</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Clear room tariffs, upfront dining bills with no hidden extras, and authentic advice on regional routes, timings, and tourist spots.
                </p>
              </div>
            </Card3D>
          </motion.div>
        </motion.div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 5. RESTAURANT AND DINING INTRODUCTION (Text Left, Image Right)*/}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF9ED] border border-[#C69224]/50 rounded-full text-xs text-[#9B6B12] mb-2 font-semibold">
                <Utensils className="w-3.5 h-3.5 text-[#C69224]" />
                <span className="uppercase tracking-wider">Multi-Cuisine Family Dining</span>
              </div>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171512]"
              >
                Authentic Flavours from the Punjabi Tandoor
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              Food is at the heart of the Shaan-E-Punjab experience. Our restaurant celebrates North Indian and Punjabi culinary traditions with slow-cooked gravies, hand-crushed whole spices, and piping hot clay oven delicacies.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              We operate dedicated preparation sections for vegetarian and non-vegetarian menus, using fresh regional ingredients and pure dairy ghee. Please note that our restaurant is exclusively dedicated to on-premises dine-in service; we do not offer online food delivery, preserving our attentive focus on every guest seated at our tables.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('restaurant')}
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 group"
              >
                <span>Explore Full Menu</span>
                <ChevronRight className="w-4 h-4 text-[#171512] group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => openEnquiryModal('restaurant')}
                className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl transition-colors cursor-pointer"
              >
                Enquire About a Table
              </button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <Card3D intensity={5}>
              <VisualAsset
                type="hotel_restaurant_ambience"
                aspect="4:3"
                className="w-full shadow-xl border border-[#171512] rounded-2xl"
                title="Shaan-E-Punjab Dining Hall"
                subtitle="Warm, air-conditioned family dining with authentic clay tandoor"
              />
            </Card3D>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 6. BANQUETS & CELEBRATIONS OVERVIEW (Image Left, Text Right) */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            <Card3D intensity={5}>
              <VisualAsset
                type="hotel_banquet_hall"
                aspect="4:3"
                className="w-full shadow-xl border border-[#171512] rounded-2xl"
                title="The Grand Shaan Ballroom"
                subtitle="Pillar-less air-conditioned hall accommodating grand weddings & receptions"
              />
            </Card3D>
          </motion.div>

          {/* Right Text */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="order-1 lg:order-2 space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF9ED] border border-[#C69224]/50 rounded-full text-xs text-[#9B6B12] mb-2 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#C69224]" />
                <span className="uppercase tracking-wider">Weddings & Banquets</span>
              </div>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171512]"
              >
                Memorable Occasions in Topchanchi
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              From grand Indian wedding ceremonies, sangeet nights, and ring ceremonies to corporate seminars, birthday milestones, and family reunions, Shaan-E-Punjab Hotel offers the premier event address in Topchanchi.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              We offer both indoor and outdoor options: <strong>The Grand Shaan Ballroom</strong> (a pillar-less, fully air-conditioned ballroom with stage lighting and dining space for up to 500 guests) and <strong>The Royal Lawn</strong> (a manicured open-air garden setting accommodating up to 700 guests). Our dedicated banquet team coordinates setup, stage decoration, and customized multi-cuisine catering.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('banquets')}
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 group"
              >
                <span>Explore Venues</span>
                <ChevronRight className="w-4 h-4 text-[#171512] group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => openEnquiryModal('banquet')}
                className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl transition-colors cursor-pointer"
              >
                Enquire For Your Event
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 7. LOCATION SECTION (Text Left, Location Card Right)         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-5"
          >
            <div>
              <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
                Regional Hub
              </span>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] mt-1 leading-tight"
              >
                Strategic NH-19 Connectivity
              </MaskedText>
            </div>

            <p className="font-dmsans text-[15px] sm:text-base text-[#514B40] leading-[1.7]">
              Shaan-E-Punjab Hotel is situated directly on National Highway 19 at Topchanchi in the Dhanbad district of Jharkhand. Our roadside location guarantees zero complex turns or narrow township diversions for highway transit.
            </p>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl flex items-center justify-between shadow-sm">
                <span className="font-montserrat font-bold text-[#171512] flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#C69224]" />
                  Topchanchi Lake & Sanctuary
                </span>
                <span className="font-inter text-[#9B6B12] font-bold">4.2 km (7 mins)</span>
              </div>

              <div className="p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl flex items-center justify-between shadow-sm">
                <span className="font-montserrat font-bold text-[#171512] flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#C69224]" />
                  Parasnath Hills / Shikharji
                </span>
                <span className="font-inter text-[#9B6B12] font-bold">22 km (25 mins)</span>
              </div>

              <div className="p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl flex items-center justify-between shadow-sm">
                <span className="font-montserrat font-bold text-[#171512] flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#C69224]" />
                  Dhanbad Railway Junction
                </span>
                <span className="font-inter text-[#9B6B12] font-bold">32 km (45 mins)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-inter">
              <button
                onClick={() => navigateTo('location')}
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer"
              >
                View Driving Directions
              </button>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="px-5 py-3 text-xs font-bold text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#C69224]" />
                <span>Call Desk: {settings.phone}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Location Visual */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <Card3D intensity={5}>
              <VisualAsset
                type="location"
                aspect="4:3"
                className="w-full shadow-xl border border-[#171512] rounded-2xl"
                title="Grand Trunk Road (NH-19)"
                subtitle="Topchanchi, Dhanbad, Jharkhand — Direct highway frontage"
              />
            </Card3D>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 8. FINAL CONTACT CTA & SMOOTH TRANSITION TO FOOTER          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative overflow-hidden bg-[#171512] rounded-3xl p-8 sm:p-12 text-center text-[#FFF5E3] shadow-2xl border-2 border-[#C69224]"
        >
          {/* Subtle background glow accents */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#C69224]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E5B94F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#E5B94F]">
              Experience Shaan-E-Punjab Hospitality
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF5E3] leading-tight">
              We Look Forward to Welcoming You
            </h2>
            <p className="font-dmsans text-xs sm:text-sm text-[#FFF5E3]/85 leading-relaxed max-w-xl mx-auto">
              Plan your overnight stay, reserve your dining table, or discuss your upcoming celebration with our on-site management team in Topchanchi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 font-inter">
              <button
                onClick={() => openEnquiryModal('room')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                Enquire About Rooms
              </button>
              <button
                onClick={() => openEnquiryModal('banquet')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#E5B94F] hover:bg-[#F3CE74] border border-[#171512] rounded-xl transition-all cursor-pointer"
              >
                Plan Your Event
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#FFF5E3] bg-[#24201A] hover:bg-[#2F2A22] border border-[#C69224]/60 rounded-xl transition-all cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
