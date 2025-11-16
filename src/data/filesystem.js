import { profileData } from './profileData';

// Virtual File System
export const createFileSystem = () => {
  const filesystem = {
    '/': { type: 'dir', children: ['home'] },
    '/home': { type: 'dir', children: ['prasanth'] },
    '/home/prasanth': { type: 'dir', children: ['about.txt', 'skills.txt', 'social.txt', 'projects'] },
    '/home/prasanth/about.txt': { type: 'file', content: profileData.about },
    '/home/prasanth/skills.txt': { 
      type: 'file', 
      content: profileData.skills.map(s => `${s.category}:\n  - ${s.items.join('\n  - ')}`).join('\n\n') 
    },
    '/home/prasanth/social.txt': { 
      type: 'file', 
      content: `LinkedIn: https://linkedin.com/in/${profileData.linkedinUser}\nGitHub: https://github.com/${profileData.githubUser}\nInstagram: https://www.instagram.com/${profileData.instagramUser}` 
    },
    '/home/prasanth/projects': { 
      type: 'dir', 
      children: profileData.projects.map(p => `${p.name.toLowerCase().replace(/ /g, '-')}.md`) 
    }
  };

  // Add project files
  profileData.projects.forEach(p => {
    const fileName = `${p.name.toLowerCase().replace(/ /g, '-')}.md`;
    filesystem[`/home/prasanth/projects/${fileName}`] = {
      type: 'file',
      content: `# ${p.name}\n\n${p.description}\n\nLink: ${p.link}`
    };
  });

  return filesystem;
};
