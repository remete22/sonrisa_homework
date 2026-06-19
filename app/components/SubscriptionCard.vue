<script setup lang="ts">
import type { UserWithSubscription } from '~/stores/subscriptions'

const props = defineProps<{ user: UserWithSubscription }>()
const emit = defineEmits<{ saved: [] }>()

const channelsStore = useChannelsStore()
const subsStore = useSubscriptionsStore()

const activeChannels = computed(() =>
  channelsStore.channels.filter(c => c.isActive),
)

const methodId = ref(props.user.subscription?.method.methodId ?? subsStore.methods[0]?.methodId ?? 1)
const selectedChannelIds = ref<number[]>(
  props.user.subscription?.channels.map(c => c.channelId) ?? [],
)
const saving = ref(false)
const error = ref('')

// ── useFetch: create ─────────────────────────────────────────────────────────
const createBody = ref({ userId: 0, methodId: 1, channelIds: [] as number[] })
const { execute: runCreate } = useFetch('/api/v1/subscriptions', {
  method: 'PUT',
  body: createBody,
  immediate: false,
  watch: false,
})

// ── useFetch: patch ──────────────────────────────────────────────────────────
const patchId = ref(0)
const patchBody = ref({ methodId: 1, channelIds: [] as number[] })
const { execute: runPatch } = useFetch(
  () => `/api/v1/subscriptions/${patchId.value}`,
  { method: 'PATCH', body: patchBody, immediate: false, watch: false },
)

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (props.user.subscription) {
      patchId.value = props.user.subscription.subscriptionId
      patchBody.value = { methodId: methodId.value, channelIds: selectedChannelIds.value }
      await runPatch()
    }
    else {
      createBody.value = {
        userId: props.user.userId,
        methodId: methodId.value,
        channelIds: selectedChannelIds.value,
      }
      await runCreate()
    }
    emit('saved')
  }
  catch {
    error.value = 'Failed to save. Please try again.'
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
    <!-- User -->
    <div class="flex items-center gap-2">
      <Icon name="heroicons:user-circle" class="w-5 h-5 text-gray-400 shrink-0" />
      <span class="text-sm font-medium text-gray-900">{{ user.email }}</span>
      <span
        class="text-xs px-2 py-0.5 rounded-full"
        :class="user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
      >
        {{ user.isActive ? 'Active' : 'Inactive' }}
      </span>
      <span
        v-if="!user.subscription"
        class="ml-auto text-xs text-gray-400"
      >No subscription yet</span>
    </div>

    <!-- Method -->
    <div>
      <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
        Notification method
      </label>
      <div class="flex gap-3">
        <label
          v-for="m in subsStore.methods"
          :key="m.methodId"
          class="flex items-center gap-2 cursor-pointer"
        >
          <input
            v-model="methodId"
            type="radio"
            :value="m.methodId"
            class="text-blue-600 focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700">{{ m.methodName }}</span>
        </label>
      </div>
    </div>

    <!-- Channels combobox -->
    <div>
      <label class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
        Channels
      </label>
      <ChannelCombobox
        v-model="selectedChannelIds"
        :channels="activeChannels"
      />
    </div>

    <p
      v-if="error"
      class="text-sm text-red-600"
    >
      {{ error }}
    </p>

    <div class="flex justify-end">
      <button
        :disabled="saving"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        @click="save"
      >
        {{ saving ? 'Saving…' : 'Save' }}
      </button>
    </div>
  </div>
</template>
