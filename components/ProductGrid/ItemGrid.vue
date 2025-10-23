<template>
  <div>
    <div class="title-catelory my-10" @click="navigateRoute(slug)">
      <span>{{ title[0].toUpperCase() + title.substring(1) }}</span>
    </div>
    <v-row align="center" justify="space-between">
      <v-col v-for="(item, index) in itemdata" :key="index" cols="12" sm="2" class="d-flex justify-center">
        <div class="item-catelory">
          <div style="position: relative; display: inline-block; cursor: pointer;"
            @click="navigateProductinfo(item?.id)">
            <div v-if="(item?.status) !== 'Còn hàng'"
              style="position: absolute; top: 5px; left: 5px; font-size: 11px; color: white; background-color: #565656; padding: 4px; z-index: 1;">
              {{ item?.status }}
            </div>
            <img loading="lazy" :src="(item?.imageInfo[1] ?? item?.imageInfo[0])?.replace('compact', 'master')" alt=""
              width="182" height="182" />
          </div>
          <div class="info">
            <div class="title">{{ truncateWords(item.name, 5) }}</div>
            <div class="price">{{ item?.price }}</div>
            <v-btn @click="addProductToCart(item)" :color="item?.status === 'Còn hàng' ? '#f36f3f' : 'darkgray'"
              :disabled="item?.status !== 'Còn hàng'" small class="buy-btn">
              {{
                item?.status === 'Còn hàng' ? `Mua ngay` : `${item?.status}`
              }}
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <div class="show-more-btn my-10" @click="navigateRoute(slug)">
      <span>
        Xem thêm những sản phẩm <strong>{{ title[0].toLocaleLowerCase() + title.substring(1) }}</strong>
      </span>
    </div>
  </div>
  <v-snackbar class="pa-1" v-model="snackbar" color="white" location="top end" :timeout="2000">
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
import { useRouter } from 'vue-router';
import { truncateWords } from '~/lib/truncatewords';
const snackbar = ref(false)
const snackProduct = ref<any>(null)
const route = useRouter();
const store = useFruitStore()

const navigateRoute = (slug: string) => {
  route.push(`/collections/${slug}`)
}

const navigateProductinfo = (id: any) => {
  route.push(`/products/${id}`)
}

const addProductToCart = (product: any) => {
  store.updateProductToCart(product)
  snackProduct.value = {
    name: product?.name,
    price: product?.price,
    imginfo: product?.imageInfo[1] ?? product?.imageInfo[0],
  }
  snackbar.value = true
}


defineProps<{
  slug?: any,
  title?: any,
  itemdata?: Array<{
    imageInfo: any,
    name: any,
    price: any,
    status: any,
    id: any,
  }>
}>()
</script>