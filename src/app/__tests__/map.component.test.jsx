import { render, screen } from '@testing-library/react';
import MapComponent from  '@/app/components/map';
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
  ChartTooltip: ({ children }) => <div data-testid="chart-tooltip">{children}</div>,
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content"></div>,
}));

vi.mock('rlayers', () => ({
  RMap: ({ children, ...props }) => <div data-testid="rmap">{children}</div>,
  ROSM: () => <div data-testid="rosm"></div>,
  RLayerVector: ({ children }) => <div data-testid="rlayervector">{children}</div>,
  RFeature: ({ geometry, children, ...props }) => (
    <div data-testid="rfeature" data-geometry={JSON.stringify(geometry)}>
      {children}
    </div>
  ),
  RStyle: {
    RStyle: ({ children }) => <div data-testid="rstyle">{children}</div>,
    RStroke: ({ color, lineCap, width }) => (
      <div data-testid="rstroke" data-color={color} data-linecap={lineCap} data-width={width}></div>
    ),
    RIcon: ({ src, anchor, rotateWithView, rotation, scale }) => (
      <div
        data-testid="ricon"
        data-src={src}
        data-anchor={JSON.stringify(anchor)}
        data-rotatewithview={rotateWithView}
        data-rotation={rotation}
        data-scale={scale}
      ></div>
    ),
    RText: ({ text, offsetY, fill, stroke }) => (
      <div
        data-testid="rtext"
        data-text={text}
        data-offsety={offsetY}
        data-fill={JSON.stringify(fill)}
        data-stroke={JSON.stringify(stroke)}
      >
        {text}
      </div>
    ),
  },
}));

vi.mock('ol/proj', () => ({
  fromLonLat: (coords) => coords,
}));

vi.mock('ol/geom', () => ({
  LineString: class {
    constructor(coords) {
      this.coords = coords;
    }
    getLength() {
      const [x1, y1] = this.coords[0];
      const [x2, y2] = this.coords[1];
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1000; 
    }
  },
  Point: class {
    constructor(coords) {
      this.coords = coords;
    }
  },
}));

vi.mock('ol/style', () => ({
  Fill: class {
    constructor(options) {
      this.color = options.color;
    }
  },
  Stroke: class {
    constructor(options) {
      this.color = options.color;
      this.width = options.width;
    }
  },
}));

import 'ol/ol.css';

describe('MapComponent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockRescues = [
    {
      id: 1,
      fullDate: '2023-01-15',
      locationCoordinates: { latitude: 40.7128, longitude: -74.006 },
      releaseLocationCoordinates: { latitude: 40.7138, longitude: -74.005 },
    },
    {
      id: 2,
      fullDate: '2023-01-20',
      locationCoordinates: { latitude: 34.0522, longitude: -118.2437 },
      releaseLocationCoordinates: { latitude: 34.0523, longitude: -118.2436 },
    },
    {
      id: 3,
      fullDate: '2023-02-10',
      locationCoordinates: { latitude: 51.5074, longitude: -0.1278 },
      releaseLocationCoordinates: { latitude: 51.5075, longitude: -0.1277 },
    },
    {
      id: 4,
      fullDate: '2023-02-15',
      locationCoordinates: { latitude: null, longitude: null }, 
      releaseLocationCoordinates: { latitude: 48.8566, longitude: 2.3522 },
    },
    {
      id: 5,
      fullDate: '2023-03-05',
      releaseLocationCoordinates: { latitude: 35.6895, longitude: 139.6917 },
    },
  ];

  const propertyPath = 'locationCoordinates';
  const title = 'Mapa de Resgates';
  const description = 'Visualização dos resgates no mapa.';

  it('deve exibir mensagem de carregamento quando rescues estão vazios', () => {
    render(
      <MapComponent
        rescues={[]}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByText('Carregando mapa...')).toBeInTheDocument();
  });

  it('deve exibir mensagem de carregamento quando rescues é undefined', () => {
    render(
      <MapComponent
        rescues={undefined}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByText('Carregando mapa...')).toBeInTheDocument();
  });

  it('deve renderizar o mapa e as features corretamente com rescues válidos', () => {
    render(
      <MapComponent
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByTestId('rmap')).toBeInTheDocument();
    expect(screen.getByTestId('rosm')).toBeInTheDocument();
    expect(screen.getByTestId('rlayervector')).toBeInTheDocument();

    const features = screen.getAllByTestId('rfeature');
    expect(features).toHaveLength(9);

    const featureId1 = features.find((feature) =>
      feature.getAttribute('data-geometry').includes('-74.006')
    );
    expect(featureId1).toBeInTheDocument();
  });

  it('deve não renderizar features para rescues com coordenadas inválidas', () => {
    const invalidRescues = [
      {
        id: 1,
        fullDate: '2023-01-15',
        locationCoordinates: { latitude: null, longitude: null },
        releaseLocationCoordinates: { latitude: 40.7138, longitude: -74.005 },
      },
      {
        id: 2,
        fullDate: '2023-01-20',
        locationCoordinates: { latitude: 34.0522, longitude: -118.2437 },
      },
    ];

    render(
      <MapComponent
        rescues={invalidRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    expect(screen.getByTestId('rmap')).toBeInTheDocument();

    const features = screen.queryAllByTestId('rfeature');
    expect(features).toHaveLength(0);
  });

  it('deve atribuir cores corretamente às linhas do gráfico', () => {
    render(
      <MapComponent
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );

    const strokes = screen.getAllByTestId('rstroke');
    expect(strokes).toHaveLength(3);

    strokes.forEach((stroke, index) => {
      const expectedColor = 'black';
      expect(stroke).toHaveAttribute('data-color', expectedColor);
      expect(stroke).toHaveAttribute('data-linecap', 'butt');
      expect(stroke).toHaveAttribute('data-width', '2');
    });
  });

  it('deve corresponder ao snapshot', () => {
    const { container } = render(
      <MapComponent
        rescues={mockRescues}
        propertyPath={propertyPath}
        title={title}
        description={description}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
