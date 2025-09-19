import React, { useState, useRef, useEffect } from 'react';

const InteractiveLightBulb = () => {
  const [isOn, setIsOn] = useState(false);
  const [chainPosition, setChainPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const chainRef = useRef(null);
  const bulbRef = useRef(null);
  const containerRef = useRef(null);

  // Physics simulation for chain swing
  const [chainPhysics, setChainPhysics] = useState({
    angle: 0,
    velocity: 0,
    damping: 0.95,
    gravity: 0.3
  });

  useEffect(() => {
    const animateChain = () => {
      if (!isDragging) {
        setChainPhysics(prev => {
          const newAngle = prev.angle + prev.velocity;
          const newVelocity = (prev.velocity - prev.gravity * Math.sin(newAngle)) * prev.damping;
          
          return {
            ...prev,
            angle: newAngle,
            velocity: Math.abs(newVelocity) > 0.001 ? newVelocity : 0
          };
        });
      }
      requestAnimationFrame(animateChain);
    };
    animateChain();
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const newMousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Calculate angle based on mouse position
      const centerX = rect.width / 2;
      const chainLength = 100;
      const deltaX = newMousePos.x - centerX;
      const deltaY = newMousePos.y - 50;
      const angle = Math.atan2(deltaX, deltaY);
      
      setChainPhysics(prev => ({
        ...prev,
        angle: angle,
        velocity: (angle - prev.angle) * 0.5
      }));
      
      setMousePosition(newMousePos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleChainClick = () => {
    setIsOn(!isOn);
    // Add some chain swing when clicked
    setChainPhysics(prev => ({
      ...prev,
      velocity: prev.velocity + (Math.random() - 0.5) * 0.5
    }));
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const chainLength = 100;
  const chainX = Math.sin(chainPhysics.angle) * 30;
  const chainY = Math.cos(chainPhysics.angle) * 20;

  return (
    <div 
      ref={containerRef}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 select-none"
      style={{ width: '300px', height: '400px' }}
    >
      {/* Ceiling mount */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-lg shadow-lg">
        <div className="absolute inset-x-0 top-0 h-2 bg-gray-500 rounded-t-lg"></div>
      </div>

      {/* Chain */}
      <svg 
        className="absolute top-6 left-1/2 transform -translate-x-1/2 cursor-pointer" 
        width="160" 
        height="160"
        style={{ 
          filter: isDragging ? 'brightness(1.2)' : 'none',
          transition: 'filter 0.2s ease'
        }}
      >
        {/* Chain links */}
        {Array.from({ length: 10 }).map((_, i) => {
          const linkY = 15 + i * 15;
          const linkX = 80 + Math.sin(chainPhysics.angle) * (i * 4);
          return (
            <g key={i}>
              <ellipse
                cx={linkX}
                cy={linkY}
                rx="4"
                ry="8"
                fill="#8B7355"
                stroke="#6B5B47"
                strokeWidth="0.8"
                transform={`rotate(${chainPhysics.angle * 8} ${linkX} ${linkY})`}
              />
              <ellipse
                cx={linkX}
                cy={linkY + 8}
                rx="8"
                ry="4"
                fill="#9B8365"
                stroke="#7B6B57"
                strokeWidth="0.8"
                transform={`rotate(${chainPhysics.angle * 8} ${linkX} ${linkY})`}
              />
            </g>
          );
        })}
        
        {/* Chain pull tab */}
        <circle
          cx={80 + chainX}
          cy={140 + chainY}
          r="12"
          fill="#B8860B"
          stroke="#8B7355"
          strokeWidth="3"
          className="cursor-pointer hover:fill-yellow-500 transition-colors"
          onMouseDown={handleMouseDown}
          onClick={handleChainClick}
        />
      </svg>

      {/* Light bulb */}
      <div 
        ref={bulbRef}
        className="absolute transition-all duration-500 ease-out"
        style={{
          top: '160px',
          left: '50%',
          transform: `translateX(-50%) translateX(${chainX}px) translateY(${chainY}px) rotate(${chainPhysics.angle * 3}deg)`
        }}
      >
        {/* Bulb glow effect */}
        {isOn && (
          <div className="absolute inset-0 rounded-full animate-pulse">
            <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-40 scale-200"></div>
            <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50 scale-150"></div>
            <div className="absolute inset-0 bg-yellow-100 rounded-full blur-lg opacity-60 scale-125"></div>
          </div>
        )}
        
        {/* Bulb base/screw threads */}
        <div className="relative w-24 h-30 mx-auto">
          <div className="absolute bottom-0 w-18 h-8 bg-gradient-to-b from-gray-400 to-gray-600 mx-auto left-1/2 transform -translate-x-1/2 rounded-b-sm">
            {/* Screw threads */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute inset-x-0 bg-gray-500 h-0.5"
                style={{ top: `${3 + i * 5}px` }}
              ></div>
            ))}
          </div>
          
          {/* Bulb glass */}
          <div className={`absolute top-0 w-24 h-20 rounded-full transition-all duration-300 ${
            isOn 
              ? 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 shadow-2xl' 
              : 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400'
          }`}>
            {/* Filament */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
              isOn ? 'opacity-100' : 'opacity-30'
            }`}>
              <svg width="32" height="24" viewBox="0 0 32 24">
                <path 
                  d="M8 12 Q16 6 24 12 Q16 18 8 12" 
                  stroke={isOn ? "#FF6B35" : "#666"} 
                  strokeWidth="1.5" 
                  fill="none"
                />
                <path 
                  d="M8 12 Q16 8 24 12 Q16 16 8 12" 
                  stroke={isOn ? "#FF8C42" : "#666"} 
                  strokeWidth="1.5" 
                  fill="none"
                />
              </svg>
            </div>
            
            {/* Glass highlight */}
            <div className="absolute top-3 left-3 w-6 h-8 bg-white opacity-40 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>

      {/* Inspirational text */}
      <div 
        className={`absolute top-80 left-1/2 transform -translate-x-1/2 text-center transition-all duration-700 ${
          isOn 
            ? 'text-yellow-300 drop-shadow-lg brightness-125 scale-105' 
            : 'text-gray-500 brightness-75'
        }`}
        style={{
          textShadow: isOn ? '0 0 20px rgba(255, 255, 0, 0.8), 0 0 40px rgba(255, 255, 0, 0.4)' : 'none'
        }}
      >
        <div className="text-xl font-bold whitespace-nowrap">
          Just One Good Idea Away
        </div>
        <div className="text-sm mt-2 font-medium">
          {isOn ? 'Illuminating possibilities...' : 'Pull the chain for inspiration'}
        </div>
      </div>

      {/* Light ray effects when on */}
      {isOn && (
        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-gradient-to-b from-yellow-300 to-transparent opacity-25 animate-pulse"
              style={{
                height: '300px',
                transform: `rotate(${i * 22.5}deg) translateY(-150px)`,
                transformOrigin: 'bottom center',
                animationDelay: `${i * 125}ms`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Subtle background lighting when on */}
      {isOn && (
        <div 
          className="fixed inset-0 pointer-events-none transition-opacity duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle at 50% 25%, rgba(255, 255, 0, 0.08) 0%, transparent 60%)',
            zIndex: -1
          }}
        ></div>
      )}
    </div>
  );
};

export default InteractiveLightBulb;