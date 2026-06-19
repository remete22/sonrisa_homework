export interface SubscriptionChannel {
  channelId: number
  name: string
}

export interface SubscriptionMethod {
  methodId: number
  methodName: string
}

export interface UserSubscription {
  subscriptionId: number
  channels: SubscriptionChannel[]
  method: SubscriptionMethod
}

export interface UserWithSubscription {
  userId: number
  email: string
  isActive: boolean
  subscription: UserSubscription | null
}

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const users = ref<UserWithSubscription[]>([])
  const methods = ref<SubscriptionMethod[]>([])

  function setUsers(data: UserWithSubscription[]) {
    users.value = data
  }

  function setMethods(data: SubscriptionMethod[]) {
    methods.value = data
  }

  return { users, methods, setUsers, setMethods }
})
