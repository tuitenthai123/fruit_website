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
                <v-list-item v-for="(item, i) in cateloryitem" :key="i" @click="() => { navigateToPage(item.slug, i) }">
                  <span class="menu-item">{{ item.title }}</span>
                </v-list-item>
              </v-list>
            </v-menu>

            <div>
              <NuxtLink to="/">
                <img src="https://theme.hstatic.net/200000377165/1001286359/14/logo_large.png?v=230" width="153"
                  height="55" alt="" />
              </NuxtLink>
            </div>

            <div class="input-custom">
              <input type="text" placeholder="Tìm kiếm sản phẩm..." />
              <button><v-icon>mdi-magnify</v-icon></button>
            </div>
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
                  <div><v-icon size="25">mdi-cart-outline</v-icon></div>
                  <div><span>Giỏ hàng</span></div>
                </button>
              </template>
              <CartProduct/>
            </v-menu>

            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <button v-if="!store.isLogin" class="menu-col" v-bind="props">

                  <v-icon size="25">mdi-account-outline</v-icon>
                  <span>Tài khoản</span>

                </button>
                <button v-else v-bind="props" class="menu-col">
                  <v-avatar size="50">
                    <v-img crossorigin="anonymous" :src="avata?.includes('google')
                      ? `/api/users/${avata.split('/').slice(-2).join('/')}`
                      : avata" alt="User avatar" />
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

interface CateloryItem {
  title: string
  slug: string
}

const router = useRouter()
const store = useFruitStore()

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
  const src = store.isLogin ? (store.userinfo as any)?.avata : "UR"
  return src
})



onMounted(() => {

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

.input-custom {
  background: white;
  border-radius: 3px;
  height: 40px;
  display: flex;
  align-items: center;
}

.input-custom>input {
  border: none;
  outline: none;
  flex: 1 1 0%;
  height: 100%;
  padding: 5px 15px;
}

.input-custom>button {
  padding: 5px;
  opacity: 0.3;
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

.country-option {
  border: 1px solid rgb(231, 231, 231);
  padding: 2px;
  border-radius: 4px;
}

.localtion-option:hover {
  background-color: #fef8f5;
  cursor: pointer;
}

.truncate {
  display: inline-block;
  max-width: 120px;
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