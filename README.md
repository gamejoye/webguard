# Web Guard

![Node CI](https://github.com/gamejoye/webguard/workflows/Node%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/gamejoye/webguard/badge.svg?branch=master)](https://coveralls.io/github/gamejoye/webguard?branch=master)
[![npm](https://img.shields.io/npm/v/webguard.svg)](https://www.npmjs.com/package/webguard)
[![NPM Downloads](https://img.shields.io/npm/dm/webguard)](https://npmtrends.com/webguard)
![license](https://img.shields.io/npm/l/webguard)

**Web Guard** 是一个轻量级的前端监控系统，帮助你实时监控和诊断 Web 应用的问题。

## 功能特性

### 🔍 错误监控

- ✅ JavaScript 运行时错误
- ✅ Promise 未处理的 rejection
- ✅ 资源加载错误
- ✅ 异步请求错误
- ✅ 跨域脚本错误

### 📊 性能监控（开发中）

- ✅ 页面加载性能
  - ✅ First Paint (FP)
  - ✅ First Contentful Paint (FCP)
  - ✅ Largest Contentful Paint (LCP)
  - ✅ Interaction to Next Paint (INP)
  - ✅ Cumulative Layout Shift (CLS)
  - ✅ Time To First Byte (TTFB)
- ⏳ API 请求性能
  - 请求耗时统计
  - 请求成功率
  - 请求错误分析
- ⏳ 资源加载性能
  - 资源加载时间
  - 资源加载成功率
  - 资源大小统计

### 🔎 用户行为追踪

- ✅ 路由变化
- ✅ 点击事件
- ✅ 键盘事件
- ⏳ HTTP请求
- ⏳ 代码错误
- ⏳ 控制台事件
- ⏳ 自定义事件

## 项目结构

```
packages/
├── core/                  # 核心功能实现
├── common/                # 公共代码和常量
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
├── plugins/performance    # 性能检测插件包
└── webguard/              # 聚合包

```

## 下载

下载 `@webguard/performance` 包用于检测网页性能

```
npm install webguard @webguard/performance
```

如果不想检测页面性能，仅仅只是希望能捕获页面错误以及进行用户行为追踪的话，你可以只下载 `webguard`

```
npm install webguard
```

## 使用

```
import WebGuard from 'webguard' // 引入核心包
import { PerformancePlugin } from '@webguard/performance' // 引入性能检测包

WebGuard.init({
  targetUrl: 'http://localhost:3001/data',
  breadcrumbConfig: {
    maxBreadcrumbs: 10,
    beforePushBreadcrumb: (breadcrumb) => {
      console.log('beforePushBreadcrumb:', breadcrumb);
      return breadcrumb;
    },
  },
  plugins: [
    new PerformancePlugin({
      onFCP: (data) => console.log('FCP:', data)
    }),
  ],
});
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev:core

# 启动测试服务器 用于调试跨域脚本错误
pnpm start:coreserver

# 代码检查
pnpm lint

# 代码格式化
pnpm lint-fix

# 运行测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage
```

## 测试

项目使用 Jest 进行单元测试：

- 测试文件位于各包的 `__tests__` 目录
- 测试文件命名格式为 `*.test.ts`
- 测试覆盖率要求：
  - 分支覆盖率：80%
  - 函数覆盖率：80%
  - 行覆盖率：80%
  - 语句覆盖率：80%

## Git 提交规范

提交信息格式：

```
type(scope?): subject

# 例如:
feat(core): add error tracking
fix(utils): fix type conversion
```

支持的 type：

- feat: 新功能
- fix: 修复
- docs: 文档变更
- style: 代码格式
- refactor: 重构
- perf: 性能优化
- test: 增加测试
- chore: 构建过程或辅助工具的变动
- revert: 回退
- build: 打包
- ci: 持续集成
- workflow: 工作流

## 技术栈

- TypeScript
- Vite
- ESLint + Prettier
- Husky + Commitlint
- Jest
- pnpm workspace

## License

MIT © [gamejoye](mailto:gamejoye@gmail.com)
