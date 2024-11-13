import { render, screen } from '@testing-library/react';
import AnimalRecordsChart from '@/app/components/BarChartStackedLegend';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }) => <h2 data-testid="card-title">{children}</h2>,
  CardDescription: ({ children }) => <p data-testid="card-description">{children}</p>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }) => (
    <div data-testid="chart-container">
      <div data-testid="responsive-container">{children}</div>
    </div>
  ),
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content"></div>,
}));

vi.mock('recharts', () => {
  const OriginalRecharts = vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    BarChart: ({ children, ...props }) => <div data-testid="bar-chart" {...props}>{children}</div>,
    ResponsiveContainer: ({ children, ...props }) => <div data-testid="responsive-container" {...props}>{children}</div>,
    Bar: ({ fill, dataKey, stackId, ...props }) => (
      <div data-testid="bar" data-fill={fill} data-key={dataKey} {...props}>
        Bar
      </div>
    ),
    XAxis: ({ dataKey, ...props }) => <div data-testid="x-axis" {...props}></div>,
    YAxis: ({ ...props }) => <div data-testid="y-axis" {...props}></div>,
    Tooltip: ({ ...props }) => <div data-testid="tooltip" {...props}></div>,
    Legend: ({ ...props }) => <div data-testid="legend" {...props}></div>,
  };
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
const description = 'Gráfico mostrando a quantidade de animais resgatados por espécie e data.';

describe('AnimalRecordsChart', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve renderizar o componente com título e descrição', () => {
    render(
      <AnimalRecordsChart
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByTestId('card-title')).toHaveTextContent(title);
    expect(screen.getByTestId('card-description')).toHaveTextContent(description);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('deve processar os dados corretamente e renderizar as barras correspondentes', () => {
    render(
      <AnimalRecordsChart
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    const bars = screen.getAllByTestId('bar');
    expect(bars).toHaveLength(4);

    const expectedKeys = ['Dog', 'Cat', 'Rabbit', 'Unknown'];
    bars.forEach((bar, index) => {
      expect(bar).toHaveAttribute('data-key', expectedKeys[index]);
    });
  });

  it('deve renderizar corretamente com dados vazios', () => {
    render(
      <AnimalRecordsChart
        rescues={[]}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.queryAllByTestId('bar')).toHaveLength(0);
  });

  it('deve lidar com valores nulos ou indefinidos no propertyPath', () => {
    const dataWithNulls = [
      { fullDate: '2023-01-15', animal: null },
      { fullDate: '2023-01-20' }, 
      { fullDate: '2023-02-10', animal: { species: 'Dog' } },
    ];

    render(
      <AnimalRecordsChart
        rescues={dataWithNulls}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    const bars = screen.getAllByTestId('bar');
    expect(bars).toHaveLength(2);

    const expectedKeys = ['Unknown', 'Dog'];
    bars.forEach((bar, index) => {
      expect(bar).toHaveAttribute('data-key', expectedKeys[index]);
    });
  });

  it('deve atribuir cores corretamente às barras do gráfico', () => {
    render(
      <AnimalRecordsChart
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff8042",
      "#8dd1e1",
      "#a4de6c",
      "#d0ed57",
      "#d0ed57",
      "#a28fd0",
      "#ffbb28"
    ];

    const bars = screen.getAllByTestId('bar');
    const expectedKeys = ['Dog', 'Cat', 'Rabbit', 'Unknown'];

    bars.forEach((bar, index) => {
      const expectedColor = colors[index % colors.length];
      expect(bar).toHaveAttribute('data-fill', expectedColor);
      expect(bar).toHaveAttribute('data-key', expectedKeys[index]);
    });
  });
});
