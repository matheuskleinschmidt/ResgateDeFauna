// src/app/__tests__/App.component.test.jsx
import { render, screen } from '@testing-library/react';
import App from '@/app/components/HomeList'; // Ajuste o caminho conforme necessário
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dos componentes do @nextui-org/react
vi.mock('@nextui-org/react', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  CardBody: ({ children }) => <div data-testid="card-body">{children}</div>,
  Link: ({ href, children }) => <a data-testid="link" href={href}>{children}</a>,
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve renderizar todos os cards com os links corretos', () => {
    render(<App />);

    // Verifica se quatro cards são renderizados
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(4);

    // Define os textos e hrefs esperados
    const expectedLinks = [
      { text: 'Adicionar resgate', href: '/pages/rescue/addRescue' },
      { text: 'Listar resgates', href: '/pages/rescue' },
      { text: 'Relatórios', href: '/pages/reports' },
      { text: 'Configurações', href: '/pages/configurations' },
    ];

    // Verifica cada link
    expectedLinks.forEach(({ text, href }) => {
      const linkElement = screen.getByText(text);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', href);
    });
  });

  it('deve ter links navegáveis com hrefs corretos', () => {
    render(<App />);

    const links = screen.getAllByTestId('link');
    expect(links).toHaveLength(4);

    // Define os textos e hrefs esperados
    const expectedLinks = [
      { text: 'Adicionar resgate', href: '/pages/rescue/addRescue' },
      { text: 'Listar resgates', href: '/pages/rescue' },
      { text: 'Relatórios', href: '/pages/reports' },
      { text: 'Configurações', href: '/pages/configurations' },
    ];

    // Verifica cada link
    expectedLinks.forEach(({ text, href }) => {
      const linkElement = screen.getByText(text).closest('a');
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', href);
    });
  });

  it('deve aplicar as classes CSS corretas aos cards', () => {
    render(<App />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(4);

    cards.forEach(card => {
      expect(card).toHaveClass('w-full', 'max-w-xs', 'mb-4');
    });
  });

  it('deve corresponder ao snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
