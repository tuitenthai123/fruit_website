<template>
  <div class="main-container">
    <div class="background-top-nav">
      Giảm <span style="font-weight: 600;">25,000</span> phí ship cho đơn hàng trên
      <span style="font-weight: 600;">600,000</span>
    </div>

    <div class="background-nav">
      <v-container grid-list-xs class="custom-container">
        <v-row align="center" justify="space-around" no-gutters>
          <div class="item-navbar-right">
            <v-menu>
              <template v-slot:activator="{ props }">
                <button class="menu-col" v-bind="props">
                  <div><v-icon>mdi-menu</v-icon></div>
                  <div><span>Menu</span></div>
                </button>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, i) in cateloryitem"
                  :key="i"
                  @click="() => { navigateToPage(item.slug, i) }"
                >
                  <span class="menu-item">{{ item.title }}</span>
                </v-list-item>
              </v-list>
            </v-menu>

            <div>
              <NuxtLink to="/">
                <img
                  src="https://theme.hstatic.net/200000377165/1001286359/14/logo_large.png?v=230"
                  width="153"
                  height="55"
                  alt=""
                />
              </NuxtLink>
            </div>

            <!-- AUTOCOMPLETE INPUT -->
            <div class="input-custom" style="position: relative; width: 360px;">
              <input
                v-model="searchText"
                @input="onInput"
                @focus="showSuggestions = true"
                @keydown.enter.prevent="onEnter"
                @keydown.arrow-down.prevent="highlightNext"
                @keydown.arrow-up.prevent="highlightPrev"
                @blur="onBlur"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                autocomplete="off"
              />
              <button @click="onSearchClick"><v-icon>mdi-magnify</v-icon></button>

              <div
                v-if="showSuggestions && suggestions.length"
                class="autocomplete-container"
                @mousedown.prevent
              >
                <div
                  v-for="(p, i) in suggestions"
                  :key="p.id ?? `${p.slug}-${i}`"
                  :class="['autocomplete-item', { 'is-active': i === activeIndex }]"
                  @click="selectProduct(p)"
                  @mousemove="activeIndex = i"
                >
                  <div style="display:flex; align-items:center; gap:8px;">
                    <img
                      :src="(p.imageInfo && p.imageInfo[0]) || p.imginfo || ''"
                      width="44"
                      height="44"
                      alt=""
                    />
                    <div style="min-width:0;">
                      <div class="truncate">{{ p.name }}</div>
                      <div style="font-size:12px; color:#888">{{ p.price || p.slug }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- END AUTOCOMPLETE -->

          </div>

          <div class="item-navbar-center">
            <LocationShipCard />
          </div>

          <div class="item-navbar-left">
            <button class="menu-col">
              <div><v-icon size="25">mdi-phone-outline</v-icon></div>
              <div><span>Hotline: 0865660775</span></div>
            </button>

            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <button class="menu-col" v-bind="props">
                  <div>
                    <v-badge :content="totalCart" color="red" overlap v-if="totalCart > 0">
                      <v-icon size="25">mdi-cart-outline</v-icon>
                    </v-badge>
                    <v-icon v-else size="25">mdi-cart-outline</v-icon>
                  </div>
                  <div><span>Giỏ hàng</span></div>
                </button>
              </template>
              <CartProduct />
            </v-menu>

            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <button v-if="!store.isLogin" class="menu-col" v-bind="props">
                  <v-icon size="25">mdi-account-outline</v-icon>
                  <span>Tài khoản</span>
                </button>
                <button v-else v-bind="props" class="menu-col">
                  <v-avatar size="50">
                    <v-img
                      crossorigin="anonymous"
                      :src="avata?.includes('google')
                        ? `/api/users/${avata.split('/').slice(-2).join('/')}`
                        : avata"
                      alt="User avatar"
                    />
                  </v-avatar>
                </button>
              </template>
              <LoginForm v-if="!store.isLogin" />
              <SettingMenuUsers v-else />
            </v-menu>
          </div>
        </v-row>
      </v-container>
    </div>

    <div class="item-navbar-bottom">
      <NavigateProduct :cateloryitem="cateloryitem" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useFruitStore()

interface CateloryItem {
  title: string
  slug: string
}

const cateloryitem: CateloryItem[] = [
  { title: 'Trang chủ', slug: '/' },
  { title: 'Trái ngon hôm nay', slug: '/collections/all-product' },
  { title: 'Trái cây Việt Nam', slug: '/collections/viet-nam-product' },
  { title: 'Trái cây nhập khẩu', slug: '/collections/foreign-product' },
  { title: 'Trái cây cắt sẵn', slug: '/collections/pre-cut-product' },
  { title: 'Quốc tế phụ nữ', slug: '/collections/women-day' },
  { title: 'Quà tặng trái cây', slug: '/collections/fruit-gift' },
  { title: 'Hộp quà Nguyệt Cát', slug: '/collections/nguyet-cat' },
  { title: 'Mâm ngũ quả', slug: '/collections/five-fruit' },
]

function navigateToPage(slug: string, index: number) {
  router.push(slug)
}

const avata = computed(() => {
  const src = store.isLogin ? (store.userinfo as any)?.avata : 'UR'
  return src
})

const totalCart = computed(() => {
  return store.cartproduct.reduce((sum: number, item: any) => sum + item.count_product, 0)
})

const searchText = ref('')
const showSuggestions = ref(false)
const suggestions = ref<any[]>([])
const activeIndex = ref(-1)
const debounceDelay = 220
let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function scheduleSearch(term: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (!term || term.trim().length < 2) {
      suggestions.value = []
      return
    }
    try {
      const res = await store.searchProductHybrid(term)
      suggestions.value = (res || []).slice(0, 10)
      activeIndex.value = -1
    } catch (err) {
      console.error('searchProductHybrid error', err)
      suggestions.value = []
    }
  }, debounceDelay)
}

function onInput() {
  showSuggestions.value = true
  scheduleSearch(searchText.value)
}

function selectProduct(p: any) {
  searchText.value = p.name
  showSuggestions.value = false
  suggestions.value = []
  router.push(`/products/${p.id}`)
}

function onSearchClick() {
  // if (suggestions.value.length) {
  //   selectProduct(suggestions.value[0])
  // } else if (searchText.value.trim()) {
  //   router.push(`/collections/all-product?search=${encodeURIComponent(searchText.value.trim())}`)
  //   showSuggestions.value = false
  // }
}

function onEnter() {
  if (activeIndex.value >= 0 && suggestions.value[activeIndex.value]) {
    selectProduct(suggestions.value[activeIndex.value])
  } else {
    onSearchClick()
  }
}
function highlightNext() {
  if (!suggestions.value.length) return
  activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
}
function highlightPrev() {
  if (!suggestions.value.length) return
  activeIndex.value = (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length
}
function onBlur() {
  // delay để click item kịp xử lý
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

/* preload allproduct chỉ khi rỗng — tránh gọi API nhiều lần */
onMounted(async () => {
  if (!store.allproduct || !store.allproduct.length) {
    try {
      await store.fetchAllDataProduct()
    } catch (err) {
      console.error('Preload allproduct failed', err)
    }
  }
})
</script>

<style scoped>
.main-container {
  font-family: 'Quicksand', sans-serif;
}

input::-webkit-input-placeholder {
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
}

.background-top-nav {
  background-color: #f38258;
  padding: 3px;
  text-align: center;
  font-weight: 500;
  font-size: 15px;
  color: white;
}

.background-nav {
  background-color: #f36f3f;
}

.custom-container {
  padding: 10px 0 !important;
}

.menu-col {
  display: flex;
  flex-direction: column;
  color: white;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.menu-item {
  font-size: 13px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
}

.item-navbar-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

/* Input + autocomplete styles */
.input-custom {
  background: white;
  border-radius: 3px;
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;
}

.input-custom > input {
  border: none;
  outline: none;
  flex: 1 1 0%;
  height: 100%;
  padding: 5px 12px;
}

.input-custom > button {
  padding: 5px;
  opacity: 0.6;
  background: transparent;
  border: none;
  cursor: pointer;
}

.autocomplete-container {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  max-height: 300px;
  overflow-y: auto;
  z-index: 60;
  padding: 8px;
}

.autocomplete-item {
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
}
.autocomplete-item + .autocomplete-item {
  margin-top: 6px;
}
.autocomplete-item img {
  border-radius: 4px;
  object-fit: cover;
}
.autocomplete-item:hover,
.autocomplete-item.is-active {
  background: #f6f6f6;
}

.item-navbar-left {
  display: flex;
  gap: 25px;
  font-weight: 500;
  font-size: 14px;
}

.item-navbar-center {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: 400;
  color: white;
}

.item-navbar-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 12px 16px;
  border-top: 1px solid #eee;
  gap: 0;
  color: #f36f3f;
}

.truncate {
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-weight: 500;
  font-size: 13.2px;
}

@media (max-width: 600px) {
  .input-custom {
    display: none;
  }

  .item-navbar-center {
    display: none;
  }

  .item-navbar-left>button>div>span {
    display: none;
  }

  .item-navbar-right>button>div>span {
    display: none;
  }

  .item-navbar-bottom {
    display: none;
  }
}

@media (max-width: 768px) {
  .bottom-button {
    font-size: 13px;
    padding: 8px 12px;
  }
}
</style>
