"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AuthPage(){
  const [mode,setMode]=useState<"login"|"register">("login");
  const [msg,setMsg]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setMsg(""); const f=new FormData(e.currentTarget); const supabase=createClient();
    if(!supabase){setMsg("No se pudo conectar con Supabase.");setBusy(false);return;}
    const email=String(f.get("email")||""); const password=String(f.get("password")||"");
    if(mode==="register"){
      const {error}=await supabase.auth.signUp({email,password,options:{data:{full_name:String(f.get("full_name")||""),phone:String(f.get("phone")||"")}}});
      if(error) setMsg(error.message); else setMsg("Cuenta creada. Si se solicita confirmación, revisa tu correo y luego inicia sesión.");
    } else {
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error) setMsg(error.message); else router.push("/dashboard");
    }
    setBusy(false);
  }
  return <div className="panel narrow"><Link href="/">← Inicio</Link><h1>{mode==="login"?"Ingresar":"Crear cuenta"}</h1><p className="lead">Acceso para responsables de puntos de acopio y voluntarios.</p>
    <div className="tabs"><button className={mode==="login"?"tab active":"tab"} onClick={()=>setMode("login")}>Ingresar</button><button className={mode==="register"?"tab active":"tab"} onClick={()=>setMode("register")}>Crear cuenta</button></div>
    <form className="card form-grid" onSubmit={submit}>
      {mode==="register"&&<><div className="field full"><label>Nombre completo</label><input name="full_name" required /></div><div className="field full"><label>Teléfono</label><input name="phone" required /></div></>}
      <div className="field full"><label>Correo</label><input type="email" name="email" required /></div><div className="field full"><label>Contraseña</label><input type="password" name="password" minLength={8} required /></div>
      <div className="field full"><button className="btn btn-primary" disabled={busy}>{busy?"Procesando...":mode==="login"?"Ingresar":"Crear cuenta"}</button>{msg&&<p className="form-message">{msg}</p>}</div>
    </form></div>
}
