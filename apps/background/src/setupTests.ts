import { vi } from 'vitest';

// Mock the chrome global for all tests
const chromeMock = {
    runtime: {
        sendMessage: vi.fn(),
        onMessage: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
        onInstalled: {
            addListener: vi.fn(),
        },
    },
    storage: {
        local: {
            get: vi.fn(),
            set: vi.fn(),
        },
        onChanged: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
    },
    contextMenus: {
        create: vi.fn(),
        update: vi.fn(),
        onClicked: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
    },
    tabs: {
        query: vi.fn(),
        create: vi.fn(),
    },
};

global.chrome = chromeMock as unknown as typeof chrome;
