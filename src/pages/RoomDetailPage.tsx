import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { VisualAsset } from '../components/VisualAsset';
import { Card3D } from '../components/Card3D';
import { MaskedText } from '../components/MaskedText';
import {
  Users,
  CheckCircle2,
  Calendar,
  Phone,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Bed,
  Maximize2,
  Tv,
  Wifi,
  Wind,
  Droplets,
  Clock,
  Car,
  Check,
  Info,
} from 'lucide-react';

export const RoomDetailPage: React.FC = () => {
  const { currentRoomSlug, rooms, navigateTo, addEnquiry, settings, openLightbox, isBackNav } = useHotel();
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  const room = rooms.find((r) => r.slug === currentRoomSlug) || rooms[0];
  const relatedRooms = rooms.filter((r) => r.id !== room.id);

  // Gallery active thumbnail state
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Embedded enquiry form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 3) {
      setError('Please provide your full name (minimum 3 characters)');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number');
      return;
    }
    if (!checkIn) {
      setError('Please select your arrival check-in date');
      return;
    }

    const result = addEnquiry({
      type: 'room',
      name: name.trim(),
      phone: phone.trim(),
      date: checkIn,
      departureDate: checkOut || undefined,
      guests: Number(guests) || 1,
      roomType: room.name,
      message: notes.trim() || undefined,
    });

    if (result.success) {
      setSubmittedId(result.enquiryId);
      setName('');
      setPhone('');
      setNotes('');
    }
  };

  // Gallery thumbnails array
  const photoThumbnails = [
    { id: '1', title: `${room.name} - Bedroom View` },
    { id: '2', title: `${room.name} - Ensuite Bathroom & Amenities` },
    { id: '3', title: `${room.name} - Work Desk & Seating` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
      
      {/* Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('rooms')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#171512] hover:text-[#9B6B12] transition-colors cursor-pointer group bg-[#FFF5E3] px-3.5 py-2 rounded-xl border border-[#171512] shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-[#C69224] group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Rooms</span>
        </button>

        <span className="text-xs text-[#514B40] font-medium hidden sm:inline-block">
          Topchanchi, Dhanbad (NH-19) • Shaan-E-Punjab Hotel
        </span>
      </div>

      {/* Main Room Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Gallery & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Photo Card with 3D Depth & Lightbox trigger */}
          <div className="space-y-3">
            <Card3D intensity={3}>
              <div
                onClick={() => {
                  openLightbox(
                    photoThumbnails.map((p) => ({
                      id: p.id,
                      title: p.title,
                      category: 'rooms',
                      caption: `${room.name} at Shaan-E-Punjab Hotel`,
                      isVerifiedPhoto: true,
                    })),
                    activePhotoIdx
                  );
                }}
                className="relative rounded-2xl overflow-hidden border border-[#171512] shadow-xl group cursor-pointer"
              >
                <div className="w-full aspect-[16/10] overflow-hidden">
                  <VisualAsset
                    type="hotel_deluxe_room"
                    aspect="16:9"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    title={room.name}
                    subtitle={`${room.category} • ${room.capacity}`}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 bg-[#171512]/90 backdrop-blur-md text-[#E5B94F] border border-[#C69224]/50 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                  {room.category} Category
                </div>

                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs text-[#FFF5E3]">
                  <span className="font-semibold drop-shadow">
                    Click to view high-resolution photos
                  </span>
                  <span className="bg-[#171512]/80 px-2.5 py-1 rounded border border-[#C69224]/30 text-[11px] font-bold text-[#E5B94F]">
                    Photo {activePhotoIdx + 1} of 3
                  </span>
                </div>
              </div>
            </Card3D>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {photoThumbnails.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-[#C69224] ring-2 ring-[#C69224]/40 shadow-lg'
                      : 'border-[#171512] opacity-75 hover:opacity-100 hover:border-[#C69224]'
                  }`}
                >
                  <VisualAsset
                    type="hotel_deluxe_room"
                    aspect="16:9"
                    className="w-full"
                    title={photo.title}
                  />
                  <div className="absolute inset-0 bg-black/15" />
                </button>
              ))}
            </div>
          </div>

          {/* Room Title, Tariff & Specs */}
          <div className="p-6 sm:p-8 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#171512]/15 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B6B12]">
                  {room.category} Accommodations
                </span>
                <MaskedText
                  as="h1"
                  delay={0.1}
                  showAccentLine={true}
                  skipAnimation={isBackNav}
                  className="text-2xl sm:text-3xl font-extrabold text-[#171512] mt-1"
                >
                  {room.name}
                </MaskedText>
              </div>

              {room.samplePrice && (
                <div className="text-right">
                  <span className="text-xs text-[#514B40] font-medium">Estimated Tariff</span>
                  <p className="text-2xl sm:text-3xl font-black text-[#171512]">
                    ₹{room.samplePrice.toLocaleString('en-IN')}
                    <span className="text-xs text-[#514B40] font-normal"> / night</span>
                  </p>
                  <span className="text-[10px] text-[#9B6B12] block mt-0.5 font-bold">
                    {room.priceNote}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-[#514B40] leading-relaxed">
              {room.description}
            </p>

            {/* Room Key Specs */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-3 bg-[#FFF9ED] rounded-xl border border-[#171512]">
                <Bed className="w-4 h-4 text-[#C69224] mx-auto mb-1" />
                <span className="text-[#514B40] block text-[11px] font-medium">Bedding</span>
                <span className="text-[#171512] font-bold">{room.bedType}</span>
              </div>
              <div className="p-3 bg-[#FFF9ED] rounded-xl border border-[#171512]">
                <Maximize2 className="w-4 h-4 text-[#C69224] mx-auto mb-1" />
                <span className="text-[#514B40] block text-[11px] font-medium">Room Size</span>
                <span className="text-[#171512] font-bold">{room.size}</span>
              </div>
              <div className="p-3 bg-[#FFF9ED] rounded-xl border border-[#171512]">
                <Users className="w-4 h-4 text-[#C69224] mx-auto mb-1" />
                <span className="text-[#514B40] block text-[11px] font-medium">Max Capacity</span>
                <span className="text-[#171512] font-bold">{room.capacity}</span>
              </div>
            </div>

            {/* Exclusive Features */}
            {room.features && room.features.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171512] mb-2.5">
                  Room Highlights
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#514B40]">
                  {room.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C69224] shrink-0" />
                      <span className="font-medium text-[#171512]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirmed Room Amenities */}
          <div className="p-6 sm:p-8 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-[#171512] uppercase tracking-wider">
              Verified In-Room Amenities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#514B40]">
              {room.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 bg-[#FFF9ED] rounded-xl border border-[#171512]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-[#171512]">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies & Guidelines */}
          <div className="p-6 sm:p-8 bg-[#FFF5E3] border border-[#171512] rounded-2xl space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-[#171512] uppercase tracking-wider">
              Room Policies & Check-in Rules
            </h2>
            <ul className="space-y-2.5 text-xs text-[#514B40]">
              {room.policies.map((policy, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C69224] mt-1.5 shrink-0" />
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Column: Direct Room Enquiry Form (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-[#FFF5E3] border border-[#171512] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B6B12]">
                Direct Reservation Desk
              </span>
              <h2 className="text-xl font-bold text-[#171512] mt-1">
                Enquire for {room.name}
              </h2>
              <p className="text-xs text-[#514B40] mt-1 leading-relaxed">
                Receive instant confirmation coordination directly from our Topchanchi front desk without third-party commission.
              </p>
            </div>

            {submittedId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-[#FFF9ED] border border-[#C69224] rounded-xl text-center space-y-3"
              >
                <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-[#171512]">Enquiry Received!</h4>
                <p className="text-xs text-[#514B40] leading-relaxed">
                  Your reference ID is <span className="font-mono text-[#9B6B12] font-bold">#{submittedId}</span>. Our desk will contact your phone shortly to verify dates and confirm your stay.
                </p>
                <button
                  onClick={() => setSubmittedId(null)}
                  className="px-4 py-2 text-xs font-bold bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] border border-[#171512] rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <p className="text-xs text-red-700 bg-red-100 p-2.5 rounded-lg border border-red-300">
                    {error}
                  </p>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#171512] mb-1">
                    Your Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:border-[#C69224]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#171512] mb-1">
                    Mobile Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:border-[#C69224]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#171512] mb-1">
                      Check-In Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:border-[#C69224]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#171512] mb-1">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:border-[#C69224]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#171512] mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:border-[#C69224]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#171512] mb-1">
                    Special Requests / Expected Arrival Time
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Highway transit arrival around 10 PM, extra bed requested..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:border-[#C69224]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md border border-[#171512] cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Submit Room Enquiry</span>
                  <ArrowRight className="w-4 h-4 text-[#171512] group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            <div className="border-t border-[#171512]/15 pt-3 text-[11px] text-[#514B40] space-y-1.5">
              <p className="flex items-center gap-1.5 text-[#171512]">
                <Phone className="w-3.5 h-3.5 text-[#C69224]" />
                <span>Call Front Desk: <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-[#171512] hover:underline font-bold">{settings.phone}</a></span>
              </p>
              <p className="text-[#514B40]">
                Direct phone coordination • No card prepayment required
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Related Room Categories with Card3D */}
      <div className="pt-10 border-t border-[#171512]/15 space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#9B6B12]">
            Explore Alternatives
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#171512] mt-1">
            Other Room Categories You May Like
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedRooms.map((rel) => (
            <Card3D key={rel.id} intensity={4} onClick={() => navigateTo('room-detail', rel.slug)}>
              <div className="bg-[#FFF5E3] border border-[#171512] hover:border-[#C69224] rounded-2xl p-4 transition-all duration-300 space-y-3 cursor-pointer group h-full flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-xl">
                    <VisualAsset
                      type="hotel_deluxe_room"
                      aspect="16:9"
                      className="w-full group-hover:scale-105 transition-transform duration-500"
                      title={rel.name}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B6B12]">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#171512] group-hover:text-[#9B6B12] transition-colors">
                      {rel.name}
                    </h4>
                    <p className="text-[11px] text-[#514B40] line-clamp-2">
                      {rel.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#171512]/15 pt-3">
                  <span className="text-xs text-[#514B40] font-medium">{rel.capacity}</span>
                  {rel.samplePrice && (
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#171512]">₹{rel.samplePrice.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-[#514B40] block font-normal">/night</span>
                    </div>
                  )}
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>

    </div>
  );
};
