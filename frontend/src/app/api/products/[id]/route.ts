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

function getProductById(id: string) {
  if (products.length === 0) {
    loadProductsFromCache();
  }

  const p = products.find(p => p.id === id);
  if (!p) return null;

  return {
    id: p.id,
    sku: p.sku,
    name: p.nombre,
    category: p.categoria ? p.categoria.split(' > ')[0] : 'Sin categoría',
    categories: p.categories,
    description: p.descripcion,
    price: p.precio,
    currency: p.moneda,
    in_stock: p.stock > 0,
    stock_quantity: p.stock,
    images: (p.imagenes || []).map(img => ({
      src: img,
      alt: p.nombre
    })),
    url: `/producto/${p.id}`
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
