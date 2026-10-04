import React, { useState } from 'react';
import { Memory, Language } from '../types';
import {
  Laptop,
  Smartphone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { RichTextRenderer } from './RichTextRenderer';

interface NotionMagazineViewProps {
  memory: Memory;
  lang?: Language;
  initialDevice?: 'auto' | 'web' | 'phone';
}

export const NotionMagazineView: React.FC<NotionMagazineViewProps> = ({
  memory,
  lang = 'VI',
  initialDevice = 'auto',
}) => {
  const [deviceMode, setDeviceMode] = useState<'auto' | 'web' | 'phone'>(
    initialDevice
  );

  const pageIcon = memory.icon || '🌸';

  const getWeatherIcon = (w: Memory['weather']) => {
    switch (w) {
      case 'sunny':
        return '☀️ ' + (lang === 'VI' ? 'Nắng ấm' : '快晴');
      case 'sakura':
        return '🌸 ' + (lang === 'VI' ? 'Hoa anh đào' : '桜満開');
      case 'rainy':
        return '🌧️ ' + (lang === 'VI' ? 'Mưa phùn' : '雨模様');
      case 'autumn':
        return '🍁 ' + (lang === 'VI' ? 'Thu vàng lá đỏ' : '紅葉');
      case 'snowy':
        return '❄️ ' + (lang === 'VI' ? 'Tuyết trắng' : '雪景色');
      default:
        return '✨';
    }
  };

  const isForcedPhone = deviceMode === 'phone';

  return (
    <div className="w-full flex flex-col font-display select-none">
      {/* Device Mode Switcher (Web vs Phone) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#ddc0ba]/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#9e3c26]" />
          <span className="text-[12px] font-bold text-[#1c1c17]">
            Chế độ hiển thị:
          </span>
          <span className="text-[11px] text-[#8a726c] hidden sm:inline-block">
            (Web: Gọn gàng trên máy tính • Điện thoại: Tự co về chuẩn màn hình điện thoại)
          </span>
        </div>

        <div className="flex items-center bg-[#ece8e0] p-0.5 rounded-xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setDeviceMode('auto')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              deviceMode === 'auto'
                ? 'bg-white text-[#9e3c26] shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            Tự động
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('web')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              deviceMode === 'web'
                ? 'bg-white text-[#9e3c26] shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>💻 Web (Máy tính)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('phone')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              deviceMode === 'phone'
                ? 'bg-white text-[#9e3c26] shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Điện thoại (Phone)</span>
          </button>
        </div>
      </div>

      {/* 
        ARTICLE CONTAINER:
        - When phone mode: constrained to max-w-[400px] mx-auto with phone-like frame
        - When web / auto: centered max-w-3xl reading width with generous margins
      */}
      <div
        className={`w-full transition-all duration-300 mx-auto ${
          isForcedPhone
            ? 'max-w-[400px] bg-white rounded-[32px] border-2 border-[#ddc0ba]/60 shadow-lg overflow-hidden'
            : 'max-w-3xl bg-white p-5 sm:p-8 rounded-3xl border border-[#ddc0ba]/50 shadow-xs'
        }`}
      >
        {/* Cover Photo (Ảnh chủ đề) */}
        {memory.image && (
          <div
            className={`w-full relative overflow-hidden bg-[#ece8e0] aspect-[16/8] max-h-[260px] ${
              isForcedPhone ? 'rounded-none' : 'rounded-2xl mb-5'
            }`}
          >
            <img
              src={memory.image}
              alt={memory.imageAlt || memory.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-bold flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs border border-white/20">
                {memory.countryId === 'JP' ? '🇯🇵 Nhật Bản' : '🇻🇳 Việt Nam'}
              </span>
              <span className="opacity-90">{memory.locationName}</span>
            </div>
          </div>
        )}

        {/* Page Header (Icon + Title + Properties) */}
        <div className={`flex flex-col gap-3 ${isForcedPhone ? 'p-4' : 'pt-2'}`}>
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/60 shadow-2xs text-[24px] flex items-center justify-center select-none flex-shrink-0">
              {pageIcon}
            </span>
            <div className="flex flex-col">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#9e3c26]">
                {memory.tag}
              </span>
              <h1 className="text-[20px] sm:text-[24px] font-bold text-[#1c1c17] leading-snug">
                {lang === 'VI' ? memory.title : memory.titleJa}
              </h1>
            </div>
          </div>

          {/* Properties row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11.5px] text-[#57423d]">
            <span className="px-2.5 py-1 rounded-xl bg-[#fdfaf5] border border-[#ddc0ba]/40 shadow-2xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#9e3c26]" />
              <span>{memory.locationName}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#fdfaf5] border border-[#ddc0ba]/40 shadow-2xs font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#57423d]" />
              <span>{memory.date}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#fdfaf5] border border-[#ddc0ba]/40 shadow-2xs font-semibold">
              {getWeatherIcon(memory.weather)}
            </span>
          </div>

          <hr className="my-2 border-0 border-t border-[#ddc0ba]/40" />

          {/* Natural Story Reading Flow with Rich Formatting & In-Article Photos */}
          <div className="pt-2 text-[14px] text-[#1c1c17] leading-relaxed font-body">
            <RichTextRenderer
              content={
                (lang === 'VI' ? memory.notes : memory.notesJa) ||
                'Chưa có nội dung bài viết.'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
