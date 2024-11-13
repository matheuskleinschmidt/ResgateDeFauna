import { render, screen } from '@testing-library/react';
import Component from '@/app/components/AreaChartStacked';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }) => <h2 data-testid="card-title">{children}</h2>,
  CardDescription: ({ children }) => <p data-testid="card-description">{children}</p>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: () => <div data-testid="chart-tooltip"></div>,
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content"></div>,
}));

vi.mock('recharts', () => {
  const OriginalRecharts = vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    Area: ({ fill, stroke }) => (
      <div data-testid="area" style={{ fill, stroke }}>
        Area
      </div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    XAxis: () => <div data-testid="x-axis"></div>,
  };
});

const mockData = [
  { fullDate: '2023-01-15', category: 'A' },
  { fullDate: '2023-01-20', category: 'B' },
  { fullDate: '2023-02-10', category: 'A' },
  { fullDate: '2023-02-15', category: 'C' },
  { fullDate: '2023-03-05', category: null },
];

const propertyPath = 'category';
const title = 'Teste de Componente';
const description = 'Este é um teste para o componente de gráfico.';

describe('Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve renderizar o componente com título e descrição', () => {
    render(
      <Component
        data={mockData}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByTestId('card-title')).toHaveTextContent(title);
    expect(screen.getByTestId('card-description')).toHaveTextContent(description);

    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('area')).toHaveLength(4);
  });

  it('deve processar os dados corretamente e renderizar as áreas correspondentes', () => {
    render(
      <Component
        data={mockData}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getAllByTestId('area')).toHaveLength(4);
  });

  it('deve renderizar corretamente com dados vazios', () => {
    render(
      <Component
        data={[]}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.queryAllByTestId('area')).toHaveLength(0);
  });

  it('deve lidar com valores nulos ou indefinidos no propertyPath', () => {
    const dataWithNulls = [
      { fullDate: '2023-01-15', category: null },
      { fullDate: '2023-01-20' },
      { fullDate: '2023-02-10', category: 'A' },
    ];

    render(
      <Component
        data={dataWithNulls}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getAllByTestId('area')).toHaveLength(2);
  });

  it('deve atribuir cores corretamente às áreas do gráfico', () => {
    render(
      <Component
        data={mockData}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    const COLORS = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    const areas = screen.getAllByTestId('area');

    areas.forEach((area, index) => {
      const expectedColor = COLORS[index % COLORS.length];
      expect(area).toHaveStyle(`fill: ${expectedColor}`);
      expect(area).toHaveStyle(`stroke: ${expectedColor}`);
    });
  });

  it('deve corresponder ao snapshot', () => {
    const { container } = render(
      <Component
        data={mockData}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
