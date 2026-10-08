import React from 'react';
import { Language, ProfileData } from '../types';
import { getT } from '../utils/translations';
import { X, Award, MapPin, BookOpen, Compass, Sparkles, Settings, Lock, LogOut } from 'lucide-react';
import travelerAvatar from '../assets/traveler-avatar.png';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  memoriesCount: number;
  visitedPrefecturesCount: number;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
  lang: Language;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  memoriesCount,
  visitedPrefecturesCount,
  isAdmin,
  onOpenAdmin,
  onLogoutAdmin,
  lang,
}) => {
  if (!isOpen) return null;
  const t = getT(lang);

  const stamps = [
    { title: 'Tokyo Night', kanji: '東京', date: '2026.09', color: '#9e3c26' },
    { title: 'Kyoto Inari', kanji: '京都', date: '2026.09', color: '#be543c' },
    { title: 'Hoi An Silk', kanji: '会安', date: '2026.09', color: '#d48344' },
    { title: 'Fuji Summit', kanji: '富士', date: '2026.08', color: '#1d6774' },
    { title: 'Da Nang Wave', kanji: '峴港', date: '2026.08', color: '#3d653e' },
    { title: 'Nagano Alps', kanji: '長野', date: '2026.07', color: '#557e55' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in font-display">
      <div
        className="w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-3xl bg-[#fdf9f1] border border-[#ddc0ba]/60 shadow-2xl flex flex-col p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white text-[#57423d] flex items-center justify-center shadow-xs border border-[#ddc0ba]/40 hover:bg-[#ece8e0]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Passport Header Banner */}
        <div className="flex flex-col items-center text-center pt-2 pb-4">
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-md ring-2 ring-[#9e3c26]/30">
              <img
                src={profile.avatarUrl || travelerAvatar}
                onError={(event) => { if (!event.currentTarget.src.endsWith(travelerAvatar)) event.currentTarget.src = travelerAvatar; }}
                alt="Traveler avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#3d653e] text-white flex items-center justify-center text-[10px] font-bold border-2 border-[#fdf9f1]">
              ✓
            </span>
          </div>

          <h2 className="font-bold text-[18px] text-[#1c1c17]">
            {lang === 'VI' ? profile.authorName : (profile.authorNameJa || profile.authorName)}
          </h2>
          <p className="text-[12px] text-[#9e3c26] font-bold mt-0.5">
            {lang === 'VI' ? profile.travelerTitle : profile.travelerTitleJa}
          </p>
          <p className="text-[11px] text-[#57423d] font-body italic mt-1 max-w-[290px] leading-relaxed">
            &ldquo;{lang === 'VI' ? profile.quoteVi : profile.quoteJa}&rdquo;
          </p>
        </div>

        {/* Passport Stats Grid */}
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#ddc0ba]/40 grid grid-cols-3 divide-x divide-[#ddc0ba]/30 text-center mb-3">
          <div>
            <span className="block font-bold text-[20px] text-[#9e3c26]">
              {memoriesCount}
            </span>
            <span className="text-[11px] text-[#57423d] font-body">{t.memories}</span>
          </div>
          <div>
            <span className="block font-bold text-[20px] text-[#1d6774]">2</span>
            <span className="text-[11px] text-[#57423d] font-body">{lang === 'VI' ? 'Quốc gia' : 'カ国'}</span>
          </div>
          <div>
            <span className="block font-bold text-[20px] text-[#3d653e]">
              {visitedPrefecturesCount}
            </span>
            <span className="text-[11px] text-[#57423d] font-body">{lang === 'VI' ? 'Tỉnh thành' : '都道府県'}</span>
          </div>
        </div>

        {/* Passport Stamp Collection */}
        <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#ddc0ba]/40 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[14px] text-[#1c1c17]">
              {t.passportStampCount} ({stamps.length})
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#e2ab60]" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stamps.map((stamp, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-[#f7f3eb] border border-dashed flex flex-col items-center text-center justify-center relative overflow-hidden"
                style={{ borderColor: stamp.color }}
              >
                <span
                  className="font-bold text-[14px] leading-tight"
                  style={{ color: stamp.color }}
                >
                  {stamp.kanji}
                </span>
                <span className="text-[10px] text-[#1c1c17] font-medium truncate w-full mt-0.5">
                  {stamp.title}
                </span>
                <span className="text-[9px] text-[#8a726c] font-mono mt-0.5">
                  {stamp.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media & Contact Links */}
        {(profile.facebookUrl || profile.instagramUrl || profile.notionUrl || profile.contactEmail) && (
          <div className="p-3 rounded-2xl bg-white shadow-xs border border-[#ddc0ba]/40 mb-3">
            <span className="block text-[11px] font-bold text-[#8a726c] uppercase tracking-wider mb-2 font-display">
              {lang === 'VI' ? 'Mạng xã hội & Nhật ký hành trình' : 'SNS & 旅の記録リンク'}
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.facebookUrl && (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2]/20 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </a>
              )}
              {profile.instagramUrl && (
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-[#e1306c]/10 text-[#e1306c] hover:bg-[#e1306c]/20 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>📷</span>
                  <span>Instagram</span>
                </a>
              )}
              {profile.notionUrl && (
                <a
                  href={profile.notionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-black/5 text-[#1c1c17] hover:bg-black/10 text-[11px] font-bold flex items-center gap-1.5 transition-colors border border-black/10"
                >
                  <span>📝</span>
                  <span>Notion Journal</span>
                </a>
              )}
              {profile.contactEmail && (
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="px-3 py-1.5 rounded-full bg-[#3d653e]/10 text-[#3d653e] hover:bg-[#3d653e]/20 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>✉️</span>
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Admin Access Panel */}
        <div className="p-3 rounded-2xl bg-[#f7f3eb] border border-[#ddc0ba]/40 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#9e3c26] shadow-xs">
              {isAdmin ? <Settings className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
            </div>
            <div>
              <p className="font-bold text-[12px] text-[#1c1c17]">
                {isAdmin
                  ? (lang === 'VI' ? 'Quyền Quản Trị: Bật' : '管理者権限: ON')
                  : (lang === 'VI' ? 'Chế độ người xem (Khách)' : '閲覧専用ゲストモード')}
              </p>
              <p className="text-[10px] text-[#57423d] font-body">
                {isAdmin
                  ? (lang === 'VI' ? 'Bạn có thể chỉnh sửa ký ức và bản đồ' : '記憶や地図を編集できます')
                  : (lang === 'VI' ? 'Bạn bè chỉ có thể xem hành trình' : '友人は閲覧のみ可能です')}
              </p>
            </div>
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-2.5 py-1 rounded-full bg-[#9e3c26] text-white text-[11px] font-bold shadow-xs hover:bg-[#822714]"
              >
                Quản trị
              </button>
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="w-7 h-7 rounded-full bg-white text-[#ba1a1a] flex items-center justify-center hover:bg-[#ffdad6]"
                title="Đăng xuất"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="px-3 py-1 rounded-full bg-white text-[#9e3c26] border border-[#ddc0ba]/60 text-[11px] font-bold shadow-xs hover:bg-[#f7f3eb]"
            >
              Đăng nhập
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-full bg-[#9e3c26] text-white text-[13px] font-bold shadow-md hover:bg-[#822714] active:scale-[0.98] transition-all"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
