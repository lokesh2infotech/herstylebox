import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Product } from '@/types'
import { isAdmin } from '@/lib/auth'

const dataFilePath = path.join(process.cwd(), 'data', 'products.json')

function readProducts(): Product[] {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
    return []
  }
  if (!fs.existsSync(dataFilePath)) {
    return []
  }
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeProducts(products: Product[]) {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2))
}

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const products = readProducts()
    const product = products.find(p => p.id === params.id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const products = readProducts()
    const index = products.findIndex(p => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const updatedProduct = {
      ...products[index],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }

    // Ensure numeric types
    if ('price' in body) {
      updatedProduct.price = parseFloat(body.price) || 0
    }
    if ('stock' in body) {
      updatedProduct.stock = parseInt(body.stock) || 0
    }

    products[index] = updatedProduct

    writeProducts(products)
    return NextResponse.json(products[index])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const products = readProducts()
    const filtered = products.filter(p => p.id !== params.id)

    if (products.length === filtered.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    writeProducts(filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
