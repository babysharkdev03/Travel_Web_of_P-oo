import React from 'react';
import { ScreenType, Language } from '../types';
import { getT } from '../utils/translations';
import { Map, Compass, MapPin, BookOpen } from 'lucide-react';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, lang }) => {
  const t = getT(lang);

  const navItems = [
    {
      id: 'world-map' as ScreenType,
      label: t.navMap,
      icon: Map,
    },
    {
      id: 'japan-map' as ScreenType,
      label: t.navKingdom,
      icon: Compass,
    },
    {
      id: 'places' as ScreenType,
      label: t.navPlaces,
      icon: MapPin,
    },
    {
      id: 'memories' as ScreenType,
      label: t.navMemories,
      icon: BookOpen,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe px-4 pointer-events-none mb-3">
      <nav className="pointer-events-auto mx-auto max-w-[390px] h-16 bg-white/95 backdrop-blur-xl rounded-full shadow-[0_8px_24px_rgba(88,71,56,0.14)] p-1.5 flex items-center justify-between gap-1 border border-[#ddc0ba]/40">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex-1 h-full rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#9e3c26] text-white shadow-[0_3px_10px_rgba(158,60,38,0.3)] font-bold'
                  : 'text-[#57423d] hover:text-[#1c1c17] hover:bg-[#f7f3eb]/60'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-display tracking-tight leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
