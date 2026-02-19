import { getConfig, getLookupPrompt, llmLink } from '@repo/config';
import { addWord } from '@repo/database';
import { v4 as uuidv4 } from 'uuid';
import { i18n } from '@repo/i18n';
import { resolve } from 'path';

type i18nType = typeof i18n;

const MENU_ID = 'record_and_lookup';

export const createMenu = (title: string): Promise<void> => {
    return new Promise((resolve) =>
        chrome.contextMenus.create({
            type: 'normal',
            contexts: ['selection'],
            title,
            id: MENU_ID
        }, () => { resolve() }))
};

export const addMenuEventListeners = (i18n: i18nType) => {
    chrome.contextMenus.onClicked.addListener(
        async (info) => {
            if (info.menuItemId !== MENU_ID) {
                return;
            }
            const text = info.selectionText;
            const url = await new Promise<string>(resolve => chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => resolve(tabs[0] ? (tabs[0].url || '') : '')));

            if (text) {
                await addWord({
                    id: uuidv4(),
                    word: text,
                    url: url,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            const config = await getConfig();
            if (!config) return;

            if (config.newTab) {
                chrome.tabs.create(
                    {
                        url: `${llmLink[config.llm]}${encodeURIComponent(getLookupPrompt(i18n, text || '', true, config.treatAs)) || ''} `
                    },
                    () => { }
                );
            }
        }
    );

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.config) {
            const languageChanged = changes.config.newValue.language && changes.config.newValue.language !== i18n.language
            const newTabChanged = (changes.config.newValue?.newTab || false) !== (changes.config.oldValue?.newTab || false)
            if (languageChanged || newTabChanged) {
                i18n.changeLanguage(changes.config.newValue.language).then(() => {
                    chrome.contextMenus.update(MENU_ID, {
                        title: changes.config.newValue.newTab ?
                            i18n.t('app.common.context_menu_lookup') :
                            i18n.t('app.common.context_menu_record')
                    })
                });
            }
        }
    });
};