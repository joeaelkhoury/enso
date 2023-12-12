<script setup lang="ts">
import DocumentationPanel from '@/components/DocumentationPanel.vue'
import NodeWidget from '@/components/GraphEditor/NodeWidget.vue'
import { injectGraphNavigator } from '@/providers/graphNavigator'
import { defineWidget, widgetProps } from '@/providers/widgetRegistry'
import { useGraphStore } from '@/stores/graph'
import { useSuggestionDbStore } from '@/stores/suggestionDatabase'
import { Ast } from '@/util/ast'
import { useAutoBlur } from '@/util/autoBlur'
import { Vec2 } from '@/util/vec2'
import { computed, ref } from 'vue'

const props = defineProps(widgetProps(widgetDefinition))

const docsVisible = ref(false)
const docsNode = ref()
const docsPos = ref(Vec2.Zero)

const spanClass = computed(() => props.input.typeName())
const children = computed(() => [...props.input.children()])

const graphStore = useGraphStore()
const suggestionDbStore = useSuggestionDbStore()

const graphNavigator = injectGraphNavigator()

const suggestionEntryId = computed(() => {
  if (!(props.input instanceof Ast.Ast)) return
  const methodPointer = graphStore.db.getExpressionInfo(props.input.astId)?.methodCall
    ?.methodPointer
  console.log('c', methodPointer)
  if (!methodPointer) return
  return suggestionDbStore.entries.findByMethodPointer(methodPointer)
})

function onContextMenu(event: Event) {
  docsVisible.value = true
  if (suggestionEntryId.value != null) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
  if (graphNavigator.sceneMousePos) docsPos.value = graphNavigator.sceneMousePos
}
useAutoBlur(docsNode)
</script>

<script lang="ts">
export const widgetDefinition = defineWidget((expression) => expression instanceof Ast.Ast, {
  priority: 1001,
})
</script>

<template>
  <span :class="['Tree', spanClass]" @contextmenu="onContextMenu"
    ><NodeWidget v-for="(child, index) in children" :key="child.astId ?? index" :input="child" />
    <Teleport v-if="docsVisible && suggestionEntryId != null" to=".viewport">
      <div
        ref="docsNode"
        :tabindex="-1"
        class="floating-documentation-panel"
        :style="{ transform: graphNavigator.prescaledTransform }"
        @blur="docsVisible = false"
        @pointerdown.stop
      >
        <div
          :style="{
            transform: `translate(${docsPos.x * graphNavigator.scale}px, ${
              docsPos.y * graphNavigator.scale
            }px)`,
          }"
        >
          <DocumentationPanel breadcrumbsDisabled :selectedEntry="suggestionEntryId" />
        </div>
      </div>
    </Teleport>
  </span>
</template>

<style scoped>
.Tree {
  white-space: pre;
  align-items: center;
  transition: background 0.2s ease;
  min-height: 24px;
  display: inline-block;

  &.Literal {
    font-weight: bold;
  }

  &.port {
    background-color: var(--node-color-port);
    border-radius: var(--node-border-radius);
    margin: -2px -4px;
    padding: 2px 4px;
  }
}

.floating-documentation-panel {
  position: fixed;
  height: 380px;
  width: 406px;

  > div {
    clip-path: inset(0 0 0 0 round var(--radius-default));
  }
}
</style>
