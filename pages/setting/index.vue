<template>
  <div class="settings-page">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
    </div>

    <button class="back-button" @click="goBack">
      <span class="back-arrow">←</span> Trở về trang chủ
    </button>
    <h1 class="settings-title">Thiết lập người dùng</h1>

    <div class="settings-container">
      <!-- Profile Section -->
      <section class="settings-section">
        <h2>Thông tin cá nhân</h2>
        <div class="d-flex justify-center ga-4">
          <div class="form-group">
            <label>Họ</label>
            <input v-model="profile.ho" type="text" />
          </div>

          <div class="form-group">
            <label>Tên</label>
            <input v-model="profile.ten" type="text" />
          </div>
        </div>


        <div class="form-group">
          <label>Email</label>
          <input v-model="profile.email" type="email" />
        </div>
        <div class="form-group">
          <label>Profile Picture</label>
          <div style="position: relative;">
            <img width="200" height="200" style="border-radius: 50%;"
              :src="profile.profilePicture+''"
              alt="">
            <div
              style="position: absolute; padding: 2px 1px; left: 0; bottom: 0; margin-left: 2px; margin-bottom: 2px;">
              <div class="avatar-edit">
                <input type="file" id="avatar-input" @change="handleImageUpload" accept="image/*"
                  class="hidden-input" />

                <label for="avatar-input" class="upload-button">
                  <v-icon>mdi-pen</v-icon> Chỉnh sửa
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Notification Settings -->
      <section class="settings-section">
        <h2>Notifications</h2>
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="notifications.email" />
            Email Notifications
          </label>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="notifications.push" />
            Push Notifications
          </label>
        </div>
      </section>

      <!-- Security Settings -->
      <section class="settings-section">
        <h2>Security</h2>
        <div class="form-group">
          <label>Current Password</label>
          <input v-model="security.currentPassword" type="password" />
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input v-model="security.newPassword" type="password" />
        </div>
        <div class="form-group">
          <label>Confirm New Password</label>
          <input v-model="security.confirmPassword" type="password" />
        </div>
      </section>

      <div class="settings-section">
        <h2>connected</h2>
        <ul class="menthod-connected">
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>


      <div class="button-group">
        <button @click="saveSettings" class="save-button">Save Changes</button>
        <button @click="resetSettings" class="reset-button">Reset</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const router = useRouter()
const store = useFruitStore()

const ten = ref('')
const ho = ref('')
const loading = ref(false)
const preview = ref<string | null>(null)

const profile = ref({
  ten: '',
  ho: '',
  fullName: '',
  email: '',
  profilePicture: null as string | null
})

const notifications = ref({
  email: false,
  push: false
})

const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  const userdata = store?.userinfo as any
  profile.value = {
    ho: userdata?.name.slice(0,userdata?.name.length / 2),
    ten: userdata?.name.slice(userdata?.name.length / 2,userdata?.name.length),
    fullName: userdata?.name,
    email:userdata?.email,
    profilePicture:userdata?.avata
  }

})

const handleImageUpload = async (event: Event) => {
  loading.value = true
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    showError('File size must be less than 2MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }
  try {
    preview.value = URL.createObjectURL(file)
    let base64 = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(file)
    })
    await store.updateAvataUser((store.userinfo as any)?.id, base64 as string)
    loading.value = false
  } catch (error) {
    showError('Failed to upload avatar. Please try again.')
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  try {
    if (security.value.newPassword !== security.value.confirmPassword) {
      alert('New passwords do not match!')
      return
    }

    console.log('Saving settings...', {
      profile: profile.value,
      notifications: notifications.value,
      security: security.value
    })

    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings')
  }
}

const resetSettings = () => {
  profile.value = {
    ten: '',
    ho: '',
    fullName: '',
    email: '',
    profilePicture: null
  }
  notifications.value = {
    email: false,
    push: false
  }
  security.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const goBack = () => {
  router.push('/')
}
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

.settings-section h2 {
  color: #444;
  margin-bottom: 20px;
}

.form-group {
  width: 100%;
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-button,
.reset-button {
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

.save-button:hover {
  background-color: #45a049;
}

.reset-button:hover {
  background-color: #da190b;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  background-color: transparent;
  color: #333;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s;
  font-size: large;
  font-weight: 800;
}

.back-arrow {
  font-size: 30px;
  font-weight: 800;
}

.menthod-connected {
  list-style-type: none;
  border: 1px solid;
  border-color: #CFCFD0FF;
  border-radius: 8px;
}

.menthod-connected>li {
  border-top: 1px solid #CFCFD0FF;
  padding: 10px;
  margin-top: 2px;
}

.menthod-connected>li:first-of-type {
  border-color: rgba(0, 0, 0, 0);
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #CFCFD0FF;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  display: flex;
  justify-content: center;
}

.hidden-input {
  display: none;
}

.upload-button {
  padding: 6px 5px;
  border: 1px solid;
  border-color: #CFCFD0FF;
  /* ✅ đúng */
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-button:hover {
  background-color: lightslategray;
  color: white
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #4CAF50;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>