import React from 'react';
import BrowserWindow from './BrowserWindow';
import { githubProfile } from '../data/profileData';

const GITHUB_URL = githubProfile?.url || 'https://github.com/PrasanthPradeep';

const GithubWindow = ({ isVisible, onClose, onFocusWindow, zIndex }) => (
  <BrowserWindow
    aria-label="GitHub window"
    initialPosition={{ x: 184, y: 132 }}
    isVisible={isVisible}
    onClose={onClose}
    onFocusWindow={onFocusWindow}
    renderFrame={false}
    title="Prasanth GitHub"
    url={GITHUB_URL}
    zIndex={zIndex}
  >
    <div className="github-fallback flex min-h-full items-center justify-center p-6 text-[#c0caf5]">
      <div className="w-full max-w-lg rounded-lg border border-[rgba(168,177,214,0.16)] bg-[rgba(21,22,30,0.72)] p-6 text-center shadow-2xl">
        <img
          src="/images/github.svg"
          alt=""
          className="mx-auto mb-5 h-14 w-14"
          aria-hidden="true"
        />
        <h2 className="text-xl font-semibold text-white">GitHub blocks embedded previews</h2>
        <p className="mt-3 text-sm leading-6 text-[#a9b1d6]">
          GitHub does not allow its pages to load inside another site. Open the profile in a new tab to view repositories and activity.
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded border border-[rgba(122,162,247,0.45)] bg-[rgba(122,162,247,0.12)] px-4 py-2 text-sm font-medium text-[#c0caf5] hover:bg-[rgba(122,162,247,0.2)] hover:no-underline"
        >
          Open GitHub
        </a>
      </div>
    </div>
  </BrowserWindow>
);

export default GithubWindow;
