import React, { useState } from 'react';

export default function ToggleSiteSwitch() {
  const [checked, setChecked] = useState(false);

  const onToggle = (e) => {
    const next = e.target.checked;
    if (next) {
      window.open('https://projects.prasanthp.tech', '_blank', 'noopener,noreferrer');
      setChecked(false);
    }
  };

  return (
    <label className="ml-3 inline-flex items-center cursor-pointer select-none" title="Toggle to Projects">
      <span className="mr-2 text-[11px] text-[#7aa2f7]">Terminal</span>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onToggle}
        aria-label="Toggle projects site"
        role="switch"
        aria-checked={checked}
      />
      <span className="relative w-14 h-7 rounded-full bg-[rgba(36,40,59,0.75)] border border-[rgba(74,79,105,0.6)] transition-colors peer-checked:bg-[rgba(122,162,247,0.3)]">
        <span className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-[#7aa2f7] shadow transition-transform peer-checked:translate-x-7" />
      </span>
      <span className="ml-2 text-[11px] text-[#7aa2f7]">Projects</span>
    </label>
  );
}