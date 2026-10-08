import React, { useState } from 'react';
import { Region, Language } from '../types';
import { Plus, Minus, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import { useMapGestures } from '../utils/useMapGestures';

interface JapanInteractiveMapProps {
  regions: Region[];
  selectedRegion: Region | null;
  onSelectRegion: (region: Region) => void;
  filterMode?: 'all' | 'visited' | 'dream';
  lang: Language;
}

export const JapanInteractiveMap: React.FC<JapanInteractiveMapProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  filterMode = 'all',
  lang,
}) => {
  const { zoomLevel, setZoomLevel, pan, reset, gestures } = useMapGestures();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleRegionClick = (regionId: string) => {
    const reg = regions.find((r) => r.id === regionId);
    if (reg) onSelectRegion(reg);
  };

  const isRegionDimmed = (status: 'visited' | 'dream' | 'not_visited') => {
    if (filterMode === 'visited' && status !== 'visited') return true;
    if (filterMode === 'dream' && status !== 'dream') return true;
    return false;
  };

  // 8 Japanese Region Badges (Coordinates % on canvas) - Clean, tactile floating clickable pills
  const japanBadges = [
    {
      id: 'hokkaido',
      name: 'Hokkaido',
      nameJa: '北海道',
      emoji: '❄️',
      color: '#b692c2',
      top: '16%',
      left: '74%',
      memories: 0,
    },
    {
      id: 'tohoku',
      name: 'Tohoku',
      nameJa: '東北',
      emoji: '🌲',
      color: '#8ecae6',
      top: '32%',
      left: '72%',
      memories: 0,
    },
    {
      id: 'kanto',
      name: 'Kanto',
      nameJa: '関東',
      emoji: '🗼',
      color: '#70a9a1',
      top: '56%',
      left: '70%',
      memories: 18,
    },
    {
      id: 'chubu',
      name: 'Chubu',
      nameJa: '中部',
      emoji: '🗻',
      color: '#40798c',
      top: '43%',
      left: '53%',
      memories: 16,
    },
    {
      id: 'kansai',
      name: 'Kansai',
      nameJa: '近畿',
      emoji: '⛩️',
      color: '#f3c969',
      top: '67%',
      left: '52%',
      memories: 24,
    },
    {
      id: 'chugoku',
      name: 'Chugoku',
      nameJa: '中国',
      emoji: '🏯',
      color: '#f4a261',
      top: '52%',
      left: '34%',
      memories: 0,
    },
    {
      id: 'shikoku',
      name: 'Shikoku',
      nameJa: '四国',
      emoji: '🌊',
      color: '#e76f51',
      top: '72%',
      left: '42%',
      memories: 0,
    },
    {
      id: 'kyushu',
      name: 'Kyushu & Okinawa',
      nameJa: '九州・沖縄',
      emoji: '🌺',
      color: '#be543c',
      top: '78%',
      left: '24%',
      memories: 0,
    },
  ];

  return (
    <div {...gestures} style={{ touchAction: 'none' }} className="relative w-full h-[480px] rounded-3xl overflow-hidden bg-[#faf7f2] border border-[#ddc0ba]/60 shadow-[0_10px_28px_rgba(88,71,56,0.1)] select-none">
      {/* Texture background */}
      <div className="absolute inset-0 bg-[#fbf9f5] pointer-events-none" />

      {/* Zoomable Container */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out origin-center"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 600 520"
          className="w-full h-full relative z-10"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="jp3dShadow" x="-15%" y="-15%" width="135%" height="135%">
              <feDropShadow dx="2" dy="7" stdDeviation="5" floodColor="#382921" floodOpacity="0.22" />
            </filter>

            <filter id="jpHoverShadow" x="-15%" y="-15%" width="135%" height="135%">
              <feDropShadow dx="2" dy="11" stdDeviation="7" floodColor="#9e3c26" floodOpacity="0.35" />
            </filter>

            <filter id="jpActiveGlow" x="-20%" y="-20%" width="145%" height="145%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#9e3c26" floodOpacity="0.6" />
            </filter>

            {/* Watercolor Region Gradients */}
            <linearGradient id="hokkaidoCol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e4c1f9" />
              <stop offset="100%" stopColor="#b692c2" />
            </linearGradient>

            <linearGradient id="tohokuCol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bde0fe" />
              <stop offset="100%" stopColor="#8ecae6" />
            </linearGradient>

            <linearGradient id="kantoCol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#99d98c" />
              <stop offset="100%" stopColor="#70a9a1" />
            </linearGradient>

            <linearGradient id="chubuCol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#52b788" />
              <stop offset="100%" stopColor="#40798c" />
            </linearGradient>

            <linearGradient id="kansaiCol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe6a7" />
              <stop offset="100%" stopColor="#f3c969" />
            </linearGradient>

            <linearGradient id="chugokuCol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbc490" />
              <stop offset="100%" stopColor="#f4a261" />
            </linearGradient>

            <linearGradient id="shikokuCol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f29e8e" />
              <stop offset="100%" stopColor="#e76f51" />
            </linearGradient>

            <linearGradient id="kyushuCol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e28771" />
              <stop offset="100%" stopColor="#be543c" />
            </linearGradient>
          </defs>

          {/* Sea Vignette & Water Ripple Accents */}
          <path
            d="M 50 250 C 60 120, 180 50, 360 60 C 520 70, 560 160, 550 320 C 540 450, 420 500, 240 490 C 100 480, 40 380, 50 250 Z"
            fill="#dbebf2"
            opacity="0.45"
          />

          {/* Compass Rose in Top Left */}
          <g transform="translate(90, 75) scale(0.65)" opacity="0.85">
            <circle cx="30" cy="30" r="28" fill="none" stroke="#8a726c" strokeWidth="1" strokeDasharray="3 2" />
            <polygon points="30,5 34,26 30,22 26,26" fill="#9e3c26" />
            <polygon points="30,55 34,34 30,38 26,34" fill="#8a726c" />
            <polygon points="5,30 26,26 22,30 26,34" fill="#8a726c" />
            <polygon points="55,30 34,26 38,30 34,34" fill="#8a726c" />
            <circle cx="30" cy="30" r="3.5" fill="#fdf9f1" stroke="#8a726c" strokeWidth="1.5" />
          </g>

          {/* Cute Watercolor Illustration Accents (Mt. Fuji, Torii, Deer) */}
          {/* Mt Fuji in Chubu */}
          <g transform="translate(315, 235) scale(0.65)" opacity="0.95">
            <polygon points="25,5 5,40 45,40" fill="#40798c" stroke="#2c5360" strokeWidth="1.5" />
            <polygon points="25,5 17,20 22,23 25,18 29,23 33,20" fill="#ffffff" />
          </g>

          {/* Torii Gate in Kansai / Kyoto */}
          <g transform="translate(275, 285) scale(0.4)" opacity="0.9">
            <path d="M 5 8 L 45 8 M 2 14 L 48 14 M 14 14 L 14 45 M 36 14 L 36 45" stroke="#9e3c26" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Deer near Hokkaido/Tohoku */}
          <g transform="translate(425, 95) scale(0.4)" opacity="0.85">
            <ellipse cx="20" cy="22" rx="10" ry="6" fill="#be543c" />
            <circle cx="28" cy="14" r="5" fill="#be543c" />
            <path d="M 28 9 L 32 3 M 28 9 L 26 2" stroke="#be543c" strokeWidth="2" />
            <line x1="14" y1="26" x2="12" y2="38" stroke="#be543c" strokeWidth="2" />
            <line x1="24" y1="26" x2="26" y2="38" stroke="#be543c" strokeWidth="2" />
          </g>

          {/* Sailboat near Chugoku */}
          <g transform="translate(190, 200) scale(0.5)" opacity="0.75">
            <path d="M 5 20 L 35 20 L 30 28 L 10 28 Z" fill="#8a726c" />
            <path d="M 20 5 L 20 20 L 32 20 Z" fill="#ffffff" stroke="#8a726c" strokeWidth="1" />
          </g>

          {/* ============================================================== */}
          {/* 8 REGIONS OF JAPAN (Zero hardcoded text in SVG paths)          */}
          {/* ============================================================== */}

          {/* 1. HOKKAIDO */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('hokkaido')}
            onMouseEnter={() => setHoveredRegion('hokkaido')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'hokkaido'
                ? 'url(#jpActiveGlow)'
                : hoveredRegion === 'hokkaido'
                ? 'url(#jpHoverShadow)'
                : 'url(#jp3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'hokkaido')?.status || 'dream') ? 0.35 : 1}
          >
            <path
              d="M 390 120 
                 C 385 105, 410 80, 435 60
                 C 455 45, 475 60, 495 75
                 C 515 90, 530 85, 520 105
                 C 505 125, 470 125, 455 140
                 C 440 155, 415 145, 400 135 Z"
              fill="url(#hokkaidoCol)"
              stroke={hoveredRegion === 'hokkaido' || selectedRegion?.id === 'hokkaido' ? '#b692c2' : '#ffffff'}
              strokeWidth={hoveredRegion === 'hokkaido' || selectedRegion?.id === 'hokkaido' ? '3.5' : '2.5'}
            />
          </g>

          {/* 2. TOHOKU */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('tohoku')}
            onMouseEnter={() => setHoveredRegion('tohoku')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'tohoku'
                ? 'url(#jpActiveGlow)'
                : hoveredRegion === 'tohoku'
                ? 'url(#jpHoverShadow)'
                : 'url(#jp3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'tohoku')?.status || 'dream') ? 0.35 : 1}
          >
            <path
              d="M 405 155
                 C 415 145, 430 160, 435 185
                 C 438 210, 430 235, 425 255
                 C 410 250, 395 240, 385 220
                 C 380 200, 395 175, 405 155 Z"
              fill="url(#tohokuCol)"
              stroke={hoveredRegion === 'tohoku' || selectedRegion?.id === 'tohoku' ? '#8ecae6' : '#ffffff'}
              strokeWidth={hoveredRegion === 'tohoku' || selectedRegion?.id === 'tohoku' ? '3.5' : '2.5'}
            />
          </g>

          {/* 3. KANTO */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('kanto')}
            onMouseEnter={() => setHoveredRegion('kanto')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'kanto'
                ? 'url(#jpActiveGlow)'
                : hoveredRegion === 'kanto'
                ? 'url(#jpHoverShadow)'
                : 'url(#jp3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'kanto')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 380 270
                 C 395 255, 415 265, 410 290
                 C 405 315, 385 335, 365 330
                 C 355 315, 365 285, 380 270 Z"
              fill="url(#kantoCol)"
              stroke={hoveredRegion === 'kanto' || selectedRegion?.id === 'kanto' ? '#70a9a1' : '#ffffff'}
              strokeWidth={hoveredRegion === 'kanto' || selectedRegion?.id === 'kanto' ? '3.5' : '2.5'}
            />
            {/* Tokyo Star */}
            <polygon
              points="375,295 377,300 382,300 378,303 379,308 375,305 371,308 372,303 368,300 373,300"
              fill="#ffff00"
              stroke="#b8860b"
              strokeWidth="0.5"
            />
          </g>

          {/* 4. CHUBU */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('chubu')}
            onMouseEnter={() => setHoveredRegion('chubu')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'chubu'
                ? 'url(#jpActiveGlow)'
                : hoveredRegion === 'chubu'
                ? 'url(#jpHoverShadow)'
                : 'url(#jp3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'chubu')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 320 230
                 C 345 220, 370 235, 380 260
                 C 365 275, 350 300, 335 310
                 C 315 315, 305 290, 300 265
                 C 305 245, 315 235, 320 230 Z"
              fill="url(#chubuCol)"
              stroke={hoveredRegion === 'chubu' || selectedRegion?.id === 'chubu' ? '#40798c' : '#ffffff'}
              strokeWidth={hoveredRegion === 'chubu' || selectedRegion?.id === 'chubu' ? '3.5' : '2.5'}
            />
          </g>

          {/* 5. KANSAI */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('kansai')}
            onMouseEnter={() => setHoveredRegion('kansai')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'kansai'
                ? 'url(#jpActiveGlow)'
                : hoveredRegion === 'kansai'
                ? 'url(#jpHoverShadow)'
                : 'url(#jp3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'kansai')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 275 285
                 C 295 270, 310 280, 315 305
                 C 310 330, 290 355, 270 345
                 C 255 330, 260 300, 275 285 Z"
              fill="url(#kansaiCol)"
              stroke={hoveredRegion === 'kansai' || selectedRegion?.id === 'kansai' ? '#f3c969' : '#ffffff'}
              strokeWidth={hoveredRegion === 'kansai' || selectedRegion?.id === 'kansai' ? '3.5' : '2.5'}
            />
          </g>

          {/* 6. CHUGOKU */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('chugoku')}
            onMouseEnter={() => setHoveredRegion('chugoku')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'chugoku'
                ? 'url(#jpActiveGlow)'
                : hoveredRegion === 'chugoku'
                ? 'url(#jpHoverShadow)'
                : 'url(#jp3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'chugoku')?.status || 'dream') ? 0.35 : 1}
          >
            <path
              d="M 195 285
                 C 220 270, 255 275, 270 295
                 C 250 315, 220 325, 195 320
                 C 185 305, 185 295, 195 285 Z"
              fill="url(#chugokuCol)"
              stroke={hoveredRegion === 'chugoku' || selectedRegion?.id === 'chugoku' ? '#f4a261' : '#ffffff'}
              strokeWidth={hoveredRegion === 'chugoku' || selectedRegion?.id === 'chugoku' ? '3.5' : '2.5'}
            />
          </g>

          {/* 7. SHIKOKU */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('shikoku')}
            onMouseEnter={() => setHoveredRegion('shikoku')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'shikoku'
                ? 'url(#jpActiveGlow)'
                : hoveredRegion === 'shikoku'
                ? 'url(#jpHoverShadow)'
                : 'url(#jp3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'shikoku')?.status || 'dream') ? 0.35 : 1}
          >
            <path
              d="M 215 355
                 C 235 345, 260 350, 265 365
                 C 260 380, 235 390, 215 380
                 C 205 370, 205 360, 215 355 Z"
              fill="url(#shikokuCol)"
              stroke={hoveredRegion === 'shikoku' || selectedRegion?.id === 'shikoku' ? '#e76f51' : '#ffffff'}
              strokeWidth={hoveredRegion === 'shikoku' || selectedRegion?.id === 'shikoku' ? '3.5' : '2.5'}
            />
          </g>

          {/* 8. KYUSHU & OKINAWA */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('kyushu')}
            onMouseEnter={() => setHoveredRegion('kyushu')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'kyushu'
                ? 'url(#jpActiveGlow)'
                : hoveredRegion === 'kyushu'
                ? 'url(#jpHoverShadow)'
                : 'url(#jp3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'kyushu')?.status || 'dream') ? 0.35 : 1}
          >
            <path
              d="M 160 335
                 C 180 330, 195 345, 185 375
                 C 175 405, 160 425, 145 410
                 C 135 390, 145 360, 160 335 Z"
              fill="url(#kyushuCol)"
              stroke={hoveredRegion === 'kyushu' || selectedRegion?.id === 'kyushu' ? '#be543c' : '#ffffff'}
              strokeWidth={hoveredRegion === 'kyushu' || selectedRegion?.id === 'kyushu' ? '3.5' : '2.5'}
            />
            {/* Okinawa dots */}
            <circle cx="105" cy="445" r="4.5" fill="#be543c" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="95" cy="455" r="4" fill="#be543c" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </svg>

        {/* ============================================================== */}
        {/* INTERACTIVE FLOATING REGION BADGES (CLICKABLE TACTILE PILLS)   */}
        {/* ============================================================== */}
        {japanBadges.map((badge) => {
          const isSelected = selectedRegion?.id === badge.id;
          const isHovered = hoveredRegion === badge.id;
          const memoryCount = regions.find((region) => region.id === badge.id)?.memoryCount || 0;

          return (
            <div
              key={badge.id}
              role="button"
              tabIndex={0}
              aria-label={lang === 'VI' ? `Chọn vùng ${badge.name}` : `${badge.nameJa}を選択`}
              onClick={() => handleRegionClick(badge.id)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleRegionClick(badge.id); } }}
              onMouseEnter={() => setHoveredRegion(badge.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{ top: badge.top, left: badge.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group transition-all duration-200"
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#1c1c17] text-white border-[#9e3c26] shadow-[0_8px_20px_rgba(158,60,38,0.35)] ring-3 ring-[#ffdad2] scale-105'
                    : isHovered
                    ? 'bg-white text-[#1c1c17] border-[#9e3c26] shadow-[0_8px_22px_rgba(88,71,56,0.22)] -translate-y-0.5 scale-105'
                    : 'bg-white/95 backdrop-blur-md text-[#1c1c17] border-[#ddc0ba]/60 shadow-[0_4px_14px_rgba(88,71,56,0.12)] hover:bg-white'
                }`}
              >
                {/* Region Emoji & Vibrant Color Dot */}
                <span className="text-xs leading-none">{badge.emoji}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                  style={{ backgroundColor: badge.color }}
                />

                {/* Region Title - Latin when lang==='VI', Kanji/Katakana when lang==='JA' */}
                <span className="font-bold text-[11px] font-display whitespace-nowrap tracking-tight">
                  {lang === 'VI' ? badge.name : badge.nameJa}
                </span>

                {memoryCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono ml-0.5 ${
                      isSelected
                        ? 'bg-[#9e3c26] text-white'
                        : 'bg-[#f7f3eb] text-[#9e3c26]'
                    }`}
                  >
                    {memoryCount}
                  </span>
                )}

                {/* Click affordance indicator */}
                <ChevronRight className={`w-3 h-3 transition-transform ${isSelected ? 'text-[#ffdad2]' : 'text-[#8a726c] group-hover:translate-x-0.5 group-hover:text-[#9e3c26]'}`} />

                {/* Radar Ring when selected */}
                {isSelected && (
                  <span className="absolute -inset-1 rounded-full border-2 border-[#9e3c26] animate-ping pointer-events-none opacity-75" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Zoom & Reset Controls */}
      <div className="hidden sm:flex absolute right-3 bottom-3 z-30 flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-md border border-[#ddc0ba]/50">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.0))}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-[#57423d] hover:text-[#9e3c26] hover:bg-[#f7f3eb] active:scale-90 transition-all cursor-pointer"
          title={lang === 'VI' ? 'Phóng to bản đồ' : '地図を拡大'}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <div className="w-4 h-[1px] bg-[#ddc0ba]/40 mx-auto" />
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.9))}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-[#57423d] hover:text-[#9e3c26] hover:bg-[#f7f3eb] active:scale-90 transition-all cursor-pointer"
          title={lang === 'VI' ? 'Thu nhỏ bản đồ' : '地図を縮小'}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="w-4 h-[1px] bg-[#ddc0ba]/40 mx-auto" />
        <button
          type="button"
          onClick={reset}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-[#9e3c26] hover:bg-[#ffdad2]/50 active:scale-90 transition-all cursor-pointer"
          title={lang === 'VI' ? 'Đặt lại góc nhìn' : '表示をリセット'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Left Tag */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#9e3c26] font-bold text-[11px] font-display shadow-xs border border-[#ddc0ba]/40 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#d48344]" />
          <span>{lang === 'VI' ? '8 Vùng • 47 Tỉnh Thành Nhật Bản' : '日本8地方 • 47都道府県'}</span>
        </span>
      </div>
    </div>
  );
};
