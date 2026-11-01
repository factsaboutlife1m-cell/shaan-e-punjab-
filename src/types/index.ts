export type EnquiryType = 'room' | 'restaurant' | 'banquet' | 'general';

export type EnquiryStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled';

export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  phone: string;
  email?: string;
  date?: string;
  departureDate?: string;
  guests?: number;
  roomType?: string;
  eventType?: string;
  message?: string;
  status: EnquiryStatus;
  internalNotes?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  category: string;
  slug: string;
  shortDesc: string;
  description: string;
  capacity: string;
  bedType: string;
  size: string;
  priceNote: string;
  samplePrice?: number;
  isPriceConfirmed: boolean;
  amenities: string[];
  features: string[];
  policies: string[];
  image: string;
  gallery: string[];
  isAvailableForEnquiry: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  isPriceConfirmed: boolean;
  isVeg: boolean;
  isChefSpecial?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  imageCategory: string;
  image?: string;
}

export interface Offer {
  id: string;
  title: string;
  category: 'Stay' | 'Dining' | 'Celebration' | 'Seasonal' | 'Wedding' | 'Group' | 'Birthday';
  tagline: string;
  description: string;
  validity: string;
  terms: string[];
  eligibleServices: string;
  isConfirmed: boolean;
  badge?: string;
  image?: string;
  imageCategory?: string;
  price?: string;
  highlights?: string[];
}

export interface BanquetVenue {
  id: string;
  name: string;
  capacityText: string;
  idealFor: string[];
  description: string;
  amenities: string[];
  decorThemes: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'exterior' | 'rooms' | 'restaurant' | 'food' | 'banquet' | 'events' | 'surroundings';
  caption: string;
  isVerifiedPhoto: boolean;
  image?: string;
  price?: string;
  distance?: string;
  location?: string;
  isHD?: boolean;
}

export interface HotelSettings {
  name: string;
  tagline: string;
  phone: string;
  alternatePhone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  highway: string;
  restaurantHours: string;
  checkInTime: string;
  checkOutTime: string;
  heroVideoUrl?: string;
}
