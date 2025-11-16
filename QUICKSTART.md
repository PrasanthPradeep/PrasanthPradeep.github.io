# Quick Start Guide - React Terminal Portfolio

Welcome! This guide will help you get started with your React-based terminal portfolio.

## ✅ What's Been Done

Your HTML/CSS/JavaScript portfolio has been converted to a modern React application with:

1. **Component-Based Architecture**
   - `ParticleBackground.jsx` - Animated particle background
   - `DesktopIcons.jsx` - Clickable desktop shortcuts
   - `Terminal.jsx` - Main terminal interface
   - `Taskbar.jsx` - Bottom taskbar with clock
   - `FullscreenToggle.jsx` - Fullscreen button

2. **Data Organization**
   - `profileData.js` - Your personal information
   - `filesystem.js` - Virtual file system structure

3. **Custom Hooks**
   - `useTerminal.js` - Terminal logic and command handling

## 🚀 Getting Started

### Step 1: Add Your Profile Picture
```bash
# Copy your profile picture to the public folder
cp /path/to/your/photo.jpg public/images/profile.jpg
```

### Step 2: Update Your Information
Open `src/data/profileData.js` and update:
- Your name, email, location
- GitHub, LinkedIn, Instagram handles
- Skills and technologies
- Projects with descriptions and links

### Step 3: Run the Development Server
```bash
npm start
```

This will open your portfolio at `http://localhost:3000`

### Step 4: Test It Out
Try these commands in the terminal:
- `help` - See all commands
- `about` - Your bio
- `skills` - Your skills
- `projects` - Your projects
- `social` - Social media links
- `neofetch` - System info
- `ls` - List files
- `cd projects` - Navigate to projects
- `cat about.txt` - Read a file
- `clear` - Clear screen

## 📝 Key Differences from HTML Version

### 1. State Management
**Before (HTML/JS):**
```javascript
let commandHistory = [];
let currentPath = '/home/prasanth';
```

**Now (React):**
```javascript
const [commandHistory, setCommandHistory] = useState([]);
const [currentPath, setCurrentPath] = useState('/home/prasanth');
```

### 2. Component Structure
**Before:** Everything in one HTML file

**Now:** Separated into logical components:
- Each component has its own file
- Props pass data between components
- Reusable and maintainable

### 3. Event Handling
**Before:**
```javascript
document.getElementById('button').addEventListener('click', handler);
```

**Now:**
```jsx
<button onClick={handler}>Click</button>
```

### 4. Rendering
**Before:**
```javascript
output.innerHTML += '<div>Content</div>';
```

**Now:**
```jsx
setOutput(prev => [...prev, { content: '<div>Content</div>' }]);
```

## 🎨 Customization Tips

### Change Colors
Edit `src/styles/globals.css`:
```css
body {
  background-color: #1a1b26; /* Change this */
}
```

### Add New Commands
Edit `src/hooks/useTerminal.js`:
```javascript
const commands = {
  mycommand: () => `<div>Hello from my command!</div>`,
  // ... other commands
};
```

### Modify Desktop Icons
Edit `src/components/DesktopIcons.jsx` to add/remove icons.

### Change Terminal Size
Edit `src/components/Terminal.jsx`:
```javascript
style={{
  height: 'calc(80vh - 40px)' // Adjust this
}}
```

## 🐛 Common Issues

### Issue: Profile image not showing
**Solution:** Make sure `public/images/profile.jpg` exists

### Issue: Terminal not responsive
**Solution:** Check browser console for errors (F12)

### Issue: Commands not working
**Solution:** 
1. Check `src/hooks/useTerminal.js` for command definitions
2. Ensure command name matches exactly (case-sensitive)

### Issue: Styling looks wrong
**Solution:** 
1. Verify Tailwind CDN is loading (check `public/index.html`)
2. Clear browser cache (Ctrl+Shift+R)

## 📚 Learning React Basics

### 1. Components
Components are reusable pieces of UI:
```jsx
function MyComponent() {
  return <div>Hello World</div>;
}
```

### 2. Props
Pass data to components:
```jsx
<Terminal isVisible={true} onClose={handleClose} />
```

### 3. State
Manage changing data:
```jsx
const [count, setCount] = useState(0);
setCount(count + 1); // Update state
```

### 4. Hooks
Special functions for React features:
- `useState` - Store data
- `useEffect` - Run side effects
- `useCallback` - Optimize functions
- `useRef` - Reference DOM elements

### 5. Event Handling
```jsx
<button onClick={() => console.log('Clicked!')}>
  Click Me
</button>
```

## 🚀 Next Steps

1. **Test Everything**
   - Try all terminal commands
   - Test on different browsers
   - Check mobile responsiveness

2. **Customize Content**
   - Update all personal information
   - Add your actual projects
   - Update social media links

3. **Add Your Touch**
   - Change colors to match your brand
   - Add new terminal commands
   - Customize animations

4. **Deploy**
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or GitHub Pages

## 🆘 Need Help?

If you get stuck:

1. **Check the README.md** - Full documentation
2. **Console Errors** - Press F12 to see errors
3. **React DevTools** - Install React DevTools browser extension
4. **Google the Error** - Most React errors are well-documented

## 📖 Recommended Reading

- [React Tutorial](https://react.dev/learn)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [React Hooks](https://react.dev/reference/react)
- [JavaScript ES6+](https://javascript.info/)

## ✨ Tips for Success

1. **Start Small** - Change one thing at a time
2. **Use Console.log** - Debug by logging values
3. **Read Error Messages** - They usually tell you what's wrong
4. **Experiment** - Try things, break things, learn!
5. **Ask Questions** - The React community is helpful

---

Good luck with your React portfolio! 🎉

Remember: Every expert was once a beginner. Take your time and enjoy learning!
