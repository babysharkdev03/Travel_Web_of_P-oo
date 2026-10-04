import React from 'react';
import { Language } from '../types';
import { PIANO_PLAYLIST } from '../utils/audioPlayer';
import { Play, SkipForward } from 'lucide-react';

interface PianoPlayerBoxProps {
  lang: Language;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeTrackIndex: number;
  onSelectTrack: (index: number) => void;
}

export const PianoPlayerBox: React.FC<PianoPlayerBoxProps> = ({
  lang,
  isPlaying,
  onTogglePlay,
  activeTrackIndex,
  onSelectTrack,
}) => {
  const currentTrack = PIANO_PLAYLIST[activeTrackIndex];
  const trackTitle = lang === 'VI' ? currentTrack.titleVI : currentTrack.titleJA;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (activeTrackIndex + 1) % PIANO_PLAYLIST.length;
    onSelectTrack(nextIdx);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 pt-2 pb-0.5 select-none">
      {/* Thanh nhạc tối giản (Minimalist Piano Strip) */}
      <div
        onClick={onTogglePlay}
        className="group cursor-pointer flex items-center justify-between h-9 px-3.5 rounded-full bg-[#f7f3eb] border border-[#ddc0ba]/50 hover:border-[#be543c]/50 transition-all duration-200 shadow-xs"
        title={
          isPlaying
            ? (lang === 'VI' ? 'Chạm để tạm dừng • Bấm icon để chuyển bài' : 'タップして一時停止')
            : (lang === 'VI' ? 'Chạm để phát nhạc Piano Chill' : 'タップしてピアノを再生')
        }
      >
        {/* Left: Indicator & Track Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className={`w-2 h-2 rounded-full transition-colors flex-shrink-0 ${
              isPlaying ? 'bg-[#9e3c26] animate-pulse ring-2 ring-[#ffdad2]' : 'bg-[#8a726c]'
            }`}
          />
          <p className="text-[11px] text-[#57423d] truncate font-body">
            <span className="text-[#1c1c17] font-semibold">Piano:</span>{' '}
            <span className="text-[#9e3c26] font-bold font-display group-hover:underline">
              {trackTitle}
            </span>
          </p>
        </div>

        {/* Right: Soundwave animation / Play icon + Next button */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {isPlaying ? (
            <span className="flex gap-0.5 items-end h-3 px-1">
              <span className="w-0.5 bg-[#9e3c26] h-2 animate-bounce"></span>
              <span className="w-0.5 bg-[#9e3c26] h-3 animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-0.5 bg-[#9e3c26] h-1.5 animate-bounce [animation-delay:0.3s]"></span>
            </span>
          ) : (
            <Play className="w-3 h-3 text-[#57423d] fill-current mx-1" />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#57423d] hover:text-[#9e3c26] hover:bg-white active:scale-90 transition-all"
            title={lang === 'VI' ? 'Chuyển bản piano tiếp theo' : '次の曲へ'}
          >
            <SkipForward className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
