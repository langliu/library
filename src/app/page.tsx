import { SiInstagram, SiPatreon, SiSinaweibo, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import Image from 'next/image'
import prisma from '@/lib/prisma'

export default async function Home() {
  const models = await prisma.model.findMany()
  console.log(models)
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16'>
      <h1 className='text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]'>
        Superblog
      </h1>
      <ol className='list-inside font-[family-name:var(--font-geist-sans)]'>
        {models.map((model) => (
          <li className='mb-2' key={model.id}>
            <div className='flex items-center gap-2'>
              {model.avatar && (
                <Image
                  alt={model.name}
                  height={40}
                  src={model.avatar ? `/api/image/${model.avatar}` : ''}
                  width={40}
                />
              )}
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>{model.name}</span>
                {model.xUrl && <SiX className='w-4 h-4' />}
                {model.instagramUrl && <SiInstagram className='w-4 h-4' />}
                {model.weiboUrl && <SiSinaweibo className='w-4 h-4' />}
                {model.patreonUrl && <SiPatreon className='w-4 h-4' />}
                {model.youtubeUrl && <SiYoutube className='w-4 h-4' />}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
