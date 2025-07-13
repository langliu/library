'use client'

import { IconArrowLeft, IconEdit } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ModelForm, type ModelFormData } from '@/components/model-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Model {
  id: string
  name: string
  description: string | null
  avatar: string | null
  xUrl: string | null
  instagramUrl: string | null
  weiboUrl: string | null
  patreonUrl: string | null
  youtubeUrl: string | null
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export default function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [model, setModel] = useState<Model | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelId, setModelId] = useState<string>('')

  // 获取模特信息
  useEffect(() => {
    const fetchModel = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { id } = await params
        setModelId(id)

        const response = await fetch(`/api/models/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('模特不存在')
          } else {
            throw new Error('获取模特信息失败')
          }
          return
        }

        const data: Model = await response.json()
        setModel(data)
      } catch (err) {
        console.error('获取模特信息失败:', err)
        setError(err instanceof Error ? err.message : '获取模特信息失败')
      } finally {
        setIsLoading(false)
      }
    }

    fetchModel()
  }, [params])

  // 处理编辑提交
  const handleEditModel = async (data: ModelFormData) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/models/${modelId}`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新模特失败')
      }

      const result = await response.json()
      toast.success('模特信息更新成功！')

      // 返回模特列表页面
      router.push('/dashboard/models')
    } catch (error) {
      console.error('更新模特失败:', error)
      toast.error(error instanceof Error ? error.message : '更新模特失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/models')
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>编辑模特</h1>
            <p className='text-muted-foreground'>修改模特信息</p>
          </div>
          <Button onClick={handleCancel} variant='outline'>
            <IconArrowLeft className='mr-2 h-4 w-4' />
            返回列表
          </Button>
        </div>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center py-8'>
              <p className='text-red-600 mb-4'>{error}</p>
              <Button onClick={handleCancel}>返回列表</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!model) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>编辑模特</h1>
            <p className='text-muted-foreground'>修改模特信息</p>
          </div>
          <Button onClick={handleCancel} variant='outline'>
            <IconArrowLeft className='mr-2 h-4 w-4' />
            返回列表
          </Button>
        </div>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center py-8'>
              <p className='text-gray-600 mb-4'>模特不存在</p>
              <Button onClick={handleCancel}>返回列表</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>编辑模特</h1>
          <p className='text-muted-foreground'>修改模特信息</p>
        </div>
        <Button disabled={isSaving} onClick={handleCancel} variant='outline'>
          <IconArrowLeft className='mr-2 h-4 w-4' />
          返回列表
        </Button>
      </div>

      <ModelForm
        initialData={{
          avatar: model.avatar || '',
          description: model.description || '',
          instagramUrl: model.instagramUrl || '',
          name: model.name,
          patreonUrl: model.patreonUrl || '',
          weiboUrl: model.weiboUrl || '',
          xUrl: model.xUrl || '',
          youtubeUrl: model.youtubeUrl || '',
        }}
        isEditing={true}
        isLoading={isSaving}
        onCancel={handleCancel}
        onSubmit={handleEditModel}
      />
    </div>
  )
}
