import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Home, ArrowRight, Bed, Utensils, Phone } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigateTo } = useHotel();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224] font-mono text-2xl font-black">
        404
      </div>

      <div className="space-y-2">
        <h1 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#171512]">Page Not Found</h1>
        <p className="font-dmsans text-xs sm:text-sm text-[#514B40] max-w-md mx-auto leading-relaxed">
          The page URL you are attempting to reach does not exist or has been moved. Explore Shaan-E-Punjab Hotel through the direct links below:
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-inter">
        <button
          onClick={() => navigateTo('home')}
          className="p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl hover:border-[#C69224] transition-colors text-xs font-bold text-[#171512] flex flex-col items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Home className="w-4 h-4 text-[#C69224]" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigateTo('rooms')}
          className="p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl hover:border-[#C69224] transition-colors text-xs font-bold text-[#171512] flex flex-col items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Bed className="w-4 h-4 text-[#C69224]" />
          <span>Rooms & Stay</span>
        </button>

        <button
          onClick={() => navigateTo('restaurant')}
          className="p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl hover:border-[#C69224] transition-colors text-xs font-bold text-[#171512] flex flex-col items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Utensils className="w-4 h-4 text-[#C69224]" />
          <span>Restaurant</span>
        </button>

        <button
          onClick={() => navigateTo('contact')}
          className="p-3 bg-[#FFF5E3] border border-[#171512] rounded-xl hover:border-[#C69224] transition-colors text-xs font-bold text-[#171512] flex flex-col items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Phone className="w-4 h-4 text-[#C69224]" />
          <span>Contact Us</span>
        </button>
      </div>
    </div>
  );
};
