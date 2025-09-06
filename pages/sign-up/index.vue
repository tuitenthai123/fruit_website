<template>
  <v-container>
    <v-row>
      <v-col class="d-none d-sm-block" sm="6">
        <h1>Xin chào</h1>
        <h2 class="mb-2">Người bạn đồng hành trái cây đã đến rồi đây! 🍊</h2>
        <p>Hãy tận hưởng những loại trái cây tươi ngon nhất mỗi ngày!</p>
        <p>Chúng tôi mang đến trải nghiệm mua sắm đơn giản, tiện lợi và thú vị.</p>
        <p class="my-2">Ấn vào đăng nhập phía bên dưới nếu bạn đã có tài khoản nhé!</p>
        <button style="font-size: 15px; font-weight: 700;" class="mt-2" @click="handleNavigatoLogin">
          Đăng nhập
          <v-icon>mdi-chevron-right</v-icon>
        </button>
        <div style="display: flex; justify-content: flex-end;">
          <div>
            <v-img width="auto" aspect-ratio="1/1" cover
              src="@/assets/vecteezy_cloud-computing-modern-flat-concept-for-web-banner-design_5879539-removebg-preview.png"></v-img>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6">
        <v-form ref="formRef" v-model="isValid" @submit.prevent="submitSignUp"
          class="d-flex flex-column justify-center align-center sign-up-card-container">
          <h1>Đăng ký</h1>

          <div class="d-flex ga-5 px-6 justify-space-between" style="width: 100%;">
            <div style="width: 100%;">
              <span class="title-text-field">Họ và tên đệm</span>
              <v-text-field v-model="form.hoVaTenDem" placeholder="Họ và tên đệm" variant="underlined"
                :rules="[rules.required]" />
            </div>

            <div style="width: 100%;">
              <span class="title-text-field">Tên</span>
              <v-text-field v-model="form.ten" placeholder="Tên" variant="underlined" :rules="[rules.required]" />
            </div>
          </div>

          <div class="px-6" style="width: 100%;">
            <span class="title-text-field">Địa chỉ Email</span>
            <v-text-field v-model="form.email" placeholder="test@gmail.com" :rules="[rules.required, rules.email]"
              variant="underlined" type="email" required />
          </div>

          <div class="px-6" style="width: 100%;">
            <span class="title-text-field">Số điện thoại</span>
            <v-text-field v-model="form.phone" placeholder="0123456789 (Optional)" variant="underlined" type="number"
              :rules="[rules.counter]" />
          </div>

          <div class="px-6" style="width: 100%;">
            <span class="title-text-field">Mật khẩu</span>
            <v-text-field v-model="form.password" placeholder="*********" variant="underlined"
              :append-inner-icon="showpassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
              :type="showpassword ? 'text' : 'password'" :rules="[rules.required]"
              @click:append-inner="handleshowandhidepassword" />
          </div>

          <div style="width: 100%; display: flex; justify-content: flex-end;" class="pr-5 py-10 ">
            <v-btn color="#f36f3f" elevation="2" type="submit" :loading="isLoading" :disabled="isLoading"
              class="button-sign-up">
              Đăng ký
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </v-form>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { sleep } from '~/lib/sleep'

const router = useRouter()
const store = useFruitStore()

const form = reactive({
  hoVaTenDem: '',
  ten: '',
  email: '',
  phone: '',
  password: ''
})
let toast_text = ref('')
let color_tost = ref('')
let toast_status = ref(false)
const formRef = ref<any>(null)
const isValid = ref(false)
const isLoading = ref(false)
const showpassword = ref(false)

const rules = {
  required: (value: any) => !!value || 'Không được bỏ trống.',
  counter: (value: any) => {
    if (!value) return true // optional
    return (String(value).length <= 11) || 'Số điện thoại tối đa 11 số'
  },
  email: (value: any) => {
    if (!value) return 'Không được bỏ trống.'
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Email không hợp lệ.'
  },
}

const handleshowandhidepassword = () => {
  showpassword.value = !showpassword.value
}

const handleNavigatoLogin = () => {
  router.push('/login')
}


const submitSignUp = async () => {
  const valid = await formRef.value?.validate?.()
  if (!valid?.valid) {
    return
  }

  isLoading.value = true
  try {


    const status_signup = await store.signUp({
      hoVaTenDem: form.hoVaTenDem,
      ten: form.ten,
      email: form.email,
      phone: form.phone,
      password: form.password
    })

    switch (status_signup) {
      case true:
        toast_text.value = "Đăng ký thành công bây giờ bạn có thể đăng nhập!"
        color_tost.value = "success"
        toast_status.value = true
        await sleep(4000)
        router.push("/login")
        break;
      case false:
        toast_text.value = "Lỗi thông tin đăng ký vui lòng kiểm tra lại hoặc liên hệ quản trị viên!"
        color_tost.value = "error"
        toast_status.value = true
        break;
      case "email_exist":
        toast_text.value = "Địa chỉ email của bạn đã đăng ký tài khoản trước đó vui lòng kiểm tra lại!"
        color_tost.value = "error"
        toast_status.value = true
        break;
      case "phone_exist":
        toast_text.value = "Số điện thoại của bạn đã đăng ký tài khoản trước đó vui lòng kiểm tra lại!"
        color_tost.value = "error"
        toast_status.value = true
        break;
    }

    form.hoVaTenDem = ''
    form.ten = ''
    form.email = ''
    form.phone = ''
    form.password = ''
    isValid.value = false
    formRef.value?.reset?.()
  } catch (err) {
    toast_text.value = "Lỗi thông tin đăng ký vui lòng kiểm tra lại hoặc liên hệ quản trị viên!"
    color_tost.value = "error"
    toast_status.value = true
  } finally {
    isLoading.value = false
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
