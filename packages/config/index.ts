
export interface Config {
    llm: string;
    language: string;
    newTab: boolean;
    firstTime: boolean;
}

const defaultConfig: Config = {
    llm: 'perplexity',
    language: 'en',
    newTab: true,
    firstTime: true
};

export const getConfig = (): Promise<Config> => {
    return new Promise((resolve) => {
        chrome.storage.local.get("config", (result) => {
            if (result.config) {
                resolve(result.config as Config);
            } else {
                resolve(defaultConfig);
            }
        });
    });
};

export const setConfig = (config: Config): Promise<void> => {
    return new Promise((resolve) => {
        chrome.storage.local.set({ config }, () => {
            resolve();
        });
    });
};
