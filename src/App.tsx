import React, { useState, useEffect, useMemo } from 'react';
import { ScreenType, CountryId, Language, Memory, Prefecture, Region, Place, ProfileData } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WorldMapScreen } from './components/WorldMapScreen';
import { JapanMapScreen } from './components/JapanMapScreen';
import { PlacesScreen } from './components/PlacesScreen';
import { MemoriesScreen } from './components/MemoriesScreen';
import { MemoryDetailModal } from './components/MemoryDetailModal';
import { NewMemoryModal } from './components/NewMemoryModal';
import { ProfileModal } from './components/ProfileModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { initialMemories, curatedPlaces, initialProfile } from './data/memoriesData';
import { allJapanPrefectures, vietnamRegions, allVietnamProvinces } from './data/regionsData';
import { PianoPlayerBox } from './components/PianoPlayerBox';
import { cozyAudio } from './utils/audioPlayer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('world-map');
  const [selectedCountry, setSelectedCountry] = useState<CountryId>('JP');
  const [lang, setLang] = useState<Language>('VI');

  // Ambient Piano Music State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  const handleToggleMusic = () => {
    const playing = cozyAudio.toggle();
    setIsPlayingMusic(playing);
  };

  const handleSelectTrack = (index: number) => {
    setActiveTrackIndex(index);
    cozyAudio.setTrack(index);
  };

  // Admin Mode state (Default: false so visitors see read-only view)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('cozy_island_admin_auth') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // 1. Memories State with Local Persistence
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('cozy_island_memories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialMemories.length) {
          return parsed;
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((m: any) => m.id));
          const missing = initialMemories.filter((m) => !existingIds.has(m.id));
          return [...parsed, ...missing];
        }
      } catch (e) {
        return initialMemories;
      }
    }
    return initialMemories;
  });

  useEffect(() => {
    localStorage.setItem('cozy_island_memories', JSON.stringify(memories));
  }, [memories]);

  // 2. Japan Prefectures State with Local Persistence
  const [prefectures, setPrefectures] = useState<Prefecture[]>(() => {
    const saved = localStorage.getItem('cozy_island_prefectures');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return allJapanPrefectures;
      }
    }
    return allJapanPrefectures;
  });

  useEffect(() => {
    localStorage.setItem('cozy_island_prefectures', JSON.stringify(prefectures));
  }, [prefectures]);

  // 3. Vietnam Regions & Provinces State with Local Persistence
  const [vietnamProvinces, setVietnamProvinces] = useState<Prefecture[]>(() => {
    const saved = localStorage.getItem('cozy_island_vietnam_provinces');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === allVietnamProvinces.length) {
          const hasAllIds = allVietnamProvinces.every((p) => parsed.some((sp: any) => sp.id === p.id));
          if (hasAllIds) return parsed;
        }
        if (Array.isArray(parsed)) {
          const statusMap = new Map<string, 'visited' | 'wishlist' | 'unvisited'>(
            parsed.map((p: any) => [p.id, p.status])
          );
          return allVietnamProvinces.map((prov) => ({
            ...prov,
            status: statusMap.get(prov.id) || prov.status,
          }));
        }
      } catch (e) {
        return allVietnamProvinces;
      }
    }
    return allVietnamProvinces;
  });

  useEffect(() => {
    localStorage.setItem('cozy_island_vietnam_provinces', JSON.stringify(vietnamProvinces));
  }, [vietnamProvinces]);

  const vietnamRegionsList = useMemo(() => {
    return vietnamRegions.map((region) => {
      const regionProvs = vietnamProvinces.filter((p) => region.prefectureIds.includes(p.id));
      const visited = regionProvs.filter((p) => p.status === 'visited').length;
      const wishlist = regionProvs.filter((p) => p.status === 'wishlist').length;
      return {
        ...region,
        totalPrefectures: region.prefectureIds.length,
        visitedPrefectures: visited,
        wishlistCount: wishlist,
        status: (visited > 0 ? 'visited' : wishlist > 0 ? 'wishlist' : 'unvisited') as 'visited' | 'wishlist' | 'unvisited',
      };
    });
  }, [vietnamProvinces]);

  const handleUpdateVietnamProvinceStatus = (id: string, status: 'visited' | 'wishlist' | 'unvisited') => {
    setVietnamProvinces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  // 4. Places State with Local Persistence
  const [places, setPlaces] = useState<Place[]>(() => {
    const saved = localStorage.getItem('cozy_island_places');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return curatedPlaces;
      }
    }
    return curatedPlaces;
  });

  useEffect(() => {
    localStorage.setItem('cozy_island_places', JSON.stringify(places));
  }, [places]);

  // 5. Profile State with Local Persistence
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('cozy_island_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialProfile;
      }
    }
    return initialProfile;
  });

  useEffect(() => {
    localStorage.setItem('cozy_island_profile', JSON.stringify(profile));
  }, [profile]);

  // Sync Admin Auth State
  useEffect(() => {
    localStorage.setItem('cozy_island_admin_auth', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Check URL Hash for #admin shortcut
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        if (isAdmin) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [isAdmin]);

  // Modals state
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [isNewMemoryOpen, setIsNewMemoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [memoryFilterKeyword, setMemoryFilterKeyword] = useState<string>('');

  // Navigation Handlers
  const handleNavigateToRegionMap = (country: CountryId) => {
    setSelectedCountry(country);
    setCurrentScreen('japan-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToMemories = (keyword?: string) => {
    if (keyword) {
      setMemoryFilterKeyword(keyword);
    }
    setCurrentScreen('memories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );
    if (activeMemory && activeMemory.id === id) {
      setActiveMemory((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Admin Handlers
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    setIsAdminDashboardOpen(false);
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAddMemory = (newMemory: Memory) => {
    setMemories((prev) => [newMemory, ...prev]);
  };

  const handleUpdateMemory = (updated: Memory) => {
    setMemories((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    if (activeMemory && activeMemory.id === updated.id) {
      setActiveMemory(updated);
    }
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (activeMemory && activeMemory.id === id) {
      setActiveMemory(null);
    }
  };

  const handleUpdatePrefectureStatus = (id: string, status: 'visited' | 'wishlist' | 'unvisited') => {
    setPrefectures((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleUpdateVietnamRegionStatus = (id: string, status: 'visited' | 'wishlist' | 'unvisited') => {
    const targetRegion = vietnamRegions.find((r) => r.id === id);
    if (!targetRegion) return;
    setVietnamProvinces((prev) =>
      prev.map((p) => (targetRegion.prefectureIds.includes(p.id) ? { ...p, status } : p))
    );
  };

  const handleAddPlace = (newPlace: Place) => {
    setPlaces((prev) => [newPlace, ...prev]);
  };

  const handleDeletePlace = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
  };

  const handleResetAllData = () => {
    setMemories(initialMemories);
    setPrefectures(allJapanPrefectures);
    setVietnamProvinces(allVietnamProvinces);
    setPlaces(curatedPlaces);
    setProfile(initialProfile);
    localStorage.removeItem('cozy_island_memories');
    localStorage.removeItem('cozy_island_prefectures');
    localStorage.removeItem('cozy_island_vietnam_provinces');
    localStorage.removeItem('cozy_island_vietnam_regions');
    localStorage.removeItem('cozy_island_places');
    localStorage.removeItem('cozy_island_profile');
  };

  const handleImportData = (data: any) => {
    if (data.memories) setMemories(data.memories);
    if (data.prefectures) setPrefectures(data.prefectures);
    if (data.vietnamProvinces) setVietnamProvinces(data.vietnamProvinces);
    if (data.places) setPlaces(data.places);
    if (data.profile) setProfile(data.profile);
  };

  const visitedCount = prefectures.filter((p) => p.status === 'visited').length;

  return (
    <div className="min-h-screen bg-[#fdf9f1] text-[#1c1c17] flex flex-col font-body selection:bg-[#9e3c26]/20 selection:text-[#9e3c26]">
      {/* Top Header (Thanh Top Bar gọn gàng, không chứa khung nhạc) */}
      <Header
        lang={lang}
        onToggleLang={setLang}
        onOpenProfile={() => setIsProfileOpen(true)}
        isAdmin={isAdmin}
        onOpenAdmin={handleOpenAdmin}
        onLogoutAdmin={handleLogoutAdmin}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
      />

      {/* Khung Nhạc Piano Chill Tách Biệt Hoàn Toàn Khỏi Top Bar */}
      <PianoPlayerBox
        lang={lang}
        isPlaying={isPlayingMusic}
        onTogglePlay={handleToggleMusic}
        activeTrackIndex={activeTrackIndex}
        onSelectTrack={handleSelectTrack}
      />

      {/* Main Screen Content Body */}
      <main className="flex-1 w-full max-w-[440px] mx-auto min-h-screen relative">
        {currentScreen === 'world-map' && (
          <WorldMapScreen
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            onNavigateToRegionMap={handleNavigateToRegionMap}
            onSelectMemory={setActiveMemory}
            memories={memories}
            lang={lang}
          />
        )}

        {currentScreen === 'japan-map' && (
          <JapanMapScreen
            country={selectedCountry}
            onChangeCountry={setSelectedCountry}
            onOpenNewMemory={() => setIsNewMemoryOpen(true)}
            onSelectMemory={setActiveMemory}
            onNavigateToMemories={handleNavigateToMemories}
            memories={memories}
            prefectures={prefectures}
            onUpdatePrefectureStatus={handleUpdatePrefectureStatus}
            vietnamRegions={vietnamRegionsList}
            vietnamProvinces={vietnamProvinces}
            onUpdateVietnamProvinceStatus={handleUpdateVietnamProvinceStatus}
            isAdmin={isAdmin}
            onOpenAdmin={handleOpenAdmin}
            lang={lang}
          />
        )}

        {currentScreen === 'places' && (
          <PlacesScreen
            places={places}
            isAdmin={isAdmin}
            onOpenAdmin={handleOpenAdmin}
            lang={lang}
            onNavigateToMemoriesWithLocation={handleNavigateToMemories}
          />
        )}

        {currentScreen === 'memories' && (
          <MemoriesScreen
            memories={memories}
            onSelectMemory={setActiveMemory}
            onOpenNewMemory={() => setIsNewMemoryOpen(true)}
            isAdmin={isAdmin}
            onOpenAdmin={handleOpenAdmin}
            lang={lang}
            initialSearchQuery={memoryFilterKeyword}
            onClearInitialSearch={() => setMemoryFilterKeyword('')}
          />
        )}
      </main>

      {/* Persistent Floating Bottom Navigation Bar */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        lang={lang}
      />

      {/* Modals */}
      <MemoryDetailModal
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
        onToggleFavorite={handleToggleFavorite}
        lang={lang}
      />

      <NewMemoryModal
        isOpen={isNewMemoryOpen}
        onClose={() => setIsNewMemoryOpen(false)}
        onAddMemory={handleAddMemory}
        lang={lang}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        memoriesCount={memories.length}
        visitedPrefecturesCount={visitedCount}
        isAdmin={isAdmin}
        onOpenAdmin={handleOpenAdmin}
        onLogoutAdmin={handleLogoutAdmin}
        lang={lang}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Full Admin Dashboard Portal */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={handleLogoutAdmin}
        memories={memories}
        onAddMemory={handleAddMemory}
        onUpdateMemory={handleUpdateMemory}
        onDeleteMemory={handleDeleteMemory}
        prefectures={prefectures}
        onUpdatePrefectureStatus={handleUpdatePrefectureStatus}
        vietnamRegions={vietnamRegionsList}
        onUpdateVietnamRegionStatus={handleUpdateVietnamRegionStatus}
        vietnamProvinces={vietnamProvinces}
        onUpdateVietnamProvinceStatus={handleUpdateVietnamProvinceStatus}
        places={places}
        onAddPlace={handleAddPlace}
        onDeletePlace={handleDeletePlace}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onResetAllData={handleResetAllData}
        onImportData={handleImportData}
        lang={lang}
      />
    </div>
  );
}
