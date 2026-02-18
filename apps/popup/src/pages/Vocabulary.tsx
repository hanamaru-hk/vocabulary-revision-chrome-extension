import { Table, ScrollArea } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { getAllVocabularies, Vocabulary as VocabularyType } from '@repo/database';
import { useEffect, useState } from 'react';

export function Vocabulary() {
    const { t } = useTranslation();
    const [vocabularies, setVocabularies] = useState<VocabularyType[]>([]);

    useEffect(() => {
        getAllVocabularies().then(setVocabularies);
    }, []);

    const rows = vocabularies.map((vocab) => (
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
    );
}
