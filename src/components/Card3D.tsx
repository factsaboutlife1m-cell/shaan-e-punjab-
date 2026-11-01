import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  intensity?: number; // degree of tilt, default 6
  glow?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  onClick,
  intensity = 6,
  glow = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  const [isTouchOrCoarse, setIsTouchOrCoarse] = useState(false);

  // Detect touch devices / coarse pointer to disable desktop-only 3D calculations
  useEffect(() => {
    const checkTouch = () => {
      const isCoarse =
        typeof window !== 'undefined' &&
        (window.matchMedia('(hover: none), (pointer: coarse)').matches ||
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0);
      setIsTouchOrCoarse(Boolean(isCoarse));
    };

    checkTouch();
    const mql = window.matchMedia('(hover: none), (pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsTouchOrCoarse(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const shouldDisable3D = Boolean(prefersReduced) || isTouchOrCoarse;

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 22, stiffness: 240, mass: 0.4 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(smoothX, [0, 1], [-intensity, intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldDisable3D || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    if (shouldDisable3D) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (shouldDisable3D) return;
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  // Performance Optimization: On touch devices or reduced-motion, render lightweight div
  if (shouldDisable3D) {
    return (
      <div
        onClick={onClick}
        className={`relative transition-all duration-200 ${
          onClick ? 'cursor-pointer active:scale-[0.99]' : ''
        } ${className}`}
      >
        {children}
      </div>
    );
  }

  // Desktop Mouse Users: Smooth 3D perspective tilt & specular sheen reflection
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 1000 }}
      className={`relative select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale: 1.015,
          transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
        }}
        className={`relative transition-shadow duration-300 ${
          isHovered ? 'shadow-[0_20px_40px_rgba(0,0,0,0.6)]' : 'shadow-lg'
        } ${className}`}
      >
        {/* Specular sheen reflection following mouse cursor */}
        {glow && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none rounded-[inherit] z-20 overflow-hidden"
            style={{
              background: `radial-gradient(circle 240px at ${smoothX.get() * 100}% ${
                smoothY.get() * 100
              }%, rgba(255, 255, 255, 0.08), transparent 70%)`,
            }}
          />
        )}

        {/* Subtle metallic silver perimeter border */}
        <div
          className={`absolute inset-0 rounded-[inherit] border transition-colors duration-300 pointer-events-none z-10 ${
            isHovered ? 'border-[#BFC3C7]/40' : 'border-neutral-800'
          }`}
        />

        {children}
      </motion.div>
    </div>
  );
};
