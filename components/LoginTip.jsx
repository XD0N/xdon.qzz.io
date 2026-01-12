"use client";
import { useTranslation } from "@/hooks/useTranslation";

export default function LoginTip() {
  const t = useTranslation('messagePage');
  
  return (
    <div className="flex items-center justify-start h-20 px-10 pr-2 text-sm rounded-lg bg-secondary text-muted-foreground">
       {/* 使用字典里的文字 */}
       {t.loginTip}
    </div>
  );
}