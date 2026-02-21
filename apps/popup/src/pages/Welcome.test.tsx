import { render, screen, fireEvent, waitFor } from '../test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Welcome } from '../pages/Welcome';

// Mock @repo/config so tests don't touch chrome.storage
vi.mock('@repo/config', () => ({
    getConfig: vi.fn().mockResolvedValue({
        llm: 'perplexity',
        language: 'en',
        newTab: true,
        firstTime: true,
    }),
    setConfig: vi.fn().mockResolvedValue(undefined),
    defaultConfig: {
        llm: 'perplexity',
        language: 'en',
        newTab: true,
        firstTime: true,
    },
}));

// Mock the image asset (not available in jsdom)
vi.mock('../../../manifest/word-notebook.webp', () => ({ default: 'word-notebook.webp' }));

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn().mockResolvedValue(undefined),
        },
    }),
}));

describe('Welcome page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the confirm button', () => {
        render(<Welcome />);
        expect(screen.getByRole('button', { name: 'app.welcome.confirm' })).toBeInTheDocument();
    });

    it('renders the language select label', () => {
        render(<Welcome />);
        expect(screen.getByText('app.settings.language.label')).toBeInTheDocument();
    });

    it('calls setConfig and navigates on confirm', async () => {
        const { getConfig, setConfig } = await import('@repo/config');
        render(<Welcome />);

        fireEvent.click(screen.getByRole('button', { name: 'app.welcome.confirm' }));

        await waitFor(() => {
            expect(getConfig).toHaveBeenCalled();
            expect(setConfig).toHaveBeenCalledWith(
                expect.objectContaining({ firstTime: false })
            );
        });
    });
});
