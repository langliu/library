import { BatchImageUploadDemo } from '@/components/batch-image-upload-demo'
import { BatchImageUploadExample } from '@/components/batch-image-upload-example'
import { BatchImageUploadTest } from '@/components/batch-image-upload-test'
import { BatchImageUploadWithDimensions } from '@/components/batch-image-upload-with-dimensions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TestBatchUploadPage() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto max-w-6xl'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>批量图片上传组件测试</h1>
          <p className='text-gray-600'>测试批量图片上传组件的各种功能和使用场景</p>
        </div>

        <Tabs className='w-full' defaultValue='basic'>
          <TabsList className='grid w-full grid-cols-5'>
            <TabsTrigger value='basic'>基础示例</TabsTrigger>
            <TabsTrigger value='test'>新API测试</TabsTrigger>
            <TabsTrigger value='dimensions'>尺寸功能</TabsTrigger>
            <TabsTrigger value='multiple'>多场景示例</TabsTrigger>
            <TabsTrigger value='docs'>使用文档</TabsTrigger>
          </TabsList>

          <TabsContent className='space-y-6' value='basic'>
            <BatchImageUploadExample />
          </TabsContent>

          <TabsContent className='space-y-6' value='test'>
            <BatchImageUploadTest />
          </TabsContent>

          <TabsContent className='space-y-6' value='dimensions'>
            <BatchImageUploadWithDimensions />
          </TabsContent>

          <TabsContent className='space-y-6' value='multiple'>
            <BatchImageUploadDemo />
          </TabsContent>

          <TabsContent className='space-y-6' value='docs'>
            <Card>
              <CardHeader>
                <CardTitle>组件特性</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>✅ 支持的功能</h4>
                    <ul className='text-sm text-gray-600 space-y-1'>
                      <li>• 点击选择多个图片文件</li>
                      <li>• 拖拽上传图片文件</li>
                      <li>• 实时图片预览</li>
                      <li>• 自动获取图片尺寸信息</li>
                      <li>• 显示图片宽高和比例</li>
                      <li>• 上传进度显示</li>
                      <li>• 文件类型和大小验证</li>
                      <li>• 可配置最大文件数量</li>
                      <li>• 可配置单文件最大大小</li>
                      <li>• 响应式设计</li>
                    </ul>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>🎯 使用场景</h4>
                    <ul className='text-sm text-gray-600 space-y-1'>
                      <li>• 相册图片批量上传</li>
                      <li>• 产品图片管理</li>
                      <li>• 文档图片上传</li>
                      <li>• 用户头像批量处理</li>
                      <li>• 内容管理系统</li>
                      <li>• 电商平台图片管理</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>技术规格</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h4 className='font-medium mb-2'>默认配置</h4>
                    <ul className='text-sm text-gray-600 space-y-1'>
                      <li>• 最大文件数量: 10张</li>
                      <li>• 单文件最大大小: 10MB</li>
                      <li>• 支持文件类型: image/*</li>
                      <li>• 自动上传: 是</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>依赖要求</h4>
                    <ul className='text-sm text-gray-600 space-y-1'>
                      <li>• React 18+</li>
                      <li>• Next.js 14+</li>
                      <li>• Tailwind CSS</li>
                      <li>• @tabler/icons-react</li>
                      <li>• sonner (toast通知)</li>
                      <li>• shadcn/ui 组件库</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
