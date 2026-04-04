'use client'
import { useState } from 'react'

export default function AuthModal({ onClose, onLogin }) {
  const [modo, setModo] = useState('login') // 'login' o 'register'
  const [forma, setForma] = useState({ email: '', password: '', nombre: '' })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const submit = async () => {
    setError(null)
    setCargando(true)

    try {
      const url = modo === 'login'
        ? 'https://rentcheck-production.up.railway.app/api/auth/login'
        : 'https://rentcheck-production.up.railway.app/api/auth/register'

      const body = modo === 'login'
        ? { email: forma.email, password: forma.password }
        : { email: forma.email, password: forma.password, nombre: forma.nombre }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      // Guardar token en localStorage
      localStorage.setItem('rentcheck_token', data.token)
      localStorage.setItem('rentcheck_usuario', JSON.stringify(data.usuario))

      onLogin(data.usuario)
      onClose()

    } catch {
      setError('Error al conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 100, backdropFilter: 'blur(4px)'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white', borderRadius: 20, padding: 40,
        width: '100%', maxWidth: 420, zIndex: 101,
        boxShadow: '0 24px 48px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#022448', letterSpacing: '-0.02em' }}>
              {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
            <p style={{ fontSize: 13, color: '#74777f', marginTop: 4 }}>
              {modo === 'login' ? 'Accedé a tu cuenta de RentCheck' : 'Empezá a usar RentCheck gratis'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f3f4f5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, color: '#74777f' }}
          >×</button>
        </div>

        {/* Campos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {modo === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#022448', marginBottom: 6 }}>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={forma.nombre}
                onChange={e => setForma({ ...forma, nombre: e.target.value })}
                style={{
                  width: '100%', background: '#f3f4f5', border: 'none',
                  borderRadius: 12, padding: '12px 16px', fontSize: 14,
                  color: '#191c1d', fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#022448', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={forma.email}
              onChange={e => setForma({ ...forma, email: e.target.value })}
              style={{
                width: '100%', background: '#f3f4f5', border: 'none',
                borderRadius: 12, padding: '12px 16px', fontSize: 14,
                color: '#191c1d', fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#022448', marginBottom: 6 }}>Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={forma.password}
              onChange={e => setForma({ ...forma, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                width: '100%', background: '#f3f4f5', border: 'none',
                borderRadius: 12, padding: '12px 16px', fontSize: 14,
                color: '#191c1d', fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#dc2626', background: '#fef2f2', padding: '10px 14px', borderRadius: 8 }}>
              {error}
            </p>
          )}

          <button
            onClick={submit}
            disabled={cargando}
            style={{
              width: '100%', background: '#022448', color: 'white',
              border: 'none', borderRadius: 12, padding: '14px',
              fontSize: 15, fontWeight: 700, cursor: cargando ? 'not-allowed' : 'pointer',
              opacity: cargando ? 0.6 : 1, fontFamily: 'Inter, sans-serif',
              marginTop: 8
            }}
          >
            {cargando ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </div>

        {/* Switch modo */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#74777f', marginTop: 24 }}>
          {modo === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            onClick={() => { setModo(modo === 'login' ? 'register' : 'login'); setError(null) }}
            style={{ background: 'none', border: 'none', color: '#022448', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
          >
            {modo === 'login' ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </>
  )
}