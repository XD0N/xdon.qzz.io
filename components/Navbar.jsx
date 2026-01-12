"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
// 👇 LangSwitch 不需要引入了，但 Store 和 Dictionary 必须留着！
import { useLanguageStore } from "@/lib/store";
import { dictionary } from "@/lib/dictionary";
import { useState, useEffect } from "react";

// 这一段保持不变
export const navigationItems = [
  { name: "Home", href: "/", key: "home" },
  { name: "Blog", href: "/blog", key: "blog" },
  { name: "Project", href: "/project", key: "project" },
  { name: "Message", href: "/message", key: "message" },
];

export default function Navbar({ page }) {
  const { lang } = useLanguageStore(); // 👈 还是要获取语言状态
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = mounted ? dictionary[lang].navbar : dictionary.en.navbar;

  return (
    <>
      <div className="justify-center hidden col-span-2 mt-0.5 sm:flex h-14">
        {/* 👇 这里的 gap-1 不需要改，保持原样 */}
        <ul className="items-center justify-center hidden bg-[#f2f2f21a] rounded-full sm:flex px-2 py-1 gap-1">
          {navigationItems.map((item) => {
            const isSelected = page == item.href;
            return (
              <motion.li key={item.name} className="relative">
                {isSelected && (
                  <>
                    <motion.div
                      className="absolute left-1/4 w-1/2 mx-auto border-t-[3px] rounded-full shadow-[0_20px_100px_8px_#fff]"
                      layoutId="selected"
                    ></motion.div>
                    <motion.div
                      className="absolute top-0.5 bottom-0.5 w-full bg-[#f2f2f20d] rounded-full"
                      layoutId="selecteddiv"
                    ></motion.div>
                  </>
                )}
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ backgroundColor: "#f2f2f20d" }}
                    className={`px-4 py-3 rounded-full ${
                      item.key != "home" && item.key != "blog"
                        ? "tracking-tight"
                        : "tracking-widest"
                    } font-bold text-sm`}
                  >
                    {/* 👇 依然显示翻译后的文字 */}
                    {t[item.key]}
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
          
        </ul>
      </div>

      <div className="flex items-center justify-center sm:hidden">
        <MobileMenu />
      </div>
    </>
  );
}