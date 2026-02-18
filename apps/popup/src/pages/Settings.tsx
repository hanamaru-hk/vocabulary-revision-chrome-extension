import { Container, Title, Select, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { defaultConfig, getConfig, setConfig } from '@repo/config';
import { useEffect, useState } from 'react';

export function Settings() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [openInNewTab, setOpenInNewTab] = useState<string>('true');

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

    const handleResetConfig = async () => {
        const confirmed = window.confirm(t('app.settings.reset.confirm'));
        if (!confirmed) return;

        await setConfig(defaultConfig);
        await i18n.changeLanguage(defaultConfig.language);
        navigate('/');
    };

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

            <Button
                mt="xl"
                color="red"
                variant="outline"
                fullWidth
                onClick={handleResetConfig}
            >
                {t('app.settings.reset.button')}
            </Button>
        </Container>
    );
}
