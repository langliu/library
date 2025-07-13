import { NextResponse } from 'next/server'
import { generateDownloadUrl } from '@/lib/s3'

export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params
    const decodedKey = decodeURIComponent(key)

    // 生成预签名 URL
    const url = await generateDownloadUrl(decodedKey)

    // 重定向到预签名 URL
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Image access error:', error)
    return NextResponse.json({ error: 'Failed to access image' }, { status: 500 })
  }
}
