import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@/app/components/theme-provider';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }) => (
    <div data-testid="next-themes-provider" {...props}>
      {children}
    </div>
  ),
}));

describe('ThemeProvider Component', () => {
  it('deve renderizar o componente ThemeProvider com children e props', () => {
    render(
      <ThemeProvider attribute="class">
        <div data-testid="child">Child Component</div>
      </ThemeProvider>
    );

    const provider = screen.getByTestId('next-themes-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toHaveAttribute('attribute', 'class');
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
