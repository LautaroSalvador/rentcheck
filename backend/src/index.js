require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const fastify = require('fastify')({ logger: true })
const db = require('./db')

const start = async () => {
  try {
    // CORS primero, antes que todo
   await fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3000', 'https://rentcheck-ik7k1oj3p-lautarosalvadors-projects.vercel.app']
})

    // Rutas
    fastify.get('/health', async () => {
      return { status: 'ok', message: 'RentCheck backend funcionando' }
    })

    fastify.get('/db-check', async () => {
      const result = await db.query('SELECT COUNT(*) FROM propiedades')
      return { status: 'ok', propiedades_en_db: result.rows[0].count }
    })

    await fastify.register(require('./routes/analisis'))

    await fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET
  })

  await fastify.register(require('./routes/auth'))

    await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' })
    console.log('Servidor corriendo en http://localhost:3001')

  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()