import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset, REAL_HOTEL_EXTERIOR_PATH, REAL_TOPCHANCHI_LAKE_PATH } from '../components/VisualAsset';
import { MaskedText } from '../components/MaskedText';
import { Card3D } from '../components/Card3D';
import { NEARBY_ATTRACTIONS, FAQS } from '../data/hotelData';
import { EnquiryType } from '../types';
import {
  MapPin,
  Navigation,
  Phone,
  Mail,
  Clock,
  Car,
  Train,
  Plane,
  ShieldCheck,
  CheckCircle2,
  Send,
  User,
  Calendar,
  Users,
  Utensils,
  Sparkles,
  BedDouble,
  ChevronDown,
  Search,
  ExternalLink,
  Info,
  ShieldAlert,
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

export const LocationPage: React.FC<{ initialFormTab?: 'room' | 'restaurant' | 'banquet' }> = ({
  initialFormTab = 'room',
}) => {
  const { settings, isBackNav, addEnquiry } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  // Form State
  const [activeTab, setActiveTab] = useState<'room' | 'restaurant' | 'banquet'>(initialFormTab);
  const [formSubmittedId, setFormSubmittedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Common Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Room Specific Fields
  const [roomType, setRoomType] = useState('Deluxe AC Room');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomGuests, setRoomGuests] = useState(2);

  // Restaurant Specific Fields
  const [diningDate, setDiningDate] = useState('');
  const [diningTimeSlot, setDiningTimeSlot] = useState('Dinner (07:30 PM – 10:30 PM)');
  const [diningGuests, setDiningGuests] = useState(4);
  const [seatingPreference, setSeatingPreference] = useState('Family AC Dining Hall');

  // Banquet Specific Fields
  const [eventType, setEventType] = useState('Wedding Reception');
  const [eventDate, setEventDate] = useState('');
  const [estimatedGuests, setEstimatedGuests] = useState(150);
  const [venuePreference, setVenuePreference] = useState('Grand Darbar Banquet Hall');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqQuery, setFaqQuery] = useState('');

  // Handle Form Submission
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || name.trim().length < 3) {
      setFormError('Please enter your full name (at least 3 characters).');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    let result;
    if (activeTab === 'room') {
      result = addEnquiry({
        type: 'room',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        roomType,
        date: checkInDate || undefined,
        departureDate: checkOutDate || undefined,
        guests: Number(roomGuests),
        message: message.trim() || `Room enquiry for ${roomType} (${roomGuests} guests)`,
      });
    } else if (activeTab === 'restaurant') {
      result = addEnquiry({
        type: 'restaurant',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        date: diningDate || undefined,
        guests: Number(diningGuests),
        message: `Dining reservation enquiry for ${diningGuests} diners. Slot: ${diningTimeSlot}. Preferred Seating: ${seatingPreference}. Notes: ${message.trim() || 'None'}`,
      });
    } else {
      result = addEnquiry({
        type: 'banquet',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        eventType,
        date: eventDate || undefined,
        guests: Number(estimatedGuests),
        message: `Banquet enquiry for ${eventType}. Estimated guests: ${estimatedGuests}. Venue: ${venuePreference}. Details: ${message.trim() || 'None'}`,
      });
    }

    if (result && result.success) {
      setFormSubmittedId(result.enquiryId);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setCheckInDate('');
      setCheckOutDate('');
      setDiningDate('');
      setEventDate('');
    }
  };

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(faqQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(faqQuery.toLowerCase())
  );

  return (
    <div className="w-full text-[#171512] overflow-x-hidden">
      {/* =========================================================================
          SECTION 1: LOCATION HERO
      ========================================================================== */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-[#171512]">
        {/* Background Architectural Real Hotel Photograph */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.img
            src={REAL_HOTEL_EXTERIOR_PATH}
            alt="Shaan-E-Punjab Hotel Architectural Exterior on NH-19 Topchanchi"
            initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 12,
              ease: 'easeOut',
            }}
            className="w-full h-full object-cover object-center"
          />
          {/* Deep Charcoal Gradients & Gold Tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#171512]/80 to-[#171512]/60" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#171512]/50 to-[#171512]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF5E3] border border-[#171512] shadow-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#C69224] animate-pulse" />
            <span className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-[#171512]">
              Grand Trunk Road (NH-19) • Topchanchi, Dhanbad
            </span>
          </motion.div>

          {/* Masked Headline Reveal */}
          <div className="flex justify-center">
            <MaskedText
              as="h1"
              delay={0.2}
              showAccentLine={true}
              skipAnimation={isBackNav}
              className="font-cormorant text-4xl sm:text-6xl md:text-7xl font-bold text-[#FFF5E3] text-center justify-center tracking-tight"
            >
              Location & Contact
            </MaskedText>
          </div>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-dmsans text-sm sm:text-base md:text-lg text-[#F8F0DF]/90 max-w-3xl mx-auto leading-relaxed"
          >
            Prominently situated on the 6-lane Grand Trunk Road (NH-19) opposite the scenic Topchanchi Lake turnoff. Direct access for highway travelers between Kolkata, Varanasi, and Ranchi, complete with 24/7 reception desk assistance.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2 font-inter"
          >
            <a
              href="https://maps.google.com/?q=Topchanchi+Dhanbad+Jharkhand+NH19"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] text-[#171512] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center gap-2 group cursor-pointer"
            >
              <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform text-[#171512]" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#171512]" />
            </a>

            <a
              href="#enquiry-forms"
              className="px-6 py-3 bg-[#FFF5E3] hover:bg-white border border-[#171512] text-[#171512] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#C69224]" />
              <span>Submit Direct Enquiry</span>
            </a>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* =========================================================================
            SECTION 2 & 3: VERIFIED ADDRESS & INTERACTIVE MAP/TRANSIT GUIDE
        ========================================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
              Verified Highway Landmark
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]">
              Official Property Address & Map
            </h2>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40]">
              Reliable arrival coordinates for cars, family vans, and tour buses traversing NH-19.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Section 2: Verified Address Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Card3D intensity={5} glow={true} className="bg-[#FFF5E3] border border-[#171512] rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#171512]/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C69224] shadow-[0_0_8px_#C69224]" />
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#171512]">
                      Verified Hotel Property
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#FFF9ED] text-[#171512] border border-[#171512]">
                    Pin 828402
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#514B40]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-[#171512] text-base">{settings.name}</p>
                      <p className="text-[#514B40]">{settings.addressLine1}</p>
                      <p className="text-[#514B40]">{settings.addressLine2}</p>
                      <p className="text-[#171512] font-semibold">
                        {settings.city}, {settings.state} - {settings.pincode}
                      </p>
                      <p className="text-[#9B6B12] text-xs mt-1.5 flex items-center gap-1.5 font-bold">
                        <Navigation className="w-3.5 h-3.5 shrink-0" />
                        <span>Landmark: {settings.landmark}</span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#171512]/15 pt-3 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FFF9ED] border border-[#171512] flex items-center justify-center text-[#171512] shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#171512] text-xs uppercase tracking-wider">Highway Corridor</p>
                      <p className="text-xs text-[#514B40] mt-0.5">{settings.highway}</p>
                      <p className="text-[11px] text-[#514B40] mt-0.5">Direct deceleration ramp into our paved customer parking</p>
                    </div>
                  </div>

                  <div className="border-t border-[#171512]/15 pt-3 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FFF9ED] border border-[#171512] flex items-center justify-center text-[#C69224] shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#171512] text-xs uppercase tracking-wider">Timings & Check-in</p>
                      <p className="text-xs text-[#514B40] mt-0.5">
                        Front Desk: <span className="text-[#171512] font-bold">24/7 Continuous</span>
                      </p>
                      <p className="text-[11px] text-[#514B40]">
                        Check-in: {settings.checkInTime} • Check-out: {settings.checkOutTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Topchanchi+Dhanbad+Jharkhand+NH19"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Navigate via Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              </Card3D>

              {/* Parking & Security Assurance */}
              <div className="p-5 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-2 text-xs shadow-xs">
                <div className="flex items-center gap-2 text-[#9B6B12] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#C69224]" />
                  <span>Secure Gated Parking & 24/7 Surveillance</span>
                </div>
                <p className="text-[#514B40] leading-relaxed text-[11px]">
                  Shaan-E-Punjab Hotel features a wide, dedicated parking driveway accommodating family sedans, luxury SUVs, and chartered wedding buses. Equipped with active CCTV surveillance and round-the-clock watchmen.
                </p>
              </div>
            </div>

            {/* Section 3: Visual Map Area & Transit Modes Guide (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden rounded-2xl border border-[#171512] shadow-sm relative bg-[#FFF5E3] group"
              >
                {/* Topchanchi Lake & Parasnath Foot Banner with Photograph and Text */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden select-none bg-neutral-950">
                  <img
                    src={REAL_TOPCHANCHI_LAKE_PATH}
                    alt="TOPCHANCHI LAKE & PARASNATH FOOT near Shaan-E-Punjab Hotel, Topchanchi"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Gradient Scrim for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25 pointer-events-none" />
                  <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-[#C69224] text-[#171512] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase shadow-md inline-flex items-center gap-1.5 border border-[#171512]">
                      <MapPin className="w-3 h-3" />
                      <span>Scenic Landmark • 3.5 km</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF5E3] text-[#171512] border border-[#171512] text-[10px] font-mono font-bold">
                      Parasnath Wildlife Zone
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-10 space-y-1.5 sm:space-y-2 pointer-events-none">
                    <span className="font-montserrat text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#E5B94F] block">
                      Natural Wonder of Topchanchi
                    </span>
                    <h3 className="font-cormorant text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight uppercase drop-shadow-md">
                      TOPCHANCHI LAKE & PARASNATH FOOT
                    </h3>
                    <p className="font-inter text-xs sm:text-sm font-bold text-[#E5B94F] drop-shadow flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
                      <span>Near Shaan-E-Punjab Hotel, Topchanchi</span>
                    </p>
                    <p className="font-dmsans text-[11px] sm:text-xs text-[#F8F0DF] leading-relaxed max-w-xl drop-shadow hidden xs:block">
                      Surrounded by dense sal forests and the majestic Parasnath mountain ridge, the peaceful waters of Topchanchi Lake rest just minutes from Shaan-E-Punjab Hotel along NH-19.
                    </p>
                  </div>
                </div>

                {/* Highway Overlay Bar */}
                <div className="p-4 bg-[#FFF9ED] border-t border-[#171512] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#514B40]">
                    <span className="w-2 h-2 rounded-full bg-[#C69224]" />
                    <span className="font-bold text-[#171512]">Topchanchi, Dhanbad, Jharkhand (GT Road / NH-19)</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Topchanchi+Lake+Dhanbad+Jharkhand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9B6B12] hover:text-[#C69224] font-bold inline-flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <span>Get Directions to Lake</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>

              {/* Transit Modes Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card3D intensity={4} glow={false} className="p-4 bg-[#FFF5E3] border border-[#171512] rounded-xl space-y-2 text-xs shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224]">
                    <Car className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-[#171512]">By Road (NH-19)</h4>
                  <p className="text-[#514B40] text-[11px] leading-relaxed">
                    Directly on the 6-lane Grand Trunk Road. Approx. 270 km from Kolkata and 390 km from Varanasi with clean paved service lanes.
                  </p>
                </Card3D>

                <Card3D intensity={4} glow={false} className="p-4 bg-[#FFF5E3] border border-[#171512] rounded-xl space-y-2 text-xs shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224]">
                    <Train className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-[#171512]">By Train</h4>
                  <p className="text-[#514B40] text-[11px] leading-relaxed">
                    Parasnath Station (24 km) or Dhanbad Junction (32 km), connecting major express and Rajdhani routes across India.
                  </p>
                </Card3D>

                <Card3D intensity={4} glow={false} className="p-4 bg-[#FFF5E3] border border-[#171512] rounded-xl space-y-2 text-xs shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224]">
                    <Plane className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-[#171512]">By Air</h4>
                  <p className="text-[#514B40] text-[11px] leading-relaxed">
                    Kazi Nazrul Islam Airport (Durgapur, 115 km) or Birsa Munda Airport (Ranchi, 145 km) via smoothly connected highway corridors.
                  </p>
                </Card3D>
              </div>
            </div>
          </div>
        </section>

        <GoldBlackDivider delay={0.1} />

        {/* =========================================================================
            SECTION 4: CONTACT PHONE & EMAIL
        ========================================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
              Instant Direct Reach
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]">
              Contact Phone & Email Channels
            </h2>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40]">
              One-touch connectivity for mobile users. Speak directly to our front desk supervisor or reservations officer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Phone */}
            <Card3D intensity={6} glow={true} className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224]">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9B6B12]">
                  Primary 24/7 Desk
                </span>
                <h3 className="font-cormorant text-xl font-bold text-[#171512]">Telephone & WhatsApp</h3>
                <p className="text-xs text-[#514B40] leading-relaxed">
                  Call our 24-hour reception desk for instant room inquiries, highway directions, or late-night arrivals.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="w-full py-2.5 px-4 bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {settings.phone}</span>
                </a>
              </div>
            </Card3D>

            {/* Alternate Phone */}
            <Card3D intensity={6} glow={true} className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224]">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9B6B12]">
                  Reservations & Banquets
                </span>
                <h3 className="font-cormorant text-xl font-bold text-[#171512]">Alternate Support Line</h3>
                <p className="text-xs text-[#514B40] leading-relaxed">
                  Direct line to banquet managers and bulk group stay coordinators for event planning.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={`tel:${settings.alternatePhone.replace(/\s+/g, '')}`}
                  className="w-full py-2.5 px-4 bg-[#FFF9ED] hover:bg-white border border-[#171512] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4 text-[#C69224]" />
                  <span>Call {settings.alternatePhone}</span>
                </a>
              </div>
            </Card3D>

            {/* Direct Email */}
            <Card3D intensity={6} glow={true} className="p-6 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224]">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9B6B12]">
                  Electronic Correspondence
                </span>
                <h3 className="font-cormorant text-xl font-bold text-[#171512]">Direct Email Desk</h3>
                <p className="text-xs text-[#514B40] leading-relaxed">
                  Send corporate RFP requests, tour group itineraries, or formal event requirements.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={`mailto:${settings.email}`}
                  className="w-full py-2.5 px-4 bg-[#FFF9ED] hover:bg-white border border-[#171512] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs truncate"
                >
                  <Mail className="w-4 h-4 text-[#C69224] shrink-0" />
                  <span className="truncate">{settings.email}</span>
                </a>
              </div>
            </Card3D>
          </div>
        </section>

        <GoldBlackDivider delay={0.1} />

        {/* =========================================================================
            SECTION 5: NEARBY ATTRACTIONS (VERIFIED DATA ONLY)
        ========================================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
                Verified Surroundings
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]">
                Nearby Attractions & Distances
              </h2>
              <p className="font-dmsans text-xs sm:text-sm text-[#514B40] max-w-2xl">
                Confirmed distances to celebrated lakes, pilgrimage shrines, and transit hubs around Topchanchi, Dhanbad.
              </p>
            </div>
            <div className="text-xs text-[#171512] font-semibold flex items-center gap-1.5 self-start md:self-auto bg-[#FFF5E3] px-3 py-1.5 rounded-xl border border-[#171512]">
              <ShieldCheck className="w-4 h-4 text-[#C69224] shrink-0" />
              <span>Verified Local Coordinates</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {NEARBY_ATTRACTIONS.map((attraction, i) => (
              <Card3D
                key={i}
                intensity={5}
                glow={true}
                className="p-5 bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-2xl flex flex-col justify-between space-y-4 shadow-sm group"
              >
                <div className="space-y-3">
                  {attraction.image && (
                    <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-2 border border-[#171512]">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#E5B94F] text-[#171512] border border-[#171512]">
                        HD
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FFF9ED] text-[#171512] border border-[#171512]/40">
                      Destination
                    </span>
                    <span className="text-xs font-bold text-[#9B6B12]">
                      {attraction.distance.split('from')[0].trim()}
                    </span>
                  </div>

                  <h3 className="font-cormorant text-lg font-bold text-[#171512] group-hover:text-[#C69224] transition-colors">
                    {attraction.name}
                  </h3>

                  {attraction.location && (
                    <p className="text-[11px] text-[#514B40] font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C69224] shrink-0" />
                      {attraction.location}
                    </p>
                  )}

                  <p className="text-[#514B40] leading-relaxed text-xs">
                    {attraction.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#171512]/15 flex items-center justify-between text-[11px] text-[#514B40]">
                  <span className="flex items-center gap-1 text-[#171512] font-semibold">
                    <Navigation className="w-3 h-3 text-[#C69224]" />
                    <span>Quick Access</span>
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(attraction.name + ' Topchanchi Dhanbad')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9B6B12] hover:text-[#C69224] font-bold inline-flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card3D>
            ))}
          </div>
        </section>

        <GoldBlackDivider delay={0.1} />

        {/* =========================================================================
            SECTIONS 6, 7 & 8: DEDICATED ENQUIRY FORMS
        ========================================================================== */}
        <section id="enquiry-forms" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
              Direct Booking Enquiries
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]">
              Send Your Specific Enquiry
            </h2>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40]">
              Select your inquiry category below. All requests receive immediate attention from the on-duty manager at Topchanchi.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-[#FFF5E3] border border-[#171512] rounded-2xl max-w-md w-full grid grid-cols-3 gap-1 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('room');
                  setFormSubmittedId(null);
                  setFormError(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  activeTab === 'room'
                    ? 'bg-[#C69224] text-[#171512] border-[#171512] shadow-xs'
                    : 'bg-transparent text-[#514B40] hover:text-[#171512] border-transparent'
                }`}
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Room Stay</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('restaurant');
                  setFormSubmittedId(null);
                  setFormError(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  activeTab === 'restaurant'
                    ? 'bg-[#C69224] text-[#171512] border-[#171512] shadow-xs'
                    : 'bg-transparent text-[#514B40] hover:text-[#171512] border-transparent'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Restaurant</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('banquet');
                  setFormSubmittedId(null);
                  setFormError(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  activeTab === 'banquet'
                    ? 'bg-[#C69224] text-[#171512] border-[#171512] shadow-xs'
                    : 'bg-transparent text-[#514B40] hover:text-[#171512] border-transparent'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Banquets</span>
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-3xl mx-auto bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {formSubmittedId ? (
              /* Success State */
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-[#FFF9ED] border border-[#171512] flex items-center justify-center text-[#C69224] mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
                    Enquiry Successfully Registered
                  </span>
                  <h3 className="font-cormorant text-2xl font-bold text-[#171512]">Thank You for Reaching Out!</h3>
                  <p className="text-sm text-[#514B40] max-w-md mx-auto leading-relaxed">
                    Your reference number is{' '}
                    <span className="font-mono text-[#C69224] font-bold px-2 py-0.5 rounded bg-[#FFF9ED] border border-[#171512]">
                      {formSubmittedId}
                    </span>
                    . Our desk team at Topchanchi will call or message your number shortly to assist with your request.
                  </p>
                </div>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormSubmittedId(null)}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#FFF9ED] hover:bg-white text-[#171512] rounded-xl transition-colors border border-[#171512] cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] text-[#171512] rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Front Desk Directly</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              /* Active Enquiry Form */
              <form onSubmit={handleEnquirySubmit} className="space-y-6">
                <div className="border-b border-[#171512]/15 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-cormorant text-xl font-bold text-[#171512] flex items-center gap-2">
                      {activeTab === 'room' && (
                        <>
                          <BedDouble className="w-5 h-5 text-[#C69224]" />
                          <span>Room Accommodation Enquiry</span>
                        </>
                      )}
                      {activeTab === 'restaurant' && (
                        <>
                          <Utensils className="w-5 h-5 text-[#C69224]" />
                          <span>Restaurant Table Reservation Enquiry</span>
                        </>
                      )}
                      {activeTab === 'banquet' && (
                        <>
                          <Sparkles className="w-5 h-5 text-[#C69224]" />
                          <span>Banquet & Celebration Event Enquiry</span>
                        </>
                      )}
                    </h3>
                  </div>
                  <p className="font-dmsans text-xs text-[#514B40] mt-1">
                    {activeTab === 'room' && 'Check room availability for highway transit, vacation stays, or family visits.'}
                    {activeTab === 'restaurant' && 'Reserve dining tables for authentic North Indian dishes. Note: We strictly offer dine-in & takeaway enquiry; no online food delivery.'}
                    {activeTab === 'banquet' && 'Inquire about wedding receptions, anniversary milestones, birthdays, and business seminars.'}
                  </p>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-600 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Common Inputs: Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171512] mb-1">
                      Full Name <span className="text-[#C69224]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171512] mb-1">
                      Mobile Number <span className="text-[#C69224]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#171512] mb-1">
                    Email Address <span className="text-[#514B40] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="e.g. name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                    />
                  </div>
                </div>

                {/* Conditional Fields: Tab 1 (Room Enquiry) */}
                {activeTab === 'room' && (
                  <div className="space-y-4 pt-1 border-t border-[#171512]/15">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Room Category
                        </label>
                        <select
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        >
                          <option value="Deluxe AC Room">Deluxe AC Room (King Bed)</option>
                          <option value="Super Deluxe Family Suite">Super Deluxe Family Suite</option>
                          <option value="Highway Transit Room">Highway Transit Room</option>
                          <option value="Executive Business Suite">Executive Business Suite</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Number of Guests
                        </label>
                        <div className="relative">
                          <Users className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={roomGuests}
                            onChange={(e) => setRoomGuests(parseInt(e.target.value) || 1)}
                            className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Preferred Check-in Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                          <input
                            type="date"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Preferred Check-out Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                          <input
                            type="date"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Fields: Tab 2 (Restaurant Table Reservation) */}
                {activeTab === 'restaurant' && (
                  <div className="space-y-4 pt-1 border-t border-[#171512]/15">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Preferred Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                          <input
                            type="date"
                            value={diningDate}
                            onChange={(e) => setDiningDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Meal Timing Slot
                        </label>
                        <select
                          value={diningTimeSlot}
                          onChange={(e) => setDiningTimeSlot(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        >
                          <option value="Dinner (07:30 PM – 10:30 PM)">Dinner (07:30 PM – 10:30 PM)</option>
                          <option value="Lunch (12:30 PM – 03:30 PM)">Lunch (12:30 PM – 03:30 PM)</option>
                          <option value="Breakfast (07:30 AM – 11:00 AM)">Morning Breakfast (07:30 AM – 11:00 AM)</option>
                          <option value="Evening High Tea (04:30 PM – 06:30 PM)">Evening High Tea (04:30 PM – 06:30 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Number of Diners
                        </label>
                        <div className="relative">
                          <Users className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={diningGuests}
                            onChange={(e) => setDiningGuests(parseInt(e.target.value) || 1)}
                            className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Seating Preference
                        </label>
                        <select
                          value={seatingPreference}
                          onChange={(e) => setSeatingPreference(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        >
                          <option value="Family AC Dining Hall">Family AC Dining Hall</option>
                          <option value="Highway Garden View Section">Highway Garden View Section</option>
                          <option value="Executive Private Lounge">Executive Private Lounge</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Fields: Tab 3 (Banquet Event Enquiry) */}
                {activeTab === 'banquet' && (
                  <div className="space-y-4 pt-1 border-t border-[#171512]/15">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Event Category
                        </label>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        >
                          <option value="Wedding Reception">Wedding & Grand Reception</option>
                          <option value="Birthday Celebration">Birthday Milestone Party</option>
                          <option value="Anniversary Gathering">Anniversary Gathering</option>
                          <option value="Corporate Seminar / Conference">Corporate Conference / Seminar</option>
                          <option value="Family Get-Together">Family Get-Together</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Estimated Guest Count
                        </label>
                        <div className="relative">
                          <Users className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                          <input
                            type="number"
                            min="20"
                            max="800"
                            value={estimatedGuests}
                            onChange={(e) => setEstimatedGuests(parseInt(e.target.value) || 50)}
                            className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Target Event Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                          <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#171512] mb-1">
                          Venue Preference
                        </label>
                        <select
                          value={venuePreference}
                          onChange={(e) => setVenuePreference(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                        >
                          <option value="Grand Darbar Banquet Hall">Grand Darbar Banquet Hall (150–500)</option>
                          <option value="Punjab Utsav Open-Air Lawn">Punjab Utsav Open-Air Lawn (200–700)</option>
                          <option value="Kohinoor Party Suite">Kohinoor Party Suite (40–120)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Message or Special Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#171512] mb-1">
                    Special Requests & Requirements <span className="text-[#514B40] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify highway arrival time, dietary notes, decor preferences, or specific inquiries..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                  />
                </div>

                {/* Privacy and Verification Assurance */}
                <div className="p-3 bg-[#FFF9ED] border border-[#171512]/30 rounded-xl flex items-start gap-2.5 text-[11px] text-[#514B40]">
                  <ShieldCheck className="w-4 h-4 text-[#C69224] shrink-0 mt-0.5" />
                  <span>
                    Your contact information is strictly used for booking correspondence and is never publicly shared or rented.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors border border-[#171512] shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#171512]" />
                  <span>Submit {activeTab === 'room' ? 'Room Stay' : activeTab === 'restaurant' ? 'Restaurant' : 'Banquet'} Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </section>

        <GoldBlackDivider delay={0.1} />

        {/* =========================================================================
            SECTION 9: FREQUENTLY ASKED QUESTIONS (FAQS)
        ========================================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
              Guest Clarity
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]">
              Frequently Asked Questions
            </h2>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40]">
              Verified details regarding check-in times, highway parking security, dining services, and hall bookings.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-[#514B40] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by topic (e.g. check-in, parking, lake, food)..."
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs sm:text-sm text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
            />
          </div>

          {/* Accordion List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-[#FFF5E3] border border-[#171512] rounded-2xl overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-[#171512] leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#C69224] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs text-[#514B40] leading-relaxed border-t border-[#171512]/15">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-[#514B40] text-xs">
                No matching answers found for "{faqQuery}". Please call our 24/7 reception desk for direct help.
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: FOOTER TRANSITION CALLOUT
        ========================================================================== */}
        <section className="pt-4">
          <div className="p-8 sm:p-10 bg-[#FFF5E3] border border-[#171512] rounded-3xl text-center space-y-4 shadow-sm">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
              Traveler Assistance
            </span>
            <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#171512]">
              Arriving Tonight or Planning an Upcoming Event?
            </h3>
            <p className="font-dmsans text-xs sm:text-sm text-[#514B40] max-w-xl mx-auto leading-relaxed">
              Our front desk supervisor is available around the clock to guide your vehicle safely onto our highway premises, confirm vacant suites, or organize family dining arrangements.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="px-6 py-2.5 bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call {settings.phone}</span>
              </a>
              <a
                href="https://maps.google.com/?q=Topchanchi+Dhanbad+Jharkhand+NH19"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#FFF9ED] hover:bg-white border border-[#171512] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4 text-[#C69224]" />
                <span>Get GPS Directions</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
