"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
// 👇 1. 引入官方中文包
import { zhCN, enUS } from "@clerk/localizations";
// 👇 2. 引入我们的语言状态库
import { useLanguageStore } from "@/lib/store";
import { useEffect, useState } from "react";

// 👇 3. 定义你的【英文】自定义文案
const customEn = {
  signUp: {
    start: {
      title: "Sign Up",
      subtitle: "Create an account",
    },
  },
  signIn: {
    start: {
      title: "Welcome Back",
      subtitle: "Sign in to xdon.qzz.io",
    },
  },
};

// 👇 4. 定义你的【中文】自定义文案
const customZh = {
  signUp: {
    start: {
      title: "注册账号",
      subtitle: "创建一个新账户",
    },
  },
  signIn: {
    start: {
      title: "欢迎回来",
      subtitle: "登录到 xdon.qzz.io",
    },
  },
};

export default function ClerkProviderWrapper({ children }) {
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 👇 5. 核心逻辑：根据语言合并配置
  // 如果是中文：使用官方 zhCN + 你的 customZh
  // 如果是英文：使用默认 (enUS) + 你的 customEn
  const localization =
    mounted && lang === "zh"
      ? { ...zhCN, ...customZh } // 把官方汉化和你的自定义汉化合并
      : { ...enUS, ...customEn };

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        // 你可以在这里进一步定制按钮颜色等
        variables: { colorPrimary: "#ffffff" } 
      }}
      localization={localization}
    >
      {children}
    </ClerkProvider>
  );
}