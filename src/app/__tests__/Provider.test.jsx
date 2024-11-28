import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '@/app/Provider';

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

vi.mock('@nextui-org/react', () => ({
  NextUIProvider: ({ children }) => (
    <div data-testid="nextui-provider">{children}</div>
  ),
}));

describe('App Component', () => {
  it('deve renderizar o componente App com children', () => {
    render(
      <App>
        <div data-testid="child">Child Component</div>
      </App>
    );

    const sessionProvider = screen.getByTestId('session-provider');
    expect(sessionProvider).toBeInTheDocument();

    const nextUIProvider = screen.getByTestId('nextui-provider');
    expect(nextUIProvider).toBeInTheDocument();

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
