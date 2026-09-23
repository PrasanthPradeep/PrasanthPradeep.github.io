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
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      className="fixed bottom-14 right-4 z-50 flex items-center justify-center w-9 h-9 rounded-md bg-transparent border-0 text-[#c0caf5] hover:bg-[rgba(122,162,247,0.12)] active:scale-95 transition-colors cursor-pointer"
    >
      {isFullscreen ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M3 3h4.5a.5.5 0 01.5.5v4M17 3h-4.5a.5.5 0 00-.5.5v4M3 17h4.5a.5.5 0 00.5-.5v-4M17 17h-4.5a.5.5 0 01-.5-.5v-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M3 3h4.5a.5.5 0 01.5.5v4M17 3h-4.5a.5.5 0 00-.5.5v4M3 17h4.5a.5.5 0 00.5-.5v-4M17 17h-4.5a.5.5 0 01-.5-.5v-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 10l3-3 3 3M10 7v6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
};

export default memo(FullscreenToggle);
