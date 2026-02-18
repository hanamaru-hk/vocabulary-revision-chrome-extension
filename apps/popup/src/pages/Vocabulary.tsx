import { Table, ScrollArea, Pagination } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { getAllVocabularies, Vocabulary as VocabularyType } from '@repo/database';
import { useEffect, useState } from 'react';

export function Vocabulary() {
    const { t } = useTranslation();
    const [vocabularies, setVocabularies] = useState<VocabularyType[]>([]);
    const [activePage, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        getAllVocabularies().then(setVocabularies);
    }, []);

    const totalPages = Math.ceil(vocabularies.length / itemsPerPage);
    const paginatedVocabularies = vocabularies.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const rows = paginatedVocabularies.map((vocab) => (
        <Table.Tr key={vocab.id}>
            <Table.Td>{vocab.word}</Table.Td>
            <Table.Td>
                <a href={vocab.url} target="_blank" rel="noreferrer">
                    {t('app.to')}
                </a>
            </Table.Td>
            <Table.Td>{new Date(vocab.createdAt).toLocaleDateString()}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <ScrollArea h={350} offsetScrollbars>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('app.vocabulary.table.word')}</Table.Th>
                            <Table.Th>{t('app.vocabulary.table.url')}</Table.Th>
                            <Table.Th>{t('app.vocabulary.table.created_at')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </ScrollArea>
            <Pagination total={totalPages} value={activePage} onChange={setPage} mt="sm" />
        </>
    );
}
