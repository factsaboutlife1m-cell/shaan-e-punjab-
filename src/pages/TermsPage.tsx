import React from 'react';
import { useHotel } from '../context/HotelContext';

export const TermsPage: React.FC = () => {
  const { settings } = useHotel();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-[#C69224]">
          Hotel Regulations & Policies
        </span>
        <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-bold text-[#171512] mt-1">
          Terms & Conditions
        </h1>
        <p className="font-dmsans text-xs text-[#514B40] mt-1">
          Effective Date: October 2026 • Shaan-E-Punjab Hotel, Topchanchi, Dhanbad, Jharkhand
        </p>
      </div>

      <div className="bg-[#FFF5E3] border border-[#171512] rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-[#514B40] leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            1. Nature of Website & Enquiries
          </h2>
          <p>
            Submission of an enquiry form through this website does NOT constitute an automatic confirmed reservation. A reservation is confirmed only after our reception desk confirms availability with you and issues a booking confirmation reference or formal receipt.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            2. Check-In & Check-Out Timings
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-[#514B40]">
            <li>Standard Check-in Time: <strong className="text-[#171512]">{settings.checkInTime}</strong></li>
            <li>Standard Check-out Time: <strong className="text-[#171512]">{settings.checkOutTime}</strong></li>
            <li>Early check-in and late check-out are subject to prior coordination and room availability upon arrival.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            3. Mandatory Identification
          </h2>
          <p>
            Every adult guest checking into the hotel must furnish a valid government-approved photo identity document (Aadhaar Card, Voter ID, Driving Licence, or Passport). PAN cards are not accepted as valid proof of address as per statutory guidelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            4. Room Cancellation & Rescheduling
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-[#514B40]">
            <li>Individual room reservations may be cancelled or modified free of charge up to 24 hours prior to scheduled arrival date.</li>
            <li>Same-day cancellations or no-shows may incur retention charges equivalent to the first night room tariff.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            5. Banquet, Wedding & Event Contracts
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-[#514B40]">
            <li>Banquet hall bookings (The Grand Shaan Ballroom, Punjab Utsav Lawn, Kohinoor Suite) require an advance token deposit to lock the function date.</li>
            <li>Catering menu selections, stage setup schedules, and final guest counts must be finalized with the banquet manager at least 7 days prior to the function date.</li>
            <li>Sound regulations and local municipal timing laws apply for outdoor lawns and loudspeaker operation.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            6. Restaurant & Dining Rules
          </h2>
          <p>
            Our restaurant operates on a strictly on-premises dine-in and table reservation basis. We do NOT provide food delivery services. Outside cooked food and outside alcoholic beverages are strictly prohibited in the restaurant dining hall.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#171512] uppercase tracking-wider">
            7. Guest Conduct & Property Care
          </h2>
          <p>
            Guests are expected to treat hotel staff, fellow highway travelers, and property facilities with dignity and respect. Any intentional damage to room furnishings, electronics, or banquet equipment will be assessed and billed to the registered guest.
          </p>
        </section>
      </div>
    </div>
  );
};
