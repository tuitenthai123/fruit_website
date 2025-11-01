<template>
  <div class="settings-page">
    <button class="back-button" @click="goBack">
      <span class="back-arrow">←</span> Quay lại trang chủ
    </button>

    <h1 class="settings-title">Cài đặt</h1>

    <div class="settings-container">
      <!-- Thông tin cá nhân -->
      <section class="settings-section">
        <h2>Thông tin cá nhân</h2>

        <div class="form-group">
          <label>Họ và tên</label>
          <input v-model="profile.fullName" type="text" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="profile.email" type="email" />
        </div>

        <div class="form-group">
          <label>Số điện thoại</label>
          <input v-model="profile.phonenumber" type="text" />
        </div>

        <div class="form-group">
          <label>Ảnh cá nhân</label>
          <div v-if="profile.profilePicture" class="avatar-preview">
            <img :src="profile.profilePicture" alt="Avatar" />
          </div>
        </div>
      </section>

      <!-- Đổi mật khẩu -->
      <section class="settings-section">
        <h2>Bảo mật</h2>
        <div v-if="!showPasswordChange">
          <button class="change-pass-btn" @click="showPasswordChange = true">
            Thay đổi mật khẩu
          </button>
        </div>

        <div v-else>
          <div class="form-group">
            <label>Mật khẩu mới</label>
            <input v-model="security.newPassword" type="password" />
          </div>
          <div class="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input v-model="security.confirmPassword" type="password" />
          </div>

          <div class="button-group">
            <button class="save-button" @click="confirmChangePassword">
              Xác nhận đổi mật khẩu
            </button>
            <button class="reset-button" @click="cancelChangePassword">
              Hủy
            </button>
          </div>
        </div>
      </section>

      <!-- Nút lưu -->
      <div class="button-group">
        <button @click="saveProfile" class="save-button">Lưu thay đổi hồ sơ</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store: any = useFruitStore()

const showPasswordChange = ref(false)

const profile = ref({
  fullName: '',
  email: '',
  phonenumber: '',
  profilePicture: ''
})

const security = ref({
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  if (store.userinfo) {
    profile.value.fullName = store.userinfo.name
    profile.value.email = store.userinfo.email
    profile.value.profilePicture = store.userinfo.avata
    profile.value.phonenumber = store.userinfo.phonenumber
  }
})

const saveProfile = async () => {
  store.userinfo = {
    ...store.userinfo,
    name: profile.value.fullName,
    email: profile.value.email,
    avata: profile.value.profilePicture,
    phonenumber: profile.value.phonenumber
  }

  const user_info_setting = {
    id: store.userinfo.id,
    name: profile.value.fullName,
    email: profile.value.email,
    phonenumber: profile.value.phonenumber
  }
  const abc = await store.userUpdateInfomation(user_info_setting)
  console.log(abc)
  alert('Cập nhật hồ sơ thành công!')
}

const confirmChangePassword = async () => {
  if (security.value.newPassword !== security.value.confirmPassword) {
    alert('Mật khẩu mới không khớp!')
    return
  }

  await store.userSettingChangePassword(security.value.newPassword, store.userinfo.id)
  alert('Đổi mật khẩu thành công!')

  showPasswordChange.value = false
  security.value = { newPassword: '', confirmPassword: '' }
}

const cancelChangePassword = () => {
  showPasswordChange.value = false
  security.value = { newPassword: '', confirmPassword: '' }
}

const goBack = () => router.push('/')
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.settings-title {
  font-size: 2em;
  margin-bottom: 30px;
  color: #333;
}

.settings-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.avatar-preview img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-button,
.reset-button,
.change-pass-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #4CAF50;
  color: white;
}

.reset-button {
  background-color: #f44336;
  color: white;
}

.change-pass-btn {
  background-color: #1976d2;
  color: white;
}

.save-button:hover {
  background-color: #45a049;
}

.reset-button:hover {
  background-color: #da190b;
}

.change-pass-btn:hover {
  background-color: #1256a0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background-color: transparent;
  color: #333;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: large;
  font-weight: 800;
}

.back-arrow {
  font-size: 30px;
  font-weight: 800;
}
</style>
