<script setup lang="ts">
import type { Channel } from '~/stores/channels'

const channelsStore = useChannelsStore()

const tabs = [
  { id: 'channels', label: 'Channels' },
  { id: 'subscriptions', label: 'Subscriptions' },
]
const activeTab = ref('channels')

// ── Channels data ────────────────────────────────────────────────────────────
const { data: channelsData, status: channelsStatus, refresh: refreshChannels } = await useFetch<Channel[]>('/api/v1/channels', {
  key: 'channels',
})
watch(channelsData, val => channelsStore.setChannels(val ?? []), { immediate: true })
const channelsLoading = computed(() => channelsStatus.value === 'pending')

// ── Channels soft delete ─────────────────────────────────────────────────────
const softDeleteId = ref(0)
const { execute: runSoftDelete } = useFetch(
  () => `/api/v1/channels/${softDeleteId.value}`,
  { method: 'PATCH', body: { isActive: false }, immediate: false, watch: false },
)

// ── Channels modal state ─────────────────────────────────────────────────────
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
  if (deletingId.value === null) return
  softDeleteId.value = deletingId.value
  await runSoftDelete()
  await refreshChannels()
  deletingId.value = null
}
async function handleChannelSaved() {
  await refreshChannels()
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">
      Admin
    </h1>

    <TabBar v-model="activeTab" :tabs="tabs" />

    <!-- Channels tab -->
    <div v-show="activeTab === 'channels'">
      <PageHeader @create="openCreate" />
      <ChannelList :loading="channelsLoading" @edit="openEdit" @delete="openDelete" />
    </div>

    <!-- Subscriptions tab -->
    <div v-show="activeTab === 'subscriptions'">
      <SubscriptionList />
    </div>

    <ChannelModal
      v-model:open="channelModalOpen"
      :channel="editingChannel"
      @saved="handleChannelSaved"
    />
    <ConfirmModal
      v-model:open="confirmOpen"
      @confirm="handleDelete"
    />
  </div>
</template>
