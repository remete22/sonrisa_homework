<script setup lang="ts">
import type { UserWithSubscription, SubscriptionMethod } from '~/stores/subscriptions'

const subsStore = useSubscriptionsStore()

interface SubscriptionsResponse {
  users: UserWithSubscription[]
  methods: SubscriptionMethod[]
}

const { data, status, refresh } = await useFetch<SubscriptionsResponse>('/api/v1/subscriptions', {
  key: 'subscriptions',
})

watch(
  data,
  (val) => {
    if (!val) return
    subsStore.setUsers(val.users)
    subsStore.setMethods(val.methods)
  },
  { immediate: true },
)

const loading = computed(() => status.value === 'pending')

async function handleSaved() {
  await refresh()
}
</script>

<template>
  <div
    v-if="loading"
    class="py-16 text-center text-gray-400 text-sm"
  >
    Loading subscriptions…
  </div>

  <div
    v-else-if="!subsStore.users.length"
    class="py-16 text-center text-gray-400 text-sm"
  >
    No users found.
  </div>

  <div
    v-else
    class="space-y-4"
  >
    <SubscriptionCard
      v-for="user in subsStore.users"
      :key="user.userId"
      :user="user"
      @saved="handleSaved"
    />
  </div>
</template>
