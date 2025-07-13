import { NextResponse } from 'next/server'
import { generateDownloadUrl } from '@/lib/s3'

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    const decodedPath = path.map((segment) => decodeURIComponent(segment)).join('/')
    // 生成预签名 URL
    const url = await generateDownloadUrl(decodedPath)

    // 返回图像数据，设置适当的响应头
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Image access error:', error)
    return NextResponse.json({ error: 'Failed to access image' }, { status: 500 })
  }
}
