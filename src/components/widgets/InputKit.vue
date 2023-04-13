<script setup lang="ts">
const props = defineProps(['modelValue', 'inputType'])
const emit = defineEmits(['update:modelValue'])
const tempValue = ref(props.modelValue)
const [isShowInput, toggle] = useToggle(false)
</script>

<template>
  <div center-y>
    <slot name="mainIcon">
      <i icon-btn rotate-115 i-ic:baseline-key />
    </slot>
    <div v-if="isShowInput" class="wrapper">
      <input
        v-model="tempValue"
        :type="props.inputType || 'password'"
        class="input"
      >
      <i
        icon-btn i-carbon-checkmark @click="() => {
          $emit('update:modelValue', tempValue)
          toggle()
        }"
      />
      <i icon-btn i-carbon-close @click="toggle()" />
    </div>
    <div
      v-else
      cursor-pointer
      @click="toggle()"
    >
      <slot name="mainText">
        Key
      </slot>
    </div>
  </div>
</template>

<style scoped>
.wrapper{
  display: grid;
  grid-template-columns: auto 1fr 1fr;
}
</style>
