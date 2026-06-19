<script setup lang="ts">
defineProps<{ open: boolean }>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

function confirm() {
  emit('confirm')
  emit('update:open', false)
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
        @click="emit('update:open', false)"
      />
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="p-2 bg-red-100 rounded-lg shrink-0">
            <Icon name="heroicons:trash" class="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 class="text-base font-semibold text-gray-900">Deactivate channel</h2>
            <p class="mt-1 text-sm text-gray-500">
              This channel will be marked as inactive. You can re-enable it at any time by editing it.
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            @click="emit('update:open', false)"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            @click="confirm"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
