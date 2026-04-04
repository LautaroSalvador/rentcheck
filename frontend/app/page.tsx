'use client'
import { useState,useEffect } from 'react'
import AuthModal from './components/AuthModal'
import dynamic from 'next/dynamic'
const Mapa = dynamic(() => import('./components/Mapa'), { ssr: false })
const barrios = [
  // CABA
  'Palermo', 'Recoleta', 'Belgrano', 'Caballito', 'Villa Crespo',
  'Almagro', 'San Telmo', 'Flores', 'Villa Urquiza', 'Nunez',
  'Colegiales', 'Barracas', 'Chacarita', 'Boedo', 'Saavedra',
  'Devoto', 'Villa del Parque', 'Villa Pueyrredon', 'Balvanera',
  'Parque Patricios', 'Monte Castro',
  // GBA
  'San Isidro', 'Martinez', 'Vicente Lopez', 'Olivos',
  'Tigre', 'Quilmes', 'Lomas de Zamora', 'Moron',
]

export default function Home() {
  const [forma, setForma] = useState({ zona: '', ambientes: '', precio: '', moneda: 'ARS' })
const [resultado, setResultado] = useState(null)
const [cargando, setCargando] = useState(false)
const [error, setError] = useState(null)
const [barrioSeleccionado, setBarrioSeleccionado] = useState(null)
const [analisisIA, setAnalisisIA] = useState(null)
const [cargandoIA, setCargandoIA] = useState(false)
const [mostrarAuth, setMostrarAuth] = useState(false)
const [usuario, setUsuario] = useState(null)
  
useEffect(() => {
  const usuarioGuardado = localStorage.getItem('rentcheck_usuario')
  if (usuarioGuardado) {
    setUsuario(JSON.parse(usuarioGuardado))
  }
}, [])
  const generarAnalisisIA = async () => {
  console.log('Datos que se mandan:', {
    zona: forma.zona,
    ambientes: forma.ambientes,
    precio: parseFloat(forma.precio),
    moneda: forma.moneda,
    veredicto: resultado?.veredicto,
    estadisticas: resultado?.estadisticas
  })
  setCargandoIA(true)
  setAnalisisIA(null)
  try {
    const res = await fetch('http://localhost:3001/api/analisis-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zona: forma.zona,
        ambientes: forma.ambientes,
        precio: parseFloat(forma.precio),
        moneda: forma.moneda,
        veredicto: resultado?.veredicto,
        estadisticas: resultado?.estadisticas
      })
    })
    const data = await res.json()
    setAnalisisIA(data.analisis)
  } catch {
    setAnalisisIA('Error al generar el análisis.')
  } finally {
    setCargandoIA(false)
  }
}

  const analizar = async () => {
    if (!forma.zona || !forma.ambientes || !forma.precio) {
      setError('Completá todos los campos')
      return
    }
    setCargando(true)
    setError(null)
    setResultado(null)
    setAnalisisIA(null) 
    try {
      const params = new URLSearchParams(forma)
      const res = await fetch(`http://localhost:3001/api/analizar?${params}`)
      const data = await res.json()
      setResultado(data)
    } catch {
      setError('Error al conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }


  
  const veredictoConfig = {
    'BUEN PRECIO':  { label: 'Buen Precio',   color: '#16a34a', bg: '#f0fdf4', badge: '#dcfce7', icon: 'check_circle' },
    'PRECIO JUSTO': { label: 'Precio Justo',  color: '#d97706', bg: '#fffbeb', badge: '#fef3c7', icon: 'check_circle' },
    'SOBREVALUADO': { label: 'Sobrevaluado',  color: '#dc2626', bg: '#fef2f2', badge: '#fee2e2', icon: 'warning' },
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'Inter', sans-serif; background: #f8f9fa; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; font-family: 'Material Symbols Outlined'; }
        .filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        select, input { font-family: 'Inter', sans-serif; }
        select:focus, input:focus { outline: none; }
        .stat-card:hover { background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .btn-main:hover { background: #022448 !important; }
        .btn-main:active { transform: scale(0.98); }
        .nav-link:hover { color: #022448; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa', color: '#191c1d' }}>

        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,249,250,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(196,198,207,0.3)' }}>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, padding: '0 32px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: '#022448', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 18 }}>analytics</span>
              </div>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#022448' }}>RentCheck</div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#74777f', fontWeight: 600 }}>análisis de alquileres</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <a href="#" style={{ color: '#022448', borderBottom: '2px solid #022448', paddingBottom: 4, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Mercado</a>
            </div>
            {usuario ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ fontSize: 14, color: '#022448', fontWeight: 600 }}>
      Hola, {usuario.nombre}
    </span>
    <button
      onClick={() => {
        localStorage.removeItem('rentcheck_token')
        localStorage.removeItem('rentcheck_usuario')
        setUsuario(null)
      }}
      style={{ background: '#f3f4f5', color: '#74777f', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
    >
      Salir
    </button>
  </div>
) : (
  <button
    onClick={() => setMostrarAuth(true)}
    style={{ background: '#022448', color: 'white', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
  >
    Iniciar Sesión
  </button>
)}
          </nav>
        </header>

        <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '48px 32px', width: '100%' }}>

          {/* Hero */}
          <section style={{ maxWidth: 700, marginBottom: 56 }}>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#022448', lineHeight: 1.08, marginBottom: 20 }}>
              ¿El precio de tu alquiler es justo?
            </h1>
            <p style={{ fontSize: 17, color: '#43474e', lineHeight: 1.65, maxWidth: 560 }}>
              Comparamos los precios de tu vivienda contra datos de mercado reales para brindarte una valuación precisa y objetiva.
            </p>
          </section>

          {/* Bento Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' }}>

            {/* Formulario */}
            <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 4px 6px -1px rgba(2,36,72,0.04), 0 10px 15px -3px rgba(2,36,72,0.06)', border: '1px solid rgba(196,198,207,0.2)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#74777f', marginBottom: 24 }}>Configurá tu consulta</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Barrio */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#022448', marginBottom: 6 }}>Barrio</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={forma.zona}
                      onChange={e => setForma({ ...forma, zona: e.target.value })}
                      style={{ width: '100%', background: '#f3f4f5', border: 'none', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#191c1d', cursor: 'pointer', appearance: 'none' }}
                    >
                      {barrios.map(b => <option key={b} value={b}>{b}, CABA</option>)}
                    </select>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#74777f', fontSize: 20 }}>expand_more</span>
                  </div>
                </div>

                {/* Ambientes + Moneda */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#022448', marginBottom: 6 }}>Ambientes</label>
                    <select
                      value={forma.ambientes}
                      onChange={e => setForma({ ...forma, ambientes: e.target.value })}
                      style={{ width: '100%', background: '#f3f4f5', border: 'none', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#191c1d', cursor: 'pointer', appearance: 'none' }}
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} ambiente{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#022448', marginBottom: 6 }}>Moneda</label>
                    <div style={{ display: 'flex', background: '#f3f4f5', borderRadius: 12, padding: 4 }}>
                      {['ARS', 'USD'].map(m => (
                        <button key={m} onClick={() => setForma({ ...forma, moneda: m })}
                          style={{ flex: 1, padding: '8px', fontSize: 13, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                            background: forma.moneda === m ? 'white' : 'transparent',
                            color: forma.moneda === m ? '#022448' : '#74777f',
                            boxShadow: forma.moneda === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                          }}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#022448', marginBottom: 6 }}>Precio del alquiler</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#74777f', fontSize: 15 }}>$</span>
                    <input
                      type="number"
                      placeholder="450.000"
                      value={forma.precio}
                      onChange={e => setForma({ ...forma, precio: e.target.value })}
                      style={{ width: '100%', background: '#f3f4f5', border: 'none', borderRadius: 12, padding: '12px 16px 12px 36px', fontSize: 15, color: '#191c1d' }}
                    />
                  </div>
                </div>

                {error && <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>}

                <button
                  className="btn-main"
                  onClick={analizar}
                  disabled={cargando}
                  style={{ width: '100%', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: cargando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', opacity: cargando ? 0.6 : 1 }}
                >
                  {cargando ? 'Analizando...' : 'Analizar precio'}
                  {!cargando && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>}
                </button>
              </div>
            </div>

            {/* Panel derecho */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Resultado o placeholder */}
              {!resultado ? (
                <div style={{ background: 'white', borderRadius: 16, padding: 40, border: '1px solid rgba(196,198,207,0.2)', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c4c6cf' }}>analytics</span>
                  <p style={{ color: '#74777f', fontSize: 15, textAlign: 'center' }}>Completá el formulario para ver el análisis de mercado</p>
                </div>
              ) : resultado.suficientes_datos === false ? (
                <div className="fade-in" style={{ background: 'white', borderRadius: 16, padding: 40, border: '1px solid rgba(196,198,207,0.2)', textAlign: 'center' }}>
                  <p style={{ color: '#74777f' }}>{resultado.mensaje}</p>
                </div>
              ) : (() => {
                const c = veredictoConfig[resultado.veredicto]
                const desvio = resultado.desvio_porcentual
                const posicion = Math.min(Math.max(50 + desvio, 5), 95)
                return (
                  <div className="fade-in">
                    {/* Card principal veredicto */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid rgba(196,198,207,0.2)', marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                        <div>
                          <span style={{ display: 'inline-block', padding: '4px 12px', background: c.badge, color: c.color, borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                            Estado del Mercado
                          </span>
                          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#022448', letterSpacing: '-0.02em' }}>{c.label.toUpperCase()}</h2>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 11, color: '#74777f', marginBottom: 2 }}>Desviación</p>
                            <p style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{desvio > 0 ? '+' : ''}{desvio}% <span style={{ fontSize: 12, fontWeight: 400, color: '#74777f' }}>vs mediana</span></p>
                          </div>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${c.badge}`, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className={`material-symbols-outlined filled`} style={{ color: c.color, fontSize: 24 }}>{c.icon}</span>
                          </div>
                        </div>
                      </div>

                      {/* Barra de posición */}
                      <div style={{ width: '100%', height: 8, background: '#f3f4f5', borderRadius: 999, position: 'relative', marginBottom: 8, overflow: 'visible' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${posicion}%`, background: `linear-gradient(to right, #16a34a, ${c.color})`, borderRadius: 999 }} />
                        <div style={{ position: 'absolute', left: `${posicion}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, background: c.color, borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 0 2px ' + c.color }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#74777f', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span>Bajo</span>
                        <span>Mediana</span>
                        <span>Sobrevaluado</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                      {[
                        { label: 'Mediana', valor: resultado.estadisticas.mediana },
                        { label: 'Promedio', valor: resultado.estadisticas.promedio },
                        { label: 'P25', valor: resultado.estadisticas.p25 },
                        { label: 'P75', valor: resultado.estadisticas.p75 },
                      ].map(({ label, valor }) => (
                        <div key={label} className="stat-card" style={{ background: '#f3f4f5', borderRadius: 14, padding: '16px', transition: 'all 0.2s', cursor: 'default' }}>
                          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#74777f', marginBottom: 6 }}>{label}</p>
                          <p style={{ fontSize: 18, fontWeight: 800, color: '#022448' }}>${valor.toLocaleString('es-AR')}</p>
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize: 11, color: '#74777f', marginTop: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
                      Muestra basada en {resultado.estadisticas.cantidad_muestras} propiedades del mercado.
                    </p>
                    {/* Botón IA */}
<div style={{ marginTop: 24, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 24 }}>
  {!analisisIA && (
    <button
      onClick={() => {
  console.log('click en IA')
  generarAnalisisIA()
}}
      disabled={cargandoIA}
      style={{
        width: '100%', padding: '14px', background: 'transparent',
        border: '1.5px solid #1e3a5f', borderRadius: 12, cursor: 'pointer',
        fontSize: 14, fontWeight: 500, color: '#1e3a5f',
        fontFamily: 'DM Sans, sans-serif',
        opacity: cargandoIA ? 0.6 : 1,
        transition: 'all 0.2s ease'
      }}
    >
      {cargandoIA ? 'Generando análisis...' : '✦ Generar análisis con IA'}
    </button>
  )}

  {analisisIA && (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 24,
      border: '1px solid #e8e4df'
    }}>
      <p style={{
        fontSize: 11, letterSpacing: '0.15em', color: '#9c9690',
        textTransform: 'uppercase', marginBottom: 16
      }}>
        ✦ Análisis generado por IA
      </p>
      <p style={{
        fontSize: 15, color: '#3a3530', lineHeight: 1.8,
        fontFamily: 'DM Sans, sans-serif', whiteSpace: 'pre-line'
      }}>
        {analisisIA}
      </p>
    </div>
  )}
</div>
                    
                    <div style={{ marginTop: 16 }}>
                      <Mapa zona={forma.zona} veredicto={resultado.veredicto} />
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Features */}
          <section style={{ marginTop: 96 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#022448', textAlign: 'center', marginBottom: 48 }}>La diferencia de precisión</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
              {[
                { icon: 'dataset', title: 'Datos Reales', desc: 'Analizamos miles de publicaciones reales actualizadas del mercado argentino.' },
                { icon: 'query_stats', title: 'Curva de Percentiles', desc: 'Entendé dónde se ubica tu propiedad en el espectro total del barrio.' },
                { icon: 'security', title: 'Decisiones Seguras', desc: 'Negociá con fundamentos sólidos. El estándar de confianza para inquilinos.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: '#d5e3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#022448' }}>{icon}</span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#022448' }}>{title}</h4>
                  <p style={{ fontSize: 14, color: '#43474e', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #f3f4f5', background: '#f8f9fa', padding: '40px 32px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 12, color: '#74777f' }}>© 2026 RentCheck Argentina. Datos del mercado en tiempo real.</p>
            <div style={{ display: 'flex', gap: 32 }}>
              {['Privacidad', 'Términos', 'Contacto'].map(l => (
                <a key={l} href="#" style={{ fontSize: 12, color: '#74777f', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
        {mostrarAuth && (
  <AuthModal
    onClose={() => setMostrarAuth(false)}
    onLogin={(u) => setUsuario(u)}
  />
)}
      </div>
    </>
  )
}