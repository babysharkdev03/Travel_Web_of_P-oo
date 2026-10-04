import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Quote,
  List,
  Sparkles,
  Eye,
  Edit3,
  Palette,
  Image as ImageIcon,
  Minus,
  Laptop,
  Smartphone,
  Check,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { RichTextRenderer } from './RichTextRenderer';

interface NotionJournalEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  imageSize?: 'small' | 'medium' | 'full';
  onChangeImageSize?: (size: 'small' | 'medium' | 'full') => void;
  imageAspect?: 'square' | 'standard' | 'wide';
  onChangeImageAspect?: (aspect: 'square' | 'standard' | 'wide') => void;
  coverImage?: string;
  title?: string;
  locationName?: string;
  date?: string;
  weather?: string;
  icon?: string;
}

export const NotionJournalEditor: React.FC<NotionJournalEditorProps> = ({
  value,
  onChange,
  placeholder = 'Chia sẻ cảm xúc, hành trình, kỷ niệm...',
  imageSize = 'full',
  onChangeImageSize,
  imageAspect = 'standard',
  onChangeImageAspect,
  coverImage,
  title,
  locationName,
  date,
  weather = '🌸',
  icon = '🌸',
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'web' | 'phone'>('web');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  // In-article Image Dialog states
  const [inArticleImgUrl, setInArticleImgUrl] = useState(
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
  );
  const [inArticleImgCaption, setInArticleImgCaption] = useState('');
  const [inArticleSideStory, setInArticleSideStory] = useState('');
  const [inArticleImgSize, setInArticleImgSize] = useState<
    'small' | 'medium' | 'full'
  >('small');
  const [inArticleImgAlign, setInArticleImgAlign] = useState<
    'left' | 'center' | 'right'
  >('left');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const samplePhotoPresets = [
    {
      label: 'Cổng Torii Kyoto',
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Phố cổ Sakai / Kyoto',
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Hoa anh đào nở',
      url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Sông Hoài Hội An',
      url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Mây núi Sa Pa',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Tàu điện Tokyo',
      url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const applyFormat = (
    prefix: string,
    suffix: string = '',
    defaultText: string = 'văn bản'
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const before = value.substring(0, start);
    const after = value.substring(end);

    const replacement = `${prefix}${selectedText}${suffix}`;
    const nextValue = `${before}${replacement}${after}`;
    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const insertBlock = (prefix: string, defaultText: string = 'Nội dung...') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = value.substring(0, start);
    const after = value.substring(start);

    const needsNewline = before.length > 0 && !before.endsWith('\n');
    const newlinePrefix = needsNewline ? '\n' : '';

    const insertion = `${newlinePrefix}${prefix}${defaultText}\n`;
    onChange(`${before}${insertion}${after}`);

    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const handleInsertInArticleImage = () => {
    if (!inArticleImgUrl.trim()) return;

    if (inArticleSideStory.trim()) {
      const sideBlock = `[image-side src="${inArticleImgUrl.trim()}" align="${inArticleImgAlign}" caption="${inArticleImgCaption.trim()}"]\n${inArticleSideStory.trim()}\n[/image-side]`;
      insertBlock('', sideBlock);
    } else {
      const imageTag = `[image src="${inArticleImgUrl.trim()}" size="${inArticleImgSize}" align="${inArticleImgAlign}" caption="${inArticleImgCaption.trim()}"]`;
      insertBlock('', imageTag);
    }

    setShowImageDialog(false);
    setInArticleImgCaption('');
    setInArticleSideStory('');
  };

  return (
    <div className="flex flex-col rounded-3xl bg-white border border-[#ddc0ba]/60 shadow-sm overflow-hidden font-display transition-all">
      {/* Top Header / Mode Switcher */}
      <div className="px-3.5 py-2.5 bg-[#fbf9f5] border-b border-[#ddc0ba]/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9e3c26]" />
          <span className="text-[12.5px] font-bold text-[#1c1c17]">
            Soạn Thảo Bài Viết Chuẩn Notion / Word
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f1ede6] text-[#57423d] font-bold hidden sm:inline-block">
            Tùy biến chữ đậm nhạt, chèn ảnh bài viết, chỉnh cỡ ảnh
          </span>
        </div>

        {/* Tab Toggle: Soạn thảo vs Xem trước (Web/Phone) */}
        <div className="flex items-center bg-[#ece8e0] p-0.5 rounded-xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'editor'
                ? 'bg-white text-[#9e3c26] shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Soạn thảo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-[#9e3c26] shadow-xs'
                : 'text-[#57423d] hover:text-[#1c1c17]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trước</span>
          </button>
        </div>
      </div>

      {/* Editor Controls Bar (Notion Toolbar) */}
      {activeTab === 'editor' && (
        <div className="px-3 py-1.5 bg-[#f7f3eb] border-b border-[#ddc0ba]/30 flex flex-wrap items-center gap-1 text-[#57423d]">
          {/* Headings */}
          <button
            type="button"
            onClick={() => insertBlock('## ', 'Tiêu đề đề mục')}
            className="p-1.5 rounded-lg hover:bg-white hover:text-[#1c1c17] transition-colors"
            title="Tiêu đề lớn (Heading 2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertBlock('### ', 'Tiêu đề phụ')}
            className="p-1.5 rounded-lg hover:bg-white hover:text-[#1c1c17] transition-colors"
            title="Tiêu đề vừa (Heading 3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-[#ddc0ba]/50 mx-0.5" />

          {/* Text Style */}
          <button
            type="button"
            onClick={() => applyFormat('**', '**', 'chữ in đậm')}
            className="p-1.5 rounded-lg hover:bg-white hover:text-[#1c1c17] transition-colors font-bold"
            title="In đậm (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('*', '*', 'chữ in nghiêng')}
            className="p-1.5 rounded-lg hover:bg-white hover:text-[#1c1c17] transition-colors italic"
            title="In nghiêng (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('<u>', '</u>', 'chữ gạch chân')}
            className="p-1.5 rounded-lg hover:bg-white hover:text-[#1c1c17] transition-colors"
            title="Gạch chân (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-[#ddc0ba]/50 mx-0.5" />

          {/* Text Tone & Contrast (Độ đậm nhạt & Màu chữ) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              className="px-2 py-1 rounded-lg hover:bg-white text-[11px] font-bold flex items-center gap-1 transition-colors"
              title="Độ đậm nhạt & Màu chữ"
            >
              <Palette className="w-3.5 h-3.5 text-[#9e3c26]" />
              <span>Chữ đậm nhạt</span>
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 z-30 p-2 rounded-2xl bg-white border border-[#ddc0ba]/60 shadow-xl flex flex-col gap-1 w-48 animate-fade-in text-[11px]">
                <span className="text-[10px] uppercase font-bold text-[#8a726c] px-2 py-0.5">
                  Độ Đậm & Màu Chữ
                </span>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[color:bold]', '[/color]', 'chữ đậm đen');
                    setShowColorPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left font-bold text-[#1c1c17] hover:bg-[#f7f3eb] flex items-center justify-between"
                >
                  <span>● Đậm sắc nét (Deep)</span>
                  <span className="font-bold">Aa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[color:muted]', '[/color]', 'chữ mờ nhẹ');
                    setShowColorPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left text-[#8a726c] hover:bg-[#f7f3eb] flex items-center justify-between"
                >
                  <span>● Mờ nhẹ nhàng (Muted)</span>
                  <span className="opacity-60">Aa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat(
                      '[color:terracotta]',
                      '[/color]',
                      'chữ đỏ gốm'
                    );
                    setShowColorPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left font-semibold text-[#9e3c26] hover:bg-[#f7f3eb] flex items-center justify-between"
                >
                  <span>● Đỏ gốm (Terracotta)</span>
                  <span className="text-[#9e3c26] font-bold">Aa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[color:forest]', '[/color]', 'chữ xanh rêu');
                    setShowColorPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left font-semibold text-[#3d653e] hover:bg-[#f7f3eb] flex items-center justify-between"
                >
                  <span>● Xanh rêu (Forest)</span>
                  <span className="text-[#3d653e] font-bold">Aa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[color:blue]', '[/color]', 'chữ xanh biển');
                    setShowColorPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left font-semibold text-[#1e5d88] hover:bg-[#f7f3eb] flex items-center justify-between"
                >
                  <span>● Xanh biển (Ocean)</span>
                  <span className="text-[#1e5d88] font-bold">Aa</span>
                </button>
              </div>
            )}
          </div>

          {/* Highlight Background (Màu nền tô sáng chuẩn Notion) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              className="px-2 py-1 rounded-lg hover:bg-white text-[11px] font-bold flex items-center gap-1 transition-colors"
              title="Màu nền highlight chuẩn Notion"
            >
              <span className="w-3.5 h-3.5 rounded-sm bg-[#fde047] border border-black/10 inline-block" />
              <span>Tô sáng nền</span>
            </button>

            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 z-30 p-2 rounded-2xl bg-white border border-[#ddc0ba]/60 shadow-xl flex flex-col gap-1 w-44 animate-fade-in text-[11px]">
                <span className="text-[10px] uppercase font-bold text-[#8a726c] px-2 py-0.5">
                  Tô nền chuẩn Notion
                </span>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[bg:yellow]', '[/bg]', 'chữ nền vàng');
                    setShowHighlightPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left hover:bg-[#f7f3eb] flex items-center gap-2"
                >
                  <span className="w-3 h-3 rounded-full bg-[#fde047]" />
                  <span>Vàng nắng (Yellow)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[bg:pink]', '[/bg]', 'chữ nền hồng');
                    setShowHighlightPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left hover:bg-[#f7f3eb] flex items-center gap-2"
                >
                  <span className="w-3 h-3 rounded-full bg-[#f472b6]" />
                  <span>Hồng sakura (Pink)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[bg:green]', '[/bg]', 'chữ nền xanh');
                    setShowHighlightPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left hover:bg-[#f7f3eb] flex items-center gap-2"
                >
                  <span className="w-3 h-3 rounded-full bg-[#86efac]" />
                  <span>Xanh matcha (Green)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[bg:blue]', '[/bg]', 'chữ nền xanh dương');
                    setShowHighlightPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left hover:bg-[#f7f3eb] flex items-center gap-2"
                >
                  <span className="w-3 h-3 rounded-full bg-[#7dd3fc]" />
                  <span>Xanh trời (Blue)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFormat('[bg:purple]', '[/bg]', 'chữ nền tím');
                    setShowHighlightPicker(false);
                  }}
                  className="px-2 py-1 rounded-lg text-left hover:bg-[#f7f3eb] flex items-center gap-2"
                >
                  <span className="w-3 h-3 rounded-full bg-[#c084fc]" />
                  <span>Tím lavender (Purple)</span>
                </button>
              </div>
            )}
          </div>

          <span className="w-px h-4 bg-[#ddc0ba]/50 mx-0.5" />

          {/* INSERT IN-ARTICLE IMAGE BUTTON */}
          <button
            type="button"
            onClick={() => setShowImageDialog(true)}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#ddc0ba]/60 hover:bg-[#9e3c26] hover:text-white text-[#9e3c26] text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            title="Thêm ảnh vào trong bài viết (Tách biệt với ảnh chủ đề)"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>+ Chèn ảnh bài viết</span>
          </button>

          {/* Blockquote, Callout, List, Divider */}
          <button
            type="button"
            onClick={() =>
              insertBlock(
                '> ',
                'Một câu trích dẫn hoặc cảm xúc sâu lắng của chuyến đi...'
              )
            }
            className="p-1.5 rounded-lg hover:bg-white hover:text-[#1c1c17] transition-colors"
            title="Khối trích dẫn (Quote)"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertBlock('• ', 'Điểm nhấn hành trình...')}
            className="p-1.5 rounded-lg hover:bg-white hover:text-[#1c1c17] transition-colors"
            title="Danh sách gạch đầu dòng (List)"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              insertBlock(
                '[callout icon=🌸 color=yellow]',
                'Khung ghi chú nổi bật lưu lại cảm xúc và trải nghiệm khó quên...[/callout]'
              )
            }
            className="px-2 py-1 rounded-lg hover:bg-white text-[11px] font-bold flex items-center gap-1 transition-colors text-[#9e3c26]"
            title="Khung cảm xúc Notion Callout"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khung nổi bật</span>
          </button>

          <button
            type="button"
            onClick={() => insertBlock('---', '')}
            className="p-1.5 rounded-lg hover:bg-white hover:text-[#1c1c17] transition-colors"
            title="Đường kẻ phân cách (Divider)"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* POPUP: CHÈN ẢNH VÀO BÀI VIẾT (IN-ARTICLE IMAGE DIALOG) */}
      {showImageDialog && (
        <div className="p-3.5 bg-[#fefaf3] border-b border-[#ddc0ba]/60 flex flex-col gap-3 animate-fade-in text-[12px]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#9e3c26] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>Chèn ảnh vào bài viết & Tùy chỉnh kích cỡ</span>
            </span>
            <button
              type="button"
              onClick={() => setShowImageDialog(false)}
              className="text-[#8a726c] hover:text-[#1c1c17] font-bold text-[13px]"
            >
              ✕ Đóng
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="url"
              value={inArticleImgUrl}
              onChange={(e) => setInArticleImgUrl(e.target.value)}
              placeholder="Dán link ảnh (https://...)"
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#ddc0ba]/60 text-[12px] text-[#1c1c17]"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {/* 1. CHÚ THÍCH ẢNH (NGẮN GỌN DƯỚI ẢNH) */}
              <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-white border border-[#ddc0ba]/40">
                <label className="text-[11px] font-bold text-[#57423d] uppercase flex items-center justify-between">
                  <span>1. Chú thích ảnh (Dòng ngắn ngay dưới ảnh):</span>
                </label>
                <input
                  type="text"
                  value={inArticleImgCaption}
                  onChange={(e) => setInArticleImgCaption(e.target.value)}
                  placeholder="VD: Cổng đền Sakai lúc sớm mai..."
                  className="w-full h-8 px-2.5 rounded-lg bg-[#fdfaf5] border border-[#ddc0ba]/40 text-[11.5px] text-[#1c1c17]"
                />
              </div>

              {/* 2. NỘI DUNG DÀI VIẾT BÊN CẠNH ẢNH */}
              <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-white border border-[#ddc0ba]/40">
                <label className="text-[11px] font-bold text-[#9e3c26] uppercase flex items-center justify-between">
                  <span>2. Nội dung viết bên cạnh ảnh:</span>
                  <span className="text-[10px] text-[#8a726c] font-normal italic">
                    (Khác với chú thích ảnh)
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={inArticleSideStory}
                  onChange={(e) => setInArticleSideStory(e.target.value)}
                  placeholder="Viết đoạn văn kể chuyện, cảm xúc hiển thị song song bên cạnh ảnh..."
                  className="w-full p-2 rounded-lg bg-[#fdfaf5] border border-[#ddc0ba]/40 text-[11.5px] text-[#1c1c17] resize-none focus:outline-none focus:border-[#9e3c26]"
                />
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] text-[#57423d] font-bold whitespace-nowrap">
              Gợi ý ảnh:
            </span>
            {samplePhotoPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInArticleImgUrl(preset.url);
                  setInArticleImgCaption(preset.label);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors border ${
                  inArticleImgUrl === preset.url
                    ? 'bg-[#9e3c26] text-white border-[#9e3c26]'
                    : 'bg-white text-[#57423d] border-[#ddc0ba]/40 hover:bg-[#ece8e0]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Controls: Size & Alignment */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#ddc0ba]/30">
            {/* Size options */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#57423d]">Kích cỡ ảnh:</span>
              <div className="flex items-center bg-[#ece8e0] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setInArticleImgSize('small')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                    inArticleImgSize === 'small'
                      ? 'bg-white text-[#9e3c26] shadow-xs'
                      : 'text-[#57423d]'
                  }`}
                >
                  🟢 Nhỏ (40%)
                </button>
                <button
                  type="button"
                  onClick={() => setInArticleImgSize('medium')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                    inArticleImgSize === 'medium'
                      ? 'bg-white text-[#9e3c26] shadow-xs'
                      : 'text-[#57423d]'
                  }`}
                >
                  🟡 Vừa (70%)
                </button>
                <button
                  type="button"
                  onClick={() => setInArticleImgSize('full')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                    inArticleImgSize === 'full'
                      ? 'bg-white text-[#9e3c26] shadow-xs'
                      : 'text-[#57423d]'
                  }`}
                >
                  🔵 Rộng (100%)
                </button>
              </div>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#57423d]">Căn lề:</span>
              <div className="flex items-center bg-[#ece8e0] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setInArticleImgAlign('left')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    inArticleImgAlign === 'left'
                      ? 'bg-white text-[#9e3c26] shadow-xs'
                      : 'text-[#57423d]'
                  }`}
                >
                  Trái
                </button>
                <button
                  type="button"
                  onClick={() => setInArticleImgAlign('center')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    inArticleImgAlign === 'center'
                      ? 'bg-white text-[#9e3c26] shadow-xs'
                      : 'text-[#57423d]'
                  }`}
                >
                  Giữa
                </button>
                <button
                  type="button"
                  onClick={() => setInArticleImgAlign('right')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    inArticleImgAlign === 'right'
                      ? 'bg-white text-[#9e3c26] shadow-xs'
                      : 'text-[#57423d]'
                  }`}
                >
                  Phải
                </button>
              </div>

              <button
                type="button"
                onClick={handleInsertInArticleImage}
                className="h-9 px-4 rounded-xl bg-[#9e3c26] text-white font-bold hover:bg-[#822714] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 ml-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Chèn vào bài</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COVER IMAGE SIZE CONTROL (Ảnh chủ đề) */}
      {onChangeImageSize && onChangeImageAspect && (
        <div className="px-3.5 py-2 bg-[#fdfaf5] border-b border-[#ddc0ba]/30 flex flex-wrap items-center justify-between gap-2 text-[11px] font-display">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#57423d]">
              Kích cỡ ảnh chủ đề:
            </span>
            <div className="flex items-center bg-[#ece8e0] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => onChangeImageSize('small')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  imageSize === 'small'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d]'
                }`}
              >
                Nhỏ (50%)
              </button>
              <button
                type="button"
                onClick={() => onChangeImageSize('medium')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  imageSize === 'medium'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d]'
                }`}
              >
                Vừa (75%)
              </button>
              <button
                type="button"
                onClick={() => onChangeImageSize('full')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  imageSize === 'full'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d]'
                }`}
              >
                Tràn viền (100%)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#57423d]">Tỷ lệ khung ảnh:</span>
            <div className="flex items-center bg-[#ece8e0] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => onChangeImageAspect('standard')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  imageAspect === 'standard'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d]'
                }`}
              >
                Chuẩn (4:3)
              </button>
              <button
                type="button"
                onClick={() => onChangeImageAspect('square')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  imageAspect === 'square'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d]'
                }`}
              >
                Vuông (1:1)
              </button>
              <button
                type="button"
                onClick={() => onChangeImageAspect('wide')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  imageAspect === 'wide'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d]'
                }`}
              >
                Toàn cảnh (16:9)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Body or Live Notion Preview */}
      {activeTab === 'editor' ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={8}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 bg-white text-[14px] text-[#1c1c17] font-body leading-relaxed focus:outline-none resize-y min-h-[180px] placeholder:text-[#8a726c]/50"
          />

          <div className="px-4 py-2 bg-[#fbf9f5] border-t border-[#ddc0ba]/30 flex items-center justify-between text-[11px] text-[#8a726c]">
            <div className="flex items-center gap-2">
              <span>💡 Mẹo: Bôi đen chữ để bấm nút in đậm, đổi màu</span>
              <span>•</span>
              <span>Bấm "+ Chèn ảnh bài viết" để chèn ảnh kèm chú thích</span>
            </div>
            <span>{value.length} ký tự</span>
          </div>
        </div>
      ) : (
        /* LIVE PREVIEW: RESPONSIVE WEB VS PHONE SIMULATION */
        <div className="p-4 bg-[#f4f0e8] min-h-[260px] flex flex-col gap-3 animate-fade-in">
          {/* Device Simulator Toggle Bar */}
          <div className="p-2.5 rounded-2xl bg-white border border-[#ddc0ba]/60 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1c1c17]">
              <span>Mô phỏng thiết bị người xem:</span>
            </div>

            <div className="flex items-center bg-[#ece8e0] p-0.5 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setPreviewDevice('web')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  previewDevice === 'web'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d] hover:text-[#1c1c17]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>💻 Xem kiểu Web (Máy tính)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('phone')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  previewDevice === 'phone'
                    ? 'bg-white text-[#9e3c26] shadow-xs'
                    : 'text-[#57423d] hover:text-[#1c1c17]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📱 Xem kiểu Điện thoại (Phone)</span>
              </button>
            </div>
          </div>

          {/* SIMULATED VIEW CONTAINER */}
          <div
            className={`w-full transition-all duration-300 mx-auto ${
              previewDevice === 'web'
                ? 'max-w-3xl'
                : 'max-w-[390px] border-4 border-[#2d2420] rounded-[36px] shadow-2xl overflow-hidden bg-white'
            }`}
          >
            {/* Phone Notch/Status Bar if Phone View */}
            {previewDevice === 'phone' && (
              <div className="w-full bg-[#2d2420] px-5 py-1.5 flex items-center justify-between text-[11px] text-white/80 font-mono">
                <span>9:41</span>
                <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            <div className="bg-[#fdf9f1] rounded-2xl overflow-hidden border border-[#ddc0ba]/50 shadow-xs flex flex-col">
              {/* Cover Image banner */}
              {coverImage && (
                <div className="w-full relative overflow-hidden bg-[#ece8e0] aspect-[16/7] max-h-[240px]">
                  <img
                    src={coverImage}
                    alt="Cover Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  <span className="absolute bottom-2 right-3 text-[10px] text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs font-mono">
                    Ảnh chủ đề (Cover)
                  </span>
                </div>
              )}

              {/* Notion Page Header (Icon + Title + Metadata) */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="flex items-center gap-2 -mt-7 sm:-mt-9 mb-2">
                  <span className="w-12 h-12 rounded-2xl bg-white border border-[#ddc0ba]/60 text-[24px] flex items-center justify-center shadow-md">
                    {icon}
                  </span>
                </div>

                <h1 className="text-[22px] sm:text-[26px] font-bold text-[#1c1c17] leading-tight font-display tracking-tight">
                  {title || 'Tựa đề bài viết ký ức'}
                </h1>

                {/* Notion Properties Grid */}
                <div className="mt-3 pt-3 border-t border-[#ddc0ba]/40 flex flex-wrap gap-2 text-[11.5px] text-[#57423d]">
                  {locationName && (
                    <span className="px-2.5 py-1 rounded-xl bg-white border border-[#ddc0ba]/40 shadow-2xs font-semibold flex items-center gap-1">
                      📍 {locationName}
                    </span>
                  )}
                  {date && (
                    <span className="px-2.5 py-1 rounded-xl bg-white border border-[#ddc0ba]/40 shadow-2xs font-semibold flex items-center gap-1">
                      📅 {date}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-xl bg-white border border-[#ddc0ba]/40 shadow-2xs font-semibold flex items-center gap-1">
                    Thời tiết: {weather}
                  </span>
                </div>
              </div>

              {/* Article Content Body with Rich Elements */}
              <div className="p-4 sm:p-6 pt-2">
                {value.trim() ? (
                  <RichTextRenderer content={value} />
                ) : (
                  <p className="text-[13px] italic text-[#8a726c] py-4">
                    Nội dung bài viết chưa có. Hãy quay lại tab Soạn thảo để viết
                    câu chuyện của bạn!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
