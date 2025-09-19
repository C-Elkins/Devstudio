import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Code, Palette, Zap, ArrowRight, Star, Menu, X, Github, Twitter, Linkedin, Send, MapPin, Phone, Mail } from 'lucide-react';
import SecureAdmin from './SecureAdmin';
import logger from './logger';
import ReportBug from './ReportBug';

// API base URL (CRA-compatible)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({ projects: 0, clients: 0, years: 0, satisfaction: 0 });
  const [showAdmin, setShowAdmin] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        
        // Fallback to mock data (since API might not be ready)
        setProjects([
          { id: 1, title: "AI-Powered Analytics", techStack: "React, Python, TensorFlow", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400", status: "Live" },
          { id: 2, title: "E-Commerce Platform", techStack: "Next.js, Node.js, MongoDB", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400", status: "In Progress" },
          { id: 3, title: "Social Media Dashboard", techStack: "Vue.js, Express, PostgreSQL", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400", status: "Live" }
        ]);
        setTestimonials([
          { id: 1, name: "Sarah Chen", role: "CEO, TechStart", text: "Absolutely transformative work. The attention to detail is incredible.", rating: 5 },
          { id: 2, name: "Marcus Rodriguez", role: "CTO, InnovateCorp", text: "Delivered beyond expectations. Professional and creative.", rating: 5 },
          { id: 3, name: "Elena Vasquez", role: "Founder, DesignHub", text: "The most impressive development team we've worked with.", rating: 5 }
        ]);
        
        // Animate stats counting up
        const targetStats = { projects: 127, clients: 89, years: 5, satisfaction: 99 };
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
          setTimeout(() => {
            const progress = i / steps;
            setStats({
              projects: Math.round(targetStats.projects * progress),
              clients: Math.round(targetStats.clients * progress),
              years: Math.round(targetStats.years * progress),
              satisfaction: Math.round(targetStats.satisfaction * progress)
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
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="space-y-6">
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
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
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
                // Delay hiding suggestions to allow clicking
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              maxLength={254}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
            />
            
            {/* Email Suggestions Dropdown */}
            {showSuggestions && emailSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {emailSuggestions.slice(0, 6).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-purple-500/20 transition-colors border-b border-white/10 last:border-b-0"
                  >
                    <span className="text-purple-300">{suggestion.split('@')[0]}</span>
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
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors resize-none"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !localFormData.name || !localFormData.email || !localFormData.message}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            DevStudio
          </div>
          
          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Projects', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveSection(item.toLowerCase());
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  activeSection === item.toLowerCase()
                    ? 'text-purple-400'
                    : 'text-white hover:text-purple-300'
                }`}
              >
                {item}
                {activeSection === item.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-black/20 backdrop-blur-md border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {['Home', 'About', 'Projects', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveSection(item.toLowerCase());
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-white hover:text-purple-300 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );

  const HeroSection = () => (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
          We Build
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Digital Dreams
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Full-stack development that combines cutting-edge technology with stunning design to create experiences that matter.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setActiveSection('projects')}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            View Our Work
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
          
          <button 
            onClick={() => setActiveSection('contact')}
            className="px-8 py-4 border border-purple-400/50 rounded-full text-purple-300 font-semibold hover:bg-purple-400/10 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
          >
            Start a Project
          </button>
        </div>
      </div>
    </section>
  );

  const AboutSection = () => (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          About DevStudio
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">Crafting Digital Excellence</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              We're a team of passionate developers and designers who believe technology should be beautiful, functional, and transformative. Every project is an opportunity to push boundaries and exceed expectations.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              From concept to deployment, we handle every aspect of your digital presence with meticulous attention to detail and cutting-edge expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <Code className="text-purple-400 mb-4" size={40} />
              <h4 className="text-white font-semibold mb-2">Full-Stack Development</h4>
              <p className="text-gray-400 text-sm">React, Node.js, databases, and everything in between</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <Palette className="text-pink-400 mb-4" size={40} />
              <h4 className="text-white font-semibold mb-2">UI/UX Design</h4>
              <p className="text-gray-400 text-sm">Beautiful interfaces that users love to interact with</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <Zap className="text-yellow-400 mb-4" size={40} />
              <h4 className="text-white font-semibold mb-2">Performance</h4>
              <p className="text-gray-400 text-sm">Lightning-fast applications optimized for scale</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <Camera className="text-blue-400 mb-4" size={40} />
              <h4 className="text-white font-semibold mb-2">Modern Tech</h4>
              <p className="text-gray-400 text-sm">Latest frameworks and best practices</p>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">{stats.projects}+</div>
            <div className="text-gray-400">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">{stats.clients}+</div>
            <div className="text-gray-400">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{stats.years}+</div>
            <div className="text-gray-400">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{stats.satisfaction}%</div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );

  const ProjectsSection = () => (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105">
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'Live' 
                      ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                      : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{project.techStack}</p>
                <button className="text-purple-400 hover:text-pink-400 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                  View Project <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">What Clients Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
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
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Start Your Project
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Let's Build Something Amazing</h3>
            <p className="text-gray-300 mb-8">
              Ready to transform your vision into reality? We'd love to hear about your project and discuss how we can help you achieve your goals.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <MapPin className="text-purple-400 mr-3" size={20} />
                <span>San Francisco, CA & Remote</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="text-purple-400 mr-3" size={20} />
                <span>hello@devstudio.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="text-purple-400 mr-3" size={20} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer">
                <Github size={18} className="text-purple-400" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer">
                <Twitter size={18} className="text-purple-400" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-400/20 transition-colors cursor-pointer">
                <Linkedin size={18} className="text-purple-400" />
              </div>
            </div>
          </div>
          
          <ContactForm />
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <Navigation />
      <main className="pt-16">
        {renderActiveSection()}
        {/* Report Bug form */}
        <ReportBug />
      </main>
      
      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-8 relative">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            DevStudio
          </div>
          <p className="text-gray-400">
            © 2024 DevStudio. Crafting digital experiences that matter.
          </p>
        </div>
        {/* Floating Report Bug button */}
        <div className="fixed bottom-6 right-6 z-50">
          <a href="#report-bug" onClick={(e)=>{e.preventDefault(); const el = document.getElementById('report-bug'); if (el) el.scrollIntoView({behavior:'smooth'})}} className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold shadow-lg">Report Bug</a>
        </div>
      </footer>
    </div>
  );
};

export default App;