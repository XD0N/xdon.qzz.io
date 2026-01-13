"use client";

import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import Navbar from "./Navbar";
import SignInAndOut from "./SignIn";
import GithubIcon from "@/public/icons/GithubIcon";
import Link from "next/link";

// 👇 1. 引入 store 和 react hooks
import { useLanguageStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const page = pathname.split("/").slice(0, 2).join("/");

  // 👇 2. 获取语言状态
  const { lang, setLang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  // 防止水合不匹配（Hydration Mismatch）
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="grid w-full grid-flow-col grid-cols-3 sm:grid-cols-4">
      <Avatar page={page} />

      {/* Navbar 内部如果有用到翻译，它会自动更新，这里不用管 */}
      <Navbar page={page} />

      <div className="flex items-center justify-end gap-2">
        {/* 👇 3. 语言切换按钮 (放在 Github 图标左边或右边) */}
        <button
          onClick={() => setLang(lang === "en" ? "zh" : "en")}
          className="flex items-center justify-center px-2 py-1 text-xs font-bold transition-all border border-gray-600 rounded-md hover:border-white hover:bg-white hover:text-black"
        >
          {/* 如果还没加载完，默认显示 CN (或者空)，防止闪烁 */}
          {mounted ? (lang === "en" ? "中文" : "English") : "中文"}
        </button>

        <Link
          href="https://github.com/XD0N"
          target="_blank"
          className="opacity-80 hover:opacity-100"
        >
          <GithubIcon />
        </Link>
        
        <SignInAndOut pathname={pathname} />
      </div>
    </header>
  );
}