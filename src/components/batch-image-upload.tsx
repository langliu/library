'use client'

import { IconCamera, IconTrash, IconUpload, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface UploadedImage {
  id: string
  file: File
  url: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  key?: string
  width?: number
  height?: number
}

export interface ImageInfo {
  key: string
  width?: number
  height?: number
}

interface BatchImageUploadProps {
  value?: ImageInfo[]
  onChange: (imageInfos: ImageInfo[]) => void
  onImageInfoChange?: (imageInfos: ImageInfo[]) => void
  disabled?: boolean
  className?: string
  maxFiles?: number
  maxFileSize?: number // MB
  accept?: string
  prefix?: string
}

export function BatchImageUpload({
  value = [],
  onChange,
  onImageInfoChange,
  disabled = false,
  className,
  maxFiles = 10,
  maxFileSize = 10,
  accept = 'image/*',
  prefix = 'batch',
}: BatchImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  // 获取图片尺寸
  const getImageDimensions = useCallback(
    (file: File): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        const url = URL.createObjectURL(file)

        img.onload = () => {
          URL.revokeObjectURL(url)
          resolve({
            height: img.naturalHeight,
            width: img.naturalWidth,
          })
        }

        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('无法读取图片尺寸'))
        }

        img.src = url
      })
    },
    [],
  )

  // 验证文件
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith('image/')) {
        return '请选择图片文件'
      }
      if (file.size > maxFileSize * 1024 * 1024) {
        return `图片大小不能超过${maxFileSize}MB`
      }
      return null
    },
    [maxFileSize],
  )

  // 上传单个文件
  const uploadFile = useCallback(
    async (image: UploadedImage) => {
      try {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, progress: 0, status: 'uploading' } : img,
          ),
        )

        const formData = new FormData()
        formData.append('file', image.file)
        formData.append('prefix', prefix)

        const response = await fetch('/api/upload', {
          body: formData,
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('上传失败')
        }

        const data = await response.json()

        setImages((prev) => {
          const updated = prev.map((img) =>
            img.id === image.id
              ? { ...img, key: data.key, progress: 100, status: 'success' as const }
              : img,
          )

          // 更新外部状态
          const newImageInfos = updated
            .filter((img) => img.key)
            .map((img) => ({
              height: img.height,
              key: img.key as string,
              width: img.width,
            }))

          // 合并现有的和新的图片信息，避免重复
          const existingKeys = value.map((info) => info.key)
          const uniqueNewInfos = newImageInfos.filter((info) => !existingKeys.includes(info.key))
          const allImageInfos = [...value, ...uniqueNewInfos]

          onChange(allImageInfos)

          // 如果有回调函数，传递图片信息
          if (onImageInfoChange) {
            onImageInfoChange(allImageInfos)
          }

          return updated
        })
      } catch (error) {
        console.error('上传失败:', error)
        setImages((prev) =>
          prev.map((img) => (img.id === image.id ? { ...img, progress: 0, status: 'error' } : img)),
        )
        toast.error(`${image.file.name} 上传失败`)
      }
    },
    [onChange, value, prefix, onImageInfoChange],
  )

  // 添加文件
  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const currentCount = images.length + value.length

      if (currentCount + fileArray.length > maxFiles) {
        toast.error(`最多只能上传${maxFiles}张图片`)
        return
      }

      const newImages: UploadedImage[] = []

      for (const file of fileArray) {
        const error = validateFile(file)
        if (error) {
          toast.error(`${file.name}: ${error}`)
          continue
        }

        const id = Math.random().toString(36).substring(2, 11)
        const url = URL.createObjectURL(file)

        try {
          // 获取图片尺寸
          const dimensions = await getImageDimensions(file)

          newImages.push({
            file,
            height: dimensions.height,
            id,
            progress: 0,
            status: 'pending',
            url,
            width: dimensions.width,
          })
        } catch (error) {
          console.warn(`无法获取图片 ${file.name} 的尺寸:`, error)
          // 即使无法获取尺寸也继续添加文件
          newImages.push({
            file,
            id,
            progress: 0,
            status: 'pending',
            url,
          })
        }
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages])
        // 自动开始上传
        newImages.forEach((image) => {
          setTimeout(() => uploadFile(image), 100)
        })
      }
    },
    [images.length, value.length, maxFiles, validateFile, uploadFile, getImageDimensions],
  )

  // 文件选择处理
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files) {
        addFiles(files)
      }
      // 清空input值，允许重复选择同一文件
      event.target.value = ''
    },
    [addFiles],
  )

  // 拖拽处理
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragOver(false)

      const files = event.dataTransfer.files
      if (files) {
        addFiles(files)
      }
    },
    [addFiles],
  )

  // 移除图片
  const removeImage = useCallback(
    (id: string) => {
      setImages((prev) => {
        const imageToRemove = prev.find((img) => img.id === id)
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.url)
          // 如果已上传成功，从外部状态中移除
          if (imageToRemove.key) {
            onChange(value.filter((info) => info.key !== imageToRemove.key))
          }
        }
        return prev.filter((img) => img.id !== id)
      })
    },
    [onChange, value],
  )

  // 移除已上传的图片
  const removeUploadedImage = useCallback(
    (key: string) => {
      onChange(value.filter((info) => info.key !== key))
    },
    [onChange, value],
  )

  // 清空所有
  const clearAll = useCallback(() => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.url)
    })
    setImages([])
    onChange([])
  }, [images, onChange])

  const totalImages = images.length + value.length
  const isUploading = images.some((img) => img.status === 'uploading')

  return (
    <div className={cn('space-y-4', className)}>
      {/* 上传区域 */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragOver && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        onClick={() => {
          if (!disabled) {
            document.getElementById('batch-image-upload')?.click()
          }
        }}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <IconCamera className='h-12 w-12 text-muted-foreground mb-4' />
          <div className='text-center'>
            <p className='text-lg font-medium mb-2'>点击选择图片或拖拽图片到此处</p>
            <p className='text-sm text-muted-foreground'>
              支持 JPG、PNG 格式，单个文件最大 {maxFileSize}MB，最多 {maxFiles} 张图片
            </p>
            <p className='text-sm text-muted-foreground mt-1'>
              当前已选择: {totalImages}/{maxFiles}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 隐藏的文件输入 */}
      <input
        accept={accept}
        className='hidden'
        disabled={disabled}
        id='batch-image-upload'
        multiple
        onChange={handleFileSelect}
        type='file'
      />

      {/* 图片预览区域 */}
      {(images.length > 0 || value.length > 0) && (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-lg'>图片预览</CardTitle>
            <Button disabled={disabled} onClick={clearAll} size='sm' variant='outline'>
              <IconTrash className='mr-2 h-4 w-4' />
              清空所有
            </Button>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {/* 已上传的图片 */}
              {value.map((imageInfo) => (
                <div className='relative group' key={imageInfo.key}>
                  <div
                    className='aspect-square rounded-lg overflow-hidden border relative'
                    data-key={imageInfo.key}
                    data-url={`/api/image/${imageInfo.key}`}
                  >
                    <Image
                      alt='已上传图片'
                      className='object-cover'
                      fill
                      sizes='100px'
                      src={`${location.origin}/api/image/${imageInfo.key}`}
                    />
                  </div>

                  {/* 图片尺寸信息 */}
                  {imageInfo.width && imageInfo.height && (
                    <div className='absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded'>
                      {imageInfo.width} × {imageInfo.height}
                    </div>
                  )}

                  <Button
                    className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                    disabled={disabled}
                    onClick={() => removeUploadedImage(imageInfo.key)}
                    size='icon'
                    variant='destructive'
                  >
                    <IconX className='h-4 w-4' />
                  </Button>
                  <div className='absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded'>
                    已上传
                  </div>
                </div>
              ))}

              {/* 正在上传的图片 */}
              {images.map((image) => (
                <div className='relative group' key={image.id}>
                  <div className='aspect-square rounded-lg overflow-hidden border relative'>
                    <Image alt={image.file.name} className='object-cover' fill src={image.url} />
                  </div>
                  <Button
                    className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                    disabled={disabled || image.status === 'uploading'}
                    onClick={() => removeImage(image.id)}
                    size='icon'
                    variant='destructive'
                  >
                    <IconX className='h-4 w-4' />
                  </Button>

                  {/* 图片尺寸信息 */}
                  {image.width && image.height && (
                    <div className='absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded'>
                      {image.width} × {image.height}
                    </div>
                  )}

                  {/* 状态指示器 */}
                  <div className='absolute bottom-2 left-2'>
                    {image.status === 'pending' && (
                      <div className='bg-gray-500 text-white text-xs px-2 py-1 rounded'>
                        等待上传
                      </div>
                    )}
                    {image.status === 'uploading' && (
                      <div className='bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center'>
                        <IconUpload className='h-3 w-3 mr-1 animate-spin' />
                        上传中
                      </div>
                    )}
                    {image.status === 'success' && (
                      <div className='bg-green-500 text-white text-xs px-2 py-1 rounded'>
                        上传成功
                      </div>
                    )}
                    {image.status === 'error' && (
                      <div className='bg-red-500 text-white text-xs px-2 py-1 rounded'>
                        上传失败
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 上传状态提示 */}
      {isUploading && (
        <div className='text-sm text-muted-foreground flex items-center'>
          <IconUpload className='h-4 w-4 mr-2 animate-spin' />
          正在上传图片，请稍候...
        </div>
      )}
    </div>
  )
}
