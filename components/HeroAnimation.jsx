"use client";

import React, { useState, useEffect, useRef } from "react";

export default function HeroAnimation({ text1, text2, speed = 100 }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typeStatus, setTypeStatus] = useState("typing");
  const [isText1, setIsText1] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  // 🚀 核心：使用 Ref 来缓存最新的文本，避免立即触发重绘
  const latestTexts = useRef({ text1, text2 });
  const [currentActiveTexts, setCurrentActiveTexts] = useState({ text1, text2 });

  // 监听外部语言切换
  useEffect(() => {
    // 更新引用，但不立即重置动画状态
    latestTexts.current = { text1, text2 };
  }, [text1, text2]);

  useEffect(() => {
    // 始终基于当前“激活”的文本进行操作
    const activeText = isText1 ? currentActiveTexts.text1 : currentActiveTexts.text2;

    const timeout = setTimeout(() => {
      // 1. 打字逻辑
      if (typeStatus === "typing" && currentIndex < activeText.length) {
        setDisplayText(activeText.slice(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      } 
      // 2. 删字逻辑
      else if (typeStatus === "deleting" && currentIndex > 0) {
        setDisplayText(activeText.slice(0, currentIndex - 1));
        setCurrentIndex((prev) => prev - 1);
      } 
      // 3. 打完字：停顿后准备删除
      else if (typeStatus === "typing" && currentIndex === activeText.length) {
        setTimeout(() => {
          setTypeStatus("deleting");
        }, 2000);
      } 
      // 4. 🚀 关键点：删完字了！在这里检查是否有语言更新
      else if (typeStatus === "deleting" && currentIndex === 0) {
        // 在这里把缓存的最新的语言同步到当前活跃文本中
        setCurrentActiveTexts(latestTexts.current);
        
        setTimeout(() => {
          setIsText1((prev) => !prev);
          setTypeStatus("typing");
        }, 500);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, typeStatus, currentActiveTexts, isText1, speed]);

  // 光标闪烁
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <p className="text-3xl sm:text-[42px] min-h-[1.5em] flex items-center">
      <span className="text-transparent sm:bg-gradient-to-r to-foreground bg-gradient-to-t to-70% from-muted-foreground bg-clip-text font-semibold">
        {displayText}
      </span>
      <span 
        className={`ml-1 transition-opacity duration-100 ${
          showCursor ? "opacity-100 text-muted-foreground" : "opacity-0"
        }`}
      >
        |
      </span>
    </p>
  );
}