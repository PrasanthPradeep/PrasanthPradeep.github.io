import React, { useState, useCallback } from 'react';
import {
  ParticleBackground,
  DesktopIcons,
  GithubWindow,
  Terminal,
  ProjectsWindow,
  SocialsWindow,
  GameWindow,
  Taskbar,
  FullscreenToggle
} from '../components';

const createCommandEvent = (command) => ({
  command,
  id: `${command}-${Date.now()}-${Math.random().toString(36).slice(2)}`
});

const Home = () => {
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [terminalState, setTerminalState] = useState('default'); // 'default', 'minimized', 'maximized'
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [socialsVisible, setSocialsVisible] = useState(false);
  const [githubVisible, setGithubVisible] = useState(false);
  const [gameVisible, setGameVisible] = useState(false);
  const [externalCommand, setExternalCommand] = useState(null);
  const [windowLayers, setWindowLayers] = useState({
    terminal: 20,
    projects: 21,
    socials: 22,
    game: 23,
    github: 24
  });

  const bringWindowToFront = useCallback((windowId) => {
    setWindowLayers((layers) => {
      const nextLayer = Math.max(...Object.values(layers)) + 1;
      return {
        ...layers,
        [windowId]: nextLayer
      };
    });
  }, []);

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
        bringWindowToFront('terminal');
      }
      return;
    }

    if (command === 'socials') {
      setSocialsVisible(true);
      bringWindowToFront('socials');
      return;
    }

    if (command === 'projects') {
      setProjectsVisible(true);
      bringWindowToFront('projects');
      return;
    }

    if (command === 'github') {
      setGithubVisible(true);
      bringWindowToFront('github');
      return;
    }

    if (command === 'game') {
      setGameVisible(true);
      bringWindowToFront('game');
      return;
    }

    // Ensure terminal is visible when commands are executed
    if (!terminalVisible) {
      setTerminalState('default'); // Reset to default when opening
      setTerminalVisible(true);
    }
    bringWindowToFront('terminal');

    setExternalCommand(createCommandEvent(command));
  }, [bringWindowToFront, terminalVisible]);

  const handleTerminalToggle = useCallback(() => {
    setTerminalVisible(prev => {
      if (!prev) {
        // Opening terminal - reset to default state
        setTerminalState('default');
        bringWindowToFront('terminal');
      }
      return !prev;
    });
  }, [bringWindowToFront]);

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
        externalCommand={externalCommand}
        zIndex={terminalState === 'maximized' ? 9999 : windowLayers.terminal}
        onFocusWindow={() => bringWindowToFront('terminal')}
        onCommand={handleCommandClick}
      />
      {terminalState !== 'maximized' && (
        <GithubWindow
          isVisible={githubVisible}
          onClose={() => setGithubVisible(false)}
          onFocusWindow={() => bringWindowToFront('github')}
          zIndex={windowLayers.github}
        />
      )}
      {terminalState !== 'maximized' && (
        <ProjectsWindow
          isVisible={projectsVisible}
          onClose={() => setProjectsVisible(false)}
          onFocusWindow={() => bringWindowToFront('projects')}
          zIndex={windowLayers.projects}
        />
      )}
      {terminalState !== 'maximized' && (
        <GameWindow
          isVisible={gameVisible}
          onClose={() => setGameVisible(false)}
          onFocusWindow={() => bringWindowToFront('game')}
          zIndex={windowLayers.game}
        />
      )}
      {terminalState !== 'maximized' && (
        <SocialsWindow
          isVisible={socialsVisible}
          onClose={() => setSocialsVisible(false)}
          onFocusWindow={() => bringWindowToFront('socials')}
          zIndex={windowLayers.socials}
        />
      )}
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
