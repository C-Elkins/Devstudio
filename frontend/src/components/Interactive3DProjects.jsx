import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Github, ExternalLink, Star, Clock, Users, TrendingUp } from 'lucide-react';

const Interactive3DProjects = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const cardRefs = useRef([]);

  // Apple-style smooth mouse tracking for 3D effect (optimized)
  const handleMouseMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    if ('ontouchstart' in window) return; // Skip 3D effect on touch devices

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / rect.height) * -6;
    const rotateY = (mouseX / rect.width) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px) scale(1.02)`;
    card.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    const glint = card.querySelector('.glint-overlay');
    if (glint) {
      const x = ((mouseX + rect.width / 2) / rect.width) * 100;
      const y = ((mouseY + rect.height / 2) / rect.height) * 100;
      glint.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(255, 255, 255, 0.15) 0%, 
          rgba(255, 255, 255, 0.05) 30%, 
          transparent 70%
        ),
        linear-gradient(135deg, 
          transparent 0%, 
          rgba(255, 255, 255, 0.03) 50%, 
          transparent 100%
        )
      `;
      glint.style.opacity = '1';
    }
    card.style.boxShadow = `
      0 25px 50px -12px rgba(0, 0, 0, 0.6),
      0 10px 30px -10px rgba(147, 51, 234, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `;
  };

  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      card.style.boxShadow = `
        0 10px 25px -3px rgba(0, 0, 0, 0.3),
        0 4px 6px -2px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.05)
      `;
      const glint = card.querySelector('.glint-overlay');
      if (glint) {
        glint.style.opacity = '0';
        glint.style.transition = 'opacity 0.3s ease';
      }
    }
  };

  // Keyboard accessibility: focus/blur for 3D effect
  const handleCardFocus = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      card.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.1)';
      card.style.transform = 'perspective(1000px) scale(1.03) translateZ(8px)';
      card.style.transition = 'transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94)';
    }
  };
  const handleCardBlur = (index) => {
    handleMouseLeave(index);
  };

  const ProjectModal = ({ project, onClose }) => {
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Apple-style backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-xl modal-backdrop"
          onClick={onClose}
          onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') onClose() }}
          role="button"
          tabIndex={0}
          aria-label="Close project modal"
        />
        
        {/* Apple-style modal */}
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl modal-content">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {/* Project Image */}
          <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative overflow-hidden rounded-t-3xl">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            
            {/* Project Status Badge */}
            <div className="absolute top-6 left-6">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${
                project.status === 'Live' 
                  ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                  : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
          
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{project.longDescription}</p>
            </div>
            
            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-semibold">{project.duration}</div>
                <div className="text-gray-400 text-sm">Duration</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-semibold">{project.teamSize}</div>
                <div className="text-gray-400 text-sm">Team Size</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-semibold">{project.complexity}</div>
                <div className="text-gray-400 text-sm">Complexity</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-semibold">5.0</div>
                <div className="text-gray-400 text-sm">Client Rating</div>
              </div>
            </div>
            
            {/* Tech Stack */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-purple-300 text-sm backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Achievements */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Key Achievements</h3>
              <div className="space-y-3">
                {project.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Live Demo
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center border border-gray-700/50 backdrop-blur-sm"
              >
                <Github className="w-5 h-5 mr-2" />
                View Code
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Project Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={el => cardRefs.current[index] = el}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden cursor-pointer apple-card focus:outline-none focus:ring-2 focus:ring-purple-400"
            style={{ 
              transformStyle: 'preserve-3d',
              boxShadow: `
                0 10px 25px -3px rgba(0, 0, 0, 0.3),
                0 4px 6px -2px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.05)
              `,
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            tabIndex={0}
            role="button"
            aria-label={`Project: ${project.title}`}
            onMouseMove={(e) => {
              handleMouseMove(e, index);
            }}
            onMouseLeave={() => handleMouseLeave(index)}
            onFocus={() => handleCardFocus(index)}
            onBlur={() => handleCardBlur(index)}
            onClick={() => setSelectedProject(project)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedProject(project);
            }}
          >
            {/* Apple-style glint overlay */}
            <div className="glint-overlay absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 rounded-2xl" />
            
            {/* Project Image */}
            <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus:scale-105"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400';
                }}
                draggable={false}
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent transition-all duration-500" />
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                  project.status === 'Live' 
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                    : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 relative z-10">
              <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300 group-hover:text-purple-300">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
              
              {/* Tech Stack Preview */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.techStack.slice(0, 3).map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-gray-300 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-gray-400 border border-white/10">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
              
              {/* CTA Button */}
              <button className="text-purple-400 hover:text-pink-400 font-medium text-sm flex items-center transition-all duration-300 group-hover:translate-x-1">
                View Details 
                <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
      
      {/* Apple-style CSS animations and mobile fallback */}
      <style>{`
        .apple-card {
          will-change: transform;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .modal-backdrop {
          animation: fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .modal-content {
          animation: modal-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Mobile fallback: subtle shadow/scale on tap */
        @media (hover: none) and (pointer: coarse) {
          .apple-card:active, .apple-card:focus {
            transform: scale(1.03) !important;
            box-shadow: 0 20px 40px -10px rgba(147,51,234,0.15), 0 2px 8px -2px rgba(0,0,0,0.08);
            transition: transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94);
          }
        }
  `}</style>
    </div>
  );
};

export default Interactive3DProjects;