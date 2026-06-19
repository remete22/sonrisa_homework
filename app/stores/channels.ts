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

  const filtered = computed<Channel[]>(() => {
    const q = search.value.toLowerCase().trim()
    if (!q) return channels.value
    return channels.value.filter(
      c => c.name.toLowerCase().includes(q) || c.url.toLowerCase().includes(q),
    )
  })

  function setChannels(data: Channel[]) {
    channels.value = data
  }

  return { channels, search, filtered, setChannels }
})
