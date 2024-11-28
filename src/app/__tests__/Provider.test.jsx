import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import App from '@/app/Provider';

vi.mock('next-auth/react', () => {
  return {
    SessionProvider: ({ children }) =>
      React.createElement('div', { 'data-testid': 'session-provider' }, children),
  };
});

vi.mock('@nextui-org/react', () => {
  return {
    NextUIProvider: ({ children }) =>
      React.createElement('div', { 'data-testid': 'nextui-provider' }, children),
  };
});

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
