# Web Guard

一个轻量级的前端监控系统，帮助你实时监控和诊断 Web 应用的问题。

## 功能特性

- 🔍 错误监控

  - JavaScript 运行时错误
  - Promise 未处理的 rejection
  - 资源加载错误

- 📊 性能监控

  - 页面加载性能
  - API请求性能
  - 资源加载性能

- 🔎 用户行为追踪
  - 路由变化
  - 点击事件
  - 控制台输出
  - 自定义事件

## 项目结构

```
packages/
├── core/          # 核心功能实现
├── common/        # 公共代码和常量
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

## 安装

```bash
# 使用 pnpm 安装依赖
pnpm install
```

## 使用方法

```javascript
import { Guard } from '@web-guard/core';

// 初始化并启动监控
Guard.init({
  targetUrl: 'your-api-endpoint',
  needCatchError: true,
  needCatchUnhandledrejection: true,
});
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev:core

# 构建
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm lint-fix
```

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
- Rollup
- ESLint + Prettier
- Husky + Commitlint
- pnpm workspace

## License

ISC © [gamejoye](mailto:gamejoye@gmail.com)
