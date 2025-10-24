<template>
  <v-list>
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      :value="i"
      @click="item.action()"
    >
      <template #title>
        <span class="menu-item d-flex ga-2 align-center">
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.title }}
        </span>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
const store = useFruitStore()
const router = useRouter()

interface UserInfo {
    id: string;
    role:string;
}

const items = ref([
  {
    title: 'Tài khoản của tôi',
    icon: 'mdi-card-account-details',
    action: async () => {
      await router.push('/setting')
    }
  },
  {
    title: 'Đăng xuất',
    icon: 'mdi-logout',
    action: async () => {
      try {
        const status = await store.logOut()
        await router.push('/')
      } catch (err) {
        console.error('Logout error', err)
      }
    }
  }
])

watch(
  () => (store.userinfo as UserInfo)?.role,
  (role) => {
    if (!role) return

    items.value = items.value.filter(
      (i) =>
        !['Admin Dashboard', 'Quản lý đơn hàng', 'Xem đơn hàng'].includes(i.title)
    )

    // Thêm theo role
    if (role === '0') {
      items.value.unshift({
        title: 'Admin Dashboard',
        icon: 'mdi-shield-account',
        action: async () => {await router.push('/admin')}
      })
    } else if (role === '1') {
      items.value.unshift({
        title: 'Quản lý đơn hàng',
        icon: 'mdi-clipboard-list-outline',
        action: async () => { await router.push('/order/manage') }
      })
    } else if (role === '2') {
      items.value.unshift({
        title: 'Xem đơn hàng',
        icon: 'mdi-eye-outline',
        action: async () => {await router.push('/order')}
      })
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.menu-item {
  font-size: 13px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
}
</style>
