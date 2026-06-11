import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTerminal } from '../hooks/useTerminal';
import { profileData } from '../data/profileData';

const escapeTerminalHtml = (value) => (
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>")
);

const getAiErrorMessage = (error, context) => {
  if (error.message === 'Missing VITE_NVIDIA_API_KEY') {
    return `Error: ${context} could not start because VITE_NVIDIA_API_KEY is not available. Restart the Vite dev server after editing .env.`;
  }

  return `Error: ${context} request failed (${error.message}).`;
};

const getLocalAiResponse = (message) => {
  const query = message.toLowerCase();

  if (query.includes('skill') || query.includes('tech') || query.includes('stack')) {
    return `Prasanth works with ${profileData.skills.map(skill => `${skill.category}: ${skill.items.join(', ')}`).join('; ')}. His strongest focus areas are web development, AI, browser technologies, and developer tools.`;
  }

  if (query.includes('project') || query.includes('work') || query.includes('built')) {
    return `A few highlighted projects are ${profileData.projects.map(project => `${project.name}: ${project.description}`).join(' | ')}.`;
  }

  if (query.includes('contact') || query.includes('email') || query.includes('hire')) {
    return `You can contact Prasanth at ${profileData.email}. He is currently ${profileData.status.toLowerCase()}.`;
  }

  if (query.includes('social') || query.includes('linkedin') || query.includes('github')) {
    return `Prasanth's profiles: ${profileData.socialProfiles.map(profile => `${profile.label}: ${profile.url}`).join(' | ')}.`;
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return `Hello! I can help you learn about Prasanth's skills, projects, experience, or contact details.`;
  }

  return `${profileData.about}\n\nAsk about skills, projects, socials, or contact details for a more specific answer.`;
};

const Terminal = ({ isVisible, onToggle, terminalState, setTerminalState, externalCommand, zIndex = 2, onFocusWindow, onCommand }) => {
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
    setHireData,
    aiChatHistory,
    setAiChatHistory,
    interviewHistory,
    setInterviewHistory
  } = useTerminal();

  // Welcome message
  useEffect(() => {
    addWelcomeMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle external commands from desktop icons
  useEffect(() => {
    if (externalCommand?.command && isVisible) {
      processCommand(externalCommand.command);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCommand?.id, isVisible]);

  const addWelcomeMessage = () => {
    setOutput([{
      type: 'welcome',
      content: `
        <div id="welcome-message" class="flex items-center space-x-4">
          <img src="/images/profile.jpg" alt="Profile Picture" class="rounded-full border-2 border-[#7aa2f7] w-24 h-24 flex-shrink-0" onerror="this.src='/images/profile.jpg'">
          <div class="flex flex-col justify-center">
            <p>Welcome to my Interactive Portfolio!</p>
            <p class="mt-2">Type or click <span id="welcome-help" class="text-cyan-400 hover:underline cursor-pointer"><code>help</code></span> to see available commands.</p>
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
    if (isVisible) {
      requestAnimationFrame(() => inputRef.current?.focus());
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

  const callNvidiaAPI = async (messages) => {
    const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;
    if (!apiKey) {
      throw new Error('Missing VITE_NVIDIA_API_KEY');
    }

    const endpoint = import.meta.env.DEV
      ? "/api/nvidia/v1/chat/completions"
      : "https://integrate.api.nvidia.com/v1/chat/completions";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: messages,
        max_tokens: 1024,
        temperature: 1.00,
        top_p: 0.95,
        stream: false,
        chat_template_kwargs: { enable_thinking: true }
      })
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  };

  const handleAiChat = async (message) => {
    if (!message.trim()) return;
    appendOutput(`
      <div class="flex">
        <span class="text-green-400 mr-2">[AI Chat] &gt;</span>
        <span>${message}</span>
      </div>
    `, 'command');

    const loadingId = Date.now();
    setOutput(prev => [...prev, { type: 'ai-thinking', content: '<div class="text-gray-500 animate-pulse">AI is thinking...</div>', id: loadingId }]);

    try {
      const systemPrompt = {
        role: "system",
        content: `You are the AI Assistant on Prasanth Pradeep's developer portfolio website. 
                  Here is Prasanth's information:
                  Name: Prasanth P
                  Role: CSE Student | Web & AI Enthusiast
                  Email: programmerprasanth@proton.me
                  About: ${profileData.about || 'A web and AI enthusiast building interactive developer tools and experiences.'}
                  Skills: ${profileData.skills ? profileData.skills.map(s => `${s.category}: ${s.items.join(', ')}`).join('; ') : ''}
                  Projects: ${profileData.projects ? profileData.projects.map(p => `${p.name} (${p.description})`).join('; ') : ''}

                  Be professional, engaging, and extremely concise. Answer the visitor's question using the information above. Do not hallucinate.`
      };

      const newHistory = [...aiChatHistory, { role: "user", content: message }];
      const responseContent = await callNvidiaAPI([systemPrompt, ...newHistory]);

      setOutput(prev => prev.filter(item => item.id !== loadingId));

      appendOutput(`<div class="text-cyan-300">${escapeTerminalHtml(responseContent)}</div>`);
      setAiChatHistory([...newHistory, { role: "assistant", content: responseContent }]);
    } catch (error) {
      console.error(error);
      setOutput(prev => prev.filter(item => item.id !== loadingId));

      const fallbackResponse = getLocalAiResponse(message);
      appendOutput(`<div class="text-cyan-300">${escapeTerminalHtml(fallbackResponse)}</div>`);
      setAiChatHistory(prev => [...prev, { role: "user", content: message }, { role: "assistant", content: fallbackResponse }]);
    }
  };

  const handleInterviewChat = async (message) => {
    if (!message.trim()) return;
    appendOutput(`
      <div class="flex">
        <span class="text-yellow-400 mr-2">[Interview Mode] &gt;</span>
        <span>${message}</span>
      </div>
    `, 'command');

    const loadingId = Date.now();
    setOutput(prev => [...prev, { type: 'ai-thinking', content: '<div class="text-gray-500 animate-pulse">Interviewer is thinking...</div>', id: loadingId }]);

    try {
      const systemPrompt = {
        role: "system",
        content: `You are a technical interviewer conducting a mock interview with a visitor on Prasanth Pradeep's portfolio site.
                  Ask them questions about web development, Javascript, React, system design, or data structures.
                  Be encouraging but realistic. Keep your responses and questions concise (maximum 3-4 sentences).`
      };

      const newHistory = [...interviewHistory, { role: "user", content: message }];
      const responseContent = await callNvidiaAPI([systemPrompt, ...newHistory]);

      setOutput(prev => prev.filter(item => item.id !== loadingId));

      appendOutput(`<div class="text-yellow-300">${escapeTerminalHtml(responseContent)}</div>`);
      setInterviewHistory([...newHistory, { role: "assistant", content: responseContent }]);
    } catch (error) {
      console.error(error);
      setOutput(prev => prev.filter(item => item.id !== loadingId));
      appendOutput(`<div class="text-red-400">${escapeTerminalHtml(getAiErrorMessage(error, 'Interviewer'))}</div>`);
    }
  };

  const triggerInitialInterviewQuestion = async () => {
    const loadingId = Date.now();
    setOutput(prev => [...prev, { type: 'ai-thinking', content: '<div class="text-gray-500 animate-pulse">Interviewer is thinking...</div>', id: loadingId }]);
    try {
      const systemPrompt = {
        role: "system",
        content: `You are a technical interviewer conducting a mock interview with a visitor on Prasanth Pradeep's portfolio site.
Start by welcoming the candidate and asking them what role they are interviewing for (e.g. Frontend Developer, Fullstack Engineer), or ask them a warm-up coding/technical question.`
      };
      const responseContent = await callNvidiaAPI([systemPrompt]);
      setOutput(prev => prev.filter(item => item.id !== loadingId));
      appendOutput(`<div class="text-yellow-300">${escapeTerminalHtml(responseContent)}</div>`);
      setInterviewHistory([{ role: "assistant", content: responseContent }]);
    } catch (error) {
      console.error(error);
      setOutput(prev => prev.filter(item => item.id !== loadingId));
      setInterviewMode(false);
      appendOutput(`<div class="text-red-400">${escapeTerminalHtml(getAiErrorMessage(error, 'Interview'))}</div>`);
    }
  };

  const processCommand = useCallback(async (command) => {
    if (!command.trim()) return;

    // Add command to history
    setCommandHistory(prev => [command, ...prev].slice(0, 50));
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

    // Do not open in-app windows from terminal commands; commands return output only

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
        triggerInitialInterviewQuestion();
      } else {
        setAiChatMode(true);
        appendOutput(`<div class="text-green-400">Starting AI chat session... Type 'exit' to end.</div>`);
        appendOutput(`<div class="text-cyan-400">Ask me anything about Prasanth's skills, projects, or experience!</div>`);
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

  // Make the welcome 'help' link clickable: run `help` when clicked
  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      if (!target) return;
      if (target.id === 'welcome-help' || (target.closest && target.closest('#welcome-help'))) {
        e.preventDefault();
        processCommand('help');
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [processCommand]);

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
      if (aiChatMode) {
        handleAiChat(inputValue);
        setInputValue('');
        return;
      }
      if (interviewMode) {
        handleInterviewChat(inputValue);
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
      setHireData(prev => ({ ...prev, organization: response }));
      setHireMode('email');
      appendOutput(`<div class="text-yellow-400">What is your email address?</div>`);
    } else if (hireMode === 'email') {
      const email = response.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        appendOutput(`<div class="text-red-400">Please enter a valid email address.</div>`);
        return;
      }

      const name = hireData.name;
      const org = hireData.organization;
      appendOutput(`<div class="text-green-400">Thank you, ${name} from ${org}. I appreciate you taking the first step to hire me.</div>`);
      appendOutput(`<p>Initializing hiring sequence...</p><p>&gt;&gt; Congratulations, you just unlocked your best hire!</p>`);

      setTimeout(() => {
        const subject = encodeURIComponent("Hiring Inquiry from Your Interactive Portfolio");
        const body = encodeURIComponent(`Hello Prasanth,\n\nMy name is ${name} from ${org}.\n\nYou can reach me at ${email}.\n\nI came across your impressive interactive terminal portfolio and was very impressed with your skills and projects.\n\nI would like to discuss a potential opportunity with you. Please let me know your availability for a brief chat.\n\nBest regards,`);
        window.open(`mailto:${profileData.email}?subject=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
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
        zIndex,
        borderRadius: 0
      };

    } else if (!isFirstDrag) {
      return {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
        zIndex
      };
    } else {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex
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
      className={`terminal-container w-full ${terminalState === 'maximized' ? 'maximized' : 'max-w-4xl'}`}
      onMouseDown={onFocusWindow}
      style={{
        ...getContainerStyle(),
        height: terminalState === 'maximized' ? '100%' : 'calc(80vh - 40px)'
      }}
    >
      <div
        className={`w-full h-full shadow-2xl flex flex-col overflow-hidden ${terminalState === 'maximized' ? '' : 'rounded-lg'}`}
        style={{
          background: 'rgba(21, 22, 30, 0.2)',
          backdropFilter: 'blur(7px)',
          WebkitBackdropFilter: 'blur(7px)',
          border: '1px solid rgba(74, 79, 105, 0.4)'
        }}
      >
        {/* Terminal Header */}
        <div
          className="terminal-header flex items-center p-2 border-b cursor-move"
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
          <div className="min-w-0 flex-grow truncate px-2 text-center text-sm text-gray-400">
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
          className="terminal-output flex-grow overflow-y-auto p-4 text-base leading-relaxed text-[#a9b1d6]"
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
          className="terminal-input border-t p-2"
          style={{
            background: 'rgba(30, 30, 46, 0.5)',
            borderColor: 'rgba(74, 79, 105, 0.4)'
          }}
        >
          <div className="terminal-input-row flex items-center">
            <span className="terminal-prompt flex items-center whitespace-nowrap">
              {getPromptPrefix()}
            </span>
            <div className="relative flex-grow">
              <span
                ref={mirrorRef}
                className="absolute top-0 left-0 invisible whitespace-pre"
                style={{ fontSize: '1.05rem', padding: 0, margin: 0, border: 0, lineHeight: '1.4em' }}
              />
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent border-none outline-none text-[#a9b1d6]"
                style={{
                  fontSize: '1.05rem',
                  padding: 0,
                  margin: 0,
                  border: 0,
                  lineHeight: '1.4em',
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
                className="absolute top-0 left-0 inline-block w-3 h-6 bg-[#a9b1d6] animate-pulse"
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
