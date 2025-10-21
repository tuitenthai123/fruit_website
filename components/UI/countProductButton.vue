<template>
  <div class="quantity-wrapper d-flex align-center">
    <v-btn
      @click="changeCount(0)"
      :disabled="modelValue <= 1"
      icon
      size="small"
      variant="outlined"
      class="quantity-btn quantity-btn-left"
      color="orange-darken-1"
    >
      <v-icon size="18">mdi-minus</v-icon>
    </v-btn>

    <input
      type="number"
      min="1"
      v-model.number="localValue"
      class="quantity-input"
    />

    <v-btn
      @click="changeCount(1)"
      icon
      size="small"
      variant="outlined"
      class="quantity-btn quantity-btn-right"
      color="orange-darken-1"
    >
      <v-icon size="18">mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val
  }
)

watch(localValue, (val) => {
  if (val < 1) localValue.value = 1
  emit('update:modelValue', localValue.value)
})

const changeCount = (type: number) => {
  let newValue = localValue.value
  if (type === 0 && newValue > 1) newValue--
  else if (type === 1) newValue++
  localValue.value = newValue
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.quantity-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  width: max-content;
}

.quantity-btn {
  border-radius: 0 !important;
  min-width: 20px !important;
  height: 25px !important;
}

.quantity-btn-left {
  border-right: 1px solid #e0e0e0 !important;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
}

.quantity-btn-right {
  border-left: 1px solid #e0e0e0 !important;
  border-top: none !important;
  border-bottom: none !important;
  border-right: none !important;
}

.quantity-input {
  width: 30px;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  text-align: center !important;
  padding: 0 !important;
  font-weight: 500;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
}
</style>
