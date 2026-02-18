import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMenu, addMenuEventListeners } from '../menu';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('createMenu', () => {
    it('calls chrome.contextMenus.create with correct params', () => {
        createMenu('Look up word');

        expect(chrome.contextMenus.create).toHaveBeenCalledOnce();
        expect(chrome.contextMenus.create).toHaveBeenCalledWith({
            type: 'normal',
            contexts: ['selection'],
            title: 'Look up word',
            id: 'vocabulary-revision-lite',
        });
    });
});

describe('addMenuEventListeners', () => {
    it('registers a context menu click listener', () => {
        const i18nMock = { language: 'en', changeLanguage: vi.fn(), t: vi.fn() };
        addMenuEventListeners(i18nMock);

        expect(chrome.contextMenus.onClicked.addListener).toHaveBeenCalledOnce();
    });

    it('registers a storage change listener', () => {
        const i18nMock = { language: 'en', changeLanguage: vi.fn(), t: vi.fn() };
        addMenuEventListeners(i18nMock);

        expect(chrome.storage.onChanged.addListener).toHaveBeenCalledOnce();
    });

    it('updates context menu title when language changes in storage', async () => {
        const i18nMock = {
            language: 'en',
            changeLanguage: vi.fn().mockResolvedValue(undefined),
            t: vi.fn().mockReturnValue('查詞'),
        };

        addMenuEventListeners(i18nMock);

        // Get the storage change listener that was registered
        const storageListener = vi.mocked(chrome.storage.onChanged.addListener).mock.calls[0][0] as Function;

        // Simulate a language change in storage
        storageListener({ config: { newValue: { language: 'zh-HK' } } }, 'local');

        // Wait for the async changeLanguage to resolve
        await vi.waitFor(() => {
            expect(i18nMock.changeLanguage).toHaveBeenCalledWith('zh-HK');
        });
        await vi.waitFor(() => {
            expect(chrome.contextMenus.update).toHaveBeenCalledWith('vocabulary-revision-lite', {
                title: '查詞',
            });
        });
    });
});
