<template>
  <v-app>
    <v-container grid-list-xs>
      <template v-if="isLoading">
        <v-skeleton-loader type="list-item" class="mb-2"></v-skeleton-loader>
        <v-skeleton-loader type="image" height="400"></v-skeleton-loader>
        
        <div class="d-flex justify-space-between align-center" style="padding: 25px 30px;">
          <v-skeleton-loader type="text" width="200"></v-skeleton-loader>
          <v-skeleton-loader type="button" width="150"></v-skeleton-loader>
        </div>

        <v-row>
          <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
            <v-skeleton-loader type="card"></v-skeleton-loader>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <div>
          <v-breadcrumbs style="font-size: 13px; padding: 9px 0px;" :items="items" />
          <v-img
            class="mx-auto"
            :src=bannerproduct
            aspect-ratio="16/9"
            cover
          />
        </div>

        <div class="d-flex justify-space-between align-center" style="padding: 25px 30px;">
          <div class="title-product">
            <span>{{ productTitle }}</span>
          </div>
          <div>
            <v-menu open-on-hover>
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  style="border: 1px solid rgb(231, 231, 231); padding: 5px;"
                  class="d-flex align-center"
                >
                  <div style="font-size: 13px; font-weight: 500; width: 168px;" class="d-flex align-center">
                    <v-icon small>mdi-sort-alphabetical-ascending</v-icon>
                    <span class="ml-1">Sắp xếp</span>
                  </div>
                  <v-icon small class="ml-2">mdi-chevron-down</v-icon>
                </div>
              </template>
              <v-list>
                <v-list-item
                  v-for="(opt, idx) in sortOptions"
                  :key="idx"
                  @click="handleSort(idx)"
                >
                  <v-list-item-title class="option-sort d-flex align-center">
                    <v-icon
                      v-if="selectedSortIndex === idx"
                      small
                      color="rgb(243, 111, 64)"
                      class="mr-2"
                    >mdi-check</v-icon>
                    {{ opt.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <div>
          <ItemCard :itemdata="ortherproduct" />
        </div>

        <div
          v-if="ortherproduct.length < store.productdata.length"
          class="show-more-btn my-10 text-center"
          @click="hanldeWatchmore"
        >
          <span>
            Xem thêm những sản phẩm <strong>{{ productTitle[0].toLocaleLowerCase() + productTitle.substring(1) }}</strong>
          </span>
        </div>
      </template>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ItemCard } from "#components"

const route = useRoute()
const typeofproduct = route.params.typeofproduct

interface Product {
  id: string
  name: string
  price: string | number
  status: string
  imageInfo: string[]
  slug?: string
  url?: string
  description?: string
  typeProduct?: number
}

let items:any = []
let bannerproduct = ""
let productType = ""
let productTitle = ""

const sortOptions = [
  { title: "Tên A → Z" },
  { title: "Tên Z → A" },
  { title: "Giá tăng dần" },
  { title: "Giá giảm dần" }
]

switch (typeofproduct) {
  case "all-product":
    items = [
      { title: 'Trang chủ', disabled: false, href: '/' },
      { title: 'Trái ngon hôm nay', disabled: true },
    ]
    productTitle = "Trái ngon hôm nay"
    productType ="OR"
    bannerproduct = "https://file.hstatic.net/200000377165/collection/banner-01_4e4d3cce8b774f8d97e8b91da39c5a52.jpg" 
    break
  case "foreign-product":
    items = [
      { title: 'Trang chủ', disabled: false, href: '/' },
      { title: 'Trái cây nhập khẩu', disabled: true },
    ]
    productTitle = "Trái cây nhập khẩu"
    productType ="FR"
    bannerproduct = "https://file.hstatic.net/200000377165/collection/banner-02_137f8f3369da4f7ca2d68b394191fcda.png"
    break
  case "pre-cut-product":
    items = [
      { title: 'Trang chủ', disabled: false, href: '/' },
      { title: 'Trái cây cắt sẵn', disabled: true },
    ]
    productTitle = "Trái cây cắt sẵn"
    productType ="CT"
    bannerproduct = "https://file.hstatic.net/200000377165/collection/hop_cat_thu_trai_cay_website_catergory_banner_debeabd1b2f84768b2493b5edfaabcc8.png"
    break
  case "viet-nam-product":
    items = [
      { title: 'Trang chủ', disabled: false, href: '/' },
      { title: 'Trái cây Việt Nam', disabled: true },
    ]
    productTitle = "Trái cây Việt Nam"
    productType ="VI"
    bannerproduct = "https://file.hstatic.net/200000377165/collection/banner_trai_cay_viet_2e7b9948ce92487895a56ffdbcbbfeea.png"
    break
}

const selectedSortIndex = ref(0)
const displayCount = ref(18)
const ortherproduct = ref<Product[]>([])
const isLoading = ref(true)

const store = useFruitStore()

const getNumericPrice = (price: string | number): number => {
  if (typeof price === 'string') {
    return parseInt(price.replace(/[^\d]/g, ''), 10) || 0
  }
  return price as number
}

const applySortAndSlice = (index: number) => {
  const arr = store.productdata.slice()
  switch (index) {
    case 0:
      arr.sort((a: Product, b: Product) => a.name.localeCompare(b.name))
      break
    case 1:
      arr.sort((a: Product, b: Product) => b.name.localeCompare(a.name))
      break
    case 2:
      arr.sort((a: Product, b: Product) => getNumericPrice(a.price) - getNumericPrice(b.price))
      break
    case 3:
      arr.sort((a: Product, b: Product) => getNumericPrice(b.price) - getNumericPrice(a.price))
      break
  }
  ortherproduct.value = arr.slice(0, displayCount.value)
}

const handleSort = (idx: number) => {
  selectedSortIndex.value = idx
  applySortAndSlice(idx)
}

const hanldeWatchmore = () => {
  displayCount.value += 18
  applySortAndSlice(selectedSortIndex.value)
}

const fetchDataProduct = async (typeofproduct:string) => {
  isLoading.value = true
  await store.fetchDataProduct(typeofproduct)
  setTimeout(() => {
    applySortAndSlice(selectedSortIndex.value)
    isLoading.value = false
  }, 1000)
}

onMounted(() => {
  fetchDataProduct(productType)
})
</script>

<style scoped>
.title-product {
  font-size: 24px;
  font-weight: 700;
  color: rgb(243, 111, 64);
}
.option-sort {
  font-size: 14px;
  padding: 12px;
}
.option-sort:hover {
  color: rgb(243, 111, 64);
}
.show-more-btn {
  cursor: pointer;
  font-size: 14px;
}
.v-skeleton-loader {
  border-radius: 8px;
  background: transparent !important;
}

.v-skeleton-loader ::v-deep .v-skeleton-loader__bone {
  background: rgba(243, 111, 64, 0.1) !important;
}
</style>
