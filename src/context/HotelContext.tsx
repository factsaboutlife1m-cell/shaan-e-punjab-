import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Enquiry,
  EnquiryType,
  EnquiryStatus,
  Room,
  MenuItem,
  Offer,
  HotelSettings,
  GalleryItem,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_ROOMS,
  INITIAL_MENU,
  INITIAL_OFFERS,
  INITIAL_ENQUIRIES,
  GALLERY_ITEMS,
} from '../data/hotelData';

export type PageRoute =
  | 'home'
  | 'about'
  | 'rooms'
  | 'room-detail'
  | 'restaurant'
  | 'banquets'
  | 'offers'
  | 'gallery'
  | 'location'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'admin'
  | '404';

interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
  items: GalleryItem[];
}

interface HotelContextType {
  currentPage: PageRoute;
  currentRoomSlug: string | null;
  navigateTo: (page: PageRoute, param?: string) => void;
  
  settings: HotelSettings;
  updateSettings: (newSettings: HotelSettings) => void;

  rooms: Room[];
  updateRoom: (room: Room) => void;
  toggleRoomVisibility: (id: string) => void;

  menu: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;

  offers: Offer[];
  updateOffer: (offer: Offer) => void;

  enquiries: Enquiry[];
  addEnquiry: (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => { success: boolean; enquiryId: string };
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  updateEnquiryNotes: (id: string, notes: string) => void;
  deleteEnquiry: (id: string) => void;

  // Modals
  isEnquiryModalOpen: boolean;
  enquiryModalType: EnquiryType;
  enquiryModalItemName: string | undefined;
  openEnquiryModal: (type?: EnquiryType, itemName?: string) => void;
  closeEnquiryModal: () => void;

  // Lightbox
  lightbox: LightboxState;
  openLightbox: (items: GalleryItem[], index: number) => void;
  closeLightbox: () => void;
  nextLightboxImage: () => void;
  prevLightboxImage: () => void;

  // Gallery
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Admin
  isAdminLoggedIn: boolean;
  adminUser: { username: string; role: string } | null;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;

  // Navigation History
  isBackNav: boolean;
  hasVisitedPage: (page: PageRoute) => boolean;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Page Navigation with Hash sync for iFrame / web safety
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [currentRoomSlug, setCurrentRoomSlug] = useState<string | null>(null);
  const [isBackNav, setIsBackNav] = useState(false);
  const [visitedRoutes, setVisitedRoutes] = useState<Set<PageRoute>>(() => new Set(['home']));

  const hasVisitedPage = (page: PageRoute) => visitedRoutes.has(page);

  useEffect(() => {
    setVisitedRoutes((prev) => {
      if (prev.has(currentPage)) return prev;
      const next = new Set(prev);
      next.add(currentPage);
      return next;
    });
  }, [currentPage]);

  // Settings
  const [settings, setSettings] = useState<HotelSettings>(() => {
    const saved = localStorage.getItem('sep_hotel_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Rooms
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('sep_hotel_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  // Menu
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sep_hotel_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  // Offers
  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('sep_hotel_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  // Enquiries
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('sep_hotel_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  // Gallery
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('sep_hotel_gallery');
      if (saved) {
        const parsed: GalleryItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          const fresh = GALLERY_ITEMS.find((g) => g.id === item.id);
          if (fresh && fresh.image) {
            return { ...item, image: fresh.image };
          }
          return item;
        });
      }
    } catch {
      // fallback
    }
    return GALLERY_ITEMS;
  });

  // Modals
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryModalType, setEnquiryModalType] = useState<EnquiryType>('room');
  const [enquiryModalItemName, setEnquiryModalItemName] = useState<string | undefined>(undefined);

  // Lightbox
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    currentIndex: 0,
    items: GALLERY_ITEMS,
  });

  // Admin Auth - server-side session token
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('sep_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(() => {
    const saved = sessionStorage.getItem('sep_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Verify server-side token on mount
  useEffect(() => {
    const token = sessionStorage.getItem('sep_admin_token');
    if (token) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Unauthorized');
        })
        .then((data) => {
          if (data && data.success) {
            setIsAdminLoggedIn(true);
            setAdminUser(data.user);
            sessionStorage.setItem('sep_admin_user', JSON.stringify(data.user));
          } else {
            sessionStorage.removeItem('sep_admin_auth');
            sessionStorage.removeItem('sep_admin_token');
            sessionStorage.removeItem('sep_admin_user');
            setIsAdminLoggedIn(false);
            setAdminUser(null);
          }
        })
        .catch(() => {
          // If server offline or network blip, keep local state
        });
    }
  }, []);

  // Persist handlers
  useEffect(() => {
    localStorage.setItem('sep_hotel_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sep_hotel_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('sep_hotel_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('sep_hotel_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('sep_hotel_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('sep_hotel_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  // URL Hash Sync for multi-page routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash || hash === '') {
        setCurrentPage('home');
        setCurrentRoomSlug(null);
      } else if (hash.startsWith('room/')) {
        const slug = hash.replace('room/', '');
        setCurrentPage('room-detail');
        setCurrentRoomSlug(slug);
      } else {
        const validRoutes: PageRoute[] = [
          'home',
          'about',
          'rooms',
          'room-detail',
          'restaurant',
          'banquets',
          'offers',
          'gallery',
          'location',
          'contact',
          'faq',
          'privacy',
          'terms',
          'admin',
        ];
        if (validRoutes.includes(hash as PageRoute)) {
          setCurrentPage(hash as PageRoute);
        } else {
          setCurrentPage('404');
        }
      }
    };

    handleHashChange();
    const handlePopState = () => {
      setIsBackNav(true);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = (page: PageRoute, param?: string) => {
    setIsBackNav(false);
    setCurrentPage(page);
    if (page === 'room-detail' && param) {
      setCurrentRoomSlug(param);
      window.location.hash = `#/room/${param}`;
    } else if (page === 'home') {
      window.location.hash = '#/';
      setCurrentRoomSlug(null);
    } else {
      window.location.hash = `#/${page}`;
      setCurrentRoomSlug(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateSettings = (newSettings: HotelSettings) => {
    setSettings(newSettings);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms((prev) => prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)));
  };

  const toggleRoomVisibility = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isAvailableForEnquiry: !r.isAvailableForEnquiry } : r))
    );
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newId = `dish-${Date.now()}`;
    setMenu((prev) => [...prev, { ...item, id: newId }]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenu((prev) => prev.map((m) => (m.id === item.id ? item : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenu((prev) => prev.filter((m) => m.id !== id));
  };

  const updateOffer = (offer: Offer) => {
    setOffers((prev) => prev.map((o) => (o.id === offer.id ? offer : o)));
  };

  const addEnquiry = (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const newEnquiry: Enquiry = {
      ...data,
      id: `ENQ-${nextNum}`,
      status: 'new',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      internalNotes: '',
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    return { success: true, enquiryId: newEnquiry.id };
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const updateEnquiryNotes = (id: string, notes: string) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, internalNotes: notes } : e)));
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  const openEnquiryModal = (type: EnquiryType = 'room', itemName?: string) => {
    setEnquiryModalType(type);
    setEnquiryModalItemName(itemName);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
  };

  const openLightbox = (items: GalleryItem[], index: number) => {
    setLightbox({
      isOpen: true,
      currentIndex: index,
      items,
    });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const nextLightboxImage = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.items.length,
    }));
  };

  const prevLightboxImage = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.items.length) % prev.items.length,
    }));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    setGalleryItems((prev) => [newItem, ...prev]);
  };

  const updateGalleryItem = (updated: GalleryItem) => {
    setGalleryItems((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
  };

  const adminLogin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('sep_admin_auth', 'true');
        sessionStorage.setItem('sep_admin_token', data.token);
        sessionStorage.setItem('sep_admin_user', JSON.stringify(data.user));
        setIsAdminLoggedIn(true);
        setAdminUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid administrator username or password.' };
    } catch {
      return { success: false, error: 'Authentication service temporarily unreachable. Please try again.' };
    }
  };

  const adminLogout = async () => {
    const token = sessionStorage.getItem('sep_admin_token');
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Continue cleanup
      }
    }
    sessionStorage.removeItem('sep_admin_auth');
    sessionStorage.removeItem('sep_admin_token');
    sessionStorage.removeItem('sep_admin_user');
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  return (
    <HotelContext.Provider
      value={{
        currentPage,
        currentRoomSlug,
        navigateTo,
        settings,
        updateSettings,
        rooms,
        updateRoom,
        toggleRoomVisibility,
        menu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        offers,
        updateOffer,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        updateEnquiryNotes,
        deleteEnquiry,
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        isEnquiryModalOpen,
        enquiryModalType,
        enquiryModalItemName,
        openEnquiryModal,
        closeEnquiryModal,
        lightbox,
        openLightbox,
        closeLightbox,
        nextLightboxImage,
        prevLightboxImage,
        isAdminLoggedIn,
        adminUser,
        adminLogin,
        adminLogout,
        isBackNav,
        hasVisitedPage,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
