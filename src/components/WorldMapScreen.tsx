import React from 'react';
import { CountryId, Language, Memory, ProfileData } from '../types';
import { WorldMapCanvas } from './WorldMapCanvas';
import { ArrowRight, BookOpen, Compass, MapPin } from 'lucide-react';
import travelerAvatar from '../assets/traveler-avatar.png';
import { memoryLocationLabel } from '../utils/memoryLocations';

interface WorldMapScreenProps {
  selectedCountry: CountryId;
  onSelectCountry: (country: CountryId) => void;
  onNavigateToRegionMap: (country: CountryId) => void;
  onNavigateToMemories: () => void;
  onSelectMemory: (memory: Memory) => void;
  memories: Memory[];
  profile: ProfileData;
  lang: Language;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  selectedCountry, onSelectCountry, onNavigateToRegionMap, onNavigateToMemories,
  onSelectMemory, memories, profile, lang,
}) => {
  const counts = {
    JP: memories.filter((memory) => memory.countryId === 'JP').length,
    VN: memories.filter((memory) => memory.countryId === 'VN').length,
  };
  const countryMemories = memories
    .filter((memory) => memory.countryId === selectedCountry)
    .sort((a, b) => b.date.localeCompare(a.date));
  const recent = [...memories].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const countryName = selectedCountry === 'JP'
    ? (lang === 'VI' ? 'Nhật Bản' : '日本')
    : (lang === 'VI' ? 'Việt Nam' : 'ベトナム');
  const countryThought = selectedCountry === 'JP'
    ? (lang === 'VI' ? 'Những con phố và mùa hoa luôn khiến mình muốn đi chậm lại để ghi nhớ từng khoảnh khắc.' : '街並みと季節の花に出会うたび、一瞬一瞬を大切に残したくなります。')
    : (lang === 'VI' ? 'Mỗi lần trở về, mình lại tìm thấy một góc thân quen và một câu chuyện mới.' : '帰るたびに、懐かしい景色の中で新しい物語を見つけます。');

  return (
    <div className="flex flex-col gap-3 px-4 pt-3 pb-28">
      <section className="p-4 rounded-2xl bg-white border border-[#ddc0ba]/40 shadow-sm flex items-center gap-3">
        <img
          src={profile.avatarUrl || travelerAvatar}
          onError={(event) => { if (!event.currentTarget.src.endsWith(travelerAvatar)) event.currentTarget.src = travelerAvatar; }}
          alt={lang === 'VI' ? 'Ảnh tác giả' : '著者の写真'}
          className="w-14 h-14 rounded-full object-cover border-2 border-[#ffdad2] flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-[#8a726c] font-bold">{lang === 'VI' ? 'Tác giả' : '著者'}</p>
          <h1 className="text-[17px] leading-snug font-bold text-[#1c1c17] font-display">
            {lang === 'VI' ? profile.authorName : (profile.authorNameJa || profile.authorName)}
          </h1>
          <p className="text-[12px] text-[#9e3c26] font-semibold">
            {memories.length} {lang === 'VI' ? 'ký ức đã viết' : '件の旅の記憶'}
          </p>
        </div>
      </section>

      <p className="px-1 text-[12px] leading-relaxed text-[#57423d] font-body">
        {lang === 'VI' ? profile.quoteVi : profile.quoteJa}
      </p>

      <WorldMapCanvas selectedCountry={selectedCountry} onSelectCountry={onSelectCountry} counts={counts} lang={lang} />

      <section className="p-4 rounded-2xl bg-white border border-[#ddc0ba]/40 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-[#9e3c26]" />
          <h2 className="font-bold text-[17px] text-[#1c1c17] font-display">{countryName}</h2>
          <span className="ml-auto text-[11px] font-bold text-[#9e3c26]">{counts[selectedCountry]} {lang === 'VI' ? 'ký ức' : '件の記憶'}</span>
        </div>
        <p className="text-[12px] leading-relaxed text-[#57423d] italic">“{countryThought}”</p>
        <p className="text-[12px] text-[#57423d] mt-2">
          {lang === 'VI' ? 'Ký ức gần nhất:' : '最新の記憶:'}{' '}
          <strong>{countryMemories[0] ? (lang === 'VI' ? countryMemories[0].title : countryMemories[0].titleJa) : (lang === 'VI' ? 'Chưa có' : 'まだありません')}</strong>
        </p>
        <button
          type="button"
          onClick={() => onNavigateToRegionMap(selectedCountry)}
          className="mt-3 w-full min-h-10 rounded-full bg-[#9e3c26] text-white font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#822714] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9e3c26]"
        >
          <Compass className="w-4 h-4" />
          {lang === 'VI' ? 'Khám phá bản đồ quốc gia' : '国の地図を見る'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <section aria-labelledby="recent-memories-heading">
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 id="recent-memories-heading" className="font-bold text-[17px] text-[#1c1c17] font-display">
            {lang === 'VI' ? 'Ký ức vừa ghi dấu' : '最近の記憶'}
          </h2>
          <button type="button" onClick={onNavigateToMemories} className="text-[12px] font-bold text-[#9e3c26] underline underline-offset-2">
            {lang === 'VI' ? 'Xem tất cả' : 'すべて見る'}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {recent.map((memory) => (
            <button
              key={memory.id}
              type="button"
              onClick={() => onSelectMemory(memory)}
              className="w-full text-left p-3 rounded-2xl bg-white border border-[#ddc0ba]/40 flex items-center gap-3 hover:border-[#9e3c26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9e3c26]"
            >
              <span className="w-10 h-10 rounded-xl bg-[#ffdad2]/60 flex items-center justify-center text-xl flex-shrink-0" aria-hidden="true">{memory.icon || '📖'}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold text-[#1c1c17] truncate">{lang === 'VI' ? memory.title : memory.titleJa}</span>
                <span className="block text-[11px] text-[#57423d] truncate">{memoryLocationLabel(memory, lang)} · {memory.date}</span>
              </span>
              <BookOpen className="w-4 h-4 text-[#9e3c26] flex-shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
