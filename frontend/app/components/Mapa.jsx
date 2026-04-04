'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix del ícono de Leaflet en Next.js
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Coordenadas de cada barrio
const coordenadas = {
  // CABA existentes
  'Palermo':          [-34.5885, -58.4317],
  'Recoleta':         [-34.5875, -58.3934],
  'Belgrano':         [-34.5619, -58.4567],
  'Caballito':        [-34.6195, -58.4456],
  'Villa Crespo':     [-34.6012, -58.4456],
  'Almagro':          [-34.6098, -58.4198],
  'San Telmo':        [-34.6218, -58.3731],
  'Flores':           [-34.6345, -58.4634],
  'Villa Urquiza':    [-34.5723, -58.4890],
  'Nunez':            [-34.5456, -58.4612],
  'Colegiales':       [-34.5734, -58.4456],
  'Barracas':         [-34.6456, -58.3890],
  // CABA nuevos
  'Chacarita':        [-34.5867, -58.4534],
  'Boedo':            [-34.6267, -58.4198],
  'Saavedra':         [-34.5534, -58.4823],
  'Devoto':           [-34.5923, -58.5123],
  'Villa del Parque': [-34.5978, -58.5012],
  'Villa Pueyrredon': [-34.5812, -58.5034],
  'Balvanera':        [-34.6123, -58.4067],
  'Parque Patricios': [-34.6389, -58.4023],
  'Monte Castro':     [-34.6045, -58.5089],
  // GBA
  'San Isidro':       [-34.4712, -58.5134],
  'Martinez':         [-34.4867, -58.5234],
  'Vicente Lopez':    [-34.5267, -58.4834],
  'Olivos':           [-34.5034, -58.4934],
  'Tigre':            [-34.4267, -58.5734],
  'Quilmes':          [-34.7234, -58.2534],
  'Lomas de Zamora':  [-34.7589, -58.3934],
  'Moron':            [-34.6534, -58.6234],
}

// Componente que mueve el mapa cuando cambia la zona
function CentrarMapa({ centro }) {
  const map = useMap()
  useEffect(() => {
    map.setView(centro, 14, { animate: true })
  }, [centro, map])
  return null
}

export default function Mapa({ zona, veredicto }) {
  const centro = coordenadas[zona] || [-34.6037, -58.3816]

  const colorMarcador = {
    'BUEN PRECIO':  '#16a34a',
    'PRECIO JUSTO': '#d97706',
    'SOBREVALUADO': '#dc2626',
  }[veredicto] || '#022448'

  const iconoPersonalizado = L.divIcon({
    html: `<div style="
      width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
      background: ${colorMarcador}; border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transform: rotate(-45deg);
    "></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    className: ''
  })

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(196,198,207,0.2)', height: 240 }}>
      <MapContainer
        center={centro}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <CentrarMapa centro={centro} />
        <Marker position={centro} icon={iconoPersonalizado}>
          <Popup>{zona}, CABA</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}