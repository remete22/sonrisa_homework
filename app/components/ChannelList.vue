<script setup lang="ts">
import type { Channel } from '~/stores/channels'

const store = useChannelsStore()

defineProps<{ loading?: boolean }>()

const emit = defineEmits<{
  edit: [channel: Channel]
  delete: [id: number]
}>()
</script>

<template>
  <div
    v-if="loading"
    class="py-16 text-center text-gray-400 text-sm"
  >
    Loading channels…
  </div>

  <div
    v-else-if="!store.filtered.length"
    class="py-16 text-center text-gray-400 text-sm"
  >
    {{ store.search ? 'No channels match your search.' : 'No channels yet. Create one above.' }}
  </div>

  <ul
    v-else
    class="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden"
  >
    <li
      v-for="channel in store.filtered"
      :key="channel.channelId"
      class="flex items-center gap-4 px-5 py-3.5 bg-white hover:bg-gray-50 transition-colors"
    >
      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5">
          <span class="font-medium text-gray-900 truncate">{{ channel.name }}</span>
          <span
            class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="channel.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'"
          >
            {{ channel.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
        <a
          :href="channel.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-blue-500 hover:underline truncate block"
        >
          {{ channel.url }}
        </a>
      </div>

      <!-- Date -->
      <span class="text-xs text-gray-400 shrink-0 hidden sm:block">
        {{ new Date(channel.createdAt).toLocaleDateString() }}
      </span>

      <!-- Actions -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          title="Edit"
          class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          @click="emit('edit', channel)"
        >
          <Icon name="heroicons:pencil-square" class="w-5 h-5" />
        </button>
        <button
          title="Deactivate"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          @click="emit('delete', channel.channelId)"
        >
          <Icon name="heroicons:trash" class="w-5 h-5" />
        </button>
      </div>
    </li>
  </ul>
</template>
