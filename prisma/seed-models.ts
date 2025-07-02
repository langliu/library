import prisma from '../src/lib/prisma'

const models = [
  {
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    description:
      '专业模特，擅长时尚摄影和商业广告拍摄。拥有5年模特经验，曾参与多个知名品牌广告拍摄。',
    instagramUrl: 'https://instagram.com/zhangmeimei',
    name: '张美美',
    patreonUrl: 'https://patreon.com/zhangmeimei',
    weiboUrl: 'https://weibo.com/zhangmeimei',
    xUrl: 'https://x.com/zhangmeimei',
    youtubeUrl: 'https://youtube.com/@zhangmeimei',
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    description: '平面模特，专注于商业摄影和产品展示。擅长各种风格拍摄，从时尚到商业都有丰富经验。',
    instagramUrl: 'https://instagram.com/lilili',
    name: '李丽丽',
    patreonUrl: null,
    weiboUrl: 'https://weibo.com/lilili',
    xUrl: 'https://x.com/lilili',
    youtubeUrl: null,
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    description: '新人模特，潜力无限。虽然经验不多，但学习能力强，适应各种拍摄风格。',
    instagramUrl: 'https://instagram.com/wangfangfang',
    name: '王芳芳',
    patreonUrl: null,
    weiboUrl: 'https://weibo.com/wangfangfang',
    xUrl: null,
    youtubeUrl: null,
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    description: '时尚模特，专注于高端时尚摄影。拥有独特的气质和表现力，深受设计师喜爱。',
    instagramUrl: 'https://instagram.com/chenxiaoyu',
    name: '陈小雨',
    patreonUrl: 'https://patreon.com/chenxiaoyu',
    weiboUrl: 'https://weibo.com/chenxiaoyu',
    xUrl: 'https://x.com/chenxiaoyu',
    youtubeUrl: null,
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    description: '商业模特，擅长产品展示和广告拍摄。专业素养高，配合度极佳。',
    instagramUrl: 'https://instagram.com/liutingting',
    name: '刘婷婷',
    patreonUrl: null,
    weiboUrl: 'https://weibo.com/liutingting',
    xUrl: null,
    youtubeUrl: 'https://youtube.com/@liutingting',
  },
]

async function main() {
  console.log('开始创建模特数据...')

  for (const model of models) {
    await prisma.model.create({
      data: model,
    })
  }

  console.log('模特数据创建完成！')
}

main()
  .catch((e) => {
    console.error('创建模特数据失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
