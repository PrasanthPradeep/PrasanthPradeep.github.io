import React, { useState, useEffect, memo } from 'react';

const Taskbar = ({ onCommandClick, terminalActive }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      command: 'about'
    },
    {
      id: 'social',
      title: 'Social',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      ),
      command: 'social'
    },
    {
      id: 'projects',
      title: 'Projects',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
      command: 'projects'
    },
    {
      id: 'terminal',
      title: 'Terminal',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="4" width="19" height="16" rx="3" ry="3" />
          <path d="M7 9l4 3-4 3" />
          <path d="M13 15h4" />
        </svg>
      ),
      command: 'terminal'
    }
  ];

  return (
    <div 
      id="taskbar"
      className="fixed bottom-0 left-0 w-full h-10 z-50 flex items-center justify-between px-2.5"
      style={{
        background: 'rgba(36, 40, 59, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(74, 79, 105, 0.4)'
      }}
    >
      <div className="flex items-center">
        {taskbarIcons.map((icon) => (
          <button
            key={icon.id}
            className={`taskbar-icon text-[#c0caf5] bg-transparent border-0 p-1 mx-0.5 rounded transition-colors cursor-pointer relative ${
              icon.id === 'terminal' && terminalActive ? 'active' : ''
            }`}
            data-command={icon.command || icon.id}
            title={icon.title}
            onClick={() => icon.command && onCommandClick(icon.command)}
            style={{
              ...(icon.id === 'terminal' && terminalActive && {
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
      <div 
        id="taskbar-clock" 
        className="text-xs font-medium text-[#c0caf5] pr-2.5 text-right"
      >
        {formatTime()}
        <br />
        {formatDate()}
      </div>
    </div>
  );
};

export default memo(Taskbar);
