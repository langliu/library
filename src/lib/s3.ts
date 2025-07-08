import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION || 'ap-northeast-1',
})

/**
 * 生成上传预签名URL
 * @param key 文件key
 * @param contentType 文件类型
 * @returns 上传预签名URL
 */
export async function generateUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    ContentType: contentType,
    Key: key,
  })

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

/**
 * 生成下载预签名URL
 * @param key 文件key
 * @returns 下载预签名URL
 */
export async function generateDownloadUrl(key: string) {
  console.log('generateDownloadUrl', process.env.AWS_BUCKET_NAME, key)
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    // Range: process.env.AWS_REGION,
  })

  return await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5, // 5分钟内有效
  })
}
