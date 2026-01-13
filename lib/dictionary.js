// lib/dictionary.js
export const dictionary = {
  en: {
    // 导航栏
    navbar: { home: "Home", blog: "Blog", project: "Project", message: "Message" },

    pageTitles: {
      blog: "Blog",
      projects: "Projects",
      message: "Message Board",
    },
    
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
      send: "Send",
      replyPlaceholder: "Write a reply...", // 🚀 新增：回复时的占位符
      reply: "Reply", // 🚀 新增：回复按钮文本
    },

    // 🚀 新增：专门用于 MessageItem 组件内部的交互翻译
    messageItem: {
      reply: "Reply",
      delete: "Delete",
      like: "Like",
      liked: "Liked",
      deleteConfirm: "Are you sure you want to delete this message?",
      viewAll: "View all {count} replies",
      collapse: "Collapse replies",
      replyTo: "Reply to",
    },

    comment: {
      title: "Comments",
      placeholder: "Write a comment...",
      replyPlaceholder: "Reply to {name}...",
      postBtn: "Post Comment",
      replyBtn: "Reply",
      sendBtn: "Send",
      loading: "Submitting...",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this comment?",
      viewAll: "View all {count} replies",
      collapse: "Collapse",
      replyTo: "Reply to",
      like: "Like",
      liked: "Liked",
      success: "Comment posted successfully!",
      error: "Action failed, please try again",
    },
    
    hero: {
      greeting: "Hi, I'm Xdon",
      role: "Creative Developer & Designer.",
      text1: "<Developer />",
      text2: "<Student />",
      tags: "#Michael #Xdon #旭东",
      description: "I'm Xdon Yang, a graduate student at Jiangsu University of Technology in Changzhou. I am passionate about developing intelligent solutions for 3D point cloud analysis.",
      btn_contact: "Contact Me",
      btn_resume: "Resume",
    },

    recentUpdate: {
      title: "Recent Updates",
      viewAll: "View All Blogs",
    },

    basicInfo: {
      title: "💡 About Me",
      intro: "👋 You can call me",
      location: "Location",
      email: "Email",
      music: "Listening to: (Spotify API maintenance...)",
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

    skills: {
      title: "Tech Stack",
    },

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
      send: "发送",
      replyPlaceholder: "写下你的回复...", // 🚀 新增
      reply: "回复", // 🚀 新增
    },

    // 🚀 新增：中文交互翻译
    messageItem: {
      reply: "回复",
      delete: "删除",
      like: "赞",
      liked: "已赞",
      deleteConfirm: "确定要删除这条留言吗？",
      viewAll: "查看全部 {count} 条回复",
      collapse: "收起回复",
      replyTo: "回复",
    },

    comment: {
      title: "文章评论",
      placeholder: "写下你的想法...",
      replyPlaceholder: "回复 {name}...",
      postBtn: "发表评论",
      replyBtn: "回复",
      sendBtn: "发送",
      loading: "提交中...",
      delete: "删除",
      deleteConfirm: "确定要删除这条评论吗？此操作不可逆。",
      viewAll: "查看全部 {count} 条回复",
      collapse: "收起回复",
      replyTo: "回复",
      like: "赞",
      liked: "已赞",
      success: "评论发布成功！",
      error: "操作失败，请重试",
    },

    hero: {
      greeting: "你好，我是 Xdon",
      role: "创意开发者 & 设计师。",
      text1: "<开发者 />",
      text2: "<学生 />",
      tags: "#Michael #Xdon #旭东",
      description: "我是杨旭东，江苏理工学院的一名在读研究生。研究方向为三维点云数据的智能分析与处理。",
      btn_contact: "联系我",
      btn_resume: "我的简历",
    },

    recentUpdate: {
      title: "最近更新",
      viewAll: "查看所有博客",
    },

    basicInfo: {
      title: "💡 关于我",
      intro: "👋 你可以叫我",
      location: "坐标",
      email: "邮箱",
      music: "",
      
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

    skills: {
      title: "技术栈",
    },

    footer: {
      rights: "版权所有。",
      madeWith: "用爱与 🍰 制作",
    },
  }
};