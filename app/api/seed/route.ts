import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import { Product } from '@/types'

export async function POST() {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Create Products Table
        await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        image VARCHAR(500),
        category VARCHAR(255),
        "subCategory" VARCHAR(255),
        "itemType" VARCHAR(255),
        size VARCHAR(255),
        color VARCHAR(255),
        stock INTEGER NOT NULL DEFAULT 0
      )
    `

        // 2. Create Customers Table
        await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255),
        address TEXT
      )
    `

        // 3. Create Orders Table
        await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        total_price NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

        // 4. Create Order Items Table
        await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id VARCHAR(255) REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price_at_purchase NUMERIC(10, 2) NOT NULL
      )
    `

        // Seed Data
        const dataFilePath = path.join(process.cwd(), 'data', 'products.json')
        if (fs.existsSync(dataFilePath)) {
            const data = fs.readFileSync(dataFilePath, 'utf-8')
            const products: Product[] = JSON.parse(data)

            for (const p of products) {
                await sql`
          INSERT INTO products (
            id, name, description, price, image, category, "subCategory", "itemType", size, color, stock
          ) VALUES (
            ${p.id}, ${p.name}, ${p.description || ''}, ${Number(p.price) || 0}, ${p.image || ''},
            ${p.category || ''}, ${p.subCategory || ''}, ${p.itemType || ''}, ${p.size || ''}, ${p.color || ''}, ${Number(p.stock) || 0}
          )
          ON CONFLICT (id) DO NOTHING
        `
            }
        }

        return NextResponse.json({ message: 'Database migrated successfully' })
    } catch (error) {
        console.error('Migration error:', error)
        return NextResponse.json({ error: 'Failed to migrate database' }, { status: 500 })
    }
}
