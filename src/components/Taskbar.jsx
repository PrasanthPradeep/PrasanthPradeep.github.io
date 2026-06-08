import React, { useState, useEffect, useRef, memo } from 'react';
import ToggleSiteSwitch from './ToggleSiteSwitch';

const iconMap = {
  about: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  social: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  ),
  projects: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  terminal: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4" width="19" height="16" rx="3" ry="3" />
      <path d="M7 9l4 3-4 3" />
      <path d="M13 15h4" />
    </svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  skills: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25M6.75 6.75L1.5 12l5.25 5.25M14.25 3.75l-4.5 16.5" />
    </svg>
  )
};

const startMenuItems = [
  { id: 'terminal', label: 'Terminal', command: 'terminal', description: 'Open command shell' },
  { id: 'projects', label: 'Projects', command: 'projects', description: 'Browse project site' },
  { id: 'social', label: 'Socials', command: 'social', description: 'Open connect hub' },
  { id: 'github', label: 'GitHub', command: 'github', description: 'Open profile window' },
  { id: 'about', label: 'About', command: 'about', description: 'Show terminal bio' },
  { id: 'skills', label: 'Skills', command: 'skills', description: 'Show skill list' }
];

const Taskbar = ({ onCommandClick, terminalActive }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const startMenuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!startOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!startMenuRef.current?.contains(event.target)) {
        setStartOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setStartOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [startOpen]);

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const taskbarIcons = [
    {
      id: 'start',
      title: 'Start',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M3.25 3A2.25 2.25 0 001 5.25v9.5A2.25 2.25 0 003.25 17h9.5A2.25 2.25 0 0015 14.75v-9.5A2.25 2.25 0 0012.75 3h-9.5zM9 5.5v3.167l2.21-.553a.75.75 0 01.882.882l-.553 2.21H14.5v.75h-3.167l.553 2.21a.75.75 0 01-.882.882L9 14.333V17.5h-.75v-3.167l-2.21.553a.75.75 0 01-.882-.882l.553-2.21H2.5v-.75h3.167l-.553-2.21a.75.75 0 01.882-.882L8.25 8.667V5.5H9z"></path>
        </svg>
      ),
      command: null
    },
    {
      id: 'about',
      title: 'About Me',
      svg: (
        iconMap.about
      ),
      command: 'about'
    },
    {
      id: 'social',
      title: 'Social',
      svg: (
        iconMap.social
      ),
      command: 'social'
    },
    {
      id: 'projects',
      title: 'Projects',
      svg: (
        iconMap.projects
      ),
      command: 'projects'
    },
    {
      id: 'terminal',
      title: 'Terminal',
      svg: (
        iconMap.terminal
      ),
      command: 'terminal'
    }
  ];

  const launchCommand = (command) => {
    onCommandClick(command);
    setStartOpen(false);
  };

  return (
    <div 
      id="taskbar"
      className="fixed bottom-0 left-0 z-[10000] flex h-10 w-full items-center justify-between border-t border-[rgba(74,79,105,0.4)] bg-[rgba(36,40,59,0.75)] px-2 backdrop-blur"
    >
      <div ref={startMenuRef} className="relative flex items-center">
        {startOpen && (
          <div
            className="start-menu absolute bottom-11 left-0 w-[min(360px,calc(100vw-16px))] overflow-hidden rounded-lg border border-[rgba(168,177,214,0.16)] bg-[rgba(21,22,30,0.94)] text-[#c0caf5] shadow-2xl backdrop-blur-xl"
            role="menu"
            aria-label="Start menu"
          >
            <div className="border-b border-[rgba(168,177,214,0.12)] bg-[rgba(30,30,46,0.72)] px-4 py-3">
              <div className="text-sm font-semibold text-white">Prasanth P</div>
              <div className="text-xs text-[#a9b1d6]">Quick launch</div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              {startMenuItems.map((item) => (
                <button
                  key={item.id}
                  className="flex min-h-[78px] flex-col items-start rounded-md border border-transparent bg-[rgba(255,255,255,0.025)] p-3 text-left text-[#c0caf5] transition-colors hover:border-[rgba(122,162,247,0.28)] hover:bg-[rgba(122,162,247,0.1)]"
                  onClick={() => launchCommand(item.command)}
                  role="menuitem"
                >
                  <span className="mb-2 h-6 w-6 text-[#7aa2f7]">{iconMap[item.id]}</span>
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  <span className="mt-1 text-[11px] leading-4 text-[#a9b1d6]">{item.description}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-[rgba(168,177,214,0.12)] px-3 py-2">
              <button
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#c0caf5] hover:bg-[rgba(255,255,255,0.04)]"
                onClick={() => launchCommand('help')}
                role="menuitem"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded border border-[rgba(122,162,247,0.24)] text-xs text-[#7aa2f7]">?</span>
                <span>Terminal help</span>
              </button>
            </div>
          </div>
        )}
        {taskbarIcons.map((icon) => (
          <button
            key={icon.id}
            className={`taskbar-icon text-[#c0caf5] bg-transparent border-0 p-1 mx-0.5 rounded transition-colors cursor-pointer relative ${
              icon.id === 'terminal' && terminalActive ? 'active' : ''
            }`}
            data-command={icon.command || icon.id}
            title={icon.title}
            aria-expanded={icon.id === 'start' ? startOpen : undefined}
            onClick={() => {
              if (icon.id === 'start') {
                setStartOpen((value) => !value);
                return;
              }
              if (icon.command) {
                launchCommand(icon.command);
              }
            }}
            style={{
              ...(((icon.id === 'terminal' && terminalActive) || (icon.id === 'start' && startOpen)) && {
                background: 'rgba(122,162,247,0.12)',
                borderRadius: '10px',
                padding: '6px 8px',
                boxShadow: '0 12px 34px rgba(122,162,247,0.24), inset 0 1px 0 rgba(255,255,255,0.02)',
                transition: 'background 180ms ease, box-shadow 220ms ease, transform 180ms ease'
              })
            }}
          >
            <div className="w-6 h-6">
              {icon.svg}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center">
        <ToggleSiteSwitch />
        <div id="taskbar-clock" className="ml-3 text-[12px] font-medium text-[#c0caf5]">
          {formatTime()}
          <br />
          {formatDate()}
        </div>
      </div>
    </div>
  );
};

export default memo(Taskbar);
