<template>
  <v-app>
    <v-app-bar :elevation="2" color="primary" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-shield-account</v-icon>
        Admin Panel
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" :value="i" @click="item.action()">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app :rail="rail" @click="rail = false" color="surface" :width="280">
      <v-list density="compact" nav>
        <v-list-item v-for="item in menuItems" :key="item.title" :prepend-icon="item.icon" :title="item.title"
          :value="item.value" :active="selectedMenu === item.value" @click="selectedMenu = item.value" color="primary"
          class="mb-1"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-background">
      <v-container fluid class="pa-6">
        <div v-if="selectedMenu === 'dashboard'">
          <div class="d-flex align-center mb-6">
            <h1 class="text-h4 font-weight-bold text-primary">Dashboard</h1>
            <v-spacer></v-spacer>
            <v-chip color="success" variant="elevated">
              <v-icon start>mdi-circle</v-icon>
              Hệ thống hoạt động
            </v-chip>
          </div>

          <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3" v-for="stat in statsCards" :key="stat.title">
              <v-card :color="stat.color" variant="elevated" class="text-white stats-card" :elevation="4">
                <v-card-text>
                  <div class="d-flex align-center">
                    <div>
                      <p class="text-caption mb-1 text-white-darken-1">{{ stat.title }}</p>
                      <h2 class="text-h4 font-weight-bold">{{ stat.value }}</h2>
                      <div class="d-flex align-center mt-2">
                        <v-icon :color="stat.trend === 'up' ? 'success' : 'error'" size="small">
                          {{ stat.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down' }}
                        </v-icon>
                        <span class="text-caption ml-1">{{ stat.change }}</span>
                      </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-icon size="48" class="opacity-60">{{ stat.icon }}</v-icon>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <div>
            <div class="d-flex align-center mb-6">
              <h1 class="text-h4 font-weight-bold text-primary">Quản lý User</h1>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" @click="openAddDialog" size="large">
                Thêm User
              </v-btn>
            </div>

            <div v-if="isLoading">
              <v-skeleton-loader type="card, table" class="mb-6" :loading="true" />
            </div>
            <div v-else>
              <v-card class="mb-6" variant="elevated" :elevation="2">
                <v-card-text>
                  <v-row align="center">
                    <v-col cols="12" md="4">
                      <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Tìm kiếm user..."
                        variant="outlined" density="compact" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select v-model="statusFilter" :items="statusFilterOptions" label="Lọc theo trạng thái"
                        variant="outlined" density="compact" hide-details />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select v-model="roleFilter" :items="roleFilterOptions" item-title="label" item-value="value"
                        label="Lọc theo vai trò" variant="outlined" density="compact" hide-details />
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-btn variant="outlined" color="primary" @click="clearFilters" block>
                        Xóa bộ lọc
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card variant="elevated" :elevation="2">
                <ClientOnly>
                  <v-data-table :headers="headers" :items="filteredUsers" :search="search" class="elevation-0"
                    :items-per-page="10">
                    <template v-slot:[`item.avatar`]="{ item }">
                      <v-avatar color="accent" class="ma-2">
                        <v-img :src="item?.avata?.includes('google')
                          ? `/api/users/${item.avata.split('/').slice(-2).join('/')}`
                          : item.avata" />
                      </v-avatar>
                    </template>

                    <template v-slot:[`item.phonenumber`]="{ item }">
                      <span v-if="item.phonenumber">
                        {{ item.phonenumber }}
                      </span>
                      <v-chip v-else>
                        <span>
                          <v-icon size="small" color="red">mdi-alert-circle-outline</v-icon>
                          Chưa cung cấp
                        </span>
                      </v-chip>

                    </template>


                    <template v-slot:[`item.status`]="{ item }">
                      <v-chip :color="getStatusColor(item.status)" variant="elevated" size="small">
                        {{ getStatusLabel(item.status) }}
                      </v-chip>
                    </template>


                    <template v-slot:[`item.role`]="{ item }">
                      <v-chip :color="getRoleColor(item.role)" size="small">
                        {{ getRoleLabel(item?.role) }}
                      </v-chip>
                    </template>

                    <template v-slot:[`item.verifyemail`]="{ item }">
                      <v-chip :color="getVerifyEmailColor(item)" dark small>
                        <v-icon start size="14">
                          {{ getVerifyEmailIcon(item) }}
                        </v-icon>
                        {{ getVerifyEmailLabel(item) }}
                      </v-chip>
                    </template>

                    <template v-slot:[`item.password`]="{ item }">
                      <div class="d-flex align-center gap-2">
                        <template v-if="item.password">
                          <v-chip size="x-small" color="success" variant="flat" class="custom-chip">
                            <v-icon size="14" start>mdi-lock-check</v-icon>
                            Đã thiết lập
                          </v-chip>
                        </template>
                        <template v-else>
                          <v-btn color="warning" size="x-small" variant="outlined" class="custom-btn px-2"
                            prepend-icon="mdi-lock-alert" @click="openResetDialog(item.id)">
                            <span class="text-caption">Thiết lập</span>
                          </v-btn>
                        </template>
                      </div>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                      <v-btn icon="mdi-pencil" variant="text" color="primary" size="small" @click="editUser(item)" />
                      <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="confirmDelete(item)" />
                    </template>
                  </v-data-table>
                </ClientOnly>

              </v-card>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>

    <v-dialog v-model="userDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white">
          <v-icon class="mr-2">{{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ isEditing ? 'Chỉnh sửa User' : 'Thêm User Mới' }}
        </v-card-title>

        <v-card-text class="pt-6">
          <v-form ref="userForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="currentUser.name" label="Họ và tên" :rules="nameRules" variant="outlined"
                  prepend-inner-icon="mdi-account" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="currentUser.email" label="Email" :rules="emailRules" variant="outlined"
                  prepend-inner-icon="mdi-email" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="currentUser.phone" label="Số điện thoại" :rules="phoneRules" variant="outlined"
                  prepend-inner-icon="mdi-phone"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="currentUser.role" :items="roleOptions" item-title="label" item-value="value"
                  label="Vai trò" variant="outlined" prepend-inner-icon="mdi-shield-account" required />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="currentUser.status" :items="statusOptions" label="Trạng thái" variant="outlined"
                  prepend-inner-icon="mdi-check-circle" required />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="closeDialog">
            Hủy
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="onSaveUser" :disabled="!formValid || saving">
            {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">
          <v-icon class="mr-2">mdi-delete</v-icon>
          Xác nhận xóa
        </v-card-title>
        <v-card-text class="pt-4">
          Bạn có chắc chắn muốn xóa user <strong>{{ userToDelete?.name }}</strong>?
          <br>Hành động này không thể hoàn tác.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="deleteDialog = false">Hủy</v-btn>
          <v-btn color="error" variant="elevated" @click="onDeleteUser" :loading="deleting">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="resetDialog.show" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Link đặt lại mật khẩu</v-card-title>
        <v-card-text>
          <v-text-field v-model="resetDialog.url" label="URL" variant="outlined" readonly
            density="compact"></v-text-field>
          <p class="text-caption mt-2">Copy link này gửi cho người dùng.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="copyResetUrl">Copy</v-btn>
          <v-btn text @click="resetDialog.show = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top right">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import generateRandomId from '~/lib/randomID'

const store = useFruitStore()
const config = useRuntimeConfig()
const router = useRouter()
const resetDialog = ref({ show: false, url: '' })
const drawer = ref(false)
const rail = ref(false)
const userDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const formValid = ref(false)
const isLoading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const selectedMenu = ref('dashboard')
const search = ref('')
const statusFilter = ref('Tất cả')
const roleFilter = ref('all')
const userToDelete = ref(null)
const passwordDialog = ref(false)
const selectedPassword = ref('')

const snackbar = ref({ show: false, message: '', color: 'success' })

const items = [
  { title: 'Trang chủ', action: async () => await router.push("/") },
  { title: 'Hồ sơ', action: async () => await router.push("/setting") },
  { title: 'Đăng xuất', action: async () => { try { await store.logOut(); await router.push('/') } catch (e) { console.error(e) } } }
]

const menuItems = ref([
  { title: 'Dashboard', icon: 'mdi-view-dashboard', value: 'dashboard' },
  { title: 'Quản lý User', icon: 'mdi-account-group', value: 'users' },
  { title: 'Cài đặt', icon: 'mdi-cog', value: 'settings' },
  { title: 'Thống kê', icon: 'mdi-chart-line', value: 'analytics' },
  { title: 'Hỗ trợ', icon: 'mdi-help-circle', value: 'support' }
])

/* ---------- UI data ---------- */
const stats = ref([
  { title: 'Tổng Users', value: '0', change: '', trend: 'up', color: 'primary', icon: 'mdi-account-group' },
  { title: 'Users hoạt động', value: '0', change: '', trend: 'up', color: 'success', icon: 'mdi-account-check' },
  { title: 'Users bị khóa', value: '0', change: '', trend: 'down', color: 'error', icon: 'mdi-account-cancel' },
  { title: 'User xác thực Email', value: '0', change: '', trend: 'up', color: 'info', icon: 'mdi-email-check' }
])


const users = ref([])
const currentUser = ref({ id: ``, name: '', email: '', phonenumber: '', role: '2', status: true, department: '', active: false })

const headers = ref([
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Họ và tên', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Số điện thoại', key: 'phonenumber' },
  { title: 'Vai trò', key: 'role' },
  { title: 'Trạng thái', key: 'status' },
  { title: 'Xác thực', key: 'verifyemail' },
  { title: 'Mật khẩu', key: 'password', sortable: false },
  { title: 'Hành động', key: 'actions', sortable: false }
])

const statusFilterOptions = ref(['Tất cả', 'Hoạt động', 'Tạm khóa'])
const roleFilterOptions = ref([
  { label: 'Tất cả', value: 'all' },
  { label: 'Admin', value: '0' },
  { label: 'Manager', value: '1' },
  { label: 'User', value: '2' }
])

const statusOptions = ref(['Hoạt động', 'Tạm khóa'])
const roleOptions = ref([
  { label: 'Admin', value: '0' },
  { label: 'Manager', value: '1' },
  { label: 'User', value: '2' }
])

const nameRules = ref([v => !!v || 'Họ và tên là bắt buộc', v => (v && v.length >= 2) || 'Họ và tên phải có ít nhất 2 ký tự'])
const emailRules = ref([v => !!v || 'Email là bắt buộc', v => /.+@.+\..+/.test(v) || 'Email không hợp lệ'])
const phoneRules = ref([v => !v || /^[0-9]{9,11}$/.test(v) || 'Số điện thoại không hợp lệ'])

/* ---------- FILTERED USERS ---------- */
const filteredUsers = computed(() => {
  let filtered = [...(users.value || [])]

  if (statusFilter.value !== 'Tất cả') {
    filtered = filtered.filter(user => getStatusLabel(user.status) === statusFilter.value)
  }

  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => String(user.role) === roleFilter.value)
  }

  return filtered
})

/* ---------- ROLE / STATUS helpers (does NOT mutate server data) ---------- */
const roleMap = { '0': 'Admin', '1': 'Manager', '2': 'User' }
const mapRoleLabel = (rawRole) => {
  if (rawRole === null || rawRole === undefined) return ''
  return roleMap[String(rawRole)] ?? String(rawRole)
}
const getRoleLabel = (role) => {
  const roleMap = { '0': 'Admin', '1': 'Manager', '2': 'User' }
  if (role === null || role === undefined) return 'Không rõ'
  return roleMap[String(role)] ?? String(role)
}
const getRoleColor = (role) => {
  const label = mapRoleLabel(role)
  switch (label) {
    case 'Admin': return 'error'
    case 'Manager': return 'warning'
    case 'User': return 'success'
    default: return 'grey'
  }
}
const getStatusLabel = (status) => {
  if (typeof status === 'boolean') return status ? 'Hoạt động' : 'Tạm khóa'
  if (typeof status === 'string') return status
  return 'Không rõ'
}

const getVerifyEmailLabel = (u) => {
  if (!u) return 'Không rõ'
  return u.active === true ? 'Đã xác thực' : 'Chưa xác thực'
}

const getVerifyEmailColor = (u) => {
  if (!u) return 'grey'
  return u.active === true ? 'info' : 'grey'
}

const getVerifyEmailIcon = (u) => {
  if (!u) return 'mdi-help'
  return u.active === true ? 'mdi-email-check' : 'mdi-email-remove'
}


const getStatusColor = (status) => {
  const label = getStatusLabel(status)
  switch (label) {
    case 'Hoạt động': return 'success'
    case 'Tạm khóa': return 'warning'
    case 'Ngừng hoạt động': return 'error'
    default: return 'grey'
  }
}

const openResetDialog = (userId) => {
  const url = `${config.public.NUXT_DOMAIN}/login/${userId}`
  resetDialog.value = { show: true, url }
}

const copyResetUrl = async () => {
  try {
    if (!resetDialog.value.url) throw new Error('No URL')
    await navigator.clipboard.writeText(resetDialog.value.url)
    showSnackbar('Đã copy link đặt lại mật khẩu', 'success')
  } catch (err) {
    console.error(err)
    showSnackbar('Copy thất bại', 'error')
  }
}

const addUser = async (payload) => {
  try {
    const response_status = await store.addNewUser(payload)
    users.value.push(response_status)
    computeAndSetStats(users.value)
    showSnackbar('Thêm user thành công', 'success')
    return "alo"
  } catch (err) {
    console.error('addUser error', err)
    showSnackbar('Thêm user thất bại', 'error')
    throw err
  }
}

/* UPDATE */
const updateUser = async (id, payload) => {
  try {
    const updated = await store.updateUser(payload)
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) users.value[idx] = updated
    computeAndSetStats(users.value)
    showSnackbar('Cập nhật user thành công', 'success')
    return updated
  } catch (err) {
    console.error('updateUser error', err)
    showSnackbar('Cập nhật thất bại', 'error')
    throw err
  }
}

/* DELETE */
const removeUser = async (id) => {
  try {
    await store.deleteUser(id)
    users.value = users.value.filter(u => u.id !== id)
    computeAndSetStats(users.value)
    showSnackbar('Xóa user thành công', 'success')
    return true
  } catch (err) {
    console.error('removeUser error', err)
    showSnackbar('Xóa user thất bại', 'error')
    throw err
  }
}

const showPasswordDialog = (password) => {
  selectedPassword.value = password
  passwordDialog.value = true
}

const isActiveStrict = u => {
  if (!u) return false
  // if (typeof u.active === 'boolean') return u.active === true
  if (typeof u.status === 'boolean') return u.status === true
  return false
}
const isVerifyStrict = u => {
  if (!u) return false
  if (typeof u.active === 'boolean') return u.active === true
  return false
}
const isLockedStrict = u => {
  if (!u) return false
  // if (typeof u.active === 'boolean') return u.active === false
  if (typeof u.status === 'boolean') return u.status === false
  return false
}

const summarizeTotals = (arr = []) => {
  const list = Array.isArray(arr) ? arr : []
  const total = list.length
  let active = 0
  let withPhone = 0
  let locked = 0
  let verifyemail = 0

  for (const u of list) {
    if (isActiveStrict(u)) active++
    if (isLockedStrict(u)) locked++
    if (isVerifyStrict(u)) verifyemail++
    const p = u.phonenumber ?? u.phone ?? null
    if (p !== null && p !== undefined && String(p).trim() !== '' && String(p).trim() !== '0') withPhone++
  }

  return {
    total,
    active,
    verifyemail,
    locked,
    inactive: total - active,
    withPhone,
    withoutPhone: total - withPhone,
    activePercent: total ? Math.round(active * 100 / total) : 0,
    lockedPercent: total ? Math.round(locked * 100 / total) : 0
  }
}

/* computeAndSetStats */
const computeAndSetStats = (arr = []) => {
  const t = summarizeTotals(arr)
  stats.value[0].value = t.total
  stats.value[1].value = t.active
  stats.value[2].value = t.locked
  stats.value[3].value = t.verifyemail
}

/* ---------- UI handlers ---------- */
const openAddDialog = () => {
  isEditing.value = false
  currentUser.value = {
    id: `user_${generateRandomId(5)}`,
    name: '',
    email: '',
    phone: '',
    role: '2',
    status: 'Hoạt động'
  }
  userDialog.value = true
}

const editUser = (user) => {
  isEditing.value = true
  currentUser.value = {
    ...user,
    phone: user.phonenumber ?? '',
    role: String(user.role),
    status: user.status === true ? 'Hoạt động' : 'Tạm khóa'
  }
  console.log(currentUser.value)
  userDialog.value = true
}


const closeDialog = () => {
  userDialog.value = false
  currentUser.value = { id: null, name: '', email: '', phone: '', role: '', status: '', department: '', avata: '' }
  formValid.value = false
}

const onSaveUser = async () => {
  if (!formValid.value) return
  saving.value = true
  try {
    const payload_newuser = {
      id: currentUser.value.id,
      name: currentUser.value.name,
      email: currentUser.value.email,
      phonenumber: Number(currentUser.value.phone) || null,
      role: currentUser.value.role,
      active: currentUser.value.status === 'Hoạt động',
      status: currentUser.value.status === 'Hoạt động'
    }

    if (isEditing.value && currentUser.value.id) {
      await updateUser(currentUser.value.id, payload_newuser)
    } else {
      await addUser(payload_newuser)
    }

    userDialog.value = false
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const onDeleteUser = async () => {
  if (!userToDelete.value) return
  deleting.value = true
  try {
    await removeUser(userToDelete.value.id)
    userToDelete.value = null
    deleteDialog.value = false
  } catch (err) {
    console.error(err)
  } finally {
    deleting.value = false
  }
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'Tất cả'
  roleFilter.value = 'all'
}

const showSnackbar = (message, color = 'success') => {
  snackbar.value = { show: true, message, color }
}

const fetchInfoUser = async () => {
  return await store.fetchDataUser()
}

onMounted(async () => {
  try {
    const res = await fetchInfoUser()
    const arr = Array.isArray(res) ? res : (res?.data ?? [])
    users.value = arr.map(u => ({
      ...u,
      verifyemail: u.verifyemail ?? (u.active === true),
      showPassword: false
    }))
    computeAndSetStats(users.value)
  } catch (err) {
    console.error('fetchInfoUser error', err)
    showSnackbar('Lấy danh sách user thất bại', 'error')
  } finally {
    isLoading.value = false
  }
})

const statsCards = computed(() => stats.value)
definePageMeta({
  middleware: ["navigate-user-dashboard-client"]
})

</script>

<style scoped>
.stats-card {
  transition: transform 0.2s ease-in-out;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.v-data-table {
  border-radius: 12px;
}

.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}

.v-chip {
  border-radius: 16px;
}

.gap-2 {
  gap: 8px;
}

:deep(.v-btn.v-btn--density-comfortable) {
  padding: 0 12px;
  min-height: 32px;
  font-size: 0.875rem;
}

:deep(.v-chip.v-chip--size-small) {
  font-size: 0.75rem;
}

.custom-chip {
  height: 24px !important;
  font-size: 12px;
}

.custom-btn {
  height: 24px !important;
  letter-spacing: 0;
  font-weight: 500;
}

:deep(.custom-btn .v-btn__prepend) {
  margin-right: 4px;
}

:deep(.custom-btn .v-icon) {
  font-size: 14px;
}
</style>
