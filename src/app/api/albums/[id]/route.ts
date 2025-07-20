import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 获取单个专辑信息
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const album = await prisma.album.findUnique({
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
      where: { id },
    })

    if (!album) {
      return NextResponse.json({ error: '专辑不存在' }, { status: 404 })
    }

    // 转换数据结构，将 models 中的 model 字段提取出来
    const transformedAlbum = {
      ...album,
      models: album.models.map((modelRelation) => modelRelation.model),
    }

    return NextResponse.json(transformedAlbum)
  } catch (error) {
    console.error('获取专辑信息失败:', error)
    return NextResponse.json({ error: '获取专辑信息失败' }, { status: 500 })
  }
}

// 更新专辑信息
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, cover, imageCount, videoCount, modelIds } = body

    if (!name) {
      return NextResponse.json({ error: '专辑名称是必填项' }, { status: 400 })
    }

    // 检查专辑是否存在
    const existingAlbum = await prisma.album.findUnique({
      where: { id },
    })

    if (!existingAlbum) {
      return NextResponse.json({ error: '专辑不存在' }, { status: 404 })
    }

    const updatedAlbum = await prisma.album.update({
      data: {
        cover,
        description,
        imageCount: imageCount || 0,
        models: {
          create:
            modelIds && modelIds.length > 0 ? modelIds.map((modelId: string) => ({ modelId })) : [],
          deleteMany: {}, // 先清空现有关联
        },
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
      where: { id },
    })

    // 转换数据结构，将 models 中的 model 字段提取出来
    const transformedAlbum = {
      ...updatedAlbum,
      models: updatedAlbum.models.map((modelRelation) => modelRelation.model),
    }

    return NextResponse.json(transformedAlbum)
  } catch (error) {
    console.error('更新专辑失败:', error)
    return NextResponse.json({ error: '更新专辑失败' }, { status: 500 })
  }
}

// 删除专辑（软删除）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    // 检查专辑是否存在
    const existingAlbum = await prisma.album.findUnique({
      where: { id },
    })

    if (!existingAlbum) {
      return NextResponse.json({ error: '专辑不存在' }, { status: 404 })
    }

    // 软删除
    await prisma.album.update({
      data: { isDeleted: true },
      where: { id },
    })

    return NextResponse.json({ message: '专辑删除成功' })
  } catch (error) {
    console.error('删除专辑失败:', error)
    return NextResponse.json({ error: '删除专辑失败' }, { status: 500 })
  }
}
