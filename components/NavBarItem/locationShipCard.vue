<template>
  <v-menu :close-on-content-click="false" :nudge-width="200" offset-y absolute>
    <template v-slot:activator="{ props }">
      <button class="menu-col" v-bind="props">
        <span>
          Giao hoặc đến lấy tại <v-icon>mdi-chevron-down</v-icon>
        </span>
        <span class="truncate">
          {{ selectedLocation }}
        </span>
      </button>
    </template>
    <v-card width="auto">
      <v-container grid-list-xs>
        <div style="position: relative; text-align: center;" class="py-2">
          <span style="color: #f36f40;">KHU VỰC MUA HÀNG</span>
        </div>
        <div class="d-flex justify-center">
          <v-divider />
        </div>

        <v-list>
          <v-list-item>
            <div class="d-flex justify-space-between ga-10 main-container">
              <div>
                <label style="color: rgb(103, 114, 121); font-size: 13px; font-weight: 500;">
                  Tỉnh/Thành
                </label>
                <v-menu :close-on-content-click="false">
                  <template #activator="{ props }">
                    <div v-bind="props" class="d-flex align-center country-option" style="cursor: pointer;">
                      <div class="d-flex align-center" style="font-size: 13px; font-weight: 500; width: 168px;">
                        <span class="ml-1">{{ selectedCityText }}</span>
                      </div>
                      <v-icon small class="ml-2">mdi-chevron-down</v-icon>
                    </div>
                  </template>
                  <v-list>
                    <v-list-item @click="() => selectCity('default')">
                      <v-list-item-title>-Chọn Tỉnh/Thành</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="() => selectCity('hcm')">
                      <v-list-item-title>Hồ Chí Minh</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <div>
                <label style="color: rgb(103, 114, 121); font-size: 13px; font-weight: 500;">
                  Quận/Huyện
                </label>
                <v-menu :close-on-content-click="false">
                  <template #activator="{ props }">
                    <div v-bind="props" class="d-flex align-center country-option" style="cursor: pointer;">
                      <div class="d-flex align-center" style="font-size: 13px; font-weight: 500; width: 168px;">
                        <span class="ml-1">{{ selectedDistrictText }}</span>
                      </div>
                      <v-icon small class="ml-2">mdi-chevron-down</v-icon>
                    </div>
                  </template>
                  <v-list>
                    <v-list-item @click="() => selectDistrict('default')">
                      <v-list-item-title>-Chọn Quận/Huyện</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="() => selectDistrict('quan1')">
                      <v-list-item-title>Quận 1</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="() => selectDistrict('pnhuan')">
                      <v-list-item-title>Quận Phú Nhuận</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-list-item>
        </v-list>

        <div class="d-flex flex-column align-center mt-2">
          <div style="
                        border: 1px solid rgba(243, 111, 64, 0.18);
                        border-radius: 3px;
                        background-color: rgba(243, 111, 64, 0.1);
                        padding: 6px 15px;
                        font-size: 13px;
                        max-width: 376px;
                        width: 100%;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        white-space: normal;
                      " class="main-container">
            <p style="margin: 0;">Giao hoặc đến lấy tại:</p>
            <p style="font-weight: 500;">
              Chi nhánh 1 - 43 Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1
            </p>
            <span style="font-size: 11px; font-weight: 800; opacity: 0.6; color: #C62828;">
              Chọn cửa hàng gần bạn nhất để tối ưu chi phí giao hàng. Hoặc đến lấy
              hàng.
            </span>
          </div>
        </div>

        <div class="d-flex justify-center my-3">
          <v-divider />
        </div>

        <div v-if="shouldShowBranch1" class="py-2 px-4 d-flex align-center ga-2 main-container localtion-option"
          @click="selectBranch(1)">
          <v-icon small color="#f36f3f">mdi-map-marker-outline</v-icon>
          <div style="font-size: 13px;">
            <div style="font-weight: 600;">Chi nhánh 1</div>
            <div>43 Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1</div>
          </div>
        </div>

        <div v-if="shouldShowBranch1 && shouldShowBranch2" class="d-flex justify-center my-3">
          <v-divider />
        </div>

        <div v-if="shouldShowBranch2" class="py-2 px-4 d-flex align-center ga-2 main-container localtion-option"
          @click="selectBranch(2)">
          <v-icon color="#f36f3f">mdi-map-marker-outline</v-icon>
          <div style="font-size: 13px;">
            <div style="font-weight: 600;">Chi nhánh 2</div>
            <div>42B Trần Huy Liệu, Phường 11, Quận Phú Nhuận</div>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-menu>

</template>

<script lang="ts" setup>

const selectedCity = ref<'default' | 'hcm'>('default')
const selectedDistrict = ref<'default' | 'quan1' | 'pnhuan'>('default')
const shouldShowBranch1 = ref(true)
const shouldShowBranch2 = ref(true)
const selectedLocation = ref('Chi nhánh 1 - 43 Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1')
const selectedCityText = ref('-Chọn Tỉnh/Thành')
const selectedDistrictText = ref('-Chọn Quận/Huyện')

function selectCity(city: 'default' | 'hcm') {
  selectedCity.value = city
  if (city === 'default') {
    selectedCityText.value = '-Chọn Tỉnh/Thành'
    selectedDistrictText.value = '-Chọn Quận/Huyện'
    selectedDistrict.value = 'default'
  } else {
    selectedCityText.value = 'Hồ Chí Minh'
  }
}

function selectDistrict(district: 'default' | 'quan1' | 'pnhuan') {
  selectedDistrict.value = district
  if (district === 'default') {
    selectedDistrictText.value = '-Chọn Quận/Huyện'
    shouldShowBranch1.value = true
    shouldShowBranch2.value = true
  } else if (district === 'quan1') {
    selectedDistrictText.value = 'Quận 1'
    shouldShowBranch1.value = true
    shouldShowBranch2.value = false
  } else {
    selectedDistrictText.value = 'Quận Phú Nhuận'
    shouldShowBranch1.value = false
    shouldShowBranch2.value = true
  }
}

function selectBranch(n: 1 | 2) {
  const addresses: Record<number, string> = {
    1: '43 Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1',
    2: '42B Trần Huy Liệu, Phường 11, Quận Phú Nhuận',
  }
  const fullText = `Chi nhánh ${n} - ${addresses[n]}`
  const words = fullText.split(/\s+/)
  selectedLocation.value =
    words.length > 5 ? words.slice(0, 6).join(' ') + '...' : fullText
}

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