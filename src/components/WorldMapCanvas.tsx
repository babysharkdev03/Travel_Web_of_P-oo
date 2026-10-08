import React from 'react';
import { CountryId, Language } from '../types';
import { Compass, Plus, Minus, RotateCcw } from 'lucide-react';
import worldMap from '../assets/world-map.svg';
import { useMapGestures } from '../utils/useMapGestures';

interface WorldMapCanvasProps {
  selectedCountry: CountryId;
  onSelectCountry: (country: CountryId) => void;
  counts: Record<CountryId, number>;
  lang: Language;
}

export const WorldMapCanvas: React.FC<WorldMapCanvasProps> = ({
  selectedCountry,
  onSelectCountry,
  counts,
  lang,
}) => {
  const { zoomLevel, setZoomLevel, pan, reset, gestures } = useMapGestures();

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1.0));
  };

  return (
    <div {...gestures} style={{ touchAction: 'none' }} className="relative w-full h-[380px] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(88,71,56,0.12)] bg-[#ece8e0] border border-[#ddc0ba]/40">
      {/* Zoomable Container */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
          transformOrigin: '78% 48%',
        }}
      >
        {/* World Map Background Image */}
        <img
          src={worldMap}
          alt={lang === 'VI' ? 'Bản đồ thế giới minh họa ký ức' : '旅の記憶を示す世界地図'}
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
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
            d="M 79 42 Q 83 35 88 30"
            stroke="#9e3c26"
            strokeWidth="1.2"
            strokeDasharray="2 2.5"
            opacity="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* PIN 1: VIỆT NAM */}
        <div
          className={`absolute left-[79%] top-[42%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 ${
            selectedCountry === 'VN' ? 'scale-110 z-30' : 'hover:scale-105'
          }`}
        >
          {/* Ripple Pulse Effect */}
          <div className="absolute -inset-2.5 rounded-full bg-[#da251d]/25 animate-ping pointer-events-none" />
          <div className="absolute -inset-1 rounded-full bg-[#da251d]/30 pointer-events-none" />

          {/* Vietnam Flag Round Button */}
          <button
            type="button"
            aria-label={lang === 'VI' ? 'Chọn Việt Nam' : 'ベトナムを選択'}
            onClick={() => onSelectCountry('VN')}
            className={`relative w-9 h-9 rounded-full bg-[#da251d] text-white flex items-center justify-center shadow-[0_3px_8px_rgba(218,37,29,0.5)] border-2 ${
              selectedCountry === 'VN' ? 'border-[#ff0] ring-3 ring-[#da251d]/40' : 'border-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#ff0] flex-shrink-0">
              <path d="M12 2.5l2.8 6.4 6.9.6-5.2 4.6 1.6 6.8L12 17.2 5.9 20.9l1.6-6.8L2.3 9.5l6.9-.6z" />
            </svg>
          </button>

          {/* Vietnam Tooltip Badge */}
          <div className="absolute right-0 top-10 whitespace-nowrap z-30 pointer-events-none">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md shadow-md border transition-all ${
                selectedCountry === 'VN'
                  ? 'bg-white/95 border-[#9e3c26] ring-1 ring-[#9e3c26]/20'
                  : 'bg-white/90 border-[#ddc0ba]/60'
              }`}
            >
              <span className="font-display text-[11px] leading-tight text-[#9e3c26] font-bold">
                {lang === 'VI' ? `VN • Việt Nam (${counts.VN} ký ức)` : `VN • ベトナム (${counts.VN}件)`}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d653e]" />
            </div>
          </div>
        </div>

        {/* PIN 2: NHẬT BẢN */}
        <div
          className={`absolute left-[88%] top-[30%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 ${
            selectedCountry === 'JP' ? 'scale-110 z-30' : 'hover:scale-105'
          }`}
        >
          {/* Ripple Pulse Effect */}
          <div className="absolute -inset-2.5 rounded-full bg-[#1d6774]/25 animate-ping pointer-events-none" />
          <div className="absolute -inset-1 rounded-full bg-[#1d6774]/30 pointer-events-none" />

          {/* Japan Flag Round Button */}
          <button
            type="button"
            aria-label={lang === 'VI' ? 'Chọn Nhật Bản' : '日本を選択'}
            onClick={() => onSelectCountry('JP')}
            className={`relative w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_3px_8px_rgba(29,103,116,0.4)] border-2 ${
              selectedCountry === 'JP' ? 'border-[#bc002d] ring-3 ring-[#1d6774]/40' : 'border-white'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#bc002d] shadow-inner flex-shrink-0" />
          </button>

          {/* Japan Tooltip Badge */}
          <div className="absolute right-0 bottom-10 whitespace-nowrap z-30 pointer-events-none">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md shadow-md border transition-all ${
                selectedCountry === 'JP'
                  ? 'bg-white/95 border-[#1d6774] ring-1 ring-[#1d6774]/20'
                  : 'bg-white/90 border-[#ddc0ba]/60'
              }`}
            >
              <span className="font-display text-[11px] leading-tight text-[#1d6774] font-bold">
                {lang === 'VI' ? `JP • Nhật Bản (${counts.JP} ký ức)` : `JP • 日本 (${counts.JP}件)`}
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
      <div className="hidden sm:flex absolute bottom-3 left-3 z-30 items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#ddc0ba]/50">
        <button
          type="button"
          aria-label={lang === 'VI' ? 'Phóng to' : '拡大'}
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#1c1c17] hover:bg-[#f1ede6] active:scale-90 transition-transform"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label={lang === 'VI' ? 'Thu nhỏ' : '縮小'}
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#1c1c17] hover:bg-[#f1ede6] active:scale-90 transition-transform"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label={lang === 'VI' ? 'Đặt lại góc nhìn' : '表示をリセット'}
          onClick={reset}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#1c1c17] hover:bg-[#f1ede6] active:scale-90 transition-transform"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
