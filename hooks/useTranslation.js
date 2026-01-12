// hooks/useTranslation.js
"use client";
import { useLanguageStore } from '@/lib/store';
import { dictionary } from '@/lib/dictionary';
import { useState, useEffect } from 'react';

export function useTranslation(section) {
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 如果组件还没挂载完成，优先返回英文，防止报错
  if (!mounted) return dictionary.en[section];

  return dictionary[lang][section] || dictionary.en[section];
}