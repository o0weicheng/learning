import {
  defineComponent,
  createVNode,
  type VNodeTypes,
  type PropType,
  type ExtractPropTypes,
} from 'vue'

const SIZE_MAP = {
  mini: ' px-2 text-xs leading-[1.5]',
  small: ' px-4 text-sm leading-[1.5]',
  large: ' px-10 text-lg leading-[2]',
  default: ' px-6 text-base leading-[1.5]', // 处理空字符串或 undefined
} as const

const TYPE_MAP = {
  primary: ' bg-sky-600 border-sky-600 text-white active:bg-sky-700 active:border-sky-700',
  outline: ' border-gray-600 bg-white active:bg-gray-100',
  danger: ' border-red-600 text-white bg-red-600 active:bg-red-700 active:border-red-700',
  warning: ' border-amber-600 text-white bg-amber-600 active:bg-amber-700 active:border-amber-700',
  success:
    ' border-emerald-600 text-white bg-emerald-600 active:bg-emerald-700 active:border-emerald-700',
} as const

const buttonProps = {
  is: {
    type: [String, Object] as PropType<VNodeTypes>,
    default: 'button',
    required: false,
  },
  size: {
    type: String as PropType<keyof typeof SIZE_MAP | ''>,
    default: '',
    required: false,
  },
  type: {
    type: String as PropType<keyof typeof TYPE_MAP>,
    default: 'outline',
    required: false,
  },
} as const

export type UiButtonProps = ExtractPropTypes<typeof buttonProps>

export const UiButton = defineComponent({
  setup(props, { slots, emit }) {
    const handleButtonClick = (e: Event) => {
      emit('click', e)
    }

    return () => {
      const { is: componentType, size, type } = props

      let buttonStyle = `rounded border-2 transition duration-300 `

      buttonStyle += (size && SIZE_MAP[size as keyof typeof SIZE_MAP]) || SIZE_MAP.default
      buttonStyle += TYPE_MAP[type as keyof typeof TYPE_MAP] || TYPE_MAP.outline

      if (componentType !== 'button') buttonStyle = `[all:initial]`

      return createVNode(
        componentType as string,
        { class: buttonStyle, onClick: handleButtonClick },
        [createVNode('span', null, slots.default?.())],
      )
    }
  },
  props: buttonProps,
  emits: ['click'],
})
