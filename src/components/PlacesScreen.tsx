import React, { useMemo, useState } from 'react';
import { Language, Memory, Place } from '../types';
import { ArrowUpDown, ChevronRight, MapPin, Search, X } from 'lucide-react';
import { findProvince, memoriesAtProvince, normalizePlace, placeLabel, resolveProvinceId } from '../utils/memoryLocations';

interface PlacesScreenProps {
  places: Place[];
  memories: Memory[];
  isAdmin: boolean;
  onOpenAdmin: () => void;
  lang: Language;
  onNavigateToProvinceMemories?: (country: Place['countryId'], provinceId: string) => void;
}

export const PlacesScreen: React.FC<PlacesScreenProps> = ({
  places, memories, isAdmin, onOpenAdmin, lang, onNavigateToProvinceMemories,
}) => {
  const [cityQuery, setCityQuery] = useState('');
  const [yearQuery, setYearQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const timeline = useMemo(() => places
    .filter((place) => place.visited)
    .filter((place) => {
      if (!cityQuery.trim()) return true;
      const matchedProvince = findProvince(place.countryId, cityQuery);
      return normalizePlace(place.cityName).includes(normalizePlace(cityQuery))
        || (matchedProvince !== undefined && resolveProvinceId(place.countryId, place.cityName) === matchedProvince.id);
    })
    .filter((place) => !yearQuery.trim() || String(place.year || place.date?.slice(0, 4) || '').includes(yearQuery.trim()))
    .sort((a, b) => sortOrder === 'newest'
      ? (b.date || '').localeCompare(a.date || '')
      : (a.date || '').localeCompare(b.date || '')),
  [places, cityQuery, yearQuery, sortOrder]);

  return (
    <section className="px-4 pt-3 pb-28" aria-labelledby="places-heading">
      <div className="p-4 rounded-2xl bg-white border border-[#ddc0ba]/40 shadow-sm mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#9e3c26]" />
          <h1 id="places-heading" className="font-bold text-[18px] text-[#1c1c17] font-display">
            {lang === 'VI' ? 'Địa điểm đã đi' : '訪れた場所'}
          </h1>
          <span className="ml-auto text-[12px] text-[#57423d]">{timeline.length}</span>
        </div>
        {isAdmin && <button type="button" onClick={onOpenAdmin} className="mt-2 text-[12px] text-[#9e3c26] underline">{lang === 'VI' ? 'Quản lý địa điểm' : '場所を管理'}</button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <label className="block text-[12px] font-bold text-[#57423d]">
          {lang === 'VI' ? 'Tìm thành phố / tỉnh' : '都市・省市を検索'}
          <span className="mt-1 relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-[#8a726c]" aria-hidden="true" />
            <input type="search" value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Tokyo, Hà Nội..." className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-[#ddc0ba]/50 text-[13px] font-normal text-[#1c1c17]" />
          </span>
        </label>
        <label className="block text-[12px] font-bold text-[#57423d]">
          {lang === 'VI' ? 'Tìm theo năm' : '年で検索'}
          <span className="mt-1 relative flex items-center">
            <input type="search" inputMode="numeric" value={yearQuery} onChange={(event) => setYearQuery(event.target.value)} placeholder="2024" className="w-full h-10 px-3 rounded-xl bg-white border border-[#ddc0ba]/50 text-[13px] font-normal text-[#1c1c17]" />
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-[#57423d]">{lang === 'VI' ? `${timeline.length} điểm đến` : `${timeline.length}件`}</p>
        <button type="button" onClick={() => setSortOrder((order) => order === 'newest' ? 'oldest' : 'newest')} className="min-h-9 px-3 rounded-full bg-white border border-[#ddc0ba]/50 text-[12px] font-bold text-[#9e3c26] flex items-center gap-1">
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'newest' ? (lang === 'VI' ? 'Mới nhất' : '新しい順') : (lang === 'VI' ? 'Cũ nhất' : '古い順')}
        </button>
      </div>

      {timeline.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white border border-[#ddc0ba]/40 text-center">
          <p className="text-[13px] text-[#57423d]">{lang === 'VI' ? 'Không tìm thấy địa điểm phù hợp.' : '該当する場所がありません。'}</p>
          <button type="button" onClick={() => { setCityQuery(''); setYearQuery(''); }} className="mt-2 text-[12px] text-[#9e3c26] underline flex items-center gap-1 mx-auto"><X className="w-3 h-3" />{lang === 'VI' ? 'Xóa tìm kiếm' : '検索を消す'}</button>
        </div>
      ) : (
        <ol className="relative border-l-2 border-[#ddc0ba] ml-3 space-y-3">
          {timeline.map((place) => {
            const provinceId = resolveProvinceId(place.countryId, place.cityName);
            const memoryCount = provinceId ? memoriesAtProvince(memories, place.countryId, provinceId).length : 0;
            return (
              <li key={place.id} className="relative pl-5">
                <span className="absolute -left-[7px] top-4 w-3 h-3 rounded-full bg-[#9e3c26] ring-2 ring-[#fdf9f1]" aria-hidden="true" />
                <div className="p-3 rounded-2xl bg-white border border-[#ddc0ba]/40 shadow-sm">
                  <div className="flex items-start gap-2">
                    <span aria-hidden="true">{place.countryId === 'JP' ? '🇯🇵' : '🇻🇳'}</span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-[14px] text-[#1c1c17]">{placeLabel(place.countryId, place.cityName, lang, provinceId)}</h2>
                      <p className="text-[12px] text-[#57423d]">└ {lang === 'VI' ? place.name : place.nameJa}</p>
                    </div>
                    <time className="text-[11px] text-[#8a726c] whitespace-nowrap">{place.date || place.year}</time>
                  </div>
                  {memoryCount > 0 && provinceId && onNavigateToProvinceMemories && (
                    <button type="button" onClick={() => onNavigateToProvinceMemories(place.countryId, provinceId)} className="mt-2 text-[11px] font-bold text-[#9e3c26] flex items-center gap-1 underline underline-offset-2">
                      {memoryCount} {lang === 'VI' ? 'ký ức' : '件の記憶'} <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};
