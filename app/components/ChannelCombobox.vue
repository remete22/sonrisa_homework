<script setup lang="ts">
const props = defineProps<{
  channels: { channelId: number; name: string }[]
  modelValue: number[]
}>()
const emit = defineEmits<{ 'update:modelValue': [ids: number[]] }>()

const open = ref(false)
const search = ref('')
const container = ref<HTMLElement>()

const selected = ref<number[]>([...props.modelValue])
watch(() => props.modelValue, val => { selected.value = [...val] })

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return props.channels
  return props.channels.filter(c => c.name.toLowerCase().includes(q))
})

const label = computed(() => {
  if (!selected.value.length) return 'Select channels…'
  if (selected.value.length === 1) {
    return props.channels.find(c => c.channelId === selected.value[0])?.name ?? '1 channel'
  }
  return `${selected.value.length} channels selected`
})

function toggle(id: number) {
  const i = selected.value.indexOf(id)
  if (i === -1) selected.value = [...selected.value, id]
  else selected.value = selected.value.filter(x => x !== id)
  emit('update:modelValue', selected.value)
}

function handleOutsideClick(e: MouseEvent) {
  if (container.value && !container.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<template>
  <div
    ref="container"
    class="relative"
  >
    <button
      type="button"
      class="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      @click="open = !open"
    >
      <span :class="selected.length ? 'text-gray-900' : 'text-gray-400'">{{ label }}</span>
      <Icon
        :name="open ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
        class="w-4 h-4 text-gray-400 shrink-0"
      />
    </button>

    <div
      v-if="open"
      class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
    >
      <div class="p-2 border-b border-gray-100">
        <input
          v-model="search"
          type="text"
          placeholder="Search channels…"
          class="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <ul class="max-h-48 overflow-y-auto py-1">
        <li
          v-for="channel in filtered"
          :key="channel.channelId"
          class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer select-none"
          @click="toggle(channel.channelId)"
        >
          <input
            type="checkbox"
            :checked="selected.includes(channel.channelId)"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 pointer-events-none"
          />
          <span class="text-sm text-gray-700">{{ channel.name }}</span>
        </li>
        <li
          v-if="!filtered.length"
          class="px-3 py-2 text-sm text-gray-400"
        >
          No channels found
        </li>
      </ul>
    </div>
  </div>
</template>
