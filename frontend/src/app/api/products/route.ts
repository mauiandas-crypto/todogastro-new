import { NextRequest, NextResponse } from 'next/server';
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

interface Filters {
  page?: string | null;
  limit?: string | null;
  category?: string | null;
  search?: string | null;
}

let products: Producto[] = [];

function loadProductsFromCache() {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/productos.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      products = JSON.parse(data);
      console.log(`✅ Cargados ${products.length} productos del caché`);
      return true;
    }
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
  }
  return false;
}

function getProducts(filters: Filters = {}) {
  if (products.length === 0 || filters.category) {
    loadProductsFromCache();
  }

  let filtered = [...products];

  if (filters.category) {
    const categoryFilter = filters.category.toLowerCase();
    filtered = filtered.filter(p => {
      if (p.categories && Array.isArray(p.categories)) {
        return p.categories.some((cat: string) =>
          cat.toLowerCase().includes(categoryFilter)
        );
      } else if (p.categoria) {
        return p.categoria.toLowerCase().includes(categoryFilter);
      }
      return false;
    });
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    );
  }

  const page = Math.max(1, parseInt(filters.page ?? '1'));
  const limit = Math.min(100, parseInt(filters.limit ?? '20'));
  const start = (page - 1) * limit;

  const paginated = filtered.slice(start, start + limit);

  const transformed = paginated.map((p: Producto) => ({
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
    images: (p.imagenes || []).map((img: string) => ({
      src: img,
      alt: p.nombre
    })),
    url: `/producto/${p.id}`
  }));

  return {
    data: transformed,
    pagination: {
      page,
      limit,
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit)
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      category: searchParams.get('category'),
      search: searchParams.get('search')
    };

    const result = getProducts(filters);

    return NextResponse.json({
      products: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
