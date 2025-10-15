<template>
  
  <div class="checkout-wrapper">
    <!-- Thêm nút back -->
    <button class="btn-back" @click="$router.push('/cart')">
      <span>←</span> Quay lại giỏ hàng
    </button>
    
    <div class="checkout-left">
      
      <h2>Thông tin giao hàng</h2>
      <form @submit.prevent="onSubmit">
        <div class="form-row">
          <input v-model="form.fullname" type="text" placeholder="Họ và tên" required />
        </div>
        <div class="form-row">
          <input v-model="form.email" type="email" placeholder="Email" />
        </div>
        <div class="form-row">
          <input v-model="form.phone" type="tel" placeholder="Số điện thoại" required />
        </div>
        <div class="form-row">
          <input v-model="form.address" type="text" placeholder="Địa chỉ" required />
        </div>

        <div class="form-row grid-3">
          <select v-model="form.city">
            <option value="null" disabled>Chọn thành phố</option>
            <option value="hcm">Hồ Chí Minh</option>
          </select>

          <select id="customer_shipping_district" v-model="form.district" name="customer_shipping_district">
            <option value="null" disabled>Chọn quận / huyện</option>
            <option v-for="d in districts" :key="d.value" :value="d.value">{{ d.text }}</option>
          </select>

          <select id="customer_shipping_ward" v-model="form.ward" name="customer_shipping_ward">
            <option value="null" disabled>Chọn Phường / Xã</option>
            <option v-for="w in wardOptions" :key="w.value" :value="w.value">{{ w.text }}</option>
          </select>
        </div>

        <h3>Phương thức vận chuyển</h3>
        <div class="radio-group">
          <label>
            <input type="radio" value="sieutoc" v-model="form.ship" />
            HCM - Siêu tốc <span>{{ getShippingPrice('sieutoc') }}</span>
          </label>
          <label>
            <input type="radio" value="4h" v-model="form.ship" />
            HCM - 4H <span>{{ getShippingPrice('4h') }}</span>
          </label>
          <label>
            <input type="radio" value="sieure2h" v-model="form.ship" />
            HCM - Siêu rẻ 2H <span>{{ getShippingPrice('sieure2h') }}</span>
          </label>
          <label>
            <input type="radio" value="30p" v-model="form.ship" />
            Siêu tốc (30p/5km) <span>{{ getShippingPrice('30p') }}</span>
          </label>
        </div>


        <h3>Phương thức thanh toán</h3>
        <div class="radio-group" style="justify-content: center !important;">
          <label><input type="radio" value="cod" v-model="form.pay" /> Thanh toán khi giao hàng (COD)</label>
          <label><input type="radio" value="bank" v-model="form.pay" /> Chuyển khoản qua ngân hàng</label>
        </div>

        <button type="submit" class="btn-submit">Hoàn tất đơn hàng</button>
      </form>
    </div>

    <div class="checkout-right">
      <div class="cart-item" v-for="(item, index) in product" :key="index" style="position: relative;">
        <img :src="item?.imginfo.replace('_compact', '_small')" width="64" height="64" alt="SP"
          style="border-radius: 6px; border: 1px solid #ddd;" />

        <!-- Badge số lượng -->
        <div v-if="item?.count_product >= 2" style="
      position: absolute;
      top: 0;
      left: 0;
      background: red;
      color: white;
      font-size: 12px;
      font-weight: bold;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-30%, -30%);
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    ">
          {{ item.count_product }}
        </div>

        <div style="margin-left: 10px;">
          <p>{{ item?.name }}</p>
          <p class="price">{{ item.price }}</p>
        </div>
      </div>


      <div class="discount">
        <input v-model="coupon" type="text" placeholder="Mã giảm giá" />
        <button @click.prevent="applyCoupon">Sử dụng</button>
      </div>

      <a href="#" class="more-discount" @click.prevent>Xem thêm mã giảm giá</a>
      <div class="chips">
        <span>Giảm Ship 40,000đ</span>
        <span>Giảm Ship 25,000đ</span>
      </div>

      <div class="summary">
        <div><span>Tạm tính:</span><span>{{ subtotalText }}</span></div>
        <div><span>Phí vận chuyển:</span><span>{{ shippingPriceText }}</span></div>
        <div class="total"><span>Tổng cộng:</span><span>{{ totalText }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const store = useFruitStore()

const product = computed(() => store.cartproduct)

const form = ref({
  fullname: '',
  email: '',
  phone: '',
  address: '',
  city: 'hcm',
  district: '470',
  ward: 'null',
  ship: 'sieutoc',
  pay: 'cod'
})

const coupon = ref('')

const districts = [
  { value: '466', text: 'Quận 1' },
  { value: '470', text: 'Quận 5' },
  { value: '472', text: 'Quận 7' },
  { value: '480', text: 'Quận Bình Thạnh' },
  { value: '479', text: 'Quận Tân Bình' },
  { value: '483', text: 'Huyện Củ Chi' }
]

const wards = {
  '470': [{ value: '501', text: 'Phường 1' }, { value: '502', text: 'Phường 2' }],
  '472': [{ value: '27478', text: 'Phường Bình Thuận' }],
  '480': [{ value: '27510', text: 'Phường 1' }],
  '466': [{ value: '27601', text: 'Phường Bến Nghé' }],
  '479': [{ value: '27801', text: 'Phường 1' }],
  '483': [{ value: '27901', text: 'Thị trấn Củ Chi' }]
}

const wardOptions = ref([])
watch(() => form.value.district, v => updateWards(v))
function updateWards(d) {
  wardOptions.value = wards[d] ? [...wards[d]] : []
  if (!wardOptions.value.find(w => w.value === form.value.ward)) form.value.ward = 'null'
}

const distanceToShop = {
  '466': 0,
  '470': 4,
  '472': 8,
  '480': 6,
  '479': 7,
  '483': 30
}

const shippingPrice = computed(() => {
  const km = distanceToShop[form.value.district] ?? 0
  const base = 10000
  const perKm = 2000
  let price = base
  if (km > 3) price += (km - 3) * perKm

  switch (form.value.ship) {
    case '4h': price *= 0.8; break
    case 'sieure2h': price *= 0.9; break
    case '30p': price *= 1.5; break
  }
  return Math.round(price / 1000) * 1000
})

const getShippingPrice = (type) => {
  const km = distanceToShop[form.value.district] ?? 0
  const base = 10000
  const perKm = 2000
  let price = base

  if (km > 3) price += (km - 3) * perKm

  switch (type) {
    case 'sieutoc': price *= 1; break
    case '4h': price *= 0.8; break
    case 'sieure2h': price *= 0.9; break
    case '30p': price *= 1.5; break
  }

  price = Math.round(price / 1000) * 1000
  return `- ${price.toLocaleString('vi-VN')}đ`
}


const subtotal = computed(() => {
  return product.value.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^0-9]/g, ''))
    return sum + (price * (item.count_product || 1))
  }, 0)
})

const subtotalText = computed(() => `${subtotal.value.toLocaleString('vi-VN')}đ`)

const total = computed(() => subtotal.value + shippingPrice.value)
const shippingPriceText = computed(() => `${shippingPrice.value.toLocaleString('vi-VN')}đ`)
const totalText = computed(() => `${total.value.toLocaleString('vi-VN')}đ`)

function applyCoupon() {
  if (!coupon.value) return alert('Nhập mã giảm giá trước đã.')
  alert(`Áp mã: ${coupon.value} (demo)`)
}

function onSubmit() {
  if (!form.value.fullname || !form.value.phone || !form.value.address)
    return alert('Vui lòng điền đầy đủ thông tin.')
  if (form.value.district === 'null' || form.value.ward === 'null')
    return alert('Vui lòng chọn quận/huyện và phường/xã.')

  const orderData = {
    ...form.value,
    district: districts.find(d => d.value === form.value.district)?.text || '',
    ward: wardOptions.value.find(w => w.value === form.value.ward)?.text || '',
    products: product.value.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.count_product || 1
    })),
    payment: {
      subtotal: subtotal.value,
      shippingFee: shippingPrice.value,
      total: total.value,
      method: form.value.pay === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng',
      shippingMethod: form.value.ship
    }
  }

  console.log('Chi tiết đơn hàng:', orderData)
  alert(`Đặt hàng thành công!\nPhí ship: ${shippingPriceText.value}\nTổng: ${totalText.value}`)
}

onMounted(() => updateWards(form.value.district))
</script>

<style scoped>
.checkout-wrapper {
  display: flex;
  max-width: 1000px;
  margin: 20px auto;
  gap: 40px;
  font-size: 14px;
  font-family: 'Quicksand', sans-serif;
  background: #fff;
  padding: 18px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

.checkout-left {
  flex: 2;
}

.checkout-right {
  flex: 1;
  border-left: 1px solid #eee;
  padding-left: 20px;
}

h2,
h3 {
  font-size: 16px;
  margin: 16px 0 8px;
}

.form-row {
  margin-bottom: 12px;
}

.form-row input,
.form-row select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.form-row.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 9px;
  padding: 4px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  cursor: pointer;
  border-top: 1px solid #eee;
}

.radio-group label:first-of-type {
  border-top: 0;
}

.btn-submit {
  background: #2a7be4;
  color: #fff;
  padding: 12px;
  border: none;
  width: 100%;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}

.cart-item {
  display: flex;
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 12px;
}

.cart-item img {
  border: 1px solid #ddd;
  border-radius: 3px;
}

.price {
  font-weight: bold;
}

.discount {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.discount input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.discount button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 6px;
}

.more-discount {
  font-size: 13px;
  display: inline-block;
  margin-bottom: 8px;
  color: #666;
}

.chips span {
  background: #e8f6fc;
  color: #2a7be4;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 13px;
  margin-right: 5px;
}

.summary {
  margin-top: 16px;
  font-size: 14px;
}

.summary div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.summary .total {
  font-size: 16px;
  font-weight: bold;
  color: red;
}

.btn-back {
  position: absolute;
  left: 20px;
  top: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: #E9F4FFFF;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #e5e5e5;
  color: #333;
}

.btn-back span {
  font-size: 18px;
  line-height: 1;
}
</style>
