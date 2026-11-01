import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface MaskedTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  showAccentLine?: boolean;
  skipAnimation?: boolean;
}

export const MaskedText: React.FC<MaskedTextProps> = ({
  children,
  as: Component = 'h2',
  className = '',
  delay = 0,
  showAccentLine = false,
  skipAnimation = false,
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Split sentence into words
  const words = children.split(' ');

  if (reducedMotion || skipAnimation) {
    return (
      <div className="space-y-2">
        <Component className={className}>{children}</Component>
        {showAccentLine && (
          <div className="flex items-center gap-1.5 h-1">
            <span className="w-12 h-[2px] bg-[#D71920]" />
            <span className="w-6 h-[2px] bg-[#BFC3C7]" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Component className={`${className} flex flex-wrap gap-x-[0.28em] gap-y-1`}>
        {words.map((word, index) => (
          <span key={index} className="inline-block overflow-hidden py-0.5">
            <motion.span
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.65,
                delay: delay + index * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </Component>

      {showAccentLine && (
        <div className="flex items-center gap-2 overflow-hidden h-1 pt-1">
          {/* Animated bold red line */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.8,
              delay: delay + 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="h-[3px] w-14 bg-[#D71920] rounded-full"
          />
          {/* Animated metallic silver line */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.6,
              delay: delay + 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="h-[2px] w-8 bg-[#BFC3C7] rounded-full"
          />
        </div>
      )}
    </div>
  );
};
