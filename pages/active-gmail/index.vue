<template>
  <v-container class="settings-page">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="settings-card" elevation="8">
          <v-card-title class="settings-header">
            <v-icon left color="primary">mdi-account-cog</v-icon>
            Cài đặt tài khoản
          </v-card-title>
          
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <!-- Avatar Section -->
              <div class="avatar-section">
                <v-avatar size="120" class="avatar-upload">
                  <v-img :src="userInfo.avata || '/default-avatar.png'" alt="Avatar">
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-icon size="60" color="grey lighten-1">mdi-account</v-icon>
                      </v-row>
                    </template>
                  </v-img>
                  <v-btn 
                    icon 
                    small 
                    class="avatar-edit-btn"
                    @click="$refs.avatarInput.click()"
                  >
                    <v-icon small>mdi-camera</v-icon>
                  </v-btn>
                </v-avatar>
                <input 
                  ref="avatarInput"
                  type="file" 
                  accept="image/*" 
                  style="display: none"
                  @change="handleAvatarChange"
                >
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Personal Information -->
              <h3 class="section-title">Thông tin cá nhân</h3>
              
              <v-text-field
                v-model="userInfo.name"
                label="Họ và tên"
                prepend-icon="mdi-account"
                :rules="nameRules"
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="userInfo.email"
                label="Email"
                prepend-icon="mdi-email"
                :rules="emailRules"
                outlined
                dense
                type="email"
              ></v-text-field>

              <v-text-field
                v-model="userInfo.phonenumber"
                label="Số điện thoại"
                prepend-icon="mdi-phone"
                :rules="phoneRules"
                outlined
                dense
              ></v-text-field>

              <v-divider class="my-6"></v-divider>

              <!-- Password Change -->
              <h3 class="section-title">Đổi mật khẩu</h3>
              
              <v-text-field
                v-model="passwordData.currentPassword"
                label="Mật khẩu hiện tại"
                prepend-icon="mdi-lock"
                :type="showCurrentPassword ? 'text' : 'password'"
                :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showCurrentPassword = !showCurrentPassword"
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="passwordData.newPassword"
                label="Mật khẩu mới"
                prepend-icon="mdi-lock-outline"
                :type="showNewPassword ? 'text' : 'password'"
                :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showNewPassword = !showNewPassword"
                :rules="passwordRules"
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="passwordData.confirmPassword"
                label="Xác nhận mật khẩu mới"
                prepend-icon="mdi-lock-check"
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showConfirmPassword = !showConfirmPassword"
                :rules="confirmPasswordRules"
                outlined
                dense
              ></v-text-field>

              <v-divider class="my-6"></v-divider>

              <!-- Account Status -->
              <h3 class="section-title">Trạng thái tài khoản</h3>
              
              <v-row>
                <v-col cols="6">
                  <v-chip 
                    :color="userInfo.active ? 'success' : 'error'"
                    text-color="white"
                    small
                  >
                    <v-icon left small>
                      {{ userInfo.active ? 'mdi-check-circle' : 'mdi-close-circle' }}
                    </v-icon>
                    {{ userInfo.active ? 'Đang hoạt động' : 'Không hoạt động' }}
                  </v-chip>
                </v-col>
                <v-col cols="6">
                  <v-chip 
                    :color="userInfo.role === 1 ? 'primary' : 'secondary'"
                    text-color="white"
                    small
                  >
                    <v-icon left small>mdi-account-star</v-icon>
                    {{ userInfo.role === 1 ? 'Admin' : 'User' }}
                  </v-chip>
                </v-col>
              </v-row>

              <v-row class="mt-4">
                <v-col cols="12">
                  <v-text-field
                    :value="formatDate(userInfo.createdAt)"
                    label="Ngày tạo tài khoản"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="px-6 pb-6">
            <v-spacer></v-spacer>
            <v-btn 
              color="grey" 
              text 
              @click="resetForm"
            >
              <v-icon left>mdi-refresh</v-icon>
              Đặt lại
            </v-btn>
            <v-btn 
              color="primary" 
              :disabled="!valid"
              :loading="loading"
              @click="saveSettings"
            >
              <v-icon left>mdi-content-save</v-icon>
              Lưu thay đổi
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      top
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          Đóng
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Sample user data based on Users.json structure
const userInfo = reactive({
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phonenumber: "0123456789",
  role: 1,
  avata: "https://via.placeholder.com/150",
  active: true,
  status: 1,
  createdAt: "2024-01-15T08:30:00.000Z",
  updatedAt: "2024-01-20T10:15:00.000Z",
  expiredDate: "2025-01-15T08:30:00.000Z"
})

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const valid = ref(false)
const loading = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Validation rules
const nameRules = [
  v => !!v || 'Tên là bắt buộc',
  v => v.length >= 2 || 'Tên phải có ít nhất 2 ký tự'
]

const emailRules = [
  v => !!v || 'Email là bắt buộc',
  v => /.+@.+\..+/.test(v) || 'Email không hợp lệ'
]

const phoneRules = [
  v => !v || /^[0-9]{10,11}$/.test(v) || 'Số điện thoại không hợp lệ'
]

const passwordRules = [
  v => !v || v.length >= 6 || 'Mật khẩu phải có ít nhất 6 ký tự'
]

const confirmPasswordRules = computed(() => [
  v => !v || v === passwordData.newPassword || 'Mật khẩu xác nhận không khớp'
])

// Methods
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userInfo.avata = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const resetForm = () => {
  // Reset to original values
  Object.assign(passwordData, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
}

const saveSettings = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update timestamp
    userInfo.updatedAt = new Date().toISOString()
    
    // Clear password fields
    Object.assign(passwordData, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    snackbar.message = 'Cài đặt đã được lưu thành công!'
    snackbar.color = 'success'
    snackbar.show = true
    
  } catch (error) {
    snackbar.message = 'Có lỗi xảy ra khi lưu cài đặt!'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.settings-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.settings-card {
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.settings-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 24px;
  border-radius: 16px 16px 0 0 !important;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  position: relative;
}

.avatar-upload {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-upload:hover {
  transform: scale(1.05);
}

.avatar-edit-btn {
  position: absolute !important;
  bottom: 0;
  right: 0;
  background: #667eea !important;
  color: white !important;
}

.section-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 1.2rem;
}

.v-text-field {
  margin-bottom: 8px;
}

.v-card-actions {
  background: rgba(102, 126, 234, 0.05);
}

.v-btn {
  text-transform: none !important;
  font-weight: 500;
}
</style>