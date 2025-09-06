    <template>
        <Navbar />
        <v-container class="error-page">
            <h1>
                <span
                    style="font-size: 170px; color: white; font-weight: 700; text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.15);;">
                    {{error.statusCode}}
                </span>
            </h1>
            <p class="message-txt">Trang bạn đang tìm kiếm hiện tại không tồn tại hoặc đã bị xóa vui lòng quay lại trang chủ hoặc liên hệ
                quản trị viên để được hỗ trợ</p>
            <button class="btn-error mt-5" @click="handleClearError">Quay về trang chủ</button>
        </v-container>
        <div style="font-family: 'Quicksand', sans-serif;">
            <Footer />
        </div>

    </template>

<script setup>
const props = defineProps(['error'])

const handleClearError = () => {
    clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
    font-family: 'Quicksand', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.message-txt {
    color: #f36f3f;
    font-weight: 500;
    font-size: 17px;
}

.btn-error {
    background-color: #f36f3f;
    border-radius: 5px;
    padding: 10px;
    color: white;
}
</style>