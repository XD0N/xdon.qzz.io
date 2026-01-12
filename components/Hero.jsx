"use client"; // 👈 1. 必须加

import HeroAnimation from "./HeroAnimation";
import Socials from "./Socials";
import { useTranslation } from "@/hooks/useTranslation"; // 👈 2. 引入翻译工具

export default function Hero() {
  const t = useTranslation('hero'); // 👈 3. 获取 hero 分类的翻译

  return (
    <div>
      <p className="mb-6 font-semibold">
        <span className="text-transparent sm:bg-gradient-to-r to-foreground bg-gradient-to-t from-muted-foreground bg-clip-text lg:text-[54px] text-[40px]">
          {t.greeting}
        </span>
      </p>
      
      <div className="h-10 mb-8 sm:mb-10">
        {/* 👇 这里的文字也变成了动态的 */}
        <HeroAnimation text1={t.text1} text2={t.text2} />
      </div>

      <p className="mb-8 text-xl text-transparent sm:mb-10 sm:text-[26px] bg-gradient-to-r from-green-200 via-green-100 opacity-60 to-green-200 bg-clip-text w-fit">
        {t.tags}
      </p>

      <p className="mb-4 text-sm text-transparent sm:mb-6 sm:text-base bg-gradient-to-b to-muted-foreground from-foreground bg-clip-text">
        {t.description}
      </p>

      <Socials />
    </div>
  );
}