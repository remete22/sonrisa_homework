export interface Channel {
  channelId: number
  name: string
  url: string
  secret: string | null
  username: string | null
  isActive: boolean
  createdAt: string
}

export const useChannelsStore = defineStore('channels', () => {
  const channels = ref<Channel[]>([])
  const search = ref('')
  const loading = ref(false)

  const filtered = computed<Channel[]>(() => {
    const q = search.value.toLowerCase().trim()
    if (!q) return channels.value
    return channels.value.filter(
      c => c.name.toLowerCase().includes(q) || c.url.toLowerCase().includes(q),
    )
  })

  async function fetch() {
    loading.value = true
    try {
      channels.value = await $fetch<Channel[]>('/api/v1/channels')
    }
    finally {
      loading.value = false
    }
  }

  async function create(data: Pick<Channel, 'name' | 'url'> & Partial<Pick<Channel, 'secret' | 'username'>>) {
    const channel = await $fetch<Channel>('/api/v1/channels', { method: 'PUT', body: data })
    channels.value.unshift(channel)
  }

  async function update(id: number, data: Partial<Pick<Channel, 'name' | 'url' | 'secret' | 'username' | 'isActive'>>) {
    const channel = await $fetch<Channel>(`/api/v1/channels/${id}`, { method: 'PATCH', body: data })
    const i = channels.value.findIndex(c => c.channelId === id)
    if (i !== -1) channels.value[i] = channel
  }

  async function softDelete(id: number) {
    await update(id, { isActive: false })
  }

  return { channels, search, loading, filtered, fetch, create, update, softDelete }
})
