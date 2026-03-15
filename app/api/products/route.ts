import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Product } from '@/types'
import { isAdmin } from '@/lib/auth'

const dataFilePath = path.join(process.cwd(), 'data', 'products.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read products from file
function readProducts(): Product[] {
  ensureDataDirectory()
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

// Write products to file
function writeProducts(products: Product[]) {
  ensureDataDirectory()
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2))
}

// GET all products
export async function GET() {
  try {
    const products = readProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const products = readProducts()

    const newProduct: Product = {
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

    products.push(newProduct)
    writeProducts(products)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
