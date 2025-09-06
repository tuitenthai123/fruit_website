<template>
  <button class="bottom-button" v-for="(item, index) in cateloryitem" :key="index" :class="[
    { 'no-border': index === 0 },
    { 'active-button': selectedBottom === index }
  ]" @click="() => { navigateToPage(item.slug, index) }">
    {{ item.title }}
  </button>
</template>

<script lang="ts" setup>
const router = useRouter()
const currentRoute = useRoute()
const selectedBottom = ref<number>(0)
const props = defineProps<{
  cateloryitem: Array<{ title: string; slug: string }>
}>()

const cateloryitem = computed(() => props.cateloryitem ?? [])
function navigateToPage(slug: string, index: number) {
  selectedBottom.value = index
  router.push(slug)
}

function updateActiveTab() {
  const currentPath = currentRoute.path
  const activeIndex = props?.cateloryitem.findIndex(item => item.slug === currentPath)
  if (activeIndex !== -1) {
    selectedBottom.value = activeIndex
  }
}

onMounted(() => {
  updateActiveTab()
})

watch(() => currentRoute.path, () => {
  updateActiveTab()
})

</script>

<style scoped>
.bottom-button {
  background: transparent;
  border: none;
  border-left: 1px solid #ccc;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.bottom-button.active-button {
  background-color: rgb(243, 111, 64);
  color: white;
}

.bottom-button.no-border {
  border-left: none;
}
</style>