import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { Product } from '@/types'
import { isAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await sql<Product>`SELECT * FROM products WHERE id = ${params.id}`

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()

    // Check if product exists
    const { rows } = await sql<Product>`SELECT * FROM products WHERE id = ${params.id}`
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const existing = rows[0]

    const updated = {
      name: body.name ?? existing.name,
      description: body.description ?? existing.description,
      price: 'price' in body ? (parseFloat(body.price) || 0) : existing.price,
      image: body.image ?? existing.image,
      category: body.category ?? existing.category,
      subCategory: body.subCategory ?? existing.subCategory,
      itemType: body.itemType ?? existing.itemType,
      size: body.size ?? existing.size,
      color: body.color ?? existing.color,
      stock: 'stock' in body ? (parseInt(body.stock) || 0) : existing.stock,
    }

    await sql`
      UPDATE products SET
        name = ${updated.name},
        description = ${updated.description},
        price = ${updated.price},
        image = ${updated.image},
        category = ${updated.category},
        "subCategory" = ${updated.subCategory},
        "itemType" = ${updated.itemType},
        size = ${updated.size},
        color = ${updated.color},
        stock = ${updated.stock}
      WHERE id = ${params.id}
    `

    return NextResponse.json({ id: params.id, ...updated })
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const result = await sql`DELETE FROM products WHERE id = ${params.id}`

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
