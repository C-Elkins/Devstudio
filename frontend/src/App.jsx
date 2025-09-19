
import axios from 'axios';
import { ArrowRight, Star, Menu, X, Github, Twitter, Linkedin, Send, MapPin, Phone, Mail } from 'lucide-react';
import { Code2, Globe, Wrench, BarChart3, Layers, Database, Server, Award, Users, BookOpen } from 'lucide-react';
import SecureAdmin from './SecureAdmin';
import logger from './logger';
import ReportBugFloating from './ReportBugFloating';
import SkillsRadarChart from './components/SkillsRadarChart';
import Interactive3DProjects from './components/Interactive3DProjects';
import React, { useState, useEffect, useRef } from 'react';

// FlipCounter component for animated counting
function FlipCounter({ target, duration = 2000, className = '', prefix = '', suffix = '' }) {
  const [count, setCount] = React.useState(0);
  useEffect(() => {
  // let start = 0;
    let raf;
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      setCount(value);
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  // Simple flip style
  return (
    <span className={`inline-block font-mono tabular-nums ${className}`} style={{minWidth: `${String(target).length}ch`}}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}








// --- FunSection and LightBulbPuzzle at top-level ---
function FunSection() {
  return (
    <section className="parallax-section py-20 md:py-28 px-4 min-h-[150vh] transition-opacity duration-700 glass-apple flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl">DevStudio Puzzle</h2>
        <p className="text-lg text-gray-300 mb-8">Take a break and try to solve this fun little puzzle! Can you light up all the bulbs?</p>
        {/* Simple interactive puzzle: Light Bulb Toggle Game */}
        <LightBulbPuzzle />
      </div>
    </section>
  );
}

function LightBulbPuzzle() {
  const [bulbs, setBulbs] = React.useState([false, false, false, false, false]);
  const [moves, setMoves] = React.useState(0);
  const isSolved = bulbs.every(b => b);
  const toggle = idx => {
    setBulbs(bulbs => bulbs.map((b, i) => (i === idx || i === idx-1 || i === idx+1) ? !b : b));
    setMoves(m => m+1);
  };
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4 mb-2">
        {bulbs.map((on, i) => (
          <button key={i} onClick={() => toggle(i)} className={`w-16 h-16 rounded-full border-4 ${on ? 'bg-yellow-300 border-yellow-400 shadow-lg' : 'bg-gray-800 border-gray-600'} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400`} aria-label={`Toggle bulb ${i+1}`}></button>
        ))}
      </div>
      <div className="text-gray-400 mb-2">Click bulbs to toggle them and their neighbors. Light them all up!</div>
      <div className="text-pink-400 font-semibold">Moves: {moves}</div>
      {isSolved && <div className="text-green-400 font-bold text-xl mt-4 animate-bounce">You solved it! 🎉</div>}
    </div>
  );
}


// API base URL (CRA-compatible)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({ contributions: 0, technologies: 0, awards: 0, rating: 0 });
  const [skills, setSkills] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  // Fade transition for section changes (must be at top level)
  const [fade, setFade] = useState(true);
  // Parallax refs
  const parallaxRefs = useRef([]);

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timeout);
  }, [activeSection]);

  // Parallax scroll effect (DISABLED for bug test)
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY;
  //     parallaxRefs.current.forEach((ref, i) => {
  //       if (ref) {
  //         // Each section moves at a slightly different speed for depth
  //         const speed = 0.12 + i * 0.04;
  //         ref.style.transform = `translateY(${scrollY * speed}px)`;
  //       }
  //     });
  //   };
  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Enhanced project data with detailed information
        setProjects([
          { 
            id: 1, 
            title: "AI-Powered Analytics Dashboard", 
            description: "Real-time analytics platform with machine learning insights and predictive modeling.",
            longDescription: "A comprehensive analytics platform that leverages machine learning to provide real-time insights and predictive analytics. Built with a modern tech stack, it processes large datasets and presents actionable insights through beautiful, interactive visualizations.",
            techStack: ["React", "TypeScript", "Node.js", "Python", "TensorFlow", "MongoDB", "AWS", "Docker"],
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500", 
            status: "Live",
            duration: "6 months",
            teamSize: "4 developers",
            complexity: "High",
            features: [
              "Real-time data processing",
              "Machine learning predictions",
              "Interactive data visualizations",
              "Custom dashboard builder",
              "API integrations",
              "Role-based access control"
            ],
            achievements: [
              "40% improvement in decision-making speed",
              "Reduced data processing time by 60%",
              "Served 10,000+ daily active users"
            ],
            liveUrl: "https://analytics-demo.example.com",
            githubUrl: "https://github.com/username/analytics-dashboard"
          },
          { 
            id: 2, 
            title: "E-Commerce Platform", 
            description: "Modern e-commerce solution with advanced features and seamless user experience.",
            longDescription: "A full-featured e-commerce platform built for scalability and performance. Includes advanced features like real-time inventory management, AI-powered recommendations, and integrated payment processing.",
            techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Stripe", "AWS", "GraphQL"],
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500", 
            status: "In Progress",
            duration: "8 months",
            teamSize: "6 developers",
            complexity: "High",
            features: [
              "Advanced product catalog",
              "AI-powered recommendations",
              "Multi-payment gateway support",
              "Real-time inventory tracking",
              "Admin dashboard",
              "Mobile-first design"
            ],
            achievements: [
              "99.9% uptime during peak sales",
              "30% increase in conversion rates",
              "Supports 50,000+ concurrent users"
            ],
            liveUrl: "https://ecommerce-demo.example.com",
            githubUrl: "https://github.com/username/ecommerce-platform"
          },
          { 
            id: 3, 
            title: "Social Media Dashboard", 
            description: "Unified social media management platform with analytics and automation features.",
            longDescription: "A comprehensive social media management tool that allows users to manage multiple social platforms from a single dashboard. Features include content scheduling, analytics, and automated responses.",
            techStack: ["Vue.js", "Express", "PostgreSQL", "Redis", "Docker", "Tailwind"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500", 
            status: "Live",
            duration: "4 months",
            teamSize: "3 developers",
            complexity: "Medium",
            features: [
              "Multi-platform integration",
              "Content scheduling",
              "Analytics and reporting",
              "Team collaboration",
              "Automated workflows",
              "Real-time notifications"
            ],
            achievements: [
              "Integrated with 8+ social platforms",
              "Managed 1M+ social posts",
              "Saved users 20+ hours per week"
            ],
            liveUrl: "https://social-dashboard.example.com",
            githubUrl: "https://github.com/username/social-dashboard"
          }
        ]);
  setTestimonials([
          { id: 1, name: "Sarah Chen", role: "CEO, TechStart", text: "Absolutely transformative work. The attention to detail is incredible.", rating: 5 },
          { id: 2, name: "Marcus Rodriguez", role: "CTO, InnovateCorp", text: "Delivered beyond expectations. Professional and creative.", rating: 5 },
          { id: 3, name: "Elena Vasquez", role: "Founder, DesignHub", text: "The most impressive development team we've worked with.", rating: 5 }
        ]);
        
        // Example: fetch or define real skills data
        const realSkills = [
          { name: 'React/Next.js', value: 97, color: '#61DAFB', description: 'Advanced component architecture, hooks, performance optimization' },
          { name: 'Node.js', value: 93, color: '#339933', description: 'Express, API development, microservices architecture' },
          { name: 'TypeScript', value: 91, color: '#3178C6', description: 'Type-safe development, advanced patterns, generic programming' },
          { name: 'Python', value: 89, color: '#3776AB', description: 'Django, FastAPI, data analysis, machine learning integration' },
          { name: 'Database Design', value: 90, color: '#336791', description: 'PostgreSQL, MongoDB, query optimization, data modeling' },
          { name: 'AWS/Cloud', value: 86, color: '#FF9900', description: 'Lambda, EC2, S3, CloudFormation, serverless architecture' },
          { name: 'UI/UX Design', value: 84, color: '#FF6B9D', description: 'Figma, design systems, user research, prototyping' },
          { name: 'DevOps', value: 88, color: '#FF4B4B', description: 'Docker, CI/CD, monitoring, infrastructure as code' }
        ];
        setSkills(realSkills);

        // Animate new stats (customize as needed)
        const targetStats = { contributions: 42, technologies: 18, awards: 7, rating: 4.98 };
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        for (let i = 0; i <= steps; i++) {
          setTimeout(() => {
            const progress = i / steps;
            setStats({
              contributions: Math.round(targetStats.contributions * progress),
              technologies: Math.round(targetStats.technologies * progress),
              awards: Math.round(targetStats.awards * progress),
              rating: +(targetStats.rating * progress).toFixed(2)
            });
          }, i * stepDuration);
        }
        
      } catch (error) {
        logger.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  const ContactForm = () => {
    const [localFormData, setLocalFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [emailSuggestions, setEmailSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const popularDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'icloud.com', 'aol.com', 'protonmail.com', 'live.com'
    ];

    const handleEmailChange = (value) => {
      // Allow @ symbol and basic email characters
      const sanitizedValue = value.replace(/[<>"']/g, '').toLowerCase();
      
      if (sanitizedValue.length <= 254) {
        setLocalFormData(prev => ({...prev, email: sanitizedValue}));
        
        // Generate suggestions if user is typing before @
        if (sanitizedValue && !sanitizedValue.includes('@')) {
          const suggestions = popularDomains.map(domain => `${sanitizedValue}@${domain}`);
          setEmailSuggestions(suggestions);
          setShowSuggestions(true);
        } else if (sanitizedValue.includes('@') && sanitizedValue.split('@')[1]) {
          // Show domain suggestions if typing after @
          const [localPart, domainPart] = sanitizedValue.split('@');
          if (domainPart.length > 0) {
            const matchingDomains = popularDomains.filter(domain => 
              domain.toLowerCase().startsWith(domainPart.toLowerCase())
            );
            const suggestions = matchingDomains.map(domain => `${localPart}@${domain}`);
            setEmailSuggestions(suggestions);
            setShowSuggestions(suggestions.length > 0 && sanitizedValue !== suggestions[0]);
          } else {
            const suggestions = popularDomains.map(domain => `${localPart}@${domain}`);
            setEmailSuggestions(suggestions);
            setShowSuggestions(true);
          }
        } else {
          setShowSuggestions(false);
        }
      }
    };

    const selectSuggestion = (suggestion) => {
      setLocalFormData(prev => ({...prev, email: suggestion}));
      setShowSuggestions(false);
    };

    const handleSubmit = async () => {
      if (!localFormData.name || !localFormData.email || !localFormData.message) return;
      
      setIsSubmitting(true);
      setSubmitMessage('');
      
      try {
        await api.post('/contact', {
          name: localFormData.name,
          email: localFormData.email,
          message: localFormData.message,
          source: 'Website'
        });
        
        setSubmitMessage('Message sent successfully! We\'ll get back to you within 24 hours.');
        setLocalFormData({ name: '', email: '', message: '' });
      } catch (error) {
        logger.error('Error submitting form:', error);
        setSubmitMessage('Thank you for your message! (Demo mode - message saved locally)');
        setLocalFormData({ name: '', email: '', message: '' });
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setSubmitMessage(''), 5000);
      }
    };

    return (
      <div className="bg-gradient-to-br from-white/10 via-purple-900/10 to-pink-900/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-8">
        <div className="space-y-7">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={localFormData.name}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[<>"'&]/g, '');
                if (sanitizedValue.length <= 100) {
                  setLocalFormData(prev => ({...prev, name: sanitizedValue}));
                }
              }}
              maxLength={100}
              className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300 shadow-inner hover:bg-white/20"
              autoComplete="name"
              aria-label="Your Name"
            />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="your@email.com"
              value={localFormData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onFocus={() => {
                if (localFormData.email && emailSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              maxLength={254}
              className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300 shadow-inner hover:bg-white/20"
              autoComplete="email"
              aria-label="Your Email"
            />
            {showSuggestions && emailSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl max-h-48 overflow-y-auto animate-fade-in">
                {emailSuggestions.slice(0, 6).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-pink-500/20 transition-colors border-b border-white/10 last:border-b-0 rounded"
                  >
                    <span className="text-pink-300">{suggestion.split('@')[0]}</span>
                    <span className="text-gray-400">@{suggestion.split('@')[1]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <textarea
              placeholder="Tell us about your project..."
              rows={5}
              value={localFormData.message}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[<>"']/g, '');
                if (sanitizedValue.length <= 1000) {
                  setLocalFormData(prev => ({...prev, message: sanitizedValue}));
                }
              }}
              maxLength={1000}
              className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all duration-300 shadow-inner hover:bg-white/20 resize-none"
              aria-label="Project Details"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !localFormData.name || !localFormData.email || !localFormData.message}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold shadow-xl hover:shadow-2xl hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pink-400"
            tabIndex={0}
            aria-label="Send Message"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                Send Message
                <Send className="ml-2" size={16} />
              </>
            )}
          </button>
          {submitMessage && (
            <div className={`text-center font-medium ${
              submitMessage.includes('error') ? 'text-red-400' : 'text-green-400'
            }`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    );
  };

  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-black/60 via-purple-950/60 to-pink-950/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 select-none">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">D</span>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">DevStudio</span>
          </div>
          <div className="hidden md:flex space-x-2 lg:space-x-6 items-center">
            {[
              { label: 'Home', key: 'home' },
              { label: 'About', key: 'about', dropdown: [
                { label: 'Our Process', key: 'about-process', section: 'about' },
                { label: 'Tech Stack', key: 'about-tech', section: 'about' },
                { label: 'Stats', key: 'about-stats', section: 'about' },
              ] },
              { label: 'Projects', key: 'projects', dropdown: [
                { label: 'Featured', key: 'projects-featured', section: 'projects' },
                { label: 'All Projects', key: 'projects-all', section: 'projects' },
              ] },
              { label: 'Fun', key: 'fun' },
              { label: 'Contact', key: 'contact' }
            ].map((item) => (
              <div key={item.key} className="relative group" tabIndex={0} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDropdownOpen(null); }}>
                <button
                  onClick={() => setActiveSection(item.key.replace(/-.*/,''))}
                  onMouseEnter={() => item.dropdown && setDropdownOpen(item.key)}
                  onFocus={() => item.dropdown && setDropdownOpen(item.key)}
                  className={`relative px-4 py-2 text-base font-semibold transition-all duration-300 focus:outline-none
                    ${activeSection === item.key.replace(/-.*/, '') ? 'text-pink-400' : 'text-white hover:text-pink-300'}`}
                  tabIndex={0}
                  aria-current={activeSection === item.key.replace(/-.*/, '') ? 'page' : undefined}
                  aria-haspopup={item.dropdown ? 'true' : undefined}
                  aria-expanded={dropdownOpen === item.key ? 'true' : 'false'}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    {item.label}
                    {item.dropdown && (
                      <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${dropdownOpen === item.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </span>
                  <span className={`absolute left-0 bottom-0 w-full h-0.5 rounded-full transition-all duration-500
                    ${activeSection === item.key.replace(/-.*/, '') ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
                  `} style={{transformOrigin:'left'}} />
                </button>
                {item.dropdown && (
                  <div
                    className={`absolute left-0 top-[100%] min-w-[210px] z-40 transition-all duration-300
                      ${dropdownOpen === item.key ? 'opacity-100 pointer-events-auto translate-y-0 scale-100' : 'opacity-0 pointer-events-none -translate-y-2 scale-95'}`}
                    onMouseEnter={() => setDropdownOpen(item.key)}
                    onMouseLeave={() => setDropdownOpen(null)}
                    tabIndex={-1}
                  >
                    <div className="py-3 px-2 rounded-2xl shadow-xl border border-white/10 bg-gradient-to-br from-gray-950/95 via-purple-950/90 to-pink-950/90 backdrop-blur-xl">
                      {item.dropdown.map((sub) => (
                        <button
                          key={sub.key}
                          onClick={() => { setActiveSection(sub.section); setDropdownOpen(null); }}
                          className="w-full text-left px-6 py-3 text-white hover:bg-pink-500/10 hover:text-pink-400 transition-all duration-200 rounded-xl focus:outline-none font-medium tracking-tight"
                          style={{minWidth:'180px', fontSize:'1.08rem'}}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* End desktop nav */}
        </div>
        {/* Mobile menu with fade/slide transition */}
        <div className={`md:hidden fixed top-20 left-0 right-0 bg-gradient-to-br from-black/90 via-purple-950/90 to-pink-950/90 backdrop-blur-2xl border-t border-white/10 shadow-2xl transition-all duration-500 ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}`} style={{zIndex:60}}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {['Home', 'About', 'Projects', 'Contact', 'Fun'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveSection(item.toLowerCase());
                  setIsMenuOpen(false);
                }}
                className="block w-full px-3 py-3 text-lg font-semibold text-white hover:text-pink-400 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-pink-400"
                tabIndex={0}
                aria-current={activeSection === item.toLowerCase() ? 'page' : undefined}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  const HeroSection = () => (
  <section ref={el => parallaxRefs.current[0] = el} className="parallax-section min-h-screen flex items-center justify-center relative overflow-hidden transition-opacity duration-700 py-20 md:py-28 bg-gradient-to-br from-purple-950/80 via-gray-950/90 to-pink-950/80">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900/40 to-pink-900/30 pointer-events-none" />
      {/* Apple-style animated background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fade-in-up drop-shadow-xl">
          We Build
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Digital Dreams
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed drop-shadow">
          Full-stack development that combines cutting-edge technology with stunning design to create experiences that matter.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up-delayed-2">
          <button 
            onClick={() => setActiveSection('projects')}
            className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm text-lg"
          >
            View Our Work
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={22} />
          </button>
          <button 
            onClick={() => setActiveSection('contact')}
            className="px-10 py-5 border border-purple-400/50 rounded-2xl text-purple-300 font-semibold hover:bg-purple-400/10 hover:border-purple-400 transition-all duration-500 backdrop-blur-md hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 text-lg"
          >
            Start a Project
          </button>
        </div>
      </div>
    </section>
  );

  const AboutSection = () => (
  <section ref={el => parallaxRefs.current[1] = el} className="parallax-section py-20 md:py-28 px-4 min-h-[150vh] transition-opacity duration-700 glass-apple overflow-visible">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl" style={{textShadow: '0 2px 16px rgba(255,255,255,0.28), 0 1px 0 #fff'}}>
          About DevStudio
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-stretch mb-20">
          {/* Left: Crafting Digital Excellence & Skills */}
          <div className="glass-apple p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col gap-8 flex-1 min-h-[340px] md:min-h-[420px]">
            <h3 className="text-3xl font-bold text-white mb-4">Crafting Digital Excellence</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              We're a team of passionate developers and designers who believe technology should be beautiful, functional, and transformative. Every project is an opportunity to push boundaries and exceed expectations.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              From concept to deployment, we handle every aspect of your digital presence with meticulous attention to detail and cutting-edge expertise.
            </p>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Technical Expertise</h3>
              <div className="min-w-[340px] sm:min-w-0 flex justify-center">
                <SkillsRadarChart skills={skills} />
              </div>
            </div>
          </div>
          {/* Right: How This Website Was Built - Redesigned */}
          <div className="glass-apple p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col gap-8 flex-1 min-h-[340px] md:min-h-[420px]">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">How This Website Was Built
              <span className="ml-2 px-2 py-1 text-xs rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">2025</span>
            </h3>
            <div className="flex flex-wrap gap-8 items-center justify-center mb-2">
              <div className="flex flex-col items-center">
                <Code2 className="w-8 h-8 text-purple-300 mb-1" />
                <span className="text-lg font-semibold text-white mt-1">22,679</span>
                <span className="text-gray-400 text-xs">Lines of Code</span>
              </div>
              <div className="flex flex-col items-center">
                <Globe className="w-8 h-8 text-pink-300 mb-1" />
                <span className="text-lg font-semibold text-white mt-1">7</span>
                <span className="text-gray-400 text-xs">Languages/Frameworks</span>
              </div>
              <div className="flex flex-col items-center">
                <Wrench className="w-8 h-8 text-blue-300 mb-1" />
                <span className="text-lg font-semibold text-white mt-1">Open Source</span>
                <span className="text-gray-400 text-xs">Built with care</span>
              </div>
            </div>
            <p className="text-purple-400 font-semibold text-lg mt-2">Estimated time spent: <span className="text-white">~570 hours</span> <span className="text-gray-400 text-sm">(3+ months of focused development)</span></p>
            <ul className="grid grid-cols-2 gap-4 text-base text-gray-200 mb-4 mt-4">
              <li className="flex items-center gap-2"><BarChart3 className="w-6 h-6 text-purple-300" /> React & Vite Frontend</li>
              <li className="flex items-center gap-2"><Server className="w-6 h-6 text-green-400" /> Node.js/Express Backend</li>
              <li className="flex items-center gap-2"><Layers className="w-6 h-6 text-yellow-300" /> Python (Data/AI)</li>
              <li className="flex items-center gap-2"><Award className="w-6 h-6 text-blue-300" /> Tailwind CSS</li>
              <li className="flex items-center gap-2"><Database className="w-6 h-6 text-green-300" /> MongoDB</li>
              <li className="flex items-center gap-2"><BookOpen className="w-6 h-6 text-blue-400" /> PostgreSQL</li>
            </ul>
            {/* Roadmap: Always Open Section */}
            <div className="mt-2 bg-black/20 rounded-xl p-4 transition-all duration-300">
              <div className="font-semibold text-pink-300 text-lg flex items-center gap-2 mb-2">Development Roadmap <span className="ml-1 text-xs bg-pink-400/20 px-2 py-0.5 rounded">Milestones</span></div>
              <ol className="list-decimal ml-6 mt-2 text-gray-200 space-y-2">
                <li><span className="font-bold text-purple-300">Initial Setup:</span> Project bootstrapped, monorepo structure, GitHub Actions, and CI/CD.</li>
                <li><span className="font-bold text-purple-300">Admin Security:</span> Secret admin path, JWT auth, invite system removed, security audit.</li>
                <li><span className="font-bold text-purple-300">UI/UX Polish:</span> Apple-style glassmorphism, parallax, premium nav, dropdowns, bug report modal.</li>
                <li><span className="font-bold text-purple-300">About/Stats:</span> Dynamic About, real code stats, flip counter, boxed layout, matching heights.</li>
                <li><span className="font-bold text-purple-300">Fun & Content:</span> Interactive puzzle, 3D projects, testimonials, expanded content, roadmap tab.</li>
                <li><span className="font-bold text-purple-300">Final Polish:</span> Accessibility, mobile, performance, and launch readiness.</li>
                <li><span className="font-bold text-purple-300">Continuous Improvement:</span> Ongoing bug fixes, user feedback, and new feature rollouts based on real-world use.</li>
                <li><span className="font-bold text-purple-300">Community & Open Source:</span> Documentation, GitHub polish, contribution guidelines, and community engagement.</li>
              </ol>
            </div>
          </div>
        </div>
        {/* New Stats Section - customize as needed */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-24">
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-400 mb-2 drop-shadow">{stats.contributions}+</div>
            <div className="text-gray-400">Open Source Contributions</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-pink-400 mb-2 drop-shadow">{stats.technologies}+</div>
            <div className="text-gray-400">Technologies Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-400 mb-2 drop-shadow">{stats.awards}</div>
            <div className="text-gray-400">Awards & Recognitions</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-400 mb-2 drop-shadow">{stats.rating}</div>
            <div className="text-gray-400">Avg. Project Rating</div>
          </div>
        </div>
          {/* Our Process Section (restored, layout bug fixed) */}
          <div className="glass-apple max-w-4xl mx-auto p-10 rounded-3xl animate-fade-in overflow-visible mt-20 mb-20">
            <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Our Process</h3>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-4 shadow-lg animate-float">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="font-semibold text-lg mb-2">Discovery</div>
                <div className="text-gray-400 text-sm">We listen, research, and understand your vision and goals.</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-4 shadow-lg animate-float-delayed">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="font-semibold text-lg mb-2">Design</div>
                <div className="text-gray-400 text-sm">We craft beautiful, intuitive interfaces and experiences.</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-4 shadow-lg animate-float">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="font-semibold text-lg mb-2">Develop</div>
                <div className="text-gray-400 text-sm">We build with precision, performance, and scalability in mind.</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-4 shadow-lg animate-float-delayed">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <div className="font-semibold text-lg mb-2">Launch</div>
                <div className="text-gray-400 text-sm">We deliver, support, and help you grow post-launch.</div>
              </div>
            </div>
          </div>
          {/* Website Development Journey Section */}
          <div className="glass-apple max-w-5xl mx-auto p-12 rounded-3xl animate-fade-in overflow-visible mt-20 mb-20 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 flex flex-col gap-6">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">How This Website Was Built</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-2">
                This portfolio is the result of countless hours of design, coding, and iteration. Every page, animation, and feature was crafted with care, using modern web technologies and a passion for digital excellence.
              </p>
              <ul className="grid grid-cols-2 gap-4 text-base text-gray-200 mb-4">
                <li className="flex items-center gap-2"><span className="text-2xl">⚛️</span> React & Vite Frontend</li>
                <li className="flex items-center gap-2"><span className="text-2xl">🟩</span> Node.js/Express Backend</li>
                <li className="flex items-center gap-2"><span className="text-2xl">🐍</span> Python (Data/AI)</li>
                <li className="flex items-center gap-2"><span className="text-2xl">🌬️</span> Tailwind CSS</li>
                <li className="flex items-center gap-2"><span className="text-2xl">🍃</span> MongoDB</li>
                <li className="flex items-center gap-2"><span className="text-2xl">🐘</span> PostgreSQL</li>
              </ul>
              <div className="flex flex-wrap gap-6 items-center mt-2">
                <div className="flex flex-col items-center">
                  <span className="text-4xl">💻</span>
                  <span className="text-lg font-semibold text-white mt-1">{window.__DEVSTUDIO_LINECOUNT || 4000}</span>
                  <span className="text-gray-400 text-xs">Lines of Code</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl">🌐</span>
                  <span className="text-lg font-semibold text-white mt-1">7</span>
                  <span className="text-gray-400 text-xs">Languages/Frameworks</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl">🛠️</span>
                  <span className="text-lg font-semibold text-white mt-1">Open Source</span>
                  <span className="text-gray-400 text-xs">Built with ❤️</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-6 items-center">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600" alt="Coding Team" className="rounded-2xl shadow-2xl w-full max-w-xs mb-4" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600" alt="Code on Screen" className="rounded-2xl shadow-2xl w-full max-w-xs" loading="lazy" />
            </div>
          </div>
      </div>
    </section>
  );

  const featuredTech = [
    { name: 'React', color: '#61DAFB', icon: '⚛️' },
    { name: 'Next.js', color: '#000', icon: '⏭️' },
    { name: 'Node.js', color: '#339933', icon: '🟩' },
    { name: 'TypeScript', color: '#3178C6', icon: '🟦' },
    { name: 'Python', color: '#3776AB', icon: '🐍' },
    { name: 'AWS', color: '#FF9900', icon: '☁️' },
    { name: 'Docker', color: '#2496ED', icon: '🐳' },
    { name: 'MongoDB', color: '#47A248', icon: '🍃' },
    { name: 'PostgreSQL', color: '#336791', icon: '🐘' },
    { name: 'Tailwind', color: '#38BDF8', icon: '🌬️' },
    { name: 'GraphQL', color: '#E10098', icon: '🔺' },
    { name: 'Stripe', color: '#635BFF', icon: '💳' },
  ];

  const ProjectsSection = () => (
  <section ref={el => parallaxRefs.current[2] = el} className="parallax-section py-20 md:py-28 px-4 min-h-[150vh] transition-opacity duration-700 glass-apple">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl">
          Featured Projects
        </h2>
        {/* Animated Featured Technologies Carousel */}
        <div className="relative mb-24">
          <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Featured Technologies</h3>
          <div className="overflow-x-auto whitespace-nowrap py-6 px-2 glass-apple rounded-2xl shadow-2xl animate-fade-in hide-scrollbar">
            <div className="inline-flex gap-10 min-w-full animate-marquee" style={{minWidth:'200%'}}>
              {[...featuredTech, ...featuredTech].map((tech, idx) => (
                <div key={tech.name+idx} className="flex flex-col items-center min-w-[120px] mx-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-3xl shadow-lg" style={{background: `linear-gradient(135deg, ${tech.color} 60%, #fff2 100%)`}}>
                    <span>{tech.icon}</span>
                  </div>
                  <div className="font-semibold text-lg text-white drop-shadow" style={{color: tech.color}}>{tech.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 3D Interactive Project Cards */}
        <Interactive3DProjects projects={projects} />
        {/* Testimonials */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center mb-14 text-white">What Clients Say</h3>
          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-apple p-8 hover:bg-white/30 transition-all duration-500 shadow-2xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const ContactSection = () => (
  <section ref={el => parallaxRefs.current[3] = el} className="parallax-section py-20 md:py-28 px-4 min-h-[150vh] transition-opacity duration-700 glass-apple">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl">
          Start Your Project
        </h2>
        {/* Why Choose Us Section */}
        <div className="glass-apple mb-20 p-10 rounded-3xl shadow-2xl animate-fade-in">
          <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Why Choose Us?</h3>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-4 shadow-lg animate-float">
                <span className="text-3xl font-bold text-white">💡</span>
              </div>
              <div className="font-semibold text-lg mb-2">Innovation</div>
              <div className="text-gray-400 text-sm">We deliver creative solutions that set you apart from the competition.</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-4 shadow-lg animate-float-delayed">
                <span className="text-3xl font-bold text-white">⚡</span>
              </div>
              <div className="font-semibold text-lg mb-2">Speed & Quality</div>
              <div className="text-gray-400 text-sm">Fast delivery with meticulous attention to detail and premium quality.</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-4 shadow-lg animate-float">
                <span className="text-3xl font-bold text-white">🤝</span>
              </div>
              <div className="font-semibold text-lg mb-2">Partnership</div>
              <div className="text-gray-400 text-sm">We collaborate closely and support you at every stage of your journey.</div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Let's Build Something Amazing</h3>
            <p className="text-gray-300 mb-10">
              Ready to transform your vision into reality? We'd love to hear about your project and discuss how we can help you achieve your goals.
            </p>
            <div className="space-y-5">
              <div className="flex items-center text-gray-300">
                <MapPin className="text-purple-400 mr-3" size={22} />
                <span>San Francisco, CA & Remote</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="text-purple-400 mr-3" size={22} />
                <span>hello@devstudio.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="text-purple-400 mr-3" size={22} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            <div className="flex space-x-5 mt-10">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer shadow-lg">
                <Github size={20} className="text-purple-400" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer shadow-lg">
                <Twitter size={20} className="text-purple-400" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer shadow-lg">
                <Linkedin size={20} className="text-purple-400" />
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
  {/* Floating Report Bug Button and Modal (Contact page only) */}
  <ReportBugFloating />
      </div>
    </section>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HeroSection />;
      case 'about':
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'contact':
        return <ContactSection />;
      case 'fun':
        return <FunSection />;
      default:
        return <HeroSection />;
    }
  };

  // If the URL path matches the secret admin path, show the admin UI.
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '');
    // Set your secret admin path here:
    const secretPath = '/admin-PORTFOLIO2025';
    if (path === secretPath) {
      setShowAdmin(true);
    }
  }, []);

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto p-8 rounded-3xl shadow-2xl bg-white/10 border border-white/10 backdrop-blur-lg animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19v-6m0 0V5m0 8H6m6 0h6"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">Welcome to the Admin Panel</h2>
            <p className="text-lg text-gray-200 mt-2 text-center animate-fade-in">Portfolio Demo — Secure & Flashy</p>
          </div>
          <SecureAdmin onBack={() => {
            localStorage.removeItem('adminAuth');
            setShowAdmin(false);
            window.history.replaceState({}, '', '/');
          }} />
        </div>
      </div>
    );
  }



  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-violet-950 text-white shadow-2xl shadow-black/30 w-full max-w-full overflow-x-hidden">
      <Navigation />
      <main className="pt-16">
        <div className={fade ? 'opacity-100 transition-opacity duration-700' : 'opacity-0'}>
          {/* Animated section divider */}
          <div className="w-full h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-lg animate-divider-fade" />
          {renderActiveSection()}
          <div className="w-full h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-lg animate-divider-fade" />
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full bg-gradient-to-br from-gray-950/90 via-purple-950/80 to-pink-950/80 border-t border-white/10 py-16 flex flex-col items-center justify-center shadow-2xl mt-0">
        <div className="max-w-6xl w-full px-4 text-center">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 drop-shadow-xl">
            DevStudio
          </div>
          <p className="text-gray-400 text-lg mb-2">
            © 2024 DevStudio. Crafting digital experiences that matter.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <a href="https://github.com/C-Elkins" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer shadow-lg">
              <Github size={22} className="text-purple-400" />
            </a>
            <a href="https://github.com/C-Elkins" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer shadow-lg">
              <Twitter size={22} className="text-purple-400" />
            </a>
            <a href="https://github.com/C-Elkins" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer shadow-lg">
              <Linkedin size={22} className="text-purple-400" />
            </a>
          </div>
        </div>
      </footer>
        {/* ReportBugFloating will be rendered only on Contact page now */}
    </div>
  );
};

export default App;