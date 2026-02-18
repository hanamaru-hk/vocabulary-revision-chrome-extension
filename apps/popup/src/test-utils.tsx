import { render, type RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';

/**
 * Custom render that wraps components with all required providers:
 * - MantineProvider (required by all Mantine UI components)
 * - MemoryRouter (required by react-router-dom hooks like useNavigate)
 */
const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <MantineProvider>
        <MemoryRouter>{children}</MemoryRouter>
    </MantineProvider>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
