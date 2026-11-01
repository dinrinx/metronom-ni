"use client";

import { ReactNode, useRef, useState } from "react";

interface BottomSheetProps {
  children: ReactNode;
  onDismiss: () => void;
}

export function BottomSheet({ children, onDismiss }: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);
  const dragging = useRef(false);

  function handlePointerDown(e: React.PointerEvent) {
    startY.current = e.clientY;
    dragging.current = true;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current || startY.current === null) return;
    const delta = e.clientY - startY.current;
    if (delta > 0) setDragY(delta);
  }

  function handlePointerUp() {
    dragging.current = false;
    if (dragY > 80) {
      onDismiss();
    } else {
      setDragY(0);
    }
    startY.current = null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30" onClick={onDismiss}>
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ transform: `translateY(${dragY}px)` }}
        className="w-full max-w-md rounded-t-2xl bg-white px-6 pb-8 pt-3 transition-transform"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border-default" />
        {children}
      </div>
    </div>
  );
}
