import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTerminal } from '../hooks/useTerminal';
import { profileData } from '../data/profileData';

const Terminal = ({ isVisible, onToggle, terminalState, setTerminalState, externalCommand }) => {
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const mirrorRef = useRef(null);
  const cursorRef = useRef(null);

  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isFirstDrag, setIsFirstDrag] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    commands,
    commandHistory,
    setCommandHistory,
    getDisplayPath,
    ls,
    cd,
    cat,
    aiChatMode,
    setAiChatMode,
    interviewMode,
    setInterviewMode,
    hireMode,
    setHireMode,
    hireData,
    setHireData
  } = useTerminal();

  // Welcome message
  useEffect(() => {
    addWelcomeMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle external commands from desktop icons
  useEffect(() => {
    if (externalCommand && isVisible) {
      processCommand(externalCommand);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCommand, isVisible]);

  const addWelcomeMessage = () => {
    setOutput([{
      type: 'welcome',
      content: `
        <div id="welcome-message" class="flex items-center space-x-4">
          <img src="/images/profile.jpg" alt="Profile Picture" class="rounded-full border-2 border-[#7aa2f7] w-24 h-24 flex-shrink-0" onerror="this.src='/images/profile.jpg'">
          <div class="flex flex-col justify-center">
            <p>Welcome to my Interactive Portfolio!</p>
            <p class="mt-2">Type \`help\` or click an icon to see available commands.</p>
          </div>
        </div>`
    }]);
  };

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal becomes visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  // Handle restore animation when terminal becomes visible
  useEffect(() => {
    if (isVisible && terminalRef.current && terminalState === 'default') {
      // Reset position state to force centering
      setIsFirstDrag(true);
      setPosition({ x: 0, y: 0 });
      
      // Find the terminal icon in taskbar for fly-back animation
      const taskbarIcon = document.querySelector('.taskbar-icon[data-command="terminal"]');
      
      if (taskbarIcon && !isAnimating) {
        
        // Start from the icon position with proper centering
        terminalRef.current.style.opacity = '0';
        terminalRef.current.style.transform = `translate(-50%, -50%) scale(0.1)`;
        
        // Animate to normal position
        requestAnimationFrame(() => {
          if (terminalRef.current) {
            terminalRef.current.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            terminalRef.current.style.opacity = '1';
            terminalRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
            
            // Clear transition after animation
            setTimeout(() => {
              if (terminalRef.current) {
                terminalRef.current.style.transition = '';
              }
            }, 300);
          }
        });
      }
    }
  }, [isVisible, terminalState, isAnimating]);

  // Update cursor position
  useEffect(() => {
    if (mirrorRef.current && cursorRef.current) {
      mirrorRef.current.textContent = inputValue;
      cursorRef.current.style.left = `${mirrorRef.current.offsetWidth}px`;
    }
  }, [inputValue]);

  const appendOutput = useCallback((content, type = 'output') => {
    setOutput(prev => [...prev, { type, content, timestamp: Date.now() }]);
  }, []);

  const processCommand = useCallback(async (command) => {
    if (!command.trim()) return;

    // Add command to history
    setCommandHistory(prev => [command, ...prev]);
    setHistoryIndex(-1);

    const [cmd, ...args] = command.trim().split(' ').filter(Boolean);
    const lowerCmd = cmd.toLowerCase();

    // Display the command
    appendOutput(`
      <div class="flex">
        <span class="text-[#7aa2f7]">user@host</span>
        <span class="text-gray-400 mx-1">:</span>
        <span class="text-purple-400">${getDisplayPath()}</span>
        <span class="text-gray-400 mr-2">$</span>
        <span>${command}</span>
      </div>
    `, 'command');

    // Handle special commands
    if (lowerCmd === 'clear') {
      setOutput([]);
      addWelcomeMessage();
      return;
    }

    if (lowerCmd === 'ls') {
      appendOutput(ls(args));
      return;
    }

    if (lowerCmd === 'cd') {
      const result = cd(args);
      if (result) appendOutput(result);
      return;
    }

    if (lowerCmd === 'cat') {
      appendOutput(cat(args));
      return;
    }

    if (lowerCmd === 'terminal' || lowerCmd === 'term') {
      if (onToggle) onToggle();
      return;
    }

    // Check if command exists in commands object
    if (commands[lowerCmd]) {
      const result = typeof commands[lowerCmd] === 'function' 
        ? commands[lowerCmd]() 
        : commands[lowerCmd];
      appendOutput(result);
      return;
    }

    // Handle sudo hire
    if (lowerCmd === 'sudo' && args[0] === 'hire') {
      setHireMode('name');
      appendOutput(`<div class="text-yellow-400">What is your full name?</div>`);
      return;
    }

    // Handle AI commands
    if (lowerCmd === 'ai') {
      if (args[0] === 'interview') {
        setInterviewMode(true);
        appendOutput(`<div class="text-yellow-400">Starting mock interview... Type 'exit' to end the session.</div>`);
        appendOutput(`<div class="text-yellow-400">Note: AI integration requires backend setup.</div>`);
      } else {
        setAiChatMode(true);
        appendOutput(`<div class="text-green-400">Starting AI chat session... Type 'exit' to end.</div>`);
        appendOutput(`<div class="text-green-400">Note: AI integration requires backend setup.</div>`);
      }
      return;
    }

    // Command not found
    appendOutput(`
      <div>
        <span class="text-red-500">Command not found:</span> ${command}. Type 'help' for a list of commands.
      </div>
    `);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands, ls, cd, cat, getDisplayPath, appendOutput, setCommandHistory, onToggle]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (aiChatMode && inputValue.toLowerCase().trim() === 'exit') {
        setAiChatMode(false);
        appendOutput(`<div class="text-green-400">AI chat session ended.</div>`);
        setInputValue('');
        return;
      }
      if (interviewMode && inputValue.toLowerCase().trim() === 'exit') {
        setInterviewMode(false);
        appendOutput(`<div class="text-yellow-400">Interview session ended.</div>`);
        setInputValue('');
        return;
      }
      if (hireMode) {
        handleHireResponse(inputValue);
        setInputValue('');
        return;
      }
      processCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const handleHireResponse = (response) => {
    if (hireMode === 'name') {
      setHireData({ name: response });
      setHireMode('organization');
      appendOutput(`<div class="text-yellow-400">What is your organization's name?</div>`);
    } else if (hireMode === 'organization') {
      const name = hireData.name;
      const org = response;
      appendOutput(`<div class="text-green-400">Thank you, ${name} from ${org}. I appreciate you taking the first step to hire me.</div>`);
      appendOutput(`<p>Initializing hiring sequence...</p><p>&gt;&gt; Congratulations, you just unlocked your best hire!</p>`);
      
      setTimeout(() => {
        const subject = encodeURIComponent("Hiring Inquiry from Your Interactive Portfolio");
        const body = encodeURIComponent(`Hello Prasanth,\n\nMy name is ${name} from ${org}.\n\nI came across your impressive interactive terminal portfolio and was very impressed with your skills and projects.\n\nI would like to discuss a potential opportunity with you. Please let me know your availability for a brief chat.\n\nBest regards,`);
        window.location.href = `mailto:${profileData.email}?subject=${subject}&body=${body}`;
        setHireMode(false);
        setHireData({});
      }, 2000);
    }
  };

  const clearOutput = () => {
    setOutput([]);
    addWelcomeMessage();
  };

  const clearInput = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Window control handlers
  const handleClose = (e) => {
    e.stopPropagation();
    // Reset to default state when closing
    setTerminalState('default');
    if (onToggle) onToggle();
  };

  const handleMinimize = async (e) => {
    e.stopPropagation();
    if (isAnimating) return;

    // Find the terminal icon in taskbar
    const taskbarIcon = document.querySelector('.taskbar-icon[data-command="terminal"]');
    if (!taskbarIcon || !terminalRef.current) {
      if (onToggle) onToggle(); // Fully hide
      return;
    }

    setIsAnimating(true);

    // Get positions
    const terminalRect = terminalRef.current.getBoundingClientRect();
    const iconRect = taskbarIcon.getBoundingClientRect();

    // Create clone for animation
    const clone = terminalRef.current.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.top = `${terminalRect.top}px`;
    clone.style.left = `${terminalRect.left}px`;
    clone.style.width = `${terminalRect.width}px`;
    clone.style.height = `${terminalRect.height}px`;
    clone.style.zIndex = '99999';
    clone.style.pointerEvents = 'none';
    clone.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.appendChild(clone);

    // Hide original immediately
    terminalRef.current.style.opacity = '0';

    // Calculate target position (center of taskbar icon)
    const targetX = iconRect.left + iconRect.width / 2 - terminalRect.width / 2;
    const targetY = iconRect.top + iconRect.height / 2 - terminalRect.height / 2;

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      clone.style.transform = `translate(${targetX - terminalRect.left}px, ${targetY - terminalRect.top}px) scale(0.1)`;
      clone.style.opacity = '0';
    });

    // Cleanup after animation and fully hide terminal
    setTimeout(() => {
      clone.remove();
      terminalRef.current.style.opacity = '1';
      setIsAnimating(false);
      // Fully hide the terminal instead of minimizing
      if (onToggle) onToggle();
    }, 300);
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    setTerminalState(terminalState === 'maximized' ? 'default' : 'maximized');
  };

  // Dragging logic
  const handleMouseDown = (e) => {
    if (terminalState === 'maximized' || terminalState === 'minimized') return;
    
    if (isFirstDrag && terminalRef.current) {
      const rect = terminalRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
      setIsFirstDrag(false);
    }
    
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging && terminalState !== 'maximized') {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  }, [isDragging, dragOffset, terminalState]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getContainerStyle = () => {
    if (terminalState === 'maximized') {
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        transform: 'none',
        zIndex: 9999,
        borderRadius: 0
      };

    } else if (!isFirstDrag) {
      return {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
        zIndex: 2
      };
    } else {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2
      };
    }
  };

  const getPromptPrefix = () => {
    if (aiChatMode) {
      return <span className="text-green-400 mr-2">[AI Chat] &gt;</span>;
    }
    if (interviewMode) {
      return <span className="text-yellow-400 mr-2">[Interview Mode] &gt;</span>;
    }
    if (hireMode) {
      return <span className="text-yellow-400 mr-2">[Hiring Mode] &gt;</span>;
    }
    return (
      <>
        <span className="text-[#7aa2f7]">user@host</span>
        <span className="text-gray-400 mx-1">:</span>
        <span className="text-purple-400">{getDisplayPath()}</span>
        <span className="text-gray-400 mr-2">$</span>
      </>
    );
  };

  if (!isVisible) return null;

  const hasOutput = output.filter(o => o.type !== 'welcome').length > 0;

  return (
    <div
      ref={terminalRef}
      id="terminal-container"
      className={`w-full ${terminalState === 'maximized' ? 'maximized' : 'max-w-4xl'}`}
      style={{
        ...getContainerStyle(),
        height: terminalState === 'maximized' ? '100%' : 'calc(80vh - 40px)'
      }}
    >
      <div 
        className={`w-full h-full shadow-2xl flex flex-col overflow-hidden ${terminalState === 'maximized' ? '' : 'rounded-lg'}`}
        style={{
          background: 'rgba(36, 40, 59, 0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(74, 79, 105, 0.4)'
        }}
      >
        {/* Terminal Header */}
        <div
          className="flex items-center p-2 border-b cursor-move"
          style={{
            background: 'rgba(30, 30, 46, 0.5)',
            borderColor: 'rgba(74, 79, 105, 0.4)'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex space-x-2">
            <div 
              className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" 
              title="Close"
              onClick={handleClose}
            />
            <div 
              className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" 
              title="Maximize/Restore"
              onClick={handleMaximize}
            />
            <div 
              className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" 
              title="Minimize to taskbar"
              onClick={handleMinimize}
            />
          </div>
          <div className="flex-grow text-center text-sm text-gray-400">
            prasanth@portfolio: ~
          </div>
          {hasOutput && (
            <button
              className="text-xs px-2 py-1 rounded bg-transparent border border-[rgba(168,177,214,0.12)] text-[#a9b1d6] hover:bg-[rgba(255,255,255,0.02)] hover:text-white"
              onClick={clearOutput}
              title="Clear terminal output"
            >
              Clear
            </button>
          )}
        </div>

        {/* Terminal Output */}
        <div
          ref={outputRef}
          className="flex-grow p-4 overflow-y-auto text-sm text-[#a9b1d6]"
          style={{
            display: 'block'
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {output.map((item, index) => (
            <div key={`${item.timestamp}-${index}`} dangerouslySetInnerHTML={{ __html: item.content }} />
          ))}
        </div>

        {/* Terminal Input */}
        <div
          className="p-2 border-t"
          style={{
            background: 'rgba(30, 30, 46, 0.5)',
            borderColor: 'rgba(74, 79, 105, 0.4)'
          }}
        >
          <div className="flex items-center">
            <span className="flex items-center">
              {getPromptPrefix()}
            </span>
            <div className="relative flex-grow">
              <span
                ref={mirrorRef}
                className="absolute top-0 left-0 invisible whitespace-pre"
                style={{ fontSize: '1em', padding: 0, margin: 0, border: 0, lineHeight: '1.2em' }}
              />
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent border-none outline-none text-[#a9b1d6]"
                style={{ 
                  fontSize: '1em', 
                  padding: 0, 
                  margin: 0, 
                  border: 0, 
                  lineHeight: '1.2em',
                  caretColor: 'transparent'
                }}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoFocus
              />
              <div
                ref={cursorRef}
                className="absolute top-0 left-0 inline-block w-2.5 h-5 bg-[#a9b1d6] animate-pulse"
                style={{ 
                  verticalAlign: 'bottom',
                  animation: 'pulse 1s step-end infinite'
                }}
              />
              {inputValue && (
                <button
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-transparent border-0 text-[#a9b1d6] cursor-pointer p-1 text-sm hover:text-white"
                  onClick={clearInput}
                  title="Clear input"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
