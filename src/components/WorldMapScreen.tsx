import React, { useState } from 'react';
import { CountryId, Language, Memory, ScreenType } from '../types';
import { getT } from '../utils/translations';
import { WorldMapCanvas } from './WorldMapCanvas';
import { BookOpen, Sparkles, Compass, ArrowRight } from 'lucide-react';

interface WorldMapScreenProps {
  selectedCountry: CountryId;
  onSelectCountry: (country: CountryId) => void;
  onNavigateToRegionMap: (country: CountryId) => void;
  onSelectMemory: (memory: Memory) => void;
  memories: Memory[];
  lang: Language;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  selectedCountry,
  onSelectCountry,
  onNavigateToRegionMap,
  onSelectMemory,
  memories,
  lang,
}) => {
  const t = getT(lang);

  // Latest memory article (Bài viết gần nhất tác giả đăng)
  const latestMemory = memories.length > 0 ? memories[0] : null;

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* 1. Explorer Passport Folio Card (Top HUD Widget) */}
      <div className="px-4 pb-3">
        <div className="p-4 rounded-2xl bg-white shadow-[0_4px_16px_rgba(88,71,56,0.06)] border border-[#ddc0ba]/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#ffdad2] flex items-center justify-center flex-shrink-0 text-[#9e3c26]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="font-bold text-[18px] text-[#1c1c17] truncate leading-tight font-display">
                  {t.passportTitle}
                </h2>
                <p className="text-[12px] text-[#57423d] truncate font-body">
                  {t.passportSubtitle}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#f7f3eb] text-[#9e3c26] text-[11px] font-bold flex-shrink-0 font-display border border-[#ddc0ba]/30">
              {t.countriesCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive 2D World Fantasy Map Canvas */}
      <div className="px-4">
        <WorldMapCanvas
          selectedCountry={selectedCountry}
          onSelectCountry={onSelectCountry}
          lang={lang}
        />
      </div>

      {/* 3. Dynamic Active Country Drawer Card */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center gap-1.5 text-[11px] text-[#8a726c] font-display px-1 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9e3c26] animate-pulse" />
          <span>
            {lang === 'VI'
              ? 'Chạm vào biểu tượng cờ nhấp nháy trên bản đồ để đổi giữa Nhật Bản và Việt Nam'
              : '地図上で点滅する国旗アイコンをタップして国を切り替え'}
          </span>
        </div>
        {selectedCountry === 'JP' ? (
          /* JAPAN CARD */
          <div className="p-4 rounded-2xl bg-white shadow-[0_4px_16px_rgba(88,71,56,0.06)] relative overflow-hidden border border-[#ddc0ba]/40 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-white border border-[#ddc0ba]/50 flex items-center justify-center shadow-xs flex-shrink-0 relative overflow-hidden">
                <div className="w-5 h-5 rounded-full bg-[#bc002d] shadow-inner" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[18px] text-[#1c1c17] truncate font-display">
                    {t.japan}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#1d6774]/10 text-[#1d6774] text-[11px] font-bold font-display">
                    JP
                  </span>
                </div>
                <p className="text-[12px] text-[#57423d] truncate font-body">
                  {t.japanMemoriesCount}
                </p>
              </div>
            </div>

            <div className="mt-2.5 p-2 rounded-xl bg-[#f7f3eb] flex items-center justify-between gap-2 border border-[#ddc0ba]/30">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="w-4 h-4 text-[#1d6774] flex-shrink-0" />
                <p className="text-[12px] text-[#57423d] truncate font-body">
                  {t.latestMemoryJp}
                </p>
              </div>
              <span className="text-[11px] text-[#1d6774] flex-shrink-0 font-bold font-display whitespace-nowrap">
                {t.timeAgo2Days}
              </span>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => onNavigateToRegionMap('JP')}
                className="w-full h-11 px-6 rounded-full bg-[#9e3c26] text-white font-bold text-[14px] shadow-md hover:bg-[#822714] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{t.journeyFootsteps}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* VIETNAM CARD */
          <div className="p-4 rounded-2xl bg-white shadow-[0_4px_16px_rgba(88,71,56,0.06)] relative overflow-hidden border border-[#ddc0ba]/40 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-[#da251d] flex items-center justify-center shadow-xs flex-shrink-0 relative overflow-hidden border border-[#da251d]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#ff0]">
                  <path d="M12 2.5l2.8 6.4 6.9.6-5.2 4.6 1.6 6.8L12 17.2 5.9 20.9l1.6-6.8L2.3 9.5l6.9-.6z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[18px] text-[#1c1c17] truncate font-display">
                    {t.vietnam}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#9e3c26]/10 text-[#9e3c26] text-[11px] font-bold font-display">
                    VN
                  </span>
                </div>
                <p className="text-[12px] text-[#57423d] truncate font-body">
                  {t.vietnamMemoriesCount}
                </p>
              </div>
            </div>

            <div className="mt-2.5 p-2 rounded-xl bg-[#f7f3eb] flex items-center justify-between gap-2 border border-[#ddc0ba]/30">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="w-4 h-4 text-[#9e3c26] flex-shrink-0" />
                <p className="text-[12px] text-[#57423d] truncate font-body">
                  {t.latestMemoryVn}
                </p>
              </div>
              <span className="text-[11px] text-[#9e3c26] flex-shrink-0 font-bold font-display whitespace-nowrap">
                {t.timeAgo5Days}
              </span>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => onNavigateToRegionMap('VN')}
                className="w-full h-11 px-6 rounded-full bg-[#9e3c26] text-white font-bold text-[14px] shadow-md hover:bg-[#822714] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{t.journeyFootsteps}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. KÝ ỨC VỪA GHI DẤU (Bài viết gần nhất vừa đăng) */}
      {latestMemory && (
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9e3c26]" />
              <span className="font-bold text-[17px] text-[#1c1c17] font-display">
                {lang === 'VI' ? 'Ký Ức Vừa Ghi Dấu' : '最近の記憶'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8a726c]">
              {latestMemory.date}
            </span>
          </div>

          <div
            onClick={() => onSelectMemory(latestMemory)}
            className="group cursor-pointer rounded-3xl bg-white shadow-[0_4px_20px_rgba(88,71,56,0.08)] border border-[#ddc0ba]/40 overflow-hidden hover:border-[#9e3c26]/50 hover:shadow-lg transition-all active:scale-[0.99]"
          >
            {/* Featured Cover Image */}
            <div className="relative w-full h-48 bg-[#ece8e0] overflow-hidden">
              <img
                src={latestMemory.image}
                alt={latestMemory.imageAlt || latestMemory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Tag & Icon Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold font-display text-[#1c1c17] shadow-xs flex items-center gap-1">
                  <span>{latestMemory.icon || '🌸'}</span>
                  <span>{latestMemory.tag}</span>
                </span>
              </div>

              {/* Date Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="text-[12px] font-medium font-body bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  📍 {latestMemory.locationName}
                </span>
                <span className="text-[11px] font-bold font-display bg-[#9e3c26] px-2.5 py-0.5 rounded-full shadow-xs">
                  {lang === 'VI' ? 'Bài viết mới nhất' : '最新記事'}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4">
              <h3 className="font-bold text-[16px] text-[#1c1c17] font-display group-hover:text-[#9e3c26] transition-colors line-clamp-1 mb-1.5">
                {lang === 'VI' ? latestMemory.title : latestMemory.titleJa}
              </h3>

              <p className="text-[13px] text-[#57423d] font-body line-clamp-2 leading-relaxed mb-3">
                {lang === 'VI' ? latestMemory.notes : latestMemory.notesJa}
              </p>

              <div className="pt-2.5 border-t border-[#ddc0ba]/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-[#8a726c] font-body">
                  <span>{latestMemory.daysAgoText}</span>
                  <span>•</span>
                  <span>{latestMemory.soundtrack}</span>
                </div>
                <span className="text-[12px] text-[#9e3c26] font-bold font-display flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{lang === 'VI' ? 'Đọc bài viết' : '記事を読む'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
