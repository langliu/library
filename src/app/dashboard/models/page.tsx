'use client'

import { IconPlus, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ModelForm, type ModelFormData } from '@/components/model-form'
import { ModelsTable } from '@/components/models-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ModelsPage() {
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddModel = async (data: ModelFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/models', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '添加模特失败')
      }

      const result = await response.json()
      toast.success('模特添加成功！')
      setShowForm(false)

      // 触发表格刷新
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error('添加模特失败:', error)
      toast.error(error instanceof Error ? error.message : '添加模特失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
  }

  if (showForm) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>添加模特</h1>
            <p className='text-muted-foreground'>添加新的模特到系统中</p>
          </div>
          <Button disabled={isLoading} onClick={handleCancelForm} variant='outline'>
            返回列表
          </Button>
        </div>
        <ModelForm isLoading={isLoading} onCancel={handleCancelForm} onSubmit={handleAddModel} />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>模特管理</h1>
          <p className='text-muted-foreground'>管理和查看所有模特信息</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <IconPlus className='mr-2 h-4 w-4' />
          添加模特
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>总模特数</CardTitle>
            <IconUsers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-xs text-muted-foreground'>+2 本月新增</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>活跃模特</CardTitle>
            <IconUsers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>18</div>
            <p className='text-xs text-muted-foreground'>75% 活跃率</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>本月新增</CardTitle>
            <IconUsers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2</div>
            <p className='text-xs text-muted-foreground'>+8.1% 相比上月</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>待审核</CardTitle>
            <IconUsers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>3</div>
            <p className='text-xs text-muted-foreground'>需要审核</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>模特列表</CardTitle>
          <CardDescription>查看和管理所有模特信息</CardDescription>
        </CardHeader>
        <CardContent>
          <ModelsTable key={refreshKey} />
        </CardContent>
      </Card>
    </div>
  )
}
