<template>
  <v-container class="mt-6" style="max-width: 1200px;">
    <v-breadcrumbs style="font-size: 13px; padding: 9px 0px;" :items="[
      { title: 'Trang chủ', disabled: false, href: '/' },
      { title: 'Giỏ hàng', disabled: true },
    ]" />

    <v-row>
      <v-col cols="12" md="8">
        <h2 style="color: #f36f3f; font-weight: 700;">Giỏ hàng của bạn</h2>
        <div v-if="loading">
          <v-skeleton-loader v-for="i in 3" :key="i" type="card" class="mb-3" />
        </div>
        <div v-else>
          <p>
            Bạn đang có <b>{{ totalCart }} sản phẩm</b> trong giỏ hàng
          </p>

          <v-card v-for="(item, index) in cart" :key="index" class="pa-3 mb-3 d-flex align-center justify-space-between"
            outlined>
            
            <div
              style="flex: 0 0 80px; position: relative; display: flex; align-items: center; justify-content: center;">
              <img :src="(item.imginfo).replace('_compact', '_medium')" width="80" height="80" />

              <v-btn icon size="x-small" color="red" variant="flat" class="delete-btn"
                style="position: absolute; top: -8px; left: -8px; background: white;" @click="clearProduct(item?.id)">
                <v-icon size="16">mdi-close</v-icon>
              </v-btn>
            </div>

            <div style="flex: 1; padding: 0 16px;">
              <div style="font-weight: 600; font-size: 15px;">
                {{ item.name }}
              </div>
              <div style="color: #f36f3f; font-weight: 700;">
                {{ item.price }}
              </div>
            </div>

            <div style="flex: 0 0 auto; display: flex; align-items: center;">
              <div class="d-flex flex-column align-end ml-2">
                <div class="quantity-wrapper d-flex align-center">
                  <v-btn @click="handleChangeCountProduct(index, 0)" :disabled="item.count_product <= 1" icon
                    size="small" variant="outlined" class="quantity-btn quantity-btn-left" color="orange-darken-1">
                    <v-icon size="18">mdi-minus</v-icon>
                  </v-btn>

                  <input v-model.number="item.count_product" type="number" min="1" class="quantity-input" />

                  <v-btn @click="handleChangeCountProduct(index, 1)" icon size="small" variant="outlined"
                    class="quantity-btn quantity-btn-right" color="orange-darken-1">
                    <v-icon size="18">mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>


          <v-card class="pa-3 mb-3" style="background: #fff8f5;" outlined>
            <h4 style="color: #f36f3f;">Ghi chú đơn hàng</h4>
            <p style="font-size: 14px; color: #333;">
              Lưu ý: Khách hàng đặt quà tặng trái cây, vui lòng ghi rõ thông tin
              của người được tặng và người đặt để Morning Fruit thuận tiện liên hệ.
            </p>
            <v-textarea placeholder="Nhập ghi chú..." variant="outlined" hide-details />
          </v-card>

          <v-checkbox label="Xuất hoá đơn cho đơn hàng" color="orange" hide-details />
        </div>
      </v-col>

      <v-col cols="12" md="4">
        <h3 style="color: #f36f3f; font-weight: 700;">Thông tin đơn hàng</h3>

        <v-card class="pa-3 mb-3" outlined>
          <v-radio-group v-model="deliveryOption">
            <v-radio label="Giao khi có hàng" value="now" />
            <v-radio label="Chọn thời gian" value="time" />
          </v-radio-group>
          <div v-if="deliveryOption === 'time'" class="mt-3">
            <div class="d-flex mb-3" style="gap: 16px;"> <v-select v-model="selectedDate" :items="dateOptions"
                label="Ngày giao" variant="outlined" hide-details></v-select> <v-select v-model="selectedTime"
                :items="timeOptions" label="Thời gian giao" variant="outlined" hide-details></v-select> </div> <v-btn
              block color="orange" variant="outlined" @click="confirmDeliveryTime"> XÁC NHẬN THỜI GIAN </v-btn>
          </div>
        </v-card>

        <div class="d-flex justify-space-between mb-3">
          <span style="font-weight: 600;">Tổng tiền:</span>
          <span style="color: red; font-weight: 700;">{{ totalPrice }}₫</span>
        </div>

        <v-btn block color="red" size="large" class="white--text mb-3" @click="router.push('/checkout/abc')">
          THANH TOÁN
        </v-btn>

        <v-card class="pa-3" style="background: #e8f6fc;" outlined>
          <h4 style="color: #333;">Chính sách mua hàng</h4>
          <p style="font-size: 14px;">
            Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối
            thiểu <b>100.000₫</b> trở lên.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const store = useFruitStore()
const router = useRouter()
const loading = ref(true)

const cart = computed(() => store.cartproduct)

const deliveryOption = ref("now")
const selectedDate = ref("Hôm nay")
const selectedTime = ref("08:00 - 10:00")

const dateOptions = ["Hôm nay", "Ngày mai", "Ngày kia"]
const timeOptions = ["08:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00",]
const confirmDeliveryTime = () => {
  console.log("Ngày giao:", selectedDate.value)
  console.log("Thời gian giao:", selectedTime.value)
  alert(`Đã chọn: ${selectedDate.value}, ${selectedTime.value}`)
}
const totalPrice = computed(() => {
  return cart.value.reduce(
    (sum, item) =>
      sum + parseInt(item.price.replace(/[.,₫]/g, "")) * item.count_product,
    0
  ).toLocaleString("vi-VN")
})

const handleChangeCountProduct = (index: number, typechange: number) => {
  if (typechange === 0 && cart.value[index].count_product > 1) {
    cart.value[index].count_product--
  } else if (typechange === 1) {
    cart.value[index].count_product++
  }
}

const clearProduct = (id: string) => {
  store.cartproduct = store.cartproduct.filter(item => item.id !== id)
}

const totalCart = computed(() => {
  return store.cartproduct.reduce((sum: number, item: any) => sum + item.count_product, 0)
})

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1500)
})
</script>

<style>
.delete-btn {
  width: 20px !important;
  height: 20px !important;
  padding: 0 !important;
}
</style>
