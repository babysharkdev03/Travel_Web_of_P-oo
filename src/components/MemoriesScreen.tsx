import React, { useState, useMemo } from 'react';
import { Language, Memory, CountryId } from '../types';
import { getT } from '../utils/translations';
import { findProvince, memoryLocationLabel, memoryProvinceId, placeLabel } from '../utils/memoryLocations';
import { allJapanPrefectures, allVietnamProvinces } from '../data/regionsData';
import {
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
  Plus,
  Heart,
  Lock,
  Search,
  ArrowUpDown,
  ListFilter,
  Grid,
  Clock,
  Compass,
  X,
  Music,
  ChevronRight,
  Filter,
  ArrowLeft
} from 'lucide-react';

interface MemoriesScreenProps {
  memories: Memory[];
  onSelectMemory: (m: Memory) => void;
  onOpenNewMemory: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  lang: Language;
  initialSearchQuery?: string;
  onClearInitialSearch?: () => void;
  locationFilter?: { country: CountryId; provinceId: string } | null;
  onClearLocationFilter?: () => void;
  onBack?: () => void;
}

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({
  memories,
  onSelectMemory,
  onOpenNewMemory,
  isAdmin,
  onOpenAdmin,
  lang,
  initialSearchQuery,
  onClearInitialSearch,
  locationFilter,
  onClearLocationFilter,
  onBack,
}) => {
  const t = getT(lang);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [filterCountry, setFilterCountry] = useState<'all' | CountryId>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [filterWeather, setFilterWeather] = useState<string>('all');

  // Sync initialSearchQuery when navigating from another screen
  React.useEffect(() => {
    if (initialSearchQuery !== undefined && initialSearchQuery !== searchQuery) {
      setSearchQuery(initialSearchQuery);
      setSelectedCity('all');
    }
  }, [initialSearchQuery]);

  React.useEffect(() => {
    if (locationFilter) {
      setFilterCountry(locationFilter.country);
      setSelectedCity('all');
      setFilterWeather('all');
      setSearchQuery('');
    } else {
      setFilterCountry('all');
      setSelectedCity('all');
      setFilterWeather('all');
    }
  }, [locationFilter]);
  
  // UC2: View Mode ('timeline' vs 'grid') & Sort Direction ('newest' vs 'oldest')
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Weather icons helper
  const getWeatherIcon = (w: Memory['weather']) => {
    switch (w) {
      case 'sunny': return '☀️';
      case 'sakura': return '🌸';
      case 'rainy': return '🌧️';
      case 'autumn': return '🍁';
      case 'snowy': return '❄️';
      default: return '✨';
    }
  };

  const getWeatherName = (w: Memory['weather']) => {
    switch (w) {
      case 'sunny': return lang === 'VI' ? 'Nắng ấm' : '晴れ';
      case 'sakura': return lang === 'VI' ? 'Mùa hoa đào' : '桜・春';
      case 'rainy': return lang === 'VI' ? 'Mưa rào' : '雨';
      case 'autumn': return lang === 'VI' ? 'Thu vàng lá đỏ' : '秋・紅葉';
      case 'snowy': return lang === 'VI' ? 'Tuyết rơi' : '雪・冬';
      default: return '';
    }
  };

  // Helper to extract city name from memory
  const getCityName = (m: Memory): string => {
    if (m.locationName.includes('Tokyo')) return 'Tokyo';
    if (m.locationName.includes('Kyoto')) return 'Kyoto';
    if (m.locationName.includes('Osaka') || m.locationName.includes('Sakai')) return 'Sakai / Osaka';
    if (m.locationName.includes('Nagano')) return 'Nagano';
    if (m.locationName.includes('Hội An')) return 'Hội An';
    if (m.locationName.includes('Đà Nẵng')) return 'Đà Nẵng';
    if (m.locationName.includes('Hà Nội')) return 'Hà Nội';
    if (m.locationName.includes('Hồ Chí Minh') || m.locationName.includes('Sài Gòn')) return 'TP. Hồ Chí Minh';
    return m.locationName.split(',')[0].trim();
  };

  // Extract list of cities for quick filters
  const citiesList = useMemo(() => {
    const list: { name: string; count: number; countryId: CountryId; emoji: string }[] = [];
    
    memories.forEach((m) => {
      const city = getCityName(m);
      const existing = list.find((c) => c.name === city);
      if (existing) {
        existing.count += 1;
      } else {
        let emoji = '📍';
        if (city.includes('Tokyo')) emoji = '🗼';
        else if (city.includes('Kyoto')) emoji = '⛩️';
        else if (city.includes('Sakai') || city.includes('Osaka')) emoji = '🍵';
        else if (city.includes('Nagano')) emoji = '❄️';
        else if (city.includes('Hội An')) emoji = '🏮';
        else if (city.includes('Đà Nẵng')) emoji = '🌊';
        else if (city.includes('Hà Nội')) emoji = '🏛️';
        else if (city.includes('Hồ Chí Minh')) emoji = '🏙️';

        list.push({
          name: city,
          count: 1,
          countryId: m.countryId,
          emoji,
        });
      }
    });

    return list;
  }, [memories]);

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories
      .filter((m) => {
        // Country filter
        if (filterCountry !== 'all' && m.countryId !== filterCountry) return false;
        if (locationFilter && (m.countryId !== locationFilter.country || memoryProvinceId(m) !== locationFilter.provinceId)) return false;

        // City filter
        if (selectedCity !== 'all') {
          const city = getCityName(m);
          if (city !== selectedCity) return false;
        }

        // Weather filter
        if (filterWeather !== 'all' && m.weather !== filterWeather) return false;

        // Search text query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = m.title.toLowerCase().includes(q) || m.titleJa.toLowerCase().includes(q);
          const matchLoc = m.locationName.toLowerCase().includes(q) || (m.specificSpot && m.specificSpot.toLowerCase().includes(q));
          const matchNotes = m.notes.toLowerCase().includes(q) || m.notesJa.toLowerCase().includes(q);
          const matchTag = m.tag.toLowerCase().includes(q);
          const matchedProvince = findProvince(m.countryId, q);
          const matchMappedLocation = matchedProvince && memoryProvinceId(m) === matchedProvince.id;

          if (!matchTitle && !matchLoc && !matchNotes && !matchTag && !matchMappedLocation) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [memories, filterCountry, selectedCity, filterWeather, searchQuery, sortOrder, locationFilter]);

  // Group memories by Month-Year for the vertical timeline
  const groupedTimeline = useMemo(() => {
    const groups: { [key: string]: Memory[] } = {};

    filteredMemories.forEach((m) => {
      const d = new Date(m.date);
      const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(m);
    });

    return groups;
  }, [filteredMemories]);

  const formatMonthYearHeader = (key: string) => {
    const [year, month] = key.split('-');
    if (lang === 'VI') {
      return `Tháng ${month}, ${year}`;
    }
    return `${year}年${parseInt(month, 10)}月`;
  };

  const tokyoMemoriesCount = memories.filter((m) => getCityName(m) === 'Tokyo').length;
  const selectedProvince = locationFilter
    ? (locationFilter.country === 'JP' ? allJapanPrefectures : allVietnamProvinces).find((province) => province.id === locationFilter.provinceId)
    : undefined;

  return (
    <div className="flex flex-col w-full pb-32 pt-2">
      {(onBack || selectedProvince) && (
        <div className="px-4 pb-3 flex items-center gap-2">
          {onBack && <button type="button" onClick={onBack} className="min-h-9 px-3 rounded-full bg-white border border-[#ddc0ba]/50 text-[#9e3c26] text-[12px] font-bold flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{lang === 'VI' ? 'Quay lại' : '戻る'}</button>}
          {selectedProvince && <span className="text-[12px] text-[#57423d] truncate">{lang === 'VI' ? selectedProvince.name : selectedProvince.nameJa} · {filteredMemories.length} {lang === 'VI' ? 'ký ức' : '件'}</span>}
          {selectedProvince && <button type="button" onClick={onClearLocationFilter} className="ml-auto text-[12px] text-[#9e3c26] underline whitespace-nowrap">{lang === 'VI' ? 'Bỏ lọc' : '解除'}</button>}
        </div>
      )}
      {/* 1. Header Widget & View Mode Switcher */}
      <div className="px-4 pb-3">
        <div className="p-4 rounded-3xl bg-white shadow-xs border border-[#ddc0ba]/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ffdad2] flex items-center justify-center text-[#9e3c26] flex-shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-[18px] text-[#1c1c17] font-display">
                    {lang === 'VI' ? 'Sổ Tay Ký Ức' : '旅の記憶帖'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#f1ede6] text-[#8a726c] text-[10px] font-bold font-mono">
                    {filteredMemories.length}/{memories.length}
                  </span>
                </div>
                <p className="text-[12px] text-[#57423d] font-body">
                  {lang === 'VI'
                    ? 'Những bài viết & trang nhật ký hành trình của tác giả'
                    : '旅路の足跡と心に残る情景の記録'}
                </p>
              </div>
            </div>

            {isAdmin ? (
              <button
                type="button"
                onClick={onOpenNewMemory}
                className="h-9 px-3.5 rounded-full bg-[#9e3c26] text-white text-[12px] font-bold font-display shadow-xs flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer hover:bg-[#822714]"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'VI' ? 'Viết mới' : '新規'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdmin}
                title="Đăng nhập để thêm hoặc sửa ký ức"
                className="h-8 px-2.5 rounded-full bg-[#f7f3eb] text-[#57423d] hover:text-[#9e3c26] text-[11px] font-bold font-display flex items-center gap-1 border border-[#ddc0ba]/40 transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* UC1: Search Bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-[#8a726c] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'VI'
                  ? 'Tìm kiếm theo tựa đề, địa điểm, thành phố, cảm nhận...'
                  : 'タイトル、場所、都市、思い出の記録を検索...'
              }
              className="w-full h-10 pl-10 pr-9 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] placeholder-[#8a726c] focus:outline-none focus:border-[#9e3c26] focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a726c] hover:text-[#1c1c17]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* UC1: Country Filter Tabs (Tất cả, Nhật Bản, Việt Nam) */}
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => {
                setFilterCountry('all');
                setSelectedCity('all');
              }}
              className={`flex-1 py-1.5 px-3 rounded-full text-[12px] font-display font-medium transition-all text-center ${
                filterCountry === 'all'
                  ? 'bg-[#9e3c26] text-white font-bold shadow-xs'
                  : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
              }`}
            >
              {lang === 'VI' ? 'Tất cả' : 'すべて'} ({memories.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterCountry('JP');
                if (selectedCity !== 'all') {
                  const cityObj = citiesList.find((c) => c.name === selectedCity);
                  if (cityObj && cityObj.countryId !== 'JP') setSelectedCity('all');
                }
              }}
              className={`flex-1 py-1.5 px-3 rounded-full text-[12px] font-display font-medium transition-all text-center flex items-center justify-center gap-1 ${
                filterCountry === 'JP'
                  ? 'bg-[#9e3c26] text-white font-bold shadow-xs'
                  : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
              }`}
            >
              <span>🇯🇵</span>
              <span>{lang === 'VI' ? 'Nhật Bản' : '日本'}</span>
              <span className="text-[10px] opacity-80">
                ({memories.filter((m) => m.countryId === 'JP').length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterCountry('VN');
                if (selectedCity !== 'all') {
                  const cityObj = citiesList.find((c) => c.name === selectedCity);
                  if (cityObj && cityObj.countryId !== 'VN') setSelectedCity('all');
                }
              }}
              className={`flex-1 py-1.5 px-3 rounded-full text-[12px] font-display font-medium transition-all text-center flex items-center justify-center gap-1 ${
                filterCountry === 'VN'
                  ? 'bg-[#9e3c26] text-white font-bold shadow-xs'
                  : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
              }`}
            >
              <span>🇻🇳</span>
              <span>{lang === 'VI' ? 'Việt Nam' : 'ベトナム'}</span>
              <span className="text-[10px] opacity-80">
                ({memories.filter((m) => m.countryId === 'VN').length})
              </span>
            </button>
          </div>

          {/* UC1: City Quick Filters (Một thành phố có thể có nhiều ký ức như Tokyo) */}
          <div className="border-t border-[#ddc0ba]/30 pt-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#8a726c] font-display flex items-center gap-1">
                <Compass className="w-3 h-3" />
                <span>{lang === 'VI' ? 'Lọc theo Thành phố / Điểm dừng:' : '都市別で絞り込む:'}</span>
              </span>
              {selectedCity !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCity('all')}
                  className="text-[10px] text-[#9e3c26] hover:underline font-bold"
                >
                  {lang === 'VI' ? 'Xem tất cả thành phố' : '解除'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setSelectedCity('all')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-display whitespace-nowrap transition-all ${
                  selectedCity === 'all'
                    ? 'bg-[#1c1c17] text-white font-bold shadow-xs'
                    : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
                }`}
              >
                {lang === 'VI' ? 'Tất cả nơi chốn' : '全都市'}
              </button>

              {citiesList
                .filter((c) => filterCountry === 'all' || c.countryId === filterCountry)
                .map((c) => {
                  const isSelected = selectedCity === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedCity(c.name)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-display whitespace-nowrap transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#9e3c26] text-white font-bold shadow-xs ring-2 ring-[#ffdad2]'
                          : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
                      }`}
                    >
                      <span>{c.emoji}</span>
                      <span>{placeLabel(c.countryId, c.name, lang)}</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-[#e7e1d5] text-[#8a726c]'}`}>
                        {c.count}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* UC2: Controls Bar: Mode Toggle (Timeline vs Grid) & Sort Order (Newest vs Oldest) */}
          <div className="mt-3 pt-2.5 border-t border-[#ddc0ba]/30 flex items-center justify-between gap-2">
            {/* View Mode: Timeline vs Grid */}
            <div className="flex items-center bg-[#f1ede6] p-0.5 rounded-full border border-[#ddc0ba]/40">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold font-display flex items-center gap-1.5 transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-[#9e3c26] text-white shadow-xs'
                    : 'text-[#57423d] hover:text-[#1c1c17]'
                }`}
                title={lang === 'VI' ? 'Xem dòng thời gian dọc' : 'タイムライン表示'}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'VI' ? 'Dòng thời gian' : 'タイムライン'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold font-display flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#9e3c26] text-white shadow-xs'
                    : 'text-[#57423d] hover:text-[#1c1c17]'
                }`}
                title={lang === 'VI' ? 'Xem dạng lưới thẻ' : 'グリッド表示'}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{lang === 'VI' ? 'Thẻ bài viết' : 'カード'}</span>
              </button>
            </div>

            {/* UC2: Sort Order: Newest to Oldest vs Oldest to Newest */}
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
              className="px-3 py-1 rounded-full bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[#57423d] hover:text-[#9e3c26] text-[11px] font-bold font-display flex items-center gap-1.5 transition-colors cursor-pointer"
              title={lang === 'VI' ? 'Đổi thứ tự thời gian' : '並び替え'}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#9e3c26]" />
              <span>
                {sortOrder === 'newest'
                  ? (lang === 'VI' ? 'Mới nhất trước ⬇' : '新しい順 ⬇')
                  : (lang === 'VI' ? 'Cũ nhất trước ⬆' : '古い順 ⬆')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Special City Spotlight Banner (e.g. for Tokyo where author lives) */}
      {selectedCity === 'Tokyo' && (
        <div className="px-4 pb-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#9e3c26]/10 via-[#be543c]/10 to-[#fdf9f1] border border-[#9e3c26]/30 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🗼</span>
              <div>
                <h3 className="font-bold text-[14px] text-[#9e3c26] font-display">
                  {lang === 'VI' ? 'Ký Ức Tokyo • Nơi Tác Giả Gắn Bó Sinh Sống' : '東京の記憶 • 筆者が暮らす街'}
                </h3>
                <p className="text-[11px] text-[#57423d] font-body mt-0.5 leading-relaxed">
                  {lang === 'VI'
                    ? `Hiện có ${tokyoMemoriesCount} bài viết ghi dấu tại nhiều địa điểm khác nhau: Shinjuku, Shimokitazawa, Asakusa, Shibuya, Ginza, Tsukishima...`
                    : `新宿、下北沢、浅草、渋谷、銀座、月島など多彩なスポットの思い出が詰まっています。`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCity('all')}
              className="text-[11px] text-[#8a726c] hover:text-[#1c1c17] flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Active Search / Location Filter Banner */}
      {searchQuery && (
        <div className="px-4 pb-3">
          <div className="p-3 rounded-2xl bg-[#ffdad2]/40 border border-[#9e3c26]/25 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-[#9e3c26] flex-shrink-0" />
              <span className="text-[12px] text-[#1c1c17] font-display font-medium truncate">
                {lang === 'VI' ? (
                  <>Đang lọc ký ức quanh: <strong className="text-[#9e3c26] font-bold">"{searchQuery}"</strong></>
                ) : (
                  <><strong className="text-[#9e3c26] font-bold">"{searchQuery}"</strong> 周辺の記憶を表示中</>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                if (onClearInitialSearch) onClearInitialSearch();
              }}
              className="text-[11px] font-bold text-[#9e3c26] hover:text-[#822714] font-display px-2.5 py-1 rounded-full bg-white border border-[#9e3c26]/20 shadow-2xs flex-shrink-0 cursor-pointer transition-all"
            >
              {lang === 'VI' ? 'Xem tất cả' : '全件表示'}
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN CONTENT AREA */}
      {filteredMemories.length === 0 ? (
        <div className="px-4 py-12">
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-[#ddc0ba]/60 shadow-xs">
            <span className="text-4xl block mb-2">🍃</span>
            <h3 className="font-bold text-[15px] text-[#1c1c17] font-display mb-1">
              {lang === 'VI' ? 'Không tìm thấy ký ức nào phù hợp' : '該当する思い出が見つかりませんでした'}
            </h3>
            <p className="text-[12px] text-[#57423d] font-body mb-4">
              {lang === 'VI'
                ? 'Hãy thử đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để xem toàn bộ ký ức.'
                : '検索条件を変更するか、すべての記憶を表示してください。'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterCountry('all');
                setSelectedCity('all');
                setFilterWeather('all');
                onClearLocationFilter?.();
              }}
              className="px-4 py-2 bg-[#9e3c26] text-white text-[12px] font-bold font-display rounded-full shadow-xs hover:bg-[#822714] transition-all"
            >
              {lang === 'VI' ? 'Xóa bộ lọc & xem tất cả' : 'フィルターを解除'}
            </button>
          </div>
        </div>
      ) : viewMode === 'timeline' ? (
        /* ============================================================== */
        /* UC2: VERTICAL TIMELINE VIEW (DÒNG THỜI GIAN THEO CHIỀU DỌC)     */
        /* ============================================================== */
        <div className="px-4">
          <div className="relative pl-6">
            {/* Continuous Vertical Timeline Spine (Trục dọc) */}
            <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-gradient-to-b from-[#9e3c26] via-[#d48344] to-[#ddc0ba]/40 rounded-full" />

            {/* Render grouped by month */}
            {Object.entries(groupedTimeline).map(([monthKey, items]) => (
              <div key={monthKey} className="mb-6 last:mb-0">
                {/* Month Milestone Header */}
                <div className="relative flex items-center gap-2 mb-4 -ml-6">
                  <div className="w-6 h-6 rounded-full bg-[#9e3c26] text-white flex items-center justify-center text-[10px] font-bold shadow-xs z-10">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#ffdad2] text-[#9e3c26] text-[11px] font-bold font-display border border-[#be543c]/20 shadow-xs">
                    {formatMonthYearHeader(monthKey)} • {items.length} {lang === 'VI' ? 'bài viết' : '件'}
                  </span>
                </div>

                {/* Timeline Items */}
                <div className="flex flex-col gap-4">
                  {items.map((memory) => {
                    const city = getCityName(memory);

                    return (
                      <div key={memory.id} className="relative group">
                        {/* Timeline Node Dot (Chấm mốc nối vào thẻ) */}
                        <div className="absolute -left-[19px] top-5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#9e3c26] shadow-xs group-hover:scale-125 group-hover:bg-[#9e3c26] transition-all z-10" />

                        {/* Memory Card along Timeline */}
                        <button
                          type="button"
                          onClick={() => onSelectMemory(memory)}
                          className="w-full text-left p-3 rounded-2xl bg-white shadow-sm border border-[#ddc0ba]/50 hover:border-[#9e3c26]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#9e3c26] transition-all cursor-pointer flex flex-col gap-2"
                        >
                          {/* Card Meta Header */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {/* Date badge */}
                              <span className="px-2.5 py-0.5 rounded-full bg-[#f7f3eb] text-[#1c1c17] text-[11px] font-mono font-bold border border-[#ddc0ba]/40">
                                {memory.date}
                              </span>

                              {/* City & spot tag */}
                              <span className="px-2.5 py-0.5 rounded-full bg-[#f1ede6] text-[#57423d] text-[11px] font-display font-medium flex items-center gap-1">
                                <span>{memory.countryId === 'JP' ? '🇯🇵' : '🇻🇳'}</span>
                                <span className="font-bold text-[#1c1c17]">{placeLabel(memory.countryId, city, lang, memoryProvinceId(memory))}</span>
                                {lang === 'VI' && memory.specificSpot && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[130px]">{memory.specificSpot}</span>
                                  </>
                                )}
                              </span>

                              {/* Weather Tag */}
                              <span className="text-[12px]" title={getWeatherName(memory.weather)}>
                                {getWeatherIcon(memory.weather)}
                              </span>
                            </div>

                            {/* Days ago & Favorite */}
                            <div className="flex items-center gap-1.5">
                              {memory.isFavorite && (
                                <Heart className="w-3.5 h-3.5 text-[#9e3c26] fill-current" />
                              )}
                            </div>
                          </div>

                          {/* Compact title and location */}
                          <div className="flex flex-col gap-1.5">
                            <h3 className="font-bold text-[16px] text-[#1c1c17] font-display group-hover:text-[#9e3c26] transition-colors line-clamp-1">
                              {lang === 'VI' ? memory.title : memory.titleJa}
                            </h3>

                            <div className="flex items-center gap-1 text-[11px] text-[#8a726c] font-body">
                              <MapPin className="w-3 h-3 text-[#9e3c26] flex-shrink-0" />
                              <span className="truncate">{memoryLocationLabel(memory, lang)}</span>
                            </div>

                          </div>

                          {/* Card Footer Action */}
                          <div className="flex items-center justify-end text-[11px]">
                            <span className="font-bold text-[#9e3c26] font-display flex items-center gap-0.5">
                              <span>{lang === 'VI' ? 'Đọc thêm' : '続きを読む'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* UC1: CARDS GRID VIEW (LƯỚI THẺ BÀI VIẾT)                        */
        /* ============================================================== */
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMemories.map((memory) => {
            const city = getCityName(memory);

            return (
              <div
                key={memory.id}
                onClick={() => onSelectMemory(memory)}
                className="p-3.5 rounded-3xl bg-white shadow-[0_4px_16px_rgba(88,71,56,0.06)] border border-[#ddc0ba]/40 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-[#9e3c26]/30 transition-all active:scale-[0.99] group"
              >
                {/* Polaroid Photo Frame */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#e5dfd5] border border-[#ddc0ba]/30">
                  <img
                    src={memory.image}
                    alt={memory.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Weather & City Tag */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-display font-medium flex items-center gap-1">
                      <span>{getWeatherIcon(memory.weather)}</span>
                      <span>{placeLabel(memory.countryId, city, lang, memoryProvinceId(memory))}</span>
                    </span>
                  </div>

                  {memory.isFavorite && (
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-[#9e3c26] flex items-center justify-center shadow-xs">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}

                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono">
                    {memory.date}
                  </div>
                </div>

                {/* Note Content */}
                <div className="flex flex-col gap-1.5 px-1">
                  <h3 className="font-bold text-[15px] text-[#1c1c17] font-display truncate group-hover:text-[#9e3c26] transition-colors">
                    {lang === 'VI' ? memory.title : memory.titleJa}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-[#57423d] font-body">
                    <MapPin className="w-3.5 h-3.5 text-[#9e3c26] flex-shrink-0" />
                    <span className="truncate">{lang === 'VI' ? (memory.specificSpot || memory.locationName) : memoryLocationLabel(memory, lang)}</span>
                  </div>

                  <p className="text-[12px] text-[#57423d] font-body line-clamp-2 leading-relaxed bg-[#fbf9f5] p-2 rounded-xl border border-[#ddc0ba]/20 mt-1">
                    {lang === 'VI'
                      ? memory.notes.replace(/\[.*?\]/g, '').replace(/#+/g, '').trim()
                      : memory.notesJa}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
