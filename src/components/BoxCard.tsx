'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Zap } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { ContributeButton } from './ContributeButton';

interface Contributor {
  username: string;
  amount: number;
  timestamp: Date;
}

interface BoxCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  targetPrice: number;
  currentRaised: number;
  contributorsCount: number;
  status: 'FUNDING' | 'READY' | 'BREAKING' | 'COMPLETED';
  scheduledBreak?: Date;
  recentContributors?: Contributor[];
  onContribute: (amount: number) => Promise<void>;
  userCoins?: number;
  isTrending?: boolean;
}

export function BoxCard({
  id,
  name,
  description,
  imageUrl,
  targetPrice,
  currentRaised,
  contributorsCount,
  status,
  scheduledBreak,
  recentContributors = [],
  onContribute,
  isTrending = false,
}: BoxCardProps) {
  const [latestContributor, setLatestContributor] = useState<Contributor | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (recentContributors.length > 0) {
      const latest = recentContributors[0];
      setLatestContributor(latest);
      setShowNotification(true);

      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [recentContributors]);

  const getStatusBadge = () => {
    const badges = {
      FUNDING: { color: 'bg-ryoiki-red', text: 'Activa', pulse: true },
      READY: { color: 'bg-emerald-500', text: 'Lista', pulse: true },
      BREAKING: { color: 'bg-ryoiki-red', text: 'En Directo', pulse: true },
      COMPLETED: { color: 'bg-ryoiki-white/20', text: 'Completada', pulse: false },
    };
    return badges[status];
  };

  const badge = getStatusBadge();

  return (
    <motion.div
      className="
        relative
        glass
        rounded-4xl
        overflow-hidden
        group
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hover Glow Effect */}
      <div className="
        absolute inset-0 opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        pointer-events-none
        rounded-4xl
      "
        style={{
          boxShadow: 'inset 0 0 40px rgba(255, 0, 0, 0.1), 0 0 40px rgba(255, 0, 0, 0.15)',
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-4xl">
        {/* Placeholder gradient if no image */}
        <div className="absolute inset-0 bg-gradient-to-br from-ryoiki-red/20 via-ryoiki-black to-ryoiki-black" />

        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="
              w-full h-full object-cover
              group-hover:scale-105
              transition-transform duration-700 ease-out
            "
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ryoiki-black via-ryoiki-black/30 to-transparent" />

        {/* Status Badge - Pill Style */}
        <div className="absolute top-4 left-4">
          <motion.div
            className={`
              ${badge.color}
              px-4 py-1.5
              rounded-full
              text-xs font-semibold font-body
              flex items-center gap-2
              text-white
              backdrop-blur-sm
            `}
          >
            {badge.pulse && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
            )}
            {badge.text}
          </motion.div>
        </div>

        {/* Trending Badge */}
        {isTrending && (
          <div className="absolute top-4 right-4">
            <motion.div
              className="
                bg-ryoiki-black/60
                backdrop-blur-sm
                px-3 py-1.5
                rounded-full
                text-xs font-semibold font-body
                flex items-center gap-1.5
                text-ryoiki-red
                border border-ryoiki-red/30
              "
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="w-3 h-3" />
              Trending
            </motion.div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-display font-bold text-ryoiki-white tracking-tight">
            {name}
          </h3>
          <p className="text-sm text-ryoiki-white/40 mt-1 font-body">
            {description}
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          current={currentRaised}
          target={targetPrice}
          animated={true}
          size="md"
        />

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-ryoiki-white/50 font-body">
            <Users className="w-4 h-4 text-ryoiki-red/70" />
            {contributorsCount} supporters
          </span>

          {scheduledBreak && status === 'FUNDING' && (
            <span className="flex items-center gap-1.5 text-ryoiki-white/50 font-body">
              <Clock className="w-4 h-4 text-ryoiki-red/70" />
              {formatTimeRemaining(scheduledBreak)}
            </span>
          )}
        </div>

        {/* Real-time Notification */}
        <AnimatePresence>
          {showNotification && latestContributor && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="
                flex items-center gap-2
                py-2.5 px-4
                glass-red
                rounded-2xl
                text-sm
              "
            >
              <Zap className="w-4 h-4 text-ryoiki-red" />
              <span className="text-ryoiki-white/70 font-body">
                <span className="text-ryoiki-red font-semibold">
                  @{latestContributor.username}
                </span>
                {' '}aportó{' '}
                <span className="text-ryoiki-white font-semibold">
                  {latestContributor.amount}€
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contribute Button */}
        {status === 'FUNDING' && (
          <ContributeButton
            boxId={id}
            onContribute={onContribute}
          />
        )}

        {/* Ready State */}
        {status === 'READY' && (
          <motion.div
            className="
              py-4 px-6
              bg-emerald-500/10
              border border-emerald-500/30
              rounded-2xl
              text-center
              font-display font-semibold
              text-emerald-400
            "
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ¡Lista para abrir!
          </motion.div>
        )}

        {/* Live State */}
        {status === 'BREAKING' && (
          <motion.a
            href="https://instagram.com/s4sf__"
            target="_blank"
            rel="noopener noreferrer"
            className="
              block py-4 px-6
              bg-ryoiki-red
              rounded-2xl
              text-center
              font-display font-semibold
              text-white
            "
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 0, 0, 0.3)',
                '0 0 40px rgba(255, 0, 0, 0.5)',
                '0 0 20px rgba(255, 0, 0, 0.3)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            whileHover={{ scale: 1.02 }}
          >
            Ver en Directo
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

function formatTimeRemaining(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff <= 0) return 'Pronto';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}
