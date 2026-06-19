<script setup lang="ts">
import type { Channel } from '~/stores/channels'

const props = defineProps<{
  open: boolean
  channel: Channel | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const store = useChannelsStore()

const form = ref({ name: '', url: '', username: '', secret: '', isActive: true })
const showSecret = ref(false)
const loading = ref(false)
const error = ref('')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    showSecret.value = false
    error.value = ''
    if (props.channel) {
      form.value = {
        name: props.channel.name,
        url: props.channel.url,
        username: props.channel.username ?? '',
        secret: props.channel.secret ?? '',
        isActive: props.channel.isActive,
      }
    }
    else {
      form.value = { name: '', url: '', username: '', secret: '', isActive: true }
    }
  },
)

function close() {
  emit('update:open', false)
}

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const data = {
      name: form.value.name,
      url: form.value.url,
      username: form.value.username || null,
      secret: form.value.secret || null,
    }
    if (props.channel) {
      await store.update(props.channel.channelId, { ...data, isActive: form.value.isActive })
    }
    else {
      await store.create(data)
    }
    close()
  }
  catch {
    error.value = 'Something went wrong. Please try again.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="close"
      />
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ channel ? 'Edit Channel' : 'New Channel' }}
          </h2>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="close"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form
          class="p-6 space-y-4"
          @submit.prevent="submit"
        >
          <p
            v-if="error"
            class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"
          >
            {{ error }}
          </p>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              required
              type="text"
              placeholder="e.g. BBC News"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              URL <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.url"
              required
              type="url"
              placeholder="https://feeds.example.com/rss"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="Optional"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Secret
              <span class="text-xs font-normal text-gray-400">(API key / token / password)</span>
            </label>
            <div class="relative">
              <input
                v-model="form.secret"
                :type="showSecret ? 'text' : 'password'"
                placeholder="Optional"
                class="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                @click="showSecret = !showSecret"
              >
                <Icon
                  :name="showSecret ? 'heroicons:eye-slash' : 'heroicons:eye'"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <!-- isActive toggle only shown when editing -->
          <div
            v-if="channel"
            class="flex items-center gap-2"
          >
            <input
              id="modal-isActive"
              v-model="form.isActive"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              for="modal-isActive"
              class="text-sm font-medium text-gray-700"
            >Active</label>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              @click="close"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Saving…' : channel ? 'Save Changes' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
