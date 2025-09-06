<template>
  <v-card class="pa-8 form-card" elevation="6" min-width="400" max-width="1000">
    <div v-if="email_sendding_status === true" class="text-center">
      <h2 class="text-h5 font-weight-bold mb-6">Đã gửi mã xác thực</h2>
      <p>Vui lòng kiểm tra email <strong>{{ email }}</strong> để tiếp tục.</p>
    </div>
    <div v-else>
      <h2 class="text-h5 font-weight-bold mb-6">Quên mật khẩu?</h2>
      <v-text-field variant="outlined" v-model="email" label="Email" placeholder="youremail@example.com"
        prepend-inner-icon="mdi-email-outline" outlined dense hide-details class="mb-6"
        :error="email_sendding_status === false"></v-text-field>
      <v-btn block large color="#f38258" class="reset-btn mb-6" @click="resetPassword(email)">
        Đặt lại mật khẩu
      </v-btn>
      <div class="text-center">
        <span>Bạn chưa có tài khoản? </span>
        <a href="/sign-up" class="sign-up-link">Đăng ký tại đây</a>
      </div>
    </div>
    <v-snackbar v-model="showSnackbar" :color=snackColor timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref } from "vue"

const store = useFruitStore()

const email = ref("")
const email_sendding_status = ref(null)
const showSnackbar = ref(false)
const snackbarMessage = ref("")
const snackColor = ref("")

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const resetPassword = async (email) => {
  if (!email) {
    snackColor.value="red"
    snackbarMessage.value = "Vui lòng nhập email"
    showSnackbar.value = true
    email_sendding_status.value = false
    return
  }

  if (!validateEmail(email)) {
    snackColor.value="red"
    snackbarMessage.value = "Email không hợp lệ"
    showSnackbar.value = true
    email_sendding_status.value = false
    return
  }

  try {
    await callOnce(async () => {
      const response_renew = await store.renewEmailPassword(email)
      email_sendding_status.value = response_renew
      console.log("meomeo")
    })
    if (email_sendding_status.value) {
      snackColor.value="green"
      snackbarMessage.value = "Hệ thống hỗ trợ của chúng tôi đã gửi gmail hãy kiểm tra hộp thư để đặt lại mật khẩu"
      showSnackbar.value = true
    }
  } catch (error) {
    console.error('Error:', error)
    snackColor.value="red"
    email_sendding_status.value = false
    snackbarMessage.value = "Không thể gửi email. Vui lòng kiểm tra hoặc liên hệ quản trị viên."
    showSnackbar.value = true
  }
}
</script>

<style scoped>
.form-card {
  border-radius: 16px;
}

.reset-btn {
  font-weight: bold;
  font-size: 16px;
  border-radius: 12px;
  padding: 12px;
}

.sign-up-link {
  color: #f38258;
  font-weight: 600;
  text-decoration: none;
}

.sign-up-link:hover {
  text-decoration: underline;
}
</style>
