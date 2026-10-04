import React, { useState, useMemo } from 'react';
import { Language, Place } from '../types';
import { getT } from '../utils/translations';
import {
  MapPin,
  Calendar,
  Search,
  ArrowUpDown,
  Clock,
  Sparkles,
  Star,
  Filter,
  Plus,
  Compass,
  X,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface PlacesScreenProps {
  places: Place[];
  isAdmin: boolean;
  onOpenAdmin: () => void;
  lang: Language;
  onNavigateToMemoriesWithLocation?: (locationName: string) => void;
}

const normalizeSearch = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
};

export const PlacesScreen: React.FC<PlacesScreenProps> = ({
  places,
  isAdmin,
  onOpenAdmin,
  lang,
  onNavigateToMemoriesWithLocation,
}) => {
  const t = getT(lang);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Extract unique years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    places.forEach((p) => {
      if (p.year) years.add(p.year);
      else if (p.date) {
        const y = new Date(p.date).getFullYear();
        if (!isNaN(y)) years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [places]);

  // Extract all unique cities
  const allCities = useMemo(() => {
    const cityMap = new Map<string, number>();
    places.forEach((p) => {
      const c = p.cityName;
      cityMap.set(c, (cityMap.get(c) || 0) + 1);
    });
    return Array.from(cityMap.entries()).map(([cityName, count]) => ({
      cityName,
      count,
    }));
  }, [places]);

  // Extract unique cities in scope (reactive to selectedYear)
  const citiesInScope = useMemo(() => {
    const relevantPlaces =
      selectedYear === 'all'
        ? places
        : places.filter((p) => {
            const yr = p.year || (p.date ? new Date(p.date).getFullYear() : undefined);
            return yr === parseInt(selectedYear, 10);
          });

    const cityMap = new Map<string, number>();
    relevantPlaces.forEach((p) => {
      const c = p.cityName;
      cityMap.set(c, (cityMap.get(c) || 0) + 1);
    });
    return Array.from(cityMap.entries()).map(([cityName, count]) => ({
      cityName,
      count,
    }));
  }, [places, selectedYear]);

  // When selected year changes, reset city if it is not present in that year
  React.useEffect(() => {
    if (selectedCity !== 'all') {
      const exists = citiesInScope.some(
        (c) => c.cityName.toLowerCase() === selectedCity.toLowerCase()
      );
      if (!exists) {
        setSelectedCity('all');
      }
    }
  }, [selectedYear, citiesInScope]);

  // Filter & Sort places
  const filteredAndSortedPlaces = useMemo(() => {
    let result = [...places];

    // Filter by year
    if (selectedYear !== 'all') {
      const targetYear = parseInt(selectedYear, 10);
      result = result.filter((p) => {
        if (p.year === targetYear) return true;
        if (p.date) {
          const y = new Date(p.date).getFullYear();
          return y === targetYear;
        }
        return false;
      });
    }

    // Filter by city
    if (selectedCity !== 'all') {
      result = result.filter(
        (p) => p.cityName.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // Search query (city name, place name, notes, tag, year)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const qNorm = normalizeSearch(q);

      result = result.filter((p) => {
        const matchName =
          p.name.toLowerCase().includes(q) ||
          normalizeSearch(p.name).includes(qNorm);
        const matchJa = p.nameJa.toLowerCase().includes(q);
        const matchCity =
          p.cityName.toLowerCase().includes(q) ||
          normalizeSearch(p.cityName).includes(qNorm);
        const matchTag =
          p.tag.toLowerCase().includes(q) ||
          normalizeSearch(p.tag).includes(qNorm);
        const matchNotes =
          p.notes.toLowerCase().includes(q) ||
          normalizeSearch(p.notes).includes(qNorm);
        const matchYear =
          (p.year && p.year.toString().includes(q)) ||
          (p.date && p.date.includes(q));

        return matchName || matchJa || matchCity || matchTag || matchNotes || Boolean(matchYear);
      });
    }

    // Sort order: newest to oldest or oldest to newest
    result.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : (a.year ? new Date(`${a.year}-01-01`).getTime() : 0);
      const dateB = b.date ? new Date(b.date).getTime() : (b.year ? new Date(`${b.year}-01-01`).getTime() : 0);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [places, selectedYear, selectedCity, searchQuery, sortOrder]);

  // Group by Year for aesthetic timeline milestones
  const placesByYear = useMemo(() => {
    const groups: { year: number; places: Place[] }[] = [];
    filteredAndSortedPlaces.forEach((place) => {
      const year = place.year || (place.date ? new Date(place.date).getFullYear() : 2024);
      let group = groups.find((g) => g.year === year);
      if (!group) {
        group = { year, places: [] };
        groups.push(group);
      }
      group.places.push(place);
    });
    return groups;
  }, [filteredAndSortedPlaces]);

  // Format date helper
  const formatDateBadge = (dateStr?: string, yearNum?: number) => {
    if (dateStr) {
      const [y, m, d] = dateStr.split('-');
      if (lang === 'VI') {
        return `Ngày ${d}/${m}/${y}`;
      }
      return `${y}年${m}月${d}日`;
    }
    return `Năm ${yearNum || 2024}`;
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* 1. Header Info & Stats Card */}
      <div className="px-4 pb-3">
        <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#ddc0ba]/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#1d6774]/15 flex items-center justify-center text-[#1d6774] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-[18px] text-[#1c1c17] font-display truncate">
                  {lang === 'VI' ? 'Dấu Chân Địa Điểm' : '旅の足跡・スポット'}
                </h2>
                <p className="text-[12px] text-[#57423d] font-body truncate">
                  {lang === 'VI'
                    ? 'Dòng thời gian các điểm đến đã ghi dấu qua từng năm tháng'
                    : '年月とともに刻まれた訪問地のタイムライン'}
                </p>
              </div>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="h-8 px-3 rounded-full bg-[#9e3c26] text-white text-[11px] font-bold font-display shadow-xs flex items-center gap-1 active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quản lý</span>
              </button>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-3.5 pt-3 border-t border-[#ddc0ba]/30 grid grid-cols-3 divide-x divide-[#ddc0ba]/30 text-center">
            <div>
              <span className="block text-[18px] font-bold text-[#9e3c26] font-display">
                {places.length}
              </span>
              <span className="text-[11px] text-[#57423d] font-body">
                {lang === 'VI' ? 'Địa điểm' : 'スポット数'}
              </span>
            </div>
            <div>
              <span className="block text-[18px] font-bold text-[#1d6774] font-display">
                {allCities.length}
              </span>
              <span className="text-[11px] text-[#57423d] font-body">
                {lang === 'VI' ? 'Thành phố' : '都市数'}
              </span>
            </div>
            <div>
              <span className="block text-[18px] font-bold text-[#3d653e] font-display">
                {availableYears.length}
              </span>
              <span className="text-[11px] text-[#57423d] font-body">
                {lang === 'VI' ? 'Năm hành trình' : '旅の年数'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls HUD: Search & Sort Direction */}
      <div className="px-4 pb-3 flex flex-col gap-2.5">
        {/* Search Input & Sort Button */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8a726c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'VI'
                  ? 'Tìm theo tên thành phố (Tokyo, Kyoto, Hội An...)'
                  : '都市名やスポット名で検索...'
              }
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] placeholder-[#8a726c] focus:outline-none focus:border-[#9e3c26] shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a726c] hover:text-[#1c1c17]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* UC1: Sort order toggle (Mới nhất tới cũ nhất & ngược lại) */}
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
            className="h-10 px-3 rounded-xl bg-white border border-[#ddc0ba]/50 text-[#1c1c17] text-[12px] font-display font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#f7f3eb] active:scale-95 transition-all flex-shrink-0 cursor-pointer"
            title={sortOrder === 'newest' ? 'Đang xếp: Mới nhất trước' : 'Đang xếp: Cũ nhất trước'}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#9e3c26]" />
            <span className="hidden sm:inline">
              {sortOrder === 'newest'
                ? (lang === 'VI' ? 'Mới nhất ⬇' : '新しい順 ⬇')
                : (lang === 'VI' ? 'Cũ nhất ⬆' : '古い順 ⬆')}
            </span>
            <span className="sm:hidden">
              {sortOrder === 'newest' ? '⬇ Mới' : '⬆ Cũ'}
            </span>
          </button>
        </div>

        {/* UC2: Filter theo năm (Year Filter Chips) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] font-bold text-[#8a726c] font-display whitespace-nowrap mr-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{lang === 'VI' ? 'Năm:' : '年:'}</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-display whitespace-nowrap transition-colors cursor-pointer ${
              selectedYear === 'all'
                ? 'bg-[#9e3c26] text-white font-bold shadow-xs'
                : 'bg-white text-[#57423d] border border-[#ddc0ba]/40 hover:bg-[#ece8e0]'
            }`}
          >
            {lang === 'VI' ? 'Tất cả các năm' : '全期間'}
          </button>
          {availableYears.map((yr) => {
            const count = places.filter((p) => p.year === yr || (p.date && new Date(p.date).getFullYear() === yr)).length;
            return (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(String(yr))}
                className={`px-3 py-1 rounded-full text-[11px] font-display whitespace-nowrap transition-colors cursor-pointer ${
                  selectedYear === String(yr)
                    ? 'bg-[#9e3c26] text-white font-bold shadow-xs'
                    : 'bg-white text-[#57423d] border border-[#ddc0ba]/40 hover:bg-[#ece8e0]'
                }`}
              >
                {yr} ({count})
              </button>
            );
          })}
        </div>

        {/* UC2: Filter theo thành phố (City Filter Chips) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] font-bold text-[#8a726c] font-display whitespace-nowrap mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{lang === 'VI' ? 'Thành phố:' : '都市:'}</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedCity('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-display whitespace-nowrap transition-colors cursor-pointer ${
              selectedCity === 'all'
                ? 'bg-[#1d6774] text-white font-bold shadow-xs'
                : 'bg-white text-[#57423d] border border-[#ddc0ba]/40 hover:bg-[#ece8e0]'
            }`}
          >
            {lang === 'VI' ? 'Tất cả' : 'すべて'}
          </button>
          {citiesInScope.map((c) => (
            <button
              key={c.cityName}
              type="button"
              onClick={() => setSelectedCity(c.cityName)}
              className={`px-3 py-1 rounded-full text-[11px] font-display whitespace-nowrap transition-colors cursor-pointer ${
                selectedCity.toLowerCase() === c.cityName.toLowerCase()
                  ? 'bg-[#1d6774] text-white font-bold shadow-xs'
                  : 'bg-white text-[#57423d] border border-[#ddc0ba]/40 hover:bg-[#ece8e0]'
              }`}
            >
              {c.cityName} ({c.count})
            </button>
          ))}
        </div>
      </div>

      {/* UC2: Annual Overview Spotlight Banner (Đề xuất giải pháp thấy trong năm tác giả đã đi đâu) */}
      {selectedYear !== 'all' && (
        <div className="px-4 pb-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#ffdad2]/40 via-white to-[#1d6774]/10 border border-[#ddc0ba]/60 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#9e3c26] text-white flex items-center justify-center font-bold text-[13px] flex-shrink-0 shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[14px] text-[#1c1c17] font-display">
                      {lang === 'VI' ? `Hành trình năm ${selectedYear}` : `${selectedYear}年の旅路`}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#9e3c26]/10 text-[#9e3c26] text-[10px] font-bold font-display">
                      {filteredAndSortedPlaces.length} {lang === 'VI' ? 'điểm đến' : '箇所'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#57423d] font-body mt-1 leading-relaxed">
                    {lang === 'VI' ? (
                      <>
                        Trong năm <strong>{selectedYear}</strong>, tác giả đã đặt chân đến{' '}
                        <strong className="text-[#1d6774]">{citiesInScope.length} thành phố</strong> (
                        {citiesInScope.map((c) => c.cityName).join(', ')}).
                      </>
                    ) : (
                      <>
                        <strong>{selectedYear}年</strong>、筆者は{' '}
                        <strong className="text-[#1d6774]">{citiesInScope.length}都市</strong> (
                        {citiesInScope.map((c) => c.cityName).join(', ')}) を訪れました。
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedYear('all');
                  setSelectedCity('all');
                }}
                className="text-[11px] font-bold text-[#8a726c] hover:text-[#9e3c26] underline flex-shrink-0 cursor-pointer pt-0.5 whitespace-nowrap"
              >
                {lang === 'VI' ? 'Xem tất cả năm' : '全期間'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Search & Filter Indicator Bar */}
      {(searchQuery || (selectedCity !== 'all' && selectedYear === 'all')) && (
        <div className="px-4 pb-3">
          <div className="p-2.5 px-3 rounded-xl bg-white border border-[#ddc0ba]/50 flex items-center justify-between text-[12px] shadow-2xs">
            <span className="text-[#57423d] font-body truncate">
              {lang === 'VI' ? 'Đang lọc theo: ' : '絞り込み中: '}
              {searchQuery && <strong className="text-[#9e3c26]">"{searchQuery}" </strong>}
              {selectedCity !== 'all' && <strong className="text-[#1d6774]">{selectedCity}</strong>}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('all');
              }}
              className="text-[11px] font-bold text-[#9e3c26] hover:underline flex-shrink-0 ml-2 cursor-pointer"
            >
              {lang === 'VI' ? 'Bỏ lọc' : 'クリア'}
            </button>
          </div>
        </div>
      )}

      {/* 3. UC1: TIMELINE THEO CHIỀU DỌC CỦA TÁC GIẢ (Vertical Timeline) */}
      <div className="px-4">
        {filteredAndSortedPlaces.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-[#ddc0ba]/60 shadow-xs">
            <Compass className="w-10 h-10 text-[#8a726c] mx-auto mb-2 opacity-60" />
            <h4 className="font-bold text-[15px] text-[#1c1c17] font-display mb-1">
              {lang === 'VI' ? 'Không tìm thấy địa điểm nào phù hợp' : '該当するスポットが見つかりませんでした'}
            </h4>
            <p className="text-[12px] text-[#57423d] font-body mb-3">
              {lang === 'VI'
                ? 'Hãy thử thay đổi năm, từ khóa tìm kiếm hoặc thành phố đã chọn.'
                : '検索条件や選択した年を変更してお試しください。'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedYear('all');
                setSelectedCity('all');
              }}
              className="px-4 py-2 bg-[#9e3c26] text-white text-[12px] font-bold rounded-full shadow-xs hover:bg-[#822714] cursor-pointer"
            >
              {lang === 'VI' ? 'Xem lại tất cả địa điểm' : 'フィルターをリセット'}
            </button>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-8">
            {/* Vertical timeline spine line */}
            <div className="absolute left-2.5 md:left-3.5 top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#9e3c26] via-[#d48344] to-[#1d6774]" />

            <div className="flex flex-col gap-6">
              {placesByYear.map((yearGroup) => (
                <div key={yearGroup.year} className="relative">
                  {/* Year Milestone Node */}
                  <div className="relative -left-6 md:-left-8 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#9e3c26] text-white flex items-center justify-center font-bold text-[11px] md:text-[12px] shadow-sm z-10 ring-4 ring-[#faf7f2]">
                      ✦
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#f1ede6] text-[#9e3c26] font-bold text-[12px] font-display border border-[#ddc0ba]/40 shadow-xs">
                      {lang === 'VI' ? `Năm ${yearGroup.year}` : `${yearGroup.year}年`} • {yearGroup.places.length} {lang === 'VI' ? 'địa điểm' : '箇所'}
                    </span>
                  </div>

                  {/* Places in this year */}
                  <div className="flex flex-col gap-3.5 pl-1">
                    {yearGroup.places.map((place) => {
                      const placeName = lang === 'VI' ? place.name : place.nameJa;

                      return (
                        <div key={place.id} className="relative group">
                          {/* Dot on vertical line */}
                          <div className="absolute -left-6 md:-left-8 top-5 w-3 h-3 rounded-full bg-white border-2 border-[#9e3c26] z-10 group-hover:scale-125 transition-transform" />

                          {/* Place Card */}
                          <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#ddc0ba]/40 hover:border-[#9e3c26]/50 hover:shadow-md transition-all flex flex-col sm:flex-row gap-3">
                            {/* Thumbnail */}
                            <div className="w-full sm:w-28 h-32 sm:h-28 rounded-xl overflow-hidden bg-[#ece8e0] flex-shrink-0 relative">
                              <img
                                src={place.image}
                                alt={place.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold font-display text-[#1c1c17] shadow-xs">
                                {place.countryId === 'JP' ? '🇯🇵 Nhật Bản' : '🇻🇳 Việt Nam'}
                              </span>
                            </div>

                            {/* Place Details */}
                            <div className="flex flex-col justify-between min-w-0 flex-1">
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  {/* Date Badge */}
                                  <span className="text-[11px] font-mono text-[#8a726c] flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-[#d48344]" />
                                    <span>{formatDateBadge(place.date, place.year)}</span>
                                  </span>

                                  {/* Visited Status */}
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 bg-[#3d653e] text-white shadow-2xs flex-shrink-0">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>{lang === 'VI' ? 'Đã đến' : '訪問済'}</span>
                                  </span>
                                </div>

                                <h3 className="font-bold text-[15px] text-[#1c1c17] font-display group-hover:text-[#9e3c26] transition-colors line-clamp-1">
                                  {placeName}
                                </h3>

                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] font-bold text-[#1d6774] font-display">
                                    📍 {place.cityName}
                                  </span>
                                  <span className="text-[#ddc0ba]">•</span>
                                  <span className="text-[11px] font-medium text-[#9e3c26] font-display">
                                    {place.tag}
                                  </span>
                                </div>

                                <p className="text-[12px] text-[#57423d] font-body line-clamp-2 mt-1.5 leading-relaxed bg-[#fbf9f5] p-2 rounded-xl border border-[#ddc0ba]/30">
                                  "{place.notes}"
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#ddc0ba]/20">
                                <div className="flex items-center gap-1 text-[11px] text-[#e2ab60] font-bold font-display">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span>{place.rating.toFixed(1)} / 5.0</span>
                                </div>

                                {onNavigateToMemoriesWithLocation && (
                                  <button
                                    type="button"
                                    onClick={() => onNavigateToMemoriesWithLocation(place.cityName)}
                                    className="text-[11px] font-bold text-[#9e3c26] hover:text-[#822714] font-display flex items-center gap-0.5 hover:underline cursor-pointer"
                                  >
                                    <span>{lang === 'VI' ? 'Xem ký ức liên quan' : '関連する記録'}</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
