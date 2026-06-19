<script setup lang="ts">
import type { Channel } from '~/stores/channels'

const store = useChannelsStore()
const channelModalOpen = ref(false)
const confirmOpen = ref(false)
const editingChannel = ref<Channel | null>(null)
const deletingId = ref<number | null>(null)

function openCreate() {
  editingChannel.value = null
  channelModalOpen.value = true
}

function openEdit(channel: Channel) {
  editingChannel.value = channel
  channelModalOpen.value = true
}

function openDelete(id: number) {
  deletingId.value = id
  confirmOpen.value = true
}

async function handleDelete() {
  if (deletingId.value !== null) {
    await store.softDelete(deletingId.value)
    deletingId.value = null
  }
}

await callOnce('channels', () => store.fetch())
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">
      News Channels
    </h1>

    <PageHeader @create="openCreate" />
    <ChannelList @edit="openEdit" @delete="openDelete" />

    <ChannelModal
      v-model:open="channelModalOpen"
      :channel="editingChannel"
    />
    <ConfirmModal
      v-model:open="confirmOpen"
      @confirm="handleDelete"
    />
  </div>
</template>
