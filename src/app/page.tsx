'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Zap, Users, Package, TrendingUp, ChevronRight, Sparkles, Play, Instagram, ShieldCheck } from 'lucide-react';
import { BoxCard } from '@/components/BoxCard';
import { PackOpening } from '@/components/PackOpening';
import { AuthModal, type UserData } from '@/components/AuthModal';
import { PACKS, type PackData } from '@/lib/packs-data';

// Mock Data for boxes
const MOCK_BOXES = [
  {
    id: '1',
    name: 'Prismatic Evolutions',
    description: 'Booster Box — 36 Packs',
    imageUrl: '/packs/prismatic-evolutions.png',
    targetPrice: 400,
    currentRaised: 312,
    contributorsCount: 23,
    status: 'FUNDING' as const,
    scheduledBreak: new Date(Date.now() + 86400000 * 2),
    isTrending: true,
  },
  {
    id: '2',
    name: 'Rising Heroes',
    description: 'Elite Trainer Box',
    imageUrl: '/packs/heroes-ascendentes.png',
    targetPrice: 85,
    currentRaised: 85,
    contributorsCount: 12,
    status: 'READY' as const,
  },
  {
    id: '3',
    name: 'Obsidian Flames',
    description: 'Booster Box — 36 Packs',
    imageUrl: '/packs/black-flame.png',
    targetPrice: 150,
    currentRaised: 67,
    contributorsCount: 8,
    status: 'FUNDING' as const,
    scheduledBreak: new Date(Date.now() + 86400000 * 5),
  },
];

const STATS = [
  { label: 'Breakers', value: '0', icon: Users },
  { label: 'Packs Disponibles', value: '6', icon: Package },
  { label: 'Total Abierto', value: '$0', icon: TrendingUp },
];

export default function HomePage() {
  const [isPackOpen, setIsPackOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<PackData | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const handleContribute = async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Contributed ${amount} coins`);
  };

  const handleBuyPack = (pack: PackData) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedPack(pack);
    setIsPackOpen(true);
  };

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
  };

  const scrollToPacks = () => {
    document.getElementById('packs-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-4 py-2.5 glass rounded-full">
                  <div className="w-8 h-8 bg-ryoiki-red/20 rounded-full flex items-center justify-center">
                    <span className="text-ryoiki-red font-display font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-ryoiki-white">{user.name}</span>
                </div>
                <button
                  onClick={() => setUser(null)}
                  className="text-sm text-ryoiki-white/50 hover:text-ryoiki-red transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="btn-primary"
              >
                Entrar
              </button>
            )}
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
            <Instagram className="w-4 h-4 text-ryoiki-red" />
            <span className="text-sm font-medium text-ryoiki-white/80">Directos en @s4sf__</span>
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

          {/* Description - How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="text-xl md:text-2xl text-ryoiki-white/60 font-body font-light leading-relaxed mb-6">
              Compra sobres de Pokémon y los abrimos{' '}
              <span className="text-ryoiki-white font-medium">en directo</span> en Instagram.
            </p>

            {/* How it works steps */}
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-4 rounded-2xl"
              >
                <div className="w-8 h-8 bg-ryoiki-red/20 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-ryoiki-red font-display font-bold">1</span>
                </div>
                <h3 className="font-display font-bold text-ryoiki-white mb-1">Elige tu sobre</h3>
                <p className="text-sm text-ryoiki-white/50">Selecciona entre nuestros packs disponibles</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass p-4 rounded-2xl"
              >
                <div className="w-8 h-8 bg-ryoiki-red/20 rounded-xl flex items-center justify-center mb-3">
                  <Play className="w-4 h-4 text-ryoiki-red" />
                </div>
                <h3 className="font-display font-bold text-ryoiki-white mb-1">Directo en Instagram</h3>
                <p className="text-sm text-ryoiki-white/50">Cada viernes a las 20:00h abrimos tus sobres</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass p-4 rounded-2xl"
              >
                <div className="w-8 h-8 bg-ryoiki-red/20 rounded-xl flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4 text-ryoiki-red" />
                </div>
                <h3 className="font-display font-bold text-ryoiki-white mb-1">Recibe tus cartas</h3>
                <p className="text-sm text-ryoiki-white/50">Te enviamos lo que salga o véndelo en tu perfil</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats - Modern Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-4 md:gap-6 mb-14"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass px-6 py-4 rounded-3xl min-w-[120px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
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

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              onClick={scrollToPacks}
              className="btn-primary flex items-center justify-center gap-2 group text-base mx-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              Abrir Sobres
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ===== PACKS SECTION ===== */}
      <section id="packs-section" className="relative py-24 px-6 z-10">
        {/* Abstract background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ryoiki-red/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
            >
              <Package className="w-4 h-4 text-ryoiki-red" />
              <span className="text-sm font-medium text-ryoiki-white/60">Sobres Disponibles</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Elige tu <span className="gradient-text">Sobre</span>
            </h2>
            <p className="text-ryoiki-white/50 max-w-xl mx-auto font-body text-lg">
              Compra un sobre y lo abriremos en directo el próximo viernes.
              <br />
              <span className="text-ryoiki-white/70">¡Todas las cartas son tuyas!</span>
            </p>
          </div>

          {/* Packs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PACKS.map((pack, index) => (
              <motion.button
                key={pack.id}
                onClick={() => handleBuyPack(pack)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="
                  relative
                  glass
                  rounded-3xl
                  p-4
                  flex flex-col items-center
                  transition-all duration-300
                  overflow-hidden
                  hover:shadow-glow cursor-pointer group
                "
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Featured badge */}
                {pack.featured && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-ryoiki-red rounded-full text-[10px] font-bold">
                    HOT
                  </div>
                )}

                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-ryoiki-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                {/* Pack Image */}
                <div className="relative w-full aspect-[2/3] mb-3">
                  <img
                    src={pack.image}
                    alt={pack.name}
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(255,0,0,0.5)] transition-all duration-300"
                  />
                </div>

                {/* Pack Info */}
                <div className="relative text-center w-full">
                  <h3 className="font-display font-bold text-sm text-ryoiki-white truncate">
                    {pack.name}
                  </h3>
                  <p className="text-[10px] text-ryoiki-white/40 mb-2 truncate">
                    {pack.set}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-1 py-2 px-3 bg-ryoiki-red/20 rounded-xl group-hover:bg-ryoiki-red/30 transition-colors">
                    <span className="text-lg font-display font-bold text-ryoiki-red">
                      ${pack.price}
                    </span>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-ryoiki-red/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INFO SECTION - Sales Policy ===== */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-red rounded-4xl p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-ryoiki-red/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-ryoiki-red" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-ryoiki-white mb-2">
                  ¿Quieres vender tus cartas?
                </h3>
                <p className="text-ryoiki-white/70 mb-4">
                  Si te toca una carta que no quieres quedarte, podemos venderla por ti.
                  La pondremos en tu perfil al precio que nos indiques.
                </p>
                <div className="space-y-2 text-sm text-ryoiki-white/60">
                  <p>
                    • Solo cartas obtenidas en nuestros directos
                  </p>
                  <p>
                    • Comisión: <span className="text-ryoiki-red font-semibold">1%</span> + gastos de envío
                  </p>
                  <p>
                    • No se aceptan cartas externas
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
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
            <a href="#" className="link-underline hover:text-ryoiki-white transition-colors">Términos</a>
            <a href="#" className="link-underline hover:text-ryoiki-white transition-colors">Privacidad</a>
            <a
              href="https://instagram.com/s4sf__"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline hover:text-ryoiki-white transition-colors flex items-center gap-1"
            >
              <Instagram className="w-4 h-4" />
              @s4sf__
            </a>
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
        packTier={selectedPack?.price || 6}
        packImage={selectedPack?.image}
        packName={selectedPack?.name}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
}
