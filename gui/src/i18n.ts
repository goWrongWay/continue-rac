import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// 初始化 i18n
i18n
  // 使用 http 后端加载翻译文件
  .use(HttpBackend)
  // 自动检测用户语言（从浏览器等途径）
  .use(LanguageDetector)
  // 连接 react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh-Hans', // 当检测不到用户语言时，使用中文简体作为后备语言
    debug: true, // 可以在开发时打开 debug 模式，方便查看 i18n 工作情况

    // 定义支持的语言
    supportedLngs: ['en', 'zh-Hans', 'zh-Hant', 'ja'],

    // 语言检测配置
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    // 配置资源文件的路径
    backend: {
      loadPath: `${window.vscMediaUrl}/locales/{{lng}}/translation.json`, // 翻译文件的路径
    },

    // 其他配置项
    interpolation: {
      escapeValue: false, // React 自动防止 XSS，所以不需要对翻译值转义
    },
  });

export default i18n;
