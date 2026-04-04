const db = require('../db')

const analizarPrecio = async ({ zona, ambientes, precio, moneda }) => {
  // Buscamos todas las propiedades de esa zona y cantidad de ambientes
  const result = await db.query(
    `SELECT precio FROM propiedades
     WHERE LOWER(zona) LIKE LOWER($1)
     AND ambientes = $2
     AND moneda = $3`,
    [`%${zona}%`, ambientes, moneda]
  )

  const precios = result.rows.map(r => parseFloat(r.precio)).sort((a, b) => a - b)

  if (precios.length < 3) {
    return {
      suficientes_datos: false,
      mensaje: `No hay suficientes datos para ${zona} con ${ambientes} ambientes. Tenemos ${precios.length} registro/s.`
    }
  }

  // Calcular estadísticas
  const promedio = precios.reduce((a, b) => a + b, 0) / precios.length
  const mediana = precios[Math.floor(precios.length / 2)]
  const p25 = precios[Math.floor(precios.length * 0.25)]
  const p75 = precios[Math.floor(precios.length * 0.75)]

  // Calcular desvío respecto a la mediana
  const desvio = ((precio - mediana) / mediana) * 100

  // Determinar veredicto
  let veredicto
  if (desvio <= -10) veredicto = 'BUEN PRECIO'
  else if (desvio <= 10) veredicto = 'PRECIO JUSTO'
  else veredicto = 'SOBREVALUADO'

  return {
    suficientes_datos: true,
    veredicto,
    desvio_porcentual: Math.round(desvio),
    precio_consultado: precio,
    moneda,
    estadisticas: {
      mediana: Math.round(mediana),
      promedio: Math.round(promedio),
      p25: Math.round(p25),
      p75: Math.round(p75),
      cantidad_muestras: precios.length
    }
  }
}

module.exports = { analizarPrecio }