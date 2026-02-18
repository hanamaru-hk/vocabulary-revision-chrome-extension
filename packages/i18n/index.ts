import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zhHK from "./locales/zh-hk.json";

export { i18n };

export const defaultNS = "translation";
export const resources = {
    en: {
        translation: en,
    },
    "zh-HK": {
        translation: zhHK,
    },
} as const;

export function initI18nReact() {
    i18n.use(initReactI18next).init({
        lng: "en", // default language
        fallbackLng: "en",
        resources,
        defaultNS,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });
}

export function initI18nVanilla() {
    // Cloning instance to avoid side effects if needed, but usually single instance is fine for background script
    const i18nInstance = i18n.createInstance();
    i18nInstance.init({
        lng: "en",
        fallbackLng: "en",
        resources,
        defaultNS,
        interpolation: {
            escapeValue: false
        }
    });
    return i18nInstance;
}
