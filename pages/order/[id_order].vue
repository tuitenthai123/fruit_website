<template>
  <v-container class="py-10" style="max-width: 800px;">
    <div class="text-center mb-4">
      <v-icon :color="getStatusColor(orderData)" class="icon-large">
        {{ getStatusIcon(orderData) }}
      </v-icon>
    </div>

    <div class="text-center mb-8">
      <h2 class="font-weight-medium mb-2">
        {{ getStatusTitle(orderData) }}
      </h2>
      <p class="text-body-2 text-grey-darken-1">
        {{ getStatusMessage(orderData) }}
      </p>
    </div>

    <v-card variant="outlined" class="mb-8 pa-6">
      <h3 class="mb-4">Thông tin đơn hàng</h3>

      <v-row no-gutters>
        <v-col cols="6" class="text-body-2">Mã đơn hàng:</v-col>
        <v-col cols="6" class="text-right font-weight-medium">{{ orderData?.order_id }}</v-col>

        <v-col cols="6" class="text-body-2">Ngày đặt hàng:</v-col>
        <v-col cols="6" class="text-right">{{ formatDate(orderData?.order_details?.payment_date) }}</v-col>

        <v-col cols="6" class="text-body-2">Phương thức vận chuyển:</v-col>
        <v-col cols="6" class="text-right">
          {{orderData?.order_details?.shipping_menthod }}
        </v-col>

        <v-col cols="6" class="text-body-2">Phương thức thanh toán:</v-col>
        <v-col cols="6" class="text-right">{{ orderData?.payment_method }}</v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row no-gutters>
        <v-col cols="6" class="text-body-2">Tạm tính:</v-col>
        <v-col cols="6" class="text-right">{{ formatPrice(orderData?.payment_details?.subtotal) }}₫</v-col>

        <v-col cols="6" class="text-body-2">Phí vận chuyển:</v-col>
        <v-col cols="6" class="text-right">{{ formatPrice(orderData?.payment_details?.shippingFee) }}₫</v-col>

        <v-col cols="6" class="font-weight-medium">Tổng cộng:</v-col>
        <v-col cols="6" class="text-right font-weight-medium" style="color: #f36f3f">
          {{ formatPrice(orderData?.payment_details?.total) }}₫
        </v-col>
      </v-row>
    </v-card>

    <v-card variant="outlined" class="mb-8 pa-6">
      <h3 class="mb-4">Thông tin sản phẩm</h3>
      <div v-for="(item, index) in orderData?.product" :key="index">
        <div class="pa-3 mb-3 d-flex align-center justify-space-between">
          <div style="flex: 0 0 80px; display: flex; align-items: center; justify-content: center;">
            <img :src="(item.imginfo).replace('_compact', '_medium')" width="80" height="80" />
          </div>
          <div style="flex: 1; padding: 0 16px;">
            <div class="d-flex justify-space-between">
              <span style="font-weight: 600; font-size: 15px;">{{ item.name }}</span>
              <span style="font-weight: 500; font-size: 15px;">
                Đơn giá:
                <span style="color: #f36f3f; font-weight: 700;">{{ item.price }}</span>
              </span>
            </div>
            <div class="d-flex justify-space-between">
              <span style="font-weight: 500; font-size: 15px;">Số lượng: {{ item.quantity }}</span>
              <span style="font-weight: 500; font-size: 15px;">
                Tổng:
                <span style="color: #f36f3f; font-weight: 700;">
                  {{ formatPrice(parsePrice(item.price) * item.quantity) }}
                </span>
              </span>
            </div>
          </div>
        </div>
        <v-divider v-if="orderData?.product?.length > 1 && index < orderData?.product?.length - 1" />
      </div>
    </v-card>

    <v-card variant="outlined" class="pa-6">
      <h3 class="mb-4">Thông tin khách hàng</h3>
      <v-row>
        <v-col cols="12" md="6">
          <p class="font-weight-medium mb-1">Thông tin liên hệ</p>
          <p class="text-body-2">Email: {{ orderData?.contact?.email }}</p>
          <p class="text-body-2">SĐT: {{ orderData?.contact?.phone }}</p>
          <p class="text-body-2">Ghi chú: {{ orderData?.contact?.note || 'Không có' }}</p>
        </v-col>

        <v-col cols="12" md="6">
          <p class="font-weight-medium mb-1">Địa chỉ giao hàng</p>
          <p class="text-body-2">Người nhận: {{ orderData?.contact_address?.full_name }}</p>
          <p class="text-body-2">Địa chỉ: {{ orderData?.contact_address?.address }}</p>
          <p class="text-body-2">Chi tiết: {{ orderData?.contact_address?.detail_address }}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
const store = useFruitStore()
const orderData = ref<any>(null)

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0
  return Number(priceStr.replace(/[^\d]/g, "")) || 0
}

const formatPrice = (value: number) => {
  if (!value) return "0"
  return value.toLocaleString("vi-VN")
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

function getShippingName(value?: string) {
  const map: Record<string, string> = {
    "sieutoc": "HCM - Siêu tốc",
    "4h": "HCM - 4H",
    "sieure2h": "HCM - Siêu rẻ 2H",
    "30p": "Siêu tốc (30p/5km)",
  }
  return map[value ?? ""] || "Không xác định"
}

const getStatusColor = (order: any) => {
  if (!order) return "grey"
  if (!order.approve_status) return "warning"
  return order.response_code === "00" ? "success" : "error"
}

const getStatusIcon = (order: any) => {
  if (!order) return "mdi-help-circle-outline"
  if (!order.approve_status) return "mdi-clock-outline"
  return order.response_code === "00"
    ? "mdi-check-circle-outline"
    : "mdi-close-circle-outline"
}

const getStatusTitle = (order: any) => {
  if (!order) return ""
  if (!order.approve_status) return "Đang xác nhận đơn hàng"
  return order.response_code === "00"
    ? "Thanh toán thành công"
    : "Giao dịch bị hủy"
}

const getStatusMessage = (order: any) => {
  if (!order) return ""
  if (!order.approve_status)
    return "Đơn hàng của bạn đang được xác nhận. Vui lòng chờ trong giây lát."
  if (order.response_code === "00")
    return "Cảm ơn bạn đã mua hàng. Chúng tôi sẽ thông báo thông tin đơn hàng qua email trong thời gian sớm nhất."
  return "Người dùng đã hủy giao dịch hoặc thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức khác."
}

onMounted(async () => {
  try {
    const user_id = (store?.userinfo as any)?.id
    if (user_id) {
      const orders = await store.fetchDataOrder(user_id)
      orderData.value = orders.find((order: any) => order.order_id === route.params.id_order)
    }
  } catch (error) {
    console.error('Error fetching order:', error)
  }
})
</script>

<style scoped>
.text-blue {
  color: #1e88e5;
}

.icon-large {
  font-size: 64px;
}

.icon-small {
  font-size: 18px;
}
</style>
