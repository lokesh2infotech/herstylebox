import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { customer, items, subtotal, tax, total } = body

        // 1. Insert or Update Customer
        // Check if customer exists by phone
        let customerId;
        const { rows: existingCustomers } = await sql`SELECT id FROM customers WHERE phone = ${customer.phone} LIMIT 1`

        if (existingCustomers.length > 0) {
            customerId = existingCustomers[0].id
            // Update details
            await sql`
        UPDATE customers 
        SET name = ${customer.name}, email = ${customer.email || null}, address = ${customer.address}
        WHERE id = ${customerId}
      `
        } else {
            const { rows: newCustomers } = await sql`
        INSERT INTO customers (name, phone, email, address)
        VALUES (${customer.name}, ${customer.phone}, ${customer.email || null}, ${customer.address})
        RETURNING id
      `
            customerId = newCustomers[0].id
        }

        // 2. Create Order
        const { rows: newOrders } = await sql`
      INSERT INTO orders (customer_id, total_price)
      VALUES (${customerId}, ${total})
      RETURNING id
    `
        const orderId = newOrders[0].id

        // 3. Insert Order Items and subtract stock
        for (const item of items) {
            await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${orderId}, ${item.id}, ${item.quantity || 1}, ${item.price})
      `

            // Attempt to decrement stock if product exists
            await sql`
        UPDATE products 
        SET stock = GREATEST(stock - ${(item.quantity || 1)}, 0)
        WHERE id = ${item.id}
      `
        }

        return NextResponse.json({ success: true, orderId }, { status: 201 })
    } catch (error) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
    }
}
