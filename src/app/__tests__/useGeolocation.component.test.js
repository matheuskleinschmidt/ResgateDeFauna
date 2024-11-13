import { renderHook, act } from '@testing-library/react';
import useGeolocation from './../components/useGeolocation'; 
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGeolocationSuccess = (latitude = 51.1, longitude = 45.3) => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn().mockImplementation((success, error, options) => {
      success({
        coords: {
          latitude,
          longitude,
        },
      });
    }),
  };
  global.navigator.geolocation = mockGeolocation;
};

const mockGeolocationError = (errorMessage = 'User denied Geolocation') => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn().mockImplementation((success, error, options) => {
      error({
        message: errorMessage,
      });
    }),
  };
  global.navigator.geolocation = mockGeolocation;
};

const mockGeolocationUnavailable = () => {
  delete global.navigator.geolocation;
};

describe('useGeolocation Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve inicializar com localização e erro nulos', () => {
    mockGeolocationUnavailable();
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.location).toEqual({ latitude: null, longitude: null });
    expect(result.current.error).toBeNull();
  });

  it('deve obter a localização com sucesso', async () => {
    mockGeolocationSuccess(40.7128, -74.0060);

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      const location = await result.current.getLocation();
      expect(location).toEqual({ latitude: 40.7128, longitude: -74.0060 });
    });

    expect(result.current.location).toEqual({ latitude: 40.7128, longitude: -74.0060 });
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro na obtenção da localização', async () => {
    mockGeolocationError('Permissão de localização negada');

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      try {
        await result.current.getLocation();
      } catch (e) {
        expect(e).toBe('Permissão de localização negada');
      }
    });

    expect(result.current.location).toEqual({ latitude: null, longitude: null });
    expect(result.current.error).toBe('Permissão de localização negada');
  });

  it('deve lidar com a ausência da API de geolocalização', async () => {
    mockGeolocationUnavailable();

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      try {
        await result.current.getLocation();
      } catch (e) {
        expect(e).toBe('Geolocation is not supported by your browser');
      }
    });

    expect(result.current.location).toEqual({ latitude: null, longitude: null });
    expect(result.current.error).toBe('Geolocation is not supported by your browser');
  });

  it('deve permitir múltiplas chamadas para getLocation', async () => {
    mockGeolocationSuccess(34.0522, -118.2437);

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      const location1 = await result.current.getLocation();
      expect(location1).toEqual({ latitude: 34.0522, longitude: -118.2437 });
    });

    expect(result.current.location).toEqual({ latitude: 34.0522, longitude: -118.2437 });
    expect(result.current.error).toBeNull();

    mockGeolocationSuccess(48.8566, 2.3522);

    await act(async () => {
      const location2 = await result.current.getLocation();
      expect(location2).toEqual({ latitude: 48.8566, longitude: 2.3522 });
    });

    expect(result.current.location).toEqual({ latitude: 48.8566, longitude: 2.3522 });
    expect(result.current.error).toBeNull();
  });
});
