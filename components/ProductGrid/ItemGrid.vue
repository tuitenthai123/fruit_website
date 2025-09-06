<template>
  <div>
    <div class="title-catelory my-10" @click="navigateRoute(slug)">
      <span>{{ title[0].toUpperCase() + title.substring(1) }}</span>
    </div>
    <v-row align="center" justify="space-between">
      <v-col v-for="(item, index) in itemdata" :key="index" cols="12" sm="2" class="d-flex justify-center">
        <div class="item-catelory" @click="navigateProductinfo(item?.id)">
          <div style="position: relative; display: inline-block;">
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
            <v-btn :color="item?.status === 'Còn hàng' ? '#f36f3f' : 'darkgray'" :disabled="item?.status !== 'Còn hàng'"
              small class="buy-btn">
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { truncateWords } from '~/lib/truncatewords';

const route = useRouter();

const navigateRoute = (slug: string) => {
  route.push(`/collections/${slug}`)
}

const navigateProductinfo = (id:any) =>{
  route.push(`/products/${id}`)
}

defineProps<{
  slug?: any,
  title?: any,
  itemdata?: Array<{
    imageInfo: any,
    name: any,
    price: any,
    status: any,
    id:any,
  }>
}>()
</script>