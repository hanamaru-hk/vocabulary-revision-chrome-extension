import { Table, ScrollArea, Pagination, Button, ActionIcon, Modal, Group, Text, Title } from '@mantine/core';
import { IconTrash, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { getVocabulary, deleteWord, Vocabulary as VocabularyType } from '@repo/database';
import { useEffect, useState } from 'react';
import { getConfig, llmLink, getLookupPrompt } from '@repo/config';

const CSV_COLUMNS = ['id', 'word', 'url', 'createdAt', 'updatedAt'] as const;

function escapeCsvCell(value: string): string {
    if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

function vocabularyToCsvRows(items: VocabularyType[]): string {
    const header = CSV_COLUMNS.join(',');
    const rows = items.map((item) =>
        CSV_COLUMNS.map((col) => {
            const raw = col === 'createdAt' || col === 'updatedAt'
                ? new Date(item[col]).toISOString()
                : String(item[col as keyof VocabularyType] ?? '');
            return escapeCsvCell(raw);
        }).join(',')
    );
    return [header, ...rows].join('\n');
}

function downloadCsv(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function Vocabulary() {
    const { i18n, t } = useTranslation();
    const [vocabulary, setVocabulary] = useState<VocabularyType[]>([]);
    const [activePage, setPage] = useState(1);
    const itemsPerPage = 10;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const refresh = () => getVocabulary().then(setVocabulary);

    useEffect(() => {
        refresh();
    }, []);

    const totalPages = Math.ceil(vocabulary.length / itemsPerPage);
    const paginatedVocabulary = vocabulary.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const handleLookup = async (word: string) => {
        const config = await getConfig();
        chrome.tabs.create(
            {
                url: `${llmLink[config.llm]}${encodeURIComponent(getLookupPrompt(i18n, word || '', true, config.treatAs)) || ''} `
            },
            () => { }
        );
    }

    const handleRemove = (id: string) => {
        setPendingDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDeleteId) return;
        await deleteWord(pendingDeleteId);
        setConfirmOpen(false);
        setPendingDeleteId(null);
        refresh();
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setPendingDeleteId(null);
    };

    const handleExport = async () => {
        const all = await getVocabulary();
        const csv = vocabularyToCsvRows(all);
        const filename = `word-notebook-export-${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCsv(csv, filename);
    };

    const rows = paginatedVocabulary.map((vocab) => (
        <Table.Tr key={vocab.id}>
            <Table.Td>{vocab.word}</Table.Td>
            <Table.Td>
                <a href={vocab.url} target="_blank" rel="noreferrer">
                    {t('app.to')}
                </a>
            </Table.Td>
            <Table.Td>
                <ActionIcon
                    variant="subtle"
                    aria-label={t('app.vocabulary.table.lookup')}
                    onClick={() => handleLookup(vocab.word)}
                >
                    <IconSearch size={16} />
                </ActionIcon>
            </Table.Td>
            <Table.Td>
                <ActionIcon
                    variant="subtle"
                    color="red"
                    aria-label={t('app.vocabulary.table.remove')}
                    onClick={() => handleRemove(vocab.id)}
                >
                    <IconTrash size={16} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ))
        ;

    return (
        <>
            <Button variant="light" size="sm" mb="md" onClick={handleExport}>
                {t('app.vocabulary.export')}
            </Button>
            <Modal
                opened={confirmOpen}
                onClose={handleCancelDelete}
                title={t('app.vocabulary.delete.title')}
                centered
            >
                <Text mb="sm">{t('app.vocabulary.delete.confirm_message')}</Text>
                <Group justify="flex-end">
                    <Button variant="default" size="xs" onClick={handleCancelDelete}>
                        {t('app.vocabulary.delete.cancel')}
                    </Button>
                    <Button color="red" size="xs" onClick={handleConfirmDelete}>
                        {t('app.vocabulary.delete.confirm')}
                    </Button>
                </Group>
            </Modal>
            <ScrollArea h={350} offsetScrollbars>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('app.vocabulary.table.word')}</Table.Th>
                            <Table.Th>{t('app.vocabulary.table.url')}</Table.Th>
                            <Table.Th>{t('app.vocabulary.table.lookup')}</Table.Th>
                            <Table.Th>{t('app.vocabulary.table.remove')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    {
                        rows.length > 0 ? (
                            <Table.Tbody>{rows}</Table.Tbody>
                        ) :
                            <Table.Tbody><Table.Tr>
                                <Table.Td colSpan={4} ta='center'>
                                    <p><Title order={3}>{t('app.vocabulary.table.no_data')}</Title></p>
                                    <p><Text>{t('app.vocabulary.table.no_data_hint')}</Text></p>
                                </Table.Td>
                            </Table.Tr></Table.Tbody>
                    }
                </Table>
            </ScrollArea>
            <Pagination total={totalPages} value={activePage} onChange={setPage} mt="sm" />
        </>
    );
}
