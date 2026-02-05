'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, User, Mail, Phone, Info, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserData) => void;
}

export interface UserData {
  name: string;
  contact: string;
  contactType: 'email' | 'phone';
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Introduce tu nombre');
      return;
    }

    if (!contact.trim()) {
      setError('Introduce un email o teléfono');
      return;
    }

    setIsLoading(true);

    // Simulate auth
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    onSuccess({ name, contact, contactType });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setContact('');
    setError('');
    setMode('login');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ryoiki-black/95 backdrop-blur-xl p-4"
        >
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-ryoiki-white/50 hover:text-ryoiki-red transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="glass rounded-4xl p-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-ryoiki-red/20 rounded-2xl flex items-center justify-center">
                  <span className="text-ryoiki-red font-display font-bold text-2xl">R</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-display font-bold text-center text-ryoiki-white mb-2">
                {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-center text-ryoiki-white/50 text-sm mb-6">
                {mode === 'login'
                  ? 'Accede a tu cuenta de ryōiki'
                  : 'Únete a la comunidad'}
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-ryoiki-white/60 mb-2">Nombre</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ryoiki-white/30" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="input-modern w-full pl-12"
                    />
                  </div>
                </div>

                {/* Contact Type Toggle */}
                <div>
                  <label className="block text-sm text-ryoiki-white/60 mb-2">Contacto</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setContactType('email')}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        contactType === 'email'
                          ? 'bg-ryoiki-red text-white'
                          : 'glass text-ryoiki-white/60 hover:text-ryoiki-white'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactType('phone')}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        contactType === 'phone'
                          ? 'bg-ryoiki-red text-white'
                          : 'glass text-ryoiki-white/60 hover:text-ryoiki-white'
                      }`}
                    >
                      Teléfono
                    </button>
                  </div>

                  <div className="relative">
                    {contactType === 'email' ? (
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ryoiki-white/30" />
                    ) : (
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ryoiki-white/30" />
                    )}
                    <input
                      type={contactType === 'email' ? 'email' : 'tel'}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={contactType === 'email' ? 'tu@email.com' : '+34 600 000 000'}
                      className="input-modern w-full pl-12"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-ryoiki-red rounded-2xl font-display font-bold text-white disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Procesando...
                    </span>
                  ) : mode === 'login' ? (
                    'Entrar'
                  ) : (
                    'Crear Cuenta'
                  )}
                </motion.button>
              </form>

              {/* Toggle Mode */}
              <p className="text-center text-ryoiki-white/50 text-sm mt-6">
                {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-ryoiki-red font-semibold ml-1 hover:underline"
                >
                  {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                </button>
              </p>

              {/* Info Box - Sales Policy */}
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 glass-red rounded-2xl"
                >
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-ryoiki-red flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-ryoiki-white/70 space-y-2">
                      <p className="font-semibold text-ryoiki-white">Venta de cartas</p>
                      <p>
                        Solo puedes vender cartas que hayas obtenido en nuestros directos.
                        Las pondremos en tu perfil al precio que nos indiques.
                      </p>
                      <p className="text-ryoiki-white/50">
                        Comisión: <span className="text-ryoiki-red">1%</span> + gastos de envío
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
