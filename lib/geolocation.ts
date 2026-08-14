export type CapturedLocation = {
  lat: number;
  lng: number;
  accuracy: number;
  capturedAt: string;
};

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function toCaptured(position: GeolocationPosition): CapturedLocation {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy,
    capturedAt: new Date(position.timestamp || Date.now()).toISOString(),
  };
}

function geolocationMessage(error: GeolocationPositionError | unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = Number((error as GeolocationPositionError).code);
    if (code === 1) {
      return "El permiso de ubicación está bloqueado. Activa la ubicación para este sitio en la configuración del navegador y vuelve a intentarlo.";
    }
    if (code === 2) {
      return "El teléfono no pudo determinar la ubicación. Activa el GPS/Servicios de ubicación, sal a un lugar con mejor señal y vuelve a intentarlo.";
    }
    if (code === 3) {
      return "La ubicación tardó demasiado en responder. Vuelve a intentarlo con el GPS activado.";
    }
  }
  return "No fue posible obtener una ubicación válida.";
}

export async function captureRequiredLocation(): Promise<CapturedLocation> {
  if (typeof window === "undefined") {
    throw new Error("La ubicación solo puede capturarse desde el navegador.");
  }
  if (!window.isSecureContext) {
    throw new Error("La ubicación GPS requiere una conexión HTTPS segura.");
  }
  if (!navigator.geolocation) {
    throw new Error("Este dispositivo o navegador no permite obtener la ubicación GPS.");
  }

  try {
    const first = await getPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });

    let best = first;

    if (first.coords.accuracy > 100) {
      try {
        const second = await getPosition({
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        });
        if (second.coords.accuracy < first.coords.accuracy) best = second;
      } catch {
        // Keep the first valid reading when the refinement attempt fails.
      }
    }

    return toCaptured(best);
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && Number((error as GeolocationPositionError).code) === 1) {
      throw new Error(geolocationMessage(error));
    }

    try {
      const fallback = await getPosition({
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30000,
      });
      return toCaptured(fallback);
    } catch (fallbackError) {
      throw new Error(geolocationMessage(fallbackError));
    }
  }
}
