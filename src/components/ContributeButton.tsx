'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface ContributeButtonProps {
  boxId: string;
  onContribute: (amount: number) => Promise<void>;
  disabled?: boolean;
  userCoins?: number;
}

const QUICK_AMOUNTS = [5, 10, 25, 50];

export function ContributeButton({
  boxId,
  onContribute,
  disabled = false,
  userCoins = 0
}: ContributeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleContribute = async (amount: number) => {
    if (amount > userCoins) return;

    setIsLoading(true);
    setSelectedAmount(amount);

    try {
      await onContribute(amount);
      setIsOpen(false);
      setCustomAmount('');
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
          <Zap className="w-5 h-5" />
          Contribute
        </span>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: '0 10px 40px -10px rgba(255, 0, 0, 0.5)',
          }}
        />
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
        <div className="pt-4 space-y-4">
          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2">
            {QUICK_AMOUNTS.map((amount) => (
              <motion.button
                key={amount}
                onClick={() => handleContribute(amount)}
                disabled={isLoading || amount > userCoins}
                className={`
                  py-3 px-2
                  glass
                  rounded-xl
                  font-display font-semibold
                  transition-all duration-200
                  ${amount > userCoins
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-ryoiki-red/10 hover:border-ryoiki-red/30'
                  }
                  ${selectedAmount === amount ? 'bg-ryoiki-red/20 border-ryoiki-red/50' : ''}
                `}
                whileHover={amount <= userCoins ? { scale: 1.03 } : {}}
                whileTap={amount <= userCoins ? { scale: 0.97 } : {}}
              >
                {isLoading && selectedAmount === amount ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  `${amount}€`
                )}
              </motion.button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom"
                className="input-modern w-full"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ryoiki-white/30 font-body">
                €
              </span>
            </div>
            <motion.button
              onClick={() => customAmount && handleContribute(Number(customAmount))}
              disabled={
                isLoading ||
                !customAmount ||
                Number(customAmount) <= 0 ||
                Number(customAmount) > userCoins
              }
              className="
                py-3 px-6
                bg-ryoiki-red
                rounded-xl
                font-display font-semibold
                disabled:opacity-30 disabled:cursor-not-allowed
                hover:shadow-glow
                transition-all
              "
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading && selectedAmount === Number(customAmount) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Go'
              )}
            </motion.button>
          </div>

          {/* Balance Indicator */}
          <div className="text-center text-sm text-ryoiki-white/40 font-body">
            Balance: <span className="text-ryoiki-red font-semibold">{userCoins}€</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
