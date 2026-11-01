import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { EnquiryStatus, EnquiryType, MenuItem, Room, Offer, GalleryItem } from '../types';
import { VisualAsset } from '../components/VisualAsset';
import {
  Shield,
  Lock,
  LogOut,
  Users,
  Bed,
  Utensils,
  Sparkles,
  Settings,
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Download,
  Trash2,
  Edit2,
  Plus,
  Eye,
  EyeOff,
  Phone,
  Mail,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Camera,
  Image as ImageIcon,
  Building,
  Check,
  RotateCcw,
  User,
  MapPin,
  Compass,
  FileText,
  BadgeAlert,
  ArrowUpRight,
} from 'lucide-react';

// Count-Up Animation Component for Real Verified Dashboard Statistics
const CountUp: React.FC<{ value: number; duration?: number }> = ({ value, duration = 0.7 }) => {
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }
    if (value === 0) {
      setDisplayValue(0);
      return;
    }
    const totalSteps = 20;
    const stepTime = Math.max(16, (duration * 1000) / totalSteps);
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const easeOut = Math.sin((progress * Math.PI) / 2);
      const current = Math.round(value * easeOut);
      setDisplayValue(current);
      if (step >= totalSteps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, prefersReduced]);

  return <span>{displayValue}</span>;
};

// Admin Module Navigation Tab Definitions
type AdminModuleId =
  | 'overview'
  | 'all-enquiries'
  | 'room-enquiries'
  | 'restaurant-enquiries'
  | 'banquet-enquiries'
  | 'rooms'
  | 'menu'
  | 'food-images'
  | 'offers'
  | 'gallery'
  | 'contact'
  | 'settings';

export const AdminPage: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminUser,
    adminLogin,
    adminLogout,
    enquiries,
    updateEnquiryStatus,
    updateEnquiryNotes,
    deleteEnquiry,
    rooms,
    updateRoom,
    toggleRoomVisibility,
    menu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    offers,
    updateOffer,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    settings,
    updateSettings,
    navigateTo,
  } = useHotel();

  const prefersReduced = useReducedMotion();

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active module navigation
  const [activeModule, setActiveModule] = useState<AdminModuleId>('overview');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Generic Search & Filter States
  const [enquirySearchQuery, setEnquirySearchQuery] = useState('');
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState<string>('all');
  const [editingNotesEnquiryId, setEditingNotesEnquiryId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dish Management Modal State
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [dishFormName, setDishFormName] = useState('');
  const [dishFormCategory, setDishFormCategory] = useState('Tandoori Starters');
  const [dishFormPrice, setDishFormPrice] = useState<number>(280);
  const [dishFormDesc, setDishFormDesc] = useState('');
  const [dishFormVeg, setDishFormVeg] = useState(true);
  const [dishFormSpecial, setDishFormSpecial] = useState(false);
  const [dishFormSpice, setDishFormSpice] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');
  const [dishFormImageCat, setDishFormImageCat] = useState('food');
  const [dishFormError, setDishFormError] = useState<string | null>(null);

  // Room Edit Modal State
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Gallery Add/Edit Modal State
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [photoFormTitle, setPhotoFormTitle] = useState('');
  const [photoFormCategory, setPhotoFormCategory] = useState<
    'exterior' | 'rooms' | 'restaurant' | 'food' | 'banquet' | 'events' | 'surroundings'
  >('exterior');
  const [photoFormCaption, setPhotoFormCaption] = useState('');
  const [photoFormIsVerified, setPhotoFormIsVerified] = useState(true);
  const [photoFormImage, setPhotoFormImage] = useState('');
  const [photoFormError, setPhotoFormError] = useState<string | null>(null);

  // Settings Local Form State
  const [localSettings, setLocalSettings] = useState(settings);

  // Synchronize local settings when global settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handle Server-Side Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const result = await adminLogin(usernameInput.trim(), passwordInput);
    setIsLoggingIn(false);

    if (result.success) {
      setUsernameInput('');
      setPasswordInput('');
      showToast('Welcome to Shaan-E-Punjab Management Console');
    } else {
      setLoginError(result.error || 'Invalid credentials. Access denied.');
    }
  };

  // Real-time enquiry counts
  const totalEnquiries = enquiries.length;
  const newEnquiries = useMemo(() => enquiries.filter((e) => e.status === 'new').length, [enquiries]);
  const roomEnquiries = useMemo(() => enquiries.filter((e) => e.type === 'room'), [enquiries]);
  const restaurantEnquiries = useMemo(() => enquiries.filter((e) => e.type === 'restaurant'), [enquiries]);
  const banquetEnquiries = useMemo(() => enquiries.filter((e) => e.type === 'banquet'), [enquiries]);

  // Export Enquiries as CSV
  const handleExportCSV = (dataset: typeof enquiries = enquiries, filenamePrefix = 'all') => {
    const headers = [
      'Enquiry ID',
      'Category',
      'Guest Name',
      'Phone Number',
      'Email Address',
      'Preferred Date',
      'Departure Date',
      'Guests Count',
      'Room/Event Type',
      'Status',
      'Guest Message',
      'Internal Notes',
      'Created At',
    ];

    const rows = dataset.map((e) => [
      e.id,
      e.type,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${e.email || ''}"`,
      `"${e.date || ''}"`,
      `"${e.departureDate || ''}"`,
      e.guests || 1,
      `"${(e.roomType || e.eventType || '').replace(/"/g, '""')}"`,
      e.status,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      `"${(e.internalNotes || '').replace(/"/g, '""')}"`,
      e.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `shaan_e_punjab_${filenamePrefix}_enquiries_${new Date().toISOString().substring(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${dataset.length} records to CSV`);
  };

  // Save Dish Form Submit
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    setDishFormError(null);

    if (!dishFormName.trim() || dishFormName.trim().length < 3) {
      setDishFormError('Please enter a valid dish name (minimum 3 characters).');
      return;
    }
    if (!dishFormPrice || dishFormPrice <= 0) {
      setDishFormError('Price must be greater than zero.');
      return;
    }

    if (editingDish) {
      updateMenuItem({
        ...editingDish,
        name: dishFormName.trim(),
        category: dishFormCategory,
        price: Number(dishFormPrice),
        description: dishFormDesc.trim() || 'Prepared with authentic Punjabi spices in our clay tandoor.',
        isVeg: dishFormVeg,
        isChefSpecial: dishFormSpecial,
        spiceLevel: dishFormSpice,
        imageCategory: dishFormImageCat,
      });
      showToast(`Updated "${dishFormName}" in menu`);
    } else {
      addMenuItem({
        name: dishFormName.trim(),
        category: dishFormCategory,
        price: Number(dishFormPrice),
        description: dishFormDesc.trim() || 'Prepared with authentic Punjabi spices in our clay tandoor.',
        isPriceConfirmed: true,
        isVeg: dishFormVeg,
        isChefSpecial: dishFormSpecial,
        spiceLevel: dishFormSpice,
        imageCategory: dishFormImageCat,
      });
      showToast(`Added "${dishFormName}" to menu`);
    }

    setShowAddDishModal(false);
    setEditingDish(null);
  };

  // Open Edit Dish Modal
  const openEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishFormName(dish.name);
    setDishFormCategory(dish.category);
    setDishFormPrice(dish.price);
    setDishFormDesc(dish.description);
    setDishFormVeg(dish.isVeg);
    setDishFormSpecial(Boolean(dish.isChefSpecial));
    setDishFormSpice(dish.spiceLevel || 'Medium');
    setDishFormImageCat(dish.imageCategory || 'food');
    setDishFormError(null);
    setShowAddDishModal(true);
  };

  // Open Add Dish Modal
  const openAddDish = () => {
    setEditingDish(null);
    setDishFormName('');
    setDishFormCategory('Tandoori Starters');
    setDishFormPrice(280);
    setDishFormDesc('');
    setDishFormVeg(true);
    setDishFormSpecial(false);
    setDishFormSpice('Medium');
    setDishFormImageCat('food');
    setDishFormError(null);
    setShowAddDishModal(true);
  };

  // Handle Add Gallery Photo
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoFormError(null);

    if (!photoFormTitle.trim() || photoFormTitle.trim().length < 3) {
      setPhotoFormError('Please enter a photo title (minimum 3 characters).');
      return;
    }
    if (!photoFormCaption.trim() || photoFormCaption.trim().length < 5) {
      setPhotoFormError('Please enter a descriptive caption.');
      return;
    }

    addGalleryItem({
      title: photoFormTitle.trim(),
      category: photoFormCategory,
      caption: photoFormCaption.trim(),
      isVerifiedPhoto: photoFormIsVerified,
      image: photoFormImage.trim() || undefined,
    });

    showToast(`Added photo "${photoFormTitle}" to official gallery`);
    setShowAddPhotoModal(false);
    setPhotoFormTitle('');
    setPhotoFormCaption('');
    setPhotoFormImage('');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    showToast('Website content settings saved successfully');
  };

  // Filter helper for enquiries
  const filterEnquiryList = (list: typeof enquiries) => {
    return list.filter((e) => {
      const matchesStatus = enquiryFilterStatus === 'all' || e.status === enquiryFilterStatus;
      const q = enquirySearchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        e.id.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.roomType && e.roomType.toLowerCase().includes(q)) ||
        (e.eventType && e.eventType.toLowerCase().includes(q)) ||
        (e.message && e.message.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  };

  // =========================================================================
  // SECURE LOGIN GATE (No exposed passwords or client-side secrets)
  // =========================================================================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8F0DF]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-[#FFF5E3] border border-[#171512] rounded-3xl p-8 shadow-sm space-y-6 relative overflow-hidden"
        >
          {/* Top Gold Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C69224] to-[#171512]" />

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#C69224]/20 border border-[#171512] flex items-center justify-center text-[#C69224] mx-auto shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B6B12]">
              Shaan-E-Punjab Hotel • NH-19 Topchanchi
            </span>
            <h1 className="font-cormorant text-2xl font-bold text-[#171512]">Management Console</h1>
            <p className="font-dmsans text-xs text-[#514B40]">
              Authorized property personnel only. Server-side session verification.
            </p>
          </div>

          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-600 flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </motion.div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171512] mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#514B40] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="admin or manager"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171512] mb-1">
                Authorized Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#514B40] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter administrator password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FFF9ED] border border-[#171512] rounded-xl text-xs text-[#171512] placeholder-[#514B40]/60 focus:outline-hidden focus:ring-1 focus:ring-[#C69224]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#514B40] hover:text-[#171512] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-[#C69224] hover:bg-[#E5B94F] disabled:opacity-60 text-[#171512] border border-[#171512] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#171512]/30 border-t-[#171512] rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#171512]/15 text-center">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-xs text-[#514B40] hover:text-[#171512] font-semibold transition-colors cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD INTERFACE
  // Sidebar + Top Bar + Responsive Data Tables + Modals + Action Dialogs
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8F0DF] text-[#171512] flex flex-col selection:bg-[#C69224] selection:text-[#171512]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-5 left-1/2 z-50 bg-[#1c1d22] border border-neutral-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#18191c] border border-neutral-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center shrink-0">
                  <BadgeAlert className="w-5 h-5 text-red-400" />
                </div>
                <h4 className="text-base font-bold text-white">{confirmDialog.title}</h4>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{confirmDialog.message}</p>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                  className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog({ ...confirmDialog, isOpen: false });
                  }}
                  className="px-4 py-1.5 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {confirmDialog.confirmText || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR */}
      <header className="h-16 bg-[#FFF5E3] border-b border-[#171512] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
            className="lg:hidden p-2 text-[#514B40] hover:text-[#171512] rounded-lg hover:bg-[#FFF9ED]"
          >
            {sidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C69224] border border-[#171512] flex items-center justify-center text-[#171512] font-black text-sm shadow-xs">
              SP
            </div>
            <div>
              <span className="font-bold text-[#171512] text-sm tracking-tight block">
                {settings.name}
              </span>
              <span className="text-[10px] text-[#514B40] font-mono block">
                Topchanchi, Dhanbad (NH-19)
              </span>
            </div>
          </div>
        </div>

        {/* Profile & Live Links */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#FFF9ED] border border-[#171512] px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#C69224] animate-pulse" />
            <div className="text-left">
              <span className="text-[11px] font-bold text-[#171512] block">
                {adminUser?.role || 'Property Administrator'}
              </span>
              <span className="text-[9px] text-[#514B40] font-mono block">
                Session Active • 24h
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#171512] hover:bg-white bg-[#FFF9ED] rounded-xl border border-[#171512] transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3 text-[#171512]" />
          </button>

          <button
            type="button"
            onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: 'Sign Out Session',
                message: 'Are you sure you want to sign out of the management console?',
                confirmText: 'Sign Out',
                onConfirm: () => {
                  adminLogout();
                  showToast('Signed out successfully');
                },
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9ED] hover:bg-white text-[#171512] text-xs font-bold rounded-xl border border-[#171512] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#C69224]" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD BODY (Sidebar + Content Workspace) */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-40 w-64 bg-[#FFF5E3] border-r border-[#171512] p-4 space-y-6 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Main Navigation Items */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#514B40] px-3">
              Core Operations
            </span>

            <button
              type="button"
              onClick={() => {
                setActiveModule('overview');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                activeModule === 'overview'
                  ? 'bg-[#C69224] text-[#171512] border-[#171512] shadow-xs'
                  : 'text-[#514B40] hover:text-[#171512] hover:bg-[#FFF9ED] border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C69224]" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('all-enquiries');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                activeModule === 'all-enquiries'
                  ? 'bg-[#C69224] text-[#171512] border-[#171512] shadow-xs'
                  : 'text-[#514B40] hover:text-[#171512] hover:bg-[#FFF9ED] border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#C69224]" />
                <span>All Enquiries</span>
              </div>
              {newEnquiries > 0 && (
                <span className="text-[10px] font-mono font-bold bg-[#C69224] text-[#171512] border border-[#171512] px-1.5 py-0.2 rounded-full">
                  {newEnquiries}
                </span>
              )}
            </button>
          </div>

          {/* Enquiries by Category */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#514B40] px-3">
              Enquiry Channels
            </span>

            <button
              type="button"
              onClick={() => {
                setActiveModule('room-enquiries');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                activeModule === 'room-enquiries'
                  ? 'bg-[#FFF9ED] text-[#171512] border-[#171512]'
                  : 'text-[#514B40] hover:text-[#171512] hover:bg-[#FFF9ED] border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bed className="w-4 h-4 text-[#C69224]" />
                <span>Room Enquiries</span>
              </div>
              <span className="text-[11px] font-mono text-[#514B40]">{roomEnquiries.length}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('restaurant-enquiries');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                activeModule === 'restaurant-enquiries'
                  ? 'bg-[#FFF9ED] text-[#171512] border-[#171512]'
                  : 'text-[#514B40] hover:text-[#171512] hover:bg-[#FFF9ED] border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Utensils className="w-4 h-4 text-[#C69224]" />
                <span>Table Enquiries</span>
              </div>
              <span className="text-[11px] font-mono text-[#514B40]">{restaurantEnquiries.length}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('banquet-enquiries');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeModule === 'banquet-enquiries'
                  ? 'bg-[#1c1d22] text-white border-l-2 border-[#D71920]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18191c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Banquet Enquiries</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">{banquetEnquiries.length}</span>
            </button>
          </div>

          {/* Catalog & Content Management */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 px-3">
              Catalog & Content
            </span>

            <button
              type="button"
              onClick={() => {
                setActiveModule('rooms');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeModule === 'rooms'
                  ? 'bg-[#1c1d22] text-white border-l-2 border-[#D71920]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18191c]'
              }`}
            >
              <Building className="w-4 h-4 text-[#BFC3C7]" />
              <span>Room Management</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('menu');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeModule === 'menu'
                  ? 'bg-[#1c1d22] text-white border-l-2 border-[#D71920]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18191c]'
              }`}
            >
              <Utensils className="w-4 h-4 text-[#BFC3C7]" />
              <span>Menu & Dishes</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('food-images');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeModule === 'food-images'
                  ? 'bg-[#1c1d22] text-white border-l-2 border-[#D71920]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18191c]'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#BFC3C7]" />
              <span>Food Image Mapping</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('offers');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeModule === 'offers'
                  ? 'bg-[#1c1d22] text-white border-l-2 border-[#D71920]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18191c]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#BFC3C7]" />
              <span>Special Offers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('gallery');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeModule === 'gallery'
                  ? 'bg-[#1c1d22] text-white border-l-2 border-[#D71920]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18191c]'
              }`}
            >
              <Camera className="w-4 h-4 text-[#BFC3C7]" />
              <span>Photo Gallery</span>
            </button>
          </div>

          {/* Configuration */}
          <div className="space-y-1 pt-2 border-t border-neutral-800">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 px-3">
              Settings & Disclosures
            </span>

            <button
              type="button"
              onClick={() => {
                setActiveModule('contact');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeModule === 'contact'
                  ? 'bg-[#1c1d22] text-white border-l-2 border-[#D71920]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18191c]'
              }`}
            >
              <Phone className="w-4 h-4 text-[#BFC3C7]" />
              <span>Contact Information</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModule('settings');
                setSidebarOpenMobile(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeModule === 'settings'
                  ? 'bg-[#1c1d22] text-white border-l-2 border-[#D71920]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18191c]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#BFC3C7]" />
              <span>Website Content</span>
            </button>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* =========================================================================
              MODULE 1: DASHBOARD OVERVIEW WITH COUNT-UP METRICS
          ========================================================================== */}
          {activeModule === 'overview' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Operations Dashboard
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Real-time guest submissions, room stay requests, dining reservations, and property metrics.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleExportCSV()}
                    className="px-3.5 py-1.5 bg-[#18191c] hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Real Metrics Grid with Count-Up Animations */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="p-4 sm:p-5 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-1 shadow-md">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Total Enquiries
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    <CountUp value={totalEnquiries} />
                  </p>
                  <span className="text-[10px] text-neutral-500">Verified submissions</span>
                </div>

                <div className="p-4 sm:p-5 bg-[#18191c] border border-amber-500/40 rounded-2xl space-y-1 shadow-md">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    New Actionable
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                    <CountUp value={newEnquiries} />
                  </p>
                  <span className="text-[10px] text-neutral-400">Needs callback</span>
                </div>

                <div className="p-4 sm:p-5 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-1 shadow-md">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Room Stays
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    <CountUp value={roomEnquiries.length} />
                  </p>
                  <span className="text-[10px] text-neutral-500">Accommodation</span>
                </div>

                <div className="p-4 sm:p-5 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-1 shadow-md">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Table Requests
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    <CountUp value={restaurantEnquiries.length} />
                  </p>
                  <span className="text-[10px] text-neutral-500">Dine-in only</span>
                </div>

                <div className="p-4 sm:p-5 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-1 col-span-2 sm:col-span-1 shadow-md">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Banquets
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    <CountUp value={banquetEnquiries.length} />
                  </p>
                  <span className="text-[10px] text-neutral-500">Weddings & events</span>
                </div>
              </div>

              {/* Secondary Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#141517] border border-neutral-800/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Active Rooms</span>
                    <p className="text-lg font-bold text-white font-mono">{rooms.length} Suites</p>
                  </div>
                  <Bed className="w-5 h-5 text-amber-400/80" />
                </div>

                <div className="p-4 bg-[#141517] border border-neutral-800/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Menu Catalog</span>
                    <p className="text-lg font-bold text-white font-mono">{menu.length} Dishes</p>
                  </div>
                  <Utensils className="w-5 h-5 text-emerald-400/80" />
                </div>

                <div className="p-4 bg-[#141517] border border-neutral-800/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Active Offers</span>
                    <p className="text-lg font-bold text-white font-mono">{offers.length} Packages</p>
                  </div>
                  <Calendar className="w-5 h-5 text-cyan-400/80" />
                </div>

                <div className="p-4 bg-[#141517] border border-neutral-800/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Official Photos</span>
                    <p className="text-lg font-bold text-white font-mono">{galleryItems.length} Verified</p>
                  </div>
                  <Camera className="w-5 h-5 text-red-400/80" />
                </div>
              </div>

              {/* Recent Enquiries Quick View Table */}
              <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Recent Guest Enquiries</h3>
                    <p className="text-xs text-neutral-400">
                      Submissions received via direct highway & online channels
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('all-enquiries')}
                    className="text-xs text-[#D71920] hover:text-red-400 font-semibold inline-flex items-center gap-1"
                  >
                    <span>View All ({enquiries.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400">
                        <th className="pb-3 font-semibold">Ref ID</th>
                        <th className="pb-3 font-semibold">Guest</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Phone</th>
                        <th className="pb-3 font-semibold">Target Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {enquiries.slice(0, 5).map((enq) => (
                        <tr key={enq.id} className="hover:bg-neutral-900/40">
                          <td className="py-3 font-mono font-bold text-neutral-200">{enq.id}</td>
                          <td className="py-3 font-semibold text-white">{enq.name}</td>
                          <td className="py-3 capitalize text-neutral-300">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                enq.type === 'room'
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                                  : enq.type === 'restaurant'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
                              }`}
                            >
                              {enq.type}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-neutral-300">
                            <a href={`tel:${enq.phone}`} className="hover:text-amber-400">
                              {enq.phone}
                            </a>
                          </td>
                          <td className="py-3 text-neutral-400">{enq.date || 'Flexible'}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                enq.status === 'new'
                                  ? 'bg-amber-950 text-amber-400 border border-amber-600/40'
                                  : enq.status === 'confirmed'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                                  : enq.status === 'contacted'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-600/40'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (enq.type === 'room') setActiveModule('room-enquiries');
                                else if (enq.type === 'restaurant') setActiveModule('restaurant-enquiries');
                                else setActiveModule('banquet-enquiries');
                              }}
                              className="px-2.5 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Property Operational Summary Card */}
              <div className="p-6 bg-[#18191c] border border-neutral-800 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-md text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Continuous Reception Desk</span>
                  </div>
                  <p className="text-neutral-400">
                    Front desk is open 24/7 for overnight travelers on National Highway 19 (GT Road).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span>Restaurant Timings</span>
                  </div>
                  <p className="text-neutral-400">
                    Dining open from {settings.restaurantHours}. Strictly dine-in and parcel table enquiry only.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <MapPin className="w-4 h-4 text-[#D71920]" />
                    <span>Topchanchi Highway Location</span>
                  </div>
                  <p className="text-neutral-400">
                    Opposite Topchanchi Lake Turnoff, near Sanctuary Gate & Toll Plaza. Pin: {settings.pincode}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 2: ALL ENQUIRIES CONSOLE (Search, Filter, Notes, Status, CSV)
          ========================================================================== */}
          {activeModule === 'all-enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Master Guest Enquiries Console
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Review, assign status, record internal desk notes, and export official correspondence.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportCSV()}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-neutral-700 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export All Records</span>
                </button>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="p-4 bg-[#18191c] border border-neutral-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by Ref ID, guest name, phone, or notes..."
                    value={enquirySearchQuery}
                    onChange={(e) => setEnquirySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#D71920]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-xs text-neutral-400">Status:</span>
                  </div>
                  <select
                    value={enquiryFilterStatus}
                    onChange={(e) => setEnquiryFilterStatus(e.target.value)}
                    className="px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                  >
                    <option value="all">All Statuses ({totalEnquiries})</option>
                    <option value="new">New ({newEnquiries})</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#18191c] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#141517] border-b border-neutral-800 text-neutral-400">
                        <th className="p-3.5 font-semibold">Ref ID</th>
                        <th className="p-3.5 font-semibold">Guest Name</th>
                        <th className="p-3.5 font-semibold">Phone & Email</th>
                        <th className="p-3.5 font-semibold">Category</th>
                        <th className="p-3.5 font-semibold">Dates & Details</th>
                        <th className="p-3.5 font-semibold">Status</th>
                        <th className="p-3.5 font-semibold">Desk Notes</th>
                        <th className="p-3.5 font-semibold text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {filterEnquiryList(enquiries).length > 0 ? (
                        filterEnquiryList(enquiries).map((enq) => (
                          <tr key={enq.id} className="hover:bg-neutral-900/50 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-white whitespace-nowrap">
                              {enq.id}
                            </td>
                            <td className="p-3.5 font-semibold text-white whitespace-nowrap">
                              {enq.name}
                            </td>
                            <td className="p-3.5 text-neutral-300">
                              <a href={`tel:${enq.phone}`} className="hover:text-amber-400 font-mono block">
                                {enq.phone}
                              </a>
                              {enq.email && (
                                <span className="text-[10px] text-neutral-500 block truncate max-w-[140px]">
                                  {enq.email}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 capitalize">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  enq.type === 'room'
                                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                                    : enq.type === 'restaurant'
                                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                    : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
                                }`}
                              >
                                {enq.type}
                              </span>
                              {enq.roomType && (
                                <span className="block text-[10px] text-neutral-400 mt-0.5">{enq.roomType}</span>
                              )}
                              {enq.eventType && (
                                <span className="block text-[10px] text-neutral-400 mt-0.5">{enq.eventType}</span>
                              )}
                            </td>
                            <td className="p-3.5 text-neutral-300">
                              <span>{enq.guests} Guests</span>
                              {enq.date && (
                                <span className="block text-[10px] text-amber-300 font-mono">
                                  {enq.date} {enq.departureDate ? `to ${enq.departureDate}` : ''}
                                </span>
                              )}
                              {enq.message && (
                                <p className="text-[10px] text-neutral-400 max-w-xs truncate mt-0.5" title={enq.message}>
                                  "{enq.message}"
                                </p>
                              )}
                            </td>
                            <td className="p-3.5">
                              <select
                                value={enq.status}
                                onChange={(e) => {
                                  updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus);
                                  showToast(`Status updated to ${e.target.value}`);
                                }}
                                className="px-2 py-1 bg-[#111214] border border-neutral-700 rounded text-[11px] text-white"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-3.5 max-w-xs">
                              {editingNotesEnquiryId === enq.id ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={tempNotes}
                                    onChange={(e) => setTempNotes(e.target.value)}
                                    placeholder="Add desk note..."
                                    className="px-2 py-1 bg-[#111214] border border-neutral-700 rounded text-[11px] text-white w-full"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateEnquiryNotes(enq.id, tempNotes);
                                      setEditingNotesEnquiryId(null);
                                      showToast('Note saved');
                                    }}
                                    className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setEditingNotesEnquiryId(enq.id);
                                    setTempNotes(enq.internalNotes || '');
                                  }}
                                  className="cursor-pointer text-[11px] text-neutral-400 hover:text-white"
                                  title="Click to edit internal note"
                                >
                                  {enq.internalNotes || <span className="italic text-neutral-600">+ Add note</span>}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: 'Delete Enquiry Record',
                                    message: `Permanently delete enquiry ${enq.id} for guest ${enq.name}?`,
                                    confirmText: 'Delete',
                                    onConfirm: () => {
                                      deleteEnquiry(enq.id);
                                      showToast(`Deleted ${enq.id}`);
                                    },
                                  });
                                }}
                                className="p-1.5 text-neutral-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-neutral-500 text-xs">
                            No matching enquiries found for query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 3: ROOM ENQUIRIES SPECIFIC VIEW
          ========================================================================== */}
          {activeModule === 'room-enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                    <Bed className="w-6 h-6 text-amber-400" />
                    <span>Room Accommodation Enquiries</span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Dedicated inquiries for Deluxe AC rooms, Family Suites, and Highway Transit lodging.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportCSV(roomEnquiries, 'room')}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-neutral-700 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export Room Enquiries</span>
                </button>
              </div>

              {/* Room Enquiries Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomEnquiries.length > 0 ? (
                  roomEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-5 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-white">{enq.id}</span>
                          <span className="text-[10px] text-neutral-500 block">{enq.createdAt}</span>
                        </div>
                        <select
                          value={enq.status}
                          onChange={(e) => {
                            updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus);
                            showToast(`Updated ${enq.id} to ${e.target.value}`);
                          }}
                          className="px-2.5 py-1 bg-[#111214] border border-neutral-700 rounded text-xs text-white"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Guest Name</span>
                          <p className="font-semibold text-white">{enq.name}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Phone</span>
                          <a href={`tel:${enq.phone}`} className="font-mono text-amber-400 hover:underline">
                            {enq.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Requested Room</span>
                          <p className="text-neutral-200">{enq.roomType || 'Standard Deluxe'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Guests & Dates</span>
                          <p className="text-neutral-200">
                            {enq.guests} Guests • {enq.date || 'Flexible'}
                          </p>
                        </div>
                      </div>

                      {enq.message && (
                        <div className="p-2.5 bg-[#111214] rounded-xl border border-neutral-800/80 text-xs text-neutral-300">
                          <span className="text-[10px] text-neutral-500 block mb-0.5">Guest Note:</span>
                          <p>"{enq.message}"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                        <span className="text-neutral-500 text-[11px]">
                          Internal Note: {enq.internalNotes || 'None'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Room Enquiry',
                              message: `Delete enquiry ${enq.id}?`,
                              onConfirm: () => deleteEnquiry(enq.id),
                            });
                          }}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-12 text-center text-neutral-500 text-xs bg-[#18191c] rounded-2xl border border-neutral-800">
                    No room accommodation enquiries registered yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 4: RESTAURANT TABLE ENQUIRIES
              (Strictly dine-in table bookings; NO food ordering or delivery)
          ========================================================================== */}
          {activeModule === 'restaurant-enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                    <Utensils className="w-6 h-6 text-emerald-400" />
                    <span>Restaurant Table Enquiries</span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Table reservations and dining queries. Note: The hotel offers dine-in and parcel only; no food delivery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportCSV(restaurantEnquiries, 'restaurant')}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-neutral-700 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export Table Enquiries</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurantEnquiries.length > 0 ? (
                  restaurantEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-5 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-white">{enq.id}</span>
                          <span className="text-[10px] text-neutral-500 block">{enq.createdAt}</span>
                        </div>
                        <select
                          value={enq.status}
                          onChange={(e) => {
                            updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus);
                            showToast(`Updated ${enq.id} to ${e.target.value}`);
                          }}
                          className="px-2.5 py-1 bg-[#111214] border border-neutral-700 rounded text-xs text-white"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Diner Name</span>
                          <p className="font-semibold text-white">{enq.name}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Phone</span>
                          <a href={`tel:${enq.phone}`} className="font-mono text-emerald-400 hover:underline">
                            {enq.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Party Size</span>
                          <p className="text-neutral-200">{enq.guests} Diners</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Dining Date</span>
                          <p className="text-neutral-200">{enq.date || 'Today / Highway arrival'}</p>
                        </div>
                      </div>

                      {enq.message && (
                        <div className="p-2.5 bg-[#111214] rounded-xl border border-neutral-800/80 text-xs text-neutral-300">
                          <span className="text-[10px] text-neutral-500 block mb-0.5">Dining Preferences:</span>
                          <p>"{enq.message}"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                        <span className="text-neutral-500 text-[11px]">
                          Desk Notes: {enq.internalNotes || 'None'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Table Enquiry',
                              message: `Delete enquiry ${enq.id}?`,
                              onConfirm: () => deleteEnquiry(enq.id),
                            });
                          }}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-12 text-center text-neutral-500 text-xs bg-[#18191c] rounded-2xl border border-neutral-800">
                    No restaurant table enquiries registered yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 5: BANQUET & CELEBRATION ENQUIRIES
          ========================================================================== */}
          {activeModule === 'banquet-enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                    <span>Banquet & Event Enquiries</span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Marriage receptions, anniversaries, corporate seminars, and birthday milestones.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportCSV(banquetEnquiries, 'banquet')}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-neutral-700 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export Banquet Enquiries</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banquetEnquiries.length > 0 ? (
                  banquetEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-5 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-white">{enq.id}</span>
                          <span className="text-[10px] text-neutral-500 block">{enq.createdAt}</span>
                        </div>
                        <select
                          value={enq.status}
                          onChange={(e) => {
                            updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus);
                            showToast(`Updated ${enq.id} to ${e.target.value}`);
                          }}
                          className="px-2.5 py-1 bg-[#111214] border border-neutral-700 rounded text-xs text-white"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Host Name</span>
                          <p className="font-semibold text-white">{enq.name}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Contact Phone</span>
                          <a href={`tel:${enq.phone}`} className="font-mono text-cyan-400 hover:underline">
                            {enq.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Event Type</span>
                          <p className="text-neutral-200">{enq.eventType || 'Celebration'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Guest Estimate</span>
                          <p className="text-neutral-200">{enq.guests} Guests</p>
                        </div>
                      </div>

                      {enq.message && (
                        <div className="p-2.5 bg-[#111214] rounded-xl border border-neutral-800/80 text-xs text-neutral-300">
                          <span className="text-[10px] text-neutral-500 block mb-0.5">Event Details:</span>
                          <p>"{enq.message}"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                        <span className="text-neutral-500 text-[11px]">
                          Desk Notes: {enq.internalNotes || 'None'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Banquet Enquiry',
                              message: `Delete enquiry ${enq.id}?`,
                              onConfirm: () => deleteEnquiry(enq.id),
                            });
                          }}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-12 text-center text-neutral-500 text-xs bg-[#18191c] rounded-2xl border border-neutral-800">
                    No banquet or event enquiries registered yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 6: ROOM MANAGEMENT (Tariffs, Amenities, Visibility)
          ========================================================================== */}
          {activeModule === 'rooms' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Room Categories & Tariffs
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Manage published room rates, guest capacity, amenities, and public booking visibility.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-[#18191c] border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {room.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          toggleRoomVisibility(room.id);
                          showToast(
                            room.isAvailableForEnquiry
                              ? `Hidden ${room.name} from enquiries`
                              : `Published ${room.name} for enquiries`
                          );
                        }}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                          room.isAvailableForEnquiry
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {room.isAvailableForEnquiry ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Archived / Hidden</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{room.name}</h3>
                      <p className="text-xs text-neutral-400 mt-1">{room.shortDesc}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#111214] rounded-xl border border-neutral-800 text-xs">
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">Sample Tariff (₹)</label>
                        <input
                          type="number"
                          value={room.samplePrice || 2499}
                          onChange={(e) =>
                            updateRoom({ ...room, samplePrice: Number(e.target.value) })
                          }
                          className="w-full px-2 py-1 bg-[#18191c] border border-neutral-700 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">Guest Capacity</label>
                        <input
                          type="text"
                          value={room.capacity}
                          onChange={(e) => updateRoom({ ...room, capacity: e.target.value })}
                          className="w-full px-2 py-1 bg-[#18191c] border border-neutral-700 rounded text-xs text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-neutral-400 block mb-1">Pricing Note</label>
                        <input
                          type="text"
                          value={room.priceNote}
                          onChange={(e) => updateRoom({ ...room, priceNote: e.target.value })}
                          className="w-full px-2 py-1 bg-[#18191c] border border-neutral-700 rounded text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-1">
                        Verified Amenities:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((am, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 7: MENU & DISH MANAGEMENT (Add, Edit, Price, Veg/Non-Veg)
          ========================================================================== */}
          {activeModule === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Restaurant Menu Catalog
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Manage North Indian specialties, tandoor starters, curries, prices, and dietary tags.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddDish}
                  className="px-4 py-2 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Dish Modal Dialog */}
              <AnimatePresence>
                {showAddDishModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      className="bg-[#18191c] border border-neutral-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h3 className="text-base font-bold text-white">
                          {editingDish ? 'Edit Dish Details' : 'Add New Menu Item'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowAddDishModal(false)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {dishFormError && (
                        <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded-lg text-xs text-red-300">
                          {dishFormError}
                        </div>
                      )}

                      <form onSubmit={handleSaveDish} className="space-y-3">
                        <div>
                          <label className="block text-[11px] text-neutral-300 mb-1">
                            Dish Name <span className="text-[#D71920]">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Tandoori Murgh Angara"
                            value={dishFormName}
                            onChange={(e) => setDishFormName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-neutral-300 mb-1">Category</label>
                            <select
                              value={dishFormCategory}
                              onChange={(e) => setDishFormCategory(e.target.value)}
                              className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                            >
                              <option value="Tandoori Starters">Tandoori Starters</option>
                              <option value="Punjabi Curries">Punjabi Curries</option>
                              <option value="Biryani & Rice">Biryani & Rice</option>
                              <option value="Breads & Accompaniments">Breads & Accompaniments</option>
                              <option value="Desserts & Beverages">Desserts & Beverages</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] text-neutral-300 mb-1">
                              Price (₹) <span className="text-[#D71920]">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={dishFormPrice}
                              onChange={(e) => setDishFormPrice(Number(e.target.value))}
                              className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white font-mono"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-300 mb-1">
                            Description & Spices
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Tender pieces slow-simmered in rich spices..."
                            value={dishFormDesc}
                            onChange={(e) => setDishFormDesc(e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-neutral-300 mb-1">Spice Level</label>
                            <select
                              value={dishFormSpice}
                              onChange={(e) => setDishFormSpice(e.target.value as any)}
                              className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                            >
                              <option value="Mild">Mild</option>
                              <option value="Medium">Medium</option>
                              <option value="Spicy">Spicy</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] text-neutral-300 mb-1">Image Representation</label>
                            <select
                              value={dishFormImageCat}
                              onChange={(e) => setDishFormImageCat(e.target.value)}
                              className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                            >
                              <option value="food">General Specialty</option>
                              <option value="tandoori-chicken">Tandoori Chicken</option>
                              <option value="butter-chicken">Butter Chicken</option>
                              <option value="dal-makhani">Dal Makhani</option>
                              <option value="paneer-tikka">Paneer Tikka</option>
                              <option value="kadhai-paneer">Kadhai Paneer</option>
                              <option value="biryani">Dum Biryani</option>
                              <option value="fish-fry">Fish Fry</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dishFormVeg}
                              onChange={(e) => setDishFormVeg(e.target.checked)}
                              className="rounded text-[#D71920]"
                            />
                            <span>Pure Vegetarian?</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dishFormSpecial}
                              onChange={(e) => setDishFormSpecial(e.target.checked)}
                              className="rounded text-[#D71920]"
                            />
                            <span>Chef's Special Badge</span>
                          </label>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setShowAddDishModal(false)}
                            className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg shadow cursor-pointer"
                          >
                            {editingDish ? 'Save Changes' : 'Create Dish'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Menu Items Table */}
              <div className="bg-[#18191c] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#141517] border-b border-neutral-800 text-neutral-400">
                        <th className="p-3.5 font-semibold">Diet</th>
                        <th className="p-3.5 font-semibold">Dish Name</th>
                        <th className="p-3.5 font-semibold">Category</th>
                        <th className="p-3.5 font-semibold">Price (₹)</th>
                        <th className="p-3.5 font-semibold">Spice</th>
                        <th className="p-3.5 font-semibold">Chef's Special</th>
                        <th className="p-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {menu.map((dish) => (
                        <tr key={dish.id} className="hover:bg-neutral-900/40">
                          <td className="p-3.5">
                            {dish.isVeg ? (
                              <span className="w-3.5 h-3.5 border border-emerald-500 rounded-xs flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              </span>
                            ) : (
                              <span className="w-3.5 h-3.5 border border-red-500 rounded-xs flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-bold text-white">
                            <span>{dish.name}</span>
                            <span className="text-[10px] text-neutral-400 block font-normal">
                              {dish.description}
                            </span>
                          </td>
                          <td className="p-3.5 text-neutral-300">{dish.category}</td>
                          <td className="p-3.5 font-mono font-bold text-amber-400">
                            ₹{dish.price}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                dish.spiceLevel === 'Spicy'
                                  ? 'bg-red-950/80 text-red-300'
                                  : dish.spiceLevel === 'Medium'
                                  ? 'bg-amber-950/80 text-amber-300'
                                  : 'bg-neutral-800 text-neutral-300'
                              }`}
                            >
                              {dish.spiceLevel || 'Medium'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <input
                              type="checkbox"
                              checked={Boolean(dish.isChefSpecial)}
                              onChange={(e) => {
                                updateMenuItem({ ...dish, isChefSpecial: e.target.checked });
                                showToast(`${dish.name} chef special ${e.target.checked ? 'enabled' : 'disabled'}`);
                              }}
                              className="rounded text-[#D71920] cursor-pointer"
                            />
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              type="button"
                              onClick={() => openEditDish(dish)}
                              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                              title="Edit Dish"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: 'Delete Menu Item',
                                  message: `Are you sure you want to remove "${dish.name}" from the menu?`,
                                  confirmText: 'Delete Dish',
                                  onConfirm: () => {
                                    deleteMenuItem(dish.id);
                                    showToast(`Deleted ${dish.name}`);
                                  },
                                });
                              }}
                              className="p-1.5 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-800"
                              title="Delete Dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 8: FOOD IMAGE MANAGEMENT & MAPPING
          ========================================================================== */}
          {activeModule === 'food-images' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Food Image & Visual Mapping
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Preview and assign culinary visual asset representations across the online dining catalog.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {menu.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-4 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-3 shadow-lg"
                  >
                    <div className="overflow-hidden rounded-xl border border-neutral-800">
                      <VisualAsset
                        type={dish.imageCategory || 'food'}
                        aspect="4:3"
                        className="w-full"
                        title={dish.name}
                        subtitle={dish.category}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 uppercase font-semibold">
                          {dish.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">₹{dish.price}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{dish.name}</h4>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">
                        Assigned Visual Asset
                      </label>
                      <select
                        value={dish.imageCategory || 'food'}
                        onChange={(e) => {
                          updateMenuItem({ ...dish, imageCategory: e.target.value });
                          showToast(`Updated visual representation for ${dish.name}`);
                        }}
                        className="w-full px-2 py-1 bg-[#111214] border border-neutral-700 rounded text-xs text-white"
                      >
                        <option value="food">General Specialty</option>
                        <option value="tandoori-chicken">Tandoori Chicken Skewer</option>
                        <option value="butter-chicken">Royal Butter Chicken Gravy</option>
                        <option value="dal-makhani">Bukhara Dal Makhani</option>
                        <option value="paneer-tikka">Paneer Tikka Platter</option>
                        <option value="kadhai-paneer">Kadhai Paneer Masala</option>
                        <option value="biryani">Dum Biryani Handi</option>
                        <option value="fish-fry">Amritsari Fish Fry</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 9: SPECIAL OFFERS MANAGEMENT
          ========================================================================== */}
          {activeModule === 'offers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Special Offers & Packages
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Edit promotional packages, validity windows, and terms for room stays, dining, and banquets.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-[#18191c] border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl"
                  >
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">Offer Title</label>
                      <input
                        type="text"
                        value={offer.title}
                        onChange={(e) => updateOffer({ ...offer, title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">Tagline</label>
                      <input
                        type="text"
                        value={offer.tagline}
                        onChange={(e) => updateOffer({ ...offer, tagline: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-neutral-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">Validity Window</label>
                        <input
                          type="text"
                          value={offer.validity}
                          onChange={(e) => updateOffer({ ...offer, validity: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-amber-300"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">Promo Badge</label>
                        <input
                          type="text"
                          value={offer.badge || 'PROMOTION'}
                          onChange={(e) => updateOffer({ ...offer, badge: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-red-400 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={offer.description}
                        onChange={(e) => updateOffer({ ...offer, description: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-neutral-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 10: PHOTO GALLERY MANAGEMENT
          ========================================================================== */}
          {activeModule === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Official Photo Gallery Management
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Manage exterior facade photos, rooms, banquet suites, and dining hall images.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(true)}
                  className="px-4 py-2 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              {/* Add Photo Modal */}
              <AnimatePresence>
                {showAddPhotoModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      className="bg-[#18191c] border border-neutral-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h3 className="text-base font-bold text-white">Add Photo to Gallery</h3>
                        <button
                          type="button"
                          onClick={() => setShowAddPhotoModal(false)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {photoFormError && (
                        <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded-lg text-xs text-red-300">
                          {photoFormError}
                        </div>
                      )}

                      <form onSubmit={handleSavePhoto} className="space-y-3">
                        <div>
                          <label className="block text-[11px] text-neutral-300 mb-1">Photo Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Grand Darbar Wedding Stage"
                            value={photoFormTitle}
                            onChange={(e) => setPhotoFormTitle(e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-300 mb-1">Category</label>
                          <select
                            value={photoFormCategory}
                            onChange={(e) => setPhotoFormCategory(e.target.value as any)}
                            className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                          >
                            <option value="exterior">Exterior</option>
                            <option value="rooms">Rooms</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="food">Food</option>
                            <option value="banquet">Banquets</option>
                            <option value="events">Events</option>
                            <option value="surroundings">Surroundings</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-300 mb-1">Caption</label>
                          <textarea
                            rows={3}
                            placeholder="Detailed caption describing location and setup..."
                            value={photoFormCaption}
                            onChange={(e) => setPhotoFormCaption(e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-300 mb-1">
                            Image Path or URL <span className="text-neutral-500">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Leave blank to use official hotel visual preset"
                            value={photoFormImage}
                            onChange={(e) => setPhotoFormImage(e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white font-mono"
                          />
                        </div>

                        <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={photoFormIsVerified}
                            onChange={(e) => setPhotoFormIsVerified(e.target.checked)}
                            className="rounded text-[#D71920]"
                          />
                          <span>Verified Hotel Photo Badge</span>
                        </label>

                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setShowAddPhotoModal(false)}
                            className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg shadow cursor-pointer"
                          >
                            Save Photo
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#18191c] border border-neutral-800 rounded-2xl space-y-3 shadow-lg"
                  >
                    <div className="overflow-hidden rounded-xl border border-neutral-800">
                      <VisualAsset
                        type={item.category === 'rooms' ? 'room' : item.category === 'food' ? 'food' : item.category === 'banquet' || item.category === 'events' ? 'banquet' : 'hotel'}
                        aspect="4:3"
                        className="w-full"
                        title={item.title}
                        subtitle={item.caption}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                          {item.category}
                        </span>
                        {item.isVerifiedPhoto && (
                          <span className="text-[9px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                            Verified
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2">{item.caption}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-neutral-500">{item.id}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Delete Photo',
                            message: `Remove photo "${item.title}" from public gallery?`,
                            confirmText: 'Delete',
                            onConfirm: () => {
                              deleteGalleryItem(item.id);
                              showToast(`Deleted ${item.title}`);
                            },
                          });
                        }}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 11 & 12: CONTACT INFORMATION & WEBSITE SETTINGS
          ========================================================================== */}
          {(activeModule === 'contact' || activeModule === 'settings') && (
            <div className="bg-[#18191c] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeModule === 'contact' ? 'Contact Information Management' : 'Website Content Settings'}
                </h2>
                <p className="text-xs text-neutral-400">
                  Update published hotel credentials, customer desk phone numbers, operational hours, and address lines.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Hotel Business Name
                    </label>
                    <input
                      type="text"
                      value={localSettings.name}
                      onChange={(e) => setLocalSettings({ ...localSettings, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Promotional Tagline
                    </label>
                    <input
                      type="text"
                      value={localSettings.tagline}
                      onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Primary Phone (24/7 Desk)
                    </label>
                    <input
                      type="text"
                      value={localSettings.phone}
                      onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Alternate Phone
                    </label>
                    <input
                      type="text"
                      value={localSettings.alternatePhone}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, alternatePhone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={localSettings.email}
                      onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Restaurant Operational Hours
                    </label>
                    <input
                      type="text"
                      value={localSettings.restaurantHours}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, restaurantHours: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Highway Address Line 1
                    </label>
                    <input
                      type="text"
                      value={localSettings.addressLine1}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, addressLine1: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      City & District
                    </label>
                    <input
                      type="text"
                      value={localSettings.city}
                      onChange={(e) => setLocalSettings({ ...localSettings, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      State & Pincode
                    </label>
                    <input
                      type="text"
                      value={`${localSettings.state} - ${localSettings.pincode}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('-');
                        setLocalSettings({
                          ...localSettings,
                          state: parts[0]?.trim() || 'Jharkhand',
                          pincode: parts[1]?.trim() || '828402',
                        });
                      }}
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Highway Corridor & Landmark
                    </label>
                    <input
                      type="text"
                      value={localSettings.landmark}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, landmark: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Hero Background MP4 Video Source URL / Path
                    </label>
                    <input
                      type="text"
                      placeholder="/assets/aistudio/VID_20261031_105129_264_bsl_97b51210.mp4"
                      value={localSettings.heroVideoUrl || ''}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, heroVideoUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#111214] border border-neutral-700 rounded-lg text-xs text-white font-mono"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Accepts MP4 video URLs (up to 60s+ duration) for the homepage hero background.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                  <span className="text-[11px] text-neutral-500">
                    Changes take effect across Header, Footer, and Contact page immediately.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-red-900/30 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
