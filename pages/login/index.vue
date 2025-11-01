<template>
  <v-container class="pt-16">
    <v-row>
      <v-col cols="12" sm="6">
        <v-form validate-on="submit lazy" @submit.prevent="handleLogin">
          <v-container class="d-flex flex-column justify-center align-center sign-up-card-container">
            <h1>Đăng nhập</h1>
            <div class="px-6" style="width: 100%;">
              <span class="title-text-field">Địa chỉ Email</span>
              <v-text-field v-model="email" placeholder="test@gmail.com" :rules="[rules.required, rules.email]"
                variant="underlined" :loading="loading_status" required :disabled="loading_status"></v-text-field>
            </div>
            <div class="px-6" style="width: 100%;">
              <span class="title-text-field">Mật khẩu</span>
              <v-text-field placeholder="*********" variant="underlined"
                :append-inner-icon="showpassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                :type="showpassword ? 'text' : 'password'" :rules="[rules.required]"
                @click:append-inner="handleshowandhidepassword()" v-model="password" :loading="loading_status"
                :disabled="loading_status"></v-text-field>
            </div>
            <div style="width: 100%; display: flex; justify-content: center;" class="pr-5 py-10 ">
              <v-btn color="#f36f3f" elevation="2" type="submit" :loading="loading_status">
                Đăng nhập
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-container>
        </v-form>
      </v-col>
      <v-col class="d-none d-sm-block" sm="6">
        <h1>Chào mừng trở lại</h1>
        <h2 class="mb-2">Người bạn đồng hành trái cây tươi mỗi ngày đang chờ bạn!! 🍊</h2>
        <p>Hãy đăng nhập để khám phá hàng trăm loại trái cây tươi ngon, giá tốt cùng ưu đãi mỗi ngày!</p>
        <p class="my-2">Nếu bạn chưa có tài khoản, đừng ngần ngại nhấn Đăng ký phía dưới để bắt đầu hành trình dinh
          dưỡng ngay hôm nay nhé!</p>
        <button style="font-size: 15px; font-weight: 700;" class="mt-2" @click="handleNavigatoSignUp">
          Đăng ký
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

const store = useFruitStore() as any
const router = useRouter()
let showpassword = ref(false)
let toast_status = ref(false)
let loading_status = ref(false)
let toast_text = ref('')
let color_tost = ref('')
let email = ref('')
let password = ref('')
const rules = {
  required: (value: any) => !!value || 'Không được bỏ trống.',
  counter: (value: any) => {
    if (!value) return true
    return value.length === 10  || 'Số điện thoại di động có 10 số'
  },
  email: (value: any) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Không chuẩn định dạng'
  },
}

const handleshowandhidepassword = () => {
  showpassword.value = !showpassword.value
}

const handleNavigatoSignUp = () => {
  router.push("/sign-up")
}

async function handleLogin(event: any) {
  loading_status.value = true
  const results = await event // lỗi hiển thị chỗ này
  //alert(JSON.stringify(results, null, 2))
  if (!results?.valid && results?.errors[0]?.errorMessages) {
    toast_text.value = results?.errors[0]?.errorMessages.length > 1 ? "Lỗi thông tin đăng nhập vui lòng kiểm tra lại!" : results?.errors[0]?.errorMessages[0]
    toast_status.value = true
    color_tost.value = "error"
    loading_status.value = false
  } else {
    let user_info = {
      email: email.value,
      password: password.value
    }
    const reponse_login = await store.checkLoginData(user_info)
    if (!reponse_login) {
      toast_text.value = "sai thông tin đăng nhập vui lòng kiểm tra lại!"
      toast_status.value = true
      color_tost.value = "error"
      loading_status.value = false
    } else {
      toast_text.value = "Đăng nhập thành công!"
      toast_status.value = true
      color_tost.value = "success"
      await sleep(3000)
      switch (reponse_login.role) {
        case '0':
          router.push("/admin")
          break;
        case '1':
          router.push("/manage")
          break;
        case '2':
          router.push("/")
          break;
      }
    }
    loading_status.value = false
  }
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