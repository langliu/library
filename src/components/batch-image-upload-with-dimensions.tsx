'use client'

import { useState } from 'react'
import { BatchImageUpload, type ImageInfo } from '@/components/batch-image-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BatchImageUploadWithDimensions() {
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([])

  const handleClear = () => {
    setImageInfos([])
  }

  const handleImageInfoChange = (infos: ImageInfo[]) => {
    setImageInfos(infos)
    console.log('图片尺寸信息更新:', infos)
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>批量图片上传 - 包含尺寸信息</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <BatchImageUpload
            className='w-full'
            maxFileSize={10}
            maxFiles={15}
            onChange={handleImageInfoChange}
            value={imageInfos}
          />

          <div className='flex justify-between items-center'>
            <div className='text-sm text-muted-foreground'>
              已上传 {imageInfos.length} 张图片
              {imageInfos.length > 0 && ` (${imageInfos.length} 张包含尺寸信息)`}
            </div>
            <Button disabled={imageInfos.length === 0} onClick={handleClear} variant='outline'>
              清空所有
            </Button>
          </div>

          {/* 显示图片尺寸统计 */}
          {imageInfos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>图片尺寸统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {imageInfos.map((info, index) => (
                    <div className='border rounded-lg p-3' key={info.key}>
                      <div className='text-sm font-medium mb-2'>图片 {index + 1}</div>
                      <div className='text-xs text-muted-foreground space-y-1'>
                        <div>Key: {info.key}</div>
                        {info.width && info.height && (
                          <>
                            <div>
                              尺寸: {info.width} × {info.height}
                            </div>
                            <div>比例: {(info.width / info.height).toFixed(2)}</div>
                            <div>
                              类型:{' '}
                              {info.width > info.height
                                ? '横图'
                                : info.width < info.height
                                  ? '竖图'
                                  : '正方形'}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 显示原始数据 */}
          {imageInfos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>原始数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium mb-2'>图片信息 (包含尺寸):</h4>
                    <div className='bg-gray-50 p-3 rounded-md'>
                      <pre className='text-xs text-gray-600 whitespace-pre-wrap'>
                        {JSON.stringify(imageInfos, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
