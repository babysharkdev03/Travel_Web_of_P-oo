import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  const parseInlineFormatting = (text: string): React.ReactNode[] => {
    // Helper to parse bold, italic, underline, custom colors, highlights, etc.
    const elements: React.ReactNode[] = [];
    let current = text;
    let keyIdx = 0;

    // Pattern to match markdown & Notion inline tokens:
    // **bold**, *italic*, <u>underline</u>, ~~strike~~, [color:...]...[/color], [bg:...]...[/bg], etc.
    const tokenRegex =
      /(\*\*(.*?)\*\*|\*(.*?)\*|<u>(.*?)<\/u>|~~(.*?)~~|\[color:(.*?)\](.*?)\[\/color\]|\[bg:(.*?)\](.*?)\[\/bg\]|\[(muted|bold|terracotta|forest|gold)\](.*?)\[\/\1\])/;

    while (current.length > 0) {
      const match = current.match(tokenRegex);
      if (!match || match.index === undefined) {
        elements.push(<span key={keyIdx++}>{current}</span>);
        break;
      }

      if (match.index > 0) {
        elements.push(
          <span key={keyIdx++}>{current.substring(0, match.index)}</span>
        );
      }

      const fullMatch = match[0];
      if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
        elements.push(
          <strong key={keyIdx++} className="font-bold text-[#1c1c17]">
            {match[2]}
          </strong>
        );
      } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
        elements.push(
          <em key={keyIdx++} className="italic font-serif opacity-95">
            {match[3]}
          </em>
        );
      } else if (fullMatch.startsWith('<u>') && fullMatch.endsWith('</u>')) {
        elements.push(
          <span
            key={keyIdx++}
            className="underline underline-offset-4 decoration-[#9e3c26]/60 font-medium"
          >
            {match[4]}
          </span>
        );
      } else if (fullMatch.startsWith('~~') && fullMatch.endsWith('~~')) {
        elements.push(
          <span key={keyIdx++} className="line-through opacity-70">
            {match[5]}
          </span>
        );
      } else if (match[6] && match[7]) {
        // [color:name]text[/color]
        const colorName = match[6];
        const bodyText = match[7];
        let colorClass = 'text-[#1c1c17]';
        if (colorName === 'muted' || colorName === 'gray')
          colorClass = 'text-[#8a726c] opacity-80';
        else if (colorName === 'bold' || colorName === 'black')
          colorClass = 'font-bold text-[#1c1c17]';
        else if (colorName === 'terracotta' || colorName === 'red')
          colorClass = 'text-[#9e3c26] font-semibold';
        else if (colorName === 'forest' || colorName === 'green')
          colorClass = 'text-[#3d653e] font-semibold';
        else if (colorName === 'blue')
          colorClass = 'text-[#1e5d88] font-semibold';
        else if (colorName === 'purple')
          colorClass = 'text-[#6b3ba7] font-semibold';
        else if (colorName === 'gold' || colorName === 'orange')
          colorClass = 'text-[#b87c28] font-semibold';

        elements.push(
          <span key={keyIdx++} className={colorClass}>
            {bodyText}
          </span>
        );
      } else if (match[8] && match[9]) {
        // [bg:name]text[/bg] Notion Highlights
        const bgName = match[8];
        const bodyText = match[9];
        let bgClass = 'bg-[#fef3c7] text-[#92400e]'; // default yellow
        if (bgName === 'yellow') bgClass = 'bg-[#fef3c7] text-[#92400e]';
        else if (bgName === 'orange') bgClass = 'bg-[#ffedd5] text-[#9a3412]';
        else if (bgName === 'pink') bgClass = 'bg-[#fce7f3] text-[#9d174d]';
        else if (bgName === 'green') bgClass = 'bg-[#dcfce7] text-[#166534]';
        else if (bgName === 'blue') bgClass = 'bg-[#e0f2fe] text-[#075985]';
        else if (bgName === 'purple') bgClass = 'bg-[#f3e8ff] text-[#6b21a8]';
        else if (bgName === 'gray') bgClass = 'bg-[#f3f4f6] text-[#374151]';

        elements.push(
          <mark
            key={keyIdx++}
            className={`px-1.5 py-0.5 rounded-md font-medium text-[13px] ${bgClass}`}
          >
            {bodyText}
          </mark>
        );
      } else if (match[10]) {
        // [muted] / [bold] / [terracotta] / [forest]
        const tone = match[10];
        const bodyText = match[11];
        let colorClass = 'text-[#1c1c17]';
        if (tone === 'muted') colorClass = 'text-[#8a726c] opacity-80';
        else if (tone === 'bold') colorClass = 'font-bold text-[#1c1c17]';
        else if (tone === 'terracotta') colorClass = 'text-[#9e3c26] font-semibold';
        else if (tone === 'forest') colorClass = 'text-[#3d653e] font-semibold';
        else if (tone === 'gold') colorClass = 'text-[#b87c28] font-semibold';

        elements.push(
          <span key={keyIdx++} className={colorClass}>
            {bodyText}
          </span>
        );
      }

      current = current.substring(match.index + fullMatch.length);
    }

    return elements;
  };

  // Pre-process multiline [image-side] blocks
  // Syntax:
  // [image-side src="..." align="left|right" caption="..."]
  // Long story content written beside the image...
  // [/image-side]
  const renderBlocks = () => {
    const rawLines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        nodes.push(<div key={`spacer-${i}`} className="h-1.5" />);
        i++;
        continue;
      }

      // 1. [image-side] BLOCK (MULTILINE OR SINGLE LINE)
      // Cho phép ảnh nhỏ căn sang trái/phải, có chú thích ảnh bên dưới và nội dung dài viết bên cạnh
      if (trimmed.startsWith('[image-side') || trimmed.match(/^\[image-side\s+/i)) {
        let tagLine = trimmed;
        let sideText = '';
        let endIdx = i;

        // Check if single line has [/image-side]
        if (tagLine.includes('[/image-side]')) {
          const match = tagLine.match(/^\[image-side\s+(.*?)\](.*?)\[\/image-side\]$/i);
          if (match) {
            tagLine = `[image-side ${match[1]}]`;
            sideText = match[2];
          }
        } else {
          // Multiline gathering
          const textLines: string[] = [];
          i++;
          while (i < rawLines.length) {
            const nextL = rawLines[i];
            if (nextL.trim().includes('[/image-side]')) {
              const beforeEnd = nextL.replace(/\[\/image-side\].*$/i, '');
              if (beforeEnd.trim()) textLines.push(beforeEnd);
              break;
            }
            textLines.push(nextL);
            i++;
          }
          sideText = textLines.join('\n');
        }

        const srcMatch = tagLine.match(/src="([^"]+)"/i);
        const alignMatch = tagLine.match(/align="([^"]+)"/i);
        const captionMatch = tagLine.match(/caption="([^"]*)"/i);

        const src = srcMatch ? srcMatch[1] : '';
        const align = alignMatch ? alignMatch[1] : 'left';
        const caption = captionMatch ? captionMatch[1] : '';

        const isRight = align === 'right';

        nodes.push(
          <div
            key={`img-side-${endIdx}`}
            className="my-4 flex flex-col md:flex-row gap-5 items-start bg-[#fcf9f2]/80 p-3.5 sm:p-5 rounded-2xl border border-[#ddc0ba]/50 shadow-2xs"
          >
            {/* Image Column */}
            <div
              className={`w-full md:w-[42%] flex-shrink-0 flex flex-col ${
                isRight ? 'order-1 md:order-2' : 'order-1'
              }`}
            >
              <div className="rounded-2xl overflow-hidden border border-[#ddc0ba]/60 bg-[#ece8e0] shadow-xs group">
                <img
                  src={src}
                  alt={caption || 'Ảnh minh họa'}
                  className="w-full h-auto max-h-[380px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              {caption && (
                <div className="mt-1.5 px-1 flex items-start gap-1 text-[11.5px] italic text-[#8a726c] font-body leading-tight">
                  <span className="opacity-80">📸</span>
                  <span>{caption}</span>
                </div>
              )}
            </div>

            {/* Long Story Content Column beside the image */}
            <div
              className={`flex-1 min-w-0 text-[14px] text-[#1c1c17] leading-relaxed flex flex-col gap-2 ${
                isRight ? 'order-2 md:order-1' : 'order-2'
              }`}
            >
              {sideText.trim() ? (
                sideText.split('\n').map((pLine, pIdx) => {
                  const pTrimmed = pLine.trim();
                  if (!pTrimmed) return null;
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {parseInlineFormatting(pTrimmed)}
                    </p>
                  );
                })
              ) : (
                <p className="italic text-[#8a726c] text-[13px]">
                  (Nội dung câu chuyện viết bên cạnh ảnh)
                </p>
              )}
            </div>
          </div>
        );

        i++;
        continue;
      }

      // 2. HORIZONTAL DIVIDER
      if (trimmed === '---' || trimmed === '***') {
        nodes.push(
          <hr
            key={`hr-${i}`}
            className="my-3 border-0 border-t border-[#ddc0ba]/50"
          />
        );
        i++;
        continue;
      }

      // 3. IN-ARTICLE IMAGE TAG: [image src="..." size="..." align="..." caption="..." text="..."]
      const imageBlockMatch = trimmed.match(
        /^\[image\s+src="([^"]+)"(?:\s+size="([^"]+)")?(?:\s+align="([^"]+)")?(?:\s+caption="([^"]*)")?(?:\s+text="([^"]*)")?\]$/i
      );

      if (imageBlockMatch) {
        const src = imageBlockMatch[1];
        const size = imageBlockMatch[2] || 'medium';
        const align = imageBlockMatch[3] || 'center';
        const caption = imageBlockMatch[4];
        const sideText = imageBlockMatch[5];

        // If it has side text or size is small with left/right alignment and sideText is present
        if (sideText && sideText.trim()) {
          const isRight = align === 'right';
          nodes.push(
            <div
              key={`img-inline-side-${i}`}
              className="my-4 flex flex-col md:flex-row gap-5 items-start bg-[#fcf9f2]/80 p-3.5 sm:p-5 rounded-2xl border border-[#ddc0ba]/50 shadow-2xs"
            >
              <div
                className={`w-full md:w-[42%] flex-shrink-0 flex flex-col ${
                  isRight ? 'order-1 md:order-2' : 'order-1'
                }`}
              >
                <div className="rounded-2xl overflow-hidden border border-[#ddc0ba]/60 bg-[#ece8e0] shadow-xs">
                  <img
                    src={src}
                    alt={caption || 'Ảnh bài viết'}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {caption && (
                  <div className="mt-1.5 px-1 flex items-start gap-1 text-[11.5px] italic text-[#8a726c] font-body leading-tight">
                    <span>📸</span>
                    <span>{caption}</span>
                  </div>
                )}
              </div>

              <div
                className={`flex-1 min-w-0 text-[14px] text-[#1c1c17] leading-relaxed ${
                  isRight ? 'order-2 md:order-1' : 'order-2'
                }`}
              >
                <p>{parseInlineFormatting(sideText)}</p>
              </div>
            </div>
          );
          i++;
          continue;
        }

        // Standard standalone image block
        let sizeClass = 'w-full md:w-3/4 mx-auto';
        if (size === 'small') sizeClass = 'w-full md:w-2/5';
        else if (size === 'medium') sizeClass = 'w-full md:w-3/4 mx-auto';
        else if (size === 'full') sizeClass = 'w-full';

        let alignClass = 'mx-auto text-center';
        if (align === 'left') alignClass = 'md:mr-auto md:ml-0 text-left';
        else if (align === 'right') alignClass = 'md:ml-auto md:mr-0 text-right';

        nodes.push(
          <div
            key={`img-${i}`}
            className={`my-3 flex flex-col ${alignClass} ${sizeClass}`}
          >
            <div className="rounded-2xl overflow-hidden border border-[#ddc0ba]/60 bg-[#ece8e0] shadow-xs group">
              <img
                src={src}
                alt={caption || 'Ảnh bài viết'}
                className="w-full h-auto max-h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            {caption && (
              <span className="text-[11.5px] italic text-[#8a726c] mt-1.5 px-1 font-body block">
                📸 {caption}
              </span>
            )}
          </div>
        );
        i++;
        continue;
      }

      // 4. MARKDOWN IMAGE ![caption](url)
      const mdImgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (mdImgMatch) {
        const caption = mdImgMatch[1];
        const src = mdImgMatch[2];
        nodes.push(
          <div key={`mdimg-${i}`} className="my-3 w-full md:w-3/4 mx-auto text-center">
            <div className="rounded-2xl overflow-hidden border border-[#ddc0ba]/60 bg-[#ece8e0] shadow-xs">
              <img
                src={src}
                alt={caption || 'Ảnh bài viết'}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
            {caption && (
              <span className="text-[11.5px] italic text-[#8a726c] mt-1.5 px-1 block font-body">
                📸 {caption}
              </span>
            )}
          </div>
        );
        i++;
        continue;
      }

      // 5. H1 HEADING
      if (trimmed.startsWith('# ')) {
        nodes.push(
          <h3
            key={`h1-${i}`}
            className="text-[19px] font-bold text-[#1c1c17] font-display pt-3 pb-1 border-b border-[#ddc0ba]/40 tracking-tight"
          >
            {parseInlineFormatting(trimmed.substring(2))}
          </h3>
        );
        i++;
        continue;
      }

      // 6. H2 HEADING
      if (trimmed.startsWith('## ')) {
        nodes.push(
          <h4
            key={`h2-${i}`}
            className="text-[16px] font-bold text-[#9e3c26] font-display pt-2"
          >
            {parseInlineFormatting(trimmed.substring(3))}
          </h4>
        );
        i++;
        continue;
      }

      // 7. H3 HEADING
      if (trimmed.startsWith('### ')) {
        nodes.push(
          <h5
            key={`h3-${i}`}
            className="text-[14px] font-bold uppercase tracking-wider text-[#57423d] pt-1.5"
          >
            {parseInlineFormatting(trimmed.substring(4))}
          </h5>
        );
        i++;
        continue;
      }

      // 8. NOTION CALLOUT BLOCK
      const calloutMatch = trimmed.match(
        /^\[callout(?:\s+icon=([^\]\s]+))?(?:\s+color=([^\]\s]+))?\](.*?)\[\/callout\]$/
      );
      if (calloutMatch) {
        const icon = calloutMatch[1] || '💡';
        const color = calloutMatch[2] || 'amber';
        const calloutText = calloutMatch[3];

        let calloutBg = 'bg-[#f7f3eb] border-[#ddc0ba]/60';
        if (color === 'yellow') calloutBg = 'bg-[#fef9c3]/60 border-[#fde047]';
        else if (color === 'green') calloutBg = 'bg-[#dcfce7]/60 border-[#86efac]';
        else if (color === 'pink') calloutBg = 'bg-[#fce7f3]/60 border-[#f472b6]';
        else if (color === 'blue') calloutBg = 'bg-[#e0f2fe]/60 border-[#7dd3fc]';

        nodes.push(
          <div
            key={`callout-${i}`}
            className={`p-3.5 my-1.5 rounded-2xl border flex items-start gap-3 shadow-xs ${calloutBg}`}
          >
            <span className="text-[18px] flex-shrink-0 select-none">{icon}</span>
            <div className="text-[13.5px] text-[#1c1c17] font-medium leading-relaxed flex-1">
              {parseInlineFormatting(calloutText)}
            </div>
          </div>
        );
        i++;
        continue;
      }

      // 9. BLOCKQUOTE
      if (
        trimmed.startsWith('> ') ||
        trimmed.startsWith('“') ||
        trimmed.startsWith('"')
      ) {
        const quoteContent = trimmed.startsWith('> ')
          ? trimmed.substring(2)
          : trimmed;
        nodes.push(
          <blockquote
            key={`quote-${i}`}
            className="border-l-3 border-[#9e3c26] pl-4 py-2 my-1.5 bg-[#fbf9f5] rounded-r-2xl italic text-[13.5px] text-[#57423d] font-serif leading-relaxed"
          >
            {parseInlineFormatting(quoteContent)}
          </blockquote>
        );
        i++;
        continue;
      }

      // 10. BULLET LIST
      if (
        trimmed.startsWith('• ') ||
        trimmed.startsWith('- ') ||
        trimmed.startsWith('* ')
      ) {
        nodes.push(
          <div key={`bullet-${i}`} className="flex items-start gap-2.5 pl-2 my-0.5">
            <span className="text-[#9e3c26] font-bold leading-relaxed select-none">
              •
            </span>
            <span className="flex-1 text-[13.5px] text-[#1c1c17]">
              {parseInlineFormatting(trimmed.substring(2))}
            </span>
          </div>
        );
        i++;
        continue;
      }

      // 11. STANDARD PARAGRAPH
      nodes.push(
        <p key={`p-${i}`} className="text-[#1c1c17] leading-relaxed">
          {parseInlineFormatting(trimmed)}
        </p>
      );
      i++;
    }

    return nodes;
  };

  return (
    <div
      className={`flex flex-col gap-2.5 font-body leading-relaxed text-[14px] ${className}`}
    >
      {renderBlocks()}
    </div>
  );
};
