<template>
  <v-card color="#FFFFFFFF" style="font-family: 'Quicksand', sans-serif;" elevation="2" min-width="400">
    <v-container grid-list-xs>
      <h3 class="text-center mb-3" style="color: #F36F3F;">GIỎ HÀNG</h3>
      <v-divider class="mb-3"></v-divider>

      <!-- Nếu không có sản phẩm -->
      <div v-if="product.length === 0" class="text-center py-10">
        <v-icon size="40" color="orange-darken-1">mdi-cart-outline</v-icon>
        <p class="mt-2" style="color: gray;">Hiện chưa có sản phẩm</p>
      </div>

      <!-- Nếu có sản phẩm -->
      <div v-else>
        <div v-for="(item, index) in product" :key="index" class="mb-5 product-item d-flex">
          <v-img :src="item.imginfo" alt="product" max-width="70" class="mr-3 rounded"></v-img>

          <div class="product-info">
            <div>
              <div class="name-product">{{ item.name }}</div>
              <div>
                <div class="quantity-wrapper d-flex align-center">
                  <v-btn @click="handleChangeCountProduct(index, 0)" :disabled="item.count_product <= 1" icon size="small"
                    variant="outlined" class="quantity-btn quantity-btn-left" color="orange-darken-1">
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

            <div style="text-align: end;">
              <button @click="clearProduct(item.id)">
                <v-icon size="small">mdi-trash-can-outline</v-icon>
              </button><br>
              <span class="name-product">{{ formatPrice(parsePrice(item.price) * item.count_product) }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex justify-space-between pb-3">
          <span style="font-size: 18px; font-weight: 600;">Tổng tiền: </span>
          <span style="color: red; font-weight: 600; font-size: 18px;">{{ formatPrice(totalPrice) }}</span>
        </div>
        <v-btn style="width: 100%;" color="#F36F3F">Chi tiết giỏ hàng</v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
const store = useFruitStore()
const product = computed(() => store.cartproduct)

// Chuyển "150000 đ" -> 150000 (number)
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0
  return Number(priceStr.replace(/[^\d]/g, "")) || 0
}

// Format số -> "150.000 đ"
const formatPrice = (value: number) => {
  if (!value) return "0 đ"
  return value.toLocaleString("vi-VN") + " đ"
}

// Tổng tiền
const totalPrice = computed(() => {
  return product.value.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.count_product
  }, 0)
})

const handleChangeCountProduct = (index: number, typechange: number) => {
  if (typechange === 0 && product.value[index].count_product > 1) {
    product.value[index].count_product--
  } else if (typechange === 1) {
    product.value[index].count_product++
  }
}

const clearProduct = (id: string) => {
  store.cartproduct = store.cartproduct.filter(item => item.id !== id)
}
</script>

<style>
.product-item {
  border-bottom: 1px solid #E3E3E3FF;
  padding: 2px 2px 20px 2px;
}

.product-item:last-of-type {
  border: 0px;
  padding: 2px;
}

.product-info {
  display: flex;
  justify-content: space-between;
  flex: 1
}

.name-product {
  font-size: 12px;
  font-weight: 600;
}

.quantity-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  width: max-content;
}

.quantity-btn {
  border-radius: 0 !important;
  min-width: 20px !important;
  height: 25px !important;
}

.quantity-btn-left {
  border-right: 1px solid #e0e0e0 !important;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
}

.quantity-btn-right {
  border-left: 1px solid #e0e0e0 !important;
  border-top: none !important;
  border-bottom: none !important;
  border-right: none !important;
}

.quantity-input {
  width: 30px;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  text-align: center !important;
  padding: 0 !important;
  font-weight: 500;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
}
</style>
