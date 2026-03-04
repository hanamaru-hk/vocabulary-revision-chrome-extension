import { Title, Button, Modal, Group, Text, ScrollArea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { defaultConfig, setConfig } from '@repo/config';

export function Data() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [resetModalOpen, setResetModalOpen] = useState(false);

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
      <Title order={2} mb="md">{t('app.nav.data')}</Title>

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
