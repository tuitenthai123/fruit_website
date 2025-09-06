<template>
  <v-container class="pt-16">
    <v-row>
      <v-col cols="12" sm="6">
        <v-form validate-on="submit lazy" @submit.prevent="handleConfirmPassword" :disabled="loading_status">
          <v-container class="d-flex flex-column justify-center align-center sign-up-card-container">
            <h1>Tạo mật khẩu mới</h1>
            <div class="px-6" style="width: 100%;">
              <span class="title-text-field">Mật khẩu mới</span>
              <v-text-field placeholder="*********" variant="underlined" :type="showpassword ? 'text' : 'password'"
                :rules="[rules.required]" required v-model="password" :loading="loading_status"
                :disabled="loading_status"></v-text-field>
            </div>
            <div class="px-6" style="width: 100%;">
              <span class="title-text-field">Nhập lại mật khẩu</span>
              <v-text-field placeholder="*********" variant="underlined" :type="showpassword ? 'text' : 'password'"
                :rules="[rules.required]" required v-model="confirm_password" :loading="loading_status"
                :disabled="loading_status"></v-text-field>
            </div>
            <div style="width: 100%;">
              <div style="text-align: end;">
                <v-checkbox label="Hiển thị mật khẩu" v-model="showpassword"></v-checkbox>
              </div>
            </div>
            <div style="width: 100%; display: flex; justify-content: center;" class="pr-5 py-10 ">
              <v-btn color="#f36f3f" elevation="2" type="submit" :loading="loading_status">
                Xác thực mật khẩu
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-container>
        </v-form>
      </v-col>
      <v-col class="d-none d-sm-block" sm="6">
        <h1>Chào mừng bạn quay lại!</h1>
        <h2 class="mb-2">Tạo mật khẩu mới để đăng nhập nhanh không bỏ lỡ các ưu đãi hằng ngày 🍇</h2>
        <p>Hãy đặt lại mật khẩu để tiếp tục khám phá thế giới trái cây tươi ngon, giàu dinh dưỡng đang chờ bạn.</p>
        <p class="my-2">Chỉ vài giây nữa thôi, bạn sẽ lại được tận hưởng ưu đãi đặc biệt và những loại trái cây tuyệt
          hảo nhất!</p>
        <button style="font-size: 15px; font-weight: 700;" class="mt-2" @click="handleNavigatoSignUp">
          Quay lại đăng nhập
          <v-icon>mdi-chevron-right</v-icon>
        </button>
        <div style="display: flex; justify-content: center;">
          <div>
            <v-img width="300" aspect-ratio="1/1" cover
              src="@/assets/vecteezy_business-data-protection-and-network-security-isometric_48783384.png"></v-img>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-snackbar :color="color_tost" v-model="toast_status" :timeout="3000">
      {{ toast_text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="toast_status = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { sleep } from '~/lib/sleep'


definePageMeta({
  middleware: ["google-new-password"]
})

const store = useFruitStore() as any
const route = useRoute()
const router = useRouter()
let showpassword = ref(false)
let toast_status = ref(false)
let loading_status = ref(false)
let toast_text = ref('')
let color_tost = ref('')
let confirm_password = ref('')
let password = ref('')
const rules = {
  required: (value: any) => !!value || 'Không được bỏ trống.',
  email: (value: any) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Không chuẩn định dạng'
  },
}

const handleConfirmPassword = async () => {
  try {
    loading_status.value = true

    if (!confirm_password.value || !password.value) {
      handleMakeToast("Vui lòng nhập đầy đủ mật khẩu và xác nhận mật khẩu", "error")
      return
    }

    if (password.value.length < 6) {
      handleMakeToast("Mật khẩu phải có ít nhất 6 ký tự", "error")
      return
    }

    if (confirm_password.value === password.value) {
      const user_id = route.params.id_user_renew_pass
      const status_renewpassword = await store.confirmPassword(password?.value, user_id)
      if (status_renewpassword) {
        handleMakeToast("Tạo mật khẩu thành công!", "success")
        await sleep(2000)
        await store.clearExpiredDate(user_id as string)
        return router.push("/login")
      }
      handleMakeToast("Có lỗi xảy ra, vui lòng thử lại!", "error")
    } else {
      handleMakeToast("Mật khẩu không khớp", "error")
    }
  } catch (error) {
    handleMakeToast("Lỗi hệ thống, vui lòng thử lại sau!", "error")
  } finally {
    loading_status.value = false
  }
}

const handleMakeToast = (title: string, color: string) => {
  toast_text.value = title
  toast_status.value = true
  color_tost.value = color
}

const handleNavigatoSignUp = () => {
  router.push("/login")
}


</script>



<style scoped>
h1,
h2 {
  color: #f36f3f;
}

p {
  opacity: 0.4;
  font-weight: 600;
}

.sign-up-card-container {
  border: 1px solid #F39A79FF;
  border-radius: 10px;
}

.sign-up-card-container>h1 {
  font-weight: 800;
  color: black;
  padding: 15px 0px;
}

.sign-up-card-container .title-text-field {
  font-weight: 700;
}

.button-sign-up {
  font-size: 17px;
  font-weight: 700;
  color: white;
}
</style>