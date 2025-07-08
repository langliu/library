import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { s3Client } from '@/lib/s3'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

    await s3Client.send(
      new PutObjectCommand({
        Body: buffer,
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentType: file.type,
        Key: filename,
      }),
    )

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`

    return NextResponse.json({
      filetype: file.type,
      key: filename,
      url: fileUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
