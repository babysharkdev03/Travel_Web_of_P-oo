import React, { useState } from 'react';
import { CountryId, Language } from '../types';
import { getT } from '../utils/translations';
import { Compass, Plus, Minus, RotateCcw } from 'lucide-react';

interface WorldMapCanvasProps {
  selectedCountry: CountryId;
  onSelectCountry: (country: CountryId) => void;
  lang: Language;
}

export const WorldMapCanvas: React.FC<WorldMapCanvasProps> = ({
  selectedCountry,
  onSelectCountry,
  lang,
}) => {
  const t = getT(lang);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1.0));
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(88,71,56,0.12)] bg-[#ece8e0] border border-[#ddc0ba]/40">
      {/* Zoomable Container */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: '78% 48%',
        }}
      >
        {/* World Map Background Image */}
        <img
          src="https://lh3.googleusercontent.com/aida/AEtjO1V-O1Puj2tKLj1_WgagZKVeO1k6cX7bl-H7epm2gW9qY1W0Xi-i-oi1V87PZXWTwjBFt2ageglZYMVBVQbOMSmBT6v05SzCMxIJcXOtOEe66YzfdMnvBDZE8rEKTQxGYRV_cso6AnX68vGzHrfAU5LQSpT5x9unYv94sw_8FvdBGZiYNnvUMg0pMfQytkLPoMS_gB-zHHaWXpID_pI87zL-Ln5Ir0XdXKn7LCTttjVFznxk2A5OXyP2v9bN"
          alt="Bản đồ thế giới minh họa ký ức"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        />

        {/* Subtle Warm Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdf9f1]/20 via-transparent to-[#dddad2]/40 pointer-events-none" />

        {/* Maritime Voyaging Dotted Path connecting Vietnam to Japan */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          fill="none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 76 57 Q 81 48 84 40"
            stroke="#9e3c26"
            strokeWidth="1.2"
            strokeDasharray="2 2.5"
            opacity="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* PIN 1: VIỆT NAM (~76% left, ~57% top) */}
        <div
          className={`absolute left-[76%] top-[57%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 ${
            selectedCountry === 'VN' ? 'scale-110 z-30' : 'hover:scale-105'
          }`}
          onClick={() => onSelectCountry('VN')}
        >
          {/* Ripple Pulse Effect */}
          <div className="absolute -inset-2.5 rounded-full bg-[#da251d]/25 animate-ping pointer-events-none" />
          <div className="absolute -inset-1 rounded-full bg-[#da251d]/30 pointer-events-none" />

          {/* Vietnam Flag Round Button */}
          <button
            type="button"
            aria-label="Chọn Việt Nam"
            className={`relative w-9 h-9 rounded-full bg-[#da251d] text-white flex items-center justify-center shadow-[0_3px_8px_rgba(218,37,29,0.5)] border-2 ${
              selectedCountry === 'VN' ? 'border-[#ff0] ring-3 ring-[#da251d]/40' : 'border-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#ff0] flex-shrink-0">
              <path d="M12 2.5l2.8 6.4 6.9.6-5.2 4.6 1.6 6.8L12 17.2 5.9 20.9l1.6-6.8L2.3 9.5l6.9-.6z" />
            </svg>
          </button>

          {/* Vietnam Tooltip Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 top-10 whitespace-nowrap z-30 pointer-events-none">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md shadow-md border transition-all ${
                selectedCountry === 'VN'
                  ? 'bg-white/95 border-[#9e3c26] ring-1 ring-[#9e3c26]/20'
                  : 'bg-white/90 border-[#ddc0ba]/60'
              }`}
            >
              <span className="font-display text-[11px] leading-tight text-[#9e3c26] font-bold">
                {t.vietnamPin}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d653e]" />
            </div>
          </div>
        </div>

        {/* PIN 2: NHẬT BẢN (~84% left, ~40% top) */}
        <div
          className={`absolute left-[84%] top-[40%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 ${
            selectedCountry === 'JP' ? 'scale-110 z-30' : 'hover:scale-105'
          }`}
          onClick={() => onSelectCountry('JP')}
        >
          {/* Ripple Pulse Effect */}
          <div className="absolute -inset-2.5 rounded-full bg-[#1d6774]/25 animate-ping pointer-events-none" />
          <div className="absolute -inset-1 rounded-full bg-[#1d6774]/30 pointer-events-none" />

          {/* Japan Flag Round Button */}
          <button
            type="button"
            aria-label="Chọn Nhật Bản"
            className={`relative w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_3px_8px_rgba(29,103,116,0.4)] border-2 ${
              selectedCountry === 'JP' ? 'border-[#bc002d] ring-3 ring-[#1d6774]/40' : 'border-white'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#bc002d] shadow-inner flex-shrink-0" />
          </button>

          {/* Japan Tooltip Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 top-10 whitespace-nowrap z-30 pointer-events-none">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md shadow-md border transition-all ${
                selectedCountry === 'JP'
                  ? 'bg-white/95 border-[#1d6774] ring-1 ring-[#1d6774]/20'
                  : 'bg-white/90 border-[#ddc0ba]/60'
              }`}
            >
              <span className="font-display text-[11px] leading-tight text-[#1d6774] font-bold">
                {t.japanPin}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e3c26]" />
            </div>
          </div>
        </div>
      </div>

      {/* Vintage Compass Rose (Top Left Corner) */}
      <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center shadow-sm pointer-events-none z-20 border border-[#ddc0ba]/50">
        <Compass className="w-5 h-5 text-[#9e3c26] rotate-45" />
      </div>

      {/* Map Controller Floating Pill (Zoom / Recenter) */}
      <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#ddc0ba]/50">
        <button
          type="button"
          aria-label="Phóng to"
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#1c1c17] hover:bg-[#f1ede6] active:scale-90 transition-transform"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Thu nhỏ"
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#1c1c17] hover:bg-[#f1ede6] active:scale-90 transition-transform"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Đặt lại góc nhìn"
          onClick={handleRecenter}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#1c1c17] hover:bg-[#f1ede6] active:scale-90 transition-transform"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
