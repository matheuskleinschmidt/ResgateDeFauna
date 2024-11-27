import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RescuePage from '@/app/pages/rescue/page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import React from 'react';

vi.mock('axios');

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/components/ui/select', () => {
  const Select = ({ children, value, onValueChange }) => {
    return (
      <div data-testid="select">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { value, onValueChange })
        )}
      </div>
    );
  };
  const SelectTrigger = ({ children }) => <div data-testid="select-trigger">{children}</div>;
  const SelectContent = ({ children, value, onValueChange }) => (
    <div data-testid="select-content">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
  const SelectItem = ({ children, value: itemValue, onValueChange }) => (
    <div
      data-testid="select-item"
      data-value={itemValue}
      onClick={() => onValueChange(itemValue)}
    >
      {children}
    </div>
  );
  const SelectValue = ({ placeholder, value }) => (
    <div data-testid="select-value">{value || placeholder}</div>
  );

  return { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
});

vi.mock('@nextui-org/table', () => ({
  Table: ({ children, ...props }) => <table data-testid="table" {...props}>{children}</table>,
  TableHeader: ({ children }) => <thead data-testid="table-header">{children}</thead>,
  TableBody: ({ children, emptyContent }) => (
    <tbody data-testid="table-body">
      {children && React.Children.toArray(children).length > 0 ? children : <tr data-testid="empty-row"><td colSpan="4">{emptyContent}</td></tr>}
    </tbody>
  ),
  TableColumn: ({ children }) => <th>{children}</th>,
  TableRow: ({ children, ...props }) => <tr data-testid="table-row" {...props}>{children}</tr>,
  TableCell: ({ children }) => <td>{children}</td>,
}));

vi.mock('@nextui-org/react', () => ({
  Spinner: ({ size }) => <div data-testid="spinner" data-size={size}>Spinner</div>,
}));

vi.mock('moment-timezone', async () => {
  const moment = await vi.importActual('moment-timezone');
  return moment;
});

describe('RescuePage', () => {
  const mockRescues = [
    { id: 1, species: { commonName: 'Gato' }, situation: { name: 'Aguardando' }, calledBy: { name: 'Pessoa A' }, fullDate: '2024-09-17T08:49:00.000Z' },
    { id: 2, species: { commonName: 'Cachorro' }, situation: { name: 'Em andamento' }, calledBy: { name: 'Pessoa B' }, fullDate: '2024-09-20T10:30:00.000Z' },
    { id: 3, species: { commonName: 'Coelho' }, situation: { name: 'Finalizado' }, calledBy: { name: 'Pessoa C' }, fullDate: '2024-10-05T12:15:00.000Z' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('deve exibir o spinner enquanto carrega os dados', async () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    render(<RescuePage />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('deve renderizar o Select e a Table após carregar os dados', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRescues });

    render(<RescuePage />);

    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());

    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('select-value')).toHaveTextContent('Selecione o mês e ano');

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.getByTestId('table-body')).toBeInTheDocument();
  });

  
  it('deve lidar com erros na chamada à API', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erro na API'));

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<RescuePage />);

    await waitFor(() =>
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    );

    const emptyRow = screen.getByTestId('empty-row');
    expect(emptyRow).toBeInTheDocument();
    expect(emptyRow).toHaveTextContent('Não há registros salvos para o período selecionado.');

    expect(consoleErrorMock).toHaveBeenCalledWith('Erro ao fazer a requisição:', expect.any(Error));

    consoleErrorMock.mockRestore();
  });
});
