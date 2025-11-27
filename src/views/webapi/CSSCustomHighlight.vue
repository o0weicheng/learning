<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'

const articleRef = ref<HTMLElement | null>(null)
const highlightStyle = 'user-highlight' as const

const query = ref('故有无相生，难易相成，长短相较， 高下相倾，音声相和，前后相随')
const allTextNodes: Text[] = []

nextTick(() => {
  const treeWalker = document.createTreeWalker(articleRef.value as Node, NodeFilter.SHOW_TEXT)
  let currentNode = treeWalker.nextNode()
  while (currentNode) {
    allTextNodes.push(currentNode as Text)
    currentNode = treeWalker.nextNode()
  }
  handleQueryChange()
})

const handleQueryChange = () => {
  if (!CSS.highlights) {
    toast.warning('当前浏览器不支持 CSS Highlights API 功能')
    return
  }

  CSS.highlights.clear()

  const str = query.value.trim().toLowerCase()
  if (!str) return

  const ranges: Range[][] = allTextNodes
    .map((el) => ({ el, text: el.textContent.toLowerCase() }))
    .map(({ text, el }) => {
      const indices = []
      let startPos = 0
      while (startPos < text.length) {
        const index = text.indexOf(str, startPos)
        if (index === -1) break
        indices.push(index)
        startPos = index + str.length
      }
      return indices.map((index) => {
        const range = new Range()
        range.setStart(el, index)
        range.setEnd(el, index + str.length)
        return range
      })
    })

  const searchResultsHighlight = new Highlight(...ranges.flat())
  CSS.highlights.set(highlightStyle, searchResultsHighlight)
}
watch(() => query.value, handleQueryChange)
</script>

<template>
  <section>
    <div class="flex items-center flex-row gap-2">
      <label for="query-input" class="text-nowrap">输入搜索内容</label
      ><Input id="query-input" v-model="query" />
    </div>
    <article ref="articleRef" class="mt-4">
      <p>
        道可道，非常道； 名可名，非常名。 无名天地之始； 有名万物之母。 故常无欲，以观其妙；
        常有欲，以观其徼。 此两者，同出而异名，同谓之玄。 玄之又玄，众妙之门。
      </p>
      <p>
        天下皆知美之为美，斯恶已； 皆知善之为善，斯不善已。 故有无相生，难易相成，长短相较，
        高下相倾，音声相和，前后相随。 是以圣人处无为之事， 行不言之教，
        万物作而弗始也，生而弗有也， 为而弗恃也，功成而不处也。 夫唯不处，故弗去。
      </p>
      <p>
        不尚贤，使民不争； 不贵难得之货，使民不为盗； 不见可欲，使民心不乱。
        是以圣人之治，虚其心，实其腹， 弱其志，强其骨。 常使民无知无欲，使夫智者不敢为也。
        为无为，则无不治。
      </p>
      <p>
        道冲而用之或不盈。 渊兮似万物之宗。 挫其锐，解其纷，和其光，同其尘。 湛兮似或存。
        吾不知谁之子，象帝之先。
      </p>
    </article>
  </section>
</template>

<style>
::highlight(user-highlight) {
  background-color: oklch(0.914 0.246 264);
  color: oklch(0.212 0.084 264);
}
</style>
