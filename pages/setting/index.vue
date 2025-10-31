<template>
  <div class="settings-page">
    <button class="back-button" @click="goBack">
      <span class="back-arrow">←</span> Back to Home
    </button>
    <h1 class="settings-title">Settings</h1>
    
    <div class="settings-container">
      <section class="settings-section">
        <h2>Profile Settings</h2>
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="profile.fullName" type="text" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="profile.email" type="email" />
        </div>
        <div class="form-group">
          <label>Profile Picture</label>
          <input type="file" @change="handleImageUpload" accept="image/*" />
        </div>
      </section>

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

const profile = ref({
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

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    profile.value.profilePicture = `${file}`
  }
}

const saveSettings = async () => {
  try {
    if (security.value.newPassword !== security.value.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings')
  }
}

const resetSettings = () => {
  profile.value = {
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.save-button, .reset-button {
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
</style>