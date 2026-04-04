require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const axios = require('axios')
const db = require('../db')



const obtenerToken = async () => {
  const response = await axios.post('https://api.mercadolibre.com/oauth/token', {
    grant_type: 'client_credentials',
    client_id: process.env.ML_CLIENT_ID,
    client_secret: process.env.ML_CLIENT_SECRET
  })
  return response.data.access_token
}

const parsearPrecio = (item) => {
  const precio = item.price
  const moneda = item.currency_id === 'USD' ? 'USD' : 'ARS'
  return { precio, moneda }
}

const parsearAtributos = (atributos) => {
  let ambientes = null
  let superficie = null

  for (const atr of atributos) {
    if (atr.id === 'ROOMS') ambientes = parseInt(atr.value_name)
    if (atr.id === 'TOTAL_AREA') superficie = parseFloat(atr.value_name)
  }

  return { ambientes, superficie }
}

const scrapeMercadoLibre = async () => {
  console.log('Iniciando scraper de Mercado Libre...')

  const token = await obtenerToken()
  console.log('Token obtenido correctamente')

  let totalGuardadas = 0

  for (let offset = 0; offset < 250; offset += 50) {
    console.log(`Obteniendo resultados ${offset} a ${offset + 50}...`)

    try {
      const response = await axios.get('https://api.mercadolibre.com/sites/MLA/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
      category: 'MLA1474',
      state: 'TUxBUENBUGw3M3M1',
      offset: offset,
      limit: 50
    }
  }).catch(err => {
  console.error('Error completo:', JSON.stringify(err.response?.data, null, 2))
  throw err
  })

      const items = response.data.results

      if (!items || items.length === 0) {
        console.log('No hay más resultados')
        break
      }

      for (const item of items) {
        const { precio, moneda } = parsearPrecio(item)
        const { ambientes, superficie } = parsearAtributos(item.attributes || [])

        const barrio = item.location?.neighborhood?.name || null
        const zona = item.location?.city?.name || null
        const provincia = item.location?.state?.name || null

        if (!precio) continue

        await db.query(
          `INSERT INTO propiedades 
            (portal, precio, moneda, tipo, ambientes, superficie_m2, barrio, zona, provincia, url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          ['mercadolibre', precio, moneda, 'departamento', ambientes, superficie, barrio, zona, provincia, item.permalink]
        )

        totalGuardadas++
      }

      console.log(`Página ${offset / 50 + 1}: guardadas acumuladas ${totalGuardadas}`)
      await new Promise(r => setTimeout(r, 1000))

    } catch (err) {
      console.error(`Error en offset ${offset}:`, err.message)
    }
  }

  console.log(`Total guardadas: ${totalGuardadas} propiedades`)
}

scrapeMercadoLibre()