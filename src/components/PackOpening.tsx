'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface NFTCard {
  id: string;
  name: string;
  imageUrl: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  perkName: string;
}

interface PackOpeningProps {
  isOpen: boolean;
  onClose: () => void;
  packTier: number;
  cards: NFTCard[];
}

const RARITY_COLORS = {
  COMMON: '#FFFFFF',
  RARE: '#00FFFF',
  EPIC: '#FF0000',
  LEGENDARY: '#FF3333',
  MYTHIC: '#FFD700',
};

const RARITY_GLOW = {
  COMMON: '0 0 20px rgba(255, 255, 255, 0.3)',
  RARE: '0 0 30px rgba(0, 255, 255, 0.5)',
  EPIC: '0 0 30px rgba(255, 0, 0, 0.5)',
  LEGENDARY: '0 0 40px rgba(255, 51, 51, 0.6)',
  MYTHIC: '0 0 50px rgba(255, 215, 0, 0.7)',
};

export function PackOpening({ isOpen, onClose, packTier, cards }: PackOpeningProps) {
  const [phase, setPhase] = useState<'intro' | 'revealing' | 'revealed'>('intro');
  const [revealedIndex, setRevealedIndex] = useState(-1);

  const startReveal = () => {
    setPhase('revealing');
    revealCards();
  };

  const revealCards = async () => {
    for (let i = 0; i < cards.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRevealedIndex(i);
    }
    setPhase('revealed');
  };

  const handleClose = () => {
    setPhase('intro');
    setRevealedIndex(-1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-ryoiki-black/95
            backdrop-blur-xl
          "
        >
          {/* Background Effects - Red Waves */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Radial Red Gradient */}
            <div className="
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[800px] h-[800px]
              rounded-full
              blur-3xl
            "
              style={{
                background: 'radial-gradient(circle, rgba(255, 0, 0, 0.2) 0%, rgba(139, 0, 0, 0.1) 50%, transparent 70%)',
              }}
            />

            {/* Animated Red Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-ryoiki-red rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 10,
                }}
                animate={{
                  y: -10,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Concentric Wave Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 border border-ryoiki-red/20 rounded-full"
                style={{
                  width: 300 + i * 200,
                  height: 300 + i * 200,
                  marginLeft: -(150 + i * 100),
                  marginTop: -(150 + i * 100),
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="
              absolute top-6 right-6
              p-2
              text-ryoiki-white/50
              hover:text-ryoiki-red
              transition-colors
            "
          >
            <X className="w-8 h-8" />
          </button>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            {/* Intro Phase */}
            {phase === 'intro' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                {/* Pack Visual */}
                <motion.div
                  className="
                    relative w-64 h-80 mx-auto mb-8
                    bg-ryoiki-black
                    border-2 border-ryoiki-red
                    rounded-2xl
                  "
                  animate={{
                    rotateY: [0, 5, -5, 0],
                    boxShadow: [
                      '0 0 40px rgba(255, 0, 0, 0.3)',
                      '0 0 60px rgba(255, 0, 0, 0.5)',
                      '0 0 40px rgba(255, 0, 0, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Pack Design */}
                  <div className="absolute inset-4 border border-ryoiki-red/30 rounded-xl flex flex-col items-center justify-center">
                    {/* Ryoiki Symbol */}
                    <div className="w-16 h-16 border-2 border-ryoiki-red rounded-full flex items-center justify-center mb-4">
                      <span className="text-ryoiki-red font-bold text-2xl">R</span>
                    </div>
                    <div className="text-5xl font-bold font-display text-ryoiki-red">
                      {packTier}€
                    </div>
                    <div className="text-sm font-mono text-ryoiki-white/50 mt-2 tracking-widest">
                      GENESIS PACK
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-ryoiki-red" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-ryoiki-red" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-ryoiki-red" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-ryoiki-red" />
                </motion.div>

                <h2 className="text-3xl font-bold font-display text-ryoiki-white mb-2">
                  領域展開
                </h2>
                <p className="text-ryoiki-white/50 mb-8 font-mono">
                  This pack contains 3 Genesis NFTs
                </p>

                <motion.button
                  onClick={startReveal}
                  className="
                    py-4 px-12
                    bg-ryoiki-red
                    rounded-full
                    font-bold text-lg
                    flex items-center gap-2
                    mx-auto
                    text-ryoiki-white
                  "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(255, 0, 0, 0.5)',
                      '0 0 50px rgba(255, 0, 0, 0.8)',
                      '0 0 30px rgba(255, 0, 0, 0.5)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5" />
                  EXPAND DOMAIN
                </motion.button>
              </motion.div>
            )}

            {/* Revealing Phase */}
            {(phase === 'revealing' || phase === 'revealed') && (
              <div className="space-y-8">
                {/* Cards Grid */}
                <div className="flex justify-center gap-6">
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ rotateY: 180, scale: 0.8 }}
                      animate={{
                        rotateY: index <= revealedIndex ? 0 : 180,
                        scale: index <= revealedIndex ? 1 : 0.8,
                      }}
                      transition={{
                        duration: 0.6,
                        type: 'spring',
                        stiffness: 100,
                      }}
                      className="relative w-48 h-64"
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                      }}
                    >
                      {/* Card Back */}
                      <div
                        className="
                          absolute inset-0
                          bg-ryoiki-black
                          border-2 border-ryoiki-red/50
                          rounded-xl
                        "
                        style={{
                          transform: 'rotateY(180deg)',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <div className="absolute inset-4 border border-ryoiki-red/20 rounded-lg flex items-center justify-center">
                          <div className="w-12 h-12 border border-ryoiki-red rounded-full flex items-center justify-center">
                            <span className="text-ryoiki-red font-bold">R</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Front */}
                      <div
                        className="
                          absolute inset-0
                          bg-ryoiki-black
                          border-2 rounded-xl
                          overflow-hidden
                        "
                        style={{
                          borderColor: RARITY_COLORS[card.rarity],
                          boxShadow: index <= revealedIndex ? RARITY_GLOW[card.rarity] : 'none',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        {/* Card Image Area */}
                        <div
                          className="h-32"
                          style={{
                            background: `linear-gradient(135deg, ${RARITY_COLORS[card.rarity]}20 0%, transparent 100%)`,
                          }}
                        >
                          {card.imageUrl && (
                            <img
                              src={card.imageUrl}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="p-4 space-y-2">
                          {/* Rarity Badge */}
                          <div
                            className="inline-block px-2 py-0.5 rounded text-xs font-bold font-mono"
                            style={{
                              backgroundColor: `${RARITY_COLORS[card.rarity]}20`,
                              color: RARITY_COLORS[card.rarity],
                            }}
                          >
                            {card.rarity}
                          </div>

                          <h4 className="font-bold text-ryoiki-white text-sm">
                            {card.name}
                          </h4>

                          <p className="text-xs text-ryoiki-white/50 font-mono">
                            {card.perkName}
                          </p>
                        </div>

                        {/* Shine Effect */}
                        {index <= revealedIndex && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Claim Button */}
                {phase === 'revealed' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <motion.button
                      onClick={handleClose}
                      className="
                        py-4 px-12
                        bg-ryoiki-white
                        text-ryoiki-black
                        rounded-full
                        font-bold text-lg
                      "
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      CLAIM YOUR NFTs
                    </motion.button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
