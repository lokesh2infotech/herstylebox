import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { Product } from '@/types'
import { isAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { rows } = await sql<Product>`SELECT * FROM products ORDER BY name ASC`
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()

    const newProduct = {
      id: Date.now().toString(),
      name: body.name || 'Untitled Product',
      description: body.description || '',
      price: parseFloat(body.price) || 0,
      image: body.image || '',
      category: body.category || '',
      subCategory: body.subCategory || '',
      itemType: body.itemType || '',
      size: body.size || '',
      color: body.color || '',
      stock: parseInt(body.stock) || 0,
    }

    await sql`
      INSERT INTO products (
        id, name, description, price, image, category, "subCategory", "itemType", size, color, stock
      ) VALUES (
        ${newProduct.id}, ${newProduct.name}, ${newProduct.description}, ${newProduct.price}, 
        ${newProduct.image}, ${newProduct.category}, ${newProduct.subCategory}, ${newProduct.itemType}, 
        ${newProduct.size}, ${newProduct.color}, ${newProduct.stock}
      )
    `

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
