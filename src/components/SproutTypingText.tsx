import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

interface SproutTypingTextProps {
  text: string;
  as?: 'p' | 'span' | 'h2' | 'h3' | 'div';
  className?: string;
  delay?: number;
  stagger?: number;
  mode?: 'words' | 'chars';
  showCursor?: boolean;
  cursorColor?: string;
  sproutGlow?: boolean;
}

export const SproutTypingText: React.FC<SproutTypingTextProps> = ({
  text,
  as: Component = 'p',
  className = '',
  delay = 0,
  stagger = 0.032,
  mode = 'words',
  showCursor = true,
  cursorColor = 'text-[#D71920]',
  sproutGlow = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isDoneTyping, setIsDoneTyping] = useState(false);

  // Split into words or characters
  const items = mode === 'words' ? text.split(' ') : text.split('');
  const totalDuration = delay + items.length * stagger + 0.4;

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsDoneTyping(true);
      return;
    }
    const timer = setTimeout(() => {
      setIsDoneTyping(true);
    }, totalDuration * 1000);
    return () => clearTimeout(timer);
  }, [totalDuration, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  // Container variants that trigger children when in view
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  // Sprout & Typing item variant: emerges from seed (scale 0.35, y: 14) and blossoms with spring bounce
  const sproutItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 14,
      scale: 0.35,
      rotate: -4,
      filter: 'blur(3px)',
      transformOrigin: 'bottom left',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 440,
        damping: 18,
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="inline"
      >
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <motion.span
              variants={sproutItemVariants}
              className={`inline-block transition-colors duration-500 ${
                sproutGlow ? 'hover:text-amber-300' : ''
              }`}
            >
              {item}
            </motion.span>
            {mode === 'words' && idx < items.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </React.Fragment>
        ))}

        {/* Blinking Typewriter Cursor that follows the sprouting text */}
        {showCursor && !isDoneTyping && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.65, ease: 'linear' }}
            className={`inline-block font-mono font-bold ml-0.5 select-none ${cursorColor}`}
          >
            |
          </motion.span>
        )}
      </motion.span>
    </Component>
  );
};
