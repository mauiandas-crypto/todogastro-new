import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let products: any[] = [];

function loadProductsFromCache() {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/productos.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      products = JSON.parse(data);
      return true;
    }
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
  }
  return false;
}

function getCategories() {
  if (products.length === 0) {
    loadProductsFromCache();
  }

  const categoriesSet = new Set();
  products.forEach(p => {
    if (Array.isArray(p.categories)) {
      p.categories.forEach(cat => categoriesSet.add(cat));
    }
  });
  return Array.from(categoriesSet).sort();
}

export async function GET(request: NextRequest) {
  try {
    const categories = getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
