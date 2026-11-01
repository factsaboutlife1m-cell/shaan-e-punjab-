import React, { useState } from 'react';

interface VisualAssetProps {
  type: string;
  src?: string;
  className?: string;
  aspect?: '16:9' | '4:3' | '1:1' | '3:2' | 'hero';
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  priority?: boolean;
}

export const REAL_HOTEL_EXTERIOR_PATH = '/assets/aistudio/hotelsane_c5b572e7.png';
export const REAL_TOPCHANCHI_LAKE_PATH = '/assets/aistudio/lake.jpg';
export const REAL_HOTEL_GARDEN_PATH = '/assets/aistudio/sane_2b3a5684.jpg';
export const REAL_HOTEL_BEDROOM_PATH = '/assets/aistudio/delux.jpg';
export const REAL_CHICKEN_DISH_PATH = '/assets/aistudio/chick_3ad46ba2.jpg';
export const REAL_PANEER_DISH_PATH = '/assets/aistudio/panner_612fe8e0.jpg';
export const REAL_TANDOOR_OVEN_PATH = '/assets/aistudio/clay_72ae133a.jpg';
export const REAL_TIKKA_DISH_PATH = '/assets/aistudio/tikka_f2d0f06d.jpg';
export const REAL_DAHI_SHOLAY_PATH = '/assets/aistudio/dahi_bacb1884.jpg';
export const REAL_HOTEL_HALL_PATH = '/assets/aistudio/hall.jpg';
export const REAL_TANDOORI_CHICKEN_PATH = '/assets/aistudio/Tandoori-Chicken-1-scaled_680a6f34.jpg';
export const REAL_LAHORI_DISH_PATH = '/assets/aistudio/lahori-naam-dal-tadkewali_e076c895.jpg';
export const REAL_MUTTON_DISH_PATH = '/assets/aistudio/mutton_d2c78d8c.jpg';
export const REAL_DAL_TADKA_PATH = '/assets/aistudio/dal_4398536e.jpg';
export const REAL_CHICKEN_BIRYANI_PATH = '/assets/aistudio/briyani_fea90aaa.jpg';
export const REAL_VEG_DUM_BIRYANI_PATH = '/assets/aistudio/dum_1aa8a00e.jpg';
export const REAL_JEERA_RICE_PATH = '/assets/aistudio/rice_ee34d200.jpg';
export const REAL_CHUR_CHUR_KULCHA_PATH = '/assets/aistudio/kulcha_31a11e34.jpg';
export const OFFICIAL_HOTEL_LOGO_PATH = '/assets/aistudio/hotel_3a49811f.png';

export const VisualAsset: React.FC<VisualAssetProps> = ({
  type,
  src,
  className = '',
  aspect = '16:9',
  title,
  subtitle,
  onClick,
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const getAspectClass = () => {
    switch (aspect) {
      case '16:9':
        return 'aspect-[16/9]';
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '3:2':
        return 'aspect-[3/2]';
      case 'hero':
        return 'h-full min-h-[560px] md:min-h-[680px] w-full';
      default:
        return 'aspect-[16/9]';
    }
  };

  // Determine if this is an exterior photo, lake photo, garden lawn photo, deluxe bedroom, chicken, paneer, tandoor, tikka, or dahi sholay photo
  const isExterior =
    type === 'hotel_exterior_hero' ||
    type === 'exterior' ||
    type === 'hotel-exterior' ||
    src === REAL_HOTEL_EXTERIOR_PATH;

  const isLake =
    type === 'lake' ||
    type === 'location' ||
    type === 'surroundings' ||
    type === 'topchanchi_lake' ||
    src === REAL_TOPCHANCHI_LAKE_PATH ||
    src === '/assets/aistudio/lake.jpg' ||
    src === '/assets/aistudio/lake_c902a37a.jpg';

  const isGarden =
    type === 'garden' ||
    type === 'lawn' ||
    src === REAL_HOTEL_GARDEN_PATH;

  const isBedroom =
    type === 'hotel_deluxe_room' ||
    type === 'deluxe_king_bedroom' ||
    type === 'deluxe-king' ||
    type === 'room-deluxe-king' ||
    type === 'room_deluxe' ||
    src === REAL_HOTEL_BEDROOM_PATH ||
    src === '/assets/aistudio/delux.jpg' ||
    src === '/assets/aistudio/bed_e30d0e13.jpg';

  const isChicken =
    type === 'tandoori-chicken' ||
    type === 'chicken' ||
    type === 'tandoori_chicken' ||
    src === REAL_CHICKEN_DISH_PATH;

  const isPaneer =
    type === 'paneer-tikka' ||
    type === 'paneer' ||
    type === 'paneer_tikka' ||
    src === REAL_PANEER_DISH_PATH;

  const isTandoor =
    type === 'clay_tandoor_oven' ||
    type === 'tandoor' ||
    type === 'clay_tandoor' ||
    type === 'tandoor_oven' ||
    src === REAL_TANDOOR_OVEN_PATH;

  const isTikka =
    type === 'chicken-tikka' ||
    type === 'murgh-tikka' ||
    type === 'tikka' ||
    src === REAL_TIKKA_DISH_PATH;

  const isDahi =
    type === 'dahi-ke-sholay' ||
    type === 'dahi-sholay' ||
    type === 'dahi' ||
    src === REAL_DAHI_SHOLAY_PATH;

  const isHall =
    type === 'hall' ||
    type === 'hotel_banquet_hall' ||
    type === 'hotel_hall' ||
    type === 'restaurant_hall' ||
    type === 'hotel_restaurant_ambience' ||
    type === 'hotel_restaurant_dining' ||
    src === REAL_HOTEL_HALL_PATH ||
    src === '/assets/aistudio/hall.jpg' ||
    src === '/assets/aistudio/hall_5d0455b4.jpg';

  const isTandooriChicken =
    type === 'tandoori_chicken_fresh' ||
    src === REAL_TANDOORI_CHICKEN_PATH;

  const isLahori =
    type === 'lahori' ||
    type === 'lahori_naan' ||
    type === 'dal_makhani_naan' ||
    src === REAL_LAHORI_DISH_PATH;

  const resolvedSrc =
    src ||
    (isExterior
      ? REAL_HOTEL_EXTERIOR_PATH
      : isLake
      ? REAL_TOPCHANCHI_LAKE_PATH
      : isGarden
      ? REAL_HOTEL_GARDEN_PATH
      : isBedroom
      ? REAL_HOTEL_BEDROOM_PATH
      : isHall
      ? REAL_HOTEL_HALL_PATH
      : isTandooriChicken
      ? REAL_TANDOORI_CHICKEN_PATH
      : isLahori
      ? REAL_LAHORI_DISH_PATH
      : isChicken
      ? REAL_CHICKEN_DISH_PATH
      : isPaneer
      ? REAL_PANEER_DISH_PATH
      : isTandoor
      ? REAL_TANDOOR_OVEN_PATH
      : isTikka
      ? REAL_TIKKA_DISH_PATH
      : isDahi
      ? REAL_DAHI_SHOLAY_PATH
      : undefined);

  // If real image source is available and hasn't errored
  if (resolvedSrc && !imageError) {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden group select-none ${getAspectClass()} ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <img
          src={resolvedSrc}
          alt={title || 'Shaan-E-Punjab Hotel, Topchanchi, Dhanbad'}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            aspect === 'hero' ? 'scale-100' : 'group-hover:scale-105'
          }`}
        />

        {/* Ambient Vignette & Scrim for WCAG AA readability */}
        {aspect === 'hero' ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/35 pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
        )}

        {/* Subtle metallic silver perimeter border highlight */}
        <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-[inherit]" />

        {/* Caption Overlay */}
        {(title || subtitle) && aspect !== 'hero' && (
          <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
            {title && <p className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">{title}</p>}
            {subtitle && <p className="text-[10px] sm:text-xs text-neutral-300 truncate drop-shadow mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>
    );
  }

  // Pure CSS & SVG Photorealistic Renders for Restaurant, Banquets, Rooms, and Culinary Assets
  const renderFallback = () => {
    switch (type) {
      // Restaurant & Dining Interior
      case 'hotel_restaurant_dining':
      case 'restaurant':
      case 'dining':
        return (
          <div className="relative w-full h-full bg-[#18191c] overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#241c19] via-[#1a171c] to-[#121316]"></div>
            <div className="relative z-10 flex justify-around">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[1px] h-12 bg-amber-400/60"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_24px_#f59e0b] border border-amber-200"></div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex justify-between items-end gap-3 mt-auto">
              <div className="flex-1 bg-[#232025] border border-amber-600/30 rounded-t-lg p-3 text-center">
                <div className="w-8 h-8 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-1">
                  <span className="text-amber-400 text-xs">🍲</span>
                </div>
                <p className="text-xs font-semibold text-neutral-200">Punjabi Family Dining</p>
                <p className="text-[10px] text-neutral-400">Authentic Gravies & Tandoor</p>
              </div>

              <div className="flex-1 bg-[#2b2220] border-2 border-red-600/40 rounded-t-lg p-4 text-center transform -translate-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center mb-1">
                  <span className="text-red-400 text-sm">🔥</span>
                </div>
                <p className="text-xs font-bold text-white">Live Clay Tandoor & Grill</p>
                <p className="text-[10px] text-amber-300">Barbeque Nation Inspired Buffet</p>
              </div>

              <div className="flex-1 bg-[#232025] border border-amber-600/30 rounded-t-lg p-3 text-center">
                <div className="w-8 h-8 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-1">
                  <span className="text-amber-400 text-xs">🥘</span>
                </div>
                <p className="text-xs font-semibold text-neutral-200">Handi Biryani & Dal</p>
                <p className="text-[10px] text-neutral-400">Slow Simmered Bukhara Taste</p>
              </div>
            </div>

            <div className="relative z-10 border-t border-neutral-700/80 pt-2 flex justify-between text-[11px] text-neutral-400">
              <span>Pure Veg & Non-Veg Kitchen Sections</span>
              <span className="text-amber-400 font-medium">Table Enquiry • Dine-in Experience</span>
            </div>
          </div>
        );

      // Banquet Ballroom & Wedding Hall
      case 'hotel_banquet_hall':
      case 'banquet':
      case 'events':
      case 'wedding':
        return (
          <div className="relative w-full h-full bg-[#1c1822] overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b30] via-[#1a1420] to-[#141218]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-1 bg-amber-400/80 rounded-full shadow-[0_0_20px_#f59e0b]"></div>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <span key={i} className="inline-block w-2.5 h-5 bg-amber-300/80 rounded-b shadow-[0_0_8px_#f59e0b]"></span>
                ))}
              </div>
            </div>

            <div className="relative z-10 my-auto text-center px-4">
              <div className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/40 rounded text-amber-300 text-xs font-semibold tracking-wider uppercase mb-2">
                The Grand Shaan Ballroom
              </div>
              <h4 className="text-lg md:text-xl font-serif text-white font-bold">
                Grand Weddings & Milestone Celebrations
              </h4>
              <p className="text-xs text-neutral-300 max-w-md mx-auto mt-1">
                Pillar-less air-conditioned hall accommodating 150 to 500 guests with elevated royal stage and premium sound.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-neutral-700/80 pt-3 text-center">
              <div className="bg-white/5 p-1.5 rounded border border-white/10">
                <p className="text-[10px] text-amber-300 font-bold">Weddings & Sangeet</p>
              </div>
              <div className="bg-white/5 p-1.5 rounded border border-white/10">
                <p className="text-[10px] text-amber-300 font-bold">Birthdays & Anniversaries</p>
              </div>
              <div className="bg-white/5 p-1.5 rounded border border-white/10">
                <p className="text-[10px] text-amber-300 font-bold">Corporate Conferences</p>
              </div>
            </div>
          </div>
        );

      // Deluxe Guest Room & Stay
      case 'hotel_deluxe_room':
      case 'rooms':
      case 'room':
      case 'deluxe-king':
        return (
          <div className="relative w-full h-full bg-[#1b1c20] overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#23252b] via-[#1a1b1f] to-[#121316]"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  Premium Accommodation
                </span>
                <h4 className="text-lg font-serif text-white font-semibold mt-1">Deluxe King Bedroom</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400">From</span>
                <p className="text-base font-bold text-white">₹2,499<span className="text-xs font-normal text-neutral-400">/night</span></p>
              </div>
            </div>

            <div className="relative z-10 my-auto flex flex-col items-center">
              <div className="w-3/4 h-16 bg-[#2d3038] border-t-2 border-x-2 border-amber-300/40 rounded-t-lg shadow-[0_0_25px_rgba(251,191,36,0.25)] flex items-center justify-around px-4">
                <div className="w-8 h-8 rounded-full bg-amber-400/30 border border-amber-300/50"></div>
                <div className="w-8 h-8 rounded-full bg-amber-400/30 border border-amber-300/50"></div>
              </div>
              <div className="w-5/6 h-12 bg-white rounded-t shadow-lg flex items-center justify-around px-6 border-b-4 border-red-600">
                <div className="w-12 h-5 bg-neutral-200 rounded-sm"></div>
                <div className="w-12 h-5 bg-neutral-200 rounded-sm"></div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-300 border-t border-neutral-700/80 pt-2">
              <span>Split AC • King Bed • High-Speed Wi-Fi</span>
              <span className="text-red-400 font-semibold">Enquire Availability →</span>
            </div>
          </div>
        );

      // Food & Authentic Tandoori Feast
      case 'hotel_tandoori_feast':
      case 'food':
      case 'tandoori-chicken':
      case 'butter-chicken':
        return (
          <div className="relative w-full h-full bg-[#1c1414] overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2f1414] via-[#1f1111] to-[#140e0e]"></div>

            <div className="relative z-10 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                Signature North Indian Flavours
              </span>
              <span className="text-xs text-amber-300 font-medium">Authentic Clay Tandoor</span>
            </div>

            <div className="relative z-10 my-auto grid grid-cols-3 gap-3 text-center">
              <div className="bg-black/50 border border-amber-500/30 rounded-xl p-3">
                <div className="text-3xl mb-1">🍗</div>
                <p className="text-xs font-bold text-white">Tandoori Murgh</p>
                <p className="text-[10px] text-neutral-400">Char-roasted</p>
              </div>
              <div className="bg-black/50 border border-red-500/40 rounded-xl p-3 transform -translate-y-1">
                <div className="text-3xl mb-1">🍲</div>
                <p className="text-xs font-bold text-amber-300">Butter Chicken</p>
                <p className="text-[10px] text-neutral-400">Cashew & Cream</p>
              </div>
              <div className="bg-black/50 border border-amber-500/30 rounded-xl p-3">
                <div className="text-3xl mb-1">🫓</div>
                <p className="text-xs font-bold text-white">Garlic Naan</p>
                <p className="text-[10px] text-neutral-400">Clay Baked</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-300 border-t border-neutral-700/80 pt-2">
              <span className="text-emerald-400 font-medium">Veg & Non-Veg Available</span>
              <span className="text-amber-400 font-semibold">Explore Full Menu →</span>
            </div>
          </div>
        );

      // Topchanchi surroundings & lake
      case 'surroundings':
      case 'location':
        return (
          <div className="relative w-full h-full bg-[#121c22] overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-gradient-to-b from-[#132832] via-[#0f1e26] to-[#0a141a]"></div>
            
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                Scenic Topchanchi
              </span>
              <h4 className="text-base font-serif text-white font-semibold mt-1">Topchanchi Lake & Parasnath Foot</h4>
            </div>

            <div className="relative z-10 my-auto text-center px-4">
              <p className="text-xs text-neutral-300 leading-relaxed">
                Nestled on GT Road (NH-19) near the tranquil waters of Topchanchi Lake and Parasnath wildlife sanctuary. A refreshing green stopover between Kolkata and Varanasi.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-700/80 pt-2">
              <span>NH-19 Highway Frontage</span>
              <span className="text-cyan-400 font-medium">32 km from Dhanbad Stn</span>
            </div>
          </div>
        );

      // Default architectural exterior illustration fallback
      default:
        return (
          <div className="relative w-full h-full bg-[#111214] overflow-hidden select-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c1220] via-[#1a1528] to-[#251b24]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-12 h-12 rounded-xl bg-[#D71920] border border-red-500 flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white font-bold text-base">SP</span>
              </div>
              <h4 className="text-sm font-semibold text-white">{title || 'Shaan-E-Punjab Hotel'}</h4>
              {subtitle && <p className="text-xs text-neutral-300 mt-1 max-w-xs">{subtitle}</p>}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden shadow-xl border border-neutral-800 ${getAspectClass()} ${
        onClick ? 'cursor-pointer transition-transform duration-200 hover:scale-[1.01]' : ''
      } ${className}`}
    >
      {renderFallback()}
      {(title || subtitle) && aspect !== 'hero' && (
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
          {title && <p className="text-xs font-semibold text-white truncate">{title}</p>}
          {subtitle && <p className="text-[10px] text-neutral-300 truncate">{subtitle}</p>}
        </div>
      )}
    </div>
  );
};
