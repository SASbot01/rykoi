'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Gift, Loader2, ChevronRight, Plus, Minus } from 'lucide-react';
import { PokeballIcon } from './PokeballIcon';
import { redirectToCheckout } from '@/lib/stripe';
import { useLang } from '@/lib/lang-context';
import { t } from '@/lib/translations';

interface ContributeButtonProps {
  boxId: string;
  onContribute?: (amount: number) => Promise<void>;
  disabled?: boolean;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
  userId?: string;
}

// Pricing: 8€ = 6 pokeballs + 2€ crowdfund
const PRICE_PER_POKEBALL = 8 / 6; // ~1.33€
const CROWDFUND_PER_POKEBALL = 2 / 6; // ~0.33€

const CONTRIBUTION_OPTIONS = [
  { euros: 8, pokeballs: 6, crowdfund: 2 },
  { euros: 16, pokeballs: 12, crowdfund: 4 },
  { euros: 24, pokeballs: 18, crowdfund: 6 },
  { euros: 40, pokeballs: 30, crowdfund: 10 },
];

export function ContributeButton({
  boxId,
  onContribute,
  disabled = false,
  isLoggedIn = false,
  onRequireAuth,
  userId,
}: ContributeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customPokeballs, setCustomPokeballs] = useState(6);
  const { lang } = useLang();

  // Calculate custom pricing
  const customEuros = Math.round(customPokeballs * PRICE_PER_POKEBALL * 100) / 100;
  const customCrowdfund = Math.round(customPokeballs * CROWDFUND_PER_POKEBALL * 100) / 100;
  // Round to nearest cent for Stripe
  const customEurosRounded = Math.ceil(customEuros);

  const handleContribute = async (euros: number, pokeballs: number) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      onRequireAuth?.();
      return;
    }

    setIsLoading(true);
    setSelectedAmount(euros);

    try {
      // Redirect to Stripe Checkout
      await redirectToCheckout({
        amount: euros,
        pokeballs,
        boxId,
        userId,
      });
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
      setSelectedAmount(null);
    }
  };

  const handleCustomContribute = async () => {
    await handleContribute(customEurosRounded, customPokeballs);
  };

  const incrementPokeballs = () => {
    setCustomPokeballs(prev => prev + 1);
  };

  const decrementPokeballs = () => {
    setCustomPokeballs(prev => Math.max(1, prev - 1));
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
          {t('box.contribute', lang)}
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
            {t('box.choose', lang)}
          </p>

          {/* Quick Contribution Options */}
          {CONTRIBUTION_OPTIONS.map((option) => (
            <motion.button
              key={option.euros}
              onClick={() => handleContribute(option.euros, option.pokeballs)}
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
                        {option.pokeballs}
                      </span>
                    </div>

                    {/* Separator */}
                    <span className="text-ryoiki-white/20">+</span>

                    {/* Crowdfund */}
                    <div className="flex items-center gap-1">
                      <span className="font-display font-bold text-green-400">
                        {option.crowdfund}€
                      </span>
                      <span className="text-[10px] text-ryoiki-white/40">{t('box.custom.caja', lang)}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.button>
          ))}

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-ryoiki-white/10" />
            <span className="text-xs text-ryoiki-white/30">{t('box.custom', lang)}</span>
            <div className="flex-1 h-px bg-ryoiki-white/10" />
          </div>

          {/* Custom Pokeball Selector */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-ryoiki-white/60">{t('box.custom.title', lang)}</span>
            </div>

            {/* Pokeball Counter */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Minus Button */}
              <motion.button
                onClick={decrementPokeballs}
                disabled={customPokeballs <= 1 || isLoading}
                className={`
                  w-12 h-12 rounded-xl
                  bg-ryoiki-white/5 border border-ryoiki-white/10
                  flex items-center justify-center
                  transition-all duration-200
                  hover:bg-ryoiki-red/20 hover:border-ryoiki-red/30
                  disabled:opacity-30 disabled:cursor-not-allowed
                `}
                whileHover={{ scale: customPokeballs > 1 ? 1.05 : 1 }}
                whileTap={{ scale: customPokeballs > 1 ? 0.95 : 1 }}
              >
                <Minus className="w-5 h-5 text-ryoiki-white" />
              </motion.button>

              {/* Pokeball Count Display */}
              <div className="flex items-center gap-3 px-6 py-3 bg-ryoiki-red/10 rounded-xl border border-ryoiki-red/30">
                <PokeballIcon size={28} />
                <span className="text-4xl font-display font-bold text-ryoiki-white">
                  {customPokeballs}
                </span>
              </div>

              {/* Plus Button */}
              <motion.button
                onClick={incrementPokeballs}
                disabled={isLoading}
                className={`
                  w-12 h-12 rounded-xl
                  bg-ryoiki-red/20 border border-ryoiki-red/30
                  flex items-center justify-center
                  transition-all duration-200
                  hover:bg-ryoiki-red/30 hover:border-ryoiki-red/50
                  disabled:opacity-30 disabled:cursor-not-allowed
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5 text-ryoiki-red" />
              </motion.button>
            </div>

            {/* Price Summary */}
            <div className="flex items-center justify-between mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-ryoiki-white/50">{t('box.custom.receive', lang)}</span>
                <div className="flex items-center gap-1">
                  <PokeballIcon size={14} />
                  <span className="font-bold text-ryoiki-red">{customPokeballs}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-ryoiki-white/50">{t('box.custom.tobox', lang)}</span>
                <span className="font-bold text-green-400">{customCrowdfund.toFixed(2)}€</span>
              </div>
            </div>

            {/* Custom Contribute Button */}
            <motion.button
              onClick={handleCustomContribute}
              disabled={isLoading}
              className={`
                w-full py-4 px-6
                bg-gradient-to-r from-ryoiki-red to-red-600
                text-white font-display font-bold text-lg
                rounded-xl
                transition-all duration-200
                disabled:opacity-50
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading && selectedAmount === customEurosRounded ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span>{t('box.custom.contribute', lang)} {customEurosRounded}€</span>
              )}
            </motion.button>
          </div>

          {/* Info text */}
          <p className="text-[10px] text-ryoiki-white/30 text-center">
            {t('box.stripe', lang)}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
