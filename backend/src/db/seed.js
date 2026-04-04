require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const db = require('./index')

const zonas = [
  // CABA
  { barrio: 'Palermo', zona: 'Palermo', provincia: 'Buenos Aires' },
  { barrio: 'Palermo Soho', zona: 'Palermo', provincia: 'Buenos Aires' },
  { barrio: 'Palermo Hollywood', zona: 'Palermo', provincia: 'Buenos Aires' },
  { barrio: 'Recoleta', zona: 'Recoleta', provincia: 'Buenos Aires' },
  { barrio: 'Belgrano', zona: 'Belgrano', provincia: 'Buenos Aires' },
  { barrio: 'Belgrano R', zona: 'Belgrano', provincia: 'Buenos Aires' },
  { barrio: 'Caballito', zona: 'Caballito', provincia: 'Buenos Aires' },
  { barrio: 'Villa Crespo', zona: 'Villa Crespo', provincia: 'Buenos Aires' },
  { barrio: 'Almagro', zona: 'Almagro', provincia: 'Buenos Aires' },
  { barrio: 'San Telmo', zona: 'San Telmo', provincia: 'Buenos Aires' },
  { barrio: 'Flores', zona: 'Flores', provincia: 'Buenos Aires' },
  { barrio: 'Villa Urquiza', zona: 'Villa Urquiza', provincia: 'Buenos Aires' },
  { barrio: 'Nunez', zona: 'Nunez', provincia: 'Buenos Aires' },
  { barrio: 'Colegiales', zona: 'Colegiales', provincia: 'Buenos Aires' },
  { barrio: 'Barracas', zona: 'Barracas', provincia: 'Buenos Aires' },
  { barrio: 'Villa del Parque', zona: 'Villa del Parque', provincia: 'Buenos Aires' },
  { barrio: 'Devoto', zona: 'Devoto', provincia: 'Buenos Aires' },
  { barrio: 'Saavedra', zona: 'Saavedra', provincia: 'Buenos Aires' },
  { barrio: 'Boedo', zona: 'Boedo', provincia: 'Buenos Aires' },
  { barrio: 'Chacarita', zona: 'Chacarita', provincia: 'Buenos Aires' },
  { barrio: 'Villa Pueyrredon', zona: 'Villa Pueyrredon', provincia: 'Buenos Aires' },
  { barrio: 'Balvanera', zona: 'Balvanera', provincia: 'Buenos Aires' },
  { barrio: 'Parque Patricios', zona: 'Parque Patricios', provincia: 'Buenos Aires' },
  { barrio: 'Monte Castro', zona: 'Monte Castro', provincia: 'Buenos Aires' },
  // GBA
  { barrio: 'San Isidro Centro', zona: 'San Isidro', provincia: 'Buenos Aires' },
  { barrio: 'Martinez', zona: 'Martinez', provincia: 'Buenos Aires' },
  { barrio: 'Vicente Lopez', zona: 'Vicente Lopez', provincia: 'Buenos Aires' },
  { barrio: 'Olivos', zona: 'Olivos', provincia: 'Buenos Aires' },
  { barrio: 'Tigre Centro', zona: 'Tigre', provincia: 'Buenos Aires' },
  { barrio: 'Quilmes Centro', zona: 'Quilmes', provincia: 'Buenos Aires' },
  { barrio: 'Lomas de Zamora', zona: 'Lomas de Zamora', provincia: 'Buenos Aires' },
  { barrio: 'Moron Centro', zona: 'Moron', provincia: 'Buenos Aires' },
]

const preciosBase = {
  // CABA Premium
  'Palermo':           { 1: 420000, 2: 580000, 3: 820000, 4: 1100000 },
  'Recoleta':          { 1: 460000, 2: 640000, 3: 920000, 4: 1250000 },
  'Belgrano':          { 1: 440000, 2: 610000, 3: 880000, 4: 1180000 },
  'Nunez':             { 1: 400000, 2: 560000, 3: 800000, 4: 1050000 },
  'Colegiales':        { 1: 360000, 2: 490000, 3: 700000, 4: 940000  },
  // CABA Media
  'Caballito':         { 1: 320000, 2: 440000, 3: 630000, 4: 840000  },
  'Villa Crespo':      { 1: 300000, 2: 415000, 3: 590000, 4: 790000  },
  'Almagro':           { 1: 290000, 2: 395000, 3: 560000, 4: 750000  },
  'Chacarita':         { 1: 310000, 2: 430000, 3: 610000, 4: 820000  },
  'Villa Urquiza':     { 1: 305000, 2: 420000, 3: 600000, 4: 800000  },
  'Saavedra':          { 1: 295000, 2: 405000, 3: 580000, 4: 770000  },
  'Devoto':            { 1: 280000, 2: 385000, 3: 550000, 4: 730000  },
  'Boedo':             { 1: 270000, 2: 370000, 3: 530000, 4: 710000  },
  'San Telmo':         { 1: 295000, 2: 410000, 3: 580000, 4: 780000  },
  'Villa del Parque':  { 1: 265000, 2: 365000, 3: 520000, 4: 690000  },
  'Villa Pueyrredon':  { 1: 255000, 2: 350000, 3: 500000, 4: 670000  },
  // CABA Económica
  'Flores':            { 1: 240000, 2: 330000, 3: 470000, 4: 630000  },
  'Barracas':          { 1: 220000, 2: 305000, 3: 435000, 4: 580000  },
  'Balvanera':         { 1: 230000, 2: 315000, 3: 450000, 4: 600000  },
  'Parque Patricios':  { 1: 215000, 2: 295000, 3: 420000, 4: 560000  },
  'Monte Castro':      { 1: 210000, 2: 290000, 3: 410000, 4: 550000  },
  // GBA Norte (Premium)
  'San Isidro':        { 1: 380000, 2: 530000, 3: 760000, 4: 1020000 },
  'Martinez':          { 1: 360000, 2: 500000, 3: 720000, 4: 960000  },
  'Vicente Lopez':     { 1: 350000, 2: 485000, 3: 695000, 4: 930000  },
  'Olivos':            { 1: 330000, 2: 460000, 3: 660000, 4: 880000  },
  // GBA Otros
  'Tigre':             { 1: 220000, 2: 305000, 3: 435000, 4: 580000  },
  'Quilmes':           { 1: 190000, 2: 265000, 3: 375000, 4: 500000  },
  'Lomas de Zamora':   { 1: 185000, 2: 255000, 3: 365000, 4: 485000  },
  'Moron':             { 1: 200000, 2: 275000, 3: 390000, 4: 520000  },
}

const variacion = (base, pct) => {
  const factor = 1 + (Math.random() * pct * 2 - pct) / 100
  return Math.round(base * factor)
}

const seed = async () => {
  console.log('Limpiando datos anteriores...')
  await db.query("TRUNCATE TABLE propiedades")

  let total = 0

  for (const { barrio, zona, provincia } of zonas) {
    const precios = preciosBase[zona] || preciosBase['Caballito']

    for (const ambientes of [1, 2, 3, 4]) {
      const base = precios[ambientes]
      if (!base) continue

      for (let i = 0; i < 5; i++) {
        const precio = variacion(base, 22)
        const superficie = ambientes * 28 + Math.round(Math.random() * 25)
        const moneda = Math.random() < 0.08 ? 'USD' : 'ARS'

        await db.query(
          `INSERT INTO propiedades 
            (portal, precio, moneda, tipo, ambientes, superficie_m2, barrio, zona, provincia, url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          ['seed', precio, moneda, 'departamento', ambientes, superficie, barrio, zona, provincia,
           `https://ejemplo.com/${zona.toLowerCase().replace(/ /g, '-')}-${ambientes}amb-${i}`]
        )
        total++
      }
    }
  }

  console.log(`Listo. ${total} propiedades generadas.`)
  process.exit(0)
}

seed()