'use client'

import { IconCamera, IconUpload, IconX } from '@tabler/icons-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
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
  const [dragOver, setDragOver] = useState(false)

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) return

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件')
        return
      }

      // 验证文件大小 (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('图片大小不能超过2MB')
        return
      }

      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)

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

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleUpload(file)
      }
    },
    [handleUpload],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setDragOver(false)

      const file = event.dataTransfer.files?.[0]
      if (file) {
        handleUpload(file)
      }
    },
    [handleUpload],
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
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
              onClick={() => document.getElementById('avatar-upload')?.click()}
              size='sm'
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
              <Button disabled={disabled} onClick={handleRemove} size='sm' variant='outline'>
                <IconX className='mr-2 h-4 w-4' />
                移除
              </Button>
            )}
          </div>
          <p className='text-sm text-muted-foreground'>支持 JPG、PNG 格式，最大 2MB</p>
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        accept='image/*'
        className='hidden'
        disabled={disabled || isUploading}
        id='avatar-upload'
        onChange={handleFileSelect}
        type='file'
      />
    </div>
  )
}
