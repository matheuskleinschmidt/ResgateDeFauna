import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/app/components/NavBar'; 
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { signOut } from 'next-auth/react';

vi.mock('axios');
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

vi.mock('@nextui-org/react', () => ({
  Navbar: ({ children, ...props }) => <div data-testid="navbar" {...props}>{children}</div>,
  NavbarBrand: ({ children }) => <div data-testid="navbar-brand">{children}</div>,
  NavbarMenuToggle: ({ 'aria-label': ariaLabel }) => <button data-testid="navbar-menu-toggle" aria-label={ariaLabel} />,
  NavbarMenuItem: ({ children }) => <div data-testid="navbar-menu-item">{children}</div>,
  NavbarMenu: ({ children }) => <div data-testid="navbar-menu">{children}</div>,
  NavbarContent: ({ children, justify, align, css }) => <div data-testid="navbar-content" data-justify={justify} data-align={align} style={css}>{children}</div>,
  Link: ({ children, href, className, size }) => <a data-testid="link" href={href} className={className} data-size={size}>{children}</a>,
  NavbarItem: ({ children }) => <div data-testid="navbar-item">{children}</div>,
}));

vi.mock('./AcmeLogo.jsx', () => ({
  AcmeLogo: () => <div data-testid="acme-logo">AcmeLogo</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  const mockMenuItems = [
    { label: "Adicionar Resgate", href: "/pages/rescue/addRescue" },
    { label: "Listar resgates", href: "/pages/rescue" },  
    { label: "Mapas", href: "/pages/reports/maps" },
    { label: "Gráficos", href: "/pages/reports/charts" },
    { label: "Configurações", href: "/pages/configurations" },
  ];

  const mockUtilsData = {
    calledBys: [{ id: 1, name: 'Caller 1' }],
    procedureOrientationBys: [{ id: 2, name: 'Orientation 1' }],
    ageRanges: [{ id: 3, name: 'Age Range 1' }],
    situations: [{ id: 4, name: 'Situation 1' }],
    postRescues: [{ id: 5, name: 'Post Rescue 1' }],
    status: [{ id: 6, name: 'Status 1' }],
  };

  const mockSpeciesAndAnimalGroups = {
    species: [{ id: 1, name: 'Species 1' }],
    animalGroups: [{ id: 2, name: 'Animal Group 1' }],
  };

  it('deve renderizar a Navbar com todos os itens de menu', () => {
    render(
      <App />
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();

    mockMenuItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      const link = screen.getByText(item.label).closest('a');
      expect(link).toHaveAttribute('href', item.href);
    });

    expect(screen.getByText('Renovar cache')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('deve buscar e armazenar dados utils e speciesAndAnimalGroups no localStorage ao montar', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/dateUtil/auxiliaryInfos')) {
        return Promise.resolve({ data: mockUtilsData });
      }
      if (url.includes('/api/dateUtil/speciesAndAnimalGroups')) {
        return Promise.resolve({ data: mockSpeciesAndAnimalGroups });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <App />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${window.location.origin}/api/dateUtil/auxiliaryInfos`);
      expect(axios.get).toHaveBeenCalledWith(`${window.location.origin}/api/dateUtil/speciesAndAnimalGroups`);
    });

    expect(localStorage.getItem('utils')).toBe(JSON.stringify({
      calledBys: [{ key: '1', label: 'Caller 1' }],
      procedureOrientationBys: [{ key: '2', label: 'Orientation 1' }],
      ageRanges: [{ key: '3', label: 'Age Range 1' }],
      situations: [{ key: '4', label: 'Situation 1' }],
      postRescues: [{ key: '5', label: 'Post Rescue 1' }],
      status: [{ key: '6', label: 'Status 1' }],
    }));

    expect(localStorage.getItem('speciesAndAnimalGroups')).toBe(JSON.stringify(mockSpeciesAndAnimalGroups));
  });

  it('não deve buscar dados se já estão presentes no localStorage', () => {
    localStorage.setItem('utils', JSON.stringify({
      calledBys: [{ key: '1', label: 'Caller 1' }],
      procedureOrientationBys: [{ key: '2', label: 'Orientation 1' }],
      ageRanges: [{ key: '3', label: 'Age Range 1' }],
      situations: [{ key: '4', label: 'Situation 1' }],
      postRescues: [{ key: '5', label: 'Post Rescue 1' }],
      status: [{ key: '6', label: 'Status 1' }],
    }));
    localStorage.setItem('speciesAndAnimalGroups', JSON.stringify(mockSpeciesAndAnimalGroups));

    render(
      <App />
    );

    expect(axios.get).not.toHaveBeenCalled();
  });

  it('deve renovar o cache ao clicar no botão "Renovar cache"', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/dateUtil/auxiliaryInfos')) {
        return Promise.resolve({ data: mockUtilsData });
      }
      if (url.includes('/api/dateUtil/speciesAndAnimalGroups')) {
        return Promise.resolve({ data: mockSpeciesAndAnimalGroups });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <App />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    fireEvent.click(screen.getByText('Renovar cache'));

    await waitFor(() => {
      expect(localStorage.getItem('utils')).toBe(JSON.stringify({
        calledBys: [{ key: '1', label: 'Caller 1' }],
        procedureOrientationBys: [{ key: '2', label: 'Orientation 1' }],
        ageRanges: [{ key: '3', label: 'Age Range 1' }],
        situations: [{ key: '4', label: 'Situation 1' }],
        postRescues: [{ key: '5', label: 'Post Rescue 1' }],
        status: [{ key: '6', label: 'Status 1' }],
      }));
      expect(localStorage.getItem('speciesAndAnimalGroups')).toBe(JSON.stringify(mockSpeciesAndAnimalGroups));
      expect(axios.get).toHaveBeenCalledTimes(4); 
    });
  });

  it('deve chamar signOut ao clicar no botão "Sair"', () => {
    render(
      <App />
    );

    fireEvent.click(screen.getByText('Sair'));

    expect(signOut).toHaveBeenCalled();
  });

  it('deve corresponder ao snapshot', () => {
    axios.get.mockResolvedValue({ data: mockUtilsData });
    axios.get.mockResolvedValueOnce({ data: mockUtilsData });
    axios.get.mockResolvedValueOnce({ data: mockSpeciesAndAnimalGroups });

    const { container } = render(
      <App />
    );

    expect(container).toMatchSnapshot();
  });
});
