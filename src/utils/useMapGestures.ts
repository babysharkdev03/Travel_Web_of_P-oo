import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';

export const useMapGestures = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);

  const distance = () => {
    const [a, b] = [...pointers.current.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('button, [role="button"]')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) pinch.current = { distance: Math.max(distance(), 1), zoom: zoomLevel };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      setZoomLevel(Math.max(1, Math.min(3, pinch.current.zoom * distance() / pinch.current.distance)));
    } else if (pointers.current.size === 1) {
      setPan((current) => ({
        x: Math.max(-220, Math.min(220, current.x + event.clientX - previous.x)),
        y: Math.max(-220, Math.min(220, current.y + event.clientY - previous.y)),
      }));
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    pinch.current = null;
  };

  const reset = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  return {
    zoomLevel, setZoomLevel, pan, reset,
    gestures: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
};
