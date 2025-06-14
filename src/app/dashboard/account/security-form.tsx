'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function SecurityForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>安全设置</CardTitle>
        <CardDescription>管理您的账户安全选项</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h3 className='font-medium'>修改密码</h3>
            <p className='text-sm text-muted-foreground'>定期更新密码可以提高账户安全性</p>
          </div>
          <Button variant='outline'>修改密码</Button>
        </div>

        <Separator />

        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h3 className='font-medium'>两步验证</h3>
            <p className='text-sm text-muted-foreground'>启用两步验证以增加额外的安全层</p>
          </div>
          <Button variant='outline'>设置</Button>
        </div>
      </CardContent>
    </Card>
  )
}
