import { Container, Title, Select, Button, Modal, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { defaultConfig, getConfig, setConfig } from '@repo/config';
import { useEffect, useState } from 'react';

export function Settings() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [openInNewTab, setOpenInNewTab] = useState<string>('true');
    const [resetModalOpen, setResetModalOpen] = useState(false);

    useEffect(() => {
        getConfig().then((config) => {
            // Ensure config.newTab is a boolean, default to true if undefined
            setOpenInNewTab(config.newTab !== false ? 'true' : 'false');
        });
    }, [i18n]);

    const handleLanguageChange = async (value: string | null) => {
        const lang = value || 'en';
        await i18n.changeLanguage(lang);
        const config = await getConfig();
        await setConfig({ ...config, language: lang });
    };

    const handleNewTabChange = async (value: string | null) => {
        const isNewTab = value === 'true';
        setOpenInNewTab(value || 'true');
        const config = await getConfig();
        await setConfig({ ...config, newTab: isNewTab });
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
        <Container>
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
                label={t('app.settings.new_tab.label')}
                placeholder={t('app.settings.new_tab.placeholder')}
                data={[
                    { value: 'true', label: t('app.settings.new_tab.yes') },
                    { value: 'false', label: t('app.settings.new_tab.no') }
                ]}
                value={openInNewTab}
                onChange={handleNewTabChange}
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
        </Container>
    );
}
