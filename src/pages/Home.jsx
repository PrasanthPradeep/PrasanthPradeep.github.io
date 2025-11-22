import React, { useState, useCallback } from 'react';
import {
  ParticleBackground,
  DesktopIcons,
  Terminal,
  Taskbar,
  FullscreenToggle
} from '../components';

const Home = () => {
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [terminalState, setTerminalState] = useState('default'); // 'default', 'minimized', 'maximized'
  const [externalCommand, setExternalCommand] = useState(null);

  const handleCommandClick = useCallback((command) => {
    // For terminal command, toggle visibility with animation
    if (command === 'terminal') {
      if (terminalVisible) {
        // Minimize with animation
        setTerminalVisible(false);
      } else {
        // Opening terminal - always reset to default state with fly-back animation
        setTerminalState('default');
        setTerminalVisible(true);
      }
      return;
    }

    // Ensure terminal is visible when commands are executed
    if (!terminalVisible) {
      setTerminalState('default'); // Reset to default when opening
      setTerminalVisible(true);
    }
    
    // Send command to terminal with timestamp to ensure it triggers even for same command
    setExternalCommand(`${command}_${Date.now()}`);
    
    // Reset after a short delay to allow re-triggering
    setTimeout(() => setExternalCommand(null), 100);
  }, [terminalVisible]);

  const handleTerminalToggle = useCallback(() => {
    setTerminalVisible(prev => {
      if (!prev) {
        // Opening terminal - reset to default state
        setTerminalState('default');
      }
      return !prev;
    });
  }, []);

  return (
    <div className="text-[#a9b1d6] min-h-screen p-4 overflow-hidden">
      <ParticleBackground />
      {terminalState !== 'maximized' && (
        <DesktopIcons onCommandClick={handleCommandClick} />
      )}
      <Terminal 
        isVisible={terminalVisible}
        onToggle={handleTerminalToggle}
        terminalState={terminalState}
        setTerminalState={setTerminalState}
        externalCommand={externalCommand ? externalCommand.split('_')[0] : null}
      />
      {terminalState !== 'maximized' && (
        <>
          <Taskbar 
            onCommandClick={handleCommandClick}
            terminalActive={terminalVisible}
          />
          <FullscreenToggle />
        </>
      )}
    </div>
  );
};

export default Home;
