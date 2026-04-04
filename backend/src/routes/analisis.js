const { analizarPrecio } = require('../services/analisis')
const { generarAnalisis } = require('../services/ia')

module.exports = async (fastify) => {
  fastify.get('/api/analizar', async (request, reply) => {
    const { zona, ambientes, precio, moneda } = request.query

    if (!zona || !ambientes || !precio || !moneda) {
      return reply.status(400).send({
        error: 'Faltan parámetros. Necesitás: zona, ambientes, precio, moneda'
      })
    }

    const resultado = await analizarPrecio({
      zona,
      ambientes: parseInt(ambientes),
      precio: parseFloat(precio),
      moneda: moneda.toUpperCase()
    })

    return resultado
  })

  fastify.post('/api/analisis-ia', async (request, reply) => {
    console.log('Body recibido:', request.body)
    const { zona, ambientes, precio, moneda, veredicto, estadisticas } = request.body

    if (!zona || !ambientes || !precio || !veredicto || !estadisticas) {
      return reply.status(400).send({ error: 'Faltan datos para el análisis' })
    }

    const analisis = await generarAnalisis({
      zona,
      ambientes: parseInt(ambientes),
      precio: parseFloat(precio),
      moneda: moneda || 'ARS',
      veredicto,
      estadisticas
    })

    return { analisis }
  })
}