import { headers } from 'next/headers'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { ProfileForm } from './profile-form'
import { SecurityForm } from './security-form'

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return <div>请先登录</div>
  }

  return (
    <div className='container max-w-4xl py-6 space-y-6 px-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>账户设置</h1>
      </div>

      <ProfileForm user={session.user} />
      <SecurityForm />
      <Button color='primary'>保存更改</Button>
    </div>
  )
}
