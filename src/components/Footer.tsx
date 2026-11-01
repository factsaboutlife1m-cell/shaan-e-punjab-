import React from 'react';
import { useHotel } from '../context/HotelContext';
import { MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';
import { OFFICIAL_HOTEL_LOGO_PATH } from './VisualAsset';

export const Footer: React.FC = () => {
  const { navigateTo, openEnquiryModal, settings } = useHotel();

  return (
    <footer className="bg-[#171512] border-t border-[#171512] text-[#FFF5E3]">
      {/* Highway Traveler Welcome Banner */}
      <div className="bg-[#211E19] border-b border-[#353026] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C69224]/20 border border-[#E5B94F]/40 flex items-center justify-center text-[#E5B94F] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FFF5E3] uppercase tracking-wider">
                Prime Highway Stopover on NH-19 (Grand Trunk Road)
              </p>
              <p className="text-[11px] text-[#D8CFBF]">
                Convenient parking, 24/7 check-in assistance, and hearty Punjabi dining for road travelers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openEnquiryModal('room')}
              className="px-4 py-2 text-xs font-bold text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] rounded-lg transition-colors shadow-sm"
            >
              Enquire About Rooms
            </button>
            <button
              onClick={() => openEnquiryModal('restaurant')}
              className="px-4 py-2 text-xs font-semibold text-[#FFF5E3] bg-[#2C2720] hover:bg-[#383229] rounded-lg transition-colors border border-[#514B40]"
            >
              Table Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div
              onClick={() => navigateTo('home')}
              className="cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/90 border border-[#C69224]/60 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                <img
                  src={OFFICIAL_HOTEL_LOGO_PATH}
                  alt="Shaan-E-Punjab Hotel & Resort Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <span className="font-playfair text-xl font-bold tracking-tight text-[#FFF5E3] block">
                  Shaan-E-Punjab
                </span>
                <span className="font-montserrat text-[10px] font-semibold uppercase tracking-wider text-[#E5B94F] block">
                  Topchanchi, Dhanbad
                </span>
              </div>
            </div>
            <p className="font-dmsans text-xs text-[#D8CFBF] leading-relaxed">
              Your preferred destination on the GT Road for comfortable hotel stays, authentic multi-cuisine Punjabi dining, and memorable wedding celebrations.
            </p>
            <div className="pt-2 border-t border-[#353026] text-[11px] text-[#A69E8F] font-inter">
              <p className="text-[#FFF5E3]">Government Approved Accommodation</p>
              <p className="mt-0.5 text-[#C69224]">Pure Veg & Non-Veg Kitchen Facilities</p>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="font-montserrat text-xs font-semibold text-[#E5B94F] uppercase tracking-wider mb-4 border-b border-[#353026] pb-2">
              Explore Property
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors"
                >
                  About Our Hotel
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('rooms')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors"
                >
                  Rooms & Stay Options
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('restaurant')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors"
                >
                  Restaurant & Menu (Dine-In)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('banquets')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors"
                >
                  Banquets & Celebrations
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('offers')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors"
                >
                  Seasonal Offers & Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('gallery')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors"
                >
                  Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Enquiries */}
          <div>
            <h4 className="text-xs font-bold text-[#E5B94F] uppercase tracking-wider mb-4 border-b border-[#353026] pb-2">
              Guest Enquiries
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openEnquiryModal('room')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C69224]">→</span>
                  <span>Room Stay Enquiries</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openEnquiryModal('restaurant')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C69224]">→</span>
                  <span>Table & Dining Enquiries</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openEnquiryModal('banquet')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C69224]">→</span>
                  <span>Wedding & Banquet Enquiries</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C69224]">→</span>
                  <span>Frequently Asked Questions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('location')}
                  className="text-[#D8CFBF] hover:text-[#E5B94F] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C69224]">→</span>
                  <span>How to Reach Us (NH-19 Map)</span>
                </button>
              </li>
            </ul>
            <div className="mt-4 p-2.5 rounded-lg bg-[#211E19] border border-[#353026] text-[11px] text-[#D8CFBF]">
              <span className="text-[#E5B94F] font-semibold block mb-0.5">Note on Dining:</span>
              On-premises dining & table reservations only. Online food delivery is not offered.
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E5B94F] uppercase tracking-wider mb-4 border-b border-[#353026] pb-2">
              Hotel Information
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-[#FFF5E3]">
              <MapPin className="w-4 h-4 text-[#C69224] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#FFF5E3]">{settings.name}</p>
                <p className="text-[#D8CFBF]">{settings.addressLine1}</p>
                <p className="text-[#D8CFBF]">{settings.city}, {settings.state} - {settings.pincode}</p>
                <p className="text-[10px] text-[#C69224] mt-0.5">{settings.landmark}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#FFF5E3]">
              <Phone className="w-4 h-4 text-[#C69224] shrink-0" />
              <div>
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-[#E5B94F] font-medium block">
                  {settings.phone}
                </a>
                <span className="text-[10px] text-[#A69E8F]">Alt: {settings.alternatePhone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#FFF5E3]">
              <Mail className="w-4 h-4 text-[#C69224] shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-[#E5B94F] truncate">
                {settings.email}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#FFF5E3]">
              <Clock className="w-4 h-4 text-[#C69224] shrink-0" />
              <div>
                <p className="font-medium">Restaurant: {settings.restaurantHours}</p>
                <p className="text-[10px] text-[#C69224]">Front Desk: 24 Hours Open</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="mt-12 pt-6 border-t border-[#353026] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A69E8F]">
          <p>© {new Date().getFullYear()} Shaan-E-Punjab Hotel, Topchanchi. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => navigateTo('privacy')}
              className="hover:text-[#FFF5E3] transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('terms')}
              className="hover:text-[#FFF5E3] transition-colors"
            >
              Terms & Conditions
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('faq')}
              className="hover:text-[#FFF5E3] transition-colors"
            >
              Hotel Policies & FAQ
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-[#D8CFBF] hover:text-[#E5B94F] flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3 text-[#C69224]" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
