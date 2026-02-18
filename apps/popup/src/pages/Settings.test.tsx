import { render, screen, waitFor } from '../test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Settings } from '../pages/Settings';

vi.mock('@repo/config', () => ({
    getConfig: vi.fn().mockResolvedValue({
        llm: 'perplexity',
        language: 'en',
        newTab: true,
        firstTime: false,
    }),
    setConfig: vi.fn().mockResolvedValue(undefined),
    defaultConfig: {
        llm: 'perplexity',
        language: 'en',
        newTab: true,
        firstTime: true,
    },
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn().mockResolvedValue(undefined),
        },
    }),
}));

describe('Settings page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the settings title', () => {
        render(<Settings />);
        expect(screen.getByText('app.settings.title')).toBeInTheDocument();
    });

    it('renders the language select label', async () => {
        render(<Settings />);
        await waitFor(() => {
            expect(screen.getByText('app.settings.language.label')).toBeInTheDocument();
        });
    });

    it('renders the new tab select label', async () => {
        render(<Settings />);
        await waitFor(() => {
            expect(screen.getByText('app.settings.new_tab.label')).toBeInTheDocument();
        });
    });

    it('renders the reset config button', () => {
        render(<Settings />);
        expect(screen.getByRole('button', { name: 'app.settings.reset.button' })).toBeInTheDocument();
    });

    it('calls setConfig with defaultConfig when reset is confirmed', async () => {
        const { setConfig, defaultConfig } = await import('@repo/config');
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        render(<Settings />);
        screen.getByRole('button', { name: 'app.settings.reset.button' }).click();

        await waitFor(() => {
            expect(setConfig).toHaveBeenCalledWith(defaultConfig);
        });
    });

    it('does not call setConfig when reset is cancelled', async () => {
        const { setConfig } = await import('@repo/config');
        vi.spyOn(window, 'confirm').mockReturnValue(false);

        render(<Settings />);
        screen.getByRole('button', { name: 'app.settings.reset.button' }).click();

        await waitFor(() => {
            expect(setConfig).not.toHaveBeenCalled();
        });
    });
});
