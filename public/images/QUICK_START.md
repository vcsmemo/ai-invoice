# 🔧 SEO 图片快速生成脚本

这是一个简单的 HTML 页面，用于快速生成所需的 SEO 图片。

## 使用方法

### 在线工具（推荐，2分钟）

访问这些网站，输入您的文字，下载图片：

1. **Favicon 生成器**
   ```
   https://favicon.io
   文字: AI
   背景: #080808
   颜色: #c8f542
   下载所有文件
   ```

2. **Canva OG 图片生成器**
   ```
   https://www.canva.com/brand/learn/open-graph-image
   尺寸: 1200 x 630
   模板: 选择 "Tech" 或 "Business"
   文字: AI Invoice Generator
   ```

### 使用 CSS/HTML 生成（高级）

如果您有设计经验，可以使用这个 HTML 模板：

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .og-image {
      width: 1200px;
      height: 630px;
      background: #080808;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .logo {
      font-size: 72px;
      font-weight: bold;
      color: #c8f542;
      margin-bottom: 20px;
    }
    .title {
      font-size: 48px;
      color: #fafafa;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 24px;
      color: #b4b4b4;
    }
  </style>
</head>
<body>
  <div class="og-image">
    <div class="logo">AI Invoice</div>
    <div class="title">Generator</div>
    <div class="subtitle">Create Professional Invoices in 30 Seconds</div>
  </div>
</body>
</html>
```

然后在浏览器截图，裁剪为 1200x630。

### 最快方法（临时）

先部署应用，稍后添加图片。核心功能不受影响！
