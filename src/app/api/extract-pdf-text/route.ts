import { NextRequest, NextResponse } from 'next/server'
// Use internal path to avoid pdf-parse test file lookup (fails in serverless/Vercel)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse.js')

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const parsed = await pdfParse(buffer)
    return NextResponse.json({ text: parsed.text })
  } catch (e) {
    console.error('PDF text extract error:', e)
    return NextResponse.json({ error: 'Failed to extract PDF text' }, { status: 500 })
  }
}
