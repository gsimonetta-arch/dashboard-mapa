/**
 * Generates public/geodata/europe-countries.geojson from world-atlas data.
 * Each feature gets a top-level `id` (ISO alpha-2 code) and a `countryCode`
 * property matching the stateCode used in the app's coverage store.
 *
 * Run with: node scripts/generate-europe-geojson.cjs
 */
const fs = require('fs')
const path = require('path')
const { feature } = require('topojson-client')

// Mapping: ISO 3166-1 numeric ID → ISO alpha-2 code
// Only European countries we care about (matches COUNTRY_CODES in webhookService.ts
// plus fallback countries seen in live data)
const NUMERIC_TO_ALPHA2 = {
  826: 'GB', // United Kingdom
  276: 'DE', // Germany
  250: 'FR', // France
  724: 'ES', // Spain
  380: 'IT', // Italy
  528: 'NL', // Netherlands
  616: 'PL', // Poland
   56: 'BE', // Belgium
  620: 'PT', // Portugal
  752: 'SE', // Sweden
  756: 'CH', // Switzerland
   40: 'AT', // Austria
  208: 'DK', // Denmark
  578: 'NO', // Norway
  246: 'FI', // Finland
  372: 'IE', // Ireland
  203: 'CZ', // Czech Republic
  642: 'RO', // Romania
  348: 'HU', // Hungary
  300: 'GR', // Greece
  807: 'MK', // North Macedonia
  498: 'MD', // Moldova
    8: 'AL', // Albania
  428: 'LV', // Latvia
  233: 'EE', // Estonia
  442: 'LU', // Luxembourg
  703: 'SK', // Slovakia
  705: 'SI', // Slovenia
  191: 'HR', // Croatia
  100: 'BG', // Bulgaria
  688: 'RS', // Serbia
  348: 'HU', // Hungary (duplicate guard)
  499: 'ME', // Montenegro
  070: 'BA', // Bosnia and Herzegovina
  008: 'AL', // Albania (numeric with leading zero)
  756: 'CH', // Switzerland (dup)
  438: 'LI', // Liechtenstein
  492: 'MC', // Monaco
  336: 'VA', // Vatican
  674: 'SM', // San Marino
  020: 'AD', // Andorra
}

const EUROPE_NUMERIC_IDS = new Set(Object.keys(NUMERIC_TO_ALPHA2).map(Number))

const topoPath = path.join(__dirname, '../node_modules/world-atlas/countries-50m.json')
const outPath  = path.join(__dirname, '../public/geodata/europe-countries.geojson')

const topo = JSON.parse(fs.readFileSync(topoPath, 'utf8'))
const world = feature(topo, topo.objects.countries)

const europeFeatures = world.features
  .filter(f => EUROPE_NUMERIC_IDS.has(Number(f.id)))
  .map(f => {
    const numericId = Number(f.id)
    const alpha2 = NUMERIC_TO_ALPHA2[numericId]
    return {
      ...f,
      id: alpha2,
      properties: {
        ...f.properties,
        countryCode: alpha2,
      },
    }
  })

const geojson = {
  type: 'FeatureCollection',
  features: europeFeatures,
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(geojson))
console.log(`Generated ${europeFeatures.length} European country features → ${outPath}`)
