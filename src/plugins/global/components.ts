import type { App, Component } from 'vue'

interface ModuleDefinition {
  default: Component
}

export const registerUiComponent = {
  install: (app: App) => {
    // 查找所有 components 下的 ui 组件
    const modules = import.meta.glob<ModuleDefinition>('@/components/ui/**/*.vue', { eager: true })

    // 遍历注册
    Object.entries(modules).forEach(([path, module]) => {
      const componentName = path
        .split('/')
        .pop()
        ?.replace(/\.\w+$/, '')
      if (componentName) {
        app.component(componentName, module.default)
      }
    })
  },
}
