import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  Users,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Play,
  Pause,
} from 'lucide-react';

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  category: 'Stay' | 'Dining' | 'Banquets';
  experience: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  avatarBg?: string;
  verifiedStay: boolean;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'rev-1',
    name: 'S. K. Mukherjee',
    location: 'Kolkata, West Bengal',
    category: 'Stay',
    experience: 'Overnight Highway Transit • Deluxe King Room',
    rating: 5,
    date: 'October 2026',
    title: 'The best midnight highway stopover on NH-19',
    comment:
      'We were driving late at night from Kolkata to Varanasi. Finding Shaan-E-Punjab right on NH-19 with secured forecourt parking and hot, delicious butter chicken with tandoori roti was a huge relief. The Deluxe King room was spotless, peaceful, and the split AC worked flawlessly. Clean washroom with instant hot water.',
    avatarBg: 'from-amber-600 to-yellow-600',
    verifiedStay: true,
  },
  {
    id: 'rev-2',
    name: 'V. P. Singh & Family',
    location: 'Dhanbad, Jharkhand',
    category: 'Banquets',
    experience: "Daughter's Ring Ceremony • The Grand Shaan Ballroom",
    rating: 5,
    date: 'September 2026',
    title: 'Flawless wedding reception and top-notch banquet catering',
    comment:
      'Hosted our daughter’s ring ceremony in The Grand Shaan Ballroom for 350 guests. The chandelier lighting, stage setup, and acoustic audio console were outstanding. Every single guest praised the live tandoor counter and Mughlai feast. The event staff took care of every small detail with genuine Punjabi warmth.',
    avatarBg: 'from-red-600 to-amber-600',
    verifiedStay: true,
  },
  {
    id: 'rev-3',
    name: 'Ananya & Rakesh Tiwari',
    location: 'Ranchi, Jharkhand',
    category: 'Dining',
    experience: 'Family Weekend Lunch • Main Dining Hall',
    rating: 5,
    date: 'October 2026',
    title: 'Authentic Punjabi flavors near Topchanchi Lake',
    comment:
      'Visited Topchanchi Lake for a weekend family picnic and stopped here for lunch on recommendation. The Dal Makhani Bukhara and Dahi Ke Sholay were top class, served with huge earthen glasses of chilled Patiala Lassi. Very clean restaurant, polite service, and child-friendly atmosphere.',
    avatarBg: 'from-emerald-600 to-teal-600',
    verifiedStay: true,
  },
  {
    id: 'rev-4',
    name: 'Harpreet Singh Bhatia',
    location: 'New Delhi',
    category: 'Stay',
    experience: 'Delhi to Asansol Road Trip • Executive Suite',
    rating: 5,
    date: 'October 2026',
    title: 'True Punjabi hospitality on the historic Grand Trunk Road',
    comment:
      'As a frequent traveler on the Delhi-Kolkata corridor, Shaan-E-Punjab in Topchanchi stands out among highway hotels. Spacious Executive Suite with comfortable orthopaedic bedding, courteous staff, and the authentic Dhaba-style Punjabi feast made my long journey feel like a holiday.',
    avatarBg: 'from-blue-600 to-indigo-600',
    verifiedStay: true,
  },
  {
    id: 'rev-5',
    name: 'Dr. Priya Sengupta',
    location: 'Bokaro Steel City',
    category: 'Dining',
    experience: "Doctors' Anniversary Dinner • Family Dining",
    rating: 5,
    date: 'September 2026',
    title: 'Delicious food, hygienic kitchen & attentive hospitality',
    comment:
      'Drove from Bokaro for a special family anniversary dinner. The Tandoori Chicken was roasted to juicy perfection in the clay oven, and the Amritsari Chur Chur Kulcha was unforgettable. The staff is respectful, courteous, and prompt. Highly recommended for family gatherings.',
    avatarBg: 'from-purple-600 to-pink-600',
    verifiedStay: true,
  },
  {
    id: 'rev-6',
    name: 'Amitabh & Shreya Sen',
    location: 'Asansol, West Bengal',
    category: 'Stay',
    experience: 'Weekend Getaway • Classic Comfort Room',
    rating: 5,
    date: 'August 2026',
    title: 'Peaceful stay with scenic Topchanchi Lake proximity',
    comment:
      'Booked a quick 2-day monsoon getaway to explore Topchanchi Lake and Parasnath foothills. The hotel location right on NH-19 made commuting seamless. Rooms were quiet, squeaky clean, and the morning breakfast with fresh ginger tea gave a great start to our day.',
    avatarBg: 'from-cyan-600 to-blue-600',
    verifiedStay: true,
  },
];

interface GuestTestimonialsProps {
  onEnquire?: () => void;
}

export const GuestTestimonials: React.FC<GuestTestimonialsProps> = ({ onEnquire }) => {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Filter reviews by selected category
  const filteredReviews =
    activeCategory === 'All'
      ? TESTIMONIALS_DATA
      : TESTIMONIALS_DATA.filter((r) => r.category === activeCategory);

  // Keep index within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [activeCategory]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    setProgress(0);
  }, [filteredReviews.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
    setProgress(0);
  }, [filteredReviews.length]);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Autoplay timer with progress bar
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const intervalTime = 50; // Update progress every 50ms
    const totalDuration = 5500; // 5.5s per slide
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  const currentReview = filteredReviews[currentIndex] || filteredReviews[0];

  // Slide transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  return (
    <section
      id="testimonials"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-[#9B6B12] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C69224]" />
            Verified Customer Reviews
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171512] mt-1 leading-tight">
            Guest Testimonials & Experiences
          </h2>
          <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-1 max-w-xl">
            Real stories from highway travelers, weekend diners, and wedding families on GT Road NH-19.
          </p>
        </div>

        {/* Aggregate Rating Summary Badge */}
        <div className="flex items-center gap-3 p-3 bg-[#FFF5E3] border border-[#171512] rounded-2xl shadow-sm self-start md:self-auto">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#C69224]/20 border border-[#C69224] text-[#9B6B12] font-bold text-lg">
            4.9
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#C69224]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C69224]" />
              ))}
            </div>
            <p className="font-montserrat text-[11px] font-bold text-[#171512] mt-0.5">
              450+ Verified Reviews
            </p>
            <p className="font-inter text-[10px] text-[#9B6B12] flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-2.5 h-2.5 text-[#C69224]" /> 100% Genuine Stays
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF5E3] rounded-xl border border-[#171512] overflow-x-auto max-w-full">
          {['All', 'Stay', 'Dining', 'Banquets'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#C69224] text-[#171512] font-bold border border-[#171512] shadow-xs'
                  : 'text-[#514B40] hover:text-[#171512] hover:bg-[#FFF9ED]'
              }`}
            >
              {cat === 'All' ? 'All Reviews' : `${cat} Experiences`}
            </button>
          ))}
        </div>

        {/* Carousel Prev/Next Buttons & Autoplay Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-2 text-[#514B40] hover:text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1"
            title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-[#C69224]" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={prevSlide}
            className="p-2 text-[#171512] hover:bg-[#C69224] bg-[#FFF5E3] border border-[#171512] rounded-xl transition-all shadow-xs cursor-pointer group active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <span className="font-mono text-xs text-[#514B40] px-1 font-semibold">
            {currentIndex + 1} / {filteredReviews.length}
          </span>
          <button
            onClick={nextSlide}
            className="p-2 text-[#171512] hover:bg-[#C69224] bg-[#FFF5E3] border border-[#171512] rounded-xl transition-all shadow-xs cursor-pointer group active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Carousel Card Container */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FFF5E3] border border-[#171512] shadow-lg p-6 sm:p-10">
        {/* Subtle Background Glow & Large Quote Icon */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5B94F]/10 rounded-full blur-3xl pointer-events-none" />
        <Quote className="absolute top-6 right-8 w-20 h-20 text-[#171512]/10 pointer-events-none" />

        {/* Animated Autoplay Progress Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[#171512]/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C69224] to-[#E5B94F] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Carousel Slide Animation */}
        <div className="min-h-[260px] sm:min-h-[220px] flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentReview.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              {/* Rating Stars & Experience Tag */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 text-[#C69224]">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C69224] drop-shadow-xs" />
                    ))}
                  </div>
                  <span className="font-montserrat text-xs font-bold text-[#9B6B12] ml-1">
                    5.0 / 5.0
                  </span>
                  <span className="text-[11px] text-[#514B40] hidden sm:inline">•</span>
                  <span className="font-inter text-[11px] text-[#171512] font-semibold hidden sm:inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C69224]" /> Verified Guest Review
                  </span>
                </div>

                <span className="font-inter text-xs text-[#171512] font-semibold bg-[#FFF9ED] border border-[#171512] px-3 py-1 rounded-full shadow-xs">
                  {currentReview.experience}
                </span>
              </div>

              {/* Review Headline */}
              <h3 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold text-[#171512] leading-snug">
                "{currentReview.title}"
              </h3>

              {/* Review Comment Quote */}
              <p className="font-lora italic text-sm sm:text-base text-[#514B40] leading-[1.8] max-w-4xl">
                "{currentReview.comment}"
              </p>

              {/* Guest Profile & Footer Details */}
              <div className="pt-4 border-t border-[#171512]/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {/* Avatar Initials with Gold Accent */}
                  <div className="w-11 h-11 rounded-full bg-[#171512] p-0.5 shadow-xs flex items-center justify-center border border-[#C69224]">
                    <div className="w-full h-full rounded-full bg-[#171512] flex items-center justify-center text-[#E5B94F] font-montserrat font-bold text-sm">
                      {currentReview.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-montserrat text-sm font-bold text-[#171512] flex items-center gap-1.5">
                      {currentReview.name}
                      {currentReview.verifiedStay && (
                        <span title="Verified stay">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C69224]" />
                        </span>
                      )}
                    </h4>
                    <p className="font-dmsans text-xs text-[#514B40] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C69224]" />
                        {currentReview.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#514B40]" />
                        {currentReview.date}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-inter text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-[#FFF9ED] text-[#171512] border border-[#171512] font-medium">
                    {currentReview.category}
                  </span>
                  <button
                    onClick={onEnquire}
                    className="px-3.5 py-1.5 rounded-lg bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] transition-colors font-bold cursor-pointer shadow-xs"
                  >
                    Book Similar Stay
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-[#171512]/15">
          {filteredReviews.map((rev, idx) => (
            <button
              key={rev.id}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 bg-[#C69224] border border-[#171512]'
                  : 'w-2 bg-[#514B40]/30 hover:bg-[#514B40]'
              }`}
              aria-label={`Go to review by ${rev.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
