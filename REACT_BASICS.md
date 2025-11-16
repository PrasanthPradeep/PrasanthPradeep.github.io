# React Beginner's Guide for This Project

## Introduction

This guide explains React concepts specifically as they appear in your portfolio project. Perfect for complete beginners!

## Core Concept 1: Components

### What is a Component?
A component is a reusable piece of UI. Think of it like a LEGO block - you can use it multiple times.

### Example from Your Project

**DesktopIcons.jsx:**
```jsx
const DesktopIcons = ({ onCommandClick }) => {
  return (
    <div className="desktop-icons">
      {/* Icon components go here */}
    </div>
  );
};
```

**What this does:**
- Creates a component called `DesktopIcons`
- It's a function that returns HTML-like code (JSX)
- Can be reused anywhere: `<DesktopIcons />`

### Try It Yourself
1. Open `src/components/DesktopIcons.jsx`
2. Find the `return` statement
3. See how it's used in `src/pages/Home.jsx`

---

## Core Concept 2: Props

### What are Props?
Props (properties) are how you pass data to components. Like function parameters.

### Example from Your Project

**In Home.jsx (Parent):**
```jsx
<Terminal 
  isVisible={terminalVisible}
  onToggle={handleTerminalToggle}
/>
```

**In Terminal.jsx (Child):**
```jsx
const Terminal = ({ isVisible, onToggle }) => {
  // Use isVisible and onToggle here
};
```

**What this does:**
- Home.jsx passes `terminalVisible` as `isVisible` prop
- Terminal.jsx receives and uses it
- Data flows from parent to child

### Try It Yourself
1. Open `src/pages/Home.jsx`
2. Find where `<Terminal />` is used
3. See what props are passed
4. Open `src/components/Terminal.jsx`
5. See how those props are received and used

---

## Core Concept 3: State (useState)

### What is State?
State is data that can change. When state changes, React re-renders the component.

### Example from Your Project

**In Terminal.jsx:**
```jsx
const [inputValue, setInputValue] = useState('');

// Later...
setInputValue('new text'); // Updates the input
```

**What this does:**
- `inputValue` stores the current input text
- `setInputValue` is a function to update it
- When you type, `setInputValue` is called
- React re-renders to show the new text

### The Rules
1. ❌ **Never do:** `inputValue = 'new text'`
2. ✅ **Always do:** `setInputValue('new text')`
3. State updates trigger re-renders

### Try It Yourself
1. Open `src/components/Terminal.jsx`
2. Find `const [inputValue, setInputValue] = useState('')`
3. Find where `setInputValue` is called
4. Find where `inputValue` is used

---

## Core Concept 4: Event Handling

### What are Events?
Events are things users do: click, type, scroll, etc.

### Example from Your Project

**In Terminal.jsx:**
```jsx
<input
  value={inputValue}
  onChange={handleInputChange}
  onKeyDown={handleKeyDown}
/>
```

**The handlers:**
```jsx
const handleInputChange = (e) => {
  setInputValue(e.target.value);
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    // Process command
  }
};
```

**What this does:**
- When you type, `onChange` fires
- `handleInputChange` updates the state
- When you press Enter, `onKeyDown` fires
- `handleKeyDown` processes the command

### Try It Yourself
1. Open `src/components/Terminal.jsx`
2. Find the `<input>` element
3. Find `handleInputChange` function
4. Add a `console.log` to see events
5. Type in the terminal and check console

---

## Core Concept 5: useEffect

### What is useEffect?
Runs code when component loads or when something changes. Used for side effects.

### Example from Your Project

**In ParticleBackground.jsx:**
```jsx
useEffect(() => {
  // Setup code: Create particles, start animation
  init();
  animate();
  
  // Cleanup code: Stop animation when component unmounts
  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}, []); // Empty array = run once when component loads
```

**What this does:**
- When component loads, creates the particle animation
- When component unloads, cleans up (stops animation)
- Prevents memory leaks

### Common Patterns
```jsx
useEffect(() => {
  // Runs once when component mounts
}, []);

useEffect(() => {
  // Runs when 'count' changes
}, [count]);

useEffect(() => {
  // Runs on every render
});
```

### Try It Yourself
1. Open `src/components/ParticleBackground.jsx`
2. Find the `useEffect` hook
3. See the initialization code
4. See the cleanup function (the `return`)

---

## Core Concept 6: useCallback

### What is useCallback?
Remembers a function so it doesn't get recreated on every render. Optimization technique.

### Example from Your Project

**In Home.jsx:**
```jsx
const handleCommandClick = useCallback((command) => {
  // Handle command
}, [terminalVisible, terminalState]);
```

**Without useCallback:**
```jsx
// Function recreated on every render (inefficient)
const handleCommandClick = (command) => {
  // Handle command
};
```

**What this does:**
- Keeps the same function unless dependencies change
- Prevents unnecessary re-renders of child components
- Better performance

### When to Use
- Passing functions to child components
- Functions used in useEffect dependencies
- Performance optimization

### Try It Yourself
1. Open `src/pages/Home.jsx`
2. Find `useCallback` usage
3. See the dependencies array
4. Try removing `useCallback` (won't break, just less optimal)

---

## Core Concept 7: useRef

### What is useRef?
Creates a reference to a DOM element or stores a value that persists between renders but doesn't cause re-renders.

### Example from Your Project

**In Terminal.jsx:**
```jsx
const inputRef = useRef(null);

// Later...
<input ref={inputRef} />

// Use it to focus:
inputRef.current.focus();
```

**What this does:**
- `inputRef` holds a reference to the input element
- Can call methods like `focus()` directly
- Doesn't cause re-renders when changed

### useRef vs useState
| Feature | useState | useRef |
|---------|----------|--------|
| Causes re-render | ✅ Yes | ❌ No |
| Persists between renders | ✅ Yes | ✅ Yes |
| For UI data | ✅ Yes | ❌ No |
| For DOM access | ❌ No | ✅ Yes |

### Try It Yourself
1. Open `src/components/Terminal.jsx`
2. Find `const inputRef = useRef(null)`
3. Find `ref={inputRef}` on an element
4. Find where `inputRef.current` is used

---

## Core Concept 8: Custom Hooks

### What is a Custom Hook?
A function that uses React hooks to share logic between components.

### Example from Your Project

**useTerminal.js:**
```jsx
export const useTerminal = () => {
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentPath, setCurrentPath] = useState('/home/prasanth');
  
  const ls = (args) => {
    // List files logic
  };
  
  return {
    commandHistory,
    setCommandHistory,
    currentPath,
    ls,
    // ... other stuff
  };
};
```

**Using it in Terminal.jsx:**
```jsx
const {
  commandHistory,
  ls,
  cd,
  cat
} = useTerminal();
```

**What this does:**
- Packages related logic together
- Can be reused in multiple components
- Keeps components cleaner

### Try It Yourself
1. Open `src/hooks/useTerminal.js`
2. See what it returns
3. Open `src/components/Terminal.jsx`
4. See how it's imported and used

---

## Practical Exercise: Add a New Command

Let's add a `whoami` command that shows your name!

### Step 1: Open useTerminal.js
```jsx
const commands = {
  help: `...`,
  social: () => `...`,
  // Add your new command here:
  whoami: () => `<div class="text-green-400">${profileData.name}</div>`,
};
```

### Step 2: Test It
1. Save the file
2. Refresh your browser (or it auto-refreshes)
3. Type `whoami` in the terminal
4. Your name should appear!

### Step 3: Make It Fancier
```jsx
whoami: () => `
  <div class="text-green-400">
    <p>👤 ${profileData.name}</p>
    <p>📧 ${profileData.email}</p>
    <p>📍 ${profileData.location}</p>
  </div>
`,
```

---

## Common Beginner Mistakes

### Mistake 1: Modifying State Directly
```jsx
❌ WRONG:
inputValue = 'new text';

✅ CORRECT:
setInputValue('new text');
```

### Mistake 2: Forgetting Dependencies
```jsx
❌ WRONG:
useEffect(() => {
  console.log(count);
}, []); // count not in dependencies!

✅ CORRECT:
useEffect(() => {
  console.log(count);
}, [count]);
```

### Mistake 3: Not Using Keys in Lists
```jsx
❌ WRONG:
{icons.map(icon => <Icon {...icon} />)}

✅ CORRECT:
{icons.map(icon => <Icon key={icon.id} {...icon} />)}
```

### Mistake 4: Calling State Setter in Render
```jsx
❌ WRONG:
const Component = () => {
  setCount(count + 1); // Infinite loop!
  return <div>{count}</div>;
};

✅ CORRECT:
const Component = () => {
  useEffect(() => {
    setCount(count + 1);
  }, []);
  return <div>{count}</div>;
};
```

---

## Debugging Tips

### 1. Use console.log
```jsx
const handleClick = () => {
  console.log('Clicked!', inputValue);
  processCommand(inputValue);
};
```

### 2. Check the Browser Console
- Press F12
- Look for errors (red text)
- Read the error message carefully

### 3. React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- See component tree

### 4. Add Comments
```jsx
// TODO: Fix this later
// This updates the terminal input
const handleInputChange = (e) => {
  setInputValue(e.target.value);
};
```

---

## What to Learn Next

### Week 1: Basics
- ✅ Components and JSX
- ✅ Props
- ✅ useState
- ✅ Event handling

### Week 2: Intermediate
- 📚 useEffect
- 📚 Conditional rendering
- 📚 Lists and keys
- 📚 Forms

### Week 3: Advanced
- 🔮 useCallback and useMemo
- 🔮 useRef
- 🔮 Custom hooks
- 🔮 Context API

---

## Quick Reference

### Import/Export
```jsx
// Export
export default Component;
export { helper };

// Import
import Component from './Component';
import { helper } from './utils';
```

### JSX Rules
```jsx
// Must return one root element
return (
  <div>
    <h1>Title</h1>
    <p>Text</p>
  </div>
);

// Use className, not class
<div className="container">

// Close all tags
<img src="..." />
<input type="text" />

// Use {} for JavaScript
<div>{variable}</div>
<div>{1 + 2}</div>
```

### Common Hooks Syntax
```jsx
const [state, setState] = useState(initialValue);
useEffect(() => { /* code */ }, [dependencies]);
const callback = useCallback(() => { /* code */ }, [deps]);
const ref = useRef(initialValue);
```

---

## Resources

- **Official Docs**: https://react.dev
- **Tutorial**: https://react.dev/learn/tutorial-tic-tac-toe
- **Thinking in React**: https://react.dev/learn/thinking-in-react
- **JavaScript**: https://javascript.info

---

## Remember

1. **Practice**: The more you code, the better you get
2. **Read**: Look at code, understand patterns
3. **Experiment**: Change things, see what happens
4. **Debug**: Errors are learning opportunities
5. **Ask**: Questions are good!

**You've got this! Happy coding! 🚀**
