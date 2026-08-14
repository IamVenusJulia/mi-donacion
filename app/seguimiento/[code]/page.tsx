"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

const statusLabel:Record<string,string>={preparing:"Preparando",ready:"Listo para salir",in_transit:"En tránsito",delivered:"Entregado",cancelled:"Cancelado"};
export default function Tracking(){
 const params=useParams<{code:string}>(); const code=decodeURIComponent(params.code||"").toUpperCase(); const [data,setData]=useState<any>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 useEffect(()=>{(async()=>{const supabase=createClient();if(!supabase){setError("Sin conexión con la base de datos");setLoading(false);return;} const res=await supabase.rpc("get_public_tracking",{p_code:code}); if(res.error)setError(res.error.message);else setData(res.data);setLoading(false);})()},[code]);
 if(loading)return <div className="panel"><Link href="/">← Inicio</Link><h1>Consultando...</h1></div>;
 if(error||!data)return <div className="panel"><Link href="/">← Inicio</Link><h1>No encontramos ese código</h1><p className="lead">Revisa el código e inténtalo nuevamente.</p>{error&&<div className="notice">{error}</div>}</div>;
 const shipments=data.type==="donation"?data.shipments:[data];
 return <div className="panel"><Link href="/">← Inicio</Link><div className="row"><div><h1 style={{marginBottom:4}}>Seguimiento</h1><p className="lead" style={{margin:0}}>{data.code}</p></div><span className="tag">{data.type==="donation"?"DONACIÓN":"ENVÍO"}</span></div>
 <div className="card tracking-summary"><h3>Origen</h3><p><b>{data.collection_point?.name}</b><br/>{data.collection_point?.city}, {data.collection_point?.department} {data.collection_point?.verified&&"· Punto verificado"}</p>{data.received_at&&<p>Recibida: {new Date(data.received_at).toLocaleString("es-CO")}</p>}</div>
 {data.items?.length>0&&<div className="card"><h3>Insumos registrados</h3><div className="list">{data.items.map((i:any,idx:number)=><div className="list-row" key={idx}><span>{i.name} <small>({i.category})</small></span><b>{i.quantity} {i.unit}</b></div>)}</div></div>}
 {shipments.length===0?<div className="card"><h3>Aún está en el punto de acopio</h3><p>La donación fue registrada, pero todavía no ha sido asignada a un envío.</p></div>:shipments.map((s:any)=><div className="card" key={s.code}><div className="row"><div><h3>Envío {s.code}</h3><p>{s.destination_name} · {s.destination_city}, {s.destination_department}</p></div><span className="tag">{statusLabel[s.status]||s.status}</span></div><div className="timeline">{(s.events||[]).map((e:any,idx:number)=><div className="step" key={idx}><span className="stepdot"/><div><h4>{statusLabel[e.status]||e.status}</h4><p>{new Date(e.created_at).toLocaleString("es-CO")}{e.note?` · ${e.note}`:""}</p></div></div>)}{(!s.events||s.events.length===0)&&<div className="step pending"><span className="stepdot"/><div><h4>Preparación registrada</h4><p>El envío todavía no tiene actualizaciones públicas.</p></div></div>}</div>{s.evidence?.length>0&&<><h4>Evidencias públicas</h4><div className="evidence-grid">{s.evidence.map((e:any,idx:number)=>{const supabase=createClient();const src=supabase?.storage.from("delivery-evidence").getPublicUrl(e.storage_path).data.publicUrl;return <a key={idx} href={src} target="_blank" rel="noreferrer" className="evidence"><img src={src} alt="Evidencia de entrega"/><span>{e.type==="delivery_photo"?"Entrega":"Evidencia"} · {new Date(e.captured_at).toLocaleString("es-CO")}</span></a>})}</div></>}</div>)}
 </div>;
}
