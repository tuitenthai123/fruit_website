<template>
  <v-container class="py-10" style="max-width: 800px;">
    <div class="text-center mb-4">
      <v-icon color="success" class="icon-large">mdi-check-circle-outline</v-icon>
    </div>

    <div class="text-center mb-8">
      <h2 class="font-weight-medium mb-2">Thanh toán thành công</h2>
      <p class="text-body-2 text-grey-darken-1">Cảm ơn bạn mua hàng các thông tin đơn hàng chúng tôi sẽ thông báo qua email trong thời gian sớm nhất</p>
    </div>

    <v-card variant="outlined" class="mb-8 pa-6">
      <h3 class=" mb-4">Thông tin đơn hàng</h3>

      <v-row no-gutters>
        <v-col cols="6" class="text-body-2">Mã đơn hàng:</v-col>
        <v-col cols="6" class="text-right font-weight-medium">86</v-col>

        <v-col cols="6" class="text-body-2">Mã giao dịch:</v-col>
        <v-col cols="6" class="text-right font-weight-medium">86</v-col>

        <v-col cols="6" class="text-body-2">Ngày giao dịch:</v-col>
        <v-col cols="6" class="text-right">May 6, 2017</v-col>

        <v-col cols="6" class="text-body-2">Hình thức mua hàng:</v-col>
        <v-col cols="6" class="text-right">Trả trước</v-col>

        <v-col cols="6" class="text-body-2">Phương thức vận chuyển:</v-col>
        <v-col cols="6" class="text-right">Siêu tốc</v-col>

        <v-col cols="6" class="text-body-2">Phương thức thanh toán:</v-col>
        <v-col cols="6" class="text-right">Credit card</v-col>

      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row no-gutters>
        <v-col cols="6" class="text-body-2">Tạm tính:</v-col>
        <v-col cols="6" class="text-right">$69.00</v-col>

        <v-col cols="6" class="text-body-2">Ship:</v-col>
        <v-col cols="6" class="text-right">$16.00</v-col>

        <v-col cols="6" class="font-weight-medium">Tổng cộng:</v-col>
        <v-col cols="6" class="text-right font-weight-medium">$87.00</v-col>
      </v-row>
    </v-card>

    <v-card variant="outlined" class="mb-8 pa-6">
      <h3 class=" mb-4">Thông tin sản phẩm</h3>
      <!-- Products -->
      <div v-for="(item, index) in cart" :key="index">
        <div class="pa-3 mb-3 d-flex align-center justify-space-between style-product">
          <div style="flex: 0 0 80px; position: relative; display: flex; align-items: center; justify-content: center;">
            <img :src="(item.imginfo).replace('_compact', '_medium')" width="80" height="80" />
          </div>

          <div style="flex: 1; padding: 0 16px;">
            <div class="d-flex justify-space-between">
              <span style="font-weight: 600; font-size: 15px;">{{ item.name }}</span>
              <span style="font-weight: 500; font-size: 15px;">
                Đơn giá: <span style="color: #f36f3f; font-weight: 700;">{{ item.price }}</span>
              </span>
            </div>
            <div class="d-flex justify-space-between">
              <span style="font-weight: 500; font-size: 15px;">Số lượng: {{ item.count_product }}</span>
              <span style="font-weight: 500; font-size: 15px;">
                Tổng: <span style="color: #f36f3f; font-weight: 700;">{{ formatPrice(parsePrice(item.price) *
                  item.count_product) }}</span>
              </span>
            </div>
          </div>
        </div>
        <v-divider v-if="cart.length > 1 && index < cart.length - 1" class="border-opacity-25" />
      </div>

    </v-card>



    <!-- Customer details -->
    <v-card variant="outlined" class="pa-6">
      <h3 class=" mb-4">Thông tin khách hàng</h3>

      <v-row>
        <!-- Contact -->
        <v-col cols="12" md="6">
          <p class="font-weight-medium mb-1">Contact</p>
          <p class="text-body-2">Email: dorin407@gmail.com</p>
          <p class="text-body-2">Phone: 0724260676</p>

          <p class="font-weight-medium mt-4 mb-1">Bank accounts and cards</p>
          <p class="text-body-2">
            Credit card
            <v-icon color="primary" class="icon-small mx-1">mdi-credit-card-outline</v-icon>
            Visa •••• 0987
          </p>
        </v-col>

        <!-- Billing -->
        <v-col cols="12" md="6">
          <p class="font-weight-medium mb-1">Billing address</p>
          <p class="text-body-2">Andrei Dorin</p>
          <p class="text-body-2">Dorin & Asociatii SRLD</p>
          <p class="text-body-2">Str Furtunel, 28, Bucharest sector 6</p>
          <p class="text-body-2">0623145</p>
          <p class="text-body-2">Romania</p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const store = useFruitStore()
const cart = computed(() => store.cartproduct)
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0
  return Number(priceStr.replace(/[^\d]/g, "")) || 0
}
const formatPrice = (value: number) => {
  if (!value) return "0 đ"
  return value.toLocaleString("vi-VN") + " đ"
}
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
