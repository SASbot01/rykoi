'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, User, Mail, Lock, Info, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserData) => void;
}

export interface UserData {
  id: string;
  email: string;
  username: string;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Introduce tu email');
      return;
    }

    if (!password.trim()) {
      setError('Introduce tu contraseña');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (mode === 'register' && !username.trim()) {
      setError('Introduce tu nombre de usuario');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        // Register new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });

        if (authError) {
          if (authError.message.includes('already registered')) {
            setError('Este email ya está registrado');
          } else {
            setError(authError.message);
          }
          setIsLoading(false);
          return;
        }

        if (authData.user) {
          // Create user profile in our users table
          await supabase.from('users').insert({
            id: authData.user.id,
            email: email,
            username: username,
            pokeballs: 0,
          });

          onSuccess({
            id: authData.user.id,
            email: email,
            username: username,
          });
          handleClose();
        }
      } else {
        // Login existing user
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          if (authError.message.includes('Invalid login')) {
            setError('Email o contraseña incorrectos');
          } else {
            setError(authError.message);
          }
          setIsLoading(false);
          return;
        }

        if (authData.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('users')
            .select('username')
            .eq('id', authData.user.id)
            .single();

          onSuccess({
            id: authData.user.id,
            email: authData.user.email || email,
            username: profile?.username || email.split('@')[0],
          });
          handleClose();
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Error de conexión. Inténtalo de nuevo.');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setUsername('');
    setEmail('');
    setPassword('');
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
                {/* Username - only for register */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm text-ryoiki-white/60 mb-2">Usuario de Instagram</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ryoiki-white/30" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="@tu_usuario_instagram"
                        className="input-modern w-full pl-12"
                      />
                    </div>
                    {/* Instagram warning */}
                    <div className="mt-2 p-3 bg-ryoiki-red/20 border border-ryoiki-red/50 rounded-xl">
                      <p className="text-xs text-ryoiki-red font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-ryoiki-red rounded-full animate-pulse" />
                        ¡IMPORTANTE! Usa tu usuario de Instagram exacto
                      </p>
                      <p className="text-xs text-ryoiki-white/60 mt-1">
                        Lo necesitamos para verificar tu identidad y abrir tus sobres en directo.
                      </p>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm text-ryoiki-white/60 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ryoiki-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="input-modern w-full pl-12"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-ryoiki-white/60 mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ryoiki-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-modern w-full pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ryoiki-white/30 hover:text-ryoiki-white/60"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
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
