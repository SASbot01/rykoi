'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, X, Instagram, Calendar, Clock, CheckCircle, ExternalLink } from 'lucide-react';

interface PackOpeningProps {
  isOpen: boolean;
  onClose: () => void;
  packTier: number;
  packImage?: string;
  packName?: string;
}

export function PackOpening({ isOpen, onClose, packTier, packImage, packName }: PackOpeningProps) {
  const [phase, setPhase] = useState<'confirm' | 'processing' | 'success'>('confirm');

  const handlePurchase = async () => {
    setPhase('processing');
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPhase('success');
  };

  const handleClose = () => {
    setPhase('confirm');
    onClose();
  };

  // Calculate next Friday at 20:00
  const getNextFriday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + daysUntilFriday);
    nextFriday.setHours(20, 0, 0, 0);
    return nextFriday;
  };

  const nextFriday = getNextFriday();
  const formattedDate = nextFriday.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

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
            p-4
          "
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[600px] h-[600px]
              rounded-full
              blur-3xl
            "
              style={{
                background: 'radial-gradient(circle, rgba(255, 0, 0, 0.15) 0%, transparent 70%)',
              }}
            />

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-ryoiki-red/50 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 10,
                }}
                animate={{
                  y: -10,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
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
              z-10
            "
          >
            <X className="w-8 h-8" />
          </button>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-lg"
          >
            {/* Confirm Phase */}
            {phase === 'confirm' && (
              <div className="glass rounded-4xl p-8 text-center">
                {/* Pack Image */}
                <motion.div
                  className="relative w-40 mx-auto mb-6"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {packImage ? (
                    <img
                      src={packImage}
                      alt={packName || 'Pack'}
                      className="w-full h-auto drop-shadow-[0_0_30px_rgba(255,0,0,0.4)]"
                    />
                  ) : (
                    <div className="w-40 h-56 bg-ryoiki-red/20 rounded-2xl border border-ryoiki-red/50 flex items-center justify-center">
                      <span className="text-3xl font-display font-bold text-ryoiki-red">${packTier}</span>
                    </div>
                  )}
                </motion.div>

                <h2 className="text-2xl font-display font-bold text-ryoiki-white mb-2">
                  {packName || 'Pack'}
                </h2>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-ryoiki-red/20 rounded-full mb-6">
                  <span className="text-2xl font-display font-bold text-ryoiki-red">${packTier}</span>
                </div>

                {/* Stream Info */}
                <div className="glass-red rounded-2xl p-5 mb-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-ryoiki-white/60">Apertura en directo</p>
                      <p className="font-display font-bold text-ryoiki-white">@s4sf__</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-ryoiki-white/80">
                      <Calendar className="w-4 h-4 text-ryoiki-red" />
                      <span className="text-sm capitalize">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-ryoiki-white/80">
                      <Clock className="w-4 h-4 text-ryoiki-red" />
                      <span className="text-sm">20:00h (España)</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-ryoiki-white/50 mb-6">
                  Tu sobre se abrirá en directo. ¡No te lo pierdas!
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={handlePurchase}
                    className="
                      w-full py-4 px-6
                      bg-ryoiki-red
                      rounded-2xl
                      font-display font-bold text-lg
                      text-white
                      flex items-center justify-center gap-2
                    "
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-5 h-5" />
                    Comprar Sobre
                  </motion.button>

                  <button
                    onClick={handleClose}
                    className="
                      w-full py-3 px-6
                      text-ryoiki-white/60
                      font-body
                      hover:text-ryoiki-white
                      transition-colors
                    "
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Processing Phase */}
            {phase === 'processing' && (
              <div className="glass rounded-4xl p-8 text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 border-4 border-ryoiki-red/30 border-t-ryoiki-red rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />

                <h2 className="text-2xl font-display font-bold text-ryoiki-white mb-2">
                  Procesando...
                </h2>
                <p className="text-ryoiki-white/50">
                  Confirmando tu compra
                </p>
              </div>
            )}

            {/* Success Phase */}
            {phase === 'success' && (
              <div className="glass rounded-4xl p-8 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>

                <h2 className="text-2xl font-display font-bold text-ryoiki-white mb-2">
                  ¡Sobre Reservado!
                </h2>

                <p className="text-ryoiki-white/60 mb-6">
                  Tu sobre de <span className="text-ryoiki-white font-semibold">{packName}</span> está listo
                </p>

                {/* Stream Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-white/10 rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Instagram className="w-6 h-6 text-pink-400" />
                    <span className="font-display font-bold text-xl text-ryoiki-white">@s4sf__</span>
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-ryoiki-white/60 text-sm mb-1">Tu sobre se abrirá</p>
                    <p className="text-xl font-display font-bold text-ryoiki-white capitalize">
                      {formattedDate}
                    </p>
                    <p className="text-2xl font-display font-bold text-ryoiki-red">
                      20:00h
                    </p>
                  </div>

                  <a
                    href="https://instagram.com/s4sf__"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center gap-2
                      px-6 py-3
                      bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500
                      rounded-xl
                      font-display font-bold
                      text-white
                      hover:opacity-90
                      transition-opacity
                    "
                  >
                    Seguir en Instagram
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>

                <p className="text-sm text-ryoiki-white/40 mb-6">
                  Recibirás una notificación antes del directo
                </p>

                <button
                  onClick={handleClose}
                  className="
                    w-full py-4 px-6
                    glass
                    rounded-2xl
                    font-display font-semibold
                    text-ryoiki-white
                    hover:bg-white/10
                    transition-colors
                  "
                >
                  Entendido
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
