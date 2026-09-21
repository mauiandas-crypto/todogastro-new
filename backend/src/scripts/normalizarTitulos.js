const fs = require('fs');
const path = require('path');

// Reglas de normalización de títulos
const normalizationRules = [
  // Variantes de fritador → Fritador
  { pattern: /\bfritador\s+freid(ora|oras?)\b/gi, replacement: 'Fritador' },
  { pattern: /\bfreid(ora|oras?)\s+fritador\b/gi, replacement: 'Fritador' },
  { pattern: /\bfreid(ora|oras?)\b/gi, replacement: 'Fritador' },
  { pattern: /\bfritadora\b/gi, replacement: 'Fritador' },

  // Variantes de cámaras
  { pattern: /camara\s+frigor[ií]fica/gi, replacement: 'Cámara Frigorífica' },
  { pattern: /camara\s+de\s+refrigeracion/gi, replacement: 'Cámara de Refrigeración' },
  { pattern: /camara\s+de\s+crecimiento/gi, replacement: 'Cámara de Crecimiento' },
  { pattern: /\bcamara\b/gi, replacement: 'Cámara' },

  // Variantes de freezer
  { pattern: /freezer\s+heladera/gi, replacement: 'Freezer' },
  { pattern: /heladera\s+freezer/gi, replacement: 'Freezer' },

  // Normalizar "electrico/eléctrico"
  { pattern: /\belectrico\b/gi, replacement: 'Eléctrico' },
  { pattern: /\belectrica\b/gi, replacement: 'Eléctrica' },

  // Variantes de anafe/cocinilla
  { pattern: /anafe\s+cocinilla/gi, replacement: 'Anafe' },
  { pattern: /cocinilla\s+anafe/gi, replacement: 'Anafe' },

  // Embutidora
  { pattern: /embutidora\s+vertical\s+automatica/gi, replacement: 'Embutidora Vertical Automática' },

  // Sandwichera
  { pattern: /sandwichera\s+electrica\s+grillada\s+c\s+doble/gi, replacement: 'Sandwichera Eléctrica Grillada Doble' },
  { pattern: /sandwichera\s+electrica\s+grillada/gi, replacement: 'Sandwichera Eléctrica Grillada' },

  // Normalizar tildes
  { pattern: /\balgod[oó]n\b/gi, replacement: 'Algodón' },
  { pattern: /\bmonofas[íi]ca\b/gi, replacement: 'Monofásica' },
  { pattern: /\bautomatic[ao]\b/gi, replacement: 'Automática' },
  { pattern: /\brefrigerado\b/gi, replacement: 'Refrigerado' },

  // Limpiar espacios múltiples
  { pattern: /\s{2,}/g, replacement: ' ' }
];

function normalizeTitle(title) {
  let normalized = title.trim();

  for (const rule of normalizationRules) {
    normalized = normalized.replace(rule.pattern, rule.replacement);
  }

  // Limpiar espacios finales
  normalized = normalized.trim();

  // Capitalizar primera letra de cada palabra, excepto palabras pequeñas
  normalized = normalized
    .split(' ')
    .map((word, idx) => {
      const lowerWords = ['de', 'con', 'a', 'x', 'el', 'la', 'los', 'las', 'en', 'por', 'para', 'sin', 'entre'];
      if (idx > 0 && lowerWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return normalized;
}

// Leer productos.json
const productsPath = path.join(__dirname, '../data/productos.json');
const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`📝 Normalizando ${data.length} títulos de productos...`);

let changeCount = 0;
const changes = [];

// Normalizar cada título
data.forEach(producto => {
  const originalNombre = producto.nombre;
  const normalizedNombre = normalizeTitle(originalNombre);

  if (originalNombre !== normalizedNombre) {
    changeCount++;
    changes.push({
      id: producto.id,
      antes: originalNombre,
      despues: normalizedNombre
    });
    producto.nombre = normalizedNombre;
  }
});

// Guardar el archivo actualizado
fs.writeFileSync(productsPath, JSON.stringify(data, null, 2));

console.log(`✅ ${changeCount} títulos fueron normalizados`);
console.log('\n📋 Primeras 10 cambios:');
changes.slice(0, 10).forEach(change => {
  console.log(`\n  ID: ${change.id}`);
  console.log(`  Antes:  ${change.antes}`);
  console.log(`  Después: ${change.despues}`);
});

if (changes.length > 10) {
  console.log(`\n... y ${changes.length - 10} cambios más`);
}

console.log(`\n✨ Archivo actualizado: ${productsPath}`);
