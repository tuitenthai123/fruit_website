<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <div>
      <v-card>
        <v-container class="d-flex flex-column justify-center align-center">
          <h1 style="color:#f36f3f">
            Xác thực Email
          </h1>
          <div>
            <div style="opacity: 0.8; font-size: 15px; font-weight: 500;">
              <h4>Mã xác thực sẽ được hệ thống gửi thông qua địa chỉ email.</h4>
              <h4>Nhập mã xác thực phía bên dưới!</h4>
            </div>

            <div class="text-center" style="width: 100%;">
              <v-otp-input placeholder="0" v-model="otp" divider="•" length="5" variant="outlined"
                :loading="loading"></v-otp-input>
              <v-btn style="width: 100%;" color="#f36f3f" elevation="2" :disabled="otp.length < 5 || loading"
                class="my-5" text="Submit" @click="handleProcessVerifyOTP()">
                Đăng ký
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
            <div class="d-flex justify-space-between mt-2" style="width: 100%;">
              <div>
                <button style="font-size: 15px; font-weight: 700;">
                  <v-icon> mdi-history</v-icon>
                  Gửi lại mã OTP
                </button>
              </div>
              <div>
                <button style="font-size: 15px; font-weight: 700;">
                  <v-icon>mdi-chevron-left</v-icon>
                  Quay về đăng nhập 
                </button>
              </div>
            </div>
          </div>
        </v-container>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
let otp = ref('0')
let loading = ref(false)
const handleProcessVerifyOTP = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000);
}
</script>
