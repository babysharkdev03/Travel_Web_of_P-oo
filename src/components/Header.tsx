import React from 'react';
import { Language } from '../types';
import { getT } from '../utils/translations';
import { Volume2, Music } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onOpenProfile: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  onLogoutAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onOpenProfile,
  isPlayingMusic,
  onToggleMusic,
  isAdmin,
  onOpenAdmin,
  onLogoutAdmin,
}) => {
  const t = getT(lang);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fdf9f1]/95 backdrop-blur-xl border-b border-[#ddc0ba]/40 shadow-[0_2px_12px_rgba(88,71,56,0.05)]">
      {/* Thanh thông báo Admin trên cùng (Chỉ hiện khi đã đăng nhập Admin để tiện xem preview) */}
      {isAdmin && (
        <div className="bg-[#9e3c26] text-white px-4 py-1.5 text-[11px] font-display font-bold shadow-xs">
          <div className="max-w-[440px] mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🔐</span>
              <span>Chế độ Quản trị viên</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors text-[11px] font-bold"
              >
                Bảng điều khiển
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="hover:underline text-white/90 text-[11px]"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thanh Top Bar chính (Gọn gàng, không chứa nút đăng nhập quản trị của khách) */}
      <div className="max-w-[440px] mx-auto h-14 px-4 flex items-center justify-between gap-2">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" onClick={onOpenProfile}>
          <div className="relative">
            <img
              alt="KÝ • 記憶島 Logo"
              className="w-9 h-9 rounded-full object-contain flex-shrink-0 shadow-sm border border-[#be543c]/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9LG6y4hGgO0a_cs6YboZNtdW9EhH1-Vn1EtR9C2kEBZu7FzYLgxsR78_Gc4O72HCroGXApDD014k0CruzqfguZwY4gL3ubb9FjfpzoBDV8gg_mgpg9KNvrbbZrd4I6QJC9HHmiqGL9rkuvhYEav_mK1SKHTw5UZM0n6pw8PgNJ-FfkDtmIe4vSudg9EYUT5Bg2ad2ZyEotkJgUifP6TbMXSpD-kIxQPyVH1jXwO_xloMJEijIE2hYmZjwU6bJIng6SgU"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#557e55] border-2 border-[#fdf9f1]"></span>
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            {lang === 'VI' ? (
              <>
                <div className="flex items-baseline leading-none">
                  {/* Chế độ Việt: Chỉ hiển thị tên Latin KÝ, KHÔNG kèm Kanji */}
                  <span className="font-bold text-[20px] text-[#9e3c26] tracking-tight font-display">KÝ</span>
                </div>
                <span className="text-[11px] text-[#57423d]/85 truncate mt-0.5 font-body">
                  Dấu chân hành trình
                </span>
              </>
            ) : (
              <>
                <div className="flex items-baseline leading-none">
                  {/* Chế độ Nhật: Chỉ hiển thị Kanji 記憶島, KHÔNG kèm tiếng Việt */}
                  <span className="font-bold text-[20px] text-[#9e3c26] tracking-tight font-display">記憶島</span>
                </div>
                <span className="text-[11px] text-[#57423d]/85 truncate mt-0.5 font-body">
                  旅の足跡
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right actions: Lang Switcher, Music Button, Traveler Avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Chế độ Toggle Nhật - Việt */}
          <div className="flex items-center bg-[#ece8e0] rounded-full p-0.5 text-[11px] font-bold text-[#57423d] shadow-inner">
            <button
              type="button"
              onClick={() => onToggleLang('VI')}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1 ${
                lang === 'VI' ? 'bg-[#9e3c26] text-white shadow-xs font-bold' : 'text-[#57423d] hover:text-[#1c1c17]'
              }`}
              title="Chuyển chế độ Tiếng Việt (KÝ)"
            >
              <span>🇻🇳</span>
              <span>Việt</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('JA')}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1 ${
                lang === 'JA' ? 'bg-[#9e3c26] text-white shadow-xs font-bold' : 'text-[#57423d] hover:text-[#1c1c17]'
              }`}
              title="Chuyển chế độ Tiếng Nhật (記憶島)"
            >
              <span>🇯🇵</span>
              <span>Nhật</span>
            </button>
          </div>

          {/* Ambient Music Toggle Button */}
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label="Bật tắt nhạc piano chill"
            title={isPlayingMusic ? (lang === 'VI' ? 'Tạm dừng nhạc piano chill' : 'ピアノ音楽を一時停止') : (lang === 'VI' ? 'Bật playlist piano chill thư giãn' : '心地よいピアノ音楽を再生')}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-xs ${
              isPlayingMusic
                ? 'bg-[#1d6774] text-white ring-2 ring-[#a7eaf9]/60 animate-pulse'
                : 'bg-white text-[#1d6774] border border-[#ddc0ba]/50 hover:bg-[#f7f3eb]'
            }`}
          >
            {isPlayingMusic ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <Music className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Traveler Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#ddc0ba]/60 active:scale-95 transition-transform"
            title="Xem hồ sơ du hành (Đăng nhập quản trị ở cuối hồ sơ)"
          >
            <img
              alt="Traveler Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WRld_vcTQyJSwa0_3pxU9wycVNGQVeVZAZIM5afYW-zJqTUroWEhcyGTtU2eO2j-2Qbcnx5lLCel9iX-2eUpFUZ29PU1A5fdbz6e2cbkAjlZs67pzUqEzCbSjNAY3446TyW5e0Zqv8jRfDRrntMRRvpStEtN4qGpnegtJirXQPl5dBIpto81I4OWZDPxovrzb-POas2KHQc0U7-d_mB7Lz1M12YOJeu_Qj5Atz1SGx5s13NkII1t3azuv3"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
