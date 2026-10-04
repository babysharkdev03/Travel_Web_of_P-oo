import React, { useState } from 'react';
import { X, Lock, KeyRound, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  lang: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '2026' || pin.trim() === 'admin') {
      setError(false);
      onLoginSuccess();
      onClose();
      setPin('');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-[360px] rounded-3xl bg-[#fdf9f1] border border-[#ddc0ba]/60 shadow-2xl p-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-[#57423d] flex items-center justify-center shadow-xs border border-[#ddc0ba]/40 hover:bg-[#ece8e0]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center pt-2 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdad2] flex items-center justify-center text-[#9e3c26] mb-2 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[18px] text-[#1c1c17] font-display">
            {lang === 'VI' ? 'Đăng Nhập Quản Trị' : '管理者ログイン'}
          </h3>
          <p className="text-[12px] text-[#57423d] font-body mt-1 max-w-[260px]">
            {lang === 'VI'
              ? 'Dành riêng cho chủ nhân hành trình để thêm ký ức, sửa bản đồ và quản lý địa điểm'
              : '旅の記録者専用の管理モードです。記憶の追加や地図の更新が可能です。'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3 font-display">
          <div>
            <label className="block text-[11px] font-bold text-[#57423d] uppercase tracking-wider mb-1">
              {lang === 'VI' ? 'Mã PIN bảo mật' : '暗証番号 (PIN)'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#8a726c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="2026"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#ddc0ba]/50 text-[15px] text-[#1c1c17] font-mono tracking-widest text-center focus:outline-none focus:border-[#9e3c26]"
              />
            </div>
            {error && (
              <p className="text-[11px] text-[#ba1a1a] font-medium mt-1 text-center">
                {lang === 'VI' ? 'Mã PIN chưa chính xác (Gợi ý: 2026)' : 'PINが正しくありません (ヒント: 2026)'}
              </p>
            )}
          </div>

          <div className="p-2 rounded-xl bg-[#f7f3eb] border border-[#ddc0ba]/30 flex items-center justify-between text-[11px] text-[#57423d]">
            <span>{lang === 'VI' ? 'Mã mặc định:' : '初期PIN:'}</span>
            <span className="font-mono font-bold text-[#9e3c26]">2026</span>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-full bg-[#9e3c26] text-white font-bold text-[14px] shadow-md hover:bg-[#822714] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-1"
          >
            <span>{lang === 'VI' ? 'Mở Trang Quản Trị' : '管理パネルを開く'}</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
