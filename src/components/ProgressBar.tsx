'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  showPercentage?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  current,
  target,
  showPercentage = true,
  animated = true,
  size = 'md'
}: ProgressBarProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const percentage = Math.min((current / target) * 100, 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayPercentage(percentage);
    }
  }, [percentage, animated]);

  return (
    <div className="w-full">
      {/* Progress Bar Container */}
      <div className={`
        relative w-full ${heights[size]}
        bg-ryoiki-white/5
        rounded-full
        overflow-hidden
      `}>
        {/* Animated Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #8B0000 0%, #FF0000 60%, #FF3333 100%)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{
            duration: animated ? 1.2 : 0,
            ease: [0.32, 0.72, 0, 1]
          }}
        >
          {/* Glow Effect */}
          <div
            className="absolute inset-0 opacity-60 blur-sm rounded-full"
            style={{
              background: 'linear-gradient(90deg, #8B0000 0%, #FF0000 60%, #FF3333 100%)',
            }}
          />

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 2
            }}
          />
        </motion.div>
      </div>

      {/* Stats Row */}
      {showPercentage && (
        <div className="flex justify-between items-center mt-3 text-sm">
          <span className="text-ryoiki-white/40 font-body">
            <span className="text-ryoiki-white font-semibold">€{current.toLocaleString()}</span>
            {' '}of €{target.toLocaleString()}
          </span>
          <motion.span
            className={`
              font-display font-bold
              ${percentage >= 100 ? 'text-ryoiki-red' : 'text-ryoiki-white/60'}
            `}
            animate={percentage >= 100 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: percentage >= 100 ? Infinity : 0 }}
          >
            {Math.round(displayPercentage)}%
          </motion.span>
        </div>
      )}
    </div>
  );
}
