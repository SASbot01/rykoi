'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CheckCircle, Home, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { PokeballIcon } from '@/components/PokeballIcon';
import Link from 'next/link';
import { useLang } from '@/lib/lang-context';
import { t } from '@/lib/translations';

function SuccessContent() {
  const searchParams = useSearchParams();
  const pokeballs = searchParams.get('pokeballs') || '6';
  const amount = searchParams.get('amount') || '8';
  const sessionId = searchParams.get('session_id');
  const { lang } = useLang();

  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setIsVerifying(false);
        setVerified(true);
        return;
      }

      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          setVerified(true);
        }
      } catch (error) {
        console.error('Verification error:', error);
      }

      setIsVerifying(false);
    }

    verifyPayment();
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-ryoiki-black flex items-center justify-center p-6">
        <div className="glass rounded-4xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-ryoiki-red animate-spin mx-auto mb-4" />
          <p className="text-ryoiki-white">{t('success.verifying', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ryoiki-black flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
          }}
        />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-500/30 rounded-full"
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

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass rounded-4xl p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-display font-bold text-ryoiki-white mb-2"
          >
            {t('success.title', lang)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-ryoiki-white/60 mb-6"
          >
            {t('success.thanks', lang)} {amount}€
          </motion.p>

          {/* Pokeballs Received */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-ryoiki-red/20 border border-ryoiki-red/30 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <PokeballIcon size={32} />
              <span className="text-4xl font-display font-bold text-ryoiki-white">
                +{pokeballs}
              </span>
            </div>
            <p className="text-ryoiki-white/60 text-sm">{t('success.pokeballs', lang)}</p>
          </motion.div>

          {/* Good Luck Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-ryoiki-white/80 mb-8"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span>{t('success.luck', lang)}</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            {/* Discord Button */}
            <a
              href="https://discord.gg/s639KDmCSQ"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-full py-4 px-6
                bg-[#5865F2] hover:bg-[#4752C4]
                rounded-2xl
                font-display font-bold text-white
                flex items-center justify-center gap-3
                transition-colors
              "
            >
              <MessageCircle className="w-5 h-5" />
              {t('success.discord', lang)}
            </a>

            {/* Back to Home Button */}
            <Link
              href="/?from=payment"
              className="
                w-full py-4 px-6
                glass hover:bg-ryoiki-white/10
                rounded-2xl
                font-display font-semibold text-ryoiki-white
                flex items-center justify-center gap-3
                transition-colors
              "
            >
              <Home className="w-5 h-5" />
              {t('success.back', lang)}
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-ryoiki-white/40 mt-6"
          >
            {t('success.email', lang)}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ryoiki-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ryoiki-red/30 border-t-ryoiki-red rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
