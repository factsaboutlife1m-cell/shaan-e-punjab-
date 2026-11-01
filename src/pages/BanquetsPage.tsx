import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset } from '../components/VisualAsset';
import { Card3D } from '../components/Card3D';
import { MaskedText } from '../components/MaskedText';
import { BANQUET_VENUES, GALLERY_ITEMS } from '../data/hotelData';
import {
  Users,
  Sparkles,
  Calendar,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  Heart,
  Briefcase,
  Cake,
  GlassWater,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  PartyPopper,
  Compass,
} from 'lucide-react';

// Animated Section Divider in Brand Gold & Thin Black
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

export const BanquetsPage: React.FC = () => {
  const { addEnquiry, settings, openLightbox, isBackNav } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  // Parallax ref for hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOverlayY = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  // Event enquiry form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(150);
  const [eventType, setEventType] = useState('Wedding / Reception');
  const [preferredVenue, setPreferredVenue] = useState('The Grand Shaan Ballroom');
  const [message, setMessage] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 3) {
      setError('Please provide your full name (minimum 3 characters)');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile phone number');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (!date) {
      setError('Please select your preferred tentative event date');
      return;
    }

    const result = addEnquiry({
      type: 'banquet',
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      date,
      guests: Number(guests) || 50,
      eventType,
      message: `Preferred Venue: ${preferredVenue}. Notes: ${message.trim() || 'None'}`,
    });

    if (result.success) {
      setSubmittedId(result.enquiryId);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }
  };

  // Gallery items for banquets
  const banquetGalleryItems = GALLERY_ITEMS.filter(
    (item) => item.category === 'banquet' || item.category === 'events'
  );

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 pb-16 overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. EVENT HERO BANNER: "Celebrate Every Special Moment"       */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative w-full h-[60vh] min-h-[460px] max-h-[640px] overflow-hidden flex items-end border-b border-[#171512]"
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
          <img
            src="/assets/aistudio/hall.jpg"
            alt="Shaan-E-Punjab Luxury Banquet & Party Hall, Topchanchi"
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
            decoding="async"
          />
          {/* Subtle balanced gradient for clear visibility of the hall interior while guaranteeing text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/75 to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#171512]/60 pointer-events-none" />

          {/* Warm ambient gold hall lighting glow */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C69224]/20 rounded-full blur-3xl pointer-events-none" />
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF5E3] border border-[#171512] rounded-full text-xs text-[#171512] shadow-md font-montserrat"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C69224]" />
              <span className="font-bold text-[#171512]">Banquets & Celebrations</span>
              <span className="text-[#514B40]">·</span>
              <span className="text-[#514B40]">Topchanchi, Dhanbad (NH-19)</span>
            </motion.div>

            {/* Heading: "Celebrate Every Special Moment" */}
            <MaskedText
              as="h1"
              delay={0.2}
              showAccentLine={true}
              skipAnimation={isBackNav}
              className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-bold text-[#FFF5E3] tracking-tight leading-[1.08]"
            >
              Celebrate Every Special Moment
            </MaskedText>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="font-dmsans text-sm sm:text-base text-[#F8F0DF]/90 max-w-2xl leading-[1.7] text-balance"
            >
              From majestic Indian weddings and reception galas to milestone birthdays, anniversaries, and corporate seminars — discover Topchanchi's premier banquet destination with ballrooms and open-air lawns.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3 pt-2 font-inter"
            >
              <a
                href="#event-enquiry"
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer"
              >
                Plan Your Event
              </a>
              <a
                href="#venues-overview"
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-white border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer"
              >
                Explore Venues
              </a>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="px-5 py-3 text-xs md:text-sm font-semibold text-[#FFF5E3] hover:text-[#C69224] bg-[#171512]/80 hover:bg-[#171512] border border-[#C69224]/50 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#E5B94F]" />
                <span>Call Banquet Desk</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 2. INTRODUCTION TO EVENT SERVICES & VENUES                   */}
      {/* ============================================================ */}
      <section id="venues-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C69224] font-montserrat">
            Grand Venues in Topchanchi
          </span>
          <MaskedText
            as="h2"
            delay={0.1}
            showAccentLine={true}
            className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-bold text-[#171512] justify-center"
          >
            Spacious Indoor Ballrooms & Open-Air Lawns
          </MaskedText>
          <p className="font-dmsans text-xs sm:text-sm text-[#514B40] max-w-2xl mx-auto leading-relaxed">
            Conveniently situated along the Grand Trunk Road (NH-19) with ample forecourt parking, high-capacity central air conditioning, and full catering infrastructure.
          </p>
        </div>

        {/* Venues Grid with Staggered Entrance & 3D Lift */}
        <div className="space-y-8">
          {BANQUET_VENUES.map((venue, idx) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Card3D intensity={4}>
                <div
                  className={`bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Visual Column (6 cols) */}
                  <div className="lg:col-span-6 overflow-hidden rounded-2xl group">
                    <VisualAsset
                      type={idx === 1 ? 'surroundings' : 'hotel_banquet_hall'}
                      aspect="16:9"
                      className="w-full shadow-md border border-[#171512] rounded-2xl group-hover:scale-103 transition-transform duration-700 ease-out"
                      title={venue.name}
                      subtitle={venue.capacityText}
                    />
                  </div>

                  {/* Narrative Column (6 cols) */}
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#171512] bg-[#C69224]/20 px-3 py-1 rounded-md border border-[#171512] font-montserrat">
                        {venue.capacityText}
                      </span>
                      <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#171512] mt-2">
                        {venue.name}
                      </h3>
                    </div>

                    <p className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed">
                      {venue.description}
                    </p>

                    <div>
                      <p className="font-montserrat text-xs font-bold text-[#171512] uppercase tracking-wider mb-2">
                        Ideal Occasions:
                      </p>
                      <div className="flex flex-wrap gap-1.5 font-inter">
                        {venue.idealFor.map((occ, i) => (
                          <span
                            key={i}
                            className="text-xs text-[#171512] bg-[#FFF9ED] px-2.5 py-1 rounded-md border border-[#171512]/40"
                          >
                            {occ}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-montserrat text-xs font-bold text-[#171512] uppercase tracking-wider mb-2">
                        Venue Amenities:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#514B40] font-inter">
                        {venue.amenities.slice(0, 4).map((amenity, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href="#event-enquiry"
                        onClick={() => {
                          setPreferredVenue(venue.name);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-sm group/btn font-inter"
                      >
                        <span>Enquire for {venue.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 3. WEDDINGS & RECEPTIONS                                     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF5E3] border border-[#171512] rounded-full text-xs text-[#171512] mb-2">
                <Heart className="w-3.5 h-3.5 text-[#C69224]" />
                <span className="font-bold uppercase tracking-wider">Royal Celebrations</span>
              </div>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]"
              >
                Weddings & Marriage Receptions
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              Your wedding day deserves nothing less than perfection. Shaan-E-Punjab Hotel offers the ideal setting for grand North Indian wedding celebrations with both indoor ballroom splendour and starlit lawn settings accommodating up to 700 guests.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              We provide elevated bridal stages, professional crystal chandelier lighting, sound consoles for sangeet performances, and custom floral Mandap decor. Our master chefs prepare lavish wedding banquets with live clay tandoor counters, dedicated sweetmeat stalls, and separate vegetarian and non-vegetarian buffet islands.
            </p>

            <div className="space-y-2.5 pt-1 text-xs text-[#514B40]">
              <div className="flex items-center gap-2 p-2.5 bg-[#FFF5E3] rounded-xl border border-[#171512]">
                <CheckCircle2 className="w-4 h-4 text-[#C69224] shrink-0" />
                <span className="text-[#171512]">Pillar-less hall with elevated Mandap & stage setups</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#FFF5E3] rounded-xl border border-[#171512]">
                <CheckCircle2 className="w-4 h-4 text-[#C69224] shrink-0" />
                <span className="text-[#171512]">Complimentary bridal preparation room with attached washroom</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#FFF5E3] rounded-xl border border-[#171512]">
                <CheckCircle2 className="w-4 h-4 text-[#C69224] shrink-0" />
                <span className="text-[#171512]">Accommodation packages for out-of-town wedding attendees</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#event-enquiry"
                onClick={() => setEventType('Wedding / Reception')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md"
              >
                <span>Enquire for Weddings</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <Card3D intensity={5}>
              <VisualAsset
                type="hotel_banquet_hall"
                aspect="4:3"
                className="w-full shadow-md border border-[#171512] rounded-2xl"
                title="The Grand Shaan Ballroom"
                subtitle="Lavish wedding stage and banquet dining arrangement"
              />
            </Card3D>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 4. BIRTHDAY PARTIES                                          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            <Card3D intensity={5}>
              <VisualAsset
                type="hotel_restaurant_ambience"
                aspect="4:3"
                className="w-full shadow-md border border-[#171512] rounded-2xl"
                title="Kohinoor Celebration Suite"
                subtitle="Chic party decor and interactive buffet arrangements"
              />
            </Card3D>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="order-1 lg:order-2 space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF5E3] border border-[#171512] rounded-full text-xs text-[#171512] mb-2">
                <Cake className="w-3.5 h-3.5 text-[#C69224]" />
                <span className="font-bold uppercase tracking-wider">Milestone Birthdays</span>
              </div>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]"
              >
                Birthday Celebrations & Jubilees
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              Celebrate your loved ones with an unforgettable birthday party at Shaan-E-Punjab Hotel. Whether planning a colorful 1st birthday party, a teen celebration, or a milestone 50th or 60th jubilee, our Kohinoor Suite and Grand Ballroom provide the perfect canvas.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              We coordinate customized balloon arches, fairy light backdrops, dynamic DJ sound setups, and curated finger-food appetizers followed by royal North Indian dinner buffets.
            </p>

            <div className="pt-2">
              <a
                href="#event-enquiry"
                onClick={() => setEventType('Birthday Party')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md"
              >
                <span>Plan Birthday Event</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 5. ANNIVERSARIES                                             */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF5E3] border border-[#171512] rounded-full text-xs text-[#171512] mb-2">
                <GlassWater className="w-3.5 h-3.5 text-[#C69224]" />
                <span className="font-bold uppercase tracking-wider">Milestone Anniversaries</span>
              </div>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]"
              >
                Silver, Golden & Wedding Anniversaries
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              Honor decades of love and companionship surrounded by family and close friends. Our team specializes in intimate and grand anniversary banquets tailored with elegant candlelit tables, photo montage screens, and customized multicourse feasts.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              From traditional Punjabi welcome drinks to freshly flipped naans and slow-simmered gravies, our dining experience turns milestone anniversaries into cherished memories.
            </p>

            <div className="pt-2">
              <a
                href="#event-enquiry"
                onClick={() => setEventType('Anniversary')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md"
              >
                <span>Enquire for Anniversary</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <Card3D intensity={5}>
              <VisualAsset
                type="hotel_banquet_hall"
                aspect="4:3"
                className="w-full shadow-md border border-[#171512] rounded-2xl"
                title="Intimate Anniversary Celebration"
                subtitle="Elegant chandelier illumination and reserved family dining"
              />
            </Card3D>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 6. FAMILY GATHERINGS & REUNIONS                              */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            <Card3D intensity={5}>
              <VisualAsset
                type="surroundings"
                aspect="4:3"
                className="w-full shadow-md border border-[#171512] rounded-2xl"
                title="Punjab Utsav Open Lawn"
                subtitle="Pleasant open-air breezes and large family gatherings"
              />
            </Card3D>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="order-1 lg:order-2 space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF5E3] border border-[#171512] rounded-full text-xs text-[#171512] mb-2">
                <Users className="w-3.5 h-3.5 text-[#C69224]" />
                <span className="font-bold uppercase tracking-wider">Family Functions</span>
              </div>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]"
              >
                Ring Ceremonies & Family Reunions
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              From auspicious Roka and Sagai ceremonies to sacred thread rituals, mundan functions, and festive family reunions, Shaan-E-Punjab Hotel offers the ideal central location on NH-19 for extended families convening from Dhanbad, Bokaro, and beyond.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              Our spacious private grounds ensure easy car parking for convoys, flexible seating plans, and warm hospitality where children, elders, and out-of-town relatives feel thoroughly cared for.
            </p>

            <div className="pt-2">
              <a
                href="#event-enquiry"
                onClick={() => setEventType('Family Gathering')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md"
              >
                <span>Host Family Gathering</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 7. CORPORATE EVENTS & SEMINARS                               */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF5E3] border border-[#171512] rounded-full text-xs text-[#171512] mb-2">
                <Briefcase className="w-3.5 h-3.5 text-[#C69224]" />
                <span className="font-bold uppercase tracking-wider">Business Seminars</span>
              </div>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]"
              >
                Corporate Conferences & Dealer Meets
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              Equipped with motorized presentation screens, wireless PA microphones, high-speed Wi-Fi, and modular seating arrangements (theatre, cluster, U-shape), our facilities cater to regional corporate teams from Dhanbad and Bokaro.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              We provide executive high tea service, business lunches, and post-conference dinner spreads tailored to your corporate schedule.
            </p>

            <div className="pt-2">
              <a
                href="#event-enquiry"
                onClick={() => setEventType('Corporate Event')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md"
              >
                <span>Enquire for Corporate Meet</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <Card3D intensity={5}>
              <VisualAsset
                type="hotel_banquet_hall"
                aspect="4:3"
                className="w-full shadow-md border border-[#171512] rounded-2xl"
                title="Conference & Seminar Hall"
                subtitle="Equipped with audio-visual presentation setup"
              />
            </Card3D>
          </motion.div>

        </div>
      </section>

      {/* Animated Divider */}
      <GoldBlackDivider delay={0.1} />

      {/* ============================================================ */}
      {/* 8. EVENT PHOTO GALLERY                                       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
            Visual Showcase
          </span>
          <MaskedText
            as="h2"
            delay={0.1}
            showAccentLine={true}
            className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512] justify-center"
          >
            Event Moments & Celebrations
          </MaskedText>
          <p className="text-xs sm:text-sm text-[#514B40]">
            A glimpse into wedding stage arrangements, banquet decor, and lawn celebrations. Click any photo for high-resolution lightbox view.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {banquetGalleryItems.map((item, idx) => (
            <Card3D
              key={item.id}
              intensity={4}
              onClick={() => openLightbox(banquetGalleryItems, idx)}
            >
              <div className="bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-2xl overflow-hidden transition-all cursor-pointer group shadow-sm">
                <VisualAsset
                  type={item.category}
                  src={item.image}
                  aspect="4:3"
                  className="w-full group-hover:scale-104 transition-transform duration-500"
                  title={item.title}
                />
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. EVENT ENQUIRY FORM                                        */}
      {/* ============================================================ */}
      <section id="event-enquiry" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
                Event Planning Desk
              </span>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-2xl sm:text-3xl font-bold text-[#171512]"
              >
                Plan Your Celebration
              </MaskedText>

              <p className="text-xs sm:text-sm text-[#514B40] leading-relaxed">
                Connect directly with our banquet manager to check hall dates, discuss custom catering menus, and receive a transparent venue quotation without intermediary commissions.
              </p>

              <div className="p-4 bg-[#FFF9ED] border border-[#171512] rounded-2xl space-y-2 text-xs text-[#514B40]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C69224] shrink-0" />
                  <span className="text-[#171512]">No obligation quotation with personalized hall walkthrough</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C69224] shrink-0" />
                  <span>Direct Banquet Phone: <strong className="text-[#171512] font-bold">{settings.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C69224] shrink-0" />
                  <span>Email: <strong className="text-[#171512] font-bold">{settings.email}</strong></span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submittedId ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-[#FFF9ED] border border-[#171512] rounded-2xl text-center space-y-3"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#C69224] mx-auto" />
                  <h3 className="text-base font-bold text-[#171512]">Event Enquiry Received!</h3>
                  <p className="text-xs text-[#514B40] leading-relaxed">
                    Your banquet enquiry reference ID is <span className="font-mono text-[#C69224] font-bold">#{submittedId}</span>. Our banquet manager will review your guest count and contact your phone shortly to schedule a venue visit.
                  </p>
                  <button
                    onClick={() => setSubmittedId(null)}
                    className="px-5 py-2 text-xs font-bold bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Another Event Enquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-300">
                      {error}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Your Full Name <span className="text-[#C69224]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sanjeev Gupta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Mobile Phone Number <span className="text-[#C69224]">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. sanjeev@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Preferred Event Date <span className="text-[#C69224]">*</span>
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Event Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                      >
                        <option>Wedding / Reception</option>
                        <option>Birthday Party</option>
                        <option>Anniversary</option>
                        <option>Family Gathering / Ring Ceremony</option>
                        <option>Corporate Event / Seminar</option>
                        <option>Other Special Occasion</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Preferred Venue
                      </label>
                      <select
                        value={preferredVenue}
                        onChange={(e) => setPreferredVenue(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                      >
                        <option>The Grand Shaan Ballroom (150–500)</option>
                        <option>Punjab Utsav Open Lawn (200–700)</option>
                        <option>Kohinoor Suite (40–120)</option>
                        <option>Undecided / Needs Guidance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Estimated Guest Count
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="700"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                      Event Details / Catering Preferences / Stage Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Vegetarian feast requirements, Mandap decoration preference, guest rooms needed..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#171512] shadow-md cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Submit Banquet Enquiry</span>
                    <ArrowRight className="w-4 h-4 text-[#171512] group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
