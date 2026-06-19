<script setup lang="ts">
const store = useChannelsStore()
const emit = defineEmits<{ create: [] }>()
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <div class="relative flex-1">
      <Icon
        name="heroicons:magnifying-glass"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      />
      <input
        v-model="store.search"
        type="text"
        placeholder="Search channels..."
        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <button
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shrink-0"
      @click="emit('create')"
    >
      <Icon name="heroicons:plus" class="w-4 h-4" />
      New Channel
    </button>
  </div>
</template>
