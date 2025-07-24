# BatchImageUpload 批量图片上传组件

一个功能完整的批量图片上传组件，支持拖拽上传、文件选择、上传进度显示和图片预览。

## 功能特性

- ✅ **多种上传方式**: 支持点击选择和拖拽上传
- ✅ **批量上传**: 可同时选择多个图片文件
- ✅ **实时预览**: 上传前即可预览图片
- ✅ **上传状态**: 显示等待、上传中、成功、失败等状态
- ✅ **文件验证**: 自动验证文件类型和大小
- ✅ **图片尺寸获取**: 自动获取并显示图片的宽高信息
- ✅ **可配置限制**: 可设置最大文件数量和单文件大小
- ✅ **响应式设计**: 适配不同屏幕尺寸
- ✅ **无障碍支持**: 支持键盘操作和屏幕阅读器

## 使用方法

### 基础用法

```tsx
import { BatchImageUpload, type ImageInfo } from '@/components/batch-image-upload'

function MyComponent() {
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([])

  return (
    <BatchImageUpload
      value={imageInfos}
      onChange={setImageInfos}
    />
  )
}
```

### 完整配置

```tsx
import { BatchImageUpload, type ImageInfo } from '@/components/batch-image-upload'

function MyComponent() {
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([])

  return (
    <BatchImageUpload
      value={imageInfos}
      onChange={setImageInfos}
      onImageInfoChange={setImageInfos} // 可选：如果需要监听变化
      disabled={false}
      maxFiles={20}
      maxFileSize={10}
      accept="image/*"
      className="w-full"
    />
  )
}
```

## Props 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `ImageInfo[]` | `[]` | 已上传图片信息数组(包含key和尺寸) |
| `onChange` | `(imageInfos: ImageInfo[]) => void` | - | 图片信息变化回调函数 |
| `onImageInfoChange` | `(imageInfos: ImageInfo[]) => void` | - | 可选：额外的图片信息变化监听器 |
| `disabled` | `boolean` | `false` | 是否禁用组件 |
| `maxFiles` | `number` | `10` | 最大文件数量 |
| `maxFileSize` | `number` | `10` | 单文件最大大小(MB) |
| `accept` | `string` | `'image/*'` | 接受的文件类型 |
| `prefix` | `string` | `'batch'` | 上传文件的前缀 |
| `className` | `string` | - | 自定义CSS类名 |

## 类型定义

### ImageInfo

```tsx
interface ImageInfo {
  key: string      // 图片的唯一标识符
  width?: number   // 图片宽度(像素)
  height?: number  // 图片高度(像素)
}
```

## 上传流程

1. **文件选择**: 用户通过点击或拖拽选择图片文件
2. **文件验证**: 自动验证文件类型、大小和数量限制
3. **尺寸获取**: 自动读取图片的宽高信息
4. **预览显示**: 立即显示图片预览、尺寸信息和上传状态
5. **自动上传**: 文件选择后自动开始上传到服务器
6. **状态更新**: 实时更新上传进度和状态
7. **结果回调**: 上传成功后通过onChange回调返回包含尺寸信息的图片数据

## 状态说明

- **pending**: 等待上传
- **uploading**: 正在上传中
- **success**: 上传成功
- **error**: 上传失败

## 样式定制

组件使用Tailwind CSS构建，可以通过className属性进行样式定制：

```tsx
<BatchImageUpload
  className="border-2 border-blue-500 rounded-lg"
  // ... 其他props
/>
```

## 错误处理

组件内置了完善的错误处理机制：

- 文件类型验证失败时显示错误提示
- 文件大小超限时显示错误提示
- 文件数量超限时显示错误提示
- 上传失败时显示错误状态和重试选项

## 依赖要求

- React 18+
- Next.js 14+
- Tailwind CSS
- @tabler/icons-react
- sonner (toast通知)
- shadcn/ui 组件库

## API 接口要求

组件需要后端提供 `/api/upload` 接口，接受以下参数：

- `file`: 图片文件
- `prefix`: 文件前缀 (固定为 'batch')

返回格式：

```json
{
  "key": "uploaded-image-key"
}
```

## 注意事项

1. 确保服务器端的 `/api/upload` 接口正常工作
2. 图片预览使用 `/api/image/{key}` 路径显示
3. 组件会自动清理创建的对象URL，避免内存泄漏
4. 建议在生产环境中添加更严格的文件验证

## 示例代码

查看 `batch-image-upload-example.tsx` 文件获取完整的使用示例。
