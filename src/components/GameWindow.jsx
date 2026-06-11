import React from 'react';
import BrowserWindow from './BrowserWindow';

const GAME_URL = 'https://retrosnake.prasanthp.tech';

const GameWindow = ({ isVisible, onClose, onFocusWindow, zIndex }) => {
  return (
    <BrowserWindow
      aria-label="RetroSnake game"
      initialPosition={{ x: 200, y: 120 }}
      isVisible={isVisible}
      onClose={onClose}
      onFocusWindow={onFocusWindow}
      title="RetroSnake"
      url={GAME_URL}
      zIndex={zIndex}
    />
  );
};

export default GameWindow;
