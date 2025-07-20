'use client'

import { IconCamera, IconUpload, IconX } from '@tabler/icons-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { ImageCropper } from '@/components/image-cropper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
}

export function AvatarUpload({ value, onChange, disabled = false, className }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropOpen, setCropOpen] = useState(false)

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) return

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件')
        return
      }

      // 验证文件大小 (2MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('图片大小不能超过10MB')
        return
      }

      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('prefix', 'avatar')

        console.log('formData', formData.values())

        const response = await fetch('/api/upload', {
          body: formData,
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('上传失败')
        }

        const data = await response.json()
        onChange(data.key)

        toast.success('头像上传成功')
      } catch (error) {
        console.error('上传失败:', error)
        toast.error('头像上传失败，请重试')
      } finally {
        setIsUploading(false)
      }
    },
    [onChange],
  )

  // 裁剪完成后上传
  const handleCropComplete = useCallback(
    async (croppedFile: File) => {
      setCropOpen(false)
      setCropFile(null)
      await handleUpload(croppedFile)
    },
    [handleUpload],
  )

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('图片大小不能超过10MB')
        return
      }
      setCropFile(file)
      setCropOpen(true)
    }
  }, [])

  const handleRemove = useCallback(() => {
    onChange('')
  }, [onChange])

  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex items-center space-x-4'>
        <Avatar className='h-20 w-20'>
          <AvatarImage alt='头像' src={value ? `/api/image/${value}` : ''} />
          <AvatarFallback>
            <IconCamera className='h-8 w-8 text-muted-foreground' />
          </AvatarFallback>
        </Avatar>
        <div className='space-y-2'>
          <div className='flex space-x-2'>
            <Button
              disabled={disabled || isUploading}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                document.getElementById('avatar-upload')?.click()
              }}
              size='sm'
              type='button'
              variant='outline'
            >
              {isUploading ? (
                <>
                  <IconUpload className='mr-2 h-4 w-4 animate-spin' />
                  上传中...
                </>
              ) : (
                <>
                  <IconCamera className='mr-2 h-4 w-4' />
                  选择图片
                </>
              )}
            </Button>
            {value && (
              <Button
                disabled={disabled}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemove()
                }}
                size='sm'
                type='button'
                variant='outline'
              >
                <IconX className='mr-2 h-4 w-4' />
                移除
              </Button>
            )}
          </div>
          <p className='text-sm text-muted-foreground'>支持 JPG、PNG 格式，最大 10MB</p>
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        accept='image/*'
        className='hidden'
        disabled={disabled || isUploading}
        id='avatar-upload'
        onChange={handleFileSelect}
        onClick={(e) => e.stopPropagation()}
        type='file'
      />
      {/* 裁剪弹窗 */}
      {cropFile && (
        <ImageCropper
          file={cropFile}
          isOpen={cropOpen}
          onCancel={() => {
            setCropOpen(false)
            setCropFile(null)
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  )
}
