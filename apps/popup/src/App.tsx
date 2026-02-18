import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ApplicationShell } from './components/AppShell/AppShell';
import { Vocabulary } from './pages/Vocabulary';
import { Settings } from './pages/Settings';
import { Welcome } from './pages/Welcome';
import { useEffect, useState } from 'react';
import { Config, getConfig } from '@repo/config';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';

function App() {
    const { i18n } = useTranslation();

    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        getConfig().then((config) => {
            setConfig(config);
            if (config.language && config.language !== i18n.language) {
                i18n.changeLanguage(config.language);
            }
        })

        const listener = (changes: any, namespace: string) => {
            if (namespace === 'local' && changes.config) {
                setConfig(changes.config.newValue);
            }
        }

        chrome.storage.onChanged.addListener(listener);
        return () => chrome.storage.onChanged.removeListener(listener);
    }, [])

    return (
        <>
            {
                config ?
                    <ApplicationShell showHeader={!config.firstTime}>
                        <Routes>
                            <Route path="/" element={<Navigate to={config.firstTime ? '/welcome' : '/vocabulary'} replace />} />
                            <Route path="/vocabulary" element={<Vocabulary />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/welcome" element={<Welcome />} />
                        </Routes>
                    </ApplicationShell> : <LoadingOverlay visible />
            }
        </>
    );
}

export default App;
