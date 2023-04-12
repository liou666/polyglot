<script lang="ts" setup inherit-attrs="false">
export interface Props {
  /**
   * level of depth
   *
   * @default 100
   */
  zIndex?: number

  /**
   * whether to allow close dialog by clicking mask layer
   *
   * @default true
   */
  closeByMask?: boolean

  /**
   * use v-if, destroy all the internal elements after closed
   *
   * @default true
   */
  useVIf?: boolean

  /**
   * The aria-labelledby id for the dialog.
   */
  dialogLabelledBy?: string

  /**
   * The visible for the dialog.
   */
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  zIndex: 100,
  closeByMask: true,
  useVIf: true,
})

const emit = defineEmits<{
  (event: 'close',): void
  (event: 'update:visible', value: boolean): void
}>()

/** scrollable HTML element */
const elDialogMain = ref<HTMLDivElement>()
const elDialogRoot = ref<HTMLDivElement>()

defineExpose({
  elDialogRoot,
  elDialogMain,
})

/** close the dialog */
function close() {
  emit('update:visible', false)
  emit('close')
}

function clickMask() {
  if (props.closeByMask)
    close()
}

const isVIf = computed(() => {
  return props.useVIf
    ? props.visible
    : true
})

// controls the state of v-show.
// when useVIf is toggled, v-show is true, otherwise it has the same state as modelValue
const isVShow = computed(() => {
  return !props.useVIf
    ? props.visible
    : true
})

function bindTypeToAny($attrs: any) {
  return $attrs as any
}

useEventListener('keydown', (e: KeyboardEvent) => {
  if (!props.visible)
    return
  if (e.key === 'Escape') {
    close()
    e.preventDefault()
  }
})
</script>

<template>
  <Teleport to="body">
    <!-- Dialog component -->
    <Transition name="dialog-visible">
      <div
        v-if="isVIf"
        v-show="isVShow"
        ref="elDialogRoot"
        :style="{
          'z-index': zIndex,
        }"
        fixed inset-0 of-y-auto hide-scrollbar overscroll-none
      >
        <!-- Mask layer: blur -->
        <div class="dialog-mask" absolute inset-0 z-0 bg-transparent opacity-100 backdrop-filter backdrop-blur-sm touch-none />
        <!-- Mask layer: dimming -->
        <div class="dialog-mask" absolute inset-0 z-0 bg-black opacity-48 touch-none h="[calc(100%+0.5px)]" @click="clickMask" />
        <!-- Dialog container -->
        <div class="p-safe-area" absolute inset-0 z-1 pointer-events-none opacity-100 flex>
          <div flex-1 flex items-center justify-center p-4>
            <div
              ref="elDialogMain"
              class="dialog-main rounded shadow-lg pointer-events-auto isolate bg-base border-base border-1px border-solid w-full max-h-full of-y-auto overscroll-contain touch-pan-y touch-pan-x"
              v-bind="bindTypeToAny($attrs)"
            >
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-visible-enter-active,
.dialog-visible-leave-active {
  transition-duration: 0.25s;
}

.dialog-mask {
    transition: opacity 0.25s ease;
  }

.dialog-main {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.dialog-visible-enter-from,
.dialog-visible-leave-to .dialog-mask {
    opacity: 0;
  }

.dialog-visible-enter-from,
.dialog-visible-leave-to .dialog-main {
    transform: translateY(50px);
    opacity: 0;
}

.p-safe-area {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
</style>
