"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home(){
 const [code,setCode]=useState(""); const router=useRouter();
 const track=()=>{if(code.trim()) router.push(`/seguimiento/${encodeURIComponent(code.trim().toUpperCase())}`)};
 return <>
  <header className="container nav"><div className="brand">Mi <span>Donación</span></div><nav className="navlinks"><a href="#como-funciona">Cómo funciona</a><a href="#seguimiento">Seguimiento</a><Link className="btn btn-light" href="/auth">Ingresar</Link><Link className="btn btn-primary" href="/registrar-acopio">Registrar punto</Link></nav></header>
  <main>
   <section className="container hero"><div><span className="eyebrow">TRANSPARENCIA EN LA AYUDA HUMANITARIA</span><h1>Que cada donación pueda llegar con evidencia.</h1><p>Registra puntos de acopio, consolida insumos, documenta el transporte y permite a los donantes verificar cuándo y dónde fue entregada la ayuda.</p><div className="actions"><Link className="btn btn-primary" href="/registrar-acopio">Registrar punto de acopio</Link><a className="btn btn-light" href="#seguimiento">Seguir una donación</a></div></div>
   <div className="hero-card"><div className="row"><div><small>Ejemplo de envío</small><h3 style={{margin:'4px 0'}}>DON-8K4M2P9Q1A7B</h3></div><span className="tag">EN TRÁNSITO</span></div><div className="metric"><span>120 kits de alimentos</span><span className="dot"/></div><div className="metric"><span>80 kits de aseo</span><span className="dot"/></div><div className="metric"><span>Salida registrada</span><b>08:45</b></div><div className="metric"><span>Prueba de entrega</span><b>Pendiente</b></div></div></section>
   <section id="seguimiento" className="section"><div className="container"><h2>Consulta el estado de una entrega</h2><p className="lead">Ingresa el código de seguimiento entregado por el punto de acopio.</p><div className="tracker"><input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&track()} placeholder="Ej. DON-8K4M2P9Q1A7B"/><button onClick={track} className="btn btn-primary">Consultar</button></div></div></section>
   <section id="como-funciona" className="section"><div className="container"><h2>Una cadena de evidencia, no solo promesas</h2><p className="lead">Cada paso importante queda registrado con responsable, fecha y evidencia.</p><div className="grid3"><div className="card"><div className="icon">1</div><h3>Acopio</h3><p>El responsable registra ubicación, inventario recibido, necesidades de transporte y comprobantes de compra.</p></div><div className="card"><div className="icon">2</div><h3>Transporte</h3><p>Se registra la salida, conductor o voluntario responsable, destino y actualización del estado durante la entrega.</p></div><div className="card"><div className="icon">3</div><h3>Entrega verificada</h3><p>La entrega final incluye fotografía, coordenadas GPS, hora y responsable. El donante puede consultar el resultado.</p></div></div></div></section>
  </main><footer className="container footer">Mi Donación · Plataforma comunitaria de trazabilidad humanitaria. La información sensible no debe mostrarse públicamente.</footer>
 </>}
