'use client'

import { useCallback, useRef, useState } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { IconCheck, IconX } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ImageCropperProps {
  file: File
  onCropComplete: (croppedFile: File) => void
  onCancel: () => void
  isOpen: boolean
}

export function ImageCropper({ file, onCropComplete, onCancel, isOpen }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    height: 300,
    unit: 'px',
    width: 300,
    x: 0,
    y: 0,
  })
  const [imageSrc, setImageSrc] = useState<string>('')
  const imgRef = useRef<HTMLImageElement>(null)

  // 当文件改变时，创建图片URL
  useState(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  })

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: Crop): Promise<File> => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      // 计算裁剪区域
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = crop.width * scaleX
      canvas.height = crop.height * scaleY

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      )

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedFile = new File([blob], file.name, {
                lastModified: Date.now(),
                type: file.type,
              })
              resolve(croppedFile)
            }
          },
          file.type,
          0.9,
        )
      })
    },
    [file],
  )

  const handleCropComplete = useCallback(async () => {
    if (imgRef.current && crop.width && crop.height) {
      try {
        const croppedFile = await getCroppedImg(imgRef.current, crop)
        onCropComplete(croppedFile)
      } catch (error) {
        console.error('裁剪失败:', error)
      }
    }
  }, [crop, getCroppedImg, onCropComplete])

  return (
    <Dialog onOpenChange={onCancel} open={isOpen}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>裁剪头像</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='flex justify-center'>
            {imageSrc && (
              <ReactCrop
                aspect={1}
                circularCrop
                className='max-h-96'
                crop={crop}
                onChange={(c) => setCrop(c)}
              >
                <img
                  alt='裁剪预览'
                  className='max-h-96 object-contain'
                  ref={imgRef}
                  src={imageSrc}
                />
              </ReactCrop>
            )}
          </div>
          <div className='flex justify-end space-x-2'>
            <Button onClick={onCancel} variant='outline'>
              <IconX className='mr-2 h-4 w-4' />
              取消
            </Button>
            <Button onClick={handleCropComplete}>
              <IconCheck className='mr-2 h-4 w-4' />
              确认裁剪
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
