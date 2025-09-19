import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const defaultSkills = [
  { name: 'React/Next.js', value: 95, color: '#61DAFB', description: 'Advanced component architecture, hooks, performance optimization' },
  { name: 'Node.js', value: 90, color: '#339933', description: 'Express, API development, microservices architecture' },
  { name: 'TypeScript', value: 88, color: '#3178C6', description: 'Type-safe development, advanced patterns, generic programming' },
  { name: 'Python', value: 85, color: '#3776AB', description: 'Django, FastAPI, data analysis, machine learning integration' },
  { name: 'Database Design', value: 87, color: '#336791', description: 'PostgreSQL, MongoDB, query optimization, data modeling' },
  { name: 'AWS/Cloud', value: 82, color: '#FF9900', description: 'Lambda, EC2, S3, CloudFormation, serverless architecture' },
  { name: 'UI/UX Design', value: 78, color: '#FF6B9D', description: 'Figma, design systems, user research, prototyping' },
  { name: 'DevOps', value: 80, color: '#FF4B4B', description: 'Docker, CI/CD, monitoring, infrastructure as code' }
];

const SkillsRadarChart = ({ skills = defaultSkills }) => {
  const canvasRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Apple-like smooth animation using requestAnimationFrame and ease-in-out
  useEffect(() => {
    let frame;
    let start;
    const duration = 1200; // ms, for a fluid but quick feel
    const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    function animate(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(easeInOut(progress) * 100);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setAnimationProgress(100);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [skills]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 60; // Increased padding

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw concentric circles (grid)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw axis lines
    const angleStep = (Math.PI * 2) / skills.length;
    skills.forEach((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();
    });

    // Draw skill polygon
    if (animationProgress > 0) {
      ctx.beginPath();
      skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const value = (skill.value / 100) * (animationProgress / 100);
        const radius = maxRadius * value;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();

      // Fill with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
      gradient.addColorStop(1, 'rgba(219, 39, 119, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Stroke
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw skill points
      skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const value = (skill.value / 100) * (animationProgress / 100);
        const radius = maxRadius * value;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Point circle
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = skill.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow effect for hovered skill
        if (hoveredSkill === index) {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = `${skill.color}40`;
          ctx.fill();
        }
      });
    }

    // Draw percentage labels at grid circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 1; i <= 5; i++) {
      const percentage = (i * 20).toString() + '%';
      ctx.fillText(percentage, centerX + (maxRadius / 5) * i + 10, centerY - 5);
    }

  }, [animationProgress, hoveredSkill, skills]);

  // Handle mouse movement for hover effects
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 60;

    // Check if mouse is near any skill point
    const angleStep = (Math.PI * 2) / skills.length;
    let closestSkill = null;
    let minDistance = Infinity;

    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = skill.value / 100;
      const radius = maxRadius * value;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      if (distance < 20 && distance < minDistance) {
        minDistance = distance;
        closestSkill = index;
      }
    });

    setHoveredSkill(closestSkill);
  };

  // Responsive canvas size
  const canvasSize = window.innerWidth < 500 ? 320 : 400;
  const labelRadius = window.innerWidth < 500 ? 170 : 200;

  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      {/* Radar Chart */}
      <div className="flex justify-center mb-6 sm:mb-8 min-w-[340px]">
        <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredSkill(null)}
          />

          {/* Skill Labels - positioned further out, responsive */}
          <div className="absolute inset-0">
            {skills.map((skill, index) => {
              const angleStep = (Math.PI * 2) / skills.length;
              const angle = index * angleStep - Math.PI / 2;
              const x = canvasSize / 2 + Math.cos(angle) * labelRadius;
              const y = canvasSize / 2 + Math.sin(angle) * labelRadius;
              return (
                <div
                  key={skill.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    opacity: animationProgress > 50 ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    maxWidth: 90,
                    fontSize: window.innerWidth < 500 ? 12 : 14
                  }}
                >
                  <div 
                    className={`text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      hoveredSkill === index 
                        ? 'text-purple-300 scale-110' 
                        : 'text-white'
                    }`}
                    style={{ color: hoveredSkill === index ? skill.color : undefined }}
                  >
                    {skill.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {skill.value}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover Details Card */}
      {hoveredSkill !== null && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 animate-in fade-in duration-200">
          <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-xs shadow-2xl">
            <h4 className="font-semibold text-lg mb-2" style={{ color: skills[hoveredSkill].color }}>
              {skills[hoveredSkill].name}
            </h4>
            <div className="text-2xl font-bold text-white mb-1">
              {skills[hoveredSkill].value}%
            </div>
            <p className="text-gray-300 text-sm">
              {skills[hoveredSkill].description}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 sm:mt-8">
        {skills.map((skill, index) => (
          <div
            key={skill.name}
            className={`p-2 sm:p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
              hoveredSkill === index
                ? 'bg-white/10 border-purple-400/50 transform scale-105'
                : 'bg-white/5 border-white/10 hover:bg-white/8'
            }`}
            onMouseEnter={() => setHoveredSkill(index)}
            onMouseLeave={() => setHoveredSkill(null)}
            title={skill.name}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: skill.color }}
              />
              <span className="text-white text-xs sm:text-sm font-medium truncate max-w-[80px] block" title={skill.name}>{skill.name}</span>
            </div>
            <div className="text-gray-400 text-xs mt-1">{skill.value}% proficiency</div>
          </div>
        ))}
      </div>
    </div>
  );
};


SkillsRadarChart.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
};

export default SkillsRadarChart;