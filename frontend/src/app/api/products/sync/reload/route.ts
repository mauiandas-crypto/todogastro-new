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
      console.log(`✅ Cargados ${products.length} productos`);
      return true;
    }
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    loadProductsFromCache();
    return NextResponse.json({
      success: true,
      message: 'Products reloaded from cache',
      productCount: products.length
    });
  } catch (error) {
    console.error('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
