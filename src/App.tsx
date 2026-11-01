import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { LightboxModal } from './components/LightboxModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { RestaurantPage } from './pages/RestaurantPage';
import { BanquetsPage } from './pages/BanquetsPage';
import { OffersPage } from './pages/OffersPage';
import { GalleryPage } from './pages/GalleryPage';
import { LocationPage } from './pages/LocationPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

const PageContent: React.FC = () => {
  const { currentPage, isBackNav } = useHotel();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'room-detail':
        return <RoomDetailPage />;
      case 'restaurant':
        return <RestaurantPage />;
      case 'banquets':
        return <BanquetsPage />;
      case 'offers':
        return <OffersPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'location':
        return <LocationPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'admin':
        return <AdminPage />;
      case '404':
      default:
        return <NotFoundPage />;
    }
  };

  const isBack = isBackNav;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F0DF] text-[#171512] selection:bg-[#C69224] selection:text-[#171512]">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : isBack ? 0 : 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: reducedMotion ? 0.01 : isBack ? 0.12 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: reducedMotion ? 0.01 : 0.08,
                ease: 'easeIn',
              },
            }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <EnquiryModal />
      <LightboxModal />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <PageContent />
    </HotelProvider>
  );
}
