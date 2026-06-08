import { profileData } from './profileData';

const HOME_PATH = `/home/${profileData.username}`;

export const slugify = (value) => (
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
);

const getProjectFileName = (project) => `${project.slug || slugify(project.name)}.md`;

// Virtual File System
export const createFileSystem = () => {
  const filesystem = {
    '/': { type: 'dir', children: ['home'] },
    '/home': { type: 'dir', children: [profileData.username] },
    [HOME_PATH]: { type: 'dir', children: ['about.txt', 'skills.txt', 'social.txt', 'projects'] },
    [`${HOME_PATH}/about.txt`]: { type: 'file', content: profileData.about },
    [`${HOME_PATH}/skills.txt`]: {
      type: 'file', 
      content: profileData.skills.map(s => `${s.category}:\n  - ${s.items.join('\n  - ')}`).join('\n\n') 
    },
    [`${HOME_PATH}/social.txt`]: {
      type: 'file',
      content: profileData.socialProfiles.map(profile => `${profile.label}: ${profile.url}`).join('\n')
    },
    [`${HOME_PATH}/projects`]: {
      type: 'dir', 
      children: profileData.projects.map(getProjectFileName)
    }
  };

  // Add project files
  profileData.projects.forEach(p => {
    const fileName = getProjectFileName(p);
    filesystem[`${HOME_PATH}/projects/${fileName}`] = {
      type: 'file',
      content: `# ${p.name}\n\n${p.description}\n\nLive: ${p.link}\nRepository: ${p.repo || 'Not available'}`
    };
  });

  return filesystem;
};

export { HOME_PATH };
