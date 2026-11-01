import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { FAQS } from '../data/hotelData';
import { ChevronDown, HelpCircle, Phone, Search } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { openEnquiryModal, settings } = useHotel();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
          Help & Frequently Asked Questions
        </span>
        <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-bold text-[#171512]">
          Frequently Asked Questions
        </h1>
        <p className="font-dmsans text-xs sm:text-sm text-[#514B40] leading-relaxed max-w-2xl mx-auto">
          Find instant answers to common questions regarding room enquiries, check-in policies, restaurant dine-in seating, and banquet venue reservations.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-lg mx-auto">
        <Search className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search question keywords (e.g. check-in, menu, banquet, cancellation)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-[#FFF5E3] border border-[#171512] rounded-2xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm font-bold text-[#171512] leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C69224] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs text-[#514B40] leading-relaxed border-t border-[#171512]/15">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Callout */}
      <div className="p-8 bg-[#FFF5E3] border border-[#171512] rounded-3xl text-center space-y-4 shadow-sm">
        <HelpCircle className="w-8 h-8 text-[#C69224] mx-auto" />
        <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-[#171512]">Have a Specific Requirement or Question?</h3>
        <p className="text-xs text-[#514B40] max-w-md mx-auto">
          Our front desk team is on standby 24/7 to answer custom queries regarding highway arrival, group catering, or hall walkthroughs.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {settings.phone}</span>
          </a>
          <button
            onClick={() => openEnquiryModal('general')}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#FFF9ED] hover:bg-white border border-[#171512] rounded-xl transition-colors cursor-pointer"
          >
            Send General Enquiry
          </button>
        </div>
      </div>
    </div>
  );
};
