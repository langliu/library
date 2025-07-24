'use client'

import { useState } from 'react'
import { BatchImageUpload, type ImageInfo } from '@/components/batch-image-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BatchImageUploadDemo() {
  const [albumImages, setAlbumImages] = useState<ImageInfo[]>([])
  const [productImages, setProductImages] = useState<ImageInfo[]>([])

  return (
    <div className='space-y-8'>
      {/* 相册图片上传示例 */}
      <Card>
        <CardHeader>
          <CardTitle>相册图片上传</CardTitle>
        </CardHeader>
        <CardContent>
          <BatchImageUpload
            className='w-full'
            maxFileSize={20}
            maxFiles={50}
            onChange={setAlbumImages}
            value={albumImages}
          />
          <div className='mt-4 text-sm text-muted-foreground'>
            已上传 {albumImages.length} 张相册图片
          </div>
        </CardContent>
      </Card>

      {/* 产品图片上传示例 */}
      <Card>
        <CardHeader>
          <CardTitle>产品图片上传</CardTitle>
        </CardHeader>
        <CardContent>
          <BatchImageUpload
            className='w-full'
            maxFileSize={5}
            maxFiles={10}
            onChange={setProductImages}
            value={productImages}
          />
          <div className='mt-4 text-sm text-muted-foreground'>
            已上传 {productImages.length} 张产品图片
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className='flex justify-center space-x-4'>
        <Button
          disabled={albumImages.length === 0 && productImages.length === 0}
          onClick={() => {
            setAlbumImages([])
            setProductImages([])
          }}
          variant='outline'
        >
          清空所有图片
        </Button>
        <Button
          disabled={albumImages.length === 0 && productImages.length === 0}
          onClick={() => {
            console.log('相册图片:', albumImages)
            console.log('产品图片:', productImages)
          }}
        >
          查看上传结果
        </Button>
      </div>

      {/* 显示上传结果 */}
      {(albumImages.length > 0 || productImages.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>上传结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {albumImages.length > 0 && (
                <div>
                  <h4 className='font-medium mb-2'>相册图片 ({albumImages.length}张):</h4>
                  <div className='bg-gray-50 p-3 rounded-md'>
                    <pre className='text-xs text-gray-600 whitespace-pre-wrap'>
                      {JSON.stringify(albumImages, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              {productImages.length > 0 && (
                <div>
                  <h4 className='font-medium mb-2'>产品图片 ({productImages.length}张):</h4>
                  <div className='bg-gray-50 p-3 rounded-md'>
                    <pre className='text-xs text-gray-600 whitespace-pre-wrap'>
                      {JSON.stringify(productImages, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
