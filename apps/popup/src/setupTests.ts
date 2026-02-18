import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom doesn't implement window.matchMedia — required by Mantine's color scheme detection
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// jsdom doesn't implement ResizeObserver — required by Mantine's ScrollArea
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// jsdom doesn't implement IntersectionObserver — required by some Mantine components
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock the chrome global for all popup tests
const chromeMock = {
    runtime: {
        sendMessage: vi.fn(),
        onMessage: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
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
};

global.chrome = chromeMock as unknown as typeof chrome;
