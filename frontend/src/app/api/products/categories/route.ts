import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Producto {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  categories: string[];
  subcategoria: string;
  descripcion: string;
  precio: number;
  precioAnterior: number | null;
  moneda: string;
  stock: number;
  activo: boolean;
  imagenes: string[];
  slug: string;
}

let products: Producto[] = [];

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

  const categoriesSet = new Set<string>();
  products.forEach((p: Producto) => {
    if (Array.isArray(p.categories)) {
      p.categories.forEach((cat: string) => categoriesSet.add(cat));
    }
  });
  return Array.from(categoriesSet).sort();
}

export async function GET() {
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
