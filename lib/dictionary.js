// lib/dictionary.js
export const dictionary = {
  en: {
    // 导航栏
    navbar: { home: "Home", blog: "Blog", project: "Project", message: "Message" },

    pageTitles: {
      blog: "Blog",          // 对应 page="Blog"
      projects: "Projects",   // 对应 page="Project"
      message: "Message Board",    // 对应 page="Message"
    },
    
    // 👇 (可选) 如果你想启用描述的翻译
    pageDescriptions: {
      blog: "Sharing my reflections and some beautiful writings..",
      projects: "Sharing some of the projects I've worked on.",
      message: "Feel free to say something!",
    },

    messagePage: {
       loginTip: "🔒 Please log in to leave a message",
    },

    messageform: {
       success: "Message sent successfully",
       error: "Failed to send message",
    },

    messageinput: {
       placeholder: "Leave a message",
       send: "Send"
    },
    
    // Hero 组件 (合并了你的两个版本)
    hero: {
      greeting: "Hi, I'm Xdon",
      role: "Creative Developer & Designer.",
      text1: "<Developer />",
      text2: "<Student />",
      tags: "#Michael #Xdon #旭东",
      description: "I'm Xdon Yang, a graduate student at Jiangsu University of Technology in Changzhou. I am passionate about developing intelligent solutions for 3D point cloud analysis.",
      btn_contact: "Contact Me", // 保留以防万一
      btn_resume: "Resume",      // 保留以防万一
    },

    // RecentUpdate 组件
    recentUpdate: {
      title: "Recent Updates",
      viewAll: "View All Blogs",
    },

    // BasicInfo 组件 (重要：合并了 music 和 cities)
    basicInfo: {
      title: "💡 About Me",
      intro: "👋 You can call me",
      location: "Location", // 旧版字段，保留以防万一
      email: "Email",       // 旧版字段，保留以防万一
      music: "Listening to: (Spotify API maintenance...)", // ✅ 必须保留这个给 Spotify 组件用
      
      // 新版字段
      locationLabel: "🌎 Current Location:",
      locationValue: "Changzhou, JiangSu, CN",
      livedLabel: "✈️ Lived in",
      livedSuffix: ", in the past.",
      cities: {
        yangzhou: "Yangzhou",
        nanjing: "Nanjing",
        xiamen: "Xiamen",
        shanghai: "Shanghai"
      }
    },

    // SkillsBar 组件
    skills: {
      title: "Tech Stack",
    },

    // Footer 组件 (✅ 修复：移到了最外层，不再在 basicInfo 里面)
    footer: {
      rights: "All rights reserved.",
      madeWith: "Made with love and 🍰",
    },

    

    signUp: {
      title: "Sign Up",
      subtitle: "Create an account",
    },

    signIn: {
      title: "Welcome Back",
      subtitle: "Sign in to xdon.qzz.io",
    },
  },

  zh: {
    // 导航栏
    navbar: { home: "首页", blog: "博客", project: "项目", message: "留言" },

    pageTitles: {
      blog: "我的博客",
      projects: "我的项目",
      message: "留言板",
    },

    // 👇 (可选) 中文描述
    pageDescriptions: {
      blog: "分享我的思考与美文。",
      projects: "分享我做过的的部分项目。",
      message: "想说什么，尽管畅所欲言！",
    },

    messagePage: {
       loginTip: "🔒 请先登录后再留言",
    },

    messageform: {
       success: "消息发送成功",
       error: "消息发送失败",
    },

    messageinput: {
       placeholder: "尽情留言吧！",
       send: "发送"
    },

    // Hero 组件 (合并版)
    hero: {
      greeting: "你好，我是 Xdon",
      role: "创意开发者 & 设计师。",
      text1: "<开发者 />",
      text2: "<学生 />",
      tags: "#Michael #Xdon #旭东",
      description: "我是杨旭东，常州江苏理工学院的一名研究生。我热衷于开发三维点云分析的智能解决方案。",
      btn_contact: "联系我",
      btn_resume: "我的简历",
    },

    // RecentUpdate 组件
    recentUpdate: {
      title: "最近更新",
      viewAll: "查看所有博客",
    },

    // BasicInfo 组件 (合并版)
    basicInfo: {
      title: "💡 关于我",
      intro: "👋 你可以叫我",
      location: "坐标",
      email: "邮箱",
      music: "正在听的歌：(Spotify 接口维护中...)", // ✅ 必须保留
      
      locationLabel: "🌎 现居：",
      locationValue: "中国江苏常州",
      livedLabel: "✈️ 曾居住于",
      livedSuffix: "。",
      cities: {
        yangzhou: "扬州",
        nanjing: "南京",
        xiamen: "厦门",
        shanghai: "上海"
      }
    },

    // SkillsBar 组件
    skills: {
      title: "技术栈",
    },

    // Footer 组件
    footer: {
      rights: "版权所有。",
      madeWith: "用爱与 🍰 制作",
    },


  }
};