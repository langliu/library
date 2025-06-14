import { type Prisma, PrismaClient } from '../src/app/generated/prisma'

const prisma = new PrismaClient()

const modelData: Prisma.ModelCreateInput[] = [
  {
    name: '浅安安',
    weiboUrl: 'https://weibo.com/u/7771286750',
    xUrl: 'https://x.com/qanan_na',
  },
  {
    name: '絞肉姬Walküre',
    xUrl: 'https://x.com/13HELLSLUT666',
  },
  {
    name: 'yuuhui玉汇',
    weiboUrl: 'https://weibo.com/u/7974882670',
    xUrl: 'https://x.com/yuuhuia',
  },
]

export async function main() {
  for (const u of modelData) {
    await prisma.model.create({ data: u })
  }
}

main()
