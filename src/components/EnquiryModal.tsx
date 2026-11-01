import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { EnquiryType } from '../types';
import { X, CheckCircle, Calendar, Users, Phone, Mail, User, MessageSquare } from 'lucide-react';

export const EnquiryModal: React.FC = () => {
  const {
    isEnquiryModalOpen,
    closeEnquiryModal,
    enquiryModalType,
    enquiryModalItemName,
    addEnquiry,
    rooms,
    settings,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<EnquiryType>(enquiryModalType);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(enquiryModalType);
    if (enquiryModalType === 'room' && enquiryModalItemName) {
      setRoomType(enquiryModalItemName);
    } else if (rooms.length > 0 && !roomType) {
      setRoomType(rooms[0].name);
    }
    setSubmittedEnquiryId(null);
    setErrors({});
  }, [isEnquiryModalOpen, enquiryModalType, enquiryModalItemName, rooms]);

  useEffect(() => {
    if (isEnquiryModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeEnquiryModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isEnquiryModalOpen, closeEnquiryModal]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = 'Please provide your full name (minimum 3 characters)';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (activeTab === 'room') {
      if (!date) newErrors.date = 'Please select your estimated check-in date';
      if (!departureDate) newErrors.departureDate = 'Please select departure date';
    } else if (activeTab === 'restaurant') {
      if (!date) newErrors.date = 'Please select your preferred dining date';
    } else if (activeTab === 'banquet') {
      if (!date) newErrors.date = 'Please select your tentative event date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = addEnquiry({
      type: activeTab,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      date: date || undefined,
      departureDate: departureDate || undefined,
      guests: Number(guests) || 1,
      roomType: activeTab === 'room' ? roomType : undefined,
      eventType: activeTab === 'banquet' ? eventType : undefined,
      message: message.trim() || undefined,
    });

    if (result.success) {
      setSubmittedEnquiryId(result.enquiryId);
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setDate('');
    setDepartureDate('');
    setMessage('');
    setSubmittedEnquiryId(null);
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isEnquiryModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeEnquiryModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-[#FFF9ED] border border-[#171512] rounded-2xl shadow-2xl overflow-hidden my-6 text-[#171512]"
          >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FFF5E3] border-b border-[#171512]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B6B12]">
              Direct Guest Enquiry
            </span>
            <h3 className="text-base font-bold text-[#171512] font-playfair">
              Shaan-E-Punjab Hotel & Banquets
            </h3>
          </div>
          <button
            onClick={closeEnquiryModal}
            className="p-1.5 text-[#514B40] hover:text-[#171512] rounded-lg hover:bg-[#F8F0DF] transition-colors border border-transparent hover:border-[#171512]/30"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedEnquiryId ? (
          <div className="p-8 text-center space-y-5 bg-[#FFF9ED]">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#C69224]/20 border border-[#C69224] flex items-center justify-center text-[#9B6B12]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#9B6B12] uppercase tracking-wider block">
                Enquiry Successfully Received
              </span>
              <h4 className="text-xl font-bold text-[#171512] mt-1 font-playfair">Thank You, {name}!</h4>
              <p className="text-xs text-[#514B40] mt-2 max-w-md mx-auto leading-relaxed">
                Your enquiry reference is{' '}
                <span className="font-mono font-bold text-[#171512] bg-[#FFF5E3] px-2 py-0.5 rounded border border-[#171512]">
                  {submittedEnquiryId}
                </span>
                . Our reservation team at Topchanchi will call your phone ({phone}) shortly to confirm availability and discuss arrangements.
              </p>
            </div>

            <div className="p-4 bg-[#FFF5E3] border border-[#171512] rounded-xl text-left text-xs space-y-1.5 shadow-sm">
              <p className="font-semibold text-[#171512]">Enquiry Summary:</p>
              <p className="text-[#514B40]">Category: <span className="text-[#171512] font-semibold capitalize">{activeTab} Enquiry</span></p>
              {date && <p className="text-[#514B40]">Requested Date: <span className="text-[#171512] font-semibold">{date}</span></p>}
              <p className="text-[#514B40]">Guests: <span className="text-[#171512] font-semibold">{guests} Persons</span></p>
              {activeTab === 'room' && roomType && (
                <p className="text-[#514B40]">Room Category: <span className="text-[#171512] font-semibold">{roomType}</span></p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#FFF5E3] hover:bg-[#F8F0DF] text-[#171512] rounded-lg transition-colors border border-[#171512]"
              >
                Call Front Desk Now
              </a>
              <button
                onClick={() => {
                  resetForm();
                  closeEnquiryModal();
                }}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#C69224] hover:bg-[#E5B94F] text-[#171512] rounded-lg transition-colors border border-[#171512] shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#FFF9ED]">
            {/* Category Segmented Control Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#FFF5E3] rounded-lg border border-[#171512]">
              {(['room', 'restaurant', 'banquet', 'general'] as EnquiryType[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setErrors({});
                  }}
                  className={`py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-[#C69224] text-[#171512] font-bold shadow-xs border border-[#171512]'
                      : 'text-[#514B40] hover:text-[#171512]'
                  }`}
                >
                  {tab === 'room' ? 'Room Stay' : tab === 'restaurant' ? 'Dining' : tab === 'banquet' ? 'Banquet' : 'General'}
                </button>
              ))}
            </div>

            {/* Note on Restaurant (Informational, No food delivery) */}
            {activeTab === 'restaurant' && (
              <div className="p-2.5 bg-[#FFF5E3] border border-[#C69224]/50 rounded-lg text-[11px] text-[#514B40]">
                <span className="text-[#9B6B12] font-semibold">Table Reservation Enquiry:</span> Explore our dine-in Punjabi specialties. Online food delivery is not offered.
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="space-y-3">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#171512] mb-1">
                    Full Name <span className="text-[#C69224]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 bg-[#FFF5E3] border ${
                        errors.name ? 'border-red-600' : 'border-[#171512]'
                      } rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-600 mt-0.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#171512] mb-1">
                    Phone Number <span className="text-[#C69224]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="e.g. 9835123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 bg-[#FFF5E3] border ${
                        errors.phone ? 'border-red-600' : 'border-[#171512]'
                      } rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-600 mt-0.5">{errors.phone}</p>}
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-medium text-[#171512] mb-1">
                  Email Address <span className="text-[#514B40] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="e.g. guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FFF5E3] border border-[#171512] rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                  />
                </div>
              </div>

              {/* Dynamic Context Fields */}
              {activeTab === 'room' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#171512] mb-1">
                        Arrival / Check-in <span className="text-[#C69224]">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 bg-[#FFF5E3] border ${
                            errors.date ? 'border-red-600' : 'border-[#171512]'
                          } rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]`}
                        />
                      </div>
                      {errors.date && <p className="text-[10px] text-red-600 mt-0.5">{errors.date}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#171512] mb-1">
                        Departure / Check-out <span className="text-[#C69224]">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                        <input
                          type="date"
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 bg-[#FFF5E3] border ${
                            errors.departureDate ? 'border-red-600' : 'border-[#171512]'
                          } rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]`}
                        />
                      </div>
                      {errors.departureDate && <p className="text-[10px] text-red-600 mt-0.5">{errors.departureDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#171512] mb-1">
                        Room Preference
                      </label>
                      <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FFF5E3] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                      >
                        {rooms.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#171512] mb-1">
                        Number of Guests
                      </label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full pl-9 pr-3 py-2 bg-[#FFF5E3] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'restaurant' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#171512] mb-1">
                      Preferred Date <span className="text-[#C69224]">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full px-3 py-2 bg-[#FFF5E3] border ${
                        errors.date ? 'border-red-600' : 'border-[#171512]'
                      } rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]`}
                    />
                    {errors.date && <p className="text-[10px] text-red-600 mt-0.5">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#171512] mb-1">
                      Guests Dining
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FFF5E3] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'banquet' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#171512] mb-1">
                        Tentative Event Date <span className="text-[#C69224]">*</span>
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full px-3 py-2 bg-[#FFF5E3] border ${
                          errors.date ? 'border-red-600' : 'border-[#171512]'
                        } rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]`}
                      />
                      {errors.date && <p className="text-[10px] text-red-600 mt-0.5">{errors.date}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#171512] mb-1">
                        Expected Guests
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="1000"
                        value={guests || 100}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FFF5E3] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#171512] mb-1">
                      Event Category
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF5E3] border border-[#171512] rounded-lg text-xs text-[#171512] focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Sangeet / Ring Ceremony">Sangeet / Ring Ceremony</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Anniversary Gathering">Anniversary Gathering</option>
                      <option value="Corporate Seminar / Conference">Corporate Seminar / Conference</option>
                      <option value="Family Reunion">Family Reunion</option>
                    </select>
                  </div>
                </>
              )}

              {/* Message / Special Notes */}
              <div>
                <label className="block text-xs font-medium text-[#171512] mb-1">
                  Special Notes or Requirements <span className="text-[#514B40] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-[#514B40] absolute left-3 top-2.5" />
                  <textarea
                    rows={3}
                    placeholder="e.g. Estimated arrival time, dietary preference, parking requirement..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FFF5E3] border border-[#171512] rounded-lg text-xs text-[#171512] placeholder-[#514B40]/70 focus:outline-hidden focus:ring-1 focus:ring-[#C69224] focus:border-[#C69224]"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-[#171512]/30">
              <span className="text-[11px] text-[#514B40]">
                Direct hotel reservation desk. No middleman fees.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeEnquiryModal}
                  className="px-4 py-2 text-xs font-medium text-[#514B40] hover:text-[#171512] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#171512] bg-[#C69224] hover:bg-[#E5B94F] border border-[#171512] rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Send Enquiry
                </button>
              </div>
            </div>
          </form>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
