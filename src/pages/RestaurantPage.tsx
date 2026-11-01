import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset } from '../components/VisualAsset';
import { FoodCard } from '../components/FoodCard';
import { FeaturedFoodSection } from '../components/FeaturedFoodSection';
import { Card3D } from '../components/Card3D';
import { MaskedText } from '../components/MaskedText';
import {
  Utensils,
  Clock,
  Phone,
  Search,
  Sparkles,
  Calendar,
  Info,
  CheckCircle2,
  FileText,
  MapPin,
  Flame,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/hotelData';

export const RestaurantPage: React.FC = () => {
  const { menu, openEnquiryModal, settings, openLightbox, addEnquiry, isBackNav } = useHotel();
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

  // Filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Table Enquiry Form state
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [diningDate, setDiningDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Dinner (07:00 PM – 11:00 PM)');
  const [guestCount, setGuestCount] = useState(4);
  const [dietaryPref, setDietaryPref] = useState('Mixed (Veg & Non-Veg)');
  const [specialRequests, setSpecialRequests] = useState('');
  const [tableStatus, setTableStatus] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  const categories = [
    'All',
    'Tandoori Starters',
    'Punjabi Curries',
    'Biryani & Rice',
    'Breads & Accompaniments',
    'Desserts & Beverages',
  ];

  const filteredDishes = menu.filter((dish) => {
    const matchesCategory =
      selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesDiet =
      dietFilter === 'all'
        ? true
        : dietFilter === 'veg'
        ? dish.isVeg
        : !dish.isVeg;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDiet && matchesSearch;
  });

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTableError(null);

    if (!guestName.trim() || guestName.trim().length < 3) {
      setTableError('Please enter your full name (minimum 3 characters)');
      return;
    }
    const cleanPhone = guestPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setTableError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!diningDate) {
      setTableError('Please choose your expected dining date');
      return;
    }

    const result = addEnquiry({
      type: 'restaurant',
      name: guestName.trim(),
      phone: guestPhone.trim(),
      date: diningDate,
      guests: Number(guestCount) || 2,
      message: `Table enquiry for ${timeSlot}. Dietary preference: ${dietaryPref}. Requests: ${specialRequests || 'None'}`,
    });

    if (result.success) {
      setTableStatus(result.enquiryId);
      setGuestName('');
      setGuestPhone('');
      setDiningDate('');
      setSpecialRequests('');
    }
  };

  // Filter gallery items for restaurant & food
  const restaurantGalleryItems = GALLERY_ITEMS.filter(
    (item) => item.category === 'restaurant' || item.category === 'food'
  );

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 pb-16 overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. RESTAURANT HERO WITH HIGH-QUALITY DINING IMAGE             */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative w-full h-[58vh] min-h-[460px] max-h-[620px] overflow-hidden flex items-end border-b border-[#171512]"
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
            alt="Shaan-E-Punjab Multi-Cuisine Family Dining Hall, Topchanchi"
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
            decoding="async"
          />
          {/* Subtle balanced gradient for clear visibility of the hall interior while guaranteeing text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/75 to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#171512]/60 pointer-events-none" />

          {/* Warm gold culinary lighting glow */}
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#C69224]/20 rounded-full blur-3xl pointer-events-none" />
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
              <Utensils className="w-3.5 h-3.5 text-[#C69224]" />
              <span className="font-montserrat font-bold text-[#171512]">Multi-Cuisine Family Dining</span>
              <span className="text-[#514B40]">·</span>
              <span className="font-inter text-[#514B40]">Topchanchi, Dhanbad (NH-19)</span>
            </motion.div>

            {/* 2. Heading: "Discover Our Dining Experience" */}
            <MaskedText
              as="h1"
              delay={0.2}
              showAccentLine={true}
              skipAnimation={isBackNav}
              className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FFF5E3] tracking-wide leading-[1.08]"
            >
              Discover Our Dining Experience
            </MaskedText>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="font-dmsans text-[15px] sm:text-base md:text-lg text-[#F8F0DF]/90 max-w-2xl leading-[1.7] text-balance"
            >
              Immerse yourself in authentic Punjabi tandoori delicacies, fragrant clay handi biryanis, and rich butter gravies served hot in our welcoming family dining halls along National Highway 19.
            </motion.p>

            {/* Hero Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3 pt-2 font-inter"
            >
              <a
                href="#menu-section"
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-white border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer"
              >
                View Menu
              </a>
              <a
                href="#table-enquiry"
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer"
              >
                Enquire About a Table
              </a>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="px-5 py-3 text-xs md:text-sm font-semibold text-[#FFF5E3] hover:text-[#C69224] bg-[#171512]/80 hover:bg-[#171512] border border-[#C69224]/50 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#E5B94F]" />
                <span>Contact Restaurant</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 3. RESTAURANT INTRODUCTION & DINE-IN NOTICE                  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
                Culinary Heritage
              </span>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512] mt-1"
              >
                Fresh from the Tandoor to Your Table
              </MaskedText>
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              At Shaan-E-Punjab Hotel, dining is an occasion of warmth and abundance. Inspired by the interactive culinary discovery and generous marinades celebrated across North India, our kitchen team crafts every dish with stone-ground regional spices, fresh farm herbs, and pure dairy ghee.
            </p>

            <p className="text-sm text-[#514B40] leading-relaxed">
              We operate dedicated preparation sections for vegetarian and non-vegetarian menus to respect every family's dietary values. Our clay tandoor roasts stay on glowing charcoal coals throughout the day to ensure succulent appetizers and fluffy tandoori rotis are served piping hot.
            </p>

            {/* Crucial On-Premises Notice (Strictly No Delivery) */}
            <div className="p-4 bg-[#FFF5E3] border border-[#171512] rounded-2xl text-xs text-[#171512] flex items-start gap-3 shadow-sm">
              <Info className="w-5 h-5 text-[#C69224] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#171512] text-xs">On-Premises Dining Focus</p>
                <p className="text-[#514B40] text-[11px] leading-relaxed">
                  To preserve peak freshness and deliver uninterrupted personal service to diners in Topchanchi, we operate purely as a dine-in and table-reservation restaurant. <strong>Online food delivery, delivery tracking, and online checkout are not provided.</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card3D intensity={4}>
              <div className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224]">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#171512]">Live Clay Tandoor Kitchen</h3>
                    <p className="text-[11px] text-[#514B40]">Charcoal ember cooking at 350°C</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-[#514B40] pt-2 border-t border-[#171512]/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C69224] shrink-0" />
                    <span>Dedicated Vegetarian & Non-Vegetarian preparation stations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C69224] shrink-0" />
                    <span>Overnight spiced marinades with natural hung curd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C69224] shrink-0" />
                    <span>Spacious air-conditioned dining hall with family booths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C69224] shrink-0" />
                    <span>Direct parking forecourt access on GT Road NH-19</span>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FOOD CATEGORIES, SEARCH & DIET FILTERS                    */}
      {/* ============================================================ */}
      <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#514B40] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search dishes (e.g. Biryani, Butter Chicken, Paneer)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
              />
            </div>

            {/* Dietary Filter Buttons */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-[#514B40] font-semibold">Dietary:</span>
              <div className="flex items-center gap-1 p-1 bg-[#FFF9ED] rounded-xl border border-[#171512] text-xs">
                <button
                  onClick={() => setDietFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    dietFilter === 'all'
                      ? 'bg-[#C69224] text-[#171512] font-bold border border-[#171512]'
                      : 'text-[#514B40] hover:text-[#171512]'
                  }`}
                >
                  All Dishes
                </button>
                <button
                  onClick={() => setDietFilter('veg')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    dietFilter === 'veg'
                      ? 'bg-[#171512] text-[#E5B94F] font-bold border border-[#171512]'
                      : 'text-[#514B40] hover:text-[#171512]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Pure Veg</span>
                </button>
                <button
                  onClick={() => setDietFilter('non-veg')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    dietFilter === 'non-veg'
                      ? 'bg-[#171512] text-[#E5B94F] font-bold border border-[#171512]'
                      : 'text-[#514B40] hover:text-[#171512]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>Non-Veg</span>
                </button>
              </div>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-[#171512]/15 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#C69224] text-[#171512] border-[#171512] shadow-sm'
                    : 'bg-[#FFF9ED] text-[#514B40] hover:text-[#171512] hover:bg-[#FFF5E3] border-[#171512]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FEATURED DISH SECTION (Chef's Spotlight with Depth)       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedFoodSection
          dishes={menu}
          onEnquireTable={(dishName) => openEnquiryModal('restaurant', dishName)}
          onViewMenu={() => {
            const el = document.getElementById('menu-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* ============================================================ */}
      {/* 6. MENU INFORMATION & FOOD CARDS GRID                        */}
      {/* ============================================================ */}
      <section id="menu-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-[#171512]/20 pb-3">
          <div>
            <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-bold text-[#171512] tracking-wide">Full Dining Menu</h2>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40] mt-1">
              Showing {filteredDishes.length} freshly prepared dishes • Sample menu data & estimated tariffs for on-premises dining
            </p>
          </div>
          <span className="font-inter text-xs text-[#514B40] font-medium italic">Dine-in only • No online delivery</span>
        </div>

        {filteredDishes.length === 0 ? (
          <div className="p-12 text-center bg-[#FFF5E3] border border-[#171512] rounded-3xl space-y-3">
            <Utensils className="w-10 h-10 text-[#514B40] mx-auto" />
            <h3 className="text-lg font-bold text-[#171512]">No dishes found matching your selection</h3>
            <p className="text-xs text-[#514B40]">
              Try adjusting your search keyword or switching dietary filter buttons.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setDietFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 text-xs font-bold text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish, i) => (
              <FoodCard
                key={dish.id}
                dish={dish}
                index={i}
                onEnquire={(dishName) => openEnquiryModal('restaurant', dishName)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 7. RESTAURANT GALLERY                                        */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
            Visual Ambiance
          </span>
          <MaskedText
            as="h2"
            delay={0.1}
            showAccentLine={true}
            className="font-cormorant text-2xl sm:text-3xl font-bold text-[#171512] justify-center"
          >
            Restaurant Atmosphere & Cuisine
          </MaskedText>
          <p className="text-xs sm:text-sm text-[#514B40]">
            A glimpse into our spacious dining halls, tandoori station, and family seating.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {restaurantGalleryItems.slice(0, 4).map((item, idx) => (
            <Card3D
              key={item.id}
              intensity={4}
              onClick={() => openLightbox(restaurantGalleryItems, idx)}
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
      {/* 8. VERIFIED OPENING HOURS                                    */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#171512]/20">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
                Verified Service Timings
              </span>
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#171512] mt-1">
                Restaurant Opening Hours
              </h2>
              <p className="text-xs sm:text-sm text-[#514B40] mt-1">
                Serving breakfast, lunch, afternoon snacks, and late highway dinners 7 days a week.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#FFF9ED] px-4 py-2 rounded-xl border border-[#171512] text-xs text-[#171512]">
              <Clock className="w-4 h-4 text-[#C69224]" />
              <span>Full Hours: <strong className="text-[#171512] font-bold">{settings.restaurantHours}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="p-4 bg-[#FFF9ED] border border-[#171512] rounded-2xl space-y-1 text-center shadow-xs">
              <span className="text-xs uppercase font-bold text-[#9B6B12] tracking-wider">Morning</span>
              <h3 className="text-sm font-bold text-[#171512]">Breakfast Service</h3>
              <p className="text-base font-extrabold text-[#C69224] mt-1">07:30 AM – 10:30 AM</p>
              <p className="text-[11px] text-[#514B40]">Parathas, hot tea, poha & morning tiffin</p>
            </div>

            <div className="p-4 bg-[#FFF9ED] border border-[#171512] rounded-2xl space-y-1 text-center shadow-xs">
              <span className="text-xs uppercase font-bold text-[#9B6B12] tracking-wider">Afternoon</span>
              <h3 className="text-sm font-bold text-[#171512]">Lunch & Thali Hours</h3>
              <p className="text-base font-extrabold text-[#C69224] mt-1">12:00 PM – 04:00 PM</p>
              <p className="text-[11px] text-[#514B40]">Full North Indian gravies, curries & rice</p>
            </div>

            <div className="p-4 bg-[#FFF9ED] border border-[#171512] rounded-2xl space-y-1 text-center shadow-xs">
              <span className="text-xs uppercase font-bold text-[#9B6B12] tracking-wider">Night</span>
              <h3 className="text-sm font-bold text-[#171512]">Dinner & Tandoor Service</h3>
              <p className="text-base font-extrabold text-[#C69224] mt-1">07:00 PM – 11:00 PM</p>
              <p className="text-[11px] text-[#514B40]">Live charcoal tandoori roasts & handi biryani</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. TABLE ENQUIRY FORM                                        */}
      {/* ============================================================ */}
      <section id="table-enquiry" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
                Table Reservation Desk
              </span>
              <MaskedText
                as="h2"
                delay={0.1}
                showAccentLine={true}
                className="font-cormorant text-2xl sm:text-3xl font-bold text-[#171512]"
              >
                Reserve Your Dining Table
              </MaskedText>

              <p className="text-xs sm:text-sm text-[#514B40] leading-relaxed">
                Whether stopping by for highway transit refreshment or hosting a family birthday dinner, reserve your table in advance so our service team can prepare your seating and tandoor courses promptly.
              </p>

              <div className="p-4 bg-[#FFF9ED] border border-[#171512] rounded-2xl space-y-2 text-xs text-[#514B40]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C69224] shrink-0" />
                  <span className="text-[#171512]">No reservation fees or advance prepayment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C69224] shrink-0" />
                  <span>Direct desk confirmation: <strong className="text-[#171512] font-bold">{settings.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C69224] shrink-0" />
                  <span className="text-[#171512]">Free secured parking inside hotel forecourt</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {tableStatus ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-[#FFF9ED] border border-[#171512] rounded-2xl text-center space-y-3"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#C69224] mx-auto" />
                  <h3 className="text-base font-bold text-[#171512]">Table Enquiry Recorded!</h3>
                  <p className="text-xs text-[#514B40] leading-relaxed">
                    Your enquiry reference ID is <span className="font-mono text-[#C69224] font-bold">#{tableStatus}</span>. Our dining manager will coordinate via phone to hold your table.
                  </p>
                  <button
                    onClick={() => setTableStatus(null)}
                    className="px-5 py-2 text-xs font-bold bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] rounded-xl transition-colors cursor-pointer"
                  >
                    Reserve Another Table
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleTableSubmit} className="space-y-4">
                  {tableError && (
                    <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-300">
                      {tableError}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Your Full Name <span className="text-[#C69224]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rajesh Singhal"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
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
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Dining Date <span className="text-[#C69224]">*</span>
                      </label>
                      <input
                        type="date"
                        value={diningDate}
                        onChange={(e) => setDiningDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Preferred Meal Slot
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                      >
                        <option>Breakfast (07:30 AM – 10:30 AM)</option>
                        <option>Lunch (12:00 PM – 04:00 PM)</option>
                        <option>Dinner (07:00 PM – 11:00 PM)</option>
                        <option>Highway Transit Quick Stop</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#171512] mb-1">
                      Dietary Preferences / Special Requests
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Jain preparation, highway ETA around 8 PM, kids seating..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#171512] shadow-md cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Submit Table Enquiry</span>
                    <ArrowRight className="w-4 h-4 text-[#171512] group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. CONTACT RESTAURANT CTA                                   */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative overflow-hidden bg-[#171512] text-[#FFF5E3] rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-[#171512]"
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#C69224]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E5B94F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5B94F]">
              Authentic Punjabi Feast
            </span>
            <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF5E3]">
              Join Us for an Unforgettable Meal
            </h2>
            <p className="text-xs sm:text-sm text-[#F8F0DF]/80 leading-relaxed max-w-xl mx-auto">
              Stop by on your Grand Trunk Road journey or bring your family for dinner. Experience our fresh clay tandoor and rich handi curries in Topchanchi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => openEnquiryModal('restaurant')}
                className="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-md cursor-pointer"
              >
                Enquire About a Table
              </button>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-[#FFF5E3] hover:text-[#C69224] bg-[#211E19] hover:bg-[#2A2620] border border-[#171512] rounded-xl transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#E5B94F]" />
                <span>Call Restaurant: {settings.phone}</span>
              </a>
              <button
                onClick={() => openEnquiryModal('banquet')}
                className="px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-white border border-[#171512] rounded-xl transition-all cursor-pointer"
              >
                Group & Party Buffet
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
