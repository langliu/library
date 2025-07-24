'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { BatchImageUpload, type ImageInfo } from '@/components/batch-image-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BatchImageUploadExample() {
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (imageInfos.length === 0) {
      toast.error('请至少上传一张图片')
      return
    }

    setIsSubmitting(true)
    try {
      // 这里可以调用API保存图片信息
      const response = await fetch('/api/save-images', {
        body: JSON.stringify({
          images: imageInfos,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      toast.success('图片保存成功！')
      setImageInfos([]) // 清空已上传的图片
    } catch (error) {
      console.error('保存失败:', error)
      toast.error('保存失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>批量图片上传示例</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <BatchImageUpload
            className='w-full'
            maxFileSize={10}
            maxFiles={20}
            onChange={setImageInfos}
            value={imageInfos}
          />

          <div className='flex justify-between items-center'>
            <div className='text-sm text-muted-foreground'>已上传 {imageInfos.length} 张图片</div>
            <div className='space-x-2'>
              <Button
                disabled={imageInfos.length === 0 || isSubmitting}
                onClick={() => setImageInfos([])}
                variant='outline'
              >
                重置
              </Button>
              <Button disabled={imageInfos.length === 0 || isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? '保存中...' : '保存图片'}
              </Button>
            </div>
          </div>

          {/* 显示已上传图片的信息 */}
          {imageInfos.length > 0 && (
            <div className='mt-4 space-y-4'>
              <div>
                <h3 className='text-sm font-medium mb-2'>图片详细信息 (包含尺寸):</h3>
                <div className='bg-gray-50 p-3 rounded-md'>
                  <pre className='text-xs text-gray-600 whitespace-pre-wrap'>
                    {JSON.stringify(imageInfos, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
