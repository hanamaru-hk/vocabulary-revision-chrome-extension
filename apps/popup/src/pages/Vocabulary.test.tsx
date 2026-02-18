import { render, screen, waitFor } from '../test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Vocabulary } from '../pages/Vocabulary';

// Mock @repo/database so tests don't touch IndexedDB
vi.mock('@repo/database', () => ({
    getAllVocabularies: vi.fn().mockResolvedValue([
        {
            id: '1',
            word: 'ephemeral',
            url: 'https://example.com',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
        },
        {
            id: '2',
            word: 'serendipity',
            url: 'https://example.org',
            createdAt: new Date('2024-01-02'),
            updatedAt: new Date('2024-01-02'),
        },
    ]),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' },
    }),
}));

describe('Vocabulary page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders table headers', async () => {
        render(<Vocabulary />);
        await waitFor(() => {
            expect(screen.getByText('app.vocabulary.table.word')).toBeInTheDocument();
            expect(screen.getByText('app.vocabulary.table.url')).toBeInTheDocument();
            expect(screen.getByText('app.vocabulary.table.created_at')).toBeInTheDocument();
        });
    });

    it('renders vocabulary words from the database', async () => {
        render(<Vocabulary />);
        await waitFor(() => {
            expect(screen.getByText('ephemeral')).toBeInTheDocument();
            expect(screen.getByText('serendipity')).toBeInTheDocument();
        });
    });

    it('renders an empty table when there are no vocabularies', async () => {
        const { getAllVocabularies } = await import('@repo/database');
        vi.mocked(getAllVocabularies).mockResolvedValueOnce([]);

        render(<Vocabulary />);

        await waitFor(() => {
            expect(screen.queryByText('ephemeral')).not.toBeInTheDocument();
        });
    });
});
