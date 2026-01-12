"use client"; // 👈 1. 必须加

import { useTranslation } from "@/hooks/useTranslation"; // 👈 2. 引入钩子

export default function Footer() {
  const t = useTranslation('footer'); // 👈 3. 获取 footer 分类的翻译

  return (
    <div className="w-full mt-20 text-muted-foreground ">
      <div className="w-full border border-muted-foreground opacity-10 "></div>
      <div className="flex flex-col items-center justify-center h-24 gap-1 font-mono text-sm opacity-70">
        <p>
          {/* 年份和名字通常保持不变，只翻译 "All rights reserved" */}
          &copy; {new Date().getFullYear()} Xdon Yang. {t.rights}
        </p>
        <div className=" opacity-90">
          {t.madeWith}
        </div>
      </div>
    </div>
  );
}