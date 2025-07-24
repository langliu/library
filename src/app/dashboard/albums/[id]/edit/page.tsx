'use client'

import { IconArrowLeft, IconEdit } from '@tabler/icons-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AlbumForm, type AlbumFormData } from '@/components/album-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Album {
  id: string
  name: string
  description: string
  cover: string
  imageCount: number
  videoCount: number
  models: Array<{
    id: string
    name: string
    avatar: string | null
  }>
}

export default function EditAlbumPage() {
  const params = useParams()
  const router = useRouter()
  const [album, setAlbum] = useState<Album | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const albumId = params.id as string

  // 获取专辑数据
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/albums/${albumId}`)
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('专辑不存在')
            router.push('/dashboard/albums')
            return
          }
          throw new Error('获取专辑数据失败')
        }
        const data = await response.json()
        setAlbum(data)
      } catch (error) {
        console.error('获取专辑数据失败:', error)
        toast.error('获取专辑数据失败')
        router.push('/dashboard/albums')
      } finally {
        setIsFetching(false)
      }
    }

    if (albumId) {
      fetchAlbum()
    }
  }, [albumId, router])

  const handleUpdateAlbum = async (data: AlbumFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新专辑失败')
      }

      const result = await response.json()
      toast.success('专辑更新成功！')
      router.push('/dashboard/albums')
    } catch (error) {
      console.error('更新专辑失败:', error)
      toast.error(error instanceof Error ? error.message : '更新专辑失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/albums')
  }

  if (isFetching) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>加载中...</p>
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-muted-foreground'>专辑不存在</p>
          <Button className='mt-4' onClick={() => router.push('/dashboard/albums')}>
            <IconArrowLeft className='mr-2 h-4 w-4' />
            返回列表
          </Button>
        </div>
      </div>
    )
  }

  // 转换数据格式为表单需要的格式
  const initialData: AlbumFormData = {
    cover: album.cover || '',
    description: album.description || '',
    imageCount: album.imageCount,
    modelIds: album.models.map((model) => model.id),
    name: album.name,
    videoCount: album.videoCount,
  }

  return (
    <div className='space-y-6 px-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>编辑专辑</h1>
          <p className='text-muted-foreground'>修改专辑信息</p>
        </div>
        <Button disabled={isLoading} onClick={handleCancel} variant='outline'>
          <IconArrowLeft className='mr-2 h-4 w-4' />
          返回列表
        </Button>
      </div>

      <AlbumForm
        initialData={initialData}
        isEditing={true}
        isLoading={isLoading}
        onCancel={handleCancel}
        onSubmit={handleUpdateAlbum}
      />
    </div>
  )
}
