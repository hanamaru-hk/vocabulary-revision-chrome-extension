import { Container, Title, Select, Button, Modal, Group, Text, ScrollArea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { defaultConfig, getConfig, setConfig, LLMType } from '@repo/config';
import { useEffect, useState } from 'react';

const LLM_OPTIONS = [
    { value: LLMType.perplexity, labelKey: 'app.settings.llm.name.perplexity' },
    { value: LLMType.googleAI, labelKey: 'app.settings.llm.name.googleAI' },
    { value: LLMType.google, labelKey: 'app.settings.llm.name.google' },
] as const;

export function Settings() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [llm, setLlm] = useState<string>(LLMType.perplexity);
    const [openInNewTab, setOpenInNewTab] = useState<string>('true');
    const [treatAs, setTreatAs] = useState<string>('false');
    const [resetModalOpen, setResetModalOpen] = useState(false);

    useEffect(() => {
        getConfig().then((config) => {
            setLlm(config.llm ?? LLMType.perplexity);
            setOpenInNewTab(config.newTab !== false ? 'true' : 'false');
            setTreatAs(config.treatAs);
        });
    }, [i18n]);

    const handleLanguageChange = async (value: string | null) => {
        const lang = value || 'en';
        await i18n.changeLanguage(lang);
        const config = await getConfig();
        await setConfig({ ...config, language: lang });
    };

    const handleLlmChange = async (value: string | null) => {
        const next = (value as LLMType) || LLMType.perplexity;
        setLlm(next);
        const config = await getConfig();
        await setConfig({ ...config, llm: next });
    };

    const handleNewTabChange = async (value: string | null) => {
        const isNewTab = value === 'true';
        setOpenInNewTab(value || 'true');
        const config = await getConfig();
        await setConfig({ ...config, newTab: isNewTab });
    };

    const handleWordsAsJapaneseChange = async (value: string | null) => {
        setTreatAs(value || '');
        const config = await getConfig();
        await setConfig({ ...config, treatAs: value || '' });
    };

    const handleResetClick = () => setResetModalOpen(true);

    const handleResetConfirm = async () => {
        await setConfig(defaultConfig);
        await i18n.changeLanguage(defaultConfig.language);
        setResetModalOpen(false);
        navigate('/');
    };

    const handleResetCancel = () => setResetModalOpen(false);

    return (
        <ScrollArea>
            <Title order={2} mb="md">{t('app.settings.title')}</Title>
            <Select
                label={t('app.settings.language.label')}
                placeholder={t('app.settings.language.placeholder')}
                data={[{ value: 'en', label: t('app.settings.language.name.en') }, { value: 'zh-HK', label: t('app.settings.language.name.zh-HK') }]}
                value={i18n.language}
                onChange={handleLanguageChange}
            />
            <Select
                mt="md"
                label={t('app.settings.llm.label')}
                placeholder={t('app.settings.llm.placeholder')}
                data={LLM_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                value={llm}
                onChange={handleLlmChange}
            />
            <Select
                mt="md"
                label={t('app.settings.new_tab.label')}
                placeholder={t('app.settings.new_tab.placeholder')}
                data={[
                    { value: 'true', label: t('app.settings.new_tab.record_and_lookup') },
                    { value: 'false', label: t('app.settings.new_tab.record') }
                ]}
                value={openInNewTab}
                onChange={handleNewTabChange}
            />
            <Select
                mt="md"
                label={t('app.settings.treat_as.label')}
                placeholder={t('app.settings.treat_as.placeholder')}
                data={[
                    { value: 'japanese', label: t('app.settings.treat_as.japanese') },
                    { value: 'not_specified', label: t('app.settings.treat_as.not_specified') }
                ]}
                value={treatAs}
                onChange={handleWordsAsJapaneseChange}
            />

            <Modal
                opened={resetModalOpen}
                onClose={handleResetCancel}
                title={t('app.settings.reset.title')}
                centered
            >
                <Text mb="sm">{t('app.settings.reset.confirm')}</Text>
                <Group justify="flex-end">
                    <Button variant="default" size="xs" onClick={handleResetCancel}>
                        {t('app.settings.reset.cancel')}
                    </Button>
                    <Button color="red" size="xs" onClick={handleResetConfirm}>
                        {t('app.settings.reset.confirm_button')}
                    </Button>
                </Group>
            </Modal>

            <Button
                mt="xl"
                color="red"
                variant="outline"
                fullWidth
                onClick={handleResetClick}
            >
                {t('app.settings.reset.button')}
            </Button>
        </ScrollArea>
    );
}
