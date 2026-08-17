const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Leer CSV
const csvPath = path.join(__dirname, '../data/productos.csv');
const fileContent = fs.readFileSync(csvPath, 'utf-8');

// Parsear CSV
const records = csv.parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  relax_quotes: true,
  relax_column_count: true
});

console.log(`Total de registros: ${records.length}`);
console.log('Procesando productos...');

// Procesar y limpiar productos (SIN FILTRO DE STOCK - todos los productos)
const productos = records
  .filter(r => r.Nombre && r.Nombre.trim())
  .map(r => {
    const nombre = r.Nombre?.trim() || '';
    const sku = r.SKU?.trim() || '';
    const categoria = r.Categorías?.trim() || 'Sin categoría';
    const precioNormal = parseFloat(r['Precio normal']?.replace(',', '.')) || 0;
    const precioRebajado = parseFloat(r['Precio rebajado']?.replace(',', '.')) || 0;
    const descripcion = r.Descripción?.trim() || '';
    const stock = parseInt(r['¿Existencias?']) || 0;
    const imagenes = r.Imágenes
      ?.split(',')
      .map(url => url.trim())
      .filter(url => url && url.startsWith('http')) || [];

    const moneda = r['Meta: _wm_currency_id']?.trim() === 'UYU' ? 'UYU' : 'USD';

    // Crear array de categorías para filtrado jerárquico
    const catParts = categoria.split(' > ').filter(c => c.trim());
    const categories = [];
    catParts.forEach((part, idx) => {
      categories.push(catParts.slice(0, idx + 1).join(' > '));
    });

    return {
      id: r.ID?.trim() || sku,
      sku,
      nombre,
      categoria,
      categories, // Array para filtrado
      subcategoria: catParts[1] || '',
      descripcion: descripcion.substring(0, 500),
      precio: precioNormal || precioRebajado,
      precioAnterior: precioRebajado && precioRebajado > 0 ? precioNormal : null,
      moneda,
      stock,
      activo: r.Publicado === '1',
      imagenes: imagenes.slice(0, 10),
      slug: nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    };
  });

console.log(`Productos procesados: ${productos.length}`);

// Agrupar por categoría principal
const categorias = {};
productos.forEach(p => {
  const catPrincipal = p.categoria.split(' > ')[0];
  if (!categorias[catPrincipal]) {
    categorias[catPrincipal] = [];
  }
  categorias[catPrincipal].push(p);
});

console.log('Categorías:', Object.keys(categorias));

// Guardar JSON
const outputPath = path.join(__dirname, '../data/productos.json');
fs.writeFileSync(outputPath, JSON.stringify(productos, null, 2));

const categoriasPath = path.join(__dirname, '../data/categorias.json');
fs.writeFileSync(categoriasPath, JSON.stringify(categorias, null, 2));

console.log(`✅ Guardado: ${outputPath}`);
console.log(`✅ Guardado: ${categoriasPath}`);
