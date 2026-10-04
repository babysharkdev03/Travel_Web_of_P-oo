import React from 'react';
import { Memory, Language } from '../types';
import { getT } from '../utils/translations';
import {
  ArrowLeft,
  X,
  Heart,
  MapPin,
  Calendar,
  Sparkles,
  Music,
  Share2,
  Bookmark,
  Check
} from 'lucide-react';
import { RichTextRenderer } from './RichTextRenderer';

interface MemoryDetailModalProps {
  memory: Memory | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  lang: Language;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  onClose,
  onToggleFavorite,
  lang,
}) => {
  const [copied, setCopied] = React.useState(false);
  if (!memory) return null;
  const t = getT(lang);

  const getWeatherIcon = (w: Memory['weather']) => {
    switch (w) {
      case 'sunny':
        return '☀️ ' + (lang === 'VI' ? 'Nắng ấm' : '快晴');
      case 'sakura':
        return '🌸 ' + (lang === 'VI' ? 'Mùa hoa đào' : '桜満開');
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

  const pageIcon = memory.icon || '🌸';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    /* 
      UC3: Khi click vào đọc thêm bài viết sẽ hiển thị TOÀN MÀN HÌNH (Full-screen view)
      chứ không hiện nhỏ giữa màn hình.
    */
    <div className="fixed inset-0 z-50 w-full h-full bg-[#fdf9f1] overflow-y-auto animate-fade-in font-display select-text flex flex-col">
      {/* 1. TOP STICKY READING TOOLBAR */}
      <header className="sticky top-0 z-40 w-full h-14 bg-[#fdf9f1]/95 backdrop-blur-xl border-b border-[#ddc0ba]/40 shadow-xs px-4 flex items-center justify-between">
        {/* Back button */}
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-3.5 rounded-full bg-white hover:bg-[#f7f3eb] text-[#1c1c17] text-[13px] font-bold font-display border border-[#ddc0ba]/50 flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#9e3c26]" />
          <span>{lang === 'VI' ? 'Trở về' : '戻る'}</span>
        </button>

        {/* Truncated Title in Header */}
        <div className="hidden sm:flex items-center gap-2 max-w-[420px] truncate text-[13px] font-bold text-[#1c1c17]">
          <span>{pageIcon}</span>
          <span className="truncate">{lang === 'VI' ? memory.title : memory.titleJa}</span>
        </div>

        {/* Right actions: Favorite, Share, Close */}
        <div className="flex items-center gap-2">
          {/* Favorite */}
          <button
            type="button"
            onClick={() => onToggleFavorite(memory.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-2xs border ${
              memory.isFavorite
                ? 'bg-[#ffdad2] text-[#9e3c26] border-[#be543c]/30'
                : 'bg-white text-[#57423d] hover:bg-[#f7f3eb] border-[#ddc0ba]/50'
            }`}
            title="Yêu thích bài viết"
          >
            <Heart className={`w-4 h-4 ${memory.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#f7f3eb] text-[#57423d] border border-[#ddc0ba]/50 flex items-center justify-center shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Chia sẻ liên kết bài viết"
          >
            {copied ? <Check className="w-4 h-4 text-[#3d653e]" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#f7f3eb] text-[#57423d] hover:text-[#9e3c26] border border-[#ddc0ba]/50 flex items-center justify-center shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Đóng toàn màn hình"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. FULL-WIDTH HERO COVER BANNER */}
      {memory.image && (
        <div className="w-full relative bg-[#e7e1d5] aspect-[21/9] max-h-[380px] overflow-hidden flex-shrink-0 group">
          <img
            src={memory.image}
            alt={memory.imageAlt || memory.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Floating Pill on Cover */}
          <div className="absolute bottom-4 left-4 sm:left-8 flex items-center gap-2 text-white text-[12px] font-bold">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
              {memory.countryId === 'JP' ? '🇯🇵 Nhật Bản' : '🇻🇳 Việt Nam'}
            </span>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              {memory.locationName}
            </span>
          </div>
        </div>
      )}

      {/* 3. SPACIOUS CENTERED READING CONTAINER (Notion Document style) */}
      <main className="w-full max-w-[820px] mx-auto px-4 sm:px-8 py-6 sm:py-10 flex-1 flex flex-col gap-6">
        {/* Overlapping Notion Page Icon & Tag */}
        <div className="flex items-center gap-3 -mt-12 sm:-mt-16 z-10">
          <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border border-[#ddc0ba]/60 shadow-lg text-[32px] sm:text-[38px] flex items-center justify-center flex-shrink-0 select-none">
            {pageIcon}
          </span>
          <div className="pt-6 sm:pt-10">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#9e3c26] bg-[#ffdad2]/70 px-3 py-1 rounded-full border border-[#9e3c26]/20 shadow-2xs">
              {memory.tag}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[26px] sm:text-[36px] font-bold text-[#1c1c17] leading-tight font-display tracking-tight pt-1">
          {lang === 'VI' ? memory.title : memory.titleJa}
        </h1>

        {/* Properties metadata bar: Location, Date, Weather */}
        <div className="flex flex-wrap items-center gap-2 pb-2 text-[12.5px] text-[#57423d]">
          <span className="px-3.5 py-1.5 rounded-2xl bg-white border border-[#ddc0ba]/50 shadow-2xs font-semibold flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#9e3c26]" />
            <span>{memory.specificSpot || memory.locationName}</span>
          </span>

          <span className="px-3.5 py-1.5 rounded-2xl bg-white border border-[#ddc0ba]/50 shadow-2xs font-semibold flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#57423d]" />
            <span>{memory.date}</span>
          </span>

          <span className="px-3.5 py-1.5 rounded-2xl bg-white border border-[#ddc0ba]/50 shadow-2xs font-semibold">
            {getWeatherIcon(memory.weather)}
          </span>

          <span className="px-3.5 py-1.5 rounded-2xl bg-[#f7f3eb] text-[#8a726c] font-medium">
            {lang === 'VI' ? memory.daysAgoText : memory.daysAgoTextJa}
          </span>
        </div>

        {/* Sound track widget if present */}
        {memory.soundtrack && (
          <div className="p-3 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1d6774] text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <Music className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#8a726c] uppercase tracking-wider block font-bold">
                  {lang === 'VI' ? 'Giai điệu đồng hành' : 'BGM / 旅の音楽'}
                </span>
                <span className="text-[13px] font-bold text-[#1c1c17] truncate block">
                  {memory.soundtrack}
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white text-[#1d6774] font-bold border border-[#1d6774]/20 flex-shrink-0">
              ♫ Chill Playlist
            </span>
          </div>
        )}

        <hr className="border-0 border-t border-[#ddc0ba]/40 my-1" />

        {/* Main Document Body */}
        <article className="text-[15.5px] sm:text-[16.5px] text-[#1c1c17] leading-relaxed font-body">
          <RichTextRenderer
            content={
              (lang === 'VI' ? memory.notes : memory.notesJa) ||
              'Chưa có nội dung ghi chép cho hành trình này.'
            }
          />
        </article>

        {/* Bottom Back Button & Signature */}
        <div className="mt-12 pt-6 border-t border-[#ddc0ba]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[12px] text-[#8a726c]">
            <span>🌸 KÝ • 記憶島</span>
            <span>•</span>
            <span>{lang === 'VI' ? 'Dấu chân hành trình của Thu Pham' : 'Pham Thu の旅の記録'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#9e3c26] text-white text-[13px] font-bold font-display shadow-xs hover:bg-[#822714] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'VI' ? 'Đóng toàn màn hình' : '全画面を閉じる'}</span>
          </button>
        </div>
      </main>
    </div>
  );
};
