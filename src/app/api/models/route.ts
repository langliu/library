import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

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
    }

    // 获取总数
    const total = await prisma.model.count({ where })

    // 获取模特数据
    const models = await prisma.model.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      where,
    })

    return NextResponse.json({
      models,
      pagination: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取模特数据失败:', error)
    return NextResponse.json({ error: '获取模特数据失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, avatar, xUrl, instagramUrl, weiboUrl, patreonUrl, youtubeUrl } = body

    if (!name) {
      return NextResponse.json({ error: '模特姓名是必填项' }, { status: 400 })
    }

    const model = await prisma.model.create({
      data: {
        avatar,
        instagramUrl,
        name,
        patreonUrl,
        weiboUrl,
        xUrl,
        youtubeUrl,
      },
    })

    return NextResponse.json(model, { status: 201 })
  } catch (error) {
    console.error('创建模特失败:', error)
    return NextResponse.json({ error: '创建模特失败' }, { status: 500 })
  }
}
