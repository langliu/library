'use client'

import { IconEdit, IconPlus, IconX } from '@tabler/icons-react'
import { useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AlbumFormProps {
  onSubmit: (data: AlbumFormData) => void
  onCancel: () => void
  initialData?: AlbumFormData
  isEditing?: boolean
  isLoading?: boolean
}

export interface AlbumFormData {
  name: string
  description: string
  cover: string
  imageCount: number
  videoCount: number
  modelIds: string[]
}

interface Model {
  id: string
  name: string
  avatar: string | null
}

export function AlbumForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isLoading = false,
}: AlbumFormProps) {
  const nameId = useId()
  const descriptionId = useId()
  const imageCountId = useId()
  const videoCountId = useId()
  const modelIdsId = useId()

  const [models, setModels] = useState<Model[]>([])
  const [formData, setFormData] = useState<AlbumFormData>(
    initialData || {
      cover: '',
      description: '',
      imageCount: 0,
      modelIds: [],
      name: '',
      videoCount: 0,
    },
  )

  // 获取模特列表
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models?limit=100')
        if (response.ok) {
          const data = await response.json()
          setModels(data.models)
        }
      } catch (error) {
        console.error('获取模特数据失败:', error)
      }
    }

    fetchModels()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof AlbumFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleModelChange = (modelId: string) => {
    setFormData((prev) => ({
      ...prev,
      modelIds: prev.modelIds.includes(modelId)
        ? prev.modelIds.filter((id) => id !== modelId)
        : [...prev.modelIds, modelId],
    }))
  }

  return (
    <Card className='w-full mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {isEditing ? '编辑专辑' : '添加专辑'}
          {isEditing ? <IconEdit className='h-5 w-5' /> : <IconPlus className='h-5 w-5' />}
        </CardTitle>
        <CardDescription>{isEditing ? '修改专辑信息' : '添加新的专辑到系统中'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <Label htmlFor={nameId}>专辑名称 *</Label>
            <Input
              disabled={isLoading}
              id={nameId}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder='请输入专辑名称'
              required
              value={formData.name}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor={descriptionId}>描述</Label>
            <Input
              disabled={isLoading}
              id={descriptionId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('description', e.target.value)
              }
              placeholder='请输入专辑描述信息'
              value={formData.description}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor={imageCountId}>图片数量</Label>
              <Input
                disabled={isLoading}
                id={imageCountId}
                onChange={(e) => handleChange('imageCount', parseInt(e.target.value) || 0)}
                placeholder='0'
                type='number'
                value={formData.imageCount}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor={videoCountId}>视频数量</Label>
              <Input
                disabled={isLoading}
                id={videoCountId}
                onChange={(e) => handleChange('videoCount', parseInt(e.target.value) || 0)}
                placeholder='0'
                type='number'
                value={formData.videoCount}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor={modelIdsId}>关联模特</Label>
            <div className='grid grid-cols-2 gap-2'>
              {models.map((model) => (
                <div className='flex items-center space-x-2' key={model.id}>
                  <input
                    checked={formData.modelIds.includes(model.id)}
                    disabled={isLoading}
                    id={`model-${model.id}`}
                    onChange={() => handleModelChange(model.id)}
                    type='checkbox'
                  />
                  <label
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    htmlFor={`model-${model.id}`}
                  >
                    {model.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onCancel()
              }}
              type='button'
              variant='outline'
            >
              <IconX className='mr-2 h-4 w-4' />
              取消
            </Button>
            <Button disabled={isLoading} type='submit'>
              <IconPlus className='mr-2 h-4 w-4' />
              {isLoading ? '保存中...' : isEditing ? '更新' : '添加'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
