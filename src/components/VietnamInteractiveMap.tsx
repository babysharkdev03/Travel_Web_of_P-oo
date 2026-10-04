import React, { useState } from 'react';
import { Region, Language } from '../types';
import { Plus, Minus, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';

interface VietnamInteractiveMapProps {
  regions: Region[];
  selectedRegion: Region | null;
  onSelectRegion: (region: Region) => void;
  filterMode?: 'all' | 'visited' | 'wishlist';
  lang: Language;
}

export const VietnamInteractiveMap: React.FC<VietnamInteractiveMapProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  filterMode = 'all',
  lang,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleRegionClick = (regionId: string) => {
    const reg = regions.find((r) => r.id === regionId);
    if (reg) onSelectRegion(reg);
  };

  const isRegionDimmed = (status: 'visited' | 'wishlist' | 'unvisited') => {
    if (filterMode === 'visited' && status !== 'visited') return true;
    if (filterMode === 'wishlist' && status !== 'wishlist') return true;
    return false;
  };

  // Region Badge Coordinates (% on map canvas) - Clean, clickable floating badges
  const regionBadges = [
    {
      id: 'trung-du-mien-nui-bac',
      number: '01',
      name: 'Trung Du & Miền Núi',
      nameJa: '北部山岳地方',
      emoji: '⛰️',
      color: '#84b32b',
      top: '12%',
      left: '28%',
      memories: 4,
    },
    {
      id: 'dong-bang-song-hong',
      number: '02',
      name: 'ĐB Sông Hồng',
      nameJa: '紅河デルタ',
      emoji: '🌾',
      color: '#9e3a24',
      top: '21%',
      left: '56%',
      memories: 21,
    },
    {
      id: 'bac-trung-bo',
      number: '03',
      name: 'Bắc Trung Bộ',
      nameJa: '北中部',
      emoji: '🏯',
      color: '#d48344',
      top: '37%',
      left: '40%',
      memories: 5,
    },
    {
      id: 'nam-trung-bo-tay-nguyen',
      number: '04',
      name: 'Nam Trung Bộ & Tây Nguyên',
      nameJa: '中南部沿岸・西原',
      emoji: '🌊',
      color: '#f4a261',
      top: '55%',
      left: '58%',
      memories: 22,
    },
    {
      id: 'dong-nam-bo',
      number: '05',
      name: 'Đông Nam Bộ',
      nameJa: '東南部',
      emoji: '🏙️',
      color: '#e76f51',
      top: '73%',
      left: '50%',
      memories: 10,
    },
    {
      id: 'dong-bang-song-cuu-long',
      number: '06',
      name: 'ĐB Sông Cửu Long',
      nameJa: 'メコンデルタ',
      emoji: '🚣',
      color: '#be543c',
      top: '85%',
      left: '32%',
      memories: 6,
    },
  ];

  return (
    <div className="relative w-full h-[480px] rounded-3xl overflow-hidden bg-[#faf7f2] border border-[#ddc0ba]/60 shadow-[0_10px_28px_rgba(88,71,56,0.1)] select-none">
      {/* Texture background & Vignette */}
      <div className="absolute inset-0 bg-[#fbf9f5] pointer-events-none" />

      {/* Zoomable Container */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* SVG Illustrated Vietnam Map Canvas (Zero hardcoded text, purely illustrated) */}
        <svg
          viewBox="0 0 520 560"
          className="w-full h-full relative z-10"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="vnWall3dShadow" x="-20%" y="-20%" width="145%" height="145%">
              <feDropShadow dx="3" dy="8" stdDeviation="5" floodColor="#2e221b" floodOpacity="0.22" />
            </filter>

            <filter id="vnHoverShadow" x="-20%" y="-20%" width="145%" height="145%">
              <feDropShadow dx="2" dy="12" stdDeviation="7" floodColor="#9e3c26" floodOpacity="0.35" />
            </filter>

            <filter id="vnGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#9e3c26" floodOpacity="0.6" />
            </filter>

            {/* Watercolor Pastel Region Colors */}
            <linearGradient id="colTrungDu" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a8d5ba" />
              <stop offset="100%" stopColor="#84b32b" />
            </linearGradient>

            <linearGradient id="colSongHong" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb4a3" />
              <stop offset="100%" stopColor="#9e3a24" />
            </linearGradient>

            <linearGradient id="colBacTrungBo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f7d070" />
              <stop offset="100%" stopColor="#d48344" />
            </linearGradient>

            <linearGradient id="colNamTrungBoTayNguyen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbc490" />
              <stop offset="100%" stopColor="#f4a261" />
            </linearGradient>

            <linearGradient id="colDongNamBo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f29e8e" />
              <stop offset="100%" stopColor="#e76f51" />
            </linearGradient>

            <linearGradient id="colSongCuuLong" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e28771" />
              <stop offset="100%" stopColor="#be543c" />
            </linearGradient>
          </defs>

          {/* Sea ripples and marine accents */}
          <g opacity="0.35">
            <path d="M 330 180 Q 345 176 360 180" stroke="#7aaac4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 380 240 Q 395 236 410 240" stroke="#7aaac4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 340 320 Q 355 316 370 320" stroke="#7aaac4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 360 420 Q 375 416 390 420" stroke="#7aaac4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>

          {/* Cute Watercolor Sailboats */}
          <g transform="translate(320, 140) scale(0.65)" opacity="0.85">
            <path d="M 10 30 L 50 30 L 42 42 L 18 42 Z" fill="#c47a50" stroke="#8d4a27" strokeWidth="1.5" />
            <path d="M 28 8 L 28 30 L 45 30 Z" fill="#ffe2b8" stroke="#8d4a27" strokeWidth="1.2" />
            <path d="M 26 12 L 26 30 L 12 30 Z" fill="#a5d2a2" stroke="#8d4a27" strokeWidth="1.2" />
          </g>

          <g transform="translate(340, 250) scale(0.55)" opacity="0.85">
            <path d="M 10 30 L 50 30 L 42 42 L 18 42 Z" fill="#c47a50" stroke="#8d4a27" strokeWidth="1.5" />
            <path d="M 28 8 L 28 30 L 45 30 Z" fill="#ffe2b8" stroke="#8d4a27" strokeWidth="1.2" />
            <path d="M 26 12 L 26 30 L 12 30 Z" fill="#ffb4a3" stroke="#8d4a27" strokeWidth="1.2" />
          </g>

          {/* Neighboring Country Outlines (Soft dashed line) */}
          <path
            d="M 110 50 L 142 88 L 160 120 L 195 158 L 206 170 L 222 200 L 236 235 L 250 255 L 260 280 L 255 305 L 245 330 L 225 360 L 205 390 L 180 410 L 170 440 L 190 470"
            fill="none"
            stroke="#e2dacd"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* ============================================================== */}
          {/* S-SHAPED 6 REGIONS OF VIETNAM (Zero text inside paths)          */}
          {/* ============================================================== */}

          {/* 1. TRUNG DU VÀ MIỀN NÚI PHÍA BẮC */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('trung-du-mien-nui-bac')}
            onMouseEnter={() => setHoveredRegion('trung-du-mien-nui-bac')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'trung-du-mien-nui-bac'
                ? 'url(#vnGlow)'
                : hoveredRegion === 'trung-du-mien-nui-bac'
                ? 'url(#vnHoverShadow)'
                : 'url(#vnWall3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'trung-du-mien-nui-bac')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 180 40 
                 C 152 48, 134 68, 142 88
                 C 148 102, 160 120, 178 126
                 C 202 128, 214 116, 218 102
                 C 228 108, 248 100, 268 90
                 C 280 80, 265 60, 240 45
                 C 215 32, 195 35, 180 40 Z"
              fill="url(#colTrungDu)"
              stroke={hoveredRegion === 'trung-du-mien-nui-bac' || selectedRegion?.id === 'trung-du-mien-nui-bac' ? '#84b32b' : '#ffffff'}
              strokeWidth={hoveredRegion === 'trung-du-mien-nui-bac' || selectedRegion?.id === 'trung-du-mien-nui-bac' ? '3.5' : '2.5'}
            />
          </g>

          {/* 2. ĐỒNG BẰNG SÔNG HỒNG */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('dong-bang-song-hong')}
            onMouseEnter={() => setHoveredRegion('dong-bang-song-hong')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'dong-bang-song-hong'
                ? 'url(#vnGlow)'
                : hoveredRegion === 'dong-bang-song-hong'
                ? 'url(#vnHoverShadow)'
                : 'url(#vnWall3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'dong-bang-song-hong')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 218 102
                 C 228 92, 245 96, 262 108
                 C 265 125, 252 142, 238 146
                 C 222 144, 215 132, 212 120 Z"
              fill="url(#colSongHong)"
              stroke={hoveredRegion === 'dong-bang-song-hong' || selectedRegion?.id === 'dong-bang-song-hong' ? '#9e3a24' : '#ffffff'}
              strokeWidth={hoveredRegion === 'dong-bang-song-hong' || selectedRegion?.id === 'dong-bang-song-hong' ? '3.5' : '2.5'}
            />
            {/* National Yellow Star at Hanoi */}
            <polygon
              points="236,118 238,123 243,123 239,126 240,131 236,128 232,131 233,126 229,123 234,123"
              fill="#ffff00"
              stroke="#b8860b"
              strokeWidth="0.5"
            />
          </g>

          {/* 3. BẮC TRUNG BỘ */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('bac-trung-bo')}
            onMouseEnter={() => setHoveredRegion('bac-trung-bo')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'bac-trung-bo'
                ? 'url(#vnGlow)'
                : hoveredRegion === 'bac-trung-bo'
                ? 'url(#vnHoverShadow)'
                : 'url(#vnWall3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'bac-trung-bo')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 212 120
                 C 200 135, 188 145, 195 158
                 C 206 170, 222 200, 236 235
                 C 250 255, 264 268, 278 275
                 C 275 264, 262 242, 248 220
                 C 236 195, 225 165, 232 142
                 C 234 134, 222 124, 212 120 Z"
              fill="url(#colBacTrungBo)"
              stroke={hoveredRegion === 'bac-trung-bo' || selectedRegion?.id === 'bac-trung-bo' ? '#d48344' : '#ffffff'}
              strokeWidth={hoveredRegion === 'bac-trung-bo' || selectedRegion?.id === 'bac-trung-bo' ? '3.5' : '2.5'}
            />
          </g>

          {/* 4. DUYÊN HẢI NAM TRUNG BỘ VÀ TÂY NGUYÊN */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('nam-trung-bo-tay-nguyen')}
            onMouseEnter={() => setHoveredRegion('nam-trung-bo-tay-nguyen')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'nam-trung-bo-tay-nguyen'
                ? 'url(#vnGlow)'
                : hoveredRegion === 'nam-trung-bo-tay-nguyen'
                ? 'url(#vnHoverShadow)'
                : 'url(#vnWall3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'nam-trung-bo-tay-nguyen')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 278 275
                 C 260 280, 255 305, 260 335
                 C 264 365, 272 395, 288 415
                 C 304 402, 312 375, 308 345
                 C 316 325, 305 295, 290 282
                 C 284 278, 280 276, 278 275 Z"
              fill="url(#colNamTrungBoTayNguyen)"
              stroke={hoveredRegion === 'nam-trung-bo-tay-nguyen' || selectedRegion?.id === 'nam-trung-bo-tay-nguyen' ? '#f4a261' : '#ffffff'}
              strokeWidth={hoveredRegion === 'nam-trung-bo-tay-nguyen' || selectedRegion?.id === 'nam-trung-bo-tay-nguyen' ? '3.5' : '2.5'}
            />
          </g>

          {/* 5. ĐÔNG NAM BỘ */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('dong-nam-bo')}
            onMouseEnter={() => setHoveredRegion('dong-nam-bo')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'dong-nam-bo'
                ? 'url(#vnGlow)'
                : hoveredRegion === 'dong-nam-bo'
                ? 'url(#vnHoverShadow)'
                : 'url(#vnWall3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'dong-nam-bo')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 288 415
                 C 272 405, 258 412, 248 424
                 C 242 432, 246 445, 256 450
                 C 272 458, 285 452, 296 440
                 C 300 432, 294 420, 288 415 Z"
              fill="url(#colDongNamBo)"
              stroke={hoveredRegion === 'dong-nam-bo' || selectedRegion?.id === 'dong-nam-bo' ? '#e76f51' : '#ffffff'}
              strokeWidth={hoveredRegion === 'dong-nam-bo' || selectedRegion?.id === 'dong-nam-bo' ? '3.5' : '2.5'}
            />
          </g>

          {/* 6. ĐỒNG BẰNG SÔNG CỬU LONG */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleRegionClick('dong-bang-song-cuu-long')}
            onMouseEnter={() => setHoveredRegion('dong-bang-song-cuu-long')}
            onMouseLeave={() => setHoveredRegion(null)}
            filter={
              selectedRegion?.id === 'dong-bang-song-cuu-long'
                ? 'url(#vnGlow)'
                : hoveredRegion === 'dong-bang-song-cuu-long'
                ? 'url(#vnHoverShadow)'
                : 'url(#vnWall3dShadow)'
            }
            opacity={isRegionDimmed(regions.find((r) => r.id === 'dong-bang-song-cuu-long')?.status || 'visited') ? 0.35 : 1}
          >
            <path
              d="M 248 424
                 C 234 430, 224 445, 222 465
                 C 220 488, 228 515, 238 528
                 C 246 515, 256 498, 268 480
                 C 275 465, 266 452, 256 450
                 C 246 445, 242 432, 248 424 Z"
              fill="url(#colSongCuuLong)"
              stroke={hoveredRegion === 'dong-bang-song-cuu-long' || selectedRegion?.id === 'dong-bang-song-cuu-long' ? '#be543c' : '#ffffff'}
              strokeWidth={hoveredRegion === 'dong-bang-song-cuu-long' || selectedRegion?.id === 'dong-bang-song-cuu-long' ? '3.5' : '2.5'}
            />
          </g>

          {/* ARCHIPELAGOS: HOÀNG SA, TRƯỜNG SA & PHÚ QUỐC (Pure illustrated islands, no text) */}
          <g
            className="cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => handleRegionClick('nam-trung-bo-tay-nguyen')}
            filter="url(#vnWall3dShadow)"
          >
            {/* Paracel / Hoàng Sa */}
            <circle cx="395" cy="225" r="5" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="408" cy="235" r="4" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="390" cy="240" r="4.2" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="415" cy="228" r="3.5" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />

            {/* Spratly / Trường Sa */}
            <circle cx="410" cy="410" r="4.5" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="425" cy="425" r="4" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="400" cy="435" r="5" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="435" cy="445" r="4" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="415" cy="455" r="3.5" fill="#f4a261" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Đảo Phú Quốc */}
          <g
            className="cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => handleRegionClick('dong-bang-song-cuu-long')}
            filter="url(#vnWall3dShadow)"
          >
            <ellipse cx="202" cy="482" rx="7.5" ry="13" fill="#be543c" stroke="#ffffff" strokeWidth="1.5" transform="rotate(-20, 202, 482)" />
          </g>
        </svg>

        {/* ============================================================== */}
        {/* INTERACTIVE FLOATING REGION BADGES (CLICKABLE TACTILE PILLS)   */}
        {/* ============================================================== */}
        {regionBadges.map((badge) => {
          const isSelected = selectedRegion?.id === badge.id;
          const isHovered = hoveredRegion === badge.id;

          return (
            <div
              key={badge.id}
              onClick={() => handleRegionClick(badge.id)}
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

                {/* Region Title - Vietnamese Latin when lang==='VI', Japanese when lang==='JA' */}
                <span className="font-bold text-[11px] font-display whitespace-nowrap tracking-tight">
                  {lang === 'VI' ? badge.name : badge.nameJa}
                </span>

                {/* Memory Counter Bubble */}
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono ml-0.5 ${
                    isSelected
                      ? 'bg-[#9e3c26] text-white'
                      : 'bg-[#f7f3eb] text-[#9e3c26]'
                  }`}
                >
                  {badge.memories}
                </span>

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

      {/* Floating Zoom & Compass Controls */}
      <div className="absolute right-3 bottom-3 z-30 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-md border border-[#ddc0ba]/50">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.0))}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-[#57423d] hover:text-[#9e3c26] hover:bg-[#f7f3eb] active:scale-90 transition-all cursor-pointer"
          title="Phóng to bản đồ"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <div className="w-4 h-[1px] bg-[#ddc0ba]/40 mx-auto" />
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.9))}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-[#57423d] hover:text-[#9e3c26] hover:bg-[#f7f3eb] active:scale-90 transition-all cursor-pointer"
          title="Thu nhỏ bản đồ"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="w-4 h-[1px] bg-[#ddc0ba]/40 mx-auto" />
        <button
          type="button"
          onClick={() => setZoomLevel(1)}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-[#9e3c26] hover:bg-[#ffdad2]/50 active:scale-90 transition-all cursor-pointer"
          title="Đặt lại góc nhìn"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Left Tag */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#9e3c26] font-bold text-[11px] font-display shadow-xs border border-[#ddc0ba]/40 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#d48344]" />
          <span>{lang === 'VI' ? 'Bản Đồ 6 Vùng • 63 Tỉnh Thành' : 'ベトナム6地域 • 63省市'}</span>
        </span>
      </div>
    </div>
  );
};
