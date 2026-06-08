import React from 'react';
import BrowserWindow from './BrowserWindow';

const SOCIALS_URL = 'https://connect.prasanthp.me';

const SocialsWindow = ({ isVisible, onClose, onFocusWindow, zIndex }) => (
  <BrowserWindow
    aria-label="Socials window"
    initialPosition={{ x: 152, y: 112 }}
    isVisible={isVisible}
    onClose={onClose}
    onFocusWindow={onFocusWindow}
    title="Prasanth socials"
    url={SOCIALS_URL}
    zIndex={zIndex}
  />
);

export default SocialsWindow;
