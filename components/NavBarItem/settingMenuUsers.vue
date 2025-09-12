<template>
  <v-list>
    <v-list-item v-for="(item, i) in filteredItems" :key="i" :value="i" @click="item.action()">
      <template #title>
        <span class="menu-item d-flex ga-2 align-center">
          <v-icon>{{ item.icon }}</v-icon> {{ item.title }}
        </span>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const store = useFruitStore()
const router = useRouter()

const items = [
  {
    role: "all",
    title: 'Tài khoản của tôi',
    icon: "mdi-card-account-details",
    action: async () => {
      await router.push('/setting')
    }
  },
  {
    role: "0",
    title: 'Trang quản trị viên',
    icon: "mdi-security",
    action: async () => {
      await router.push('/admin')
    }
  },
  {
    role: "1",
    title: 'Trang quản lý',
    icon: "mdi-face-man",
    action: async () => {
      await router.push('/manage')
    }
  },
  {
    role: "all",
    title: 'Đăng xuất',
    icon: "mdi-logout",
    action: async () => {
      try {
        await store.logOut()
        await router.push('/')
      } catch (err) {
        console.error('Logout error', err)
      }
    }
  },

]

const filteredItems = computed(() => {
  const role = (store.userinfo as any)?.role
  if (role === "0") {
    return items.filter(item => item.role === "all" || item.role === "0")
  }
  if (role === "1") {
    return items.filter(item => item.role === "all" || item.role === "1")
  }
  return items.filter(item => item.role === "all") // khác thì chỉ hiện all
})
</script>


<style scoped>
.menu-item {
  font-size: 13px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
}
</style>
