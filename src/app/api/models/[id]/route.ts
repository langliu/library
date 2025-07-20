import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 获取单个模特信息
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const model = await prisma.model.findUnique({
      where: { id },
    })

    if (!model) {
      return NextResponse.json({ error: '模特不存在' }, { status: 404 })
    }

    return NextResponse.json(model)
  } catch (error) {
    console.error('获取模特信息失败:', error)
    return NextResponse.json({ error: '获取模特信息失败' }, { status: 500 })
  }
}

// 更新模特信息
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, avatar, xUrl, instagramUrl, weiboUrl, patreonUrl, youtubeUrl } = body

    if (!name) {
      return NextResponse.json({ error: '模特姓名是必填项' }, { status: 400 })
    }

    // 检查模特是否存在
    const existingModel = await prisma.model.findUnique({
      where: { id },
    })

    if (!existingModel) {
      return NextResponse.json({ error: '模特不存在' }, { status: 404 })
    }

    const updatedModel = await prisma.model.update({
      data: {
        avatar,
        instagramUrl,
        name,
        patreonUrl,
        weiboUrl,
        xUrl,
        youtubeUrl,
      },
      where: { id },
    })

    return NextResponse.json(updatedModel)
  } catch (error) {
    console.error('更新模特失败:', error)
    return NextResponse.json({ error: '更新模特失败' }, { status: 500 })
  }
}

// 删除模特（软删除）
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // 检查模特是否存在
    const existingModel = await prisma.model.findUnique({
      where: { id },
    })

    if (!existingModel) {
      return NextResponse.json({ error: '模特不存在' }, { status: 404 })
    }

    // 软删除
    await prisma.model.update({
      data: { isDeleted: true },
      where: { id },
    })

    return NextResponse.json({ message: '模特删除成功' })
  } catch (error) {
    console.error('删除模特失败:', error)
    return NextResponse.json({ error: '删除模特失败' }, { status: 500 })
  }
}
