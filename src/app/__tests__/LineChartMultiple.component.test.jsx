import { render, screen } from '@testing-library/react';
import Component from '@/app/components/LineChartMultiple';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }) => (
    <h2 data-testid="card-title" {...props}>
      {children}
    </h2>
  ),
  CardDescription: ({ children, ...props }) => (
    <p data-testid="card-description" {...props}>
      {children}
    </p>
  ),
  CardContent: ({ children, ...props }) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children, ...props }) => (
    <div data-testid="chart-container" {...props}>
      <div data-testid="responsive-container">{children}</div>
    </div>
  ),
  ChartTooltip: ({ children, ...props }) => (
    <div data-testid="chart-tooltip" {...props}>
      {children}
    </div>
  ),
  ChartTooltipContent: (props) => (
    <div data-testid="chart-tooltip-content" {...props}></div>
  ),
}));

vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    LineChart: ({ children, ...props }) => (
      <div data-testid="line-chart" {...props}>
        {children}
      </div>
    ),
    Line: ({ dataKey, stroke, strokeWidth, ...props }) => (
      <div
        data-testid="line"
        data-key={dataKey}
        data-stroke={stroke}
        data-stroke-width={strokeWidth}
        {...props}
      >
        Line
      </div>
    ),
    XAxis: ({ dataKey, tickFormatter, ...props }) => (
      <div
        data-testid="x-axis"
        data-key={dataKey}
        data-tick-formatter={tickFormatter}
        {...props}
      >
        XAxis
      </div>
    ),
    CartesianGrid: ({ vertical, ...props }) => (
      <div data-testid="cartesian-grid" data-vertical={vertical} {...props}>
        CartesianGrid
      </div>
    ),
    Legend: (props) => (
      <div data-testid="legend" {...props}>
        Legend
      </div>
    ),
  };
});

describe('AnimalRecordsChart', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockRescues = [
    { fullDate: '2023-01-15', animal: { species: 'Dog' } },
    { fullDate: '2023-01-20', animal: { species: 'Cat' } },
    { fullDate: '2023-02-10', animal: { species: 'Dog' } },
    { fullDate: '2023-02-15', animal: { species: 'Rabbit' } },
    { fullDate: '2023-03-05', animal: null },
  ];

  const propertyPath = 'animal.species';
  const title = 'Relatório de Animais Resgatados';
  const description =
    'Gráfico mostrando a quantidade de animais resgatados por espécie e data.';

  it('deve renderizar o componente com título e descrição', () => {
    render(
      <Component
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByTestId('card-title')).toHaveTextContent(title);
    expect(screen.getByTestId('card-description')).toHaveTextContent(
      description
    );

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
  });

  it('deve processar os dados corretamente e renderizar as linhas correspondentes', () => {
    render(
      <Component
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    const lines = screen.getAllByTestId('line');
    expect(lines).toHaveLength(3);

    const expectedKeys = ['Dog', 'Cat', 'Rabbit'];
    expectedKeys.forEach((key, index) => {
      const line = lines[index];
      expect(line).toHaveAttribute('data-key', key);
      expect(line).toHaveAttribute(
        'data-stroke',
        `hsl(var(--chart-${index + 1}))`
      );
      expect(line).toHaveAttribute('data-stroke-width', '2');
    });
  });

  it('deve renderizar corretamente com dados vazios', () => {
    render(
      <Component
        rescues={[]}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.queryAllByTestId('line')).toHaveLength(0);
  });

  it('deve lidar com valores nulos ou indefinidos no propertyPath', () => {
    const dataWithNulls = [
      { fullDate: '2023-01-15', animal: null },
      { fullDate: '2023-01-20' },
      { fullDate: '2023-02-10', animal: { species: 'Dog' } },
    ];

    render(
      <Component
        rescues={dataWithNulls}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    const lines = screen.getAllByTestId('line');
    expect(lines).toHaveLength(1);

    expect(lines[0]).toHaveAttribute('data-key', 'Dog');
    expect(lines[0]).toHaveAttribute('data-stroke', `hsl(var(--chart-1))`);
    expect(lines[0]).toHaveAttribute('data-stroke-width', '2');
  });

  it('deve atribuir cores corretamente às linhas do gráfico', () => {
    render(
      <Component
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    const lines = screen.getAllByTestId('line');
    const expectedColors = [
      `hsl(var(--chart-1))`,
      `hsl(var(--chart-2))`,
      `hsl(var(--chart-3))`,
    ];

    lines.forEach((line, index) => {
      expect(line).toHaveAttribute('data-stroke', expectedColors[index]);
    });
  });

  it('deve corresponder ao snapshot', () => {
    const { container } = render(
      <Component
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
