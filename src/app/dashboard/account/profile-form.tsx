'use client'

import { useId } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileFormProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const nameId = useId()
  const emailId = useId()

  return (
    <>
      <div className='flex items-center space-x-4'>
        <Avatar className='h-20 w-20'>
          <AvatarImage alt={user.name || ''} src={user.image || ''} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className='space-y-1'>
          <Button size='sm' variant='outline'>
            更换头像
          </Button>
          <p className='text-sm text-muted-foreground'>支持 JPG、PNG 格式，最大 2MB</p>
        </div>
      </div>
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor={nameId}>用户名</Label>
          <Input defaultValue={user.name || ''} id={nameId} placeholder='请输入用户名' />
        </div>

        <div className='grid gap-2'>
          <Label htmlFor={emailId}>邮箱</Label>
          <Input
            defaultValue={user.email || ''}
            disabled
            id={emailId}
            placeholder='请输入邮箱'
            type='email'
          />
          <p className='text-sm text-muted-foreground'>邮箱地址不可更改</p>
        </div>
      </div>
    </>
  )
}
