'use client'

import { IconPlus, IconX } from '@tabler/icons-react'
import { useId, useState } from 'react'
import { AvatarUpload } from '@/components/avatar-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ModelFormProps {
  onSubmit: (data: ModelFormData) => void
  onCancel: () => void
  initialData?: ModelFormData
  isEditing?: boolean
  isLoading?: boolean
}

export interface ModelFormData {
  name: string
  description: string
  avatar: string
  xUrl: string
  instagramUrl: string
  weiboUrl: string
  patreonUrl: string
  youtubeUrl: string
}

export function ModelForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isLoading = false,
}: ModelFormProps) {
  const nameId = useId()
  const avatarId = useId()
  const descriptionId = useId()
  const xUrlId = useId()
  const instagramUrlId = useId()
  const weiboUrlId = useId()
  const patreonUrlId = useId()
  const youtubeUrlId = useId()

  const [formData, setFormData] = useState<ModelFormData>(
    initialData || {
      avatar: '',
      description: '',
      instagramUrl: '',
      name: '',
      patreonUrl: '',
      weiboUrl: '',
      xUrl: '',
      youtubeUrl: '',
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof ModelFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {isEditing ? '编辑模特' : '添加模特'}
          <IconPlus className='h-5 w-5' />
        </CardTitle>
        <CardDescription>{isEditing ? '修改模特信息' : '添加新的模特到系统中'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <Label htmlFor={nameId}>姓名 *</Label>
            <Input
              disabled={isLoading}
              id={nameId}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder='请输入模特姓名'
              required
              value={formData.name}
            />
          </div>

          <div className='space-y-2'>
            <Label>头像</Label>
            <AvatarUpload
              disabled={isLoading}
              onChange={(url: string) => handleChange('avatar', url)}
              value={formData.avatar}
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
              placeholder='请输入模特描述信息'
              value={formData.description}
            />
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>社交媒体链接</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor={xUrlId}>X (Twitter)</Label>
                <Input
                  disabled={isLoading}
                  id={xUrlId}
                  onChange={(e) => handleChange('xUrl', e.target.value)}
                  placeholder='https://x.com/username'
                  type='url'
                  value={formData.xUrl}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={instagramUrlId}>Instagram</Label>
                <Input
                  disabled={isLoading}
                  id={instagramUrlId}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  placeholder='https://instagram.com/username'
                  type='url'
                  value={formData.instagramUrl}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={weiboUrlId}>微博</Label>
                <Input
                  disabled={isLoading}
                  id={weiboUrlId}
                  onChange={(e) => handleChange('weiboUrl', e.target.value)}
                  placeholder='https://weibo.com/u/userId'
                  type='url'
                  value={formData.weiboUrl}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={patreonUrlId}>Patreon</Label>
                <Input
                  disabled={isLoading}
                  id={patreonUrlId}
                  onChange={(e) => handleChange('patreonUrl', e.target.value)}
                  placeholder='https://patreon.com/username'
                  type='url'
                  value={formData.patreonUrl}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={youtubeUrlId}>YouTube</Label>
                <Input
                  disabled={isLoading}
                  id={youtubeUrlId}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  placeholder='https://youtube.com/@username'
                  type='url'
                  value={formData.youtubeUrl}
                />
              </div>
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
              {isLoading ? '添加中...' : isEditing ? '更新' : '添加'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
