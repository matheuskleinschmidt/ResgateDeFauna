import { render, screen } from '@testing-library/react';
import App from '@/app/components/HomeList';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(5);

    const expectedLinks = [
      { text: 'Adicionar resgate', href: '/pages/rescue/addRescue' },
      { text: 'Listar resgates', href: '/pages/rescue' },
      { text: 'Mapas', href: '/pages/reports/maps' },
      { text: 'Gráficos', href: '/pages/reports/charts' },
      { text: 'Configurações', href: '/pages/configurations' },
    ];

    expectedLinks.forEach(({ text, href }) => {
      const linkElement = screen.getByText(text);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', href);
    });
  });

  it('deve ter links navegáveis com hrefs corretos', () => {
    render(<App />);

    const links = screen.getAllByTestId('link');
    expect(links).toHaveLength(5);

    const expectedLinks = [
      { text: 'Adicionar resgate', href: '/pages/rescue/addRescue' },
      { text: 'Listar resgates', href: '/pages/rescue' },
      { text: 'Relatórios', href: '/pages/reports' },
      { text: 'Configurações', href: '/pages/configurations' },
    ];

    expectedLinks.forEach(({ text, href }) => {
      const linkElement = screen.getByText(text).closest('a');
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', href);
    });
  });

  it('deve aplicar as classes CSS corretas aos cards', () => {
    render(<App />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(5);

    cards.forEach(card => {
      expect(card).toHaveClass('w-full', 'max-w-xs', 'mb-4');
    });
  });

  it('deve corresponder ao snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
