<script lang="ts" setup>
import { ScrollArea } from '@/components/ui/scroll-area'
</script>

<template>
  <ScrollArea class="h-screen">
    <div
      class="grid max-w-[1200px] mx-auto [grid-template-areas:'sidebar_body_toc'] grid-cols-[240px_1fr_240px] justify-between gap-x-4 gap-y-0 min-h-screen px-4"
    >
      <main class="contents">
        <aside
          class="sticky [grid-area:toc] overflow-y-auto pl-px top-(--sticky-header-height) max-h-[calc(100vh-var(--sticky-header-height))] pb-3 align-start items-start"
        >
          <slot name="navigate"></slot>
        </aside>

        <div class="[grid-area:body] pt-(--sticky-header-height) pb-3 px-2 box-border">
          <slot></slot>
        </div>
      </main>

      <aside class="[grid-area:sidebar]">
        <nav
          class="overflow-y-auto pl-px sticky top-(--sticky-header-height) max-h-[calc(100vh-var(--sticky-header-height))] pb-3"
        >
          <slot name="header"></slot>
        </nav>
      </aside>
    </div>
  </ScrollArea>
</template>
