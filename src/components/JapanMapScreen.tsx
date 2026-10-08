import React, { useState } from 'react';
import { CountryId, Language, Memory, Prefecture, ProfileData, Region } from '../types';
import { getT } from '../utils/translations';
import { JapanInteractiveMap } from './JapanInteractiveMap';
import { VietnamInteractiveMap } from './VietnamInteractiveMap';
import { memoriesAtProvince, memoryProvinceId, provinceNames } from '../utils/memoryLocations';
import {
  japanRegions,
  allJapanPrefectures,
  allVietnamProvinces,
} from '../data/regionsData';
import {
  Map,
  List,
  PenTool,
  Share2,
  Sparkles,
  Search,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface JapanMapScreenProps {
  country: CountryId;
  onChangeCountry: (c: CountryId) => void;
  onOpenNewMemory: () => void;
  onSelectMemory: (m: Memory) => void;
  onNavigateToMemories?: (country: CountryId, provinceId: string) => void;
  memories: Memory[];
  prefectures: Prefecture[];
  onUpdatePrefectureStatus: (id: string, status: 'visited' | 'dream' | 'not_visited') => void;
  vietnamRegions: Region[];
  vietnamProvinces?: Prefecture[];
  onUpdateVietnamProvinceStatus?: (id: string, status: 'visited' | 'dream' | 'not_visited') => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  lang: Language;
  profile: ProfileData;
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

const hiraToKata = (str: string) => {
  return str.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
};

const kataToHira = (str: string) => {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
};

const JAPAN_PREFECTURE_KANA: Record<string, { hira: string; kata: string }> = {
  hokkaido: { hira: 'ほっかいどう', kata: 'ホッカイドウ' },
  aomori: { hira: 'あおもり', kata: 'アオモリ' },
  iwate: { hira: 'いわて', kata: 'イワテ' },
  miyagi: { hira: 'みやぎ', kata: 'ミヤギ' },
  akita: { hira: 'あきた', kata: 'アキタ' },
  yamagata: { hira: 'やまがた', kata: 'ヤマガタ' },
  fukushima: { hira: 'ふくしま', kata: 'フクシマ' },
  tokyo: { hira: 'とうきょう', kata: 'トウキョウ' },
  kanagawa: { hira: 'かながわ', kata: 'カナガワ' },
  saitama: { hira: 'さいたま', kata: 'サイタマ' },
  chiba: { hira: 'ちば', kata: 'チバ' },
  ibaraki: { hira: 'いばらき', kata: 'イバラキ' },
  tochigi: { hira: 'とちぎ', kata: 'トチギ' },
  gunma: { hira: 'ぐんま', kata: 'グンマ' },
  yamanashi: { hira: 'やまなし', kata: 'ヤマナシ' },
  nagano: { hira: 'ながの', kata: 'ナガノ' },
  shizuoka: { hira: 'しずおか', kata: 'シズオカ' },
  niigata: { hira: 'にいがた', kata: 'ニイガタ' },
  toyama: { hira: 'とやま', kata: 'トヤマ' },
  ishikawa: { hira: 'いしかわ', kata: 'イシカワ' },
  fukui: { hira: 'ふくい', kata: 'フクイ' },
  gifu: { hira: 'ぎふ', kata: 'ギフ' },
  aichi: { hira: 'あいち', kata: 'アイチ' },
  mie: { hira: 'みえ', kata: 'ミエ' },
  shiga: { hira: 'しが', kata: 'シガ' },
  kyoto: { hira: 'きょうと', kata: 'キョウト' },
  osaka: { hira: 'おおさか', kata: 'オオサカ' },
  hyogo: { hira: 'ひょうご', kata: 'ヒョウゴ' },
  nara: { hira: 'なら', kata: 'ナラ' },
  wakayama: { hira: 'わかやま', kata: 'ワカヤマ' },
  tottori: { hira: 'とっとり', kata: 'トットリ' },
  shimane: { hira: 'しまね', kata: 'シマネ' },
  okayama: { hira: 'おかやま', kata: 'オカヤマ' },
  hiroshima: { hira: 'ひろしま', kata: 'ヒロシマ' },
  yamaguchi: { hira: 'やまぐち', kata: 'ヤマグチ' },
  tokushima: { hira: 'とくしま', kata: 'トクシマ' },
  kagawa: { hira: 'かがわ', kata: 'カガワ' },
  ehime: { hira: 'えひめ', kata: 'エヒメ' },
  kochi: { hira: 'こうち', kata: 'コウチ' },
  fukuoka: { hira: 'ふくおか', kata: 'フクオカ' },
  saga: { hira: 'さが', kata: 'サガ' },
  nagasaki: { hira: 'ながさき', kata: 'ナガサキ' },
  kumamoto: { hira: 'くまもと', kata: 'クマモト' },
  oita: { hira: 'おおいた', kata: 'オオイタ' },
  miyazaki: { hira: 'みやざき', kata: 'ミヤザキ' },
  kagoshima: { hira: 'かごしま', kata: 'カゴシマ' },
  okinawa: { hira: 'おきなわ', kata: 'オキナワ' },
};

export const JapanMapScreen: React.FC<JapanMapScreenProps> = ({
  country,
  onChangeCountry,
  onOpenNewMemory,
  onSelectMemory,
  onNavigateToMemories,
  memories,
  prefectures,
  onUpdatePrefectureStatus,
  vietnamRegions,
  vietnamProvinces,
  onUpdateVietnamProvinceStatus,
  isAdmin,
  onOpenAdmin,
  lang,
  profile,
}) => {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<'map' | 'detail'>('map');
  const [filterMode, setFilterMode] = useState<'all' | 'visited' | 'dream'>('all');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(japanRegions[2]); // Default Kanto
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({
    // Japan 8 regions
    hokkaido: true,
    tohoku: true,
    kanto: true,
    chubu: true,
    kansai: true,
    chugoku: true,
    shikoku: true,
    kyushu: true,
    // Vietnam 6 regions
    'trung-du-mien-nui-bac': true,
    'dong-bang-song-hong': true,
    'bac-trung-bo': true,
    'nam-trung-bo-tay-nguyen': true,
    'dong-nam-bo': true,
    'dong-bang-song-cuu-long': true,
  });
  const [shareCopied, setShareCopied] = useState(false);

  const provincesToUse = country === 'JP' ? prefectures : (vietnamProvinces || allVietnamProvinces);
  const regionsToUse = (country === 'JP' ? japanRegions : vietnamRegions).map((region) => {
    const provinceList = provincesToUse.filter((province) => province.regionId === region.id);
    return {
      ...region,
      visitedPrefectures: provinceList.filter((province) => province.status === 'visited').length,
      wishlistCount: provinceList.filter((province) => province.status === 'dream').length,
      memoryCount: memories.filter((memory) => memory.countryId === country && (
        provinceList.some((province) => province.id === memoryProvinceId(memory)) ||
        (!memoryProvinceId(memory) && memory.regionId === region.id)
      )).length,
      status: provinceList.some((province) => province.status === 'visited') ? 'visited' as const
        : provinceList.some((province) => province.status === 'dream') ? 'dream' as const : 'not_visited' as const,
    };
  });

  // Active region safely guarded against country mismatch
  const currentRegion = regionsToUse.find((region) => region.id === selectedRegion?.id)
    || (country === 'JP' ? regionsToUse[2] : regionsToUse[0]);

  // Keep selectedRegion synced with current country
  React.useEffect(() => {
    if (country === 'JP') {
      if (!selectedRegion || selectedRegion.countryId !== 'JP') {
        setSelectedRegion(japanRegions[2]); // Default Kanto
      }
    } else {
      if (!selectedRegion || selectedRegion.countryId !== 'VN') {
        setSelectedRegion(vietnamRegions[0]); // Default Trung Du & Miền Núi
      }
    }
  }, [country, vietnamRegions, selectedRegion]);

  // Toggle prefecture status (admin only)
  const handleTogglePrefectureStatus = (id: string, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!isAdmin) return;
    const currentPref = provincesToUse.find((p) => p.id === id);
    if (!currentPref) return;
    const nextStatus =
      currentPref.status === 'visited'
        ? 'dream'
        : currentPref.status === 'dream'
        ? 'not_visited'
        : 'visited';

    if (country === 'JP') {
      onUpdatePrefectureStatus(id, nextStatus);
    } else if (onUpdateVietnamProvinceStatus) {
      onUpdateVietnamProvinceStatus(id, nextStatus);
    }
  };

  const handleSetPrefectureStatus = (
    id: string,
    status: 'visited' | 'dream' | 'not_visited',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (country === 'JP') {
      onUpdatePrefectureStatus(id, status);
    } else if (onUpdateVietnamProvinceStatus) {
      onUpdateVietnamProvinceStatus(id, status);
    }
  };

  const toggleRegionExpand = (regId: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regId]: !prev[regId],
    }));
  };

  const scrollToProvince = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    const province = provincesToUse.find((item) => item.id === provinceId);
    const region = regionsToUse.find((item) => item.id === province?.regionId);
    if (region) setSelectedRegion(region);
    window.setTimeout(() => document.getElementById(`province-${provinceId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  };

  const selectRegion = (region: Region) => {
    setSelectedRegion(region);
    setSelectedProvinceId(null);
    window.setTimeout(() => document.getElementById('region-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  // Stats calculation
  const totalVisited = provincesToUse.filter((p) => p.status === 'visited').length;
  const totalWishlist = provincesToUse.filter((p) => p.status === 'dream').length;
  const totalMemoriesCount = country === 'JP'
    ? memories.filter((m) => m.countryId === 'JP').length
    : memories.filter((m) => m.countryId === 'VN').length;

  const visitedRegionsCount = regionsToUse.filter((r) =>
    provincesToUse.some((p) => r.prefectureIds.includes(p.id) && p.status === 'visited')
  ).length;
  const totalRegionsCount = regionsToUse.length;

  // Filter prefectures for detail list (Supports Vietnamese unaccented, Japanese Kanji/Kana, and English)
  const filteredPrefectures = provincesToUse.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const qNorm = normalizeSearch(q);
      const nameNorm = normalizeSearch(p.name);
      const capNorm = p.capital ? normalizeSearch(p.capital) : '';

      const matchName = p.name.toLowerCase().includes(q) || nameNorm.includes(qNorm);
      const matchJa = p.nameJa.toLowerCase().includes(q);
      const matchCapital = p.capital ? (p.capital.toLowerCase().includes(q) || capNorm.includes(qNorm)) : false;
      const matchAlias = provinceNames(p).some((name) => normalizeSearch(name).includes(qNorm));

      // Hiragana / Katakana bidirectional match
      const qHira = kataToHira(q);
      const qKata = hiraToKata(q);
      const matchHiraKata = p.nameJa.includes(qHira) || p.nameJa.includes(qKata);

      // Check kana dictionary for Japan prefectures
      const kanaData = JAPAN_PREFECTURE_KANA[p.id];
      const matchKanaDict = kanaData
        ? (kanaData.hira.includes(q) ||
           kanaData.kata.includes(q) ||
           kanaData.hira.includes(qHira) ||
           kanaData.kata.includes(qKata))
        : false;

      // Common aliases for major cities (e.g. Sài Gòn, TP HCM)
      const isHcm = p.id === 'tphcm' && (qNorm.includes('sai gon') || qNorm.includes('saigon') || qNorm.includes('hcm'));

      const matchRegion = regionsToUse.some((r) => {
        if (!r.prefectureIds.includes(p.id) && p.regionId !== r.id) return false;
        return (
          r.name.toLowerCase().includes(q) ||
          normalizeSearch(r.name).includes(qNorm) ||
          r.nameJa.toLowerCase().includes(q) ||
          r.nameJa.includes(qHira) ||
          r.nameJa.includes(qKata)
        );
      });

      if (!matchName && !matchJa && !matchCapital && !matchAlias && !matchHiraKata && !matchKanaDict && !isHcm && !matchRegion) {
        return false;
      }
    }

    if (filterMode === 'visited') return p.status === 'visited';
    if (filterMode === 'dream') return p.status === 'dream';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* 1. Country Switcher Pills */}
      <div className="px-4 pb-2">
        <div className="p-1 rounded-full bg-[#f1ede6] flex items-center justify-between border border-[#ddc0ba]/40 max-w-[280px] mx-auto shadow-xs">
          <button
            type="button"
            onClick={() => {
              onChangeCountry('JP');
              setSelectedRegion(japanRegions[2]);
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-[13px] font-bold font-display transition-all ${
              country === 'JP'
                ? 'bg-[#9e3c26] text-white shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            {t.countryToggleJp}
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeCountry('VN');
              setSelectedRegion(vietnamRegions[0]);
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-[13px] font-bold font-display transition-all ${
              country === 'VN'
                ? 'bg-[#9e3c26] text-white shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            {t.countryToggleVn}
          </button>
        </div>
      </div>

      {/* 2. Sub-Toggle Tabs: [Bản Đồ] vs [Chi Tiết] */}
      <div className="px-4 pb-3">
        <div className="p-1 rounded-2xl bg-white shadow-sm flex items-center justify-between border border-[#ddc0ba]/40">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2.5 rounded-xl text-[14px] font-bold font-display flex items-center justify-center gap-2 transition-all ${
              activeTab === 'map'
                ? 'bg-[#9e3c26] text-white shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{t.tabMap}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className={`flex-1 py-2.5 rounded-xl text-[14px] font-bold font-display flex items-center justify-center gap-2 transition-all ${
              activeTab === 'detail'
                ? 'bg-[#9e3c26] text-white shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            <List className="w-4 h-4" />
            <span>{t.tabDetail}</span>
          </button>
        </div>
      </div>

      {/* 3. Stats Row: Ký ức | Vùng đã ghé | Ước mơ */}
      <div className="px-4 pb-3">
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#ddc0ba]/40 grid grid-cols-3 divide-x divide-[#ddc0ba]/30 text-center">
          <div className="px-1">
            <span className="block font-bold text-[22px] text-[#9e3c26] font-display leading-tight">
              {totalMemoriesCount}
            </span>
            <span className="text-[11px] text-[#57423d] font-body">
              {t.statMemories}
            </span>
          </div>
          <div className="px-1">
            <span className="block font-bold text-[22px] text-[#3d653e] font-display leading-tight">
              {visitedRegionsCount}/{totalRegionsCount}
            </span>
            <span className="text-[11px] text-[#57423d] font-body">
              {t.statVisitedRegions}
            </span>
          </div>
          <div className="px-1">
            <span className="block font-bold text-[22px] text-[#1d6774] font-display leading-tight">
              {totalWishlist}
            </span>
            <span className="text-[11px] text-[#57423d] font-body">
              {t.statWishlist}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Filter Pills: Tất cả | Đã đến | Ước mơ */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-4 py-1.5 rounded-full text-[12px] font-display transition-all ${
              filterMode === 'all'
                ? 'bg-[#9e3c26] text-white font-bold shadow-xs'
                : 'bg-white text-[#57423d] border border-[#ddc0ba]/40 hover:bg-[#f7f3eb]'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('visited')}
            className={`px-4 py-1.5 rounded-full text-[12px] font-display transition-all ${
              filterMode === 'visited'
                ? 'bg-[#9e3c26] text-white font-bold shadow-xs'
                : 'bg-white text-[#57423d] border border-[#ddc0ba]/40 hover:bg-[#f7f3eb]'
            }`}
          >
            {t.legendVisited} ({totalVisited})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('dream')}
            className={`px-4 py-1.5 rounded-full text-[12px] font-display transition-all ${
              filterMode === 'dream'
                ? 'bg-[#9e3c26] text-white font-bold shadow-xs'
                : 'bg-white text-[#57423d] border border-[#ddc0ba]/40 hover:bg-[#f7f3eb]'
            }`}
          >
            {t.legendWishlist} ({totalWishlist})
          </button>
        </div>
      </div>

      {/* 5. TAB 1: [BẢN ĐỒ] (Map View) */}
      {activeTab === 'map' && (
        <>
          <div className="px-4 pb-3">
            <label className="block text-[12px] font-bold text-[#57423d] mb-1" htmlFor="map-province-search">
              {lang === 'VI' ? 'Tìm tỉnh / thành phố' : '都道府県・省市を検索'}
            </label>
            <input
              id="map-province-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={country === 'JP' ? 'Tokyo / 東京' : 'Hà Nội / ハノイ'}
              className="w-full h-10 px-3 rounded-xl bg-white border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17]"
            />
            {searchQuery && <div className="flex gap-1.5 overflow-x-auto mt-2 pb-1">{filteredPrefectures.map((province) => (
              <button key={province.id} type="button" onClick={() => scrollToProvince(province.id)} className="px-3 py-1.5 rounded-full bg-white border border-[#ddc0ba]/50 text-[12px] text-[#9e3c26] whitespace-nowrap">
                {lang === 'VI' ? province.name : province.nameJa}
              </button>
            ))}</div>}
          </div>
          <div className="px-4 pb-3">
            <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#ddc0ba]/40">
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9e3c26]" />
                  <span className="font-bold text-[16px] text-[#1c1c17] font-display">
                    {country === 'JP'
                      ? (lang === 'VI' ? 'Bản đồ Nhật Bản' : '日本地図')
                      : (lang === 'VI' ? 'Bản đồ Việt Nam' : 'ベトナム地図')}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad2] text-[#9e3c26] text-[11px] font-bold font-display">
                  {lang === 'VI' ? 'Chạm chọn vùng & xem tỉnh' : 'タップして選択'}
                </span>
              </div>

              {/* Map Canvas */}
              <div className="relative">
              {country === 'JP' ? (
                <JapanInteractiveMap
                  regions={regionsToUse}
                  selectedRegion={currentRegion}
                  onSelectRegion={selectRegion}
                  filterMode={filterMode}
                  lang={lang}
                />
              ) : (
                <VietnamInteractiveMap
                  regions={regionsToUse}
                  selectedRegion={currentRegion}
                  onSelectRegion={selectRegion}
                  filterMode={filterMode}
                  lang={lang}
                />
              )}
              <div className="absolute bottom-3 left-3 right-14 z-30 flex gap-1 overflow-x-auto no-scrollbar pb-1" aria-label={lang === 'VI' ? 'Tỉnh thành trên bản đồ' : '地図上の地域'}>
                {provincesToUse.filter((province) => province.regionId === currentRegion?.id).map((province) => (
                  <button
                    key={province.id}
                    type="button"
                    onClick={() => scrollToProvince(province.id)}
                    className={`px-2 py-1 rounded-full border shadow-sm text-[10px] font-bold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#9e3c26] ${selectedProvinceId === province.id ? 'bg-[#9e3c26] text-white border-[#9e3c26]' : 'bg-white/95 text-[#1c1c17] border-[#ddc0ba]/60 hover:bg-[#ffdad2]'}`}
                  >
                    {lang === 'VI' ? province.name : province.nameJa}
                  </button>
                ))}
              </div>
              </div>

              {/* Legend Row */}
              <div className="mt-3 flex items-center justify-center gap-6 text-[12px] font-body text-[#57423d] border-t border-[#ddc0ba]/30 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9e3c26]" />
                  <span>
                    {t.legendVisited} ({totalVisited})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#8a726c]" />
                  <span>
                    {t.legendWishlist} ({totalWishlist})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Region Quick Selector Pills (Direct access to all regions and provinces) */}
          {country === 'JP' && <div className="px-4 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[11px] font-bold text-[#8a726c] font-display whitespace-nowrap mr-1">
                {lang === 'VI' ? 'Vùng:' : '地域:'}
              </span>
              {regionsToUse.map((reg) => {
                const isSelected = currentRegion?.id === reg.id;
                const regProvs = provincesToUse.filter((p) => reg.prefectureIds.includes(p.id));
                const visitedCount = regProvs.filter((p) => p.status === 'visited').length;

                // Region label follows lang toggle
                const regLabel = lang === 'VI'
                  ? reg.name
                  : reg.nameJa;

                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => selectRegion(reg)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-display font-medium whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#9e3c26] text-white shadow-xs font-bold ring-2 ring-[#ffdad2]'
                        : 'bg-white text-[#57423d] border border-[#ddc0ba]/50 hover:bg-[#f7f3eb]'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: reg.color }}
                    />
                    <span>{regLabel}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-[#f1ede6] text-[#8a726c]'}`}>
                      {visitedCount}/{regProvs.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>}

          {/* Region Spotlight Details Card (Always populated with currentRegion) */}
          {currentRegion && (() => {
            const regionProvinces = provincesToUse.filter((p) => currentRegion.prefectureIds.includes(p.id) || p.regionId === currentRegion.id);
            const visitedInRegion = regionProvinces.filter((p) => p.status === 'visited').length;

            const regionDisplayName = lang === 'VI'
              ? (country === 'VN' ? currentRegion.name.replace(/^\d+\.\s*/, '') : currentRegion.name)
              : currentRegion.nameJa;

            const regionVisitedSummary = lang === 'VI'
              ? `${visitedInRegion}/${regionProvinces.length} tỉnh thành đã đi`
              : (country === 'JP'
                ? `${visitedInRegion}/${regionProvinces.length} 都道府県訪問済`
                : `${visitedInRegion}/${regionProvinces.length} 省市訪問済`);

            return (
              <div className="px-4 pb-3">
                <div id="region-detail" className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#ddc0ba]/40 animate-fade-in scroll-mt-20">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: currentRegion.color }}
                      />
                      <div>
                        {/* Region Title - follows lang */}
                        <h4 className="font-bold text-[15px] text-[#1c1c17] font-display">
                          {regionDisplayName}
                        </h4>
                        <p className="text-[11px] text-[#57423d] font-body">
                          {regionVisitedSummary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#57423d] font-body bg-[#fbf8f2] p-2.5 rounded-xl border border-[#ddc0ba]/30 leading-relaxed">
                    {lang === 'VI' ? currentRegion.description : currentRegion.descriptionJa}
                  </p>

                  {/* Complete province cards grid in this region - matching image.png */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-bold text-[#1c1c17] font-display">
                        {lang === 'VI'
                          ? `Danh sách các tỉnh thành (${regionProvinces.length} tỉnh):`
                          : (country === 'JP'
                            ? `構成都道府県 (${regionProvinces.length}):`
                            : `構成省市 (${regionProvinces.length}):`)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {regionProvinces.map((p) => {
                        const isVisited = p.status === 'visited';
                        const memoryCount = memoriesAtProvince(memories, country, p.id).length;
                        const isWishlist = p.status === 'dream';
                        const isUnvisited = !isVisited && !isWishlist;
                        const pName = lang === 'VI' ? p.name : p.nameJa;

                        return (
                          <div
                            key={p.id}
                            id={`province-${p.id}`}
                            role={isAdmin || memoryCount > 0 ? 'button' : undefined}
                            tabIndex={isAdmin || memoryCount > 0 ? 0 : undefined}
                            onKeyDown={(event) => {
                              if (event.key !== 'Enter' && event.key !== ' ') return;
                              event.preventDefault();
                              if (isAdmin) handleTogglePrefectureStatus(p.id, event);
                                  else if (memoryCount > 0) { setSelectedProvinceId(p.id); onNavigateToMemories?.(country, p.id); }
                            }}
                            onClick={(e) => {
                              if (isAdmin) {
                                handleTogglePrefectureStatus(p.id, e);
                              } else if (memoryCount > 0 && onNavigateToMemories) {
                                    setSelectedProvinceId(p.id);
                                    onNavigateToMemories(country, p.id);
                              }
                            }}
                            className={`group px-3.5 py-2.5 rounded-2xl bg-[#fbf9f5] border border-[#ddc0ba]/40 transition-all flex items-center justify-between gap-2 shadow-2xs ${
                              isAdmin
                                ? 'cursor-pointer hover:border-[#9e3c26]/50'
                                : memoryCount > 0
                                ? 'cursor-pointer hover:border-[#9e3c26] hover:bg-white hover:shadow-xs active:scale-[0.99]'
                                : 'hover:border-[#ddc0ba]'
                            }`}
                            title={
                              isAdmin
                                ? (lang === 'VI' ? 'Chạm để đổi trạng thái (Admin)' : 'タップして状態を変更')
                                : memoryCount > 0
                                ? (lang === 'VI' ? `Chạm để xem các ký ức tại ${pName}` : `タップして${pName}の記憶を見る`)
                                : undefined
                            }
                          >
                            {/* Tên thành phố / tỉnh thành */}
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`font-medium text-[14px] text-[#1c1c17] font-display min-w-0 truncate ${
                                  isVisited ? 'group-hover:text-[#9e3c26] transition-colors' : ''
                                }`}
                              >
                                {pName}
                              </span>
                              {isVisited && memoryCount > 0 && (
                                <span className="text-[10px] text-[#9e3c26] font-display hidden sm:inline-block font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {lang === 'VI' ? '• Xem ký ức' : '• 記憶'}
                                </span>
                              )}
                            </div>

                            {/* Chỉ hiển thị 1 trong 3 kết quả trạng thái: Đã đi / Ước mơ / Chưa đi */}
                            <div className="flex items-center flex-shrink-0">
                              {isVisited && (
                                <span
                                  onClick={(e) => {
                                    if (isAdmin) {
                                      handleTogglePrefectureStatus(p.id, e);
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 bg-[#3d653e] text-white shadow-2xs transition-all ${
                                    isAdmin ? 'hover:bg-[#2d4d2e]' : 'group-hover:bg-[#2d4d2e]'
                                  }`}
                                  title={
                                    isAdmin
                                      ? (lang === 'VI' ? 'Admin: Chạm để đổi trạng thái' : 'Admin: 状態を変更')
                                      : (lang === 'VI' ? `Xem các ký ức tại ${pName}` : `${pName}の記憶を見る`)
                                  }
                                >
                                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                  <span>{memoryCount > 0 ? `${memoryCount} ${lang === 'VI' ? 'ký ức' : '件'}` : (lang === 'VI' ? 'Đã đi' : '訪問済')}</span>
                                  {memoryCount > 0 && onNavigateToMemories && (
                                    <ArrowRight className="w-3 h-3 text-white/80 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                  )}
                                </span>
                              )}
                              {isWishlist && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 bg-[#d48344] text-white shadow-2xs">
                                  <Star className="w-3 h-3 fill-current flex-shrink-0" />
                                  <span>{lang === 'VI' ? 'Ước mơ' : '行きたい'}</span>
                                </span>
                              )}
                              {isUnvisited && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#8a726c] bg-[#ece8e0]/80 border border-[#ddc0ba]/40">
                                  <span>{lang === 'VI' ? 'Chưa đi' : '未訪問'}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* 6. TAB 2: [CHI TIẾT] (Prefectures / Provinces List) */}
      {activeTab === 'detail' && (
        <div className="px-4 pb-4">
          <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#ddc0ba]/40">
            {/* Header & Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[16px] text-[#1c1c17] font-display">
                    {country === 'JP'
                      ? (lang === 'VI' ? 'Chi Tiết 47 Tỉnh Thành Nhật Bản' : '日本47都道府県の全記録')
                      : (lang === 'VI' ? 'Chi Tiết 63 Tỉnh Thành Việt Nam' : 'ベトナム63省市の全記録')}
                  </h3>
                  <p className="text-[12px] text-[#57423d] font-body">
                    {country === 'JP'
                      ? (lang === 'VI' ? 'Khám phá 8 vùng địa lý truyền thống' : '伝統の8地方を巡る旅')
                      : (lang === 'VI' ? 'Khám phá 6 phân vùng địa lý Việt Nam' : '6地域を巡る旅')}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f7f3eb] text-[#9e3c26] font-bold text-[12px] font-display border border-[#ddc0ba]/40">
                  {totalVisited}/{provincesToUse.length} ({Math.round((totalVisited / provincesToUse.length) * 100)}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#f1ede6] mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#be543c] to-[#9e3c26] rounded-full transition-all duration-500"
                  style={{ width: `${(totalVisited / provincesToUse.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#8a726c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  country === 'JP'
                    ? (lang === 'VI'
                      ? 'Tìm kiếm tỉnh thành (VD: Tokyo, Kyoto, Osaka, 東京)...'
                      : '都道府県を検索 (例: 東京都、京都府、とうきょう、Tokyo)...')
                    : (lang === 'VI'
                      ? 'Tìm kiếm tỉnh thành (VD: Hà Nội, Đà Nẵng, Sài Gòn, ハノイ)...'
                      : '省市を検索 (例: ハノイ、ダナン、Hà Nội)...')
                }
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[13px] text-[#1c1c17] placeholder-[#8a726c] focus:outline-none focus:border-[#9e3c26]"
              />
            </div>

            {/* Grouped by Regions */}
            <div className="flex flex-col gap-2.5">
              {filteredPrefectures.length === 0 ? (
                <div className="p-6 text-center bg-[#fdf9f1] rounded-2xl border border-dashed border-[#ddc0ba]/60">
                  <p className="text-[13px] font-bold text-[#1c1c17] mb-1">
                    {lang === 'VI' ? 'Không tìm thấy tỉnh thành nào phù hợp' : '該当する都道府県が見つかりませんでした'}
                  </p>
                  <p className="text-[11px] text-[#57423d] mb-2">
                    {lang === 'VI' ? 'Hãy thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc "Tất cả".' : '検索条件やフィルターを変更してお試しください。'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterMode('all');
                    }}
                    className="px-3.5 py-1.5 bg-[#9e3c26] text-white text-[11px] font-bold rounded-full shadow-xs hover:bg-[#822714]"
                  >
                    {lang === 'VI' ? 'Xóa bộ lọc & xem tất cả' : 'フィルター解除'}
                  </button>
                </div>
              ) : (
                regionsToUse.map((region, idx) => {
                  const regionPrefectures = filteredPrefectures.filter((p) =>
                    region.prefectureIds.includes(p.id) || p.regionId === region.id
                  );

                  if (regionPrefectures.length === 0 && (searchQuery || filterMode !== 'all')) return null;

                  const isExpanded = expandedRegions[region.id] ?? true;
                  const regVisited = provincesToUse.filter((p) => region.prefectureIds.includes(p.id) && p.status === 'visited').length;
                  const regionMemoriesCount = country === 'JP'
                    ? memories.filter((m) => m.countryId === 'JP' && (m.regionId === region.id || regionPrefectures.some((p) => m.locationName.includes(p.name)))).length
                    : memories.filter((m) => m.countryId === 'VN' && (m.regionId === region.id || regionPrefectures.some((p) => m.locationName.includes(p.name)))).length;

                  // Region name follows lang toggle
                  const displayRegionName = lang === 'VI'
                    ? (country === 'VN' ? region.name.replace(/^\d+\.\s*/, '') : region.name)
                    : region.nameJa;

                  const regionSubtitle = lang === 'VI'
                    ? `${regVisited} / ${region.prefectureIds.length} Tỉnh • ${regionMemoriesCount} Ký ức`
                    : (country === 'JP'
                      ? `${regVisited} / ${region.prefectureIds.length} 都道府県 • ${regionMemoriesCount} 記録`
                      : `${regVisited} / ${region.prefectureIds.length} 省市 • ${regionMemoriesCount} 記録`);

                  return (
                    <div
                      key={region.id}
                      className="rounded-3xl border border-[#ddc0ba]/45 overflow-hidden bg-white shadow-xs"
                    >
                      {/* Region Header matching image.png exactly */}
                      <div
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        onClick={() => toggleRegionExpand(region.id)}
                        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleRegionExpand(region.id); } }}
                        className="p-4 bg-white flex items-center justify-between cursor-pointer hover:bg-[#fcfaf5] transition-colors border-b border-[#ddc0ba]/30"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Circle number badge like (05) in image */}
                          <div className="w-10 h-10 rounded-full bg-[#e3effb] text-[#1d6774] flex items-center justify-center font-bold text-[14px] font-mono shadow-2xs flex-shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div className="min-w-0">
                            {/* Region Title */}
                            <h4 className="font-bold text-[18px] text-[#1c1c17] font-display leading-tight">
                              {displayRegionName}
                            </h4>
                            {/* Subtitle */}
                            <p className="text-[12px] text-[#57423d] font-body mt-0.5">
                              {regionSubtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[#57423d]">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {/* Prefectures list - Clean cards matching image.png */}
                      {isExpanded && (
                        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#fdf9f1]/35">
                          {regionPrefectures.map((pref) => {
                            const isVisited = pref.status === 'visited';
                            const memoryCount = memoriesAtProvince(memories, country, pref.id).length;
                            const isWishlist = pref.status === 'dream';
                            const prefDisplayName = lang === 'VI' ? pref.name : pref.nameJa;

                            const isUnvisited = !isVisited && !isWishlist;

                            return (
                              <div
                                key={pref.id}
                                id={`detail-province-${pref.id}`}
                                role={isAdmin || memoryCount > 0 ? 'button' : undefined}
                                tabIndex={isAdmin || memoryCount > 0 ? 0 : undefined}
                                onKeyDown={(event) => {
                                  if (event.key !== 'Enter' && event.key !== ' ') return;
                                  event.preventDefault();
                                  if (isAdmin) handleTogglePrefectureStatus(pref.id, event);
                                  else if (memoryCount > 0) { setSelectedProvinceId(pref.id); onNavigateToMemories?.(country, pref.id); }
                                }}
                                onClick={(e) => {
                                  if (isAdmin) {
                                    handleTogglePrefectureStatus(pref.id, e);
                                  } else if (memoryCount > 0 && onNavigateToMemories) {
                                    setSelectedProvinceId(pref.id);
                                    onNavigateToMemories(country, pref.id);
                                  }
                                }}
                                className={`group px-3.5 py-2.5 rounded-2xl bg-[#fbf9f5] border border-[#ddc0ba]/40 transition-all flex items-center justify-between gap-2 shadow-2xs ${
                                  isAdmin
                                    ? 'cursor-pointer hover:border-[#9e3c26]/50'
                                    : memoryCount > 0
                                    ? 'cursor-pointer hover:border-[#9e3c26] hover:bg-white hover:shadow-xs active:scale-[0.99]'
                                    : 'hover:border-[#ddc0ba]'
                                }`}
                                title={
                                  isAdmin
                                    ? (lang === 'VI' ? 'Chạm để đổi trạng thái (Admin)' : 'タップして状態を変更')
                                    : memoryCount > 0
                                    ? (lang === 'VI' ? `Chạm để xem các ký ức tại ${prefDisplayName}` : `タップして${prefDisplayName}の記憶を見る`)
                                    : undefined
                                }
                              >
                                {/* Tên thành phố / tỉnh thành */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span
                                    className={`font-medium text-[14px] text-[#1c1c17] font-display min-w-0 truncate ${
                                      isVisited ? 'group-hover:text-[#9e3c26] transition-colors' : ''
                                    }`}
                                  >
                                    {prefDisplayName}
                                  </span>
                                  {isVisited && memoryCount > 0 && (
                                    <span className="text-[10px] text-[#9e3c26] font-display hidden sm:inline-block font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      {lang === 'VI' ? '• Xem ký ức' : '• 記憶'}
                                    </span>
                                  )}
                                </div>

                                {/* Chỉ hiển thị 1 trong 3 kết quả trạng thái: Đã đi / Ước mơ / Chưa đi */}
                                <div className="flex items-center flex-shrink-0">
                                  {isVisited && (
                                    <span
                                      onClick={(e) => {
                                        if (isAdmin) {
                                          handleTogglePrefectureStatus(pref.id, e);
                                        }
                                      }}
                                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 bg-[#3d653e] text-white shadow-2xs transition-all ${
                                        isAdmin ? 'hover:bg-[#2d4d2e]' : 'group-hover:bg-[#2d4d2e]'
                                      }`}
                                      title={
                                        isAdmin
                                          ? (lang === 'VI' ? 'Admin: Chạm để đổi trạng thái' : 'Admin: 状態を変更')
                                          : (lang === 'VI' ? `Xem các ký ức tại ${prefDisplayName}` : `${prefDisplayName}の記憶を見る`)
                                      }
                                    >
                                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                      <span>{memoryCount > 0 ? `${memoryCount} ${lang === 'VI' ? 'ký ức' : '件'}` : (lang === 'VI' ? 'Đã đi' : '訪問済')}</span>
                                      {memoryCount > 0 && onNavigateToMemories && (
                                        <ArrowRight className="w-3 h-3 text-white/80 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                      )}
                                    </span>
                                  )}
                                  {isWishlist && (
                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 bg-[#d48344] text-white shadow-2xs">
                                      <Star className="w-3 h-3 fill-current flex-shrink-0" />
                                      <span>{lang === 'VI' ? 'Ước mơ' : '行きたい'}</span>
                                    </span>
                                  )}
                                  {isUnvisited && (
                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#8a726c] bg-[#ece8e0]/80 border border-[#ddc0ba]/40">
                                      <span>{lang === 'VI' ? 'Chưa đi' : '未訪問'}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Action CTA Bar */}
      <div className="px-4 pt-1 pb-6 flex items-center gap-2">
        {isAdmin ? (
          <button
            type="button"
            onClick={onOpenNewMemory}
            className="flex-1 h-12 rounded-full bg-[#9e3c26] text-white font-bold text-[14px] shadow-md hover:bg-[#822714] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-display"
          >
            <PenTool className="w-4 h-4" />
            <span>{t.writeNewMemory} (Admin)</span>
          </button>
        ) : (
          <div className="flex-1 h-12 px-4 rounded-full bg-white border border-[#ddc0ba]/50 shadow-xs flex items-center justify-between font-display text-[12px] text-[#57423d]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#3d653e] animate-pulse"></span>
              <span className="truncate font-semibold text-[#1c1c17]">
                {lang === 'VI' ? `Chế độ xem nhật ký của ${profile.authorName}` : `${profile.authorNameJa || profile.authorName}の旅の足跡 (閲覧モード)`}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[#9e3c26] font-bold whitespace-nowrap pl-1">
                {totalMemoriesCount} {t.memories}
              </span>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[11px] font-bold text-[#8a726c] hover:text-[#9e3c26] underline"
              >
                Admin
              </button>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleShare}
          title={t.shareJourney}
          className="w-12 h-12 rounded-full bg-white border border-[#ddc0ba]/50 text-[#57423d] hover:text-[#9e3c26] shadow-xs flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {shareCopied && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1c1c17] text-white text-[12px] font-display shadow-lg animate-fade-in">
          {lang === 'VI' ? '✓ Đã sao chép liên kết chia sẻ hành trình!' : '✓ 旅の共有リンクをコピーしました！'}
        </div>
      )}
    </div>
  );
};
