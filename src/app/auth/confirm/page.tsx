'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/lib/lang-context';
import { t } from '@/lib/translations';

export default function ConfirmEmailPage() {
  const [countdown, setCountdown] = useState(5);
  const { lang } = useLang();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-4xl p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Mail className="w-6 h-6 text-ryoiki-red" />
            <h1 className="text-2xl font-display font-bold text-ryoiki-white">
              {t('confirm.title', lang)}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-ryoiki-white/60 mb-6"
          >
            {t('confirm.desc', lang)}
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-ryoiki-white/5 rounded-xl p-4 mb-6"
          >
            <p className="text-sm text-ryoiki-white/50">
              {t('confirm.redirect', lang)} <span className="text-ryoiki-red font-bold">{countdown}</span> {t('confirm.seconds', lang)}
            </p>
          </motion.div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/"
              className="
                w-full py-4 px-6
                bg-ryoiki-red hover:bg-red-600
                rounded-2xl
                font-display font-bold text-white
                flex items-center justify-center gap-2
                transition-colors
              "
            >
              {t('confirm.go', lang)}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
