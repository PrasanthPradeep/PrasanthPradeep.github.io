# Prasanth Pradeep - Interactive Terminal Portfolio

A modern, interactive terminal-style portfolio built with React. This project showcases your skills, projects, and experience through a unique command-line interface with a beautiful glassmorphic design.

## 🚀 Features

- **Interactive Terminal**: Full-featured terminal emulator with command history
- **Animated Background**: Particle system with interactive mouse effects
- **Desktop Icons**: Quick access to common commands
- **Taskbar**: Windows-style taskbar with clock and application shortcuts
- **Window Management**: Draggable, minimizable, and maximizable terminal window
- **File System**: Virtual file system with `ls`, `cd`, and `cat` commands
- **Fullscreen Mode**: Toggle fullscreen for immersive experience
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
my-react-project/
├── public/
│   ├── images/           # Add your profile.jpg here
│   └── index.html
├── src/
│   ├── components/       # React components
│   │   ├── ParticleBackground.jsx
│   │   ├── DesktopIcons.jsx
│   │   ├── Terminal.jsx
│   │   ├── Taskbar.jsx
│   │   ├── FullscreenToggle.jsx
│   │   └── index.js
│   ├── data/            # Configuration and data
│   │   ├── profileData.js
│   │   └── filesystem.js
│   ├── hooks/           # Custom React hooks
│   │   └── useTerminal.js
│   ├── pages/           # Page components
│   │   └── Home.jsx
│   ├── styles/          # Global styles
│   │   └── globals.css
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Your Profile Picture**
   - Place your profile image at: `public/images/profile.jpg`
   - Recommended size: 200x200px or larger (square format)

3. **Update Your Information**
   - Edit `src/data/profileData.js` to update:
     - Name, email, and social media handles
     - Skills and technologies
     - Projects and descriptions
     - Location and availability

4. **Start Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

5. **Build for Production**
   ```bash
   npm run build
   ```
   Production files will be in the `build/` folder

## 🎮 Available Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | Display all available commands |
| `about` | Show professional summary |
| `social` | Display social media links |
| `skills` | List technical skills |
| `projects` | Show recent projects |
| `neofetch` | Display system information |
| `ls [path]` | List directory contents |
| `cd [dir]` | Change directory |
| `cat [file]` | Display file content |
| `history` | Show command history |
| `clear` | Clear terminal screen |
| `sudo hire` | Hiring workflow (sends email) |

## 🎨 Customization

### Colors & Theme
The color scheme is based on the Tokyo Night theme. To customize:
- Edit color values in `src/styles/globals.css`
- Update background colors in component styles
- Modify Tailwind classes in JSX files

### Adding New Commands
1. Open `src/hooks/useTerminal.js`
2. Add your command to the `commands` object
3. Implement the command logic as a function or string

### File System
The virtual file system is defined in `src/data/filesystem.js`. You can:
- Add new directories and files
- Create custom file content
- Extend with new file types

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the build folder to Netlify
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
# Add to package.json:
# "homepage": "https://yourusername.github.io/repo-name"
# "predeploy": "npm run build"
# "deploy": "gh-pages -d build"
npm run deploy
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (with touch support)

## 📝 Learning Resources

If you're new to React, here are some helpful resources:

- [React Official Docs](https://react.dev)
- [React Hooks Guide](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

## ✨ Credits

Created by Prasanth Pradeep
- GitHub: [@PrasanthPradeep](https://github.com/PrasanthPradeep)
- LinkedIn: [prasanth1010000](https://linkedin.com/in/prasanth1010000)
