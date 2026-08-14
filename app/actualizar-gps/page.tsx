"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { captureRequiredLocation, CapturedLocation } from "@/lib/geolocation";

type Point = {
  id: string;
  name: string;
  city: string;
  department: string;
  latitude: number | null;
  longitude: number | null;
  location_accuracy_m: number | null;
};

export default function ActualizarGpsPage() {
  const router = useRouter();
  const [points, setPoints] = useState<Point[]>([]);
  const [pointId, setPointId] = useState("");
  const [location, setLocation] = useState<CapturedLocation | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      const { data, error } = await supabase
        .from("collection_points")
        .select("id,name,city,department,latitude,longitude,location_accuracy_m")
        .order("created_at", { ascending: true });
      if (error) {
        setMessage(error.message);
        return;
      }
      const list = (data || []) as Point[];
      setPoints(list);
      setPointId(list[0]?.id || "");
    }
    load();
  }, [router]);

  async function capture() {
    setBusy(true);
    setMessage("Solicitando ubicación del teléfono...");
    try {
      const result = await captureRequiredLocation();
      setLocation(result);
      setMessage(`GPS capturado con precisión aproximada de ${Math.round(result.accuracy)} m.`);
    } catch (error) {
      setLocation(null);
      setMessage(error instanceof Error ? error.message : "No se pudo obtener la ubicación GPS.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!pointId || !location) {
      setMessage("Primero selecciona un punto y captura su ubicación GPS.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    if (!supabase) {
      setMessage("No se pudo conectar con Supabase.");
      setBusy(false);
      return;
    }
    const { error } = await supabase
      .from("collection_points")
      .update({
        latitude: location.lat,
        longitude: location.lng,
        location_accuracy_m: location.accuracy,
        location_captured_at: location.capturedAt,
      })
      .eq("id", pointId);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Ubicación GPS guardada correctamente en el punto de acopio.");
      setPoints((current) => current.map((p) => p.id === pointId ? {
        ...p,
        latitude: location.lat,
        longitude: location.lng,
        location_accuracy_m: location.accuracy,
      } : p));
    }
    setBusy(false);
  }

  const selected = points.find((p) => p.id === pointId);

  return (
    <div className="panel narrow">
      <Link href="/dashboard">← Volver al panel</Link>
      <h1>Actualizar GPS del punto</h1>
      <p className="lead">La ubicación exacta es un dato operativo privado y se usa para fortalecer la trazabilidad del punto de acopio.</p>

      <div className="card form-grid">
        <div className="field full">
          <label>Punto de acopio</label>
          <select value={pointId} onChange={(e) => { setPointId(e.target.value); setLocation(null); }}>
            {points.map((point) => <option key={point.id} value={point.id}>{point.name} · {point.city}</option>)}
          </select>
        </div>

        {selected && (
          <div className="field full gps-box">
            <strong>Estado actual</strong>
            {selected.latitude != null && selected.longitude != null ? (
              <div className="gps-success">✓ Este punto ya tiene GPS{selected.location_accuracy_m != null ? ` · precisión aprox. ${Math.round(selected.location_accuracy_m)} m` : ""}</div>
            ) : (
              <div className="gps-warning">⚠ Este punto aún no tiene ubicación GPS.</div>
            )}
          </div>
        )}

        <div className="field full">
          <button type="button" className="btn btn-light" onClick={capture} disabled={busy}>
            {busy ? "Obteniendo GPS..." : "Capturar ubicación GPS actual"}
          </button>
        </div>

        {location && (
          <div className="field full gps-box">
            <div className="gps-success">✓ Ubicación lista · precisión aprox. {Math.round(location.accuracy)} m</div>
            <small>Latitud y longitud exactas se guardarán de forma privada.</small>
          </div>
        )}

        <div className="field full">
          <button type="button" className="btn btn-primary" onClick={save} disabled={busy || !location}>
            Guardar GPS del punto
          </button>
          {message && <p className="form-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
