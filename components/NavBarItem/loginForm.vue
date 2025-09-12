<template>
  <v-card width="320">
    <v-container class="pa-4">
      <div style="position: relative; text-align: center;" class="py-2 mb-3">
        <p style="color: #f36f40; font-weight: 600; margin: 0;">ĐĂNG NHẬP TÀI KHOẢN</p>
        <span style="font-size: 14px; color: rgb(103, 114, 121);">Nhập email và mật khẩu của bạn:</span>
      </div>

      <v-divider class="mb-4" />

      <v-form @submit.prevent="userLogin()">
        <v-text-field v-model="data_login.email" label="Email" type="email" variant="outlined" density="compact"
          prepend-inner-icon="mdi-email-outline" class="mb-3" :rules="[rules.email]" />

        <v-text-field v-model="data_login.password" label="Mật khẩu" type="password" variant="outlined"
          density="compact" prepend-inner-icon="mdi-lock-outline" class="mb-3" />

        <div class="d-flex justify-end align-end mb-4">
          <a href="/forgotpass" style="color: #f36f40; text-decoration: none; font-size: 14px;">
            Quên mật khẩu?
          </a>
        </div>

        <v-btn color="#f36f40" variant="flat" block size="large" class="mb-3" type="submit">
          Đăng nhập
        </v-btn>

        <v-divider class="mb-3">
          <span style="color: rgb(103, 114, 121); font-size: 12px;">HOẶC</span>
        </v-divider>

        <div style="text-align: center; ">
          <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError" class="mb-3">
          </GoogleSignInButton>
        </div>

        <div class="text-center">
          <span style="font-size: 14px; color: rgb(103, 114, 121);">
            Chưa có tài khoản?
            <a href="/sign-up" style="color: #f36f40; text-decoration: none;">
              Đăng ký ngay
            </a>
          </span>
        </div>
      </v-form>
    </v-container>
    <v-snackbar :color="color_tost" v-model="toast_status" :timeout="3000">
      {{ toast_text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="toast_status = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>

</template>

<script lang="ts" setup>
import { sleep } from "~/lib/sleep"
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";

interface LoginData {
  email: string
  password: string
}


const rules = {
  email: (value: any) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Không chuẩn định dạng'
  },
}


const store = useFruitStore()
const router = useRouter()
let toast_status = ref(false)
let toast_text = ref('')
let color_tost = ref('')
const data_login = reactive<LoginData>(
  {
    email: "",
    password: ""
  }
)
async function userLogin() {
  const response = await store.checkLoginData(data_login as any)
  if (!response) {
    toast_text.value = "sai thông tin đăng nhập vui lòng kiểm tra lại!"
    toast_status.value = true
    color_tost.value = "error"
  } else {
    toast_text.value = "Đăng nhập thành công!"
    toast_status.value = true
    color_tost.value = "success"
    await sleep(3000)
    switchRouter(response.role)
  }
}

const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
  const status_login_google = await store.verifyToken(`${credential}`)
  if ("user_id" in status_login_google) {
    router.push(`/login/${status_login_google.user_id}`)
  } else if (status_login_google.password === null) {
    router.push(`/login/${status_login_google.id}`)
  } else {
    switchRouter(status_login_google.role)
  }
};

const handleLoginError = () => {
  toast_text.value = "Đăng nhập thất bại!"
  toast_status.value = true
  color_tost.value = "error"
};

const switchRouter = (data: any) => {
  switch (data) {
    case '0':
      router.push("/admin")
      break;
    case '1':
      router.push("/manage")
      break;
    case '2':
      router.push("/user")
      break;
  }
}
</script>