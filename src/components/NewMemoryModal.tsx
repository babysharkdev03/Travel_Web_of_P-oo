import React, { useState, useEffect } from 'react';
import { Memory, CountryId, Language } from '../types';
import { getT } from '../utils/translations';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  ChevronDown,
  MapPin,
  Calendar,
  Eye,
  Edit3,
} from 'lucide-react';
import { locationHierarchyData } from '../data/locationHierarchy';
import { NotionJournalEditor } from './NotionJournalEditor';
import { NotionMagazineView } from './NotionMagazineView';

interface NewMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: Memory) => void;
  lang: Language;
}

export const NewMemoryModal: React.FC<NewMemoryModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
  lang,
}) => {
  if (!isOpen) return null;
  const t = getT(lang);

  const [activeFormTab, setActiveFormTab] = useState<'editor' | 'preview'>('editor');

  // Page Icon (Emoji biểu tượng trang)
  const [pageIcon, setPageIcon] = useState('🌸');

  // 1. Country Selection (JP or VN)
  const [countryId, setCountryId] = useState<CountryId>('JP');

  // 2. Region Selection (with dropdown arrow)
  const availableRegions = locationHierarchyData[countryId];
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    availableRegions[0]?.id || 'kanto'
  );

  useEffect(() => {
    const firstReg = locationHierarchyData[countryId][0];
    if (firstReg) {
      setSelectedRegionId(firstReg.id);
    }
  }, [countryId]);

  // 3. Location / Province Selection (with dropdown arrow)
  const currentRegion =
    availableRegions.find((r) => r.id === selectedRegionId) ||
    availableRegions[0];
  const availableLocations = currentRegion?.locations || [];
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    availableLocations[0]?.id || ''
  );

  useEffect(() => {
    if (availableLocations.length > 0) {
      setSelectedLocationId(availableLocations[0].id);
    }
  }, [selectedRegionId]);

  // 4. Specific Spot (Tùy chọn - Có thể tự viết hoặc để trống)
  const [specificSpot, setSpecificSpot] = useState('');

  // 5. Memory Title & Date & Weather
  const [title, setTitle] = useState('');
  const [titleJa, setTitleJa] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState<Memory['weather']>('sakura');

  // 6. Cover Image (Ảnh chủ đề - Tách biệt với ảnh đăng trong bài)
  const [coverImageUrl, setCoverImageUrl] = useState(
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
  );

  // 7. Rich Text Content (Soạn thảo văn bản, chữ đậm nhạt, chèn ảnh bài viết)
  const [contentNotes, setContentNotes] = useState(
    `## Khoảnh khắc đáng nhớ tại vùng đất mới\nMột buổi sớm bình yên khi đặt chân tới nơi đây, không khí trong lành và cảnh sắc thơ mộng khiến mọi âu lo tan biến.\n\n> "Chuyến đi không chỉ là khám phá những miền đất mới, mà là tìm thấy những góc bình yên nhất trong tâm hồn."\n\n[image src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" size="medium" align="center" caption="Góc phố cổ kính rêu phong và những hàng quán trà truyền thống"]\n\n• Dạo bước qua những con ngõ nhỏ thanh tịnh\n• Thưởng thức tách trà ấm và bánh ngọt truyền thống\n• Ghi lại từng tia nắng len lỏi qua từng kẽ lá\n\n[callout icon=🌸 color=yellow]Những kỷ niệm đẹp nhất thường đến từ những khoảnh khắc giản dị và bất ngờ nhất.[/callout]\n\nCảm ơn những người bạn đồng hành đã cùng tạo nên một trang ký ức thật trọn vẹn.`
  );

  const emojiList = ['🌸', '⛩️', '🗾', '🏮', '🍵', '🍜', '📷', '🚂', '✈️', '🎒', '✨', '🍃', '🌊', '🗻'];

  const coverPresets = [
    {
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      label: 'Núi Phú Sĩ & Chùa Chureito',
    },
    {
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      label: 'Phố Cổ Sakai / Kyoto',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-l7JU_WyfH86k0gqcoouq69LdMTPBzQQ-sBbDmVT2CfU2WA8LW-P4z-Lp-lvdhe2B2xHzWs5DD14vZA4a_plTliXwYCjAlTb_-6izCa4fqkHIQMP_jh70jGDlPL4i2ihHGlkFMdA9hfc5jxfvVnW6qwWaXih_v8pPGzwQPLuaJ0RMb4zUBHmpQ5xFBLtwBw0ENBPGyALJuuu7BqdFFRQNCSExFjNCznqyn4k3f_jid-5u_2N5z2ZyzQ',
      label: 'Cổng Torii Đỏ Fushimi Inari',
    },
    {
      url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      label: 'Đèn Lồng Phố Cổ Hội An',
    },
    {
      url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      label: 'Vịnh Hạ Long Mây Nước',
    },
    {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      label: 'Ruộng Bậc Thang Sa Pa',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const locItem = availableLocations.find((l) => l.id === selectedLocationId);
    const locName = locItem ? locItem.name : 'Địa điểm';

    const fullLocationDisplay = specificSpot.trim()
      ? `${specificSpot.trim()}, ${locName}`
      : `${locName}, ${currentRegion.name}`;

    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      icon: pageIcon,
      title: title.trim(),
      titleJa: titleJa.trim() || title.trim(),
      countryId,
      regionId: selectedRegionId,
      locationName: fullLocationDisplay,
      specificSpot: specificSpot.trim(),
      date,
      daysAgoText: 'Vừa ghi lại',
      daysAgoTextJa: 'たった今',
      weather,
      image: coverImageUrl,
      imageAlt: title,
      tag:
        countryId === 'JP'
          ? `🇯🇵 ${locName.split(' ')[0]}`
          : `🇻🇳 ${locName.split(' ')[0]}`,
      postcardsCount: 1,
      memoryCount: 1,
      notes: contentNotes,
      notesJa: contentNotes,
      soundtrack: 'Giai điệu hành trình',
      rating: 5,
      isFavorite: true,
    };

    onAddMemory(newMem);
    onClose();
  };

  const selectedLocationObj = availableLocations.find(
    (l) => l.id === selectedLocationId
  );

  // Preview Memory object
  const previewMemoryObj: Memory = {
    id: 'preview',
    icon: pageIcon,
    title: title || 'Tựa đề bài viết ký ức',
    titleJa: titleJa || title || 'タイトル',
    countryId,
    regionId: selectedRegionId,
    locationName: specificSpot.trim()
      ? `${specificSpot.trim()}, ${selectedLocationObj?.name || ''}`
      : selectedLocationObj?.name || '',
    date,
    daysAgoText: 'Vừa đăng',
    daysAgoTextJa: '今日',
    weather,
    image: coverImageUrl,
    imageAlt: title,
    notes: contentNotes,
    notesJa: contentNotes,
    soundtrack: 'Giai điệu hành trình',
    tag: countryId === 'JP' ? '🇯🇵 Nhật Bản' : '🇻🇳 Việt Nam',
    postcardsCount: 1,
    memoryCount: 1,
    rating: 5,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-xs animate-fade-in font-display overflow-y-auto">
      <div
        className="w-full max-w-[880px] max-h-[94vh] overflow-y-auto rounded-3xl bg-[#fdf9f1] border border-[#ddc0ba]/70 shadow-2xl flex flex-col p-4 sm:p-6 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ddc0ba]/40">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-[#ffdad2] text-[#9e3c26] flex items-center justify-center font-bold text-[18px] shadow-2xs">
              {pageIcon}
            </span>
            <div>
              <h2 className="font-bold text-[17px] text-[#1c1c17] flex items-center gap-1.5">
                <span>Thêm Ký Ức Hành Trình Mới</span>
              </h2>
              <p className="text-[11px] text-[#57423d] font-body">
                Ảnh chủ đề đại diện bài viết • Trình bày bài viết gọn gàng trên Web, tự co giãn trên Điện thoại
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher: Soạn thảo / Xem trước */}
            <div className="flex items-center bg-[#ece8e0] p-0.5 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setActiveFormTab('editor')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                  activeFormTab === 'editor'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d] hover:text-[#1c1c17]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Soạn thảo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('preview')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                  activeFormTab === 'preview'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d] hover:text-[#1c1c17]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem trước</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-[#57423d] flex items-center justify-center hover:bg-[#ece8e0] transition-colors border border-[#ddc0ba]/40 shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeFormTab === 'preview' ? (
          /* ========================================================================= */
          /* LIVE PREVIEW OF ARTICLE WITH WEB VS PHONE SIMULATION                      */
          /* ========================================================================= */
          <div className="py-4 flex flex-col gap-4 animate-fade-in">
            <div className="p-3 rounded-2xl bg-white border border-[#ddc0ba]/40 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#57423d]">
              <span className="font-medium">
                💡 Xem trước bài viết: Người xem ở web sẽ xem được bài viết trình bày gọn gàng, xem ở điện thoại sẽ quy về như điện thoại.
              </span>
              <button
                type="button"
                onClick={() => setActiveFormTab('editor')}
                className="font-bold text-[#9e3c26] hover:underline"
              >
                ← Quay lại chỉnh sửa
              </button>
            </div>

            {/* Render Article View */}
            <div className="p-2 sm:p-4 bg-[#f8f5ee] rounded-3xl border border-[#ddc0ba]/50 shadow-2xs">
              <NotionMagazineView memory={previewMemoryObj} lang={lang} />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="h-11 px-7 rounded-full bg-[#9e3c26] text-white text-[13px] font-bold shadow-md hover:bg-[#822714] active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Hoàn tất & Đăng Bài Ký Ức</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORM EDITOR                                                              */
          /* ========================================================================= */
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {/* 1. CHỌN QUỐC GIA, VÙNG VÀ ĐỊA ĐIỂM (CÓ MŨI TÊN XUỐNG LIST ĐỂ CHỌN) */}
            <div className="p-4 rounded-3xl bg-white border border-[#ddc0ba]/60 shadow-2xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between border-b border-[#ddc0ba]/30 pb-2">
                <span className="font-bold text-[12.5px] text-[#1c1c17] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#9e3c26]" />
                  <span>1. Chọn Quốc Gia, Vùng Miền & Địa Điểm</span>
                </span>
                <span className="text-[11px] text-[#8a726c]">
                  Menu thả xuống có mũi tên lựa chọn
                </span>
              </div>

              {/* Quốc Gia */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <label className="text-[11.5px] font-bold text-[#57423d] uppercase tracking-wider">
                  Quốc Gia:
                </label>
                <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCountryId('JP')}
                    className={`py-2 px-3 rounded-2xl text-[12.5px] font-bold transition-all flex items-center justify-center gap-2 border ${
                      countryId === 'JP'
                        ? 'bg-[#9e3c26] text-white border-[#9e3c26] shadow-xs'
                        : 'bg-[#f7f3eb] text-[#57423d] border-[#ddc0ba]/50 hover:bg-[#ece8e0]'
                    }`}
                  >
                    <span className="text-[16px]">🇯🇵</span>
                    <span>Nhật Bản (Japan)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCountryId('VN')}
                    className={`py-2 px-3 rounded-2xl text-[12.5px] font-bold transition-all flex items-center justify-center gap-2 border ${
                      countryId === 'VN'
                        ? 'bg-[#9e3c26] text-white border-[#9e3c26] shadow-xs'
                        : 'bg-[#f7f3eb] text-[#57423d] border-[#ddc0ba]/50 hover:bg-[#ece8e0]'
                    }`}
                  >
                    <span className="text-[16px]">🇻🇳</span>
                    <span>Việt Nam (Vietnam)</span>
                  </button>
                </div>
              </div>

              {/* Vùng và Địa điểm (Có mũi tên xuống list) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {/* Chọn Vùng */}
                <div>
                  <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Vùng Miền:</span>
                    <span className="text-[10.5px] text-[#9e3c26] font-normal">
                      ({availableRegions.length} vùng)
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRegionId}
                      onChange={(e) => setSelectedRegionId(e.target.value)}
                      className="w-full h-11 pl-3.5 pr-9 rounded-2xl bg-[#fdfaf5] border border-[#ddc0ba]/60 text-[13px] text-[#1c1c17] font-semibold appearance-none focus:outline-none focus:border-[#9e3c26] shadow-2xs cursor-pointer"
                    >
                      {availableRegions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#8a726c] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Chọn Tỉnh / Thành Phố */}
                <div>
                  <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Tỉnh / Thành Phố:</span>
                    <span className="text-[10.5px] text-[#9e3c26] font-normal">
                      ({availableLocations.length} địa điểm)
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLocationId}
                      onChange={(e) => setSelectedLocationId(e.target.value)}
                      className="w-full h-11 pl-3.5 pr-9 rounded-2xl bg-[#fdfaf5] border border-[#ddc0ba]/60 text-[13px] text-[#1c1c17] font-semibold appearance-none focus:outline-none focus:border-[#9e3c26] shadow-2xs cursor-pointer"
                    >
                      {availableLocations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.emoji ? `${loc.emoji} ` : ''}
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#8a726c] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Địa điểm cụ thể (Tùy chọn: tự viết hoặc để trống) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-[#57423d] uppercase tracking-wider">
                    Địa Điểm Cụ Thể (Tùy chọn):
                  </label>
                  <span className="text-[11px] text-[#8a726c] font-body italic">
                    Có thể tự viết hoặc để trống
                  </span>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#9e3c26] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={specificSpot}
                    onChange={(e) => setSpecificSpot(e.target.value)}
                    placeholder="VD: Phố cổ Sakai, Cổng Torii Fushimi Inari, Chùa Cầu Hội An, Hồ Gươm..."
                    className="w-full h-11 pl-9 pr-3 rounded-2xl bg-[#fdfaf5] border border-[#ddc0ba]/60 text-[13px] text-[#1c1c17] focus:outline-none focus:border-[#9e3c26] shadow-2xs placeholder:text-[#8a726c]/60"
                  />
                </div>

                {/* Quick suggestions */}
                {selectedLocationObj?.suggestedSpots &&
                  selectedLocationObj.suggestedSpots.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      <span className="text-[10px] text-[#57423d] font-bold whitespace-nowrap">
                        Gợi ý nhanh:
                      </span>
                      {selectedLocationObj.suggestedSpots.map((spot, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSpecificSpot(spot)}
                          className="px-2.5 py-0.5 rounded-full bg-[#f1ede6] hover:bg-[#ece8e0] text-[#1c1c17] text-[10.5px] font-body whitespace-nowrap transition-colors border border-[#ddc0ba]/30"
                        >
                          + {spot}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* 2. ẢNH CHỦ ĐỀ (COVER IMAGE - RIÊNG BIỆT VỚI ẢNH ĐĂNG TRONG BÀI) */}
            <div className="p-4 rounded-3xl bg-white border border-[#ddc0ba]/60 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-[#ddc0ba]/30 pb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#9e3c26]" />
                  <span className="font-bold text-[12.5px] text-[#1c1c17]">
                    2. Ảnh Chủ Đề (Cover Image / Đại diện bài viết)
                  </span>
                </div>
                <span className="text-[10.5px] bg-[#f7f3eb] px-2.5 py-0.5 rounded-full text-[#57423d] font-bold">
                  Riêng biệt với ảnh đăng trong bài
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-36 h-20 rounded-2xl overflow-hidden bg-[#ece8e0] border border-[#ddc0ba]/50 flex-shrink-0 relative group">
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                    Ảnh chủ đề
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="Dán link ảnh chủ đề (https://...)"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#fdfaf5] border border-[#ddc0ba]/50 text-[12px] text-[#1c1c17]"
                  />

                  {/* Presets */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <span className="text-[10px] text-[#57423d] font-bold whitespace-nowrap">
                      Gợi ý ảnh chủ đề:
                    </span>
                    {coverPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImageUrl(preset.url)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors border ${
                          coverImageUrl === preset.url
                            ? 'bg-[#9e3c26] text-white border-[#9e3c26]'
                            : 'bg-[#f7f3eb] text-[#57423d] border-[#ddc0ba]/40 hover:bg-[#ece8e0]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BIỂU TƯỢNG, TỰA ĐỀ, NGÀY THÁNG, THỜI TIẾT */}
            <div className="p-4 rounded-3xl bg-white border border-[#ddc0ba]/60 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Emoji Selector */}
                <div className="relative">
                  <span className="block text-[11px] font-bold text-[#57423d] uppercase mb-1">
                    Biểu tượng:
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-11 h-11 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/60 flex items-center justify-center text-[22px] shadow-2xs">
                      {pageIcon}
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] sm:max-w-xs py-1">
                      {emojiList.slice(0, 7).map((em, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPageIcon(em)}
                          className={`w-7 h-7 rounded-lg text-[14px] flex items-center justify-center hover:bg-[#f1ede6] transition-colors ${
                            pageIcon === em
                              ? 'bg-[#9e3c26]/15 border border-[#9e3c26]'
                              : ''
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1">
                    Tựa Đề Ký Ức
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: S-a-k-a-i • Phố Cổ Rêu Phong & Cố Đô Kyoto..."
                    className="w-full h-11 px-3.5 rounded-2xl bg-[#fdfaf5] border border-[#ddc0ba]/60 text-[13.5px] font-bold text-[#1c1c17] focus:outline-none focus:border-[#9e3c26] shadow-2xs"
                  />
                </div>
              </div>

              {/* Date & Weather */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#9e3c26]" />
                    <span>Ngày Tháng</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#fdfaf5] border border-[#ddc0ba]/60 text-[12px] text-[#1c1c17]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1">
                    Thời Tiết Hành Trình
                  </label>
                  <select
                    value={weather}
                    onChange={(e) =>
                      setWeather(e.target.value as Memory['weather'])
                    }
                    className="w-full h-10 px-3 rounded-xl bg-[#fdfaf5] border border-[#ddc0ba]/60 text-[12px] text-[#1c1c17] font-semibold"
                  >
                    <option value="sakura">🌸 Hoa anh đào nở (Sakura)</option>
                    <option value="sunny">☀️ Nắng vàng ấm áp (Sunny)</option>
                    <option value="rainy">🌧️ Mưa phùn yên ả (Rainy)</option>
                    <option value="autumn">🍁 Thu vàng lá đỏ (Autumn)</option>
                    <option value="snowy">❄️ Tuyết trắng tinh khôi (Snowy)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. NỘI DUNG BÀI VIẾT VỚI TRÌNH SOẠN THẢO NOTION/WORD */}
            <div>
              <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>4. Nội Dung Bài Viết (Soạn thảo văn bản kiểu Notion / Word)</span>
                <span className="text-[11px] text-[#9e3c26] font-bold">
                  Bấm "+ Chèn ảnh bài viết" để chèn ảnh kèm chú thích
                </span>
              </label>

              <NotionJournalEditor
                value={contentNotes}
                onChange={setContentNotes}
                coverImage={coverImageUrl}
                title={title || 'Tựa đề bài viết'}
                locationName={
                  specificSpot.trim()
                    ? `${specificSpot.trim()}, ${selectedLocationObj?.name || ''}`
                    : selectedLocationObj?.name || ''
                }
                date={date}
                weather={weather}
                icon={pageIcon}
              />
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#ddc0ba]/40">
              <button
                type="button"
                onClick={() => setActiveFormTab('preview')}
                className="h-11 px-5 rounded-full bg-[#f7f3eb] text-[#1c1c17] text-[13px] font-bold hover:bg-[#ece8e0] transition-colors border border-[#ddc0ba]/40 flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-[#9e3c26]" />
                <span>Xem trước bài viết</span>
                <span className="text-[11px]">→</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 px-5 rounded-full bg-[#f7f3eb] text-[#57423d] text-[13px] font-bold hover:bg-[#ece8e0] transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="h-11 px-7 rounded-full bg-[#9e3c26] text-white text-[13px] font-bold shadow-md hover:bg-[#822714] active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Lưu & Đăng Bài Ký Ức</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
