// lib/store.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useLanguageStore = create(
  persist(
    (set) => ({
      lang: 'zh', // 默认语言
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'language-storage', // 存到浏览器缓存的名字
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)