'use client'

import { useState } from 'react'
import { BatchImageUpload, type ImageInfo } from '@/components/batch-image-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BatchImageUploadTest() {
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([])

  const handleImageInfoChange = (infos: ImageInfo[]) => {
    console.log('图片信息变化:', infos)
    // 这里可以进行额外的处理，比如数据验证、格式转换等
  }

  const handleClear = () => {
    setImageInfos([])
  }

  const handleLog = () => {
    console.log('当前图片信息:', imageInfos)
    console.table(imageInfos)
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>批量图片上传测试 - 新API</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='text-sm text-muted-foreground'>
            <p>新版本的组件现在直接通过 value 和 onChange 传递包含尺寸信息的图片数据。</p>
            <p>每个图片对象包含: key (图片标识)、width (宽度)、height (高度)</p>
          </div>

          <BatchImageUpload
            className='w-full'
            maxFileSize={5}
            maxFiles={10}
            onChange={setImageInfos}
            onImageInfoChange={handleImageInfoChange}
            value={imageInfos}
          />

          <div className='flex justify-between items-center'>
            <div className='text-sm text-muted-foreground'>已上传 {imageInfos.length} 张图片</div>
            <div className='space-x-2'>
              <Button disabled={imageInfos.length === 0} onClick={handleClear} variant='outline'>
                清空
              </Button>
              <Button disabled={imageInfos.length === 0} onClick={handleLog} variant='outline'>
                打印到控制台
              </Button>
            </div>
          </div>

          {/* 显示图片信息表格 */}
          {imageInfos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>图片信息表格</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b'>
                        <th className='text-left p-2'>#</th>
                        <th className='text-left p-2'>Key</th>
                        <th className='text-left p-2'>宽度</th>
                        <th className='text-left p-2'>高度</th>
                        <th className='text-left p-2'>比例</th>
                        <th className='text-left p-2'>类型</th>
                      </tr>
                    </thead>
                    <tbody>
                      {imageInfos.map((info, index) => (
                        <tr className='border-b' key={info.key}>
                          <td className='p-2'>{index + 1}</td>
                          <td className='p-2 font-mono text-xs'>{info.key}</td>
                          <td className='p-2'>{info.width || 'N/A'}</td>
                          <td className='p-2'>{info.height || 'N/A'}</td>
                          <td className='p-2'>
                            {info.width && info.height
                              ? (info.width / info.height).toFixed(2)
                              : 'N/A'}
                          </td>
                          <td className='p-2'>
                            {info.width && info.height
                              ? info.width > info.height
                                ? '横图'
                                : info.width < info.height
                                  ? '竖图'
                                  : '正方形'
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 显示原始JSON数据 */}
          {imageInfos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>原始数据 (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='bg-gray-50 p-4 rounded-md'>
                  <pre className='text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto'>
                    {JSON.stringify(imageInfos, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
