const bcrypt = require('bcrypt')
const db = require('../db')

module.exports = async (fastify) => {

  // Registro
  fastify.post('/api/auth/register', async (request, reply) => {
    const { email, nombre, password } = request.body

    if (!email || !password || !nombre) {
      return reply.status(400).send({ error: 'Completá todos los campos' })
    }

    // Verificar si el email ya existe
    const existe = await db.query('SELECT id FROM usuarios WHERE email = $1', [email])
    if (existe.rows.length > 0) {
      return reply.status(400).send({ error: 'El email ya está registrado' })
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(password, 12)

    // Guardar usuario
    const result = await db.query(
      'INSERT INTO usuarios (email, nombre, password) VALUES ($1, $2, $3) RETURNING id, email, nombre',
      [email, nombre, hash]
    )

    const usuario = result.rows[0]

    // Generar token
    const token = fastify.jwt.sign({ id: usuario.id, email: usuario.email, nombre: usuario.nombre })

    return { token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } }
  })

  // Login
  fastify.post('/api/auth/login', async (request, reply) => {
    const { email, password } = request.body

    if (!email || !password) {
      return reply.status(400).send({ error: 'Completá todos los campos' })
    }

    // Buscar usuario
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return reply.status(401).send({ error: 'Email o contraseña incorrectos' })
    }

    const usuario = result.rows[0]

    // Verificar contraseña
    const valida = await bcrypt.compare(password, usuario.password)
    if (!valida) {
      return reply.status(401).send({ error: 'Email o contraseña incorrectos' })
    }

    // Generar token
    const token = fastify.jwt.sign({ id: usuario.id, email: usuario.email, nombre: usuario.nombre })

    return { token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } }
  })

  // Verificar token (para el frontend)
  fastify.get('/api/auth/me', async (request, reply) => {
    try {
      await request.jwtVerify()
      return { usuario: request.user }
    } catch {
      return reply.status(401).send({ error: 'Token inválido' })
    }
  })
}