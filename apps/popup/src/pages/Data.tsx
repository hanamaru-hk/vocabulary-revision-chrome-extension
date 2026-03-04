import { Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function Data() {
  const { t } = useTranslation();
  return <Title order={2}>{t('app.nav.data')}</Title>;
}

