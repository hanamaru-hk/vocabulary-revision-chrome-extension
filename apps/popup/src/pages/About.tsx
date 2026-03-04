import { Title, Text, Stack, ActionIcon } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export function About() {
  const { t } = useTranslation();
  return (
    <Stack gap="md">
      <Title order={2}>{t("app.nav.about")}</Title>
      <Text size="sm" c="dimmed">
        {t("app.nav.copyright", { year: new Date().getFullYear() })} {t("app.nav.owner")} <ActionIcon
          variant="transparent"
          size="xs"
          component="a"
          color="red"
          href="https://www.hanamaru.hk"
          target="_blank"
        >
          <IconLink />
        </ActionIcon>
      </Text>
      <Text size="xs" c="dimmed">
        {t("app.nav.disclaimer")}
      </Text>
    </Stack>
  );
}
