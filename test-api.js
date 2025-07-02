// 简单的API测试脚本
async function testModelsAPI() {
  console.log('开始测试模特API...')

  // 测试获取模特列表
  try {
    console.log('\n1. 测试获取模特列表...')
    const getResponse = await fetch('http://localhost:3000/api/models')
    const getData = await getResponse.json()
    console.log('获取模特列表成功:', getData)
  } catch (error) {
    console.error('获取模特列表失败:', error)
  }

  // 测试添加模特
  try {
    console.log('\n2. 测试添加模特...')
    const newModel = {
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      description: '这是一个测试模特',
      instagramUrl: 'https://instagram.com/testmodel',
      name: '测试模特',
      patreonUrl: null,
      weiboUrl: 'https://weibo.com/testmodel',
      xUrl: 'https://x.com/testmodel',
      youtubeUrl: null,
    }

    const postResponse = await fetch('http://localhost:3000/api/models', {
      body: JSON.stringify(newModel),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (postResponse.ok) {
      const postData = await postResponse.json()
      console.log('添加模特成功:', postData)
    } else {
      const errorData = await postResponse.json()
      console.error('添加模特失败:', errorData)
    }
  } catch (error) {
    console.error('添加模特请求失败:', error)
  }

  // 再次获取模特列表验证
  try {
    console.log('\n3. 验证模特列表更新...')
    const getResponse2 = await fetch('http://localhost:3000/api/models')
    const getData2 = await getResponse2.json()
    console.log('更新后的模特列表:', getData2)
  } catch (error) {
    console.error('获取更新后的模特列表失败:', error)
  }

  console.log('\nAPI测试完成!')
}

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  testModelsAPI()
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testModelsAPI }
}
