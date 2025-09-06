<template>
  <v-app>
    <v-container grid-list-xs>
      <template v-if="isLoading">
        <v-skeleton-loader
          type="image"
          height="460"
          width="1140"
          class="mb-8"
        ></v-skeleton-loader>

        <div v-for="n in 4" :key="n" class="mb-8">
          <v-skeleton-loader
            type="text"
            width="80%"
            height="50"
            class="mx-auto mb-4"
          ></v-skeleton-loader>
          <v-row>
            <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="2">
              <v-skeleton-loader
                type="card"
                height="315"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
      </template>

      <template v-else>
        <v-carousel class="carousel" show-arrows="hover" transition="fade" hide-delimiters cycle interval="2500">
          <v-carousel-item v-for="(item, index) in carouselitem" :key="index" :src=item cover></v-carousel-item>
        </v-carousel>
        <ItemGrid title="Trái ngon mỗi ngày" :itemdata="otherProduct" slug="all-product" />
        <ItemGrid title="Trái cây Việt Nam" :itemdata="VietnamProduct" slug="viet-nam-product" />
        <ItemGrid title="Trái cây nhập khẩu" :itemdata="normalProduct" slug="foreign-product" />
        <ItemGrid title="Trái cây cắt sẵn" :itemdata="precutProduct" slug="pre-cut-product" />
      </template>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>

import { ItemGrid } from '#components';
import { ref } from 'vue';

interface Product {
  id: string;
  [key: string]: any;
}

let VietnamProduct = ref([])
let otherProduct = ref([])
let normalProduct = ref([])
let precutProduct = ref([])

const store = useFruitStore() as any
const isLoading = ref(true)

const fetchDataMainPage = async () => {
  isLoading.value = true
  await callOnce(store.fetchDataMainpage)
  const VIProduct = store.mainpagedata.filter((p: Product) => p.id.startsWith("VI")).slice(0, 12)
  const ORProduct = store.mainpagedata.filter((p: Product) => p.id.startsWith("OR")).slice(0, 12)
  const FRProduct = store.mainpagedata.filter((p: Product) => p.id.startsWith("FR")).slice(0, 12)
  const CTProduct = store.mainpagedata.filter((p: Product) => p.id.startsWith("CT")).slice(0, 12)
  
  setTimeout(() => {
    VietnamProduct.value = VIProduct
    otherProduct.value = ORProduct
    normalProduct.value = FRProduct
    precutProduct.value = CTProduct
    isLoading.value = false
  }, 1000)
}

onMounted(() => {
  fetchDataMainPage()
})

const carouselitem = [
  "//theme.hstatic.net/200000377165/1001286359/14/slide_1_img.jpg?v=244",
  "//theme.hstatic.net/200000377165/1001286359/14/slide_2_img.jpg?v=244",
  "//theme.hstatic.net/200000377165/1001286359/14/slide_3_img.jpg?v=244",
  "//theme.hstatic.net/200000377165/1001286359/14/slide_4_img.jpg?v=244"
]

</script>

<style>
.title-catelory {
  border: 1px;
  border-style: solid;
  border-radius: 25px;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  background: #f36f3f;
  padding: 10px;
  font-size: 24px;
  font-weight: 700;
  color: white;
  cursor: pointer;
}

.item-catelory {
  width: 191px;
  height: 315px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.item-catelory:hover {
  border: 2px solid #f36f3f;
  border-radius: 8px;
}



.item-catelory img {
  object-fit: cover;
}

.title {
  font-size: 14px;
  font-weight: 500;
}

.price {
  font-size: 14px;
  font-weight: 800;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  margin-top: 8px;
}

.buy-btn {
  margin-top: auto;
  align-self: stretch;
  background: #f36f3f;
}

.show-more-btn {
  border: 1px;
  border-style: solid;
  border-color: #f36f3f;
  border-radius: 3px;
  color: #f36f3f;
  width: 40%;
  margin: 0 auto;
  text-align: center;
  padding: 10px 2px;
  cursor: pointer;
}

.v-skeleton-loader {
  border-radius: 8px;
  background: transparent !important;
}

.v-skeleton-loader ::v-deep .v-skeleton-loader__bone {
  background: rgba(243, 111, 64, 0.1) !important;
}


@media (max-width: 600px) {
  .carousel {
    display: none;
  }
}
</style>