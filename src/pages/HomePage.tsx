import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset, REAL_HOTEL_EXTERIOR_PATH, REAL_HOTEL_GARDEN_PATH, REAL_HOTEL_BEDROOM_PATH } from '../components/VisualAsset';
import { Card3D } from '../components/Card3D';
import { MaskedText } from '../components/MaskedText';
import { FoodCard } from '../components/FoodCard';
import { FeaturedFoodSection } from '../components/FeaturedFoodSection';
import { RoomSlider } from '../components/RoomSlider';
import { FoodOrbitCarousel } from '../components/FoodOrbitCarousel';
import { RoomsExpandingGallery } from '../components/RoomsExpandingGallery';
import { GuestTestimonials } from '../components/GuestTestimonials';
import { EnquiryType } from '../types';
import {
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  Clock,
  Car,
  Sparkles,
  Utensils,
  MapPin,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  Star,
  Phone,
  Compass,
  Award,
  Maximize2,
  Navigation,
  Bed,
  Tag,
  Sprout,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SproutTypingText } from '../components/SproutTypingText';
import { BANQUET_VENUES, GALLERY_ITEMS, NEARBY_ATTRACTIONS } from '../data/hotelData';

// Letter arrays for SHAAN-E-PUNJAB slow-motion reveal
const SHAAN_E = ['S', 'H', 'A', 'A', 'N', '-', 'E'];
const PUNJAB = ['P', 'U', 'N', 'J', 'A', 'B'];

export const HomePage: React.FC = () => {
  const {
    navigateTo,
    openEnquiryModal,
    openLightbox,
    rooms,
    menu,
    offers,
    settings,
    addEnquiry,
  } = useHotel();

  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  // Letter reveal animation variants (slow-motion blur-to-sharp with scale and upward drift)
  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: 22,
      scale: 0.9,
    },
    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1,
      transition: shouldReduceMotion
        ? { duration: 0.01 }
        : {
            duration: 1.15,
            delay: 0.2 + i * 0.13,
            ease: [0.22, 1, 0.36, 1],
          },
    }),
  };

  // Detect mobile viewport or coarse touch pointer to reduce parallax and heavy transforms
  const [isMobileOrTouch, setIsMobileOrTouch] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      const isCoarse =
        typeof window !== 'undefined' &&
        (window.matchMedia('(hover: none), (pointer: coarse)').matches ||
          window.innerWidth < 768 ||
          'ontouchstart' in window);
      setIsMobileOrTouch(Boolean(isCoarse));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const disableHeavyEffects = shouldReduceMotion || isMobileOrTouch;

  // Smooth auto-scroll to next section ~2s after hero title finishes (~6s total)
  // Only triggers once per session, and cancelled immediately if the user touches, scrolls, or clicks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const alreadyScrolled = sessionStorage.getItem('sann_hero_auto_scrolled');
    if (alreadyScrolled) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const cancelAutoScroll = () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('wheel', cancelAutoScroll);
      window.removeEventListener('touchstart', cancelAutoScroll);
      window.removeEventListener('touchmove', cancelAutoScroll);
      window.removeEventListener('keydown', cancelAutoScroll);
      window.removeEventListener('mousedown', cancelAutoScroll);
      window.removeEventListener('pointerdown', cancelAutoScroll);
    };

    window.addEventListener('wheel', cancelAutoScroll, { passive: true });
    window.addEventListener('touchstart', cancelAutoScroll, { passive: true });
    window.addEventListener('touchmove', cancelAutoScroll, { passive: true });
    window.addEventListener('keydown', cancelAutoScroll, { passive: true });
    window.addEventListener('mousedown', cancelAutoScroll, { passive: true });
    window.addEventListener('pointerdown', cancelAutoScroll, { passive: true });

    timer = setTimeout(() => {
      if (!cancelled) {
        const nextSection = document.getElementById('quick-enquiry') || document.getElementById('about');
        if (nextSection) {
          sessionStorage.setItem('sann_hero_auto_scrolled', 'true');
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
      removeListeners();
    }, 6000);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      removeListeners();
    };
  }, []);

  const scrollToNextSection = () => {
    try {
      sessionStorage.setItem('sann_hero_auto_scrolled', 'true');
    } catch {
      // ignore
    }
    const nextSection = document.getElementById('quick-enquiry') || document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Parallax ref for Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Gentle parallax transforms (disabled on mobile or reduced motion)
  const heroBadgesY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const heroOverlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  // Video playback & sound controls state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Quick Enquiry Bar state
  const [quickType, setQuickType] = useState<EnquiryType>('room');
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickDate, setQuickDate] = useState('');
  const [quickDepDate, setQuickDepDate] = useState('');
  const [quickGuests, setQuickGuests] = useState(2);
  const [quickStatus, setQuickStatus] = useState<string | null>(null);
  const [quickError, setQuickError] = useState<string | null>(null);

  // Gallery Filter State on Home
  const [galleryFilter, setGalleryFilter] = useState<string>('all');

  const filteredGallery =
    galleryFilter === 'all'
      ? GALLERY_ITEMS.slice(0, 8)
      : GALLERY_ITEMS.filter((item) => item.category === galleryFilter).slice(0, 8);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError(null);

    if (!quickName.trim() || quickName.trim().length < 3) {
      setQuickError('Please enter your full name (minimum 3 characters)');
      return;
    }
    const cleanPhone = quickPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setQuickError('Please enter a valid 10-digit mobile number');
      return;
    }

    const result = addEnquiry({
      type: quickType,
      name: quickName.trim(),
      phone: quickPhone.trim(),
      date: quickDate || undefined,
      departureDate: quickDepDate || undefined,
      guests: Number(quickGuests) || 1,
      message: `Quick enquiry sent from homepage ${quickType} panel`,
    });

    if (result.success) {
      setQuickStatus(result.enquiryId);
      setQuickName('');
      setQuickPhone('');
      setQuickDate('');
      setQuickDepDate('');
    }
  };

  // Common staggered animations
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
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
    <div className="space-y-16 md:space-y-24 pb-16 overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. CINEMATIC HERO BANNER                                     */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        id="home"
        className="relative w-full min-h-[100svh] h-[100svh] overflow-hidden flex flex-col justify-between scroll-mt-20"
      >
        {/* Cinematic Hotel Video Background (Earth space zoom to Shaan-E-Punjab Night Facade) */}
        <div className="absolute inset-0 z-0 origin-center overflow-hidden">
          {!videoError ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              poster={REAL_HOTEL_EXTERIOR_PATH}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover object-center select-none"
            >
              <source
                src={settings.heroVideoUrl || "/assets/aistudio/VID_20261031_105129_264_bsl_97b51210.mp4"}
                type="video/mp4"
              />
              <source src="/assets/aistudio/gemini_generated_video_77ccc509_c873c3b5.mp4" type="video/mp4" />
              <img
                src={REAL_HOTEL_EXTERIOR_PATH}
                alt="Shaan-E-Punjab Hotel, Topchanchi, Dhanbad, Jharkhand"
                className="w-full h-full object-cover object-[center_28%] select-none"
                loading="eager"
              />
            </video>
          ) : (
            <img
              src={REAL_HOTEL_EXTERIOR_PATH}
              alt="Shaan-E-Punjab Hotel, Topchanchi, Dhanbad, Jharkhand"
              className="w-full h-full object-cover object-[center_28%] select-none"
              loading="eager"
            />
          )}

          {/* Floating Professional Playback & Sound Controls */}
          <div className="absolute bottom-6 right-4 sm:right-8 z-30 flex items-center gap-2 bg-[#FFF5E3]/95 backdrop-blur-md border border-[#171512] rounded-full p-1.5 shadow-xl text-[#171512]">
            <button
              type="button"
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-[#FFF9ED] hover:bg-white text-[#171512] border border-[#171512] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              title={isPlaying ? 'Pause video' : 'Play video'}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-[#FFF9ED] hover:bg-white text-[#171512] border border-[#171512] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#C69224] text-[#171512] hidden xs:inline-block border border-[#171512]">
              HD MP4
            </span>
          </div>

          {/* Subtle top vignette behind title to guarantee contrast over sky */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/85 via-black/55 to-transparent pointer-events-none" />
          {/* Layered cinematic vignettes and contrast grading transitioning into cream */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F0DF] via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/75 pointer-events-none" />
          
          {/* Subtle architectural accent light glow */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#C69224]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#E5B94F]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Floating Architectural Trust Badges with Gentle Parallax (Desktop Only) */}
        <motion.div
          style={{ y: disableHeavyEffects ? 0 : heroBadgesY }}
          className="absolute top-24 right-4 sm:right-10 z-10 hidden lg:flex flex-col gap-3 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="bg-[#FFF5E3]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#171512] text-xs shadow-xl flex items-center gap-2.5 text-[#171512]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#C69224] shadow-[0_0_10px_#C69224]" />
            <span className="font-montserrat font-bold tracking-wide text-xs">Grand Trunk Road (NH-19)</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-[#FFF5E3]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#171512] text-xs shadow-xl flex items-center gap-2.5 text-[#171512]"
          >
            <Star className="w-3.5 h-3.5 text-[#C69224] fill-[#C69224]" />
            <span className="font-montserrat font-bold tracking-wide text-xs">Multi-Cuisine Family Dining</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="bg-[#FFF5E3]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#171512] text-xs shadow-xl flex items-center gap-2.5 text-[#171512]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#9B6B12]" />
            <span className="font-montserrat font-bold tracking-wide text-xs">Secured Parking & 24/7 Desk</span>
          </motion.div>
        </motion.div>

        {/* 1. TOP-MIDDLE BLANK AREA: SHAAN-E-PUNJAB TITLE WITH SLOW-MOTION LETTER REVEAL */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-20 xs:pt-22 sm:pt-26 md:pt-28 flex flex-col items-center justify-center text-center">
          <h1
            aria-label="SHAAN-E-PUNJAB"
            className="font-cinzel gold-gradient-title text-[clamp(2.2rem,11vw,5rem)] font-extrabold tracking-[0.08em] uppercase leading-[1.05] select-none text-center flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1"
          >
            <span className="inline-flex whitespace-nowrap">
              {SHAAN_E.map((char, idx) => (
                <motion.span
                  key={`shaane-${idx}`}
                  custom={idx}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block transition-transform duration-300 hover:scale-110"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="inline-flex whitespace-nowrap">
              {PUNJAB.map((char, idx) => (
                <motion.span
                  key={`punjab-${idx}`}
                  custom={SHAAN_E.length + idx}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block transition-transform duration-300 hover:scale-110"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Decorative Divider Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.8, delay: 2.9, ease: [0.22, 1, 0.36, 1] }
            }
            className="flex items-center justify-center gap-3 my-2 w-full max-w-[240px] sm:max-w-[340px]"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C69224] to-transparent" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#C69224] shadow-[0_0_8px_#C69224]" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C69224] to-transparent" />
          </motion.div>

          {/* Elegant Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.8, delay: 3.35, ease: [0.22, 1, 0.36, 1] }
            }
            className="font-playfair italic text-xs xs:text-sm sm:text-base md:text-lg text-[#E5B94F] tracking-[0.2em] uppercase text-center font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
          >
            Authentic Punjabi Hospitality
          </motion.p>
        </div>

        {/* 2. BOTTOM HERO CONTENT OVERLAY & ACTIONS */}
        <motion.div
          style={{
            y: disableHeavyEffects ? 0 : heroTextY,
            opacity: disableHeavyEffects ? 1 : heroOverlayOpacity,
          }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20"
        >
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            
            {/* Top location pill badge */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 bg-[#FFF5E3]/95 border border-[#171512] rounded-full backdrop-blur-md text-[10.5px] sm:text-xs text-[#171512] shadow-lg max-w-full flex-wrap font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-[#C69224] animate-pulse shrink-0" />
              <span className="font-montserrat font-bold text-[#171512]">Topchanchi, Dhanbad, Jharkhand</span>
              <span className="text-[#514B40] hidden xs:inline">·</span>
              <span className="font-inter text-[#514B40] hidden xs:inline">Hotel • Restaurant • Banquets</span>
            </motion.div>

            {/* Headline */}
            <MaskedText
              as="h2"
              delay={0.25}
              showAccentLine={true}
              className="font-playfair text-[22px] xs:text-[28px] sm:text-[38px] md:text-[48px] font-bold text-white tracking-[-0.02em] leading-[1.15] sm:leading-[1.1] transition-transform duration-300 ease-out hover:scale-[1.01] origin-left cursor-default select-none break-words drop-shadow-md"
            >
              Experience Comfort, Flavour & Celebration
            </MaskedText>

            {/* Supporting description text */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="font-dmsans text-[13px] sm:text-base md:text-lg text-[#FFF5E3] max-w-2xl leading-[1.6] sm:leading-[1.7] text-balance hidden xs:block drop-shadow-sm"
            >
              Discover welcoming stays, delicious highway dining and memorable banquet celebrations at Shaan-E-Punjab Hotel, Topchanchi on the historic Grand Trunk Road (NH-19).
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { type: 'spring', stiffness: 280, damping: 22, delay: 0.75 }
              }
              className="flex flex-row items-center gap-2.5 sm:gap-3 pt-2"
            >
              <button
                onClick={scrollToNextSection}
                className="font-inter flex-1 sm:flex-initial justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl transition-all shadow-lg backdrop-blur-md cursor-pointer flex items-center gap-1.5 sm:gap-2 group min-h-[44px]"
              >
                <span>Explore Hotel</span>
                <ChevronDown className="w-4 h-4 text-[#171512] group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => openEnquiryModal('room')}
                className="font-inter flex-1 sm:flex-initial justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-xl cursor-pointer flex items-center gap-1.5 sm:gap-2 group min-h-[44px]"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4 text-[#171512] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Soft transition overlay revealing into the next cream section */}
        <div className="absolute -bottom-1 inset-x-0 h-24 bg-gradient-to-t from-[#F8F0DF] via-[#F8F0DF]/80 to-transparent pointer-events-none z-10" />

        {/* Animated Interactive Scroll Down Indicator at bottom center */}
        <motion.button
          onClick={scrollToNextSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-2.5 sm:bottom-4 inset-x-0 mx-auto w-fit flex flex-col items-center justify-center p-2 min-h-[44px] min-w-[44px] text-[#171512] hover:text-[#9B6B12] transition-colors z-20 cursor-pointer group"
          aria-label="Scroll down to quick enquiry"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-[#171512]"
          >
            <span className="font-montserrat">Scroll</span>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C69224] group-hover:translate-y-0.5 transition-transform" />
          </motion.div>
        </motion.button>
      </section>

      {/* ============================================================ */}
      {/* 2. QUICK ENQUIRY BAR (Direct Reservation Desk)               */}
      {/* ============================================================ */}
      <motion.section
        id="quick-enquiry"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-14 relative z-20 scroll-mt-20"
      >
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-2xl p-5 md:p-6 shadow-xl text-[#171512]">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-[#171512]/15 gap-3">
            <div>
              <span className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-[#9B6B12]">
                Direct Reservation Desk
              </span>
              <h2 className="font-playfair text-lg sm:text-xl font-bold text-[#171512]">Quick Availability Enquiry</h2>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#FFF9ED] rounded-lg border border-[#171512] self-start md:self-auto overflow-x-auto max-w-full">
              {(['room', 'restaurant', 'banquet', 'general'] as EnquiryType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setQuickType(type);
                    setQuickStatus(null);
                    setQuickError(null);
                  }}
                  className={`font-inter px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors whitespace-nowrap cursor-pointer ${
                    quickType === type
                      ? 'bg-[#C69224] text-[#171512] font-bold border border-[#171512] shadow-xs'
                      : 'text-[#514B40] hover:text-[#171512]'
                  }`}
                >
                  {type === 'room'
                    ? 'Room Stay'
                    : type === 'restaurant'
                    ? 'Dining Table'
                    : type === 'banquet'
                    ? 'Banquet Event'
                    : 'General'}
                </button>
              ))}
            </div>
          </div>

          {quickStatus ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-[#FFF9ED] border border-[#C69224] rounded-xl text-center flex flex-col sm:row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 text-left">
                <CheckCircle2 className="w-5 h-5 text-[#9B6B12] shrink-0" />
                <div>
                  <p className="font-montserrat text-xs font-bold text-[#171512]">
                    Enquiry Recorded (#{quickStatus})
                  </p>
                  <p className="font-dmsans text-[11px] text-[#514B40]">
                    Our team will contact you shortly to confirm arrangements.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickStatus(null)}
                className="font-inter px-4 py-1.5 text-xs font-bold bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] rounded-lg transition-colors cursor-pointer"
              >
                New Enquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleQuickSubmit} className="space-y-3 font-inter">
              {quickError && (
                <p className="text-xs text-red-700 bg-red-100 px-3 py-1.5 rounded border border-red-300">
                  {quickError}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-bold text-[#171512] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#171512] mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#171512] mb-1">
                    {quickType === 'room'
                      ? 'Check-In Date'
                      : quickType === 'restaurant'
                      ? 'Dining Date'
                      : 'Event Date'}
                  </label>
                  <input
                    type="date"
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#171512] mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={quickType === 'banquet' ? 500 : 20}
                    value={quickGuests}
                    onChange={(e) => setQuickGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Send Enquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/* 3. ABOUT THE HOTEL (Scroll-Triggered Reveal)                 */}
      {/* ============================================================ */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { type: 'spring', stiffness: 240, damping: 20 }
            }
          >
            <Card3D intensity={5}>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.025, y: -4 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() =>
                  openLightbox(
                    [
                      {
                        id: 'garden-lawn-hero',
                        title: 'Punjab Utsav Garden Lawn & Family Dhaba Dining',
                        category: 'exterior',
                        caption:
                          'Lush open-air garden dining, traditional Punjabi charpai seating, festive bamboo huts, palm trees, and recreation grounds at Shaan-E-Punjab Hotel, Topchanchi (NH-19).',
                        isVerifiedPhoto: true,
                        image: REAL_HOTEL_GARDEN_PATH,
                      },
                      ...GALLERY_ITEMS,
                    ],
                    0
                  )
                }
                className="relative rounded-2xl overflow-hidden border border-[#171512] shadow-xl group cursor-pointer select-none"
              >
                <img
                  src={REAL_HOTEL_GARDEN_PATH}
                  alt="Shaan-E-Punjab Hotel Punjab Utsav Garden Lawn & Outdoor Dining, Topchanchi"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />

                {/* Gradient Scrim for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/90 via-[#171512]/35 to-transparent pointer-events-none" />

                {/* Bottom Content Bar */}
                <div className="absolute bottom-4 inset-x-4 p-4 bg-[#171512]/90 backdrop-blur-md rounded-xl border border-[#C69224]/40 text-xs">
                  <p className="font-bold text-[#FFF5E3] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C69224]" />
                      Punjab Utsav Garden Lawn & Dining
                    </span>
                    <span className="text-[10px] text-[#E5B94F] font-semibold hidden sm:inline">
                      Click to Pop Up
                    </span>
                  </p>
                  <p className="text-[#FFF5E3]/80 text-[11px] mt-1 leading-relaxed">
                    Lush palm-tree garden dining, authentic Punjabi charpai seating, festive bamboo huts, and recreation grounds at Shaan-E-Punjab Hotel, Topchanchi (NH-19).
                  </p>
                </div>
              </motion.div>
            </Card3D>
          </motion.div>

          <div className="space-y-5">
            <div>
              <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12] inline-flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-[#C69224] inline-block animate-pulse" />
                <SproutTypingText
                  as="span"
                  text="Hospitality on National Highway 19"
                  mode="words"
                  stagger={0.035}
                  delay={0.05}
                  showCursor={true}
                  cursorColor="text-[#C69224]"
                />
              </span>
              <div className="overflow-hidden mt-1">
                <SproutTypingText
                  as="h2"
                  text="A Place for Every Occasion"
                  mode="chars"
                  stagger={0.025}
                  delay={0.2}
                  showCursor={true}
                  cursorColor="text-[#C69224]"
                  className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] leading-tight"
                />
                <div className="flex items-center gap-2 overflow-hidden h-1 pt-1 mt-2.5">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.65 }}
                    className="w-12 h-[2px] bg-[#C69224] origin-left block"
                  />
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="w-6 h-[2px] bg-[#E5B94F] origin-left block"
                  />
                </div>
              </div>
            </div>

            <p className="font-dmsans text-[15px] sm:text-base text-[#514B40] leading-[1.7]">
              <SproutTypingText
                as="span"
                text="Situated in the picturesque surroundings of Topchanchi along the historic Grand Trunk Road (NH-19), Shaan-E-Punjab Hotel is designed to meet the diverse needs of road travelers, family vacationers, and celebration hosts across the Dhanbad district."
                mode="words"
                stagger={0.025}
                delay={0.35}
                showCursor={true}
                cursorColor="text-[#C69224]"
              />
            </p>

            <p className="font-dmsans text-[15px] sm:text-base text-[#514B40] leading-[1.7]">
              <SproutTypingText
                as="span"
                text="Whether you need a restful night’s sleep after hours of highway driving, crave the authentic spices of a hot tandoori meal in our multi-cuisine restaurant, or are planning a grand wedding celebration in our expansive banquet ballroom, our dedicated team is at your service 24 hours a day."
                mode="words"
                stagger={0.022}
                delay={0.65}
                showCursor={true}
                cursorColor="text-[#9B6B12]"
              />
            </p>

            {/* Staggered Quick Benefit Cards with Sprout Animation */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2"
            >
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.8, filter: 'blur(3px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.85 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="p-3.5 bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-xl text-center shadow-sm transition-all duration-300 group"
              >
                <SproutTypingText
                  as="span"
                  text="24/7 Service"
                  mode="chars"
                  stagger={0.03}
                  delay={0.9}
                  showCursor={false}
                  className="font-montserrat text-xs font-bold text-[#171512] block group-hover:text-[#9B6B12] transition-colors"
                />
                <SproutTypingText
                  as="span"
                  text="Front Desk & Security"
                  mode="words"
                  stagger={0.04}
                  delay={1.0}
                  showCursor={false}
                  className="font-dmsans text-[11px] text-[#514B40] block mt-0.5"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.8, filter: 'blur(3px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.95 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="p-3.5 bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-xl text-center shadow-sm transition-all duration-300 group"
              >
                <SproutTypingText
                  as="span"
                  text="Pure Dining"
                  mode="chars"
                  stagger={0.03}
                  delay={1.0}
                  showCursor={false}
                  className="font-montserrat text-xs font-bold text-[#171512] block group-hover:text-[#9B6B12] transition-colors"
                />
                <SproutTypingText
                  as="span"
                  text="Veg & Non-Veg Kitchen"
                  mode="words"
                  stagger={0.04}
                  delay={1.1}
                  showCursor={false}
                  className="font-dmsans text-[11px] text-[#514B40] block mt-0.5"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.8, filter: 'blur(3px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 1.05 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="p-3.5 bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-xl text-center col-span-2 sm:col-span-1 shadow-sm transition-all duration-300 group"
              >
                <SproutTypingText
                  as="span"
                  text="Grand Halls"
                  mode="chars"
                  stagger={0.03}
                  delay={1.1}
                  showCursor={false}
                  className="font-montserrat text-xs font-bold text-[#171512] block group-hover:text-[#9B6B12] transition-colors"
                />
                <SproutTypingText
                  as="span"
                  text="Up to 700 Guests"
                  mode="words"
                  stagger={0.04}
                  delay={1.2}
                  showCursor={false}
                  className="font-dmsans text-[11px] text-[#514B40] block mt-0.5"
                />
              </motion.div>
            </motion.div>

            <div className="pt-2">
              <motion.button
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 360, damping: 20, delay: 1.25 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('about')}
                className="font-inter inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer group"
              >
                <SproutTypingText
                  as="span"
                  text="Discover Our Story"
                  mode="chars"
                  stagger={0.025}
                  delay={1.3}
                  showCursor={false}
                />
                <ChevronRight className="w-4 h-4 text-[#C69224] group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/* 4. ROOMS AND ACCOMMODATION (Staggered Cards & 3D Tilt)       */}
      {/* ============================================================ */}
      <motion.section
        id="rooms"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
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
              Rooms & Stay Options
            </MaskedText>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-2 max-w-xl leading-relaxed">
              Impeccably clean, air-conditioned rooms tailored for highway rest, transit convenience, and peaceful family stays.
            </p>
          </div>
          <button
            onClick={() => navigateTo('rooms')}
            className="font-inter inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9B6B12] hover:text-[#171512] transition-colors self-start md:self-auto cursor-pointer group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Interactive Room Slider Carousel */}
        <div className="mt-4">
          <RoomSlider rooms={rooms} />
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/* 5. RESTAURANT AND DINING (Cinematic Dine-In Showcase)        */}
      {/* ============================================================ */}
      <motion.section
        id="restaurant"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#171512]/15 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF9ED] border border-[#C69224]/50 rounded-full text-xs text-[#9B6B12] mb-2 font-semibold">
                <Utensils className="w-3.5 h-3.5 text-[#C69224]" />
                <span className="font-montserrat uppercase tracking-wider text-[11px]">Restaurant & Dine-In Dining Experience</span>
              </div>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-bold text-[#171512] tracking-wide"
              >
                Shaan-E-Punjab Multi-Cuisine Restaurant
              </MaskedText>
              <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-2 max-w-2xl leading-relaxed">
                Experience the authentic taste of the Highway with rich Punjabi gravies, slow-roasted tandoori specialties, and refreshing beverages. Pure on-premises dining & table reservations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => openEnquiryModal('restaurant')}
                className="font-inter px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer"
              >
                Enquire About a Table
              </button>
              <button
                onClick={() => navigateTo('restaurant')}
                className="font-inter px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF9ED] hover:bg-[#F8F0DF] border border-[#171512] rounded-xl transition-colors cursor-pointer"
              >
                Explore Full Menu
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-[#171512] tracking-wide">
                Signature Tandoori & Curries (Dine-In)
              </h3>
              <div className="flex items-center gap-3 text-xs text-[#514B40] font-inter">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 border border-emerald-600 flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <span className="font-medium text-[#171512]">Pure Veg</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 border border-red-600 flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  </span>
                  <span className="font-medium text-[#171512]">Non-Veg</span>
                </span>
              </div>
            </div>

            {/* 3D Orbit Card Carousel for 4 Signature Food Items */}
            <FoodOrbitCarousel
              onEnquire={(dishName) => openEnquiryModal('restaurant', dishName)}
            />
          </div>

          <div className="bg-[#FFF9ED] border border-[#171512] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#514B40]">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#C69224] shrink-0" />
              <span>
                Restaurant Timing: <strong className="text-[#171512]">{settings.restaurantHours}</strong> (Breakfast, Lunch & Dinner)
              </span>
            </div>
            <div className="text-[11px] text-[#514B40] text-center sm:text-right font-medium">
              On-premises dining only • Online food delivery is not offered
            </div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/* 6. FEATURED FOOD & MENU HIGHLIGHTS                           */}
      {/* ============================================================ */}
      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <FeaturedFoodSection
          dishes={menu}
          onEnquireTable={(dishName) => openEnquiryModal('restaurant', dishName)}
          onViewMenu={() => navigateTo('restaurant')}
        />
      </motion.section>

      {/* ============================================================ */}
      {/* 7. INTERACTIVE "OUR ROOMS" EXPANDING PANELS GALLERY          */}
      {/* ============================================================ */}
      <RoomsExpandingGallery
        onEnquire={(roomName) => openEnquiryModal('room')}
      />

      {/* ============================================================ */}
      {/* 8. SPECIAL OFFERS                                            */}
      {/* ============================================================ */}
      <motion.section
        id="offers"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
              Exclusive Packages
            </span>
            <MaskedText
              as="h2"
              delay={0.1}
              showAccentLine={true}
              className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-[#171512] mt-1"
            >
              Special Offers & Packages
            </MaskedText>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-2 max-w-xl leading-relaxed">
              Tailored rates for NH-19 travelers, family celebrations, and wedding bookings.
            </p>
          </div>
          <button
            onClick={() => navigateTo('offers')}
            className="font-inter inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9B6B12] hover:text-[#171512] transition-colors self-start md:self-auto cursor-pointer group"
          >
            <span>View All Offers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {offers.slice(0, 2).map((offer, idx) => (
            <motion.div key={offer.id} variants={itemFadeUp}>
              <Card3D intensity={4}>
                <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl overflow-hidden shadow-xl hover:border-[#C69224] transition-all duration-300 flex flex-col justify-between h-full group">
                  {/* Offer Image Header with Badges & HD indicator */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-[#FFF9ED]">
                    <img
                      src={offer.image || (idx === 0 ? '/assets/aistudio/delux.jpg' : '/assets/aistudio/hall_5d0455b4.jpg')}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFF5E3] via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                      <span className="font-montserrat text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] border border-[#171512] px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                        {offer.category === 'Stay' ? <Bed className="w-3.5 h-3.5" /> : <Utensils className="w-3.5 h-3.5" />}
                        <span>{offer.category} Package</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#171512]/90 backdrop-blur-md text-[#E5B94F] border border-[#C69224]/50 shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#E5B94F]" /> HD
                        </span>
                        {offer.badge && (
                          <span className="font-inter text-[10px] sm:text-[11px] font-bold text-[#171512] bg-[#FFF9ED] backdrop-blur-md px-2.5 py-1 rounded-full border border-[#171512] shadow-sm">
                            {offer.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Floating Price Tag on Image */}
                    {offer.price && (
                      <div className="absolute bottom-3.5 left-3.5 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-inter font-bold text-xs sm:text-sm bg-[#FFF5E3]/95 text-[#171512] border border-[#171512] backdrop-blur-md shadow-lg">
                          <Tag className="w-3.5 h-3.5 text-[#C69224]" />
                          {offer.price}
                        </span>
                      </div>
                    )}

                    {/* Lightbox Trigger on Image Hover */}
                    <button
                      onClick={() => {
                        const galleryItem = {
                          id: offer.id,
                          title: offer.title,
                          category: (offer.category === 'Stay' ? 'rooms' : 'restaurant') as any,
                          caption: `${offer.title} - ${offer.tagline}`,
                          isVerifiedPhoto: true,
                          image: offer.image || (idx === 0 ? '/assets/aistudio/delux.jpg' : '/assets/aistudio/hall_5d0455b4.jpg'),
                          price: offer.price,
                        };
                        openLightbox([galleryItem], 0);
                      }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 backdrop-blur-[2px] cursor-pointer"
                      aria-label="View Offer Photo in Full Size"
                    >
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#171512]/90 text-[#FFF5E3] border border-[#C69224] text-xs font-semibold flex items-center gap-1.5 shadow-xl">
                        <Maximize2 className="w-3.5 h-3.5 text-[#C69224]" /> View Photo
                      </span>
                    </button>
                  </div>

                  {/* Offer Content and All Details */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow space-y-5">
                    <div className="space-y-3.5">
                      <div>
                        <h3 className="font-oswald text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#171512] leading-snug">
                          {offer.title}
                        </h3>
                        {offer.tagline && (
                          <p className="font-playfair text-xs sm:text-sm text-[#9B6B12] italic mt-1 font-medium">
                            "{offer.tagline}"
                          </p>
                        )}
                      </div>

                      <p className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed">
                        {offer.description}
                      </p>

                      {/* Package Highlights Grid */}
                      {offer.highlights && offer.highlights.length > 0 && (
                        <div className="pt-2">
                          <p className="font-inter text-[11px] uppercase tracking-wider font-bold text-[#171512] mb-2">
                            Included in Package:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {offer.highlights.map((highlight, hIdx) => (
                              <div
                                key={hIdx}
                                className="flex items-start gap-2 p-2 rounded-lg bg-[#FFF9ED] border border-[#171512]/30 text-xs text-[#171512]"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-tight font-medium">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Applicable Services & Validity Info */}
                      <div className="p-3 rounded-xl bg-[#FFF9ED] border border-[#171512] text-xs text-[#514B40] space-y-1.5 font-inter">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
                          <span className="font-bold text-[#171512]">Services:</span>
                          <span className="truncate">{offer.eligibleServices}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#9B6B12]">
                          <Clock className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
                          <span className="font-bold">Validity:</span>
                          <span className="font-medium text-[#171512]">{offer.validity}</span>
                        </div>
                      </div>

                      {/* Terms Bullet Points */}
                      {offer.terms && offer.terms.length > 0 && (
                        <div className="pt-1">
                          <p className="font-inter text-[10px] uppercase tracking-wider font-bold text-[#514B40] mb-1.5">
                            Key Guidelines & Conditions:
                          </p>
                          <ul className="space-y-1">
                            {offer.terms.slice(0, 3).map((term, tIdx) => (
                              <li key={tIdx} className="font-dmsans text-[11px] text-[#514B40] flex items-start gap-1.5 leading-snug">
                                <span className="text-[#C69224] font-bold">•</span>
                                <span>{term}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-4 border-t border-[#171512]/15 flex flex-wrap items-center justify-between gap-3 font-inter">
                      <div>
                        {offer.price ? (
                          <div className="leading-none">
                            <span className="text-[10px] text-[#514B40] block uppercase font-bold">Package Rate</span>
                            <span className="text-base sm:text-lg font-bold text-[#171512]">{offer.price}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#514B40] font-medium">Direct booking benefit</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                          className="px-3 py-2 text-xs font-bold text-[#171512] bg-[#FFF9ED] hover:bg-[#F8F0DF] border border-[#171512] rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          title="Call Front Desk for Package"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C69224]" />
                          <span className="hidden sm:inline">Call Desk</span>
                        </a>
                        <button
                          onClick={() => openEnquiryModal(offer.category === 'Stay' ? 'room' : 'restaurant', offer.title)}
                          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Enquire Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ============================================================ */}
      {/* 8. BANQUETS & CELEBRATIONS                                   */}
      {/* ============================================================ */}
      <motion.section
        id="banquets"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-5">
            <div>
              <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
                Event Spaces in Topchanchi
              </span>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] mt-1 leading-tight"
              >
                Banquets & Celebrations
              </MaskedText>
            </div>

            <p className="font-dmsans text-[15px] sm:text-base text-[#514B40] leading-[1.7]">
              From grand Indian wedding ceremonies and reception parties to corporate seminars, ring ceremonies, and milestone birthdays, Shaan-E-Punjab Hotel offers premium event venues designed for seamless hospitality.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-3"
            >
              {BANQUET_VENUES.map((venue) => (
                <motion.div
                  key={venue.id}
                  variants={itemFadeUp}
                  className="p-4 bg-[#FFF5E3] border border-[#171512] rounded-xl space-y-1 shadow-sm hover:border-[#C69224] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">{venue.name}</h3>
                    <span className="font-inter text-[11px] text-[#9B6B12] font-bold">
                      {venue.capacityText}
                    </span>
                  </div>
                  <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">{venue.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => openEnquiryModal('banquet')}
                className="font-inter px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer"
              >
                Enquire About Your Event
              </button>
              <button
                onClick={() => navigateTo('banquets')}
                className="font-inter px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl transition-colors cursor-pointer"
              >
                View Hall Gallery
              </button>
            </div>
          </div>

          <Card3D intensity={5}>
            <VisualAsset
              type="hotel_banquet_hall"
              aspect="4:3"
              className="w-full shadow-xl border border-[#171512] rounded-2xl"
              title="The Grand Shaan Ballroom"
              subtitle="Pillar-less air-conditioned wedding hall and stage setup"
            />
          </Card3D>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/* 9. WHY CHOOSE US (Staggered Feature Grid)                    */}
      {/* ============================================================ */}
      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
            Our Distinction
          </span>
          <MaskedText
            as="h2"
            delay={0.1}
            showAccentLine={true}
            className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] justify-center leading-tight"
          >
            Why Guests Choose Us
          </MaskedText>
          <p className="font-dmsans text-xs sm:text-sm text-[#514B40]">
            Thoughtfully built for highway ease, memorable dining, and warm celebrations.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={itemFadeUp}>
            <Card3D intensity={4}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Prime NH-19 GT Road Location</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Direct highway access at Topchanchi, Dhanbad. No narrow alley detours; convenient entry and exit for cars and buses.
                </p>
              </div>
            </Card3D>
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <Card3D intensity={4}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Ample Secured Parking</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Spacious private forecourt with round-the-clock security and CCTV monitoring, accommodating personal cars, wedding convoys, and tour coaches.
                </p>
              </div>
            </Card3D>
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <Card3D intensity={4}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Authentic Multi-Cuisine Dining</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Authentic North Indian tandoor, handi gravies, and biryanis prepared with pure ingredients by experienced regional chefs.
                </p>
              </div>
            </Card3D>
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <Card3D intensity={4}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">24-Hour Front Desk Assistance</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Arriving late at night or departing early morning? Our reception desk operates 24/7 to welcome you and assist your transit.
                </p>
              </div>
            </Card3D>
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <Card3D intensity={4}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Versatile Banquet Venues</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Air-conditioned pillar-less hall and open-air lawns accommodating up to 700 guests with stage, sound, and dining infrastructure.
                </p>
              </div>
            </Card3D>
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <Card3D intensity={4}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-3 h-full hover:border-[#C69224] transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#FFF9ED] border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-montserrat text-sm sm:text-base font-bold text-[#171512]">Dedicated Guest Hospitality</h3>
                <p className="font-dmsans text-xs text-[#514B40] leading-relaxed">
                  Warm, respectful service with transparent pricing, clean rooms, and prompt attention to your personalized stay requirements.
                </p>
              </div>
            </Card3D>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ============================================================ */}
      {/* 10. PHOTO GALLERY                                            */}
      {/* ============================================================ */}
      <motion.section
        id="gallery"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
              Visual Tour
            </span>
            <MaskedText
              as="h2"
              delay={0.1}
              showAccentLine={true}
              className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] mt-1 leading-tight"
            >
              Photo Gallery
            </MaskedText>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-2">
              Click any photo to open in high-resolution lightbox view.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#FFF5E3] rounded-lg border border-[#171512] overflow-x-auto max-w-full font-inter">
            {['all', 'exterior', 'rooms', 'restaurant', 'food', 'banquet'].map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-colors whitespace-nowrap cursor-pointer ${
                  galleryFilter === cat
                    ? 'bg-[#C69224] text-[#171512] border border-[#171512] shadow-xs'
                    : 'text-[#514B40] hover:text-[#171512]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {filteredGallery.map((item, idx) => (
            <motion.div key={item.id} variants={itemFadeUp}>
              <Card3D intensity={4} onClick={() => openLightbox(filteredGallery, idx)}>
                <div className="bg-[#FFF5E3] border border-[#171512] rounded-xl overflow-hidden hover:border-[#C69224] transition-all cursor-pointer group relative shadow-sm">
                  <div className="relative">
                    <VisualAsset
                      type={item.category}
                      src={item.image}
                      aspect="4:3"
                      className="w-full group-hover:scale-103 transition-transform duration-500"
                      title={item.title}
                    />
                    {item.isHD && (
                      <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#171512]/90 backdrop-blur-md text-[#E5B94F] border border-[#C69224]/50 shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#E5B94F]" /> HD
                      </span>
                    )}
                    {item.price && (
                      <span className="absolute top-2 right-2 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C69224] text-[#171512] border border-[#171512] shadow-md">
                        {item.price}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 bg-[#FFF5E3] border-t border-[#171512]/20">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-montserrat text-xs font-bold text-[#171512] truncate">{item.title}</p>
                      {item.price && (
                        <span className="text-[11px] font-bold text-[#171512] whitespace-nowrap hidden sm:inline">
                          {item.price}
                        </span>
                      )}
                    </div>
                    {item.distance ? (
                      <p className="font-dmsans text-[10px] text-[#9B6B12] font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" /> {item.distance}
                      </p>
                    ) : (
                      <p className="font-dmsans text-[10px] text-[#514B40] truncate mt-0.5">
                        {item.caption.slice(0, 50)}...
                      </p>
                    )}
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigateTo('gallery')}
            className="font-inter inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl transition-colors cursor-pointer group shadow-sm"
          >
            <span>Explore Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C69224] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/* 11. LOCATION AND NEARBY ATTRACTIONS                          */}
      {/* ============================================================ */}
      <motion.section
        id="location"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
                Strategic GT Road Access
              </span>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] leading-tight"
              >
                Location & Nearby Attractions
              </MaskedText>
              <p className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed">
                Shaan-E-Punjab Hotel is located directly on National Highway 19 in Topchanchi, Dhanbad, offering seamless transit between major cities and proximity to iconic Jharkhand attractions.
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-2.5 pt-2 text-xs"
              >
                {NEARBY_ATTRACTIONS.map((attraction, i) => (
                  <motion.div
                    key={i}
                    variants={itemFadeUp}
                    className="p-3 bg-[#FFF9ED] border border-[#171512] rounded-lg hover:border-[#C69224] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat font-bold text-[#171512] flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-[#C69224]" />
                        {attraction.name}
                      </span>
                      <span className="font-inter text-[11px] text-[#9B6B12] font-bold">{attraction.distance}</span>
                    </div>
                    {attraction.location && (
                      <p className="font-montserrat text-[10px] text-[#514B40] mt-0.5 pl-5.5 flex items-center gap-1 font-medium">
                        <MapPin className="w-2.5 h-2.5 text-[#C69224]" /> {attraction.location}
                      </p>
                    )}
                    <p className="font-dmsans text-[11px] text-[#514B40] mt-1 pl-5.5 leading-relaxed">{attraction.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigateTo('location')}
                  className="font-inter px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  View Driving Directions
                </button>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="font-inter px-4 py-2.5 text-xs font-bold text-[#171512] bg-[#FFF9ED] hover:bg-[#F8F0DF] border border-[#171512] rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C69224]" />
                  <span>Call for Assistance</span>
                </a>
              </div>
            </div>

            {/* HD Lake Photo & Location/Distance Showcase Card */}
            <Card3D intensity={4}>
              <div className="relative rounded-2xl overflow-hidden border border-[#171512] hover:border-[#C69224] transition-all duration-300 shadow-xl group bg-[#FFF9ED]">
                {/* HD Lake Image */}
                <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src="/assets/aistudio/lake.jpg"
                    alt="Topchanchi Lake & Wildlife Sanctuary, Parasnath Hills"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Vignette & Bottom gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#171512]/90 backdrop-blur-md text-[#E5B94F] border border-[#C69224]/50 shadow-lg">
                      <Sparkles className="w-3 h-3 text-[#E5B94F]" />
                      HD Topchanchi Lake
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#C69224] text-[#171512] border border-[#171512] shadow-lg">
                      <Navigation className="w-3 h-3" />
                      3.5 km from Hotel
                    </span>
                  </div>

                  {/* Play/View Full HD prompt */}
                  <button
                    onClick={() => {
                      const lakeItem = GALLERY_ITEMS.find((g) => g.id === 'gal-12') || {
                        id: 'lake-feature',
                        title: 'Topchanchi Lake & Parasnath Foot (HD)',
                        category: 'surroundings' as const,
                        caption: 'Topchanchi Lake scenic reservoir at Parasnath foothills, 3.5 km from Shaan-E-Punjab Hotel.',
                        isVerifiedPhoto: true,
                        image: '/assets/aistudio/lake.jpg',
                      };
                      openLightbox([lakeItem], 0);
                    }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 backdrop-blur-[2px] cursor-pointer"
                    aria-label="View Lake Photo in HD Lightbox"
                  >
                    <span className="px-4 py-2 rounded-xl bg-[#171512]/90 text-[#FFF5E3] border border-[#C69224] text-xs font-bold flex items-center gap-2 shadow-2xl">
                      <Maximize2 className="w-3.5 h-3.5 text-[#C69224]" /> View HD Lightbox
                    </span>
                  </button>
                </div>

                {/* Lake Information Card Details */}
                <div className="p-4 sm:p-5 bg-[#FFF5E3] space-y-3 border-t border-[#171512]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#171512] flex items-center gap-2">
                        Topchanchi Lake & Reservoir
                      </h3>
                      <p className="font-montserrat text-xs text-[#9B6B12] font-semibold flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
                        GT Road (NH-19), Parasnath Foothills, Topchanchi, Dhanbad
                      </p>
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#FFF9ED] border border-[#C69224] text-[#9B6B12] font-inter font-bold text-xs">
                        ~8 mins drive
                      </span>
                    </div>
                  </div>

                  {/* Distance & Location Details */}
                  <div className="grid grid-cols-2 gap-2 pt-1 font-inter text-xs">
                    <div className="p-2.5 rounded-lg bg-[#FFF9ED] border border-[#171512]">
                      <span className="text-[#514B40] text-[10px] uppercase font-bold block">Distance from Hotel</span>
                      <span className="text-[#171512] font-bold text-xs sm:text-sm mt-0.5 block">
                        3.5 km (GT Road NH-19)
                      </span>
                      <span className="text-[10px] text-[#514B40] block font-medium">Wildlife Sanctuary: 1.5 km</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FFF9ED] border border-[#171512]">
                      <span className="text-[#514B40] text-[10px] uppercase font-bold block">Hotel Highway Frontage</span>
                      <span className="text-emerald-700 font-bold text-xs sm:text-sm mt-0.5 block">
                        Direct NH-19 Access
                      </span>
                      <span className="text-[10px] text-[#514B40] block font-medium">Dhanbad: 32 km • Parasnath: 28 km</span>
                    </div>
                  </div>

                  <p className="font-dmsans text-xs text-[#514B40] leading-relaxed pt-1">
                    Scenic British-era freshwater reservoir nestled under Parasnath Hills. Guests at Shaan-E-Punjab Hotel enjoy an easy 8-minute highway drive for morning lakeside walks, boating, and scenic sunset views.
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <a
                      href="https://maps.google.com/?q=Topchanchi+Lake+Dhanbad+Jharkhand"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#171512] bg-[#FFF9ED] hover:bg-[#F8F0DF] border border-[#171512] rounded-lg transition-colors cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#C69224]" />
                      <span>Google Maps Route</span>
                    </a>
                    <button
                      onClick={() => navigateTo('location')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      <span>Nearby Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/* 12. GUEST TESTIMONIALS CAROUSEL                              */}
      {/* ============================================================ */}
      <GuestTestimonials onEnquire={() => openEnquiryModal('room')} />

      {/* ============================================================ */}
      {/* 13. FINAL ENQUIRY CTA                                        */}
      {/* ============================================================ */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="relative overflow-hidden bg-[#171512] rounded-3xl p-8 sm:p-12 text-center text-[#FFF5E3] shadow-2xl border-2 border-[#C69224]">
          {/* Subtle decorative background light accent */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#C69224]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#E5B94F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#E5B94F]">
              Plan Your Visit to Topchanchi
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF5E3] leading-tight">
              Make Your Next Visit Memorable
            </h2>
            <p className="font-dmsans text-xs sm:text-sm text-[#FFF5E3]/85 leading-relaxed max-w-xl mx-auto">
              Plan your stay, discover our dining experience or discuss your next celebration with our team at Shaan-E-Punjab Hotel.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 font-inter">
              <button
                onClick={() => openEnquiryModal('room')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                Enquire About Rooms
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#FFF5E3] bg-[#24201A] hover:bg-[#2F2A22] border border-[#C69224]/60 rounded-xl transition-all cursor-pointer"
              >
                Contact Us
              </button>
              <button
                onClick={() => openEnquiryModal('banquet')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#E5B94F] hover:bg-[#F3CE74] border border-[#171512] rounded-xl transition-all cursor-pointer"
              >
                Plan Your Event
              </button>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
};
