<template>
  <v-app>
    <!-- Thanh tiêu đề -->
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-clipboard-list</v-icon>
        Quản lý đơn hàng
      </v-toolbar-title>
      <v-spacer />
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="white" size="36">
              <v-icon color="primary">mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="goHome">
            <v-list-item-title>
              <v-icon start color="primary">mdi-home</v-icon>
              Trang chủ
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon start color="error">mdi-logout</v-icon>
              Đăng xuất
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Menu bên trái -->
    <v-navigation-drawer v-model="drawer" app color="surface" :width="280">
      <v-list nav density="compact">
        <v-list-item v-for="item in menuItems" :key="item.title" :prepend-icon="item.icon" :title="item.title"
          :active="item.value === 'orders'" />
      </v-list>
    </v-navigation-drawer>

    <!-- Nội dung chính -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <!-- Hiển thị loading -->
        <transition name="fade" mode="out-in">
          <div v-if="loading" key="loading" class="d-flex flex-column align-center justify-center py-12">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4 text-subtitle-1 text-grey-darken-1">
              Đang tải dữ liệu đơn hàng...
            </p>
          </div>

          <!-- Khi load xong -->
          <div v-else key="content">
            <div class="d-flex align-center mb-6">
              <h1 class="text-h4 font-weight-bold text-primary">
                Danh sách đơn hàng
              </h1>
              <v-spacer />
              <v-chip color="primary" variant="elevated">
                <v-icon start>mdi-package-variant-closed</v-icon>
                {{ orders.length }} đơn hàng
              </v-chip>
            </div>

            <!-- Bộ lọc -->
            <v-card class="mb-6" :elevation="2">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="search" label="Tìm kiếm mã đơn hoặc tên KH" prepend-inner-icon="mdi-magnify"
                      variant="outlined" density="compact" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select v-model="statusFilter" :items="statusOptions" label="Trạng thái" variant="outlined"
                      density="compact" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn color="primary" variant="outlined" block @click="resetFilters">
                      <v-icon start>mdi-filter-remove</v-icon>
                      Xóa bộ lọc
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Bảng đơn hàng -->
            <v-card>
              <v-data-table :headers="headers" :items="filteredOrders" :search="search" :items-per-page="8">
                <template v-slot:[`item.payment_details.total`]="{ item }">
                  {{ formatCurrency(item.payment_details.total) }}
                </template>

                <template v-slot:[`item.approve_status`]="{ item }">
                  <!-- Nếu có response_code thì hiển thị lý do hủy trước -->
                  <v-chip v-if="item.response_code === '24'" color="error" size="small">
                    Khách hàng hủy
                  </v-chip>

                  <v-chip v-else-if="item.response_code === '01'" color="error" size="small">
                    Shop hủy
                  </v-chip>

                  <!-- Nếu không có response_code thì mới check approve_status -->
                  <v-chip v-else-if="item.approve_status" color="success" size="small">
                    Đã duyệt
                  </v-chip>

                  <v-chip v-else color="warning" size="small">
                    Chờ duyệt
                  </v-chip>
                </template>


                <template v-slot:[`item.order_details.payment_date`]="{ item }">
                  {{ formatPaymentDate(item.order_details.payment_date) }}
                </template>

                <template v-slot:[`item.payment_method`]="{ item }">
                  <v-chip :color="item.payment_method === 'COD' ? 'orange' : 'blue'" size="small" class="text-white">
                    {{ item.payment_method }}
                  </v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn v-if="!item.approve_status" color="success" size="x-small" variant="outlined"
                    prepend-icon="mdi-check" @click="approveOrder(item)">
                    Duyệt
                  </v-btn>
                  <v-btn v-if="!item.approve_status" color="error" size="x-small" variant="outlined"
                    prepend-icon="mdi-close" class="ml-2" @click="rejectOrder(item)">
                    Hủy
                  </v-btn>
                  <v-btn icon="mdi-eye" color="info" variant="text" class="ml-2" @click="viewDetails(item)" />
                </template>
              </v-data-table>
            </v-card>
          </div>
        </transition>
      </v-container>
    </v-main>

    <!-- Dialog chi tiết -->
    <v-dialog v-model="detailDialog" max-width="700px">
      <v-card v-if="selectedOrder">
        <v-card-title class="bg-primary text-white">
          <v-icon class="mr-2">mdi-receipt-text</v-icon>
          Chi tiết đơn hàng #{{ selectedOrder.order_id }}
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <h3 class="text-h6 mb-3">Thông tin khách hàng</h3>
              <p><strong>Họ tên:</strong> {{ selectedOrder.contact_address.full_name }}</p>
              <p><strong>SĐT:</strong> {{ selectedOrder.contact.phone }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.contact.email }}</p>
              <p><strong>Địa chỉ:</strong> {{ selectedOrder.contact_address.detail_address }}</p>
              <p v-if="selectedOrder.contact.note"><strong>Ghi chú:</strong> {{ selectedOrder.contact.note }}</p>
            </v-col>

            <v-col cols="12" md="6">
              <h3 class="text-h6 mb-3">Thông tin đơn hàng</h3>
              <p><strong>Phương thức TT:</strong> {{ selectedOrder.order_details.shopping_type }}</p>
              <p><strong>Vận chuyển:</strong> {{ selectedOrder.order_details.shipping_menthod }}</p>
              <p><strong>Ngày đặt:</strong> {{ formatPaymentDate(selectedOrder.order_details.payment_date) }}</p>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <h3 class="text-h6 mb-3">Chi tiết sản phẩm</h3>
          <v-table density="compact">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>SL</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in selectedOrder.product" :key="p.name">
                <td>
                  <div class="d-flex align-center">
                    <v-img :src="p.imginfo" width="40" height="40" class="mr-2" />
                    {{ p.name }}
                  </div>
                </td>
                <td>{{ p.price }}</td>
                <td>{{ p.quantity }}</td>
                <td>{{ formatCurrency(parseInt(p.price.replace(/\D/g, '')) * p.quantity) }}</td>
              </tr>
            </tbody>
          </v-table>

          <v-divider class="my-4" />

          <div class="d-flex justify-end">
            <div class="text-right">
              <p><strong>Tạm tính:</strong> {{ formatCurrency(selectedOrder.payment_details.subtotal) }}</p>
              <p><strong>Phí ship:</strong> {{ formatCurrency(selectedOrder.payment_details.shippingFee) }}</p>
              <p class="text-h6"><strong>Tổng cộng:</strong> {{ formatCurrency(selectedOrder.payment_details.total) }}
              </p>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="error" variant="text" @click="detailDialog = false">Đóng</v-btn>
          <v-btn v-if="!selectedOrder.approve_status" color="success" @click="approveOrder(selectedOrder)">
            Duyệt đơn
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="2500">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Đóng</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ["protect-manager-dashboard"]
})

const router = useRouter()
const drawer = ref(false)
const search = ref('')
const statusFilter = ref('Tất cả')
const detailDialog = ref(false)
const selectedOrder = ref(null)
const snackbar = ref({ show: false, message: '', color: 'success' })
const loading = ref(false)
const store = useFruitStore()

const menuItems = [
  { title: 'Tổng quan', icon: 'mdi-view-dashboard', value: 'dashboard' },
  { title: 'Sản phẩm', icon: 'mdi-fruit-pineapple', value: 'products' },
  { title: 'Đơn hàng', icon: 'mdi-clipboard-list', value: 'orders' },
  { title: 'Khách hàng', icon: 'mdi-account-group', value: 'customers' }
]

const orders = ref([])

onMounted(async () => {
  try {
    loading.value = true
    orders.value = await store.fetchDataOrderDashboard()
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, message: 'Lỗi tải dữ liệu đơn hàng', color: 'error' }
  } finally {
    loading.value = false
  }
})

const headers = [
  { title: 'Mã đơn', key: 'order_id' },
  { title: 'Khách hàng', key: 'contact_address.full_name' },
  { title: 'Tổng tiền', key: 'payment_details.total' },
  { title: 'PT Thanh toán', key: 'payment_method' },
  { title: 'Trạng thái', key: 'approve_status' },
  { title: 'Ngày đặt', key: 'order_details.payment_date' },
  { title: 'Thao tác', key: 'actions', sortable: false }
]

const statusOptions = ['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã hủy']

const filteredOrders = computed(() => {
  let result = [...orders.value]
  if (statusFilter.value !== 'Tất cả') {
    result = result.filter(o => {
      if (statusFilter.value === 'Chờ duyệt') return !o.approve_status
      if (statusFilter.value === 'Đã duyệt') return o.approve_status
      return false
    })
  }
  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(
      o =>
        o.order_id.toLowerCase().includes(term) ||
        o.contact_address.full_name.toLowerCase().includes(term)
    )
  }
  return result
})

function formatPaymentDate(dateStr) {
  return `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)} ${dateStr.slice(8, 10)}:${dateStr.slice(10, 12)}`
}

function formatCurrency(value) {
  return value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

async function approveOrder(order) {
  await store.updateOrderStatus(true, order.id)
  order.approve_status = true
  snackbar.value = { show: true, message: `Đã duyệt đơn ${order.order_id}`, color: 'success' }
}
async function rejectOrder(order) {
  await store.updateOrderStatus(false, order.id)
  order.approve_status = false
  snackbar.value = { show: true, message: `Đã hủy đơn ${order.order_id}`, color: 'error' }
}
function viewDetails(order) {
  selectedOrder.value = order
  detailDialog.value = true
}
function resetFilters() {
  search.value = ''
  statusFilter.value = 'Tất cả'
}
function goHome() {
  snackbar.value = { show: true, message: 'Quay về trang chủ...', color: 'primary' }
  setTimeout(() => router.push('/'), 800)
}
function logout() {
  snackbar.value = { show: true, message: 'Đã đăng xuất thành công', color: 'error' }
  setTimeout(() => router.push('/login'), 800)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
