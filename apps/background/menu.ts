import { getConfig } from '@/packages/config';
import { addVocabulary } from '@repo/database';
import { v4 as uuidv4 } from 'uuid';

export const createMenu = (title: string) => {
    chrome.contextMenus.create({
        type: 'normal',
        contexts: ['selection'],
        title: title,
        id: 'vocabulary-revision-lite'
    });
};

export const addMenuEventListeners = (i18n: any) => {
    chrome.contextMenus.onClicked.addListener(
        async (info) => {
            if (info.menuItemId !== 'vocabulary-revision-lite') {
                return;
            }
            const text = info.selectionText;
            const url = await new Promise<string>(resolve => chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => resolve(tabs[0] ? (tabs[0].url || '') : '')));

            if (text) {
                await addVocabulary({
                    id: uuidv4(),
                    word: text,
                    url: url,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            const config = await getConfig();
            if (config.newTab) {
                chrome.tabs.create(
                    {
                        url: `https://www.perplexity.ai/search/new?q=${encodeURIComponent(text || '')}`
                    },
                    () => { }
                );
            }
        }
    );

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.config) {
            const newLanguage = changes.config.newValue.language;
            if (newLanguage && newLanguage !== i18n.language) {
                i18n.changeLanguage(newLanguage).then(() => {
                    chrome.contextMenus.update('vocabulary-revision-lite', {
                        title: i18n.t('app.common.context_menu')
                    })
                });
            }
        }
    });
};