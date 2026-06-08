import React from 'react';
import BrowserWindow from './BrowserWindow';

const PROJECTS_URL = 'https://projects.prasanthp.me';

const ProjectsWindow = ({ isVisible, onClose, onFocusWindow, zIndex }) => {
  return (
    <BrowserWindow
      aria-label="Projects window"
      initialPosition={{ x: 120, y: 92 }}
      isVisible={isVisible}
      onClose={onClose}
      onFocusWindow={onFocusWindow}
      title="Prasanth projects"
      url={PROJECTS_URL}
      zIndex={zIndex}
    />
  );
};

export default ProjectsWindow;
