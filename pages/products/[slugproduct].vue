<template>
  <v-app>
    <v-container grid-list-xs>
      <div>
        <v-breadcrumbs style="font-size: 13px; padding: 9px 0px;" :items="[
          { title: 'Trang chủ', disabled: false, href: '/' },
          { title: product_catelory, disabled: false, href: `/collections/${product_slug}` },
          { title: productData?.name || '', disabled: true },
        ]" />
      </div>
      <div>
        <v-row>
          <v-col cols="12" sm="6">
            <div class="image-carousel-container">
              <div class="main-image-wrapper">
                <v-window v-model="window" show-arrows class="main-carousel" :continuous="false">
                  <template v-slot:prev="{ props }">
                    <v-btn v-bind="props" class="carousel-nav-btn carousel-prev" icon size="large" variant="elevated"
                      style="bottom: auto;">
                      <v-icon size="24">mdi-chevron-left</v-icon>
                    </v-btn>
                  </template>

                  <template v-slot:next="{ props }">
                    <v-btn v-bind="props" class="carousel-nav-btn carousel-next" icon size="large" variant="elevated"
                      style="bottom: auto;">
                      <v-icon size="24">mdi-chevron-right</v-icon>
                    </v-btn>
                  </template>

                  <v-window-item v-for="(items, i) in productData?.imageInfo" :key="i" :value="i">
                    <div class="image-container">
                      <v-img :src="items" class="main-image" cover :aspect-ratio="1">
                        <template v-slot:placeholder>
                          <div class="image-placeholder">
                            <v-progress-circular indeterminate color="orange"></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                    </div>
                  </v-window-item>
                </v-window>

                <div class="image-counter">
                  {{ window + 1 }} / {{ productData?.imageInfo?.length ?? 0 }}
                </div>
              </div>

              <div class="thumbnail-nav">
                <div v-for="(img, i) in productData?.imageInfo" :key="i" class="thumbnail-item"
                  :class="{ active: window === i }" @click="window = i">
                  <v-img :src="img" class="thumbnail-image" cover :aspect-ratio="1" />
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="5" class="my-5">
            <h1 style="font-weight: 700; color: rgb(243, 111, 64); font-size: 24px;">{{ productData?.name }}</h1>
            <div>
              <span style="font-size: 14px;">Mã sản phẩm <span style="color:rgb(243, 111, 64);font-weight: 500; ">{{
                  productData?.id }}</span></span>
              <v-divider vertical class="mx-3" style="height: 15px;" thickness="2"></v-divider>
              <span style="font-size: 14px;">Tình trạng: <span style="color:rgb(243, 111, 64); font-weight: 500;">{{
                  productData?.status }}</span></span>
            </div>
            <h1 style="font-weight: 700; color: rgb(243, 111, 64); font-size: 18px;" class="py-3">Mã giảm giá</h1>

            <div class="d-flex ga-5">
              <span class="product-voucher--item">FREESHIP40K</span>
              <span class="product-voucher--item">FREESHIPNT</span>
            </div>

            <div class="mt-3">
              <span style="font-size: 25px;font-weight: 600;color: red;">{{ productData?.price }}</span>
            </div>

            <div class="d-flex align-center ga-4">
              <div class="quantity-wrapper d-flex align-center">
                <v-btn @click="handleChangeCountProduct(0)" :disabled="count_product <= 1" icon size="small"
                  variant="outlined" class="quantity-btn quantity-btn-left" color="orange-darken-1">
                  <v-icon size="18">mdi-minus</v-icon>
                </v-btn>

                <input v-model.number="count_product" type="number" min="1" hide-details variant="outlined"
                  density="compact" class="quantity-input" />

                <v-btn @click="handleChangeCountProduct(1)" icon size="small" variant="outlined"
                  class="quantity-btn quantity-btn-right" color="orange-darken-1">
                  <v-icon size="18">mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-btn color="orange-darken-1" size="large" class="add-to-cart-btn" prepend-icon="mdi-cart-plus"
                @click="handleAddToCard(productData)">
                Thêm vào giỏ
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="mt-5" id="product-description">
        <h1 style="font-weight: 700; color: rgb(243, 111, 64); font-size: 18px;" class="py-3">Thông tin sản phẩm</h1>
        <v-row>
          <v-col cols="12" sm="8">
            <div>
              <v-card elevation="2">
                <v-card-title>Mô tả sản phẩm</v-card-title>
                <v-container>
                  <v-divider />
                  <div>
                    <div class="product-description">
                      <div class="description-content expandable-toggle opened">
                        <div class="description-productdetail" :style="{
                          maxHeight: show_more ? 'none' : '900px',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease'
                        }" v-html="productData?.description">
                        </div>

                        <!-- chỗ này là vì v-html ko hiển thị được không tìm thấy thông tin nên để vậy. Trick lỏ thần thánh =))))))))) -->
                        <div class="description-productdetail"
                          v-if="productData?.description === 'Không tìm thấy thông tin sản phẩm'">
                          <span>{{ productData?.description }}</span>
                        </div>

                        <div class="description-btn" :class="{ expanded: show_more }"
                          @click="handleShowMoreDiscription()">
                          <button class="expandable-content_toggle">
                            <span class="expandable-content_toggle-text" :class="{ minus: show_more }">
                              {{ show_more ? 'Thu gọn nội dung' : 'Xem thêm nội dung' }}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-container>
              </v-card>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div style="position: sticky; top:75px ">
              <v-card class="pa-2" elevation="2">
                <div class="panel-card">
                  <span>Dịch vụ giao hàng</span>
                </div>
                <div>
                  <div class="d-flex ga-2 align-center py-2" v-for="(item, index) in sticky_panel_item" :key="index">
                    <v-avatar size="40"
                      style="border:1px solid; border-color: darkgray; border-radius: 25px; padding:4px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.5); opacity: 0.5;">
                      <v-icon>{{ item?.icon }}</v-icon>
                    </v-avatar>
                    <p style="font-size: 14px;" v-html="item.content">
                    </p>
                  </div>
                </div>

              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-app>
  <v-snackbar class="pa-1" v-model="snackbar" color="white" location="top right" :timeout="2000">
    <div class="d-flex justify-space-between align-center mb-2">
      <span style="color: #e53935; font-weight: 700;">Đã thêm vào giỏ hàng thành công!</span>
      <v-btn icon small variant="text" @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>


    <div class="d-flex align-start" style="gap: 10px; align-items: flex-start; overflow: hidden;">
      <v-img :src="snackProduct?.imginfo" max-width="70" min-width="70" height="70" cover
        style="border: 1px solid #eee; border-radius: 6px; flex-shrink: 0;" />

      <div style="
        flex: 1;
        min-width: 0;
        overflow: hidden;
        word-wrap: break-word;
        white-space: normal;
      ">
        <div style="
          font-weight: 600;
          font-size: 14px;
          color: #333;
          line-height: 1.3;
          word-break: break-word;
        ">
          {{ snackProduct?.name }}
        </div>

        <div style="color: #f36f3f; font-weight: 700; margin-top: 4px;">
          {{ snackProduct?.price }}
        </div>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const snackbar = ref(false)
const snackProduct = ref<any>(null)

interface productItem {
  name?: string,
  id?: string,
  slug?: string,
  status?: string,
  imageInfo?: string[],
  description?: string,
  price?: string,
  discount?: string[]
}

const route = useRoute()
const store = useFruitStore() as any

// giữ tên window như template của bạn (nếu muốn đổi tránh shadowing, có thể đổi)
const window = ref(0)
const productData = ref<productItem | null>(null)
let show_more = ref(false)

// Số lượng hiển thị trong input (giữ như bạn dùng)
let count_product = ref<number>(1)

const id_product = String(route.params.slugproduct || '')
let product_catelory = "Trái ngon hôm nay"
let product_slug = "all-product"
const product_type = id_product.slice(0, 2)

// cập nhật category theo prefix
switch (product_type) {
  case "VI":
    product_catelory = "Trái cây Việt Nam"
    product_slug = "viet-nam-product"
    break
  case "FR":
    product_catelory = "Trái cây nhập khẩu"
    product_slug = "foreign-product"
    break
  case "CT":
    product_catelory = "Trái cây cắt sẵn"
    product_slug = "pre-cut-product"
    break
}

const sticky_panel_item = [
  {
    icon: "mdi-package-variant-closed",
    content: "Cam kết 100% chính hãng"
  },
  {
    icon: "mdi-truck-fast",
    content: `Giao hàng dự kiến: <br> <strong>Thứ 2 - Chủ nhật từ 8h00 - 21h00</strong>`
  },
  {
    icon: "mdi-phone-in-talk",
    content: "Hỗ trợ 24/7 <br> <span>Với các kênh facebook, instagram & phone</span>"
  },
]

const fetchDataProductItem = async (id: any) => {
  if (!id) {
    productData.value = null
    count_product.value = 1
    return
  }

  await store.fetchDataItemProduct(id)
  productData.value = store.productitemdata || null

  if (productData.value?.imageInfo && Array.isArray(productData.value.imageInfo)) {
    productData.value.imageInfo = productData.value.imageInfo.map((url: string) =>
      url.includes('_compact') ? url.replace('_compact', '_master') : url
    )
  }

  if (productData.value?.id) {
    const existing = (store.cartproduct || []).find((p: any) => p.id === productData.value!.id)
    count_product.value = existing ? existing.count_product : 1
  } else {
    count_product.value = 1
  }

  window.value = 0
}

onMounted(() => {
  fetchDataProductItem(id_product)
})

watch(() => route.params.slugproduct, (v) => {
  fetchDataProductItem(String(v))
})

function makeProductForStore(p: any) {
  return {
    id: p?.id,
    name: p?.name ?? '',
    price: p?.price ?? '0₫',
    imageInfo: p?.imageInfo ?? [],
    imginfo: (p?.imageInfo && p?.imageInfo[0]) ?? p?.imginfo ?? '',
  }
}


const handleChangeCountProduct = async (typechange: number) => {
  if (!productData.value?.id) return

  const id = productData.value.id
  const existing = (store.cartproduct || []).find((p: any) => p.id === id)
  const productForStore = makeProductForStore(productData.value)

  if (typechange === 0) {
    if (existing) {
      const newCount = existing.count_product - 1
      if (newCount <= 0) {
        try {
          await store.removeFromCart(id)
          count_product.value = 1 
        } catch (err) {
          console.error('removeFromCart error', err)
        }
      } else {
        try {
          await store.updateProductToCart(productForStore, newCount)
          count_product.value = newCount
        } catch (err) {
          console.error('updateProductToCart error', err)
        }
      }
    } else {
      count_product.value = Math.max(1, count_product.value - 1)
    }
    return
  }

  if (typechange === 1) {
    if (existing) {
      const newCount = existing.count_product + 1
      try {
        await store.updateProductToCart(productForStore, newCount)
        count_product.value = newCount
      } catch (err) {
        console.error('updateProductToCart error', err)
      }
    } else {
      try {
        await store.updateProductToCart(productForStore, 1)
        count_product.value = 1
      } catch (err) {
        console.error('updateProductToCart error', err)
      }
    }
    return
  }
}

const handleAddToCard = async (product: any) => {
  if (!product?.id) return

  const id = product.id
  const existing = (store.cartproduct || []).find((p: any) => p.id === id)
  const productForStore = makeProductForStore(product)
  const addCount = Math.max(1, Number(count_product.value || 1))

  try {
    if (existing) {
      const newCount = existing.count_product + addCount
      await store.updateProductToCart(productForStore, newCount)
      count_product.value = newCount
    } else {
      await store.updateProductToCart(productForStore, addCount)
      count_product.value = addCount
    }

    snackProduct.value = {
      name: product?.name,
      price: product?.price,
      imginfo: (product?.imageInfo && (product.imageInfo[1] ?? product.imageInfo[0])) ?? product?.imginfo ?? '',
    }
    snackbar.value = true
  } catch (err) {
    console.error('addToCart/updateProductToCart error', err)
  }
}

const handleShowMoreDiscription = () => {
  const el = document.getElementById('product-description')
  show_more.value = !show_more.value
  if (el && !show_more.value) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>



<style scoped>
.description-content {
  position: relative;
}

.description-productdetail {
  transition: max-height 0.3s ease;
  position: relative;
}

.description-btn {
  position: relative;
  z-index: 3;
  margin-top: -20px;
  text-align: center;
  padding: 20px 0 10px 0;
  background: white;
}

.description-btn::before {
  content: "";
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4) 15%, #fff);
  transition: opacity 0.3s ease;
}

.description-btn.expanded::before {
  opacity: 0;
}

.expandable-content_toggle {
  border: 1px solid #f36f40;
  border-radius: 5px;
  padding: 10px;
  color: #f36f40;
  background: white;
  cursor: pointer;
}

.expandable-content_toggle-text::before {
  content: "+";
  padding-right: 5px;
  font-weight: 800;
}

.expandable-content_toggle-text.minus::before {
  content: "-";
  padding-right: 5px;
  font-weight: 500;
}

::v-deep(.description-productdetail) {
  transition: max-height 0.3s ease;
}

::v-deep(.description-productdetail > ul) {
  list-style: none;
  padding: 0;
}

::v-deep(.description-productdetail > p) {
  font-size: 15px;
}

::v-deep(.description-productdetail > h3) {
  font-size: 20px;
  font-weight: 700;
  color: #f36f40;
}

::v-deep(.description-productdetail > h4) {
  font-size: 18px;
  font-weight: 700;
  color: #f36f40;
}

::v-deep(.description-productdetail > ul > li) {
  position: relative;
  padding-left: 1.2em;
  text-indent: 0;
  margin-bottom: 8px;
}

::v-deep(.description-productdetail > ul > li::before) {
  content: '•';
  position: absolute;
  left: 0;
  top: 0;
  color: black;
}

.panel-card {
  position: relative;
  text-align: center;
  margin: 5px 0;
}

.panel-card::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 1px;
  background: #f36f40;
  z-index: 0;
}

.panel-card>span {
  position: relative;
  display: inline-block;
  padding: 0 10px;
  background: white;
  font-size: 14px;
  z-index: 1;
  font-size: 14px;
  font-weight: 700;
  color: rgb(243, 111, 64);
}

.image-carousel-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.main-image-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: #f8f9fa;
}

.main-carousel {
  border-radius: 16px;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: zoom-in;
}

.main-image {
  border-radius: 16px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-image:hover {
  transform: scale(1.05);
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5, #eeeeee);
}

.zoom-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.image-container:hover .zoom-overlay {
  opacity: 1;
  transform: scale(1.1);
}

.carousel-nav-btn {
  position: absolute;
  bottom: auto !important;
  transform: translateY(-50%) !important;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease !important;
}

.carousel-prev {
  left: 12px;
}

.carousel-next {
  right: 12px;
}

.carousel-nav-btn:hover {
  background: rgba(255, 255, 255, 1) !important;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2) !important;
}

.image-counter {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.thumbnail-nav {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

.thumbnail-item {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.thumbnail-item.active {
  border-color: #f36f40;
  box-shadow: 0 0 0 2px rgba(243, 111, 64, 0.3);
}

.thumbnail-item.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(243, 111, 64, 0.2);
  pointer-events: none;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.thumbnail-item:hover .thumbnail-image {
  transform: scale(1.1);
}

@media (max-width: 600px) {
  .carousel-nav-btn {
    width: 36px !important;
    height: 36px !important;
  }

  .carousel-prev {
    left: 8px;
  }

  .carousel-next {
    right: 8px;
  }

  .thumbnail-item {
    width: 50px;
    height: 50px;
  }

  .thumbnail-nav {
    gap: 6px;
  }

  .zoom-overlay {
    width: 36px;
    height: 36px;
    top: 8px;
    right: 8px;
  }
}

.product-voucher--item {
  cursor: pointer;
  border-radius: 6px;
  padding: 8px 15px;
  position: relative;
  background: #F9CFBDFF;
  font-weight: 700;
  letter-spacing: 1px;
}

.product-voucher--item:before {
  position: absolute;
  content: '';
  width: 12px;
  height: 12px;
  left: -7px;
  top: 12px;
  background: #fff;
  border: 1px solid #fff;
  border-top: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transform: rotate(90deg);
}

.product-voucher--item:after {
  position: absolute;
  content: '';
  width: 12px;
  height: 12px;
  right: -7px;
  top: 12px;
  background: #fff;
  border: 1px solid #fff;
  border-top: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: rotate(90deg);
}

.up-down-option {
  border: 1px;
  border-style: solid;
  padding: 10px;
  background-color: #f3f4f4;
  cursor: pointer;
}

.quantity-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.quantity-btn {
  border-radius: 0 !important;
  min-width: 40px !important;
  height: 40px !important;
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
  width: 70px;
}

.quantity-input {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.quantity-input {
  text-align: center !important;
  padding: 0 !important;
  font-weight: 600;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
}


.add-to-cart-btn {
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px;
  padding: 0 24px !important;
  box-shadow: 0 2px 8px rgba(243, 111, 64, 0.3) !important;
  transition: all 0.3s ease !important;
}

.add-to-cart-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(243, 111, 64, 0.4) !important;
}

@media (max-width: 600px) {
  .d-flex {
    flex-direction: column;
    gap: 12px;
  }

  .add-to-cart-btn {
    width: 100%;
  }
}

input:focus {
  outline: none;
}
</style>