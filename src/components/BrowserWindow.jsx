import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

const BrowserWindow = ({
  ariaLabel,
  initialPosition = { x: 120, y: 92 },
  isVisible,
  onClose,
  onFocusWindow,
  children,
  renderFrame = true,
  title,
  url,
  zIndex = 20
}) => {
  const windowRef = useRef(null);
  const iframeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    if (isMaximized || !windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((event) => {
    if (!isDragging) return;

    setPosition({
      x: Math.max(8, Math.min(window.innerWidth - 160, event.clientX - dragOffset.x)),
      y: Math.max(8, Math.min(window.innerHeight - 96, event.clientY - dragOffset.y))
    });
  }, [dragOffset, isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return undefined;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isDragging]);

  useEffect(() => {
    if (!isVisible || !onFocusWindow) return undefined;

    const handleWindowBlur = () => {
      window.setTimeout(() => {
        if (document.activeElement === iframeRef.current) {
          onFocusWindow();
        }
      }, 0);
    };

    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isVisible, onFocusWindow]);

  if (!isVisible) return null;

  return (
    <section
      ref={windowRef}
      className={`browser-window fixed flex flex-col overflow-hidden shadow-2xl ${
        isMaximized ? 'rounded-none' : 'rounded-lg'
      }`}
      onMouseDownCapture={onFocusWindow}
      style={{
        top: isMaximized ? 0 : `${position.y}px`,
        left: isMaximized ? 0 : `${position.x}px`,
        width: isMaximized ? '100%' : 'min(1040px, calc(100vw - 32px))',
        height: isMaximized ? '100%' : 'min(720px, calc(100vh - 88px))',
        background: 'rgba(21, 22, 30, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: isMaximized ? 0 : '1px solid rgba(74, 79, 105, 0.45)',
        zIndex
      }}
      aria-label={ariaLabel}
    >
      <div
        className="browser-window-header flex items-center gap-3 border-b border-[rgba(74,79,105,0.45)] bg-[rgba(30,30,46,0.72)] px-3 py-2"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <button
            className="h-3 w-3 rounded-full bg-red-500"
            onClick={onClose}
            title={`Close ${title}`}
            aria-label={`Close ${title}`}
          />
          <button
            className="h-3 w-3 rounded-full bg-yellow-500"
            onClick={() => setIsMaximized((value) => !value)}
            title={isMaximized ? `Restore ${title}` : `Maximize ${title}`}
            aria-label={isMaximized ? `Restore ${title}` : `Maximize ${title}`}
          />
          <button
            className="h-3 w-3 rounded-full bg-green-500"
            onClick={onClose}
            title={`Minimize ${title}`}
            aria-label={`Minimize ${title}`}
          />
        </div>

        <div className="browser-address min-w-0 flex-1 rounded border border-[rgba(168,177,214,0.12)] bg-[rgba(12,13,16,0.45)] px-3 py-1 text-xs text-[#c0caf5]">
          <span className="block truncate">{url}</span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded border border-[rgba(168,177,214,0.18)] px-2 py-1 text-xs text-[#c0caf5] hover:bg-[rgba(255,255,255,0.04)] hover:no-underline"
        >
          Open
        </a>
      </div>

      {renderFrame ? (
        <iframe
          ref={iframeRef}
          title={title}
          src={url}
          className="min-h-0 flex-1 border-0 bg-[#0C0D10]"
          loading="lazy"
          onFocus={onFocusWindow}
          onMouseDown={onFocusWindow}
        />
      ) : (
        <div className="browser-window-content min-h-0 flex-1 overflow-y-auto bg-[#0C0D10]">
          {children}
        </div>
      )}
    </section>
  );
};

export default memo(BrowserWindow);
