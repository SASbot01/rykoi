'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Lang } from './translations';

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType>({
  lang: 'es',
  toggleLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');

  const toggleLang = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
