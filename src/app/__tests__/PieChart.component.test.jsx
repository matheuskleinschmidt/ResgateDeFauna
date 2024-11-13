import { render, screen, fireEvent } from '@testing-library/react';
import PieChartComponent from '@/app/components/PieChart';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }) => <h2 data-testid="card-title">{children}</h2>,
  CardDescription: ({ children }) => <p data-testid="card-description">{children}</p>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ data, dataKey, nameKey, cx, cy, outerRadius, label, children }) => (
    <div
      data-testid="pie"
      data-data={JSON.stringify(data)}
      data-datakey={dataKey}
      data-namekey={nameKey}
      data-cx={cx}
      data-cy={cy}
      data-outerradius={outerRadius}
    >
      {children}
    </div>
  ),
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill}></div>,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="legend"></div>,
  Tooltip: ({ content }) => <div data-testid="tooltip">{content}</div>,
}));

describe('PieChartComponent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  const mockRescues = [
    { id: 1, fullDate: '2023-01-15', category: 'A' },
    { id: 2, fullDate: '2023-01-20', category: 'B' },
    { id: 3, fullDate: '2023-02-10', category: 'A' },
    { id: 4, fullDate: '2023-02-15', category: 'C' },
    { id: 5, fullDate: '2023-03-05', category: 'B' },
  ];

  const title = 'Distribuição de Categorias';
  const description = 'Gráfico de pizza mostrando a distribuição de categorias por mês.';
  const propertyPath = 'category';

  it('deve renderizar a mensagem de carregamento quando rescues estão vazios', () => {
    render(
      <PieChartComponent
        rescues={[]}
        title={title}
        description={description}
        propertyPath={propertyPath}
      />
    );

    expect(screen.getByText('Nenhum dado disponível para exibir o gráfico.')).toBeInTheDocument();
  });

  it('deve renderizar a seleção de mês e as opções corretamente', () => {
    render(
      <PieChartComponent
        rescues={mockRescues}
        title={title}
        description={description}
        propertyPath={propertyPath}
      />
    );

    const select = screen.getByLabelText('Filtrar por Mês:');
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Todos');
    expect(options[1]).toHaveTextContent('1/2023');
    expect(options[2]).toHaveTextContent('2/2023');
    expect(options[3]).toHaveTextContent('3/2023');
  });

  it('deve renderizar o gráfico de pizza com os dados corretos para "Todos"', () => {
    render(
      <PieChartComponent
        rescues={mockRescues}
        title={title}
        description={description}
        propertyPath={propertyPath}
      />
    );

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(3);
    expect(cells[0]).toHaveAttribute('data-fill', '#0088FE');
    expect(cells[1]).toHaveAttribute('data-fill', '#00C49F');
    expect(cells[2]).toHaveAttribute('data-fill', '#FFBB28');
  });

  it('deve filtrar os dados corretamente ao selecionar um mês específico', () => {
    render(
      <PieChartComponent
        rescues={mockRescues}
        title={title}
        description={description}
        propertyPath={propertyPath}
      />
    );

    const select = screen.getByLabelText('Filtrar por Mês:');
    fireEvent.change(select, { target: { value: '1/2023' } });

    const pie = screen.getByTestId('pie');
    const expectedData = [
      { name: 'A', value: 1 },
      { name: 'B', value: 1 },
    ];
    expect(pie).toHaveAttribute('data-data', JSON.stringify(expectedData));
  });

  it('deve corresponder ao snapshot', () => {
    const { container } = render(
      <PieChartComponent
        rescues={mockRescues}
        title={title}
        description={description}
        propertyPath={propertyPath}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
