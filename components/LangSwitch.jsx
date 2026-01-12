// components/LangSwitch.jsx
"use client";
import { useLanguageStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function LangSwitch() {
  const { lang, setLang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 手动同步状态，防止服务端渲染不一致
    useLanguageStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      className="px-3 py-1 ml-2 text-xs font-bold transition-all border border-gray-500 rounded-full hover:bg-white hover:text-black"
    >
      {lang === 'en' ? 'CN' : 'EN'}
    </button>
  );
}