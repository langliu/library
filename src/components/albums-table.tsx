'use client'

import { IconDots, IconEdit, IconEye, IconSearch, IconTrash } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  avatar: string | null
}

interface Album {
  id: string
  name: string
  description: string | null
  cover: string | null
  imageCount: number
  videoCount: number
  createdAt: string
  isDeleted: boolean
  models: Model[]
}

interface AlbumsResponse {
  albums: Album[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Model {
  id: string
  name: string
  avatar: string | null
}

export function AlbumsTable() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')
  const [albums, setAlbums] = useState<Album[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  })

  const fetchAlbums = useCallback(
    async (page = 1, search = '', modelId = '') => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', pagination.limit.toString())
        if (search) {
          params.append('search', search)
        }
        if (modelId) {
          params.append('modelId', modelId)
        }

        const response = await fetch(`/api/albums?${params}`)

        if (!response.ok) {
          throw new Error('获取专辑数据失败')
        }

        const data: AlbumsResponse = await response.json()
        setAlbums(data.albums)
        setPagination(data.pagination)
      } catch (err) {
        console.error('获取专辑数据失败:', err)
        setError(err instanceof Error ? err.message : '获取数据失败')
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.limit],
  )

  const fetchModels = useCallback(async () => {
    try {
      const response = await fetch('/api/models?limit=100')
      if (response.ok) {
        const data = await response.json()
        setModels(data.models)
      }
    } catch (error) {
      console.error('获取模特数据失败:', error)
    }
  }, [])

  useEffect(() => {
    fetchModels()
    fetchAlbums()
  }, [fetchModels, fetchAlbums])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchAlbums(1, value, selectedModelId)
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId)
    fetchAlbums(1, searchTerm, modelId)
  }

  const handlePageChange = (page: number) => {
    fetchAlbums(page, searchTerm, selectedModelId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const handleEditAlbum = (albumId: string) => {
    router.push(`/dashboard/albums/${albumId}/edit`)
  }

  const handleDeleteAlbum = async (albumId: string) => {
    if (!confirm('确定要删除这个专辑吗？此操作不可撤销。')) {
      return
    }

    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '删除专辑失败')
      }

      toast.success('专辑删除成功！')
      fetchAlbums(pagination.page, searchTerm, selectedModelId)
    } catch (error) {
      console.error('删除专辑失败:', error)
      toast.error(error instanceof Error ? error.message : '删除专辑失败，请重试')
    }
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-600 mb-4'>{error}</p>
        <Button onClick={() => fetchAlbums()}>重试</Button>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <div className='relative flex-1'>
          <IconSearch className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='pl-8'
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='搜索专辑名称或描述...'
            value={searchTerm}
          />
        </div>
        <Select onValueChange={handleModelChange} value={selectedModelId}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='选择模特' />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value={undefined}>全部模特</SelectItem> */}
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>专辑</TableHead>
              <TableHead>模特</TableHead>
              <TableHead>图片数量</TableHead>
              <TableHead>视频数量</TableHead>
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
            ) : albums.length === 0 ? (
              <TableRow>
                <TableCell className='text-center py-8' colSpan={6}>
                  {searchTerm || selectedModelId ? '没有找到匹配的专辑' : '暂无专辑数据'}
                </TableCell>
              </TableRow>
            ) : (
              albums.map((album) => (
                <TableRow key={album.id}>
                  <TableCell>
                    <div className='flex items-center space-x-3'>
                      <Avatar className='h-12 w-12'>
                        <AvatarImage
                          alt={album.name}
                          src={album.cover ? `/api/image/${album.cover}` : ''}
                        />
                        <AvatarFallback>{album.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>{album.name}</div>
                        <div className='text-sm text-muted-foreground'>
                          {album.description || '暂无描述'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {album.models.map((model) => (
                        <Badge key={model.id} variant='secondary'>
                          {model.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{album.imageCount}</TableCell>
                  <TableCell>{album.videoCount}</TableCell>
                  <TableCell>{formatDate(album.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={album.isDeleted ? 'destructive' : 'default'}>
                      {album.isDeleted ? '已删除' : '正常'}
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
                        <DropdownMenuItem onClick={() => handleEditAlbum(album.id)}>
                          <IconEdit className='mr-2 h-4 w-4' />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-red-600'
                          onClick={() => handleDeleteAlbum(album.id)}
                        >
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

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>共 {pagination.total} 条记录</div>
          <div className='flex items-center space-x-2'>
            <Button
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              size='sm'
              variant='outline'
            >
              上一页
            </Button>
            <span className='text-sm'>
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
              size='sm'
              variant='outline'
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
