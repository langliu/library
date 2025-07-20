import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const modelId = searchParams.get('modelId') || ''

    const skip = (page - 1) * limit

    // 构建搜索条件
    const where = {
      isDeleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(modelId && {
        models: {
          some: {
            modelId: modelId,
          },
        },
      }),
    }

    // 获取总数
    const total = await prisma.album.count({ where })

    // 获取专辑数据
    const albums = await prisma.album.findMany({
      include: {
        models: {
          include: {
            model: {
              select: {
                avatar: true,
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      where,
    })

    // 转换数据结构，将 models 中的 model 字段提取出来
    const transformedAlbums = albums.map((album) => ({
      ...album,
      models: album.models.map((modelRelation) => modelRelation.model),
    }))

    return NextResponse.json({
      albums: transformedAlbums,
      pagination: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取专辑数据失败:', error)
    return NextResponse.json({ error: '获取专辑数据失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, cover, imageCount, videoCount, modelIds } = body

    if (!name) {
      return NextResponse.json({ error: '专辑名称是必填项' }, { status: 400 })
    }

    const album = await prisma.album.create({
      data: {
        cover,
        description,
        imageCount: imageCount || 0,
        models:
          modelIds && modelIds.length > 0
            ? {
                create: modelIds.map((modelId: string) => ({ modelId })),
              }
            : undefined,
        name,
        videoCount: videoCount || 0,
      },
      include: {
        models: {
          include: {
            model: {
              select: {
                avatar: true,
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // 转换数据结构，将 models 中的 model 字段提取出来
    const transformedAlbum = {
      ...album,
      models: album.models.map((modelRelation) => modelRelation.model),
    }

    return NextResponse.json(transformedAlbum, { status: 201 })
  } catch (error) {
    console.error('创建专辑失败:', error)
    return NextResponse.json({ error: '创建专辑失败' }, { status: 500 })
  }
}
