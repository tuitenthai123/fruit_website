<template>
<v-list>
  <v-list-item
    v-for="(item, i) in items"
    :key="i"
    :value="i"
    @click="item.action()"
  >
    <template #title>
      <span class="menu-item d-flex ga-2 align-center"> <v-icon>{{ item?.icon }}</v-icon> {{ item.title }}</span>
    </template>
  </v-list-item>
</v-list>
</template>

<script lang="ts" setup>

const store = useFruitStore()
const router = useRouter()


const items = [
  {
    title: 'Tài khoản của tôi',
    icon: "mdi-card-account-details",
    action: async () => {
      await router.push('/setting')
    }
  },
  {
    title: 'Đăng xuất',
    icon: "mdi-logout",
    action: async () => {
      try {
        const status = await store.logOut()
        if ((status as any)?.message) {
          await router.push('/')
        } else {
          await router.push('/')
        }
      } catch (err) {
        console.error('Logout error', err)
      }
    }
  }
]
</script>

<style scoped>
.menu-item {

  font-size: 13px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
}
</style>