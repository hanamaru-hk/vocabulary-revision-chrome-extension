import { createMenu, addMenuEventListeners } from './menu';
import { getConfig } from '@repo/config';
import { initI18nVanilla } from '@repo/i18n';

const i18n = initI18nVanilla();

const init = async () => {
    const config = await getConfig();
    await i18n.changeLanguage(config.language);
    createMenu(i18n.t('app.common.context_menu'));
};

chrome.runtime.onInstalled.addListener((_reason) => {
    init();
});

addMenuEventListeners(i18n);