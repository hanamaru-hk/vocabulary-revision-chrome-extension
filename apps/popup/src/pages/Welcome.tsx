import { Button, Center, Container, Select, Title, Stack, Image, ScrollArea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { getConfig, setConfig } from '@repo/config';
import { useNavigate } from 'react-router-dom';
import wordNotebook from '../../../manifest/word-notebook.jpg';

export function Welcome() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const handleLanguageChange = async (value: string | null) => {
        const lang = value || 'en';
        await i18n.changeLanguage(lang);
    };

    const handleConfirm = async () => {
        const config = await getConfig();
        await setConfig({ ...config, firstTime: false, language: i18n.language });
        navigate('/vocabulary');
    };

    return (
        <Container h="100%">
            <Center h="100%">
                <ScrollArea>
                    <Stack align="center" gap="lg">
                        <Image src={wordNotebook} alt="Word Notebook" w={280} radius="xl" />
                        <Select
                            label={t('app.settings.language.label')}
                            placeholder={t('app.settings.language.placeholder')}
                            data={[{ value: 'en', label: t('app.settings.language.name.en') }, { value: 'zh-HK', label: t('app.settings.language.name.zh-HK') }]}
                            value={i18n.language}
                            onChange={handleLanguageChange}
                        />
                        <Button onClick={handleConfirm}>{t('app.welcome.confirm')}</Button>
                    </Stack>
                </ScrollArea>
            </Center>
        </Container>
    );
}
