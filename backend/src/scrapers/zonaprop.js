require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const { chromium } = require('playwright')
const db = require('../db')

// Convierte "$ 900.000" o "USD 3.000" a número y moneda
const parsearPrecio = (texto) => {
  if (!texto) return { precio: null, moneda: null }
  
  const moneda = texto.includes('USD') ? 'USD' : 'ARS'
  const numero = parseFloat(texto.replace(/[^0-9,]/g, '').replace(',', '.'))
  
  return { precio: numero, moneda }
}

// Convierte "50 m² tot." a 50
const parsearSuperficie = (features) => {
  const m2 = features.find(f => f.includes('m²'))
  if (!m2) return null
  return parseFloat(m2.replace(/[^0-9,]/g, ''))
}

// Convierte "2 amb." a 2
const parsearAmbientes = (features) => {
  const amb = features.find(f => f.includes('amb'))
  if (!amb) return null
  return parseInt(amb.replace(/[^0-9]/g, ''))
}

// Separa "Palermo Soho, Palermo" en barrio y zona
const parsearUbicacion = (texto) => {
  if (!texto) return { barrio: null, zona: null }
  const lineas = texto.split('\n')
  const partes = lineas[lineas.length - 1].split(',')
  return {
    barrio: partes[0] ? partes[0].trim() : null,
    zona: partes[1] ? partes[1].trim() : null
  }
}

const scrapeZonaprop = async () => {
  console.log('Iniciando scraper de Zonaprop...')
  
  const browser = await chromium.launch({ headless: false }) // headless: true, ya no necesitamos verlo
  const page = await browser.newPage()

  let totalGuardadas = 0

  try {
    for (let pagina = 1; pagina <= 5; pagina++) {
      const url = pagina === 1
        ? 'https://www.zonaprop.com.ar/departamentos-alquiler-capital-federal.html'
        : `https://www.zonaprop.com.ar/departamentos-alquiler-capital-federal-pagina-${pagina}.html`

      console.log(`Scrapeando página ${pagina}...`)

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      })

      await page.waitForTimeout(3000) // esperamos 3 segundos a que cargue todo

      const rawData = await page.evaluate(() => {
        const items = document.querySelectorAll('.postingCardLayout-module__posting-card-container')
        
        return Array.from(items).map(item => {
          const precioEl = item.querySelector('.postingPrices-module__price')
          const featuresEls = item.querySelectorAll('.postingMainFeatures-module__posting-main-features-span')
          const ubicacionEl = item.querySelector('.postingLocations-module__location-block')
          const linkEl = item.querySelector('a')

          return {
            precio_texto: precioEl ? precioEl.innerText.trim() : null,
            features: Array.from(featuresEls).map(f => f.innerText.trim()),
            ubicacion: ubicacionEl ? ubicacionEl.innerText.trim() : null,
            url: linkEl ? 'https://www.zonaprop.com.ar' + linkEl.getAttribute('href') : null
          }
        })
      })

      let guardadasEnPagina = 0

      for (const raw of rawData) {
        const { precio, moneda } = parsearPrecio(raw.precio_texto)
        const superficie = parsearSuperficie(raw.features)
        const ambientes = parsearAmbientes(raw.features)
        const { barrio, zona } = parsearUbicacion(raw.ubicacion)

        if (!precio) continue

        await db.query(
          `INSERT INTO propiedades 
            (portal, precio, moneda, tipo, ambientes, superficie_m2, barrio, zona, provincia, url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          ['zonaprop', precio, moneda, 'departamento', ambientes, superficie, barrio, zona, 'Buenos Aires', raw.url]
        )

        guardadasEnPagina++
      }

      console.log(`Página ${pagina}: ${guardadasEnPagina} propiedades guardadas`)
      totalGuardadas += guardadasEnPagina

      // Pausa entre páginas para no sobrecargar el servidor
      await page.waitForTimeout(2000)
    }

    await browser.close()
    console.log(`Total guardadas: ${totalGuardadas} propiedades`)

  } catch (err) {
    console.error('Error en el scraper:', err)
    await browser.close()
    throw err
  }
}

scrapeZonaprop()