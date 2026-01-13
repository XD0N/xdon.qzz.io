"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrefetchHandler() {
  const router = useRouter();

  useEffect(() => {
    // 首页加载完成后，利用浏览器空闲时间默默预加载
    // 这会提前缓存页面资源（JS/RSC Payload）
    router.prefetch("/projects");
    router.prefetch("/guestbook");
  }, [router]);

  return null; // 这个组件不需要渲染任何内容
}