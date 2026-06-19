<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[]
  modelValue: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex border-b border-gray-200 mb-6">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
      :class="modelValue === tab.id
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
      @click="emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
