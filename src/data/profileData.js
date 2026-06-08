// Profile data for the portfolio
export const profileData = {
  name: "Prasanth P",
  role: "CSE Student | Web & AI Enthusiast",
  email: "programmerprasanth@proton.me",
  username: "prasanth",
  about: `I'm Prasanth, a Computer Science student and open-source developer passionate about building innovative software.
          My interests lie in AI, Browser Technologies, Web Development, and Developer Tools. I enjoy transforming ideas into real products that improve how people interact with technology.
          Currently, I'm building Prism Browser, an AI-powered browser that enables natural language and voice-driven web interactions.
          When I'm not coding, you'll find me exploring new technologies, contributing to open source, and continuously expanding my skills as a developer.`,
  socialProfiles: [
    {
      id: "linkedin",
      label: "LinkedIn",
      username: "prasanthptech",
      url: "https://www.linkedin.com/in/prasanthptech"
    },
    {
      id: "github",
      label: "GitHub",
      username: "PrasanthPradeep",
      url: "https://github.com/PrasanthPradeep"
    },
    {
      id: "x",
      label: "X",
      username: "prasanth__p_",
      url: "https://x.com/prasanth__p_"
    },
    {
      id: "instagram",
      label: "Instagram",
      username: "prasanth__p_",
      url: "https://www.instagram.com/prasanth__p_"
    }
  ],
  skills: [
    { category: "Languages", items: ["Python", "C++", "JavaScript", "TypeScript"] },
    { category: "Web Dev", items: ["React", "Node.js", "HTML/CSS", "Tailwind CSS"] },
    { category: "Concepts", items: ["DSA", "AI", "OOP"] }
  ],
  projects: [
    {
      name: "Prism Browser Webpage",
      description: "An modern webpage for the Prism Browser showcasing its features and download links.",
      link: "https://prismbrowser.tech",
      repo: "https://github.com/Prismaibrowser/web"
    },
    {
      name: "KTU Grade Analyser",
      description: "An useful tool to analyze and visualize KTU grades.",
      link: "https://ktugrade.vercel.app/",
      repo: "https://github.com/PrasanthPradeep/ktugrade"
    },
    {
      name: "IEEE Aithon 2.0 Website",
      description: "Official website for IEEE SB CEK Aithon 2.0 event.",
      link: "https://aithon.ieeesbcek.org/",
      repo: "https://github.com/PrasanthPradeep/ieee-cek-aithon"
    }
  ],
  location: "Kollam, Kerala, India",
  status: "Open to new opportunities"
};

export const getSocialProfile = (id) => (
  profileData.socialProfiles.find((profile) => profile.id === id)
);

export const githubProfile = getSocialProfile("github");

export const quotes = [
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" }
];
