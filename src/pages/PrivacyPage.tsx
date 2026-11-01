import React from 'react';
import { useHotel } from '../context/HotelContext';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { settings } = useHotel();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
          Legal & Transparency
        </span>
        <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-bold text-[#171512] mt-1">
          Privacy Policy
        </h1>
        <p className="font-dmsans text-xs text-[#514B40] mt-1">
          Last updated: October 2026 • Shaan-E-Punjab Hotel, Topchanchi, Dhanbad, Jharkhand
        </p>
      </div>

      <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-[#514B40] leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            1. Overview & Scope
          </h2>
          <p>
            Shaan-E-Punjab Hotel ("we", "our", or "the hotel"), located in Topchanchi, Dhanbad, Jharkhand on NH-19, operates this informational website to display hotel facilities, room options, restaurant dining menus, and banquet celebration details. This policy outlines how contact details and guest enquiry information are collected, used, and safeguarded.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            2. Information We Collect Through Enquiry Forms
          </h2>
          <p>
            When you submit a room enquiry, table reservation request, banquet query, or general contact message, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#514B40]">
            <li>Your full name</li>
            <li>Your 10-digit mobile phone number</li>
            <li>Email address (optional)</li>
            <li>Requested dates of check-in, check-out, or event</li>
            <li>Expected guest counts and room/event preferences</li>
            <li>Any special notes, requests, or instructions you voluntarily provide</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            3. How We Use Your Information
          </h2>
          <p>
            The information you submit is used solely for the following legitimate hospitality purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#514B40]">
            <li>To contact you via phone or SMS/WhatsApp to confirm room availability, banquet dates, or dining seating</li>
            <li>To prepare your arrival, room allocation, and requested hospitality arrangements</li>
            <li>To maintain local internal front desk enquiry logs for operations</li>
          </ul>
          <p className="pt-1 text-[#514B40]">
            We do NOT sell, rent, lease, or trade your personal information to third-party marketing companies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            4. Absence of Online Payment & Card Data
          </h2>
          <p>
            This website functions as an information and enquiry portal. We do not collect credit card, debit card, UPI PINs, or bank account credentials on this website. Any booking advance or payments are settled directly between you and the hotel management via authorized bank transfer, UPI at reception, or cash during stay.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            5. Government Check-in Verification (Mandatory by Law)
          </h2>
          <p>
            In accordance with Government of Jharkhand and Ministry of Tourism regulations, all adult guests must present original government-issued photo identification (such as Aadhaar card, Voter ID, Driving Licence, or Passport) upon physical arrival at our front desk.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            6. Contact Regarding Your Data
          </h2>
          <p>
            If you wish to update or remove your contact information from our enquiry records, please contact our hotel management directly at:
          </p>
          <div className="p-3.5 bg-[#FFF9ED] rounded-xl border border-[#171512] text-[11px] space-y-1 text-[#514B40]">
            <p className="font-bold text-[#171512]">{settings.name}</p>
            <p>{settings.addressLine1}, {settings.city}, {settings.state} - {settings.pincode}</p>
            <p className="font-semibold text-[#171512]">Phone: {settings.phone} • Email: {settings.email}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
