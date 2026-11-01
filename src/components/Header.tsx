import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHotel, PageRoute } from '../context/HotelContext';
import { Phone, Menu, X, Shield, Calendar, ArrowRight } from 'lucide-react';
import { OFFICIAL_HOTEL_LOGO_PATH } from './VisualAsset';

// Exact 9 navigation items specified for Shaan-E-Punjab Hotel
const NAV_LINKS: { label: string; route: PageRoute }[] = [
  { label: 'Home', route: 'home' },
  { label: 'About Us', route: 'about' },
  { label: 'Rooms & Stay', route: 'rooms' },
  { label: 'Restaurant & Menu', route: 'restaurant' },
  { label: 'Banquets & Events', route: 'banquets' },
  { label: 'Offers', route: 'offers' },
  { label: 'Gallery', route: 'gallery' },
  { label: 'Location', route: 'location' },
  { label: 'Contact Us', route: 'contact' },
];

export const Header: React.FC = () => {
  const { currentPage, navigateTo, openEnquiryModal, settings } = useHotel();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<PageRoute | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = NAV_LINKS;

  const handleNavClick = (route: PageRoute) => {
    setMobileMenuOpen(false);

    if (route === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigateTo(route);
  };

  const activeNavRoute = currentPage;
  const isHeroTransparent = currentPage === 'home' && !isScrolled;

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#FFF5E3] border-b border-[#171512] text-[10px] sm:text-[11px] text-[#514B40] py-0.5 sm:py-1 px-3 sm:px-4 z-40 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C69224] shrink-0" />
            <span className="font-semibold text-[#171512] text-[10px] sm:text-[11px] truncate">
              NH-19 GT Road, Topchanchi
            </span>
            <span className="hidden sm:inline text-[#514B40]">·</span>
            <span className="hidden sm:inline text-[#514B40]">Pure Veg & Non-Veg Multi-Cuisine</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-[#171512] hover:text-[#9B6B12] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C69224]" />
              <span className="font-bold text-[#171512] text-[10px] sm:text-[11px]">{settings.phone}</span>
            </a>
            <button
              onClick={() => navigateTo('admin')}
              className="text-[10px] text-[#514B40] hover:text-[#9B6B12] flex items-center gap-1 transition-colors cursor-pointer"
              title="Hotel Admin Panel"
            >
              <Shield className="w-3 h-3 text-[#C69224]" />
              <span className="hidden md:inline font-medium">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isHeroTransparent ? 'rgba(248, 240, 223, 0.95)' : 'rgba(255, 249, 237, 0.98)',
          borderBottomColor: '#171512',
          boxShadow: isScrolled ? '0 4px 20px rgba(23, 21, 18, 0.08)' : 'none',
        }}
        transition={{ duration: 0.25 }}
        className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-[#171512] py-1.5 sm:py-2 md:py-2"
      >
        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Logo on Left */}
          <button
            onClick={() => handleNavClick('home')}
            className="cursor-pointer flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 min-w-0 group select-none text-left rounded-xl p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69224] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F0DF]"
            aria-label="Shaan-E-Punjab Hotel, Topchanchi - Go to Homepage"
          >
            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl overflow-hidden bg-black border border-[#171512] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <img
                src={OFFICIAL_HOTEL_LOGO_PATH}
                alt="Shaan-E-Punjab Hotel & Resort Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="min-w-0">
              <span className="font-playfair text-[13px] xs:text-[15px] sm:text-base md:text-lg font-bold tracking-tight text-[#171512] block leading-tight truncate">
                Shaan-E-Punjab
              </span>
              <span className="font-montserrat text-[7px] xs:text-[8px] sm:text-[9.5px] uppercase tracking-wider text-[#514B40] block font-semibold truncate max-w-[155px] xs:max-w-[195px] sm:max-w-none">
                Hotel • Restaurant • Banquets
              </span>
            </div>
          </button>

          {/* Navigation Links in Centre with Animated Sliding Underline & Keyboard Accessibility */}
          <nav
            aria-label="Main Navigation"
            onMouseLeave={() => setHoveredRoute(null)}
            className="hidden xl:flex items-center gap-1 font-inter text-[13.5px] text-[#171512] relative"
          >
            {navLinks.map((item) => {
              const isActive = activeNavRoute === item.route;
              const isHovered = hoveredRoute === item.route;
              const showUnderline = (hoveredRoute || activeNavRoute) === item.route;

              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  onMouseEnter={() => setHoveredRoute(item.route)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-3 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69224] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F0DF] ${
                    isActive ? 'text-[#171512] font-bold' : isHovered ? 'text-[#9B6B12] font-semibold' : 'text-[#171512] hover:text-[#9B6B12] font-medium'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>

                  {/* Smooth gold animated underline for active and hovered links */}
                  {showUnderline && (
                    <motion.div
                      layoutId="navSlidingUnderline"
                      className="absolute bottom-0 inset-x-2 h-[2.5px] bg-gradient-to-r from-[#C69224] via-[#E5B94F] to-[#C69224] rounded-full z-10 shadow-[0_2px_8px_rgba(198,146,36,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Soft highlight pill on hover */}
                  {isHovered && (
                    <motion.div
                      layoutId="navHoverBackdrop"
                      className="absolute inset-0 bg-[#C69224]/10 rounded-lg -z-0 border border-[#C69224]/20"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right-Side CTA: Enquire Now & Animated Mobile Toggle */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
            {/* Mobile Compact Booking Button */}
            <button
              onClick={() => openEnquiryModal('room')}
              className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-inter font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69224]"
              aria-label="Book a room"
            >
              <Calendar className="w-3 h-3 text-[#171512]" />
              <span>Book</span>
            </button>

            {/* Tablet & Desktop Booking Button */}
            <button
              onClick={() => openEnquiryModal('room')}
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-inter font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69224] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F0DF]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#171512]" />
              <span>Book a Room</span>
            </button>

            {/* Custom 3D Animated Hamburger Toggle with Morphing Motion Bars */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden relative w-9 h-9 xs:w-10 xs:h-10 p-1.5 xs:p-2 text-[#171512] hover:text-[#9B6B12] bg-[#FFF5E3] hover:bg-[#FFF9ED] rounded-lg border border-[#171512] transition-colors flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69224] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F0DF] shrink-0"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-4.5 xs:w-5 h-[2px] bg-[#171512] rounded-full origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="w-4.5 xs:w-5 h-[2px] bg-[#9B6B12] rounded-full origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-4.5 xs:w-5 h-[2px] bg-[#171512] rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Cream Navigation Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-[76px] sm:top-[88px] z-50 bg-[#F8F0DF]/98 backdrop-blur-xl border-t border-[#171512] flex flex-col justify-between p-6 overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    openEnquiryModal('room');
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl text-center shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171512]"
                >
                  Enquire Now
                </button>
                <button
                  onClick={() => {
                    openEnquiryModal('restaurant');
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF5E3] hover:bg-[#FFF9ED] border border-[#171512] rounded-xl text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69224]"
                >
                  Table Enquiry
                </button>
              </div>

              {/* Staggered Entrance of 9 Nav Links */}
              <nav aria-label="Mobile Navigation" className="space-y-1">
                {navLinks.map((item, index) => {
                  const isActive = activeNavRoute === item.route;

                  return (
                    <motion.button
                      key={item.route}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.045, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => handleNavClick(item.route)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69224] cursor-pointer ${
                        isActive
                          ? 'bg-[#FFF5E3] text-[#171512] font-bold border-l-4 border-[#C69224] border border-[#171512]/20'
                          : 'text-[#171512] hover:bg-[#FFF5E3]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className={`w-4 h-4 ${isActive ? 'text-[#C69224]' : 'text-[#514B40]'}`} />
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#171512]/20 space-y-2 text-xs text-[#514B40]">
              <div className="flex items-center justify-between">
                <span>Front Desk: <strong className="text-[#171512]">{settings.phone}</strong></span>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="text-[#9B6B12] hover:underline font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9B6B12] rounded px-1"
                >
                  Admin Login
                </button>
              </div>
              <p className="text-[11px] text-[#514B40]">
                GT Road (NH-19), Topchanchi, Dhanbad, Jharkhand
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
