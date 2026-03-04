import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMenu, addMenuEventListeners } from '../menu';
import { i18n } from '@repo/i18n';

const MENU_ID = 'record_and_lookup';
/** Cast mock to full i18n type so we don't need to change menu.ts. */
const asI18n = (m: { language: string; changeLanguage: ReturnType<typeof vi.fn>; t: ReturnType<typeof vi.fn> }) =>
    m as unknown as typeof i18n;

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
            id: MENU_ID,
        });
    });
});

describe('addMenuEventListeners', () => {
    it('registers a context menu click listener', () => {
        const i18nMock = { language: 'en', changeLanguage: vi.fn(), t: vi.fn() };
        addMenuEventListeners(asI18n(i18nMock));

        expect(chrome.contextMenus.onClicked.addListener).toHaveBeenCalledOnce();
    });

    it('registers a storage change listener', () => {
        const i18nMock = { language: 'en', changeLanguage: vi.fn(), t: vi.fn() };
        addMenuEventListeners(asI18n(i18nMock));

        expect(chrome.storage.onChanged.addListener).toHaveBeenCalledOnce();
    });

    it('updates context menu title when language changes in storage', async () => {
        const i18nMock = {
            language: 'en',
            changeLanguage: vi.fn().mockResolvedValue(undefined),
            t: vi.fn().mockReturnValue('查詞'),
        };
        addMenuEventListeners(asI18n(i18nMock));

        const storageListener = vi.mocked(chrome.storage.onChanged.addListener).mock.calls[0][0] as Parameters<typeof chrome.storage.onChanged.addListener>[0];
        storageListener({ config: { newValue: { language: 'zh-HK' } } }, 'local');

        await vi.waitFor(() => {
            expect(i18nMock.changeLanguage).toHaveBeenCalledWith('zh-HK');
        });
        await vi.waitFor(() => {
            expect(chrome.contextMenus.update).toHaveBeenCalledWith(MENU_ID, {
                title: '查詞',
            });
        });
    });
});
