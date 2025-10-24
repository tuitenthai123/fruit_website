<template>
  <v-container class="mt-6" style="max-width: 1200px;">
    <v-breadcrumbs style="font-size: 13px; padding: 9px 0px;" :items="[
      { title: 'Trang chủ', disabled: false, href: '/' },
      { title: 'Đơn hàng của tôi', disabled: true },
    ]" />

    <div v-if="loading">
      <v-skeleton-loader v-for="i in 3" :key="i" type="card" class="mb-3" />
    </div>

    <div v-else-if="orders.length === 0" class="text-center pa-8">
      <h3>Bạn chưa mua hàng</h3>
      <p class="mt-2">Hãy mua đi vì cuộc đời cho phép :3</p>
    </div>

    <div v-else>
      <h2 class="mb-4" style="color: #f36f3f;">Đơn hàng của tôi</h2>

      <v-row>
        <v-col v-for="order in orders" :key="order.order_id" cols="12" sm="6" md="4">
          <v-card outlined hover>
            <v-card-title class="d-flex justify-space-between py-2 px-3">
              <v-chip size="small" :color="order.approve_status ? 'success' : 'warning'">
                {{ order.approve_status ? 'Đã thanh toán' : 'Chờ thanh toán' }}
              </v-chip>
              <span class="text-caption">{{ formatDate(order.order_details?.payment_date) }}</span>
            </v-card-title>

            <v-card-text class="pt-2">
              <div class="mb-2">
                <div class="text-subtitle-2 mb-1">Sản phẩm ({{ order.product?.length || 0 }})</div>
                <div class="text-truncate">
                  {{order.product?.map(p => p.name).join(', ')}}
                </div>
              </div>

              <div class="d-flex justify-space-between align-center mt-3">
                <span class="text-caption">Tổng thanh toán:</span>
                <span class="text-h6" style="color: #f36f3f">
                  {{ formatPrice(order.payment_details?.total || 0) }}₫
                </span>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn variant="text" color="primary" block @click="router.push(`/order/${order.order_id}`)">
                Xem chi tiết
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>


    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const store = useFruitStore()
const loading = ref(true)

interface ProductItem {
  name: string
  price: number
  quantity: number
}

interface PaymentDetails {
  subtotal?: number
  shippingFee?: number
  total?: number
}

interface ContactAddress {
  full_name: string
  detail_address: string
}

interface OrderDetails {
  payment_date: string
  shopping_type: string
}

interface Order {
  order_id: string
  response_code?: string
  product: ProductItem[]
  payment_details?: PaymentDetails
  contact_address?: ContactAddress
  order_details?: OrderDetails
  approve_status?: boolean
}

const orders = ref<Order[]>([])

const router = useRouter()

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Không rõ thời gian'
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  const hour = dateString.substring(8, 10)
  const minute = dateString.substring(10, 12)
  return `${day}/${month}/${year} ${hour}:${minute}`
}

onMounted(async () => {
  try {
    const user_id = (store?.userinfo as any)?.id
    if (user_id) {
      const data = await store.fetchDataOrder(user_id)

      const parsedOrders: any[] = Array.isArray(data)
        ? data.map((item: any) => ({
          order_id: item.order_id ?? '',
          response_code: item.response_code ?? undefined,
          product: safeParse(item.product, []),
          payment_details: safeParse(item.payment_details, {}),
          contact_address: safeParse(item.contact_address, {}),
          order_details: safeParse(item.order_details, {}),
        }))
        : []

      orders.value = parsedOrders
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
})

function safeParse<T>(value: any, fallback: T): T {
  try {
    if (!value) return fallback
    if (typeof value === 'object') return value as T
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

</script>

<style scoped>
.v-card-title {
  background-color: #f5f5f5;
}
</style>
