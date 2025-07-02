# 模特管理系统

这是一个基于Next.js和Prisma的模特管理系统，用于管理和展示模特信息。

## 功能特性

### 1. 模特列表展示
- 展示所有模特的基本信息
- 支持搜索功能（按姓名和描述搜索）
- 显示模特的社交媒体链接 ✅ **支持点击跳转**
- 显示模特状态（活跃/已删除）

### 2. 模特信息管理
- 添加新模特 ✅ **已实现API调用**
- 编辑模特信息
- 删除模特（软删除）
- 查看模特详情

### 3. 数据统计
- 总模特数统计
- 活跃模特统计
- 本月新增统计
- 待审核模特统计

## 页面结构

```
/dashboard/models
├── 模特列表页面 (page.tsx) ✅ **已实现API调用**
├── 添加模特表单 (ModelForm组件) ✅ **已实现API调用**
└── 模特数据表格 (ModelsTable组件) ✅ **已实现API调用**
```

## 组件说明

### ModelsTable 组件 ✅ **已实现API调用**
- 展示模特数据的表格组件
- 支持搜索和筛选
- 包含操作菜单（查看、编辑、删除）
- 显示社交媒体链接徽章 ✅ **支持点击跳转**
- **从API获取真实数据**
- **支持加载状态和错误处理**
- **社交媒体标签可点击，在新Tab页打开链接**

### ModelForm 组件 ✅ **已实现API调用**
- 用于添加和编辑模特信息的表单
- 包含所有模特字段的输入
- 支持社交媒体链接输入
- 表单验证和错误处理
- **支持加载状态**
- **提交后自动刷新数据**

## 社交媒体功能 ✅ **新增**

### 社交媒体标签跳转
- 点击X(Twitter)标签 → 在新Tab页打开X链接
- 点击Instagram标签 → 在新Tab页打开Instagram链接
- 点击微博标签 → 在新Tab页打开微博链接
- 点击Patreon标签 → 在新Tab页打开Patreon链接
- 点击YouTube标签 → 在新Tab页打开YouTube链接

### 用户体验优化
- 鼠标悬停时显示提示信息
- 悬停时标签颜色变化，提供视觉反馈
- 使用`noopener,noreferrer`确保安全性
- 只有有链接的社交媒体才显示为可点击状态

## API 路由 ✅ **已实现**

### GET /api/models
获取模特列表，支持分页和搜索：
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `search`: 搜索关键词

**响应格式:**
```json
{
  "models": [
    {
      "id": "uuid",
      "name": "模特姓名",
      "description": "描述",
      "avatar": "头像URL",
      "xUrl": "X链接",
      "instagramUrl": "Instagram链接",
      "weiboUrl": "微博链接",
      "patreonUrl": "Patreon链接",
      "youtubeUrl": "YouTube链接",
      "createdAt": "2024-01-01T00:00:00Z",
      "isDeleted": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### POST /api/models
创建新模特，需要提供：
- `name`: 模特姓名（必填）
- `description`: 描述
- `avatar`: 头像URL
- `xUrl`: X(Twitter)链接
- `instagramUrl`: Instagram链接
- `weiboUrl`: 微博链接
- `patreonUrl`: Patreon链接
- `youtubeUrl`: YouTube链接

**请求示例:**
```json
{
  "name": "张美美",
  "description": "专业模特，擅长时尚摄影",
  "avatar": "https://example.com/avatar.jpg",
  "xUrl": "https://x.com/zhangmeimei",
  "instagramUrl": "https://instagram.com/zhangmeimei",
  "weiboUrl": "https://weibo.com/zhangmeimei",
  "patreonUrl": null,
  "youtubeUrl": null
}
```

**响应格式:**
```json
{
  "id": "uuid",
  "name": "张美美",
  "description": "专业模特，擅长时尚摄影",
  "avatar": "https://example.com/avatar.jpg",
  "xUrl": "https://x.com/zhangmeimei",
  "instagramUrl": "https://instagram.com/zhangmeimei",
  "weiboUrl": "https://weibo.com/zhangmeimei",
  "patreonUrl": null,
  "youtubeUrl": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "isDeleted": false
}
```

## 数据库模型

```prisma
model Model {
  id           String   @id @default(uuid())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  name         String
  description  String?
  avatar       String?
  xUrl         String?
  instagramUrl String?
  weiboUrl     String?
  patreonUrl   String?
  youtubeUrl   String?
  isDeleted    Boolean  @default(false)

  @@map("models")
}
```

## 使用方法

### 1. 访问模特管理页面
在侧边栏点击"模特管理"菜单项，或直接访问 `/dashboard/models`

### 2. 添加新模特 ✅ **已实现**
1. 点击"添加模特"按钮
2. 填写表单信息（姓名是必填项）
3. 点击"添加"按钮提交
4. 系统会显示加载状态和成功/失败提示
5. 添加成功后会自动刷新模特列表

### 3. 搜索模特 ✅ **已实现**
在搜索框中输入模特姓名或描述关键词，表格会自动筛选显示匹配的结果

### 4. 访问社交媒体 ✅ **新增**
- 在模特列表中，点击任意社交媒体标签（X、IG、微博、Patreon、YouTube）
- 标签会在新Tab页中打开对应的社交媒体链接
- 鼠标悬停在标签上会显示提示信息

### 5. 管理模特
点击每行右侧的操作菜单，可以：
- 查看模特详情
- 编辑模特信息
- 删除模特

## 开发说明

### 种子数据
运行以下命令创建示例模特数据：
```bash
npx tsx prisma/seed-models.ts
```

### 数据库迁移
```bash
npx prisma migrate dev
```

### 启动开发服务器
```bash
npm run dev
```

### API测试
可以使用提供的测试脚本验证API功能：
```bash
node test-api.js
```

## 技术栈

- **前端**: Next.js 14, React, TypeScript
- **UI组件**: shadcn/ui
- **数据库**: Prisma ORM
- **图标**: Tabler Icons
- **样式**: Tailwind CSS
- **通知**: Sonner (toast通知)

## 已实现的功能 ✅

1. ✅ 模特列表展示（从API获取真实数据）
2. ✅ 添加模特功能（完整的API调用）
3. ✅ 搜索功能（前端搜索）
4. ✅ 加载状态和错误处理
5. ✅ 表单验证
6. ✅ 成功/失败提示
7. ✅ 自动数据刷新
8. ✅ 社交媒体标签跳转功能

## 后续开发计划

1. 添加模特详情页面
2. 实现模特图片上传功能
3. 添加模特分类和标签
4. 实现模特预约系统
5. 添加数据导出功能
6. 实现模特评价和评分系统
7. 实现编辑和删除功能
8. 添加分页功能
9. 实现实时数据更新
10. 添加社交媒体链接验证
11. 实现社交媒体预览功能