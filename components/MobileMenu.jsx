"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";
import { navigationItems } from "./Navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// 👇 1. 引入 store 和 dictionary
import { useLanguageStore } from "@/lib/store";
import { dictionary } from "@/lib/dictionary";

export function MobileMenu() {
  const pathname = usePathname();
  const page = pathname.split("/").slice(0, 2)[1];
  const [open, setOpen] = useState(false);
  
  // 👇 2. 获取当前语言状态
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(false);
  }, [pathname]);

  // 👇 3. 获取对应的翻译字典
  const t = mounted ? dictionary[lang].navbar : dictionary.en.navbar;

  return (
    <Sheet open={open} onOpenChange={(state) => setOpen(state)}>
      <SheetTrigger asChild>
        <Button className="bg-secondary text-muted-foreground shadow-[0_0px_3px_0.5px_#2f2f2f] hover:bg-[#f2f2f20d] rounded-full pr-2">
          <span className="pr-1">
            {/* 👇 4. 修复按钮上的文字：如果是首页显示字典里的 home，否则显示对应页面的翻译 */}
            {pathname === "/" ? t.home : (t[page] || page)}
          </span>
          <ChevronDown size={15} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="mt-10 ml-6 mr-10 border-none text-muted-foreground rounded-xl bg-background/80 backdrop-blur-md"
        side="top"
      >
        <ul className="flex flex-col pl-5 mt-5 space-y-1">
          {navigationItems.map((item, index) => {
            const isSelected = pathname === item.href;
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    "block w-full py-3 text-lg font-semibold transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* 👇 5. 修复列表文字：使用字典里的 key 进行匹配 */}
                  {t[item.key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}