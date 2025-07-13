'use client'

import { IconDots, IconEdit, IconEye, IconSearch, IconTrash } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
  isDeleted: boolean
}

interface ModelsResponse {
  models: Model[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function ModelsTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchModels = useCallback(async (search?: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (search) {
        params.append('search', search)
      }
      params.append('limit', '50') // 获取更多数据用于前端搜索

      const response = await fetch(`/api/models?${params}`)

      if (!response.ok) {
        throw new Error('获取模特数据失败')
      }

      const data: ModelsResponse = await response.json()
      setModels(data.models)
    } catch (err) {
      console.error('获取模特数据失败:', err)
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  // 前端搜索过滤
  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const getInitials = (name: string) => {
    return name.split('').slice(0, 2).join('').toUpperCase()
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleSocialMediaClick = (url: string, platform: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-600 mb-4'>{error}</p>
        <Button onClick={() => fetchModels()}>重试</Button>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <div className='relative flex-1'>
          <IconSearch className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='pl-8'
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='搜索模特姓名或描述...'
            value={searchTerm}
          />
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>模特</TableHead>
              <TableHead>社交媒体</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className='w-[50px]'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className='text-center py-8' colSpan={6}>
                  加载中...
                </TableCell>
              </TableRow>
            ) : filteredModels.length === 0 ? (
              <TableRow>
                <TableCell className='text-center py-8' colSpan={6}>
                  {searchTerm ? '没有找到匹配的模特' : '暂无模特数据'}
                </TableCell>
              </TableRow>
            ) : (
              filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div className='flex items-center space-x-3'>
                      <Avatar className='h-10 w-10'>
                        <AvatarImage
                          alt={model.name}
                          src={model.avatar ? `/api/image/${model.avatar}` : ''}
                        />
                        <AvatarFallback>{getInitials(model.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>{model.name}</div>
                        <div className='text-sm text-muted-foreground'>ID: {model.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-1'>
                      {model.xUrl && (
                        <Badge
                          className='text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
                          onClick={() => handleSocialMediaClick(model.xUrl!, 'X')}
                          title='点击打开X(Twitter)'
                          variant='outline'
                        >
                          X
                        </Badge>
                      )}
                      {model.instagramUrl && (
                        <Badge
                          className='text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
                          onClick={() => handleSocialMediaClick(model.instagramUrl!, 'Instagram')}
                          title='点击打开Instagram'
                          variant='outline'
                        >
                          Ins
                        </Badge>
                      )}
                      {model.weiboUrl && (
                        <Badge
                          className='text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
                          onClick={() => handleSocialMediaClick(model.weiboUrl!, '微博')}
                          title='点击打开微博'
                          variant='outline'
                        >
                          微博
                        </Badge>
                      )}
                      {model.patreonUrl && (
                        <Badge
                          className='text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
                          onClick={() => handleSocialMediaClick(model.patreonUrl!, 'Patreon')}
                          title='点击打开Patreon'
                          variant='outline'
                        >
                          Patreon
                        </Badge>
                      )}
                      {model.youtubeUrl && (
                        <Badge
                          className='text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
                          onClick={() => handleSocialMediaClick(model.youtubeUrl!, 'YouTube')}
                          title='点击打开YouTube'
                          variant='outline'
                        >
                          YouTube
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(model.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={model.isDeleted ? 'destructive' : 'default'}>
                      {model.isDeleted ? '已删除' : '活跃'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className='h-8 w-8 p-0' variant='ghost'>
                          <span className='sr-only'>打开菜单</span>
                          <IconDots className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <IconEye className='mr-2 h-4 w-4' />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconEdit className='mr-2 h-4 w-4' />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-red-600'>
                          <IconTrash className='mr-2 h-4 w-4' />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
