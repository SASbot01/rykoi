'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Zap, Users, Package, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { BoxCard } from '@/components/BoxCard';
import { PackOpening } from '@/components/PackOpening';

// Mock Data
const MOCK_BOXES = [
  {
    id: '1',
    name: 'Prismatic Evolutions',
    description: 'Booster Box — 36 Packs',
    imageUrl: '/boxes/prismatic.jpg',
    targetPrice: 400,
    currentRaised: 312,
    contributorsCount: 23,
    status: 'FUNDING' as const,
    scheduledBreak: new Date(Date.now() + 86400000 * 2),
    isTrending: true,
  },
  {
    id: '2',
    name: 'Surging Sparks',
    description: 'Elite Trainer Box',
    imageUrl: '/boxes/surging.jpg',
    targetPrice: 85,
    currentRaised: 85,
    contributorsCount: 12,
    status: 'READY' as const,
  },
  {
    id: '3',
    name: 'Crown Zenith',
    description: 'Premium Collection',
    imageUrl: '/boxes/crown.jpg',
    targetPrice: 150,
    currentRaised: 67,
    contributorsCount: 8,
    status: 'FUNDING' as const,
    scheduledBreak: new Date(Date.now() + 86400000 * 5),
  },
];

const PACK_TIERS = [1, 2, 5, 10, 20, 50, 100];

const STATS = [
  { label: 'Breakers', value: '2,847', icon: Users },
  { label: 'Genesis NFTs', value: '100', icon: Package },
  { label: 'Total Broken', value: '€47K', icon: TrendingUp },
];

export default function HomePage() {
  const [isPackOpen, setIsPackOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(5);
  const userCoins = 250;

  const handleContribute = async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Contributed ${amount} coins`);
  };

  const handleBuyPack = (tier: number) => {
    setSelectedPack(tier);
    setIsPackOpen(true);
  };

  const mockCards = [
    { id: '1', name: 'Coin Surge', imageUrl: '/nfts/1.png', rarity: 'COMMON' as const, perkName: '+5% coins extra' },
    { id: '2', name: 'Amplifier Node', imageUrl: '/nfts/2.png', rarity: 'RARE' as const, perkName: 'x1.2 bar multiplier' },
    { id: '3', name: 'Genesis Vault Key', imageUrl: '/nfts/3.png', rarity: 'LEGENDARY' as const, perkName: 'Secret box access' },
  ];

  return (
    <main className="relative min-h-screen bg-ryoiki-black font-body">
      {/* ===== WAVE EFFECTS BACKGROUND ===== */}
      <div className="waves-container">
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
        <div className="wave wave-4" />
      </div>

      {/* Ambient Glow Orbs */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />

      {/* Red Vignette */}
      <div className="vignette-red" />

      {/* Noise Overlay */}
      <div className="noise" />

      {/* ===== NAVIGATION ===== */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Modern Logo */}
            <motion.div
              className="relative w-10 h-10 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-ryoiki-red rounded-2xl rotate-45 opacity-20" />
              <div className="absolute inset-1 bg-ryoiki-black rounded-xl rotate-45" />
              <span className="relative text-ryoiki-red font-display font-bold text-xl">R</span>
            </motion.div>
            <span className="font-display font-bold text-2xl tracking-tight">
              ryōiki
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-5 py-2.5 glass-red rounded-full">
              <span className="text-ryoiki-white/50 text-sm font-body">Balance</span>
              <span className="font-display font-bold text-ryoiki-red">{userCoins}€</span>
            </div>
            <button className="btn-secondary">
              Buy Coins
            </button>
            <button className="btn-primary">
              Connect
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden z-10">
        {/* Abstract Art Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-ryoiki-red/5 blob blur-3xl" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-ryoiki-red/10 rounded-full blur-3xl" />

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-32 right-[20%] w-4 h-4 bg-ryoiki-red/30 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-48 left-[15%] w-6 h-6 border border-ryoiki-red/20 rounded-lg rotate-45"
          animate={{ rotate: [45, 90, 45], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 left-[25%] w-3 h-3 bg-ryoiki-red/40 rounded-full"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-red rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-ryoiki-red" />
            <span className="text-sm font-medium text-ryoiki-white/80">Now in Genesis Phase</span>
          </motion.div>

          {/* Main Title - Modern Art Style */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
          >
            <span className="text-ryoiki-white">ryō</span>
            <span className="gradient-text">iki</span>
          </motion.h1>

          {/* Japanese Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-ryoiki-red/40 font-mono text-sm tracking-[0.4em] mb-8"
          >
            領域展開
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-ryoiki-white/60 mb-12 max-w-2xl mx-auto font-body font-light leading-relaxed"
          >
            Enter the domain. Crowdfund legendary openings.
            <br />
            <span className="text-ryoiki-white font-medium">Own your destiny.</span>
          </motion.p>

          {/* Stats - Modern Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4 md:gap-6 mb-14"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass px-6 py-4 rounded-3xl min-w-[120px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4 text-ryoiki-red" />
                  <span className="text-2xl font-display font-bold text-ryoiki-white">
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs text-ryoiki-white/40 font-body">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              className="btn-primary flex items-center justify-center gap-2 group text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-5 h-5" />
              Enter Domain
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <button className="btn-secondary text-base">
              View Genesis Collection
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== LIVE BREAKS SECTION ===== */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ryoiki-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ryoiki-red" />
                </span>
                <span className="text-sm font-mono text-ryoiki-red tracking-wider">LIVE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                Active Breaks
              </h2>
            </div>
            <motion.button
              className="flex items-center gap-1 text-ryoiki-white/60 hover:text-ryoiki-red transition-colors font-medium"
              whileHover={{ x: 4 }}
            >
              View all <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Box Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_BOXES.map((box, index) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BoxCard
                  {...box}
                  onContribute={handleContribute}
                  userCoins={userCoins}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GENESIS PACKS SECTION ===== */}
      <section className="relative py-24 px-6 z-10">
        {/* Abstract background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ryoiki-red/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
            >
              <Package className="w-4 h-4 text-ryoiki-red" />
              <span className="text-sm font-medium text-ryoiki-white/60">Limited Collection</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Genesis <span className="gradient-text">Packs</span>
            </h2>
            <p className="text-ryoiki-white/50 max-w-xl mx-auto font-body text-lg">
              100 unique NFTs with real utility. Each pack contains 3 cards
              with dynamic rarities and exclusive perks.
            </p>
          </div>

          {/* Pack Tiers Grid - Modern Style */}
          <div className="flex flex-wrap justify-center gap-4">
            {PACK_TIERS.map((tier, index) => (
              <motion.button
                key={tier}
                onClick={() => handleBuyPack(tier)}
                disabled={tier > userCoins}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative w-28 h-36
                  glass
                  rounded-3xl
                  flex flex-col items-center justify-center
                  transition-all duration-300
                  overflow-hidden
                  ${tier <= userCoins
                    ? 'hover:shadow-glow cursor-pointer group'
                    : 'opacity-30 cursor-not-allowed'
                  }
                `}
                whileHover={tier <= userCoins ? { scale: 1.05, y: -5 } : {}}
                whileTap={tier <= userCoins ? { scale: 0.95 } : {}}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-ryoiki-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                {/* Price */}
                <span className="relative text-3xl font-display font-bold text-ryoiki-white group-hover:text-ryoiki-red transition-colors">
                  {tier}€
                </span>
                <span className="relative text-xs text-ryoiki-white/40 font-body mt-1">
                  Pack
                </span>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-ryoiki-red/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-16 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ryoiki-red/10 rounded-xl flex items-center justify-center">
              <span className="text-ryoiki-red font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold tracking-tight">ryōiki</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-ryoiki-white/40 font-body">
            <a href="#" className="link-underline hover:text-ryoiki-white transition-colors">Terms</a>
            <a href="#" className="link-underline hover:text-ryoiki-white transition-colors">Privacy</a>
            <a href="#" className="link-underline hover:text-ryoiki-white transition-colors">Discord</a>
            <a href="#" className="link-underline hover:text-ryoiki-white transition-colors">Twitter</a>
          </div>
          <div className="text-sm text-ryoiki-white/20 font-body">
            © 2025 ryōiki
          </div>
        </div>
      </footer>

      {/* Pack Opening Modal */}
      <PackOpening
        isOpen={isPackOpen}
        onClose={() => setIsPackOpen(false)}
        packTier={selectedPack}
        cards={mockCards}
      />
    </main>
  );
}
