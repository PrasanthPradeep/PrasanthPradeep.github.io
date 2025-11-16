import React, { memo } from 'react';

const DesktopIcons = ({ onCommandClick }) => {
  const icons = [
    {
      id: 'about',
      command: 'about',
      label: 'About Me',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    {
      id: 'social',
      command: 'social',
      label: 'Social',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      )
    },
    {
      id: 'projects',
      command: 'projects',
      label: 'Projects',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      )
    },
    {
      id: 'github',
      command: null,
      label: 'GitHub',
      href: 'https://github.com/PrasanthPradeep',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      )
    },
    {
      id: 'terminal',
      command: 'terminal',
      label: 'Terminal',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="4" width="19" height="16" rx="3" ry="3" />
          <path d="M7 9l4 3-4 3" />
          <path d="M13 15h4" />
        </svg>
      )
    }
  ];

  const handleClick = (e, icon) => {
    e.preventDefault();
    if (icon.href) {
      window.open(icon.href, '_blank');
    } else if (icon.command && onCommandClick) {
      onCommandClick(icon.command);
    }
  };

  return (
    <div 
      id="desktop-icons" 
      className="fixed top-0 left-1/2 transform -translate-x-1/2 p-4 z-10 flex flex-row space-x-4"
    >
      {icons.map((icon) => (
        <a
          key={icon.id}
          href={icon.href || '#'}
          onClick={(e) => handleClick(e, icon)}
          className="desktop-icon p-2 rounded-lg text-[#c0caf5] no-underline flex flex-col items-center w-20 text-center transition-colors hover:bg-[rgba(192,202,245,0.1)]"
        >
          <div className="w-10 h-10 mb-2">
            {icon.svg}
          </div>
          <span className="text-xs" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {icon.label}
          </span>
        </a>
      ))}
    </div>
  );
};

export default memo(DesktopIcons);
