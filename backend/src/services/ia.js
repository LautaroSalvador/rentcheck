const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const generarAnalisis = async ({ zona, ambientes, precio, moneda, veredicto, estadisticas }) => {
  const precioFormateado = precio.toLocaleString('es-AR')
  const medianaFormateada = estadisticas.mediana.toLocaleString('es-AR')
  const desvio = Math.round(((precio - estadisticas.mediana) / estadisticas.mediana) * 100)

  const prompt = `Sos un experto en el mercado inmobiliario argentino. Analizá el siguiente alquiler y escribí un análisis claro y útil para el inquilino.

Datos de la consulta:
- Zona: ${zona}
- Tipo: departamento de ${ambientes} ambiente${ambientes > 1 ? 's' : ''}
- Precio consultado: $${precioFormateado} ${moneda}
- Veredicto del sistema: ${veredicto}
- Desvío respecto a la mediana: ${desvio > 0 ? '+' : ''}${desvio}%

Estadísticas del mercado para esa zona:
- Mediana: $${medianaFormateada} ${moneda}
- Promedio: $${estadisticas.promedio.toLocaleString('es-AR')} ${moneda}
- Rango típico: $${estadisticas.p25.toLocaleString('es-AR')} – $${estadisticas.p75.toLocaleString('es-AR')} ${moneda}
- Propiedades analizadas: ${estadisticas.cantidad_muestras}

Escribí un análisis de 3 párrafos cortos:
1. Explicá si el precio es justo, barato o caro en relación al mercado, con números concretos.
2. Mencioná qué factores podrían justificar ese precio en esa zona (ubicación, demanda, tipo de propiedad).
3. Dá una recomendación concreta al inquilino: si conviene aceptar, negociar o seguir buscando.

Escribí en español argentino, tono directo y profesional. Sin títulos ni bullets, solo párrafos.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }]
  })

  return response.content[0].text
}

module.exports = { generarAnalisis }