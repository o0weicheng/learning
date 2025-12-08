import { defineComponent, createVNode, onMounted, useTemplateRef } from 'vue'
export interface CanvasDrawQuery {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}
export const CanvasTemplate = defineComponent(
  (_, { emit, expose }) => {
    const canvas = useTemplateRef('canvas-template')

    expose({
      canvas,
    })

    onMounted(() => {
      if (canvas.value) {
        const _canvas = canvas.value as HTMLCanvasElement
        const rect = _canvas.getBoundingClientRect()
        _canvas.width = rect.width
        _canvas.height = rect.height
        const ctx = _canvas.getContext('2d') as CanvasRenderingContext2D
        emit('draw', { canvas: _canvas, ctx } as CanvasDrawQuery)
      }
    })
    return () => createVNode('canvas', { ref: 'canvas-template' }, null)
  },
  {
    emits: ['draw'],
  },
)
