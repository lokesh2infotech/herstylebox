import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    return NextResponse.json({
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        postgresUrlPrefix: process.env.POSTGRES_URL ? process.env.POSTGRES_URL.substring(0, 20) + '...' : 'none',
        blobTokenPrefix: process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 10) + '...' : 'none',
        nodeEnv: process.env.NODE_ENV
    })
}
