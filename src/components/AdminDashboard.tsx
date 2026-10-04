import React, { useState, useMemo } from 'react';
import { Memory, Prefecture, ProfileData, CountryId, Language, Region, PrefectureStatus } from '../types';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Star,
  LogOut,
  Save,
  BookOpen,
  Map,
  User,
  Sparkles,
  Search,
  Download,
  Upload,
  RotateCcw,
  Copy,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  Filter,
  Check,
  Tag,
  Globe,
  Compass,
} from 'lucide-react';
import { locationHierarchyData } from '../data/locationHierarchy';
import { japanRegions, allJapanPrefectures, vietnamRegions, allVietnamProvinces } from '../data/regionsData';
import { NotionJournalEditor } from './NotionJournalEditor';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  memories: Memory[];
  onAddMemory: (m: Memory) => void;
  onUpdateMemory: (m: Memory) => void;
  onDeleteMemory: (id: string) => void;
  prefectures: Prefecture[];
  onUpdatePrefectureStatus: (id: string, status: PrefectureStatus) => void;
  vietnamRegions: Region[];
  onUpdateVietnamRegionStatus: (id: string, status: PrefectureStatus) => void;
  vietnamProvinces?: Prefecture[];
  onUpdateVietnamProvinceStatus?: (id: string, status: PrefectureStatus) => void;
  places?: any[];
  onAddPlace?: (p: any) => void;
  onDeletePlace?: (id: string) => void;
  profile: ProfileData;
  onUpdateProfile: (p: ProfileData) => void;
  onResetAllData: () => void;
  onImportData: (data: any) => void;
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  prefectures,
  onUpdatePrefectureStatus,
  vietnamRegions,
  onUpdateVietnamRegionStatus,
  vietnamProvinces,
  onUpdateVietnamProvinceStatus,
  profile,
  onUpdateProfile,
  onResetAllData,
  onImportData,
  lang,
}) => {
  // Navigation tabs (UC1, UC2, UC3, Sync - Removed places)
  const [activeTab, setActiveTab] = useState<'memories' | 'prefectures' | 'profile' | 'sync'>('memories');

  // In-app Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // -------------------------------------------------------------
  // UC1: MEMORIES MANAGEMENT STATE
  // -------------------------------------------------------------
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<'all' | CountryId>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Pop-up confirmation for deleting memory (UC1 requirement)
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | null>(null);

  // Form states for memory creation/editing
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  // UC4: Notion link sync state
  const [isNotionSyncOpen, setIsNotionSyncOpen] = useState(false);
  const [notionInputUrl, setNotionInputUrl] = useState('');
  const [isSyncingNotion, setIsSyncingNotion] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formTitleJa, setFormTitleJa] = useState('');
  const [formIcon, setFormIcon] = useState('🌸');
  const [formCountry, setFormCountry] = useState<CountryId>('JP');

  const availableRegions = locationHierarchyData[formCountry] || [];
  const [formRegionId, setFormRegionId] = useState<string>(availableRegions[0]?.id || 'kanto');
  const currentRegion = availableRegions.find((r) => r.id === formRegionId) || availableRegions[0];
  const availableLocations = currentRegion?.locations || [];
  const [formLocationId, setFormLocationId] = useState<string>(availableLocations[0]?.id || 'tokyo');
  const [formSpecificSpot, setFormSpecificSpot] = useState('');

  const [formDate, setFormDate] = useState('2026-10-01');
  const [formWeather, setFormWeather] = useState<Memory['weather']>('sunny');
  const [formTag, setFormTag] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLeftArtImage, setFormLeftArtImage] = useState('');
  const [formRightArtImage, setFormRightArtImage] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formNotesJa, setFormNotesJa] = useState('');
  const [formSoundtrack, setFormSoundtrack] = useState('Ghibli Summer Rain • Joe Hisaishi Vibe ♫');

  // Notion icons preset
  const notionIcons = ['🌸', '⛩️', '🍵', '☕', '🏮', '📷', '🏔️', '♨️', '🦌', '🗼', '🌿', '🌊', '🎨', '🚂', '🏯', '✨'];

  // Image Presets
  const imagePresets = [
    { name: 'Tokyo Rain', url: 'https://lh3.googleusercontent.com/aida/AEtjO1WRld_vcTQyJSwa0_3pxU9wycVNGQVeVZAZIM5afYW-zJqTUroWEhcyGTtU2eO2j-2Qbcnx5lLCel9iX-2eUpFUZ29PU1A5fdbz6e2cbkAjlZs67pzUqEzCbSjNAY3446TyW5e0Zqv8jRfDRrntMRRvpStEtN4qGpnegtJirXQPl5dBIpto81I4OWZDPxovrzb-POas2KHQc0U7-d_mB7Lz1M12YOJeu_Qj5Atz1SGx5s13NkII1t3azuv3' },
    { name: 'Kyoto Autumn', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_B5K2eFw6z-iH7m-33Y06zY67f_z2G54-1lGv3q4cK5Z7t8P9-oR2dE_a1s2d3f4g5h6j7k8l9m' },
    { name: 'Hội An Lanterns', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2yXjK_V73jL7fD8z3-yK4P_33b8a1G_8a726c_m9f5' },
    { name: 'Đà Nẵng Coastal', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9LG6y4hGgO0a_cs6YboZNtdW9EhH1-Vn1EtR9C2kEBZu7FzYLgxsR78_Gc4O72HCroGXApDD014k0CruzqfguZwY4gL3ubb9FjfpzoBDV8gg_mgpg9KNvrbbZrd4I6QJC9HHmiqGL9rkuvhYEav_mK1SKHTw5UZM0n6pw8PgNJ-FfkDtmIe4vSudg9EYUT5Bg2ad2ZyEotkJgUifP6TbMXSpD-kIxQPyVH1jXwO_xloMJEijIE2hYmZjwU6bJIng6SgU' },
  ];

  // Quick Tags preset for quick filtering / adding
  const popularTags = ['#Tokyo', '#Kyoto', '#HoiAn', '#DaNang', '#Cafe', '#Sakura', '#Autumn', '#Onsen', '#Matcha'];

  // Extract all available years from memories
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    memories.forEach((m) => {
      if (m.date) {
        const y = m.date.slice(0, 4);
        if (y) years.add(y);
      }
    });
    return Array.from(years).sort().reverse();
  }, [memories]);

  // UC1: Filter & Search Memories based on keywords, hashtags, time
  const filteredMemories = useMemo(() => {
    return memories
      .filter((m) => {
        // Keyword & hashtag match
        if (searchKeyword.trim()) {
          const kw = searchKeyword.toLowerCase().trim();
          const cleanKw = kw.startsWith('#') ? kw.slice(1) : kw;
          const matchTitle = m.title.toLowerCase().includes(cleanKw) || m.titleJa.toLowerCase().includes(cleanKw);
          const matchLocation = m.locationName.toLowerCase().includes(cleanKw) || (m.specificSpot && m.specificSpot.toLowerCase().includes(cleanKw));
          const matchTag = m.tag && m.tag.toLowerCase().includes(cleanKw);
          const matchNotes = m.notes && m.notes.toLowerCase().includes(cleanKw);
          if (!matchTitle && !matchLocation && !matchTag && !matchNotes) return false;
        }

        // Tag pill filter
        if (selectedTag) {
          const cleanTag = selectedTag.replace('#', '').toLowerCase();
          if (!m.tag || !m.tag.toLowerCase().includes(cleanTag)) return false;
        }

        // Country filter
        if (filterCountry !== 'all' && m.countryId !== filterCountry) return false;

        // Year filter
        if (filterYear !== 'all') {
          if (!m.date || !m.date.startsWith(filterYear)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [memories, searchKeyword, selectedTag, filterCountry, filterYear, sortOrder]);

  const handleStartAddMemory = () => {
    setEditingMemory(null);
    setFormTitle('');
    setFormTitleJa('');
    setFormIcon('🌸');
    setFormCountry('JP');
    setFormRegionId('kanto');
    setFormLocationId('tokyo');
    setFormSpecificSpot('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormWeather('sunny');
    setFormTag('#Tokyo #Japan');
    setFormQuote('');
    setFormImageUrl(imagePresets[0].url);
    setFormLeftArtImage('');
    setFormRightArtImage('');
    setFormNotes('');
    setFormNotesJa('');
    setFormSoundtrack('Ghibli Summer Rain • Joe Hisaishi Vibe ♫');
    setIsAddingMemory(true);
  };

  const handleStartEditMemory = (m: Memory) => {
    setEditingMemory(m);
    setFormTitle(m.title);
    setFormTitleJa(m.titleJa || m.title);
    setFormIcon(m.icon || '🌸');
    setFormCountry(m.countryId);
    setFormRegionId(m.regionId || (m.countryId === 'JP' ? 'kanto' : 'trung-bo'));
    setFormLocationId(m.locationName ? m.locationName.split(',')[0].toLowerCase().trim() : 'tokyo');
    setFormSpecificSpot(m.specificSpot || '');
    setFormDate(m.date || '2026-10-01');
    setFormWeather(m.weather || 'sunny');
    setFormTag(m.tag || '');
    setFormQuote(m.quote || '');
    setFormImageUrl(m.image || imagePresets[0].url);
    setFormLeftArtImage(m.leftArtImage || (m.articleImages ? m.articleImages[0] : '') || '');
    setFormRightArtImage(m.rightArtImage || (m.articleImages ? m.articleImages[1] : '') || '');
    setFormNotes(m.notes || '');
    setFormNotesJa(m.notesJa || m.notes || '');
    setFormSoundtrack(m.soundtrack || 'Ghibli Summer Rain • Joe Hisaishi Vibe ♫');
    setIsAddingMemory(true);
  };

  const handleSaveMemoryForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('⚠️ Vui lòng nhập tiêu đề bài viết!');
      return;
    }

    const matchedLoc = availableLocations.find((l) => l.id === formLocationId);
    const locName = matchedLoc ? matchedLoc.name : formLocationId;
    const regName = currentRegion ? currentRegion.name : '';
    const fullLocationDisplay = `${locName}, ${regName}`;

    if (editingMemory) {
      const updated: Memory = {
        ...editingMemory,
        icon: formIcon,
        title: formTitle,
        titleJa: formTitleJa || formTitle,
        countryId: formCountry,
        regionId: formRegionId,
        locationName: fullLocationDisplay,
        specificSpot: formSpecificSpot.trim(),
        date: formDate,
        weather: formWeather,
        tag: formTag || editingMemory.tag,
        notes: formNotes,
        notesJa: formNotesJa || formNotes,
        image: formImageUrl || editingMemory.image,
        leftArtImage: formLeftArtImage,
        rightArtImage: formRightArtImage,
        articleImages: [formLeftArtImage, formRightArtImage].filter(Boolean),
        quote: formQuote,
        soundtrack: formSoundtrack,
      };
      onUpdateMemory(updated);
      showToast('✓ Đã cập nhật bài viết thành công!');
    } else {
      const created: Memory = {
        id: `mem-${Date.now()}`,
        icon: formIcon,
        title: formTitle,
        titleJa: formTitleJa || formTitle,
        countryId: formCountry,
        regionId: formRegionId,
        locationName: fullLocationDisplay,
        specificSpot: formSpecificSpot.trim(),
        date: formDate,
        daysAgoText: 'Vừa thêm',
        daysAgoTextJa: '新規',
        weather: formWeather,
        image: formImageUrl || imagePresets[0].url,
        imageAlt: formTitle,
        leftArtImage: formLeftArtImage,
        rightArtImage: formRightArtImage,
        articleImages: [formLeftArtImage, formRightArtImage].filter(Boolean),
        quote: formQuote,
        layoutStyle: 'notion-magazine',
        tag: formTag || (formCountry === 'JP' ? '#Tokyo #Japan' : '#HoiAn #Vietnam'),
        postcardsCount: 1,
        memoryCount: 1,
        notes: formNotes,
        notesJa: formNotesJa || formNotes,
        soundtrack: formSoundtrack,
        rating: 5,
        isFavorite: true,
      };
      onAddMemory(created);
      showToast('✓ Đã thêm bài viết mới vào nhật ký hành trình!');
    }

    setIsAddingMemory(false);
    setEditingMemory(null);
  };

  const handleConfirmDeleteMemory = () => {
    if (!memoryToDelete) return;
    onDeleteMemory(memoryToDelete.id);
    showToast(`✓ Đã xóa bài viết "${memoryToDelete.title}"`);
    setMemoryToDelete(null);
  };

  // UC4: Tự động đồng bộ bài viết từ link Notion
  const handleSyncFromNotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notionInputUrl.trim()) return;

    setIsSyncingNotion(true);

    const rawUrl = notionInputUrl.trim();
    let extractedTitle = 'Nhật Ký Hành Trình Notion';
    let country: CountryId = 'JP';
    let regionId = 'kanto';
    let locationName = 'Tokyo, Kanto, Nhật Bản';
    let spot = 'Tokyo';
    let icon = '🌸';

    try {
      const urlObj = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      const pathname = urlObj.pathname;
      const parts = pathname.split('/').filter(Boolean);
      const lastPart = parts[parts.length - 1] || '';
      const cleanSlug = lastPart.replace(/-[a-f0-9]{32}$/i, '').replace(/^[a-f0-9]{32}$/i, '');
      if (cleanSlug) {
        extractedTitle = decodeURIComponent(cleanSlug)
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    } catch (err) {
      extractedTitle = 'Ký Ức Mới Từ Notion';
    }

    const lower = (rawUrl + ' ' + extractedTitle).toLowerCase();
    if (lower.includes('hoi-an') || lower.includes('hoian') || lower.includes('da-nang') || lower.includes('danang') || lower.includes('vietnam') || lower.includes('viet-nam') || lower.includes('hanoi') || lower.includes('ha-noi') || lower.includes('saigon') || lower.includes('hue')) {
      country = 'VN';
      if (lower.includes('hanoi') || lower.includes('ha-noi')) {
        regionId = 'dong-bang-song-hong';
        locationName = 'Hà Nội, Đồng Bằng Sông Hồng';
        spot = 'Hồ Hoàn Kiếm & 36 Phố Phường';
        icon = '🏛️';
      } else if (lower.includes('saigon') || lower.includes('ho-chi-minh')) {
        regionId = 'dong-nam-bo';
        locationName = 'TP. Hồ Chí Minh, Đông Nam Bộ';
        spot = 'Bến Bạch Đằng & Hẻm Nhỏ';
        icon = '🏙️';
      } else {
        regionId = 'nam-trung-bo-tay-nguyen';
        locationName = 'Hội An, Quảng Nam, Duyên Hải Nam Trung Bộ';
        spot = 'Phố Cổ Sông Hoài & Cầu Chùa';
        icon = '🏮';
      }
    } else {
      country = 'JP';
      if (lower.includes('kyoto')) {
        regionId = 'kansai';
        locationName = 'Kyoto, Kansai, Nhật Bản';
        spot = 'Fushimi Inari & Rừng Trúc Arashiyama';
        icon = '⛩️';
      } else if (lower.includes('sakai') || lower.includes('osaka')) {
        regionId = 'kansai';
        locationName = 'Sakai, Osaka, Kansai';
        spot = 'Phố Cổ Sakai & Lăng Mộ Daisen';
        icon = '🍵';
      } else if (lower.includes('nagano')) {
        regionId = 'chubu';
        locationName = 'Nagano, Chubu, Nhật Bản';
        spot = 'Suối Nước Nóng Jigokudani';
        icon = '❄️';
      } else {
        regionId = 'kanto';
        locationName = 'Tokyo, Kanto, Nhật Bản';
        spot = 'Shinjuku & Shimokitazawa';
        icon = '🌸';
      }
    }

    const newMemory: Memory = {
      id: `mem-notion-${Date.now()}`,
      icon,
      title: extractedTitle,
      titleJa: country === 'JP' ? `Notionより同期 • ${extractedTitle}` : `${extractedTitle} (ベトナム)`,
      countryId: country,
      regionId,
      locationName,
      specificSpot: spot,
      date: new Date().toISOString().split('T')[0],
      daysAgoText: 'Vừa đồng bộ từ Notion',
      daysAgoTextJa: 'Notionから同期',
      weather: 'sakura',
      image: imagePresets[0].url,
      imageAlt: extractedTitle,
      layoutStyle: 'notion-magazine',
      quote: `Trang nhật ký được đồng bộ tự động từ Notion cá nhân của tác giả Thu Pham.`,
      tag: country === 'JP' ? '#Notion #Tokyo #Japan' : '#Notion #Vietnam #TravelJournal',
      postcardsCount: 4,
      memoryCount: 1,
      notes: `## ${extractedTitle}
[callout icon=${icon} color=yellow]Bài viết này được đồng bộ tự động từ liên kết Notion cá nhân: [${rawUrl}](${rawUrl})[/callout]

Je m'appelle Thư. J'ai 18 ans au moment où j'écris ceci. Mỗi chuyến đi là một trang nhật ký được viết bằng bước chân và trái tim.

> "Bienvenue dans le monde d'une petite fille essayant de sortir de sa coquille!”

[image-side src="${imagePresets[1].url}" align="left" caption="Khung cảnh tĩnh lặng và an yên được ghi lại trong hành trình"]
Buổi sớm mai khi dạo bước qua từng con ngõ nhỏ, không khí thanh tịnh và mùi cà phê sớm mai thoang thoảng mang lại cảm giác an yên khó tả. Mọi viên đá lát đường đều như thì thầm những câu chuyện đáng nhớ.
[/image-side]

---

### Điểm nhấn đáng nhớ:
• [color:terracotta]Khám phá những góc phố cổ kính[/color] mộc mạc và sâu lắng
• [bg:yellow]Tận hưởng từng phút giây an yên[/bg] cùng tách trà và bản nhạc lofi yêu thích
• Lưu giữ những bức ảnh polaroid đong đầy cảm xúc`,
      notesJa: `${extractedTitle}の思い出。Notionページ(${rawUrl})より自動同期された美しい旅の記録。`,
      soundtrack: 'Chill songs • Thư Phạm',
      musicPlaylistTitle: 'Chill songs • Thư Phạm',
      rating: 5,
      isFavorite: true,
    };

    setTimeout(() => {
      onAddMemory(newMemory);
      setIsSyncingNotion(false);
      setIsNotionSyncOpen(false);
      setNotionInputUrl('');
      showToast(`✓ Đã đồng bộ thành công bài viết "${extractedTitle}" từ Notion!`);
    }, 450);
  };

  // -------------------------------------------------------------
  // UC2: PREFECTURES & REGIONS ACCORDION STATE
  // -------------------------------------------------------------
  const [prefectureCountryTab, setPrefectureCountryTab] = useState<CountryId>('JP');
  const [prefectureStatusFilter, setPrefectureStatusFilter] = useState<'all' | 'visited' | 'wishlist' | 'unvisited'>('all');
  const [searchPrefectureText, setSearchPrefectureText] = useState('');

  // Accordion open/close state for regions (defaults open for first 3)
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({
    kanto: true,
    kansai: true,
    chubu: true,
    'trung-du-mien-nui-bac': true,
    'dong-bang-song-hong': true,
    'bac-trung-bo': true,
    'nam-trung-bo-tay-nguyen': true,
  });

  const toggleRegionAccordion = (regionId: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regionId]: !prev[regionId],
    }));
  };

  const vietnamProvincesList = vietnamProvinces || allVietnamProvinces;
  const currentProvinces = prefectureCountryTab === 'JP' ? prefectures : vietnamProvincesList;
  const currentRegions = prefectureCountryTab === 'JP' ? japanRegions : vietnamRegions;

  // Filter prefectures based on status and search query
  const filteredPrefectureList = useMemo(() => {
    return currentProvinces.filter((p) => {
      if (searchPrefectureText.trim()) {
        const query = searchPrefectureText.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query) || p.nameJa.includes(query);
        const matchCapital = p.capital && p.capital.toLowerCase().includes(query);
        if (!matchName && !matchCapital) return false;
      }

      if (prefectureStatusFilter !== 'all' && p.status !== prefectureStatusFilter) {
        return false;
      }

      return true;
    });
  }, [currentProvinces, searchPrefectureText, prefectureStatusFilter]);

  const visitedCountJP = prefectures.filter((p) => p.status === 'visited').length;
  const wishlistCountJP = prefectures.filter((p) => p.status === 'wishlist').length;
  const unvisitedCountJP = prefectures.filter((p) => p.status === 'unvisited').length;

  const visitedCountVN = vietnamProvincesList.filter((p) => p.status === 'visited').length;
  const wishlistCountVN = vietnamProvincesList.filter((p) => p.status === 'wishlist').length;
  const unvisitedCountVN = vietnamProvincesList.filter((p) => p.status === 'unvisited').length;

  // -------------------------------------------------------------
  // UC3: PROFILE & SOCIAL BIO STATE
  // -------------------------------------------------------------
  const [profileName, setProfileName] = useState(profile.authorName);
  const [profileTitle, setProfileTitle] = useState(profile.travelerTitle);
  const [profileTitleJa, setProfileTitleJa] = useState(profile.travelerTitleJa);
  const [profileQuoteVi, setProfileQuoteVi] = useState(profile.quoteVi);
  const [profileQuoteJa, setProfileQuoteJa] = useState(profile.quoteJa);
  const [profileAvatar, setProfileAvatar] = useState(profile.avatarUrl);
  const [profileFacebook, setProfileFacebook] = useState(profile.facebookUrl || '');
  const [profileInstagram, setProfileInstagram] = useState(profile.instagramUrl || '');
  const [profileNotion, setProfileNotion] = useState(profile.notionUrl || '');
  const [profileEmail, setProfileEmail] = useState(profile.contactEmail || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('⚠️ Vui lòng nhập họ tên tác giả!');
      return;
    }

    const updatedProfile: ProfileData = {
      authorName: profileName.trim(),
      travelerTitle: profileTitle.trim(),
      travelerTitleJa: profileTitleJa.trim(),
      quoteVi: profileQuoteVi.trim(),
      quoteJa: profileQuoteJa.trim(),
      avatarUrl: profileAvatar.trim() || profile.avatarUrl,
      facebookUrl: profileFacebook.trim(),
      instagramUrl: profileInstagram.trim(),
      notionUrl: profileNotion.trim(),
      contactEmail: profileEmail.trim(),
    };

    onUpdateProfile(updatedProfile);
    showToast('✓ Đã lưu hồ sơ tác giả và cập nhật giao diện thành công!');
  };

  // -------------------------------------------------------------
  // SYNC & BACKUP STATE
  // -------------------------------------------------------------
  const [jsonExportText, setJsonExportText] = useState('');
  const [jsonImportText, setJsonImportText] = useState('');

  const handleGenerateExport = () => {
    const data = {
      memories,
      prefectures,
      vietnamRegions,
      profile,
      exportedAt: new Date().toISOString(),
    };
    setJsonExportText(JSON.stringify(data, null, 2));
    showToast('✓ Đã tạo dữ liệu JSON sao lưu!');
  };

  const handleApplyImport = () => {
    try {
      const parsed = JSON.parse(jsonImportText);
      onImportData(parsed);
      showToast('✓ Đã nạp dữ liệu khôi phục thành công!');
      setJsonImportText('');
    } catch (e) {
      showToast('❌ Lỗi cú pháp JSON không hợp lệ!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-fade-in font-display select-none">
      <div
        className="w-full max-w-[920px] h-[92vh] rounded-3xl bg-[#fdf9f1] border border-[#ddc0ba]/60 shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Popup Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1c1c17] text-white text-[12px] font-bold shadow-xl animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-white border-b border-[#ddc0ba]/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#ffdad2] flex items-center justify-center text-[#9e3c26] shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-[17px] text-[#1c1c17]">Bảng Quản Trị Hành Trình (Admin Portal)</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#9e3c26] text-white text-[10px] font-bold">PRO</span>
              </div>
              <p className="text-[11px] text-[#57423d] font-body truncate">
                Quản lý bài viết ký ức, trạng thái 47 tỉnh thành và hồ sơ tác giả
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="h-8 px-3 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] hover:bg-[#ffdad6] text-[11px] font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0] flex items-center justify-center transition-colors shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="px-5 py-2.5 bg-[#f7f3eb] border-b border-[#ddc0ba]/40 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {/* UC1 Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('memories');
              setIsAddingMemory(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'memories'
                ? 'bg-[#9e3c26] text-white shadow-xs'
                : 'bg-white text-[#57423d] hover:bg-[#ece8e0]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ký Ức & Bài Viết ({memories.length})</span>
          </button>

          {/* UC2 Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('prefectures')}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'prefectures'
                ? 'bg-[#9e3c26] text-white shadow-xs'
                : 'bg-white text-[#57423d] hover:bg-[#ece8e0]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Trạng Thái Vùng Tỉnh ({prefectures.length})</span>
          </button>

          {/* UC3 Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#9e3c26] text-white shadow-xs'
                : 'bg-white text-[#57423d] hover:bg-[#ece8e0]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Hồ Sơ Tác Giả & MXH</span>
          </button>

          {/* Sync Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'sync'
                ? 'bg-[#9e3c26] text-white shadow-xs'
                : 'bg-white text-[#57423d] hover:bg-[#ece8e0]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Đồng Bộ & Sao Lưu</span>
          </button>
        </div>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 select-text">
          {/* ========================================================= */}
          {/* UC1: QUẢN LÝ BÀI VIẾT (KÝ ỨC) */}
          {/* ========================================================= */}
          {activeTab === 'memories' && (
            <div className="flex flex-col gap-4">
              {/* Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[16px] text-[#1c1c17] flex items-center gap-2">
                    <span>Quản Lý Tất Cả Bài Viết & Ký Ức</span>
                    <span className="text-[12px] text-[#8a726c] font-normal">
                      (Tìm thấy {filteredMemories.length} / {memories.length} bài)
                    </span>
                  </h3>
                  <p className="text-[12px] text-[#57423d] font-body">
                    Tìm kiếm theo thời gian, từ khóa, hashtag; chỉnh sửa nội dung hoặc xóa bài viết có xác nhận
                  </p>
                </div>

                {!isAddingMemory && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsNotionSyncOpen(!isNotionSyncOpen)}
                      className={`h-9 px-3.5 rounded-full font-bold text-[12px] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all flex-shrink-0 cursor-pointer ${
                        isNotionSyncOpen
                          ? 'bg-[#1c1c17] text-white ring-2 ring-[#9e3c26]'
                          : 'bg-[#f7f3eb] text-[#1c1c17] border border-[#ddc0ba]/60 hover:bg-[#ece8e0]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#9e3c26]" />
                      <span>{isNotionSyncOpen ? 'Đóng Notion Sync' : '⚡ Thêm bằng Link Notion'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStartAddMemory}
                      className="h-9 px-4 rounded-full bg-[#9e3c26] text-white font-bold text-[12px] flex items-center gap-1.5 shadow-xs hover:bg-[#822714] active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Ký Ức Mới</span>
                    </button>
                  </div>
                )}
              </div>

              {/* UC4: Bảng Nhập & Đồng Bộ Bài Viết Tự Động Từ Notion Link */}
              {isNotionSyncOpen && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#fbf8f2] via-white to-[#f7f3eb] border-2 border-[#9e3c26]/40 shadow-sm flex flex-col gap-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#1c1c17] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        N
                      </span>
                      <div>
                        <h4 className="font-bold text-[14px] text-[#1c1c17]">
                          Đồng Bộ Tự Động Bài Viết Từ Notion (UC4)
                        </h4>
                        <p className="text-[11px] text-[#57423d]">
                          Dán đường dẫn trang Notion của bạn — hệ thống sẽ tự động đồng bộ tiêu đề, ảnh bìa, ngày tháng và nội dung phong cách Notion
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNotionSyncOpen(false)}
                      className="text-[12px] text-[#8a726c] hover:text-[#1c1c17]"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSyncFromNotion} className="flex flex-col sm:flex-row gap-2 mt-1">
                    <input
                      type="url"
                      required
                      value={notionInputUrl}
                      onChange={(e) => setNotionInputUrl(e.target.value)}
                      placeholder="Dán link Notion tại đây (VD: https://notion.so/phamthu/Hanh-Trinh-Sakai-Osaka-123456...)"
                      className="flex-1 h-11 px-4 rounded-2xl bg-white border border-[#ddc0ba]/60 text-[13px] text-[#1c1c17] focus:outline-none focus:border-[#9e3c26] shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={isSyncingNotion || !notionInputUrl.trim()}
                      className="h-11 px-5 rounded-2xl bg-[#9e3c26] hover:bg-[#822714] disabled:opacity-50 text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 flex-shrink-0 cursor-pointer"
                    >
                      {isSyncingNotion ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang đồng bộ...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Đồng Bộ Ngay ⚡</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Form Thêm / Sửa Bài Viết (UC1) */}
              {isAddingMemory && (
                <form
                  onSubmit={handleSaveMemoryForm}
                  className="p-5 rounded-3xl bg-white border border-[#9e3c26]/50 shadow-md flex flex-col gap-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#ddc0ba]/30">
                    <span className="font-bold text-[15px] text-[#9e3c26] flex items-center gap-1.5">
                      {editingMemory ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editingMemory ? 'Chỉnh Sửa Bài Viết / Ký Ức' : 'Tạo Ký Ức Hành Trình Mới'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingMemory(false);
                        setEditingMemory(null);
                      }}
                      className="text-[12px] text-[#57423d] hover:text-[#1c1c17] font-semibold"
                    >
                      Hủy bỏ
                    </button>
                  </div>

                  {/* 1. Chọn Quốc Gia */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                      1. Chọn Quốc Gia
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 max-w-[360px]">
                      <button
                        type="button"
                        onClick={() => {
                          setFormCountry('JP');
                          setFormRegionId('kanto');
                          setFormLocationId('tokyo');
                        }}
                        className={`py-2 px-3 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 border ${
                          formCountry === 'JP'
                            ? 'bg-[#9e3c26] text-white border-[#9e3c26] shadow-xs'
                            : 'bg-[#f7f3eb] text-[#57423d] border-[#ddc0ba]/40'
                        }`}
                      >
                        <span>🇯🇵</span>
                        <span>Nhật Bản</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormCountry('VN');
                          setFormRegionId('trung-bo');
                          setFormLocationId('hoi-an');
                        }}
                        className={`py-2 px-3 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 border ${
                          formCountry === 'VN'
                            ? 'bg-[#9e3c26] text-white border-[#9e3c26] shadow-xs'
                            : 'bg-[#f7f3eb] text-[#57423d] border-[#ddc0ba]/40'
                        }`}
                      >
                        <span>🇻🇳</span>
                        <span>Việt Nam</span>
                      </button>
                    </div>
                  </div>

                  {/* 2 & 3: Chọn vùng & Tỉnh/Thành phố (Mũi tên chỉ xuống) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                        2. Chọn Vùng Miền
                      </label>
                      <div className="relative">
                        <select
                          value={formRegionId}
                          onChange={(e) => {
                            setFormRegionId(e.target.value);
                            const reg = availableRegions.find((r) => r.id === e.target.value);
                            if (reg && reg.locations.length > 0) {
                              setFormLocationId(reg.locations[0].id);
                            }
                          }}
                          className="w-full h-11 pl-3 pr-9 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] font-semibold appearance-none focus:outline-none focus:border-[#9e3c26] cursor-pointer"
                        >
                          {availableRegions.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#8a726c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                        3. Chọn Tỉnh / Thành Phố
                      </label>
                      <div className="relative">
                        <select
                          value={formLocationId}
                          onChange={(e) => setFormLocationId(e.target.value)}
                          className="w-full h-11 pl-3 pr-9 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] font-semibold appearance-none focus:outline-none focus:border-[#9e3c26] cursor-pointer"
                        >
                          {availableLocations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#8a726c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Địa danh cụ thể */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                      Địa Danh Cụ Thể (Specific Spot / Điểm Đến)
                    </label>
                    <input
                      type="text"
                      value={formSpecificSpot}
                      onChange={(e) => setFormSpecificSpot(e.target.value)}
                      placeholder="VD: Chùa Kinkaku-ji, Rừng trúc Arashiyama, Cầu Nhật Bản..."
                      className="w-full h-10 px-3.5 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] focus:outline-none focus:border-[#9e3c26]"
                    />
                  </div>

                  {/* Tiêu đề tiếng Việt & tiếng Nhật */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                        Tiêu Đề Bài Viết (Tiếng Việt) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="VD: Chiều Mưa Phố Cổ Hội An..."
                        className="w-full h-10 px-3.5 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] font-bold focus:outline-none focus:border-[#9e3c26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                        Tiêu Đề Bài Viết (Tiếng Nhật)
                      </label>
                      <input
                        type="text"
                        value={formTitleJa}
                        onChange={(e) => setFormTitleJa(e.target.value)}
                        placeholder="VD: ホイアンの静かな雨の午後..."
                        className="w-full h-10 px-3.5 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] focus:outline-none focus:border-[#9e3c26]"
                      />
                    </div>
                  </div>

                  {/* Biểu tượng Notion icon & Thời tiết & Ngày tháng */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Notion icon */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                        Icon Notion ({formIcon})
                      </label>
                      <div className="flex flex-wrap gap-1 p-2 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50">
                        {notionIcons.map((ic) => (
                          <button
                            key={ic}
                            type="button"
                            onClick={() => setFormIcon(ic)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform ${
                              formIcon === ic ? 'bg-[#9e3c26] text-white scale-110 shadow-xs' : 'hover:bg-white'
                            }`}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ngày tháng */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                        Ngày Hành Trình (Date)
                      </label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full h-11 px-3 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] font-mono text-[#1c1c17]"
                      />
                    </div>

                    {/* Thời tiết */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                        Thời Tiết (Weather)
                      </label>
                      <select
                        value={formWeather}
                        onChange={(e) => setFormWeather(e.target.value as any)}
                        className="w-full h-11 px-3 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] font-semibold"
                      >
                        <option value="sunny">☀️ Nắng đẹp (Sunny)</option>
                        <option value="sakura">🌸 Mùa hoa anh đào (Sakura)</option>
                        <option value="rainy">🌧️ Mưa phùn nhẹ (Rainy)</option>
                        <option value="autumn">🍁 Mùa lá đỏ (Autumn)</option>
                        <option value="snowy">❄️ Tuyết trắng (Snowy)</option>
                      </select>
                    </div>
                  </div>

                  {/* Hashtags (Tag bài viết) - UC1 */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                      Hashtags Bài Viết (Hagtag để tìm kiếm)
                    </label>
                    <input
                      type="text"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      placeholder="VD: #Tokyo #Shinjuku #Rain #Cafe #Ghibli"
                      className="w-full h-10 px-3.5 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#9e3c26] font-bold focus:outline-none focus:border-[#9e3c26]"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[11px] text-[#8a726c] self-center mr-1">Gợi ý hashtag:</span>
                      {popularTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!formTag.includes(tag)) {
                              setFormTag((prev) => (prev ? `${prev} ${tag}` : tag));
                            }
                          }}
                          className="px-2 py-0.5 rounded-full bg-[#f1ede6] hover:bg-[#ffdad2] text-[#9e3c26] text-[10px] font-bold transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lời tựa trích dẫn (Quote) */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                      Lời Tựa Trích Dẫn (Quote)
                    </label>
                    <input
                      type="text"
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      placeholder="VD: &quot;Góc phố nhỏ bình yên giữa dòng người hối hả...&quot;"
                      className="w-full h-10 px-3.5 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] italic text-[#57423d] font-body"
                    />
                  </div>

                  {/* Ảnh Bìa Đại Diện (Cover Image) */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                      Ảnh Bìa Đại Diện (Cover URL)
                    </label>
                    <input
                      type="url"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="URL hình ảnh bài viết..."
                      className="w-full h-10 px-3.5 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/50 text-[13px] text-[#1c1c17] font-mono text-xs"
                    />
                    <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar py-1">
                      <span className="text-[11px] text-[#8a726c] whitespace-nowrap">Ảnh mẫu:</span>
                      {imagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormImageUrl(preset.url)}
                          className="px-2.5 py-1 rounded-full bg-[#f7f3eb] hover:bg-[#ece8e0] text-[#57423d] text-[10px] font-bold whitespace-nowrap border border-[#ddc0ba]/40"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nội dung bài viết phong cách Notion (NotionJournalEditor) */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1.5">
                      Nội Dung Bài Viết / Ghi Chú Nhật Ký (Notes / Notion Style)
                    </label>
                    <NotionJournalEditor
                      value={formNotes}
                      onChange={setFormNotes}
                      coverImage={formImageUrl}
                      title={formTitle}
                      date={formDate}
                      weather={formWeather}
                      icon={formIcon}
                      placeholder="Viết cảm xúc, chi tiết hành trình, đánh giá món ăn..."
                    />
                  </div>

                  {/* Nút hành động Form */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ddc0ba]/30">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingMemory(false);
                        setEditingMemory(null);
                      }}
                      className="px-4 py-2 rounded-full bg-[#f7f3eb] text-[#57423d] text-[12px] font-bold hover:bg-[#ece8e0]"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-[#9e3c26] text-white text-[12px] font-bold shadow-md hover:bg-[#822714] active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingMemory ? 'Lưu Cập Nhật Bài Viết' : 'Xuất Bản Ký Ức Mới'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* THANH TÌM KIẾM THEO TỪ KHÓA, THỜI GIAN & HASHTAG (UC1) */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#ddc0ba]/40 shadow-xs flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                  {/* Ô tìm kiếm theo từ khóa & hashtag */}
                  <div className="md:col-span-2 relative">
                    <Search className="w-4 h-4 text-[#8a726c] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Tìm theo từ khóa, hashtag #Tokyo, địa danh..."
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[13px] text-[#1c1c17] placeholder-[#8a726c] focus:outline-none focus:border-[#9e3c26]"
                    />
                    {searchKeyword && (
                      <button
                        type="button"
                        onClick={() => setSearchKeyword('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a726c] hover:text-[#1c1c17]"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Lọc theo thời gian (Năm) */}
                  <div className="relative">
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="w-full h-10 pl-3 pr-8 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[12px] text-[#1c1c17] font-semibold appearance-none focus:outline-none cursor-pointer"
                    >
                      <option value="all">📅 Tất cả các năm</option>
                      {availableYears.map((yr) => (
                        <option key={yr} value={yr}>
                          Năm {yr}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8a726c] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Sắp xếp theo ngày */}
                  <div className="relative">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="w-full h-10 pl-3 pr-8 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[12px] text-[#1c1c17] font-semibold appearance-none focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Mới nhất trước</option>
                      <option value="oldest">Cũ nhất trước</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8a726c] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Country Filter & Popular Hashtag quick pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ddc0ba]/20 text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <span className="text-[11px] font-bold text-[#8a726c] mr-1">Quốc gia:</span>
                    <button
                      type="button"
                      onClick={() => setFilterCountry('all')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        filterCountry === 'all'
                          ? 'bg-[#9e3c26] text-white shadow-xs'
                          : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterCountry('JP')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        filterCountry === 'JP'
                          ? 'bg-[#9e3c26] text-white shadow-xs'
                          : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
                      }`}
                    >
                      🇯🇵 Nhật Bản
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterCountry('VN')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        filterCountry === 'VN'
                          ? 'bg-[#9e3c26] text-white shadow-xs'
                          : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
                      }`}
                    >
                      🇻🇳 Việt Nam
                    </button>
                  </div>

                  {/* Hashtag filter pills */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    <span className="text-[11px] font-bold text-[#8a726c] mr-1 flex items-center gap-0.5">
                      <Tag className="w-3 h-3" />
                      <span>Hashtag:</span>
                    </span>
                    {popularTags.slice(0, 5).map((tag) => {
                      const isSelected = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(isSelected ? null : tag)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                            isSelected
                              ? 'bg-[#9e3c26] text-white'
                              : 'bg-[#f1ede6] text-[#9e3c26] hover:bg-[#ffdad2]'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                    {selectedTag && (
                      <button
                        type="button"
                        onClick={() => setSelectedTag(null)}
                        className="text-[10px] text-[#ba1a1a] underline ml-1"
                      >
                        Bỏ lọc
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* DANH SÁCH BÀI VIẾT (KÝ ỨC) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMemories.length === 0 ? (
                  <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-dashed border-[#ddc0ba]/60">
                    <p className="text-[14px] font-bold text-[#1c1c17] mb-1">
                      Không tìm thấy bài viết nào phù hợp
                    </p>
                    <p className="text-[12px] text-[#57423d] mb-3">
                      Hãy thử đổi từ khóa tìm kiếm, bỏ lọc hashtag hoặc chọn khoảng thời gian khác.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchKeyword('');
                        setSelectedTag(null);
                        setFilterYear('all');
                        setFilterCountry('all');
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#9e3c26] text-white text-[11px] font-bold"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                ) : (
                  filteredMemories.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#ddc0ba]/40 shadow-xs hover:border-[#9e3c26]/40 transition-all flex flex-col justify-between gap-2.5"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Cover Image / Icon */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f7f3eb] flex-shrink-0 relative border border-[#ddc0ba]/30">
                          {m.image ? (
                            <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              {m.icon || '🌸'}
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 text-xs">
                            {m.countryId === 'JP' ? '🇯🇵' : '🇻🇳'}
                          </span>
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm">{m.icon || '🌸'}</span>
                            <h4 className="font-bold text-[14px] text-[#1c1c17] truncate font-display">
                              {m.title}
                            </h4>
                          </div>
                          {m.titleJa && m.titleJa !== m.title && (
                            <p className="text-[11px] text-[#8a726c] truncate mb-1">
                              {m.titleJa}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-[11px] text-[#57423d] font-body truncate">
                            <span className="truncate">{m.locationName}</span>
                            <span>•</span>
                            <span className="font-mono flex-shrink-0">{m.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hashtag & Bottom Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#ddc0ba]/20">
                        {/* Hashtag Pill */}
                        <div className="flex items-center gap-1 min-w-0">
                          {m.tag && (
                            <span className="px-2 py-0.5 rounded-full bg-[#f1ede6] text-[#9e3c26] text-[10px] font-bold font-display truncate">
                              {m.tag}
                            </span>
                          )}
                        </div>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Nút Sửa Bài Viết */}
                          <button
                            type="button"
                            onClick={() => handleStartEditMemory(m)}
                            className="px-2.5 py-1 rounded-lg bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0] hover:text-[#9e3c26] text-[11px] font-bold flex items-center gap-1 transition-colors"
                            title="Chỉnh sửa bài viết"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>

                          {/* Nút Xóa Bài Viết (Hiện Pop-up xác nhận) */}
                          <button
                            type="button"
                            onClick={() => setMemoryToDelete(m)}
                            className="px-2.5 py-1 rounded-lg bg-[#ffdad6]/60 text-[#ba1a1a] hover:bg-[#ffdad6] text-[11px] font-bold flex items-center gap-1 transition-colors"
                            title="Xóa bài viết (Có hộp thoại xác nhận)"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* UC2: QUẢN LÝ TRẠNG THÁI VÙNG TỈNH (ĐÃ ĐI, ƯỚC MƠ, CHƯA ĐI) */}
          {/* ========================================================= */}
          {activeTab === 'prefectures' && (
            <div className="flex flex-col gap-4">
              {/* Header & Country Switcher */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[16px] text-[#1c1c17] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#9e3c26]" />
                    <span>Quản Lý Trạng Thái Tỉnh Thành & Vùng Miền</span>
                  </h3>
                  <p className="text-[12px] text-[#57423d] font-body">
                    Mở danh sách các tỉnh theo vùng miền (mũi tên chỉ xuống) và chỉnh trạng thái Đã đi, Ước mơ hoặc Chưa đi
                  </p>
                </div>

                {/* Country Switcher */}
                <div className="flex items-center p-1 rounded-full bg-[#ece8e0] border border-[#ddc0ba]/40 self-start md:self-auto shadow-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setPrefectureCountryTab('JP');
                      setSearchPrefectureText('');
                    }}
                    className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                      prefectureCountryTab === 'JP'
                        ? 'bg-[#9e3c26] text-white shadow-xs'
                        : 'text-[#57423d] hover:text-[#1c1c17]'
                    }`}
                  >
                    🇯🇵 Nhật Bản (47 tỉnh)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPrefectureCountryTab('VN');
                      setSearchPrefectureText('');
                    }}
                    className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                      prefectureCountryTab === 'VN'
                        ? 'bg-[#9e3c26] text-white shadow-xs'
                        : 'text-[#57423d] hover:text-[#1c1c17]'
                    }`}
                  >
                    🇻🇳 Việt Nam (6 vùng • 63 tỉnh)
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs & Search Bar (UC2) */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#ddc0ba]/40 shadow-xs flex flex-col gap-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Status Filters: Tất cả, Đã đi, Ước mơ, Chưa đi */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setPrefectureStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                        prefectureStatusFilter === 'all'
                          ? 'bg-[#9e3c26] text-white shadow-xs'
                          : 'bg-[#f7f3eb] text-[#57423d] hover:bg-[#ece8e0]'
                      }`}
                    >
                      Tất cả ({currentProvinces.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrefectureStatusFilter('visited')}
                      className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1 transition-all ${
                        prefectureStatusFilter === 'visited'
                          ? 'bg-[#3d653e] text-white shadow-xs'
                          : 'bg-[#f7f3eb] text-[#3d653e] hover:bg-[#ece8e0]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã đi ({prefectureCountryTab === 'JP' ? visitedCountJP : visitedCountVN})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrefectureStatusFilter('wishlist')}
                      className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1 transition-all ${
                        prefectureStatusFilter === 'wishlist'
                          ? 'bg-[#d48344] text-white shadow-xs'
                          : 'bg-[#f7f3eb] text-[#d48344] hover:bg-[#ece8e0]'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Ước mơ ({prefectureCountryTab === 'JP' ? wishlistCountJP : wishlistCountVN})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrefectureStatusFilter('unvisited')}
                      className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                        prefectureStatusFilter === 'unvisited'
                          ? 'bg-[#8a726c] text-white shadow-xs'
                          : 'bg-[#f7f3eb] text-[#8a726c] hover:bg-[#ece8e0]'
                      }`}
                    >
                      Chưa đi ({prefectureCountryTab === 'JP' ? unvisitedCountJP : unvisitedCountVN})
                    </button>
                  </div>

                  {/* Search box */}
                  <div className="relative md:w-64">
                    <Search className="w-3.5 h-3.5 text-[#8a726c] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchPrefectureText}
                      onChange={(e) => setSearchPrefectureText(e.target.value)}
                      placeholder={prefectureCountryTab === 'JP' ? 'Tìm tỉnh (Tokyo, Kyoto...)' : 'Tìm tỉnh (Hà Nội, Đà Nẵng...)'}
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[12px] text-[#1c1c17] focus:outline-none focus:border-[#9e3c26]"
                    />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-2 border-t border-[#ddc0ba]/20">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-[#57423d]">
                      {prefectureCountryTab === 'JP' ? 'Tiến độ hành trình Nhật Bản:' : 'Tiến độ hành trình Việt Nam:'}
                    </span>
                    <span className="font-bold text-[#9e3c26]">
                      {prefectureCountryTab === 'JP'
                        ? `${visitedCountJP} / 47 tỉnh (${Math.round((visitedCountJP / 47) * 100)}%)`
                        : `${visitedCountVN} / ${currentProvinces.length} tỉnh thành (${Math.round((visitedCountVN / currentProvinces.length) * 100)}%)`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f1ede6] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#be543c] to-[#9e3c26] rounded-full transition-all duration-500"
                      style={{
                        width: `${((prefectureCountryTab === 'JP' ? visitedCountJP : visitedCountVN) / currentProvinces.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* REGIONS ACCORDION LIST WITH CHEVRON DOWN (UC2) */}
              <div className="flex flex-col gap-3">
                {currentRegions.map((region) => {
                  const regionPrefectures = filteredPrefectureList.filter((p) =>
                    region.prefectureIds.includes(p.id)
                  );

                  // Skip region if empty during search/filter
                  if (regionPrefectures.length === 0 && (searchPrefectureText || prefectureStatusFilter !== 'all')) {
                    return null;
                  }

                  const isExpanded = expandedRegions[region.id] ?? true;
                  const regVisited = currentProvinces.filter((p) => region.prefectureIds.includes(p.id) && p.status === 'visited').length;

                  return (
                    <div
                      key={region.id}
                      className="rounded-2xl border border-[#ddc0ba]/50 overflow-hidden bg-white shadow-xs"
                    >
                      {/* Region Header Accordion Bar (with Chevron Down) */}
                      <div
                        onClick={() => toggleRegionAccordion(region.id)}
                        className="px-4 py-3 bg-[#f7f3eb] flex items-center justify-between cursor-pointer hover:bg-[#ece8e0] transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: region.color }}
                          />
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-[14px] text-[#1c1c17] font-display">
                              {prefectureCountryTab === 'VN' ? region.name : region.nameJa}
                            </span>
                            <span className="text-[11px] text-[#57423d] font-body">
                              • {regionPrefectures.length} tỉnh thành (Đã đến: {regVisited}/{region.prefectureIds.length})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[#57423d]">
                          <span className="text-[11px] font-semibold hidden md:inline">
                            {isExpanded ? 'Thu gọn' : 'Xem danh sách'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#8a726c]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#8a726c]" />
                          )}
                        </div>
                      </div>

                      {/* List of Prefectures inside region (Editable status with 3 buttons) */}
                      {isExpanded && (
                        <div className="p-3 divide-y divide-[#ddc0ba]/20 flex flex-col gap-2">
                          {regionPrefectures.map((pref) => {
                            const isVisited = pref.status === 'visited';
                            const isWishlist = pref.status === 'wishlist';
                            const isUnvisited = pref.status === 'unvisited';

                            return (
                              <div
                                key={pref.id}
                                className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                {/* Pref Info */}
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="text-xl flex-shrink-0">{pref.emoji}</span>
                                  <div className="min-w-0">
                                    <div className="flex items-baseline gap-2">
                                      <span className="font-bold text-[13px] text-[#1c1c17]">
                                        {prefectureCountryTab === 'VN' ? pref.name : pref.nameJa}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-[#8a726c] truncate">
                                      Thủ phủ: {pref.capital} • {pref.highlights.slice(0, 2).join(', ')}
                                    </p>
                                  </div>
                                </div>

                                {/* 3 Status Action Buttons for direct toggle (UC2) */}
                                <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                                  {/* 1. Đã đi */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (prefectureCountryTab === 'JP') {
                                        onUpdatePrefectureStatus(pref.id, 'visited');
                                      } else if (onUpdateVietnamProvinceStatus) {
                                        onUpdateVietnamProvinceStatus(pref.id, 'visited');
                                      }
                                      showToast(`✓ Đã đổi "${pref.name}" sang: Đã đi`);
                                    }}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                                      isVisited
                                        ? 'bg-[#3d653e] text-white shadow-xs ring-2 ring-[#a5d2a2]'
                                        : 'bg-[#f7f3eb] text-[#3d653e] hover:bg-[#e2edd8]'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Đã đi</span>
                                  </button>

                                  {/* 2. Ước mơ */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (prefectureCountryTab === 'JP') {
                                        onUpdatePrefectureStatus(pref.id, 'wishlist');
                                      } else if (onUpdateVietnamProvinceStatus) {
                                        onUpdateVietnamProvinceStatus(pref.id, 'wishlist');
                                      }
                                      showToast(`⭐ Đã đổi "${pref.name}" sang: Ước mơ`);
                                    }}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                                      isWishlist
                                        ? 'bg-[#d48344] text-white shadow-xs ring-2 ring-[#ffe2b8]'
                                        : 'bg-[#f7f3eb] text-[#d48344] hover:bg-[#fceded]'
                                    }`}
                                  >
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>Ước mơ</span>
                                  </button>

                                  {/* 3. Chưa đi */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (prefectureCountryTab === 'JP') {
                                        onUpdatePrefectureStatus(pref.id, 'unvisited');
                                      } else if (onUpdateVietnamProvinceStatus) {
                                        onUpdateVietnamProvinceStatus(pref.id, 'unvisited');
                                      }
                                      showToast(`⚪ Đã đổi "${pref.name}" sang: Chưa đi`);
                                    }}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                      isUnvisited
                                        ? 'bg-[#8a726c] text-white shadow-xs'
                                        : 'bg-[#f7f3eb] text-[#8a726c] hover:bg-[#ece8e0]'
                                    }`}
                                  >
                                    <span>Chưa đi</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* UC3: CHỈNH SỬA HỒ SƠ TÁC GIẢ & MẠNG XÃ HỘI */}
          {/* ========================================================= */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 max-w-[580px] mx-auto bg-white p-5 rounded-3xl border border-[#ddc0ba]/40 shadow-xs">
              <div>
                <h3 className="font-bold text-[16px] text-[#1c1c17] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#9e3c26]" />
                  <span>Chỉnh Sửa Hồ Sơ Tác Giả & Lời Tựa Hành Trình</span>
                </h3>
                <p className="text-[12px] text-[#57423d] font-body">
                  Cập nhật họ tên, avatar, lời tựa song ngữ Nhật - Việt và các liên kết mạng xã hội
                </p>
              </div>

              {/* 1. Họ tên & Avatar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center p-3 rounded-2xl bg-[#f7f3eb]/60 border border-[#ddc0ba]/30">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#9e3c26] shadow-sm mb-1">
                    <img
                      src={profileAvatar || profile.avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-[#8a726c]">Ảnh xem trước</span>
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1">
                      Họ và tên tác giả *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="VD: Thu Pham (phamthuhp031103)"
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#ddc0ba]/40 text-[13px] font-bold text-[#1c1c17] focus:outline-none focus:border-[#9e3c26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1">
                      URL Ảnh Avatar
                    </label>
                    <input
                      type="url"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full h-9 px-3 rounded-xl bg-white border border-[#ddc0ba]/40 text-[11px] font-mono text-[#1c1c17] focus:outline-none focus:border-[#9e3c26]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Danh xưng du hành */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1">
                    Danh xưng (Tiếng Việt)
                  </label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    placeholder="VD: Nhà Khám Phá Phương Đông • Cấp 12"
                    className="w-full h-10 px-3 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[13px] text-[#1c1c17]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1">
                    Danh xưng (Tiếng Nhật)
                  </label>
                  <input
                    type="text"
                    value={profileTitleJa}
                    onChange={(e) => setProfileTitleJa(e.target.value)}
                    placeholder="VD: 東洋の冒険者 • レベル12"
                    className="w-full h-10 px-3 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[13px] text-[#1c1c17]"
                  />
                </div>
              </div>

              {/* 3. Lời tựa du ký song ngữ (UC3) */}
              <div>
                <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1 flex items-center justify-between">
                  <span>Lời tựa du ký (Bản Tiếng Việt)</span>
                  <span className="text-[10px] text-[#9e3c26] lowercase">khi toggle tiếng Việt</span>
                </label>
                <textarea
                  rows={2}
                  value={profileQuoteVi}
                  onChange={(e) => setProfileQuoteVi(e.target.value)}
                  placeholder="Mỗi chuyến đi là một trang nhật ký viết bằng bước chân..."
                  className="w-full p-3 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[13px] font-body text-[#1c1c17]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#57423d] uppercase mb-1 flex items-center justify-between">
                  <span>Lời tựa du ký (Bản Tiếng Nhật)</span>
                  <span className="text-[10px] text-[#9e3c26] lowercase">khi toggle tiếng Nhật</span>
                </label>
                <textarea
                  rows={2}
                  value={profileQuoteJa}
                  onChange={(e) => setProfileQuoteJa(e.target.value)}
                  placeholder="すべての旅は、足跡と心で紡ぐ記憶のページ..."
                  className="w-full p-3 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/40 text-[13px] font-body text-[#1c1c17]"
                />
              </div>

              {/* 4. Mạng xã hội & Liên hệ (Facebook, Instagram, Notion, Email) - UC3 */}
              <div className="p-3.5 rounded-2xl bg-[#f7f3eb]/60 border border-[#ddc0ba]/40 flex flex-col gap-3">
                <span className="block text-[11px] font-bold text-[#8a726c] uppercase tracking-wider">
                  Liên kết Mạng Xã Hội & Nhật Ký Cá Nhân
                </span>

                {/* Facebook */}
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    📘
                  </span>
                  <input
                    type="url"
                    value={profileFacebook}
                    onChange={(e) => setProfileFacebook(e.target.value)}
                    placeholder="Link Facebook cá nhân (VD: https://facebook.com/username)..."
                    className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#ddc0ba]/40 text-[12px] text-[#1c1c17]"
                  />
                </div>

                {/* Instagram */}
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#e1306c]/10 text-[#e1306c] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    📷
                  </span>
                  <input
                    type="url"
                    value={profileInstagram}
                    onChange={(e) => setProfileInstagram(e.target.value)}
                    placeholder="Link Instagram (VD: https://instagram.com/username)..."
                    className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#ddc0ba]/40 text-[12px] text-[#1c1c17]"
                  />
                </div>

                {/* Notion */}
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-black/5 text-[#1c1c17] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    📝
                  </span>
                  <input
                    type="url"
                    value={profileNotion}
                    onChange={(e) => setProfileNotion(e.target.value)}
                    placeholder="Link trang Notion / Travel Blog (VD: https://notion.so/...)..."
                    className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#ddc0ba]/40 text-[12px] text-[#1c1c17]"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#3d653e]/10 text-[#3d653e] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    ✉️
                  </span>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="Email liên hệ (VD: phamthuhp031103@gmail.com)..."
                    className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#ddc0ba]/40 text-[12px] text-[#1c1c17]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[#9e3c26] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-md hover:bg-[#822714] active:scale-[0.98] transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Hồ Sơ và Cập Nhật Giao Diện</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SYNC & BACKUP */}
          {/* ========================================================= */}
          {activeTab === 'sync' && (
            <div className="flex flex-col gap-4 max-w-[620px] mx-auto">
              <div>
                <h3 className="font-bold text-[16px] text-[#1c1c17]">
                  Đồng Bộ Dữ Liệu & Sao Lưu (Sync & Backup)
                </h3>
                <p className="text-[12px] text-[#57423d] font-body">
                  Hệ thống tự động lưu trữ mọi bài viết và trạng thái tỉnh thành vào bộ nhớ trình duyệt (localStorage). Bạn có thể xuất JSON để sao lưu hoặc chuyển đổi sang máy khác.
                </p>
              </div>

              {/* Export Panel */}
              <div className="p-4 rounded-2xl bg-white border border-[#ddc0ba]/40 flex flex-col gap-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[14px] text-[#1c1c17]">
                      1. Xuất Dữ Liệu Nhật Ký (Export JSON)
                    </h4>
                    <p className="text-[11px] text-[#57423d]">
                      Tạo bản sao lưu toàn diện chứa {memories.length} bài viết và bản đồ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateExport}
                    className="px-3.5 py-1.5 rounded-full bg-[#1d6774] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs hover:bg-[#154d57]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tạo bản sao lưu</span>
                  </button>
                </div>

                {jsonExportText && (
                  <div className="flex flex-col gap-2">
                    <textarea
                      readOnly
                      rows={4}
                      value={jsonExportText}
                      className="w-full p-2.5 rounded-xl bg-[#f7f3eb] font-mono text-[11px] text-[#1c1c17] border border-[#ddc0ba]/40"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(jsonExportText);
                          showToast('✓ Đã sao chép JSON vào bộ nhớ đệm!');
                        }
                      }}
                      className="self-end px-3 py-1 rounded-full bg-[#f1ede6] text-[#57423d] text-[11px] font-bold flex items-center gap-1 hover:bg-[#dddad2]"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Sao chép JSON</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Import Panel */}
              <div className="p-4 rounded-2xl bg-white border border-[#ddc0ba]/40 flex flex-col gap-3 shadow-xs">
                <h4 className="font-bold text-[14px] text-[#1c1c17]">
                  2. Khôi Phục Dữ Liệu (Import JSON)
                </h4>
                <p className="text-[11px] text-[#57423d]">
                  Dán nội dung JSON đã sao lưu để khôi phục toàn bộ bài viết và hồ sơ
                </p>
                <textarea
                  rows={3}
                  value={jsonImportText}
                  onChange={(e) => setJsonImportText(e.target.value)}
                  placeholder="Dán nội dung chuỗi JSON sao lưu vào đây..."
                  className="w-full p-2.5 rounded-xl bg-[#f7f3eb] font-mono text-[11px] text-[#1c1c17] border border-[#ddc0ba]/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyImport}
                  disabled={!jsonImportText.trim()}
                  className="self-end px-4 py-1.5 rounded-full bg-[#9e3c26] text-white font-bold text-[11px] flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Khôi phục dữ liệu</span>
                </button>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-4 rounded-2xl bg-[#ffdad6]/30 border border-[#ba1a1a]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[13px] text-[#ba1a1a]">
                    Đặt Lại Dữ Liệu Ban Đầu
                  </h4>
                  <p className="text-[11px] text-[#57423d]">
                    Khôi phục về trạng thái mẫu ban đầu của trang web
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetAllData();
                    showToast('✓ Đã khôi phục dữ liệu ban đầu!');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white text-[#ba1a1a] border border-[#ba1a1a]/40 font-bold text-[11px] flex items-center gap-1 hover:bg-[#ffdad6]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* POP-UP CONFIRMATION MODAL CHO XÓA BÀI VIẾT (UC1) */}
        {/* ========================================================= */}
        {memoryToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div
              className="w-full max-w-[390px] rounded-3xl bg-[#fdf9f1] border border-[#ba1a1a]/40 shadow-2xl p-5 flex flex-col items-center text-center animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="w-13 h-13 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-3 shadow-xs">
                <AlertTriangle className="w-7 h-7" />
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-[17px] text-[#1c1c17] font-display mb-1.5">
                Xác Nhận Xóa Ký Ức?
              </h3>
              <p className="text-[12px] text-[#57423d] font-body leading-relaxed mb-4 max-w-[300px]">
                Bạn có chắc chắn muốn xóa bài viết{' '}
                <strong className="text-[#1c1c17]">&ldquo;{memoryToDelete.title}&rdquo;</strong>?
                Hành động này sẽ gỡ bài viết khỏi sổ tay hành trình và bản đồ.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => setMemoryToDelete(null)}
                  className="flex-1 h-10 rounded-full bg-white text-[#57423d] border border-[#ddc0ba]/60 font-bold text-[12px] hover:bg-[#ece8e0] transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteMemory}
                  className="flex-1 h-10 rounded-full bg-[#ba1a1a] text-white font-bold text-[12px] shadow-md hover:bg-[#93000a] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xác Nhận Xóa</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
