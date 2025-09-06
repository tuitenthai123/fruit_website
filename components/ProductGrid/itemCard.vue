<template>
  <div>
    <v-row align="center" justify="space-between">
      <v-col v-for="(item, index) in itemdata" :key="index" cols="12" sm="2" class="d-flex justify-center">
        <div class="item-catelory">
          <div style="position: relative; display: inline-block; cursor: pointer;" @click="navigateProductinfo(item?.id)">
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
  </div>
</template>

<script lang="ts" setup>
import { truncateWords } from '~/lib/truncatewords'
defineProps<{
  itemdata?: Array<{
    imageInfo: any,
    name: any,
    price: any,
    status: any,
    id:any,
  }>
}>()

const navigateProductinfo = (id:any) =>{
  const route = useRouter();
  route.push(`/products/${id}`)
}
</script>

<style></style>