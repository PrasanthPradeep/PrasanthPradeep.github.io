import React, { useState, useEffect, memo } from 'react';

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!( document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement)
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const root = document.documentElement;

    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (root.requestFullscreen) {
        root.requestFullscreen();
      } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen();
      } else if (root.mozRequestFullScreen) {
        root.mozRequestFullScreen();
      } else if (root.msRequestFullscreen) {
        root.msRequestFullscreen();
      }
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
      className="fixed bottom-12 right-4 z-50 px-3 py-2 rounded-md text-xs font-medium bg-[rgba(36,40,59,0.75)] border border-[rgba(74,79,105,0.6)] shadow-lg hover:bg-[rgba(55,60,82,0.85)] active:scale-95 transition transform text-cyan-300"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <span>{isFullscreen ? '🡼' : '⛶'}</span>
    </button>
  );
};

export default memo(FullscreenToggle);
