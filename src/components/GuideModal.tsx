'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Gift, ShoppingBag, Radio, CreditCard, Tv } from 'lucide-react';
import { PokeballIcon } from './PokeballIcon';
import { useLang } from '@/lib/lang-context';
import { t } from '@/lib/translations';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { icon: UserPlus, titleKey: 'guide.step1.title', descKey: 'guide.step1.desc', color: 'from-blue-500 to-cyan-500' },
  { icon: Gift, titleKey: 'guide.step2.title', descKey: 'guide.step2.desc', color: 'from-ryoiki-red to-orange-500' },
  { icon: ShoppingBag, titleKey: 'guide.step3.title', descKey: 'guide.step3.desc', color: 'from-purple-500 to-pink-500' },
  { icon: Radio, titleKey: 'guide.step4.title', descKey: 'guide.step4.desc', color: 'from-pink-500 to-rose-500' },
  { icon: CreditCard, titleKey: 'guide.step5.title', descKey: 'guide.step5.desc', color: 'from-emerald-500 to-green-500' },
  { icon: Tv, titleKey: 'guide.step6.title', descKey: 'guide.step6.desc', color: 'from-amber-500 to-yellow-500' },
] as const;

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const { lang } = useLang();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ryoiki-black/95 backdrop-blur-xl p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-ryoiki-white/50 hover:text-ryoiki-red transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-hide"
          >
            <div className="glass rounded-4xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-ryoiki-red/20 rounded-2xl mb-4">
                  <PokeballIcon size={32} />
                </div>
                <h2 className="text-3xl font-display font-bold text-ryoiki-white mb-2">
                  {t('guide.title', lang)}
                </h2>
                <p className="text-ryoiki-white/50 font-body">
                  {t('guide.subtitle', lang)}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.titleKey}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex gap-4 p-4 glass rounded-2xl hover:bg-ryoiki-white/[0.03] transition-colors"
                    >
                      {/* Step number + icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center relative`}>
                          <Icon className="w-5 h-5 text-white" />
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ryoiki-black border-2 border-ryoiki-white/20 rounded-full flex items-center justify-center text-[10px] font-display font-bold text-ryoiki-white">
                            {index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-ryoiki-white mb-1">
                          {t(step.titleKey as any, lang)}
                        </h3>
                        <p className="text-sm text-ryoiki-white/60 leading-relaxed">
                          {t(step.descKey as any, lang)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pokeball exchange summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-ryoiki-red/10 border border-ryoiki-red/20 rounded-2xl"
              >
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="font-display font-bold text-ryoiki-white text-lg">8€</span>
                  <span className="text-ryoiki-white/30">=</span>
                  <div className="flex items-center gap-1.5">
                    <PokeballIcon size={20} />
                    <span className="font-display font-bold text-ryoiki-red text-lg">6</span>
                  </div>
                  <span className="text-ryoiki-white/30">+</span>
                  <span className="font-display font-bold text-green-400 text-lg">2€</span>
                  <span className="text-sm text-ryoiki-white/50">{t('boxes.info.tobox', lang)}</span>
                </div>
              </motion.div>

              {/* Got it button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="w-full mt-6 py-4 bg-ryoiki-red rounded-2xl font-display font-bold text-white text-lg hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {t('guide.got.it', lang)}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
