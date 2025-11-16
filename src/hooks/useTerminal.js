import { useState, useCallback } from 'react';
import { profileData, quotes } from '../data/profileData';
import { createFileSystem } from '../data/filesystem';

export const useTerminal = () => {
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentPath, setCurrentPath] = useState('/home/prasanth');
  const [filesystem] = useState(createFileSystem());
  const [aiChatMode, setAiChatMode] = useState(false);
  const [interviewMode, setInterviewMode] = useState(false);
  const [hireMode, setHireMode] = useState(false);
  const [hireData, setHireData] = useState({});
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [interviewHistory, setInterviewHistory] = useState([]);

  // Helper functions
  const resolvePath = useCallback((path) => {
    if (path.startsWith('/')) return path;
    const parts = currentPath.split('/').filter(p => p);
    const pathParts = path.split('/').filter(p => p);
    
    for (const part of pathParts) {
      if (part === '..') {
        if (parts.length > 0) parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    }
    
    return '/' + parts.join('/');
  }, [currentPath]);

  const getDisplayPath = useCallback(() => {
    return currentPath.startsWith('/home/prasanth') 
      ? '~' + currentPath.substring('/home/prasanth'.length) 
      : currentPath;
  }, [currentPath]);

  // Command implementations
  const commands = {
    help: `
      <span class="text-green-400">Available Commands:</span>
      <ul class="list-inside list-disc ml-4">
        <li><span class="text-blue-400">about</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Displays my professional summary.</li>
        <li><span class="text-blue-400">social</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Shows my social media links.</li>
        <li><span class="text-blue-400">skills</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Lists my technical skills.</li>
        <li><span class="text-blue-400">projects</span> &nbsp;&nbsp;&nbsp;&nbsp;- Shows my recent projects.</li>
        <li><span class="text-blue-400">neofetch</span> &nbsp;&nbsp;&nbsp;&nbsp;- ✨ Display system information.</li>
        <li><span class="text-blue-400">ls [path]</span> &nbsp;&nbsp;&nbsp;- List directory contents.</li>
        <li><span class="text-blue-400">cd [dir]</span> &nbsp;&nbsp;&nbsp;&nbsp;- Change directory.</li>
        <li><span class="text-blue-400">cat [file]</span> &nbsp;&nbsp;&nbsp;- Display file content.</li>
        <li><span class="text-blue-400">ai</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ✨ Start an interactive chat session with the AI.</li>
        <li><span class="text-blue-400">ai interview</span> - ✨ Start a mock interview with the AI.</li>
        <li><span class="text-blue-400">sudo hire</span> &nbsp;&nbsp;&nbsp;- ✨ Hire me!</li>
        <li><span class="text-blue-400">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clears the terminal screen.</li>
        <li><span class="text-blue-400">history</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Shows command history.</li>
      </ul>`,
    
    social: () => `
      <span class="text-green-400">Connect with Me:</span>
      <ul class="list-inside mt-2">
        <li><span class="text-yellow-400">LinkedIn:</span> <a href="https://www.linkedin.com/in/${profileData.linkedinUser}" target="_blank" class="text-cyan-400 hover:underline">linkedin.com/in/${profileData.linkedinUser}</a></li>
        <li><span class="text-yellow-400">GitHub:</span> <a href="https://github.com/${profileData.githubUser}" target="_blank" class="text-cyan-400 hover:underline">github.com/${profileData.githubUser}</a></li>
        <li><span class="text-yellow-400">Instagram:</span> <a href="https://www.instagram.com/${profileData.instagramUser}" target="_blank" class="text-cyan-400 hover:underline">instagram.com/${profileData.instagramUser}</a></li>
      </ul>`,
    
    about: () => `
      <div class="flex items-center space-x-4">
        <img src="./images/profile.jpg" alt="Profile Picture" class="rounded-full border-2 border-[#7aa2f7] w-24 h-24 flex-shrink-0" onerror="this.src='./images/profile.jpg'">
        <div class="flex flex-col justify-center">
          <span class="text-green-400">About Me:</span>
          <p class="mt-1">${profileData.about}</p>
        </div>
      </div>`,
    
    skills: () => `
      <span class="text-green-400">Technical Skills:</span>
      <ul class="list-inside mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
        ${profileData.skills.map(sc => 
          `<li><span class="text-yellow-400">${sc.category}:</span> ${sc.items.join(', ')}</li>`
        ).join('')}
      </ul>`,
    
    projects: () => `
      <span class="text-green-400">Projects:</span>
      <div class="mt-2 space-y-2">
        ${profileData.projects.map(p => `
          <div>
            <h3 class="text-purple-400">${p.name}</h3>
            <p class="text-sm">${p.description}</p>
            <a href="${p.link}" target="_blank" class="text-cyan-400 hover:underline">${p.link.replace('https://', '')}</a>
          </div>
        `).join('')}
      </div>`,
    
    history: () => commandHistory.map((cmd, index) => `${index + 1}: ${cmd}`).join('<br>'),
    
    neofetch: () => {
      const asciiArt = `<pre class="text-cyan-400">
  ██████╗  ██████╗ 
  ██╔══██╗ ██╔══██╗
  ██████╔╝ ██████╔╝
  ██╔═══╝  ██╔═══╝ 
  ██║      ██║     
  ╚═╝      ╚═╝     
</pre>`;
      const randomMotto = quotes[Math.floor(Math.random() * quotes.length)];
      return `
        <div class="flex space-x-4">
          ${asciiArt}
          <div>
            <p><span class="text-cyan-400">Name</span>: ${profileData.name}</p>
            <p><span class="text-cyan-400">Role</span>: ${profileData.role}</p>
            <p><span class="text-cyan-400">GitHub</span>: github.com/${profileData.githubUser}</p>
            <p><span class="text-cyan-400">Contact</span>: ${profileData.email}</p>
            <p><span class="text-cyan-400">Location</span>: ${profileData.location}</p>
            <p><span class="text-cyan-400">Status</span>: ${profileData.status}</p>
            <p class="text-yellow-300 italic">"${randomMotto.quote}" – ${randomMotto.author}</p>
          </div>
        </div>`;
    }
  };

  // File system commands
  const ls = useCallback((args) => {
    const path = args[0] ? resolvePath(args[0]) : currentPath;
    const node = filesystem[path];
    
    if (node && node.type === 'dir') {
      const content = node.children.map(child => {
        const childPath = `${path === '/' ? '' : path}/${child}`;
        return filesystem[childPath]?.type === 'dir' 
          ? `<span class="text-blue-400">${child}/</span>` 
          : child;
      }).join('  ');
      return content;
    } else {
      return `<span class="text-red-500">ls: cannot access '${args[0] || '.'}': No such file or directory</span>`;
    }
  }, [currentPath, filesystem, resolvePath]);

  const cd = useCallback((args) => {
    const targetPath = args[0] || '/home/prasanth';
    const newPath = resolvePath(targetPath);
    
    if (filesystem[newPath] && filesystem[newPath].type === 'dir') {
      setCurrentPath(newPath);
      return '';
    } else {
      return `<span class="text-red-500">cd: no such file or directory: ${targetPath}</span>`;
    }
  }, [filesystem, resolvePath]);

  const cat = useCallback((args) => {
    const targetPath = args[0];
    if (!targetPath) {
      return `<span class="text-red-500">cat: missing operand</span>`;
    }
    
    const path = resolvePath(targetPath);
    const node = filesystem[path];
    
    if (node && node.type === 'file') {
      return `<pre class="whitespace-pre-wrap">${node.content}</pre>`;
    } else if (node && node.type === 'dir') {
      return `<span class="text-red-500">cat: ${targetPath}: Is a directory</span>`;
    } else {
      return `<span class="text-red-500">cat: ${targetPath}: No such file or directory</span>`;
    }
  }, [filesystem, resolvePath]);

  return {
    commands,
    commandHistory,
    setCommandHistory,
    currentPath,
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
  };
};
