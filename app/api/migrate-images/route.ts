import { sql } from '@vercel/postgres'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST() {
    try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

        if (!fs.existsSync(uploadsDir)) {
            return NextResponse.json({ error: 'Uploads directory not found' }, { status: 404 })
        }

        const files = fs.readdirSync(uploadsDir)
        const results = []

        for (const filename of files) {
            if (filename.startsWith('.')) continue

            const filePath = path.join(uploadsDir, filename)
            const fileBuffer = fs.readFileSync(filePath)

            console.log(`Uploading ${filename}...`)

            // Upload to Vercel Blob
            const blob = await put(`uploads/${filename}`, fileBuffer, {
                access: 'public',
                contentType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg'
            })

            console.log(`Uploaded to ${blob.url}`)

            // Update Database
            const localPath = `/uploads/${filename}`
            const { rowCount } = await sql`
        UPDATE products 
        SET image = ${blob.url} 
        WHERE image = ${localPath}
      `

            results.push({
                filename,
                blobUrl: blob.url,
                updatedRows: rowCount
            })
        }

        return NextResponse.json({
            message: 'Migration complete',
            details: results
        })
    } catch (error) {
        console.error('Migration error:', error)
        return NextResponse.json({ error: 'Migration failed', details: error.message }, { status: 500 })
    }
}
