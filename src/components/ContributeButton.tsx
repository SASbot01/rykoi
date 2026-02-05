'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Gift, Loader2, ChevronRight } from 'lucide-react';
import { PokeballIcon } from './PokeballIcon';
import { COIN_SYSTEM } from '@/lib/packs-data';

interface ContributeButtonProps {
  boxId: string;
  onContribute: (amount: number) => Promise<void>;
  disabled?: boolean;
}

const CONTRIBUTION_OPTIONS = [
  { euros: 8, coins: 6, crowdfund: 2 },
  { euros: 16, coins: 12, crowdfund: 4 },
  { euros: 24, coins: 18, crowdfund: 6 },
  { euros: 40, coins: 30, crowdfund: 10 },
];

export function ContributeButton({
  boxId,
  onContribute,
  disabled = false,
}: ContributeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleContribute = async (euros: number) => {
    setIsLoading(true);
    setSelectedAmount(euros);

    try {
      await onContribute(euros);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
      setSelectedAmount(null);
    }
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={`
          relative w-full py-4 px-6
          bg-ryoiki-red
          text-white font-display font-semibold text-base
          rounded-2xl
          overflow-hidden
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          group
        `}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Button Content */}
        <span className="relative flex items-center justify-center gap-2">
          <Gift className="w-5 h-5" />
          Apoyar y Conseguir Pokeballs
        </span>
      </motion.button>

      {/* Dropdown Panel */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        className="overflow-hidden"
      >
        <div className="pt-4 space-y-3">
          {/* Explanation */}
          <p className="text-xs text-ryoiki-white/50 text-center mb-2">
            Elige cuánto quieres aportar
          </p>

          {/* Contribution Options */}
          {CONTRIBUTION_OPTIONS.map((option) => (
            <motion.button
              key={option.euros}
              onClick={() => handleContribute(option.euros)}
              disabled={isLoading}
              className={`
                w-full py-4 px-4
                glass
                rounded-2xl
                transition-all duration-200
                hover:bg-ryoiki-red/10 hover:border-ryoiki-red/30
                disabled:opacity-50
                ${selectedAmount === option.euros ? 'bg-ryoiki-red/20 border-ryoiki-red/50' : ''}
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading && selectedAmount === option.euros ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  {/* Left: Euros */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-ryoiki-white">
                      {option.euros}€
                    </span>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-ryoiki-white/30" />

                  {/* Right: What you get */}
                  <div className="flex items-center gap-4">
                    {/* Pokeballs */}
                    <div className="flex items-center gap-1.5">
                      <PokeballIcon size={18} />
                      <span className="font-display font-bold text-ryoiki-red">
                        {option.coins}
                      </span>
                    </div>

                    {/* Separator */}
                    <span className="text-ryoiki-white/20">+</span>

                    {/* Crowdfund */}
                    <div className="flex items-center gap-1">
                      <span className="font-display font-bold text-green-400">
                        {option.crowdfund}€
                      </span>
                      <span className="text-[10px] text-ryoiki-white/40">caja</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.button>
          ))}

          {/* Info text */}
          <p className="text-[10px] text-ryoiki-white/30 text-center">
            El pago se procesa con Stripe de forma segura
          </p>
        </div>
      </motion.div>
    </div>
  );
}
